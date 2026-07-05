-- BUGFIX-01B: atomic guest→server cart line merge (ADR-0023)

CREATE OR REPLACE FUNCTION merge_cart_item_atomic(
  p_cart_id UUID,
  p_product_id UUID,
  p_add_quantity INTEGER,
  p_unit_price_cents INTEGER,
  p_currency TEXT DEFAULT 'EUR'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_qty INTEGER;
BEGIN
  IF p_add_quantity < 1 OR p_add_quantity > 99 THEN
    RAISE EXCEPTION 'invalid add quantity: %', p_add_quantity;
  END IF;

  INSERT INTO cart_items (
    cart_id,
    product_id,
    quantity,
    unit_price_cents,
    currency,
    updated_at
  ) VALUES (
    p_cart_id,
    p_product_id,
    LEAST(99, p_add_quantity),
    p_unit_price_cents,
    COALESCE(p_currency, 'EUR'),
    NOW()
  )
  ON CONFLICT (cart_id, product_id) DO UPDATE SET
    quantity = LEAST(99, cart_items.quantity + EXCLUDED.quantity),
    unit_price_cents = EXCLUDED.unit_price_cents,
    currency = EXCLUDED.currency,
    updated_at = NOW()
  RETURNING quantity INTO v_qty;

  RETURN v_qty;
END;
$$;

REVOKE ALL ON FUNCTION merge_cart_item_atomic(UUID, UUID, INTEGER, INTEGER, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION merge_cart_item_atomic(UUID, UUID, INTEGER, INTEGER, TEXT) TO service_role;