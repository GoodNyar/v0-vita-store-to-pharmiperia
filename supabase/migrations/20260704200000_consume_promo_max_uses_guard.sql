-- M-2: Re-check max_uses at consumption time (closes TOCTOU between draft validate and paid)

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

  -- Idempotent: webhook retries must not double-increment used_count
  IF v_order.promo_consumed_at IS NOT NULL THEN
    RETURN TRUE;
  END IF;

  UPDATE promo_codes
  SET used_count = used_count + 1
  WHERE id = p_promo_id
    AND (max_uses IS NULL OR used_count < max_uses);

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  UPDATE orders
  SET promo_consumed_at = NOW(),
      updated_at = NOW()
  WHERE id = p_order_id;

  RETURN TRUE;
END;
$$;