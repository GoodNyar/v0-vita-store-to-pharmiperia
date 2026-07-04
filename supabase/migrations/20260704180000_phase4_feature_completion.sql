-- Phase 4: promo consumption, retention idempotency, full-text search RPC

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS promo_code_id UUID REFERENCES promo_codes(id),
  ADD COLUMN IF NOT EXISTS review_request_email_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS orders_promo_code_id_idx ON orders(promo_code_id)
  WHERE promo_code_id IS NOT NULL;

ALTER TABLE carts
  ADD COLUMN IF NOT EXISTS abandoned_email_sent_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.consume_promo_code(p_promo_id UUID, p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order orders%ROWTYPE;
BEGIN
  SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  IF v_order.promo_code_id IS NULL OR v_order.promo_code_id <> p_promo_id THEN
    RETURN FALSE;
  END IF;

  IF v_order.payment_status <> 'paid' THEN
    RETURN FALSE;
  END IF;

  UPDATE promo_codes
  SET used_count = used_count + 1
  WHERE id = p_promo_id;

  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_promo_code(UUID, UUID) TO service_role;

CREATE OR REPLACE FUNCTION public.search_products_vector(
  p_query TEXT,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (product_id UUID, rank REAL)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id AS product_id,
    ts_rank(p.search_vector, plainto_tsquery('simple', p_query)) AS rank
  FROM products p
  WHERE p.is_active = TRUE
    AND p.search_vector @@ plainto_tsquery('simple', p_query)
  ORDER BY rank DESC, p.review_count DESC
  LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 50), 100));
$$;

GRANT EXECUTE ON FUNCTION public.search_products_vector(TEXT, INTEGER) TO authenticated, anon;