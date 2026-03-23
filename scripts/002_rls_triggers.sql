-- Pharmiperia Database Schema - Part 2: RLS & Triggers

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Profiles: users can only see/edit their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Addresses: users can only manage their own addresses
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "addresses_select_own" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "addresses_insert_own" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "addresses_update_own" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "addresses_delete_own" ON addresses FOR DELETE USING (auth.uid() = user_id);

-- Favorites: users can only manage their own favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_select_own" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Orders: users can only see their own orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items: users can see items from their orders
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_select_own" ON order_items 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- Reviews: anyone can read approved reviews, users can manage their own
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_select_approved" ON reviews FOR SELECT USING (is_approved = TRUE OR auth.uid() = user_id);
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Products, categories, brands: public read access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_select_all" ON products FOR SELECT USING (TRUE);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "product_images_select_all" ON product_images FOR SELECT USING (TRUE);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (TRUE);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands_select_all" ON brands FOR SELECT USING (TRUE);

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "promo_codes_select_active" ON promo_codes FOR SELECT USING (is_active = TRUE);

-- ============================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TRIGGER: Update product rating on review change
-- ============================================
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE products 
  SET 
    rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND is_approved = TRUE),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND is_approved = TRUE)
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS on_review_change ON reviews;
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();
