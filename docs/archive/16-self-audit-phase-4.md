# Самоаудит Phase 4 (Grok)

> **ARCHIVED** — заменён [17-nezavisimyj-audit-phase-4.md](../reports/audits/17-nezavisimyj-audit-phase-4.md) и [18-zero-trust-production-audit-phase-4.md](../reports/audits/18-zero-trust-production-audit-phase-4.md). См. [archive/README.md](README.md).

> Дата: 2026-07-04 · Ветка: phase-4 · Baseline: `v3.0-phase3-complete`

## Метод

1. Grep по каждому feature gap из Phase 3 audit (M-3, M-4, M-5, search_vector, facets).
2. Проверка наличия потребителей (не stub-only).
3. Статический анализ типов (`database.types.ts` sync).
4. Unit tests расширены.

## Результаты по областям

| Область | До | После | Потребитель |
|---------|-----|-------|-------------|
| Promo checkout | RPC only | ✅ draft + Stripe + consume | checkout UI, `order.paid` |
| Server cart | merge-only | ✅ read/write cutover | `CartProvider`, abandoned cart |
| Abandoned cart | list only | ✅ send + cron | `/api/cron/retention` |
| Review request | send fn, no trigger | ✅ cron + admin delivered | cron + `setOrderStatus` |
| search_vector | migration only | ✅ RPC primary | `searchProducts` |
| Search facets | slug label mismatch | ✅ `formatCategoryFacetLabel` | search page |
| Legacy fallback | empty DB → data.ts | ✅ empty array | catalog-source |

## PASS / WARNING / FAIL

| Ось | Вердикт |
|-----|---------|
| Architecture | **PASS** — все слои через `lib/commerce`, events, server actions |
| Types | **PASS** — `database.types.ts` обновлён вручную под миграцию |
| Tests | **WARNING** — 21 unit tests; cron/retention без integration test (осознанно) |
| Security | **PASS** — cron auth Bearer; promo RPC SECURITY DEFINER |
| Infra without consumers | **PASS** — нет новых orphan modules |

## Отложено (осознанно)

- Meilisearch / PIM / 100k SKU model (CTO Phase 4 original scope) — ждёт триггер поставщика.
- Guest server cart (guest_token) — guests остаются на localStorage.
- Stripe Coupon objects — используется пропорциональное распределение скидки.
- E2E promo + retention — следующий audit cycle.