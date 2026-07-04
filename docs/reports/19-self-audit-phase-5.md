# Отчёт 19 — Self Audit Phase 5

> Дата: 2026-07-04 · Метод: перечитыв кода/миграций + попытка опровергнуть Phase 4 отчёты

---

## Executive Summary

Phase 5 **foundation доставлена**. Критических регрессий не найдено. **CONDITIONAL PASS** — Meilisearch и feed publish намеренно stub; требуется `pnpm db:reset` + staging на реальной БД.

---

## PASS

| Область | Статус |
|---------|--------|
| Architecture (`lib/commerce` boundary) | PASS |
| C-1 idempotent `handleOrderPaid` | PASS (сохранено) |
| M-2 promo max_uses SQL guard | PASS |
| M-2 promo `false` observability | PASS (Phase 5) |
| M-1 SQL search facets | PASS |
| M-5 helpdesk PII | PASS (metadata-only) |
| Webhook / Stripe / orders | PASS (без изменений контракта) |
| RLS на новых таблицах | PASS (admin + public read variants) |
| Unit tests | PASS (30, ожидаемо) |
| Sitemap sharding | PASS (код) |
| ADR-0027 | PASS |

---

## WARNING

| Область | Причина |
|---------|---------|
| Meilisearch | Stub only — Postgres остаётся primary |
| Feed import | Staging + validate; нет publish в `products` |
| Inventory reserve | Best-effort на draft; не блокирует checkout |
| Keyset filter | PostgREST `.or()` — нужен integration test на БД |
| Server cart checkout | По-прежнему client `useCart()` |
| `database.types.ts` | Новые таблицы не сгенерированы через `db:types` |
| Pipeline в agent env | Не прогнан (shell spawn failure) |

---

## FAIL

Нет блокирующих FAIL в коде. **FAIL только если** локальный pipeline красный — проверить вручную.

---

## Исправления в ходе Phase 5

1. SQL facets RPC + server delivery в search UI
2. `product_variants` + PIM staging schema
3. Inventory reservation RPC + draft hook
4. Promo consume `false` → Sentry (`webhook_promo`)
5. Sitemap `generateSitemaps` shards
6. Keyset pagination API
7. +6 unit tests

---

## Рекомендации Claude (P0)

1. `pnpm db:reset` — 22 миграции
2. Search query с >50 matches → facet counts полные
3. `reserve_inventory_for_order` на draft с 2 concurrent orders
4. `consume_promo_code` при исчерпанном max_uses → Sentry event
5. Build + sitemap shards в output