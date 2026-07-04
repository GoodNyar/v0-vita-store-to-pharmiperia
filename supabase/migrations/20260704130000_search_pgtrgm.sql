-- Phase 3 PR-18: Search v1 pg_trgm (ADR-0025)

CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

UPDATE products SET search_vector =
  setweight(to_tsvector('simple', coalesce(name_ru, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(name_lv, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(description_ru, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(description_lv, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(sku, '')), 'A');

CREATE INDEX IF NOT EXISTS products_search_vector_idx ON products USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS products_name_ru_trgm_idx ON products USING GIN (name_ru gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_name_lv_trgm_idx ON products USING GIN (name_lv gin_trgm_ops);

CREATE OR REPLACE FUNCTION public.products_search_vector_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', coalesce(NEW.name_ru, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.name_lv, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.description_ru, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.description_lv, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.sku, '')), 'A');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_search_vector_update ON products;
CREATE TRIGGER products_search_vector_update
  BEFORE INSERT OR UPDATE OF name_ru, name_lv, description_ru, description_lv, sku
  ON products
  FOR EACH ROW
  EXECUTE FUNCTION public.products_search_vector_trigger();