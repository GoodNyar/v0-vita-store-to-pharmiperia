-- Phase 3 PR-11: Loyalty points (ADR-0024)

CREATE TABLE loyalty_points (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  total_earned INTEGER NOT NULL DEFAULT 0 CHECK (total_earned >= 0),
  total_spent INTEGER NOT NULL DEFAULT 0 CHECK (total_spent >= 0),
  tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  points INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn', 'spend', 'bonus', 'expire', 'adjust')),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX loyalty_transactions_user_id_idx ON loyalty_transactions(user_id, created_at DESC);

ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loyalty_points_select_own" ON loyalty_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "loyalty_transactions_select_own" ON loyalty_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "loyalty_points_admin_all" ON loyalty_points
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "loyalty_transactions_admin_all" ON loyalty_transactions
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE OR REPLACE FUNCTION public.accrue_loyalty_for_order(p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_total_cents INTEGER;
  v_points INTEGER;
  v_existing UUID;
BEGIN
  SELECT user_id, total_cents
  INTO v_user_id, v_total_cents
  FROM orders
  WHERE id = p_order_id
    AND payment_status = 'paid';

  IF NOT FOUND OR v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT id INTO v_existing
  FROM loyalty_transactions
  WHERE order_id = p_order_id
    AND type = 'earn'
  LIMIT 1;

  IF FOUND THEN
    RETURN TRUE;
  END IF;

  -- 1 point per euro spent (floor)
  v_points := GREATEST(1, floor(v_total_cents / 100));

  INSERT INTO loyalty_points (user_id, balance, total_earned, tier)
  VALUES (v_user_id, v_points, v_points, 'bronze')
  ON CONFLICT (user_id) DO UPDATE
  SET
    balance = loyalty_points.balance + EXCLUDED.balance,
    total_earned = loyalty_points.total_earned + EXCLUDED.total_earned,
    updated_at = NOW();

  INSERT INTO loyalty_transactions (user_id, order_id, points, type, description)
  VALUES (v_user_id, p_order_id, v_points, 'earn', 'Order purchase');

  RETURN TRUE;
END;
$$;