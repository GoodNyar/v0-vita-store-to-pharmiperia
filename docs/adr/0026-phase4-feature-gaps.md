# ADR-0026: Phase 4 feature-gap closure (promo, cart, search, retention)

**Статус:** принят · **Дата:** 2026-07-04 · **Фаза:** 4

## Контекст

Phase 3 оставила рабочую инфраструктуру без полных потребителей: promo RPC без checkout, server cart без cutover, `search_vector` без запросов, retention-письма без cron, legacy fallback в catalog-source.

## Решение

1. **Promo checkout:** `validatePromoCode` в `createDraftOrder` → `discount_cents` + `promo_code_id`; Stripe line items через пропорциональный `distributeDiscountAcrossLines`; `consume_promo_code` RPC в `order.paid`.
2. **Server cart cutover:** authenticated `CartProvider` читает/пишет `carts`/`cart_items` через server actions; гости — localStorage v3.
3. **Search v1 complete:** `search_products_vector` RPC + fallback ilike; facets на `categorySlug` с readable labels.
4. **Retention automation:** `GET /api/cron/retention` (Bearer `CRON_SECRET`) + Vercel cron; abandoned cart + review request с idempotency columns; review request также при admin status → `delivered`.
5. **Legacy strangler:** catalog-source не подменяет пустую БД на `lib/data`; `CATALOG_SOURCE=legacy` остаётся явным dev-переключателем; PDP extras merge сохранён.

## Последствия

- Новая миграция `20260704180000_phase4_feature_completion.sql`.
- Требуется `CRON_SECRET` на Vercel для retention cron.
- Promo consumption привязан к `payment_status=paid` (webhook), не к draft.
- Идемпотентность: `promo_consumed_at` на order (audit fix `20260704190000`).
- Stripe line items: exact sum reconciliation (`lib/stripe/discount-line-items.ts`).

## Альтернативы

- Stripe Coupons вместо пропорционального распределения — отклонено (лишняя синхронизация с admin promo).
- Inngest вместо Vercel cron — отклонено (overhead; cron достаточен для daily batch).