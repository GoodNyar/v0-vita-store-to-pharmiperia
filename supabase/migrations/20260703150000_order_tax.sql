-- ADR-0008: persist VAT (PVN) amount per order for reconciliation with Stripe Tax

ALTER TABLE orders
  ADD COLUMN tax_cents INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN orders.tax_cents IS 'VAT amount in minor units (tax-inclusive pricing; Latvia PVN 21%)';