-- Phase 3 PR-17: RBAC v1 — manager/support roles + staff helpers
-- Phase 3 PR-15: Admin product write policies

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('customer', 'support', 'manager', 'admin'));

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'manager', 'support')
  );
$$;

CREATE OR REPLACE FUNCTION public.has_staff_role(allowed_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND role = ANY (allowed_roles)
  );
$$;

-- Extend staff access to orders (support can read/update)
DROP POLICY IF EXISTS "orders_select_admin" ON orders;
DROP POLICY IF EXISTS "orders_update_admin" ON orders;

CREATE POLICY "orders_select_staff"
  ON orders FOR SELECT
  USING (public.is_staff());

CREATE POLICY "orders_update_staff"
  ON orders FOR UPDATE
  USING (public.is_staff());

DROP POLICY IF EXISTS "order_items_select_admin" ON order_items;

CREATE POLICY "order_items_select_staff"
  ON order_items FOR SELECT
  USING (public.is_staff());

-- Products: manager + admin may create/update
CREATE POLICY "products_manage_insert"
  ON products FOR INSERT
  WITH CHECK (public.has_staff_role(ARRAY['admin', 'manager']));

CREATE POLICY "products_manage_update"
  ON products FOR UPDATE
  USING (public.has_staff_role(ARRAY['admin', 'manager']));

-- Promo codes: manager + admin may read/manage campaigns
DROP POLICY IF EXISTS "promo_codes_admin_select" ON promo_codes;

CREATE POLICY "promo_codes_staff_select"
  ON promo_codes FOR SELECT
  USING (public.has_staff_role(ARRAY['admin', 'manager']));

CREATE POLICY "promo_codes_admin_insert"
  ON promo_codes FOR INSERT
  WITH CHECK (public.has_staff_role(ARRAY['admin', 'manager']));

CREATE POLICY "promo_codes_admin_update"
  ON promo_codes FOR UPDATE
  USING (public.has_staff_role(ARRAY['admin', 'manager']));

DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;

CREATE POLICY "profiles_select_staff"
  ON profiles FOR SELECT
  USING (public.is_staff() OR auth.uid() = id);