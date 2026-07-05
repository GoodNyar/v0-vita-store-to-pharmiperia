-- Phase 6: international foundation (markets, price lists, VAT OSS prep, carriers, storefront API data)

-- ── Markets (country → currency, locales, tax, legal) ───────────────────────
CREATE TABLE markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE CHECK (code IN ('lv', 'lt', 'ee')),
  country_iso CHAR(2) NOT NULL,
  name TEXT NOT NULL,
  default_locale TEXT NOT NULL,
  locales TEXT[] NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
  vat_rate_bps INTEGER NOT NULL CHECK (vat_rate_bps >= 0 AND vat_rate_bps <= 10000),
  oss_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_tax_behavior TEXT NOT NULL DEFAULT 'inclusive',
  legal_entity_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX markets_active_idx ON markets(code) WHERE is_active = TRUE;

-- ── Per-market product price overrides (price lists) ───────────────────────────
CREATE TABLE market_product_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  original_price_cents INTEGER CHECK (
    original_price_cents IS NULL OR original_price_cents >= price_cents
  ),
  currency TEXT NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (market_id, product_id)
);

CREATE INDEX market_product_prices_product_idx ON market_product_prices(product_id);

-- ── Shipping methods per market ───────────────────────────────────────────────
CREATE TABLE market_shipping_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  carrier TEXT NOT NULL,
  name TEXT NOT NULL,
  cost_cents INTEGER NOT NULL CHECK (cost_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
  supports_parcel_locker BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (market_id, code)
);

CREATE INDEX market_shipping_methods_market_idx ON market_shipping_methods(market_id);

-- ── Parcel locker / pickup points (LT/EE foundation — static seed) ────────────
CREATE TABLE parcel_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  carrier TEXT NOT NULL CHECK (carrier IN ('omniva', 'dpd')),
  external_id TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (market_id, carrier, external_id)
);

CREATE INDEX parcel_stations_market_carrier_idx
  ON parcel_stations(market_id, carrier)
  WHERE is_active = TRUE;

-- ── Orders: market attribution for OSS reporting ──────────────────────────────
ALTER TABLE orders
  ADD COLUMN market_code TEXT NOT NULL DEFAULT 'lv'
    CHECK (market_code IN ('lv', 'lt', 'ee'));

CREATE INDEX orders_market_code_idx ON orders(market_code);

-- ── Seed Baltic markets ───────────────────────────────────────────────────────
INSERT INTO markets (
  code, country_iso, name, default_locale, locales,
  vat_rate_bps, oss_enabled, legal_entity_name
) VALUES
  ('lv', 'LV', 'Latvia', 'lv', ARRAY['lv', 'ru'], 2100, FALSE, 'Pharmiperia SIA'),
  ('lt', 'LT', 'Lithuania', 'lt', ARRAY['lt', 'en'], 2100, TRUE, 'Pharmiperia SIA'),
  ('ee', 'EE', 'Estonia', 'et', ARRAY['et', 'en'], 2200, TRUE, 'Pharmiperia SIA');

-- ── Seed shipping methods ─────────────────────────────────────────────────────
-- Mirror checkout SHIPPING_OPTIONS (app/[locale]/checkout/page.tsx) for all markets
INSERT INTO market_shipping_methods (market_id, code, carrier, name, cost_cents, supports_parcel_locker, sort_order)
SELECT m.id, v.code, v.carrier, v.name, v.cost_cents, v.supports_parcel_locker, v.sort_order
FROM markets m
CROSS JOIN (
  VALUES
    ('omniva', 'omniva', 'Omniva pakomāts', 350, TRUE, 1),
    ('dpd', 'dpd', 'DPD Pickup', 320, TRUE, 2),
    ('venipak', 'omniva', 'Venipak pakomāts', 295, TRUE, 3),
    ('smartpost', 'dpd', 'Smartpost / Itella', 299, TRUE, 4),
    ('courier', 'omniva', 'Kurjers', 599, FALSE, 5)
) AS v(code, carrier, name, cost_cents, supports_parcel_locker, sort_order)
WHERE m.is_active = TRUE;

-- ── Seed parcel stations (LT/EE samples) ────────────────────────────────────
INSERT INTO parcel_stations (market_id, carrier, external_id, name, address, city, postal_code)
SELECT m.id, v.carrier, v.external_id, v.name, v.address, v.city, v.postal_code
FROM markets m
JOIN (
  VALUES
    ('lt', 'omniva', 'LT-OMN-001', 'Omniva Vilnius Akropolis', 'Ozo g. 25', 'Vilnius', '08200'),
    ('lt', 'dpd', 'LT-DPD-001', 'DPD Pickup Ozas', 'Ozo g. 18', 'Vilnius', '08200'),
    ('ee', 'omniva', 'EE-OMN-001', 'Omniva Tallinn Ülemiste', 'Lennujaama tee 2', 'Tallinn', '11415'),
    ('ee', 'dpd', 'EE-DPD-001', 'DPD Pickup Kristiine', 'Endla 45', 'Tallinn', '10615')
) AS v(market_code, carrier, external_id, name, address, city, postal_code)
  ON m.code = v.market_code;

-- ── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcel_stations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "markets_public_read" ON markets
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "markets_admin_all" ON markets
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "market_prices_public_read" ON market_product_prices
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM markets m WHERE m.id = market_id AND m.is_active = TRUE)
  );

CREATE POLICY "market_prices_admin_all" ON market_product_prices
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "market_shipping_public_read" ON market_shipping_methods
  FOR SELECT USING (
    is_active = TRUE
    AND EXISTS (SELECT 1 FROM markets m WHERE m.id = market_id AND m.is_active = TRUE)
  );

CREATE POLICY "market_shipping_admin_all" ON market_shipping_methods
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "parcel_stations_public_read" ON parcel_stations
  FOR SELECT USING (
    is_active = TRUE
    AND EXISTS (SELECT 1 FROM markets m WHERE m.id = market_id AND m.is_active = TRUE)
  );

CREATE POLICY "parcel_stations_admin_all" ON parcel_stations
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());