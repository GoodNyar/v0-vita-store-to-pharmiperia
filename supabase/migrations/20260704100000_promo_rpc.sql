-- Phase 3 PR-03: Remove public promo enumeration; validate via RPC (M-1)

DROP POLICY IF EXISTS "promo_codes_select_active" ON promo_codes;

CREATE POLICY "promo_codes_admin_select" ON promo_codes
  FOR SELECT
  USING (is_admin());

CREATE OR REPLACE FUNCTION public.validate_promo_code(
  p_code TEXT,
  p_subtotal_cents INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row promo_codes%ROWTYPE;
  v_discount_cents INTEGER;
BEGIN
  IF p_code IS NULL OR length(trim(p_code)) = 0 THEN
    RETURN jsonb_build_object('valid', false, 'error', 'empty_code');
  END IF;

  SELECT *
  INTO v_row
  FROM promo_codes
  WHERE upper(code) = upper(trim(p_code))
    AND is_active = TRUE
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'not_found');
  END IF;

  IF v_row.valid_from IS NOT NULL AND v_row.valid_from > NOW() THEN
    RETURN jsonb_build_object('valid', false, 'error', 'not_yet_valid');
  END IF;

  IF v_row.valid_until IS NOT NULL AND v_row.valid_until < NOW() THEN
    RETURN jsonb_build_object('valid', false, 'error', 'expired');
  END IF;

  IF v_row.max_uses IS NOT NULL AND v_row.used_count >= v_row.max_uses THEN
    RETURN jsonb_build_object('valid', false, 'error', 'max_uses_reached');
  END IF;

  IF COALESCE(v_row.min_order_amount_cents, 0) > p_subtotal_cents THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'min_order_not_met',
      'min_order_cents', v_row.min_order_amount_cents
    );
  END IF;

  IF v_row.discount_type = 'percent' THEN
    v_discount_cents := floor(p_subtotal_cents * v_row.discount_value_cents::numeric / 10000);
  ELSIF v_row.discount_type = 'fixed' THEN
    v_discount_cents := LEAST(v_row.discount_value_cents, p_subtotal_cents);
  ELSE
    RETURN jsonb_build_object('valid', false, 'error', 'invalid_discount_type');
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'promo_id', v_row.id,
    'code', v_row.code,
    'discount_cents', v_discount_cents,
    'discount_type', v_row.discount_type
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_promo_code(TEXT, INTEGER) TO authenticated, anon;