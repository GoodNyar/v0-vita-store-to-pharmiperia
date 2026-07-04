# ADR-0025: Search v1 — pg_trgm + tsvector

- **Статус:** принят
- **Дата:** 2026-07-04

## Решение

Колонка `products.search_vector` + GIN индексы + pg_trgm на `name_ru`/`name_lv`. Client search facets в `lib/commerce/search-facets.ts`; полнотекстовый RPC — follow-up при росте SKU.