# Phase 5 Master Plan (foundation)

> Baseline: `v4.0-phase4-complete` · Tag: `v5.0-phase5-complete`

## Scope (выполнено)

1. Migration `20260705120000` — variants, PIM staging, reservations, facets RPC
2. `lib/commerce` — variants, feed-import, pagination, search-facets-server, meilisearch stub
3. Search UI — server SQL facets (audit M-1)
4. Sitemap sharding — 45k per shard
5. Promo consume observability (audit M-2 Low)
6. Inventory reserve on draft (best-effort)
7. ADR-0027, tests +30, docs

## Отложено (триггер поставщика / Phase 6)

- Meilisearch index + sync job
- Feed CSV/XML → publish pipeline
- Programmatic SEO pages
- Admin merchandising
- Load tests 100k SKU