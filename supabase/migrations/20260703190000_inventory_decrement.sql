-- ADR-0019: idempotent stock decrement on paid orders

ALTER TABLE orders
  ADD COLUMN inventory_adjusted_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.decrement_stock(p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_adjusted_at TIMESTAMPTZ;
  r RECORD;
  v_new_qty INTEGER;
BEGIN
  SELECT inventory_adjusted_at
  INTO v_adjusted_at
  FROM orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found: %', p_order_id;
  END IF;

  IF v_adjusted_at IS NOT NULL THEN
    RETURN TRUE;
  END IF;

  FOR r IN
    SELECT product_id, quantity
    FROM order_items
    WHERE order_id = p_order_id
      AND product_id IS NOT NULL
  LOOP
    UPDATE products
    SET
      stock_quantity = stock_quantity - r.quantity,
      updated_at = NOW()
    WHERE id = r.product_id
    RETURNING stock_quantity INTO v_new_qty;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product not found for order item: %', r.product_id;
    END IF;

    IF v_new_qty < 0 THEN
      RAISE EXCEPTION 'Insufficient stock for product % (order %)', r.product_id, p_order_id;
    END IF;
  END LOOP;

  UPDATE orders
  SET
    inventory_adjusted_at = NOW(),
    updated_at = NOW()
  WHERE id = p_order_id;

  RETURN TRUE;
END;
$$;