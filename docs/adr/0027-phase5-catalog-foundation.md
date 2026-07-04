# ADR-0027: Phase 5 catalog foundation (variants, PIM staging, scale prep)

**Статус:** принят · **Дата:** 2026-07-04 · **Фаза:** 5

## Контекст

Phase 4 закрыла feature gaps на flat `products` (~500 SKU). CTO Roadmap Phase 5 требует variants, mini-PIM, inventory reservations, SQL facets, keyset pagination и sitemap sharding до 100k SKU. Полный Meilisearch и supplier feed — по бизнес-триггеру.

## Решение

1. **Schema:** `product_variants`, `feed_import_batches`/`feed_import_rows`, `inventory_reservations` + RPC `reserve_inventory_for_order`, `release_inventory_reservation`, `search_product_facets_vector`.
2. **Commerce layer:** `lib/commerce/variants.ts`, `feed-import.ts`, `pagination.ts`, `search-facets-server.ts`, `meilisearch.ts` (env-gated stub).
3. **Search facets:** SQL aggregation over full match set; UI читает facets с сервера, не из обрезанных 50 результатов.
4. **Sitemap:** `generateSitemaps` + shards по 45k URL.
5. **Draft orders:** best-effort `reserveInventoryForOrder` после создания строк заказа.
6. **Promo:** логирование/Sentry при `consumePromoCode === false`.

## Последствия

- Миграция `20260705120000_phase5_foundation.sql` (22-я в цепочке).
- Meilisearch index sync и publish pipeline — отдельные PR при `MEILISEARCH_HOST`.
- Feed cron: `GET /api/cron/feed-import` + `FEED_IMPORT_CRON_SECRET`.

## Отложено (триггер поставщика)

- Полный CSV/XML importer → publish в `products`
- Meilisearch HTTP client + reindex
- Programmatic SEO landing pages (category × brand × attribute)
- Admin merchandising UI