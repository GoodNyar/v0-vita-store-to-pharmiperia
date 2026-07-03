-- ADR-0018: admin RBAC v0 via profiles.role + RLS

ALTER TABLE profiles
  ADD COLUMN role TEXT NOT NULL DEFAULT 'customer'
  CHECK (role IN ('customer', 'admin'));

CREATE OR REPLACE FUNCTION public.is_admin()
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
      AND role = 'admin'
  );
$$;

CREATE POLICY "orders_select_admin"
  ON orders FOR SELECT
  USING (public.is_admin());

CREATE POLICY "orders_update_admin"
  ON orders FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "order_items_select_admin"
  ON order_items FOR SELECT
  USING (public.is_admin());

CREATE POLICY "profiles_select_admin"
  ON profiles FOR SELECT
  USING (public.is_admin() OR auth.uid() = id);