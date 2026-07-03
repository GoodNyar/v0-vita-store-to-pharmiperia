-- ADR-0002: store money as integer minor units + explicit currency

-- Products
ALTER TABLE products
  ADD COLUMN price_cents INTEGER,
  ADD COLUMN original_price_cents INTEGER,
  ADD COLUMN currency TEXT NOT NULL DEFAULT 'EUR';

UPDATE products SET
  price_cents = ROUND(price * 100),
  original_price_cents = CASE
    WHEN original_price IS NOT NULL THEN ROUND(original_price * 100)
    ELSE NULL
  END;

ALTER TABLE products
  ALTER COLUMN price_cents SET NOT NULL,
  DROP COLUMN price,
  DROP COLUMN original_price;

-- Orders
ALTER TABLE orders
  ADD COLUMN subtotal_cents INTEGER,
  ADD COLUMN shipping_cost_cents INTEGER,
  ADD COLUMN discount_cents INTEGER,
  ADD COLUMN total_cents INTEGER,
  ADD COLUMN currency TEXT NOT NULL DEFAULT 'EUR';

UPDATE orders SET
  subtotal_cents = ROUND(subtotal * 100),
  shipping_cost_cents = ROUND(shipping_cost * 100),
  discount_cents = ROUND(discount * 100),
  total_cents = ROUND(total * 100);

ALTER TABLE orders
  ALTER COLUMN subtotal_cents SET NOT NULL,
  ALTER COLUMN shipping_cost_cents SET NOT NULL,
  ALTER COLUMN discount_cents SET NOT NULL,
  ALTER COLUMN total_cents SET NOT NULL,
  DROP COLUMN subtotal,
  DROP COLUMN shipping_cost,
  DROP COLUMN discount,
  DROP COLUMN total;

-- Order items
ALTER TABLE order_items
  ADD COLUMN unit_price_cents INTEGER,
  ADD COLUMN total_price_cents INTEGER,
  ADD COLUMN currency TEXT NOT NULL DEFAULT 'EUR';

UPDATE order_items SET
  unit_price_cents = ROUND(unit_price * 100),
  total_price_cents = ROUND(total_price * 100);

ALTER TABLE order_items
  ALTER COLUMN unit_price_cents SET NOT NULL,
  ALTER COLUMN total_price_cents SET NOT NULL,
  DROP COLUMN unit_price,
  DROP COLUMN total_price;

-- Promo codes (discount values)
ALTER TABLE promo_codes
  ADD COLUMN discount_value_cents INTEGER,
  ADD COLUMN min_order_amount_cents INTEGER,
  ADD COLUMN currency TEXT NOT NULL DEFAULT 'EUR';

UPDATE promo_codes SET
  discount_value_cents = ROUND(discount_value * 100),
  min_order_amount_cents = ROUND(min_order_amount * 100);

ALTER TABLE promo_codes
  ALTER COLUMN discount_value_cents SET NOT NULL,
  ALTER COLUMN min_order_amount_cents SET NOT NULL,
  DROP COLUMN discount_value,
  DROP COLUMN min_order_amount;