-- Phase 3 PR-08: Server-side cart (ADR-0023)

CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  guest_token TEXT,
  locale TEXT NOT NULL DEFAULT 'lv',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT carts_owner_check CHECK (user_id IS NOT NULL OR guest_token IS NOT NULL)
);

CREATE UNIQUE INDEX carts_user_id_unique ON carts(user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX carts_guest_token_unique ON carts(guest_token) WHERE guest_token IS NOT NULL;

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 99),
  unit_price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cart_id, product_id)
);

CREATE INDEX cart_items_cart_id_idx ON cart_items(cart_id);

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "carts_select_own" ON carts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "carts_insert_own" ON carts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "carts_update_own" ON carts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "carts_delete_own" ON carts
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "cart_items_select_own" ON cart_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
        AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "cart_items_insert_own" ON cart_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
        AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "cart_items_update_own" ON cart_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
        AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "cart_items_delete_own" ON cart_items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
        AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "carts_admin_all" ON carts
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "cart_items_admin_all" ON cart_items
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());