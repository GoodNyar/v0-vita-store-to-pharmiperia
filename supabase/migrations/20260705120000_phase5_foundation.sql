-- Phase 5: catalog foundation (variants, PIM staging, inventory reservations, search facets)

-- ── Product variants (parent product → sellable SKUs) ───────────────────────
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  slug_suffix TEXT,
  name_ru TEXT,
  name_lv TEXT,
  price_cents INTEGER,
  original_price_cents INTEGER,
  currency TEXT NOT NULL DEFAULT 'EUR',
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  attributes JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX product_variants_product_id_idx ON product_variants(product_id);
CREATE UNIQUE INDEX product_variants_one_default_per_product
  ON product_variants(product_id) WHERE is_default = TRUE;

-- ── Mini-PIM feed staging ───────────────────────────────────────────────────
CREATE TABLE feed_import_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  row_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE feed_import_rows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES feed_import_batches(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  validation_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (validation_status IN ('pending', 'valid', 'invalid', 'published')),
  validation_errors JSONB,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (batch_id, external_id)
);

CREATE INDEX feed_import_rows_batch_id_idx ON feed_import_rows(batch_id);

-- ── Inventory reservations (hold stock between draft and payment) ─────────────
CREATE TABLE inventory_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 99),
  expires_at TIMESTAMPTZ NOT NULL,
  released_at TIMESTAMPTZ,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (order_id, product_id)
);

CREATE INDEX inventory_reservations_order_id_idx ON inventory_reservations(order_id);
CREATE INDEX inventory_reservations_active_idx
  ON inventory_reservations(product_id, expires_at)
  WHERE released_at IS NULL AND consumed_at IS NULL;

-- Keyset pagination index
CREATE INDEX products_active_created_id_idx
  ON products(created_at DESC, id DESC)
  WHERE is_active = TRUE;

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_import_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_variants_public_read" ON product_variants
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "product_variants_admin_all" ON product_variants
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "feed_import_admin_all" ON feed_import_batches
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "feed_import_rows_admin_all" ON feed_import_rows
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "inventory_reservations_admin_all" ON inventory_reservations
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Reserve stock for a pending order (idempotent per order+product)
CREATE OR REPLACE FUNCTION public.reserve_inventory_for_order(
  p_order_id UUID,
  p_ttl_minutes INTEGER DEFAULT 30
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r RECORD;
  v_available INTEGER;
  v_expires TIMESTAMPTZ;
BEGIN
  v_expires := NOW() + (GREATEST(5, LEAST(COALESCE(p_ttl_minutes, 30), 120)) || ' minutes')::INTERVAL;

  IF NOT EXISTS (
    SELECT 1 FROM orders WHERE id = p_order_id AND payment_status = 'pending'
  ) THEN
    RETURN FALSE;
  END IF;

  FOR r IN
    SELECT product_id, quantity
    FROM order_items
    WHERE order_id = p_order_id AND product_id IS NOT NULL
  LOOP
    SELECT stock_quantity - COALESCE((
      SELECT SUM(ir.quantity)
      FROM inventory_reservations ir
      WHERE ir.product_id = r.product_id
        AND ir.released_at IS NULL
        AND ir.consumed_at IS NULL
        AND ir.expires_at > NOW()
        AND ir.order_id <> p_order_id
    ), 0)
    INTO v_available
    FROM products
    WHERE id = r.product_id
    FOR UPDATE;

    IF NOT FOUND OR v_available < r.quantity THEN
      RAISE EXCEPTION 'Insufficient stock to reserve for product %', r.product_id;
    END IF;

    INSERT INTO inventory_reservations (order_id, product_id, quantity, expires_at)
    VALUES (p_order_id, r.product_id, r.quantity, v_expires)
    ON CONFLICT (order_id, product_id) DO UPDATE
      SET quantity = EXCLUDED.quantity,
          expires_at = EXCLUDED.expires_at,
          released_at = NULL,
          consumed_at = NULL;
  END LOOP;

  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.release_inventory_reservation(p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE inventory_reservations
  SET released_at = NOW()
  WHERE order_id = p_order_id
    AND released_at IS NULL
    AND consumed_at IS NULL;

  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.reserve_inventory_for_order(UUID, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_inventory_reservation(UUID) TO service_role;

-- SQL facet aggregation over full vector match set (not limited to page size)
CREATE OR REPLACE FUNCTION public.search_product_facets_vector(p_query TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH matched AS (
    SELECT p.id, p.brand_id, p.category_id, p.price_cents, p.original_price_cents
    FROM products p
    WHERE p.is_active = TRUE
      AND p.search_vector @@ plainto_tsquery('simple', p_query)
  ),
  brand_counts AS (
    SELECT b.name AS value, COUNT(*)::INTEGER AS cnt
    FROM matched m
    JOIN brands b ON b.id = m.brand_id
    GROUP BY b.name
  ),
  category_counts AS (
    SELECT c.slug AS value, COUNT(*)::INTEGER AS cnt
    FROM matched m
    JOIN categories c ON c.id = m.category_id
    GROUP BY c.slug
  ),
  on_sale AS (
    SELECT COUNT(*)::INTEGER AS cnt
    FROM matched
    WHERE original_price_cents IS NOT NULL
      AND original_price_cents > price_cents
  )
  SELECT jsonb_build_object(
    'brands', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('value', value, 'count', cnt) ORDER BY cnt DESC)
      FROM brand_counts
    ), '[]'::JSONB),
    'categories', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('value', value, 'count', cnt) ORDER BY cnt DESC)
      FROM category_counts
    ), '[]'::JSONB),
    'on_sale_count', (SELECT cnt FROM on_sale)
  );
$$;

GRANT EXECUTE ON FUNCTION public.search_product_facets_vector(TEXT) TO authenticated, anon;