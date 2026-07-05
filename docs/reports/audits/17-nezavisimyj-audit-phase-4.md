# Отчёт 17 — Независимый внутренний аудит Phase 4 (для Claude)

> **Дата:** 2026-07-04 · **Аудитор:** Grok (нулевое доверие к отчётам 16 и предыдущей версии 17)  
> **Метод:** полный перечитыв кода / миграций / ADR / docs с нуля → попытка опровергнуть выводы → цикл исправлений → повторная проверка  
> **Baseline:** `v4.0-phase4-complete` (локально, без push)  
> **Проект:** `/Users/yakovlew/Downloads/Projects-pharmiperia-lv/pharmiperia-lv-update`

---

## Executive Summary

Phase 4 **закрывает заявленные feature gaps** (promo checkout, server cart cutover, retention cron, search vector, facets, legacy bridge removal). **Первоначальная реализация содержала 4 критических дефекта** (promo idempotency, Stripe sum mismatch, search fallback, email race). В ходе **двух раундов** независимого аудита добавлены ещё **3 исправления** (confirmation email claim, server cart clear на webhook, `alreadyPaid` guard).

**Вердикт: CONDITIONAL PASS**

Код готов к независимой верификации Claude. **Staging-прогон обязателен** для promo+Stripe, cron, search typo fallback. Pipeline (`pnpm test`, `pnpm build`) в среде агента не запускался (shell spawn failure) — Claude должен подтвердить локально.

| Ось | Вердикт |
|-----|---------|
| Feature gaps wired | **PASS** |
| Idempotency (webhook, promo, email) | **PASS** (post-fix) |
| Stripe amount integrity | **PASS** (типичные промо; см. WARNING extreme %) |
| Search (vector + fallback) | **PASS** |
| Server cart | **WARNING** (checkout = client cart; persist fire-and-forget) |
| Cron / retention | **PASS** (код); **WARNING** (staging) |
| Architecture / RLS / security | **PASS** |
| Unit tests | **WARNING** (21 тест, без integration) |
| Production readiness | **CONDITIONAL PASS** |

---

## 1. Исправления в ходе аудита

### Раунд 1 (критические — до первого отчёта 17)

| ID | Severity | Находка | Исправление |
|----|----------|---------|-------------|
| **A4-H1** | High | `consume_promo_code` не идемпотентен — webhook retry удваивает `used_count` | `promo_consumed_at` + guard в RPC (`20260704190000`) |
| **A4-H2** | High | `distributeDiscountAcrossLines` округление ≠ `orders.total_cents` → webhook `Payment amount mismatch` | Exact reconciliation + unit test |
| **A4-H3** | High | Vector search `[]` не fallback на ilike | `status: 'empty'` → ilike fallback |
| **A4-M1** | Medium | Race: review/abandoned email duplicate (admin + cron) | Atomic claim `UPDATE … IS NULL` + rollback on Resend fail |
| **A4-M2** | Medium | `plainto_tsquery` ломается на `&|!()` | `sanitizeSearchQuery()` |
| **A4-L1** | Low | Cron GET без `Cache-Control` | `no-store` header |

### Раунд 2 (независимый перечитыв — этот цикл)

| ID | Severity | Находка | Исправление |
|----|----------|---------|-------------|
| **A4-M3** | Medium | `sendOrderConfirmationEmail` — read→send→update (TOCTOU), дубль при webhook retry | Atomic claim `confirmation_email_sent_at` + rollback on Resend/items fail |
| **A4-M4** | Medium | Server cart не очищается на webhook — abandoned email после оплаты, если UI `onComplete` не сработал | `clearServerCart(user_id)` в `handleOrderPaid` |
| **A4-M5** | Medium | `handleOrderPaid` игнорировал `alreadyPaid` — лишние side-effects при retry | Skip email/stock/loyalty when `alreadyPaid`; promo+cart cleanup always (идемпотентно) |
| **A4-L2** | Low | `promo_consumed_at` отсутствовал в Insert/Update `database.types.ts` | Добавлен вручную |

### Файлы remediation (полный список)

- `supabase/migrations/20260704190000_phase4_audit_fixes.sql`
- `lib/stripe/discount-line-items.ts` + `.test.ts`
- `lib/commerce/search.ts`
- `lib/email/review-request.ts`
- `lib/email/abandoned-cart.ts`
- `lib/email/order-confirmation.ts` *(раунд 2)*
- `lib/events/order-paid.ts` *(раунд 2)*
- `app/api/cron/retention/route.ts`
- `lib/database.types.ts`

---

## 2. Перечитано с нуля (scope)

### Миграции Phase 4

| Файл | Содержание | Замечания |
|------|------------|-----------|
| `20260704180000_phase4_feature_completion.sql` | `promo_code_id`, retention columns, `consume_promo_code` v1, `search_products_vector` | v1 consume не идемпотентен — исправлено в 190000 |
| `20260704190000_phase4_audit_fixes.sql` | `promo_consumed_at`, idempotent `consume_promo_code` | `FOR UPDATE` на order; повторный вызов → `TRUE` без increment |

**Всего миграций:** 20.

### ADR

- **ADR-0026** — соответствует реализации; дополнено audit fix про `promo_consumed_at` и Stripe reconciliation.

### Ключевой код (перечитан)

- `lib/orders.ts` — `createDraftOrder` + promo validate; `fulfillOrderFromCheckoutSession` amount check
- `app/actions/stripe.ts` — `distributeDiscountAcrossLines` перед session
- `app/api/webhooks/stripe/route.ts` — claim / release / dispatch
- `lib/events/order-paid.ts` — side-effects chain
- `lib/commerce/server-cart.ts`, `app/actions/cart.ts`, `components/cart-context.tsx`
- `lib/commerce/search.ts`, `lib/commerce/search-facets.ts`
- `lib/commerce/catalog-source.ts` — no silent legacy fallback
- `lib/email/*` — abandoned, review, confirmation
- `app/api/cron/retention/route.ts`, `vercel.json`
- `app/[locale]/checkout/page.tsx` — promo UI, `handlePaymentComplete` → `clearCart()`
- `app/actions/admin/orders.ts` — `delivered` → review email

---

## 3. Проверка по областям

### Webhook / idempotency

| Компонент | Статус | Детали |
|-----------|--------|--------|
| `claimStripeEvent` | **PASS** | UNIQUE `stripe_webhook_events.id`; release on 500 |
| `fulfillOrderFromCheckoutSession` | **PASS** | `alreadyPaid` skip DB update; strict `amount_total` match |
| `decrement_stock` | **PASS** | `inventory_adjusted_at` (ADR-0019) |
| `accrue_loyalty_for_order` | **PASS** | UNIQUE (order_id, type) |
| `consume_promo_code` | **PASS** | `promo_consumed_at` + order `FOR UPDATE` |
| `sendOrderConfirmationEmail` | **PASS** | Atomic claim *(раунд 2)* |
| `sendReviewRequestEmail` | **PASS** | Atomic claim + rollback |
| `sendAbandonedCartEmail` | **PASS** | Atomic claim + rollback |
| `handleOrderPaid` | **PASS** | `alreadyPaid` guard *(раунд 2)* |

**Попытка опровергнуть:** duplicate Stripe event → blocked by claim. Handler 500 → release → retry → promo/email/inventory идемпотентны после fixes.

### Promo

| Проверка | Статус |
|----------|--------|
| RPC `validate_promo_code` SECURITY DEFINER + `FOR UPDATE` | **PASS** |
| Checkout UI → server re-validate в `createDraftOrder` | **PASS** |
| `discount_cents` + `promo_code_id` в order | **PASS** |
| Stripe line sum = discounted subtotal + shipping | **PASS** (типичные промо) |
| `consume` на `order.paid`, не на draft | **PASS** |
| TOCTOU `max_uses` между draft и paid | **WARNING** — нет reservation; `consume` не re-check `max_uses` |
| Extreme % (>99.9%) + multi-qty lines | **WARNING** — `distributeDiscountAcrossLines` может throw (редкий edge) |

### Server cart

| Проверка | Статус |
|----------|--------|
| Auth read/write via server actions | **PASS** |
| Guest localStorage v3 | **PASS** (ADR-0023) |
| RLS owner policies | **PASS** |
| `touchCart` on mutation | **PASS** |
| Checkout reads client `useCart()` | **WARNING** — stale price до reload |
| `void persistIfAuthenticated` | **WARNING** — silent fail |
| Clear after paid | **PASS** (post-fix) — UI `clearCart` + webhook `clearServerCart` |

### Search

| Проверка | Статус |
|----------|--------|
| `search_products_vector` RPC SECURITY DEFINER | **PASS** |
| Fallback ilike on empty/error | **PASS** |
| `sanitizeSearchQuery` | **PASS** |
| Facets `formatCategoryFacetLabel` | **PASS** |
| Locale-weighted ranking | **WARNING** — deferred |

### Cron / email

| Проверка | Статус |
|----------|--------|
| Bearer `CRON_SECRET`, fail-closed | **PASS** |
| Abandoned batch + claim | **PASS** |
| Review batch + admin `delivered` | **PASS** |
| `Cache-Control: no-store` | **PASS** |
| Vercel cron `0 9 * * *` | **PASS** (config) |

### Architecture / RSC / server actions

| Проверка | Статус |
|----------|--------|
| `lib/commerce` boundary | **PASS** |
| `server-only` on server modules | **PASS** |
| Server actions для cart/promo/checkout | **PASS** |
| No orphan infra | **PASS** |
| catalog-source: empty DB → `[]`, `CATALOG_SOURCE=legacy` explicit | **PASS** |

### Security / RLS / SQL

| Проверка | Статус |
|----------|--------|
| Promo enumeration closed (admin-only SELECT) | **PASS** |
| Cron auth | **PASS** |
| Cart RLS owner-only | **PASS** |
| `search_products_vector` granted anon/authenticated | **PASS** (read-only active products) |
| SQL injection in search | **PASS** — RPC + sanitized tsquery; ilike escaped |

### Performance / caching

| Проверка | Статус |
|----------|--------|
| Catalog `cachedList*` | **PASS** (unchanged) |
| Search vector per-request RPC | **WARNING** — acceptable at current scale |
| Cron batch limits (25) | **PASS** |

### Inventory / loyalty

| Проверка | Статус |
|----------|--------|
| Stock decrement idempotent | **PASS** |
| Insufficient stock → `needs_attention` | **PASS** |
| Loyalty accrual on paid | **PASS** |

---

## 4. PASS / WARNING / FAIL (итоговая матрица)

| Критерий | Вердикт |
|----------|---------|
| Feature gaps closed | **PASS** |
| Critical idempotency paths | **PASS** |
| Stripe amount (типичные промо 1–50%) | **PASS** |
| Types / 20 migrations sync | **PASS** |
| Email flows (confirmation, review, abandoned) | **PASS** |
| Server cart production parity | **WARNING** |
| Promo TOCTOU / extreme % | **WARNING** |
| Integration / E2E tests | **WARNING** |
| Pipeline executed in agent env | **FAIL** (не запущен — не блокер кода) |
| PIM / Meilisearch / 100k SKU | **DEFERRED** |

**Overall: CONDITIONAL PASS**

---

## 5. Сознательно отложено

- Promo reservation RPC между draft и payment
- Guest server cart (`guest_token`)
- Server cart price refresh on every read
- Search locale-weighted ranking
- Integration tests для cron / retention / promo E2E
- Meilisearch / PIM (business trigger)
- Stripe native Coupon objects
- `abandoned_email_sent_at` reset при новой активности корзины (повторный nudge)

---

## 6. Обязательная проверка Claude

### P0 (блокеры)

1. `pnpm db:reset` — 20 миграций без ошибок  
2. `pnpm typecheck && pnpm test && pnpm build && pnpm validate:production`  
3. **Promo E2E:** seed promo → checkout apply → Stripe test payment → `used_count=1`, `promo_consumed_at` set  
4. **Webhook retry:** двойной `consume_promo_code` → `used_count` остаётся 1  
5. **Stripe amount:** order 2+ lines + promo 10–20% → `session.amount_total === orders.total_cents`  
6. **Confirmation email dedup:** симуляция двух параллельных `sendOrderConfirmationEmail` → одно письмо  

### P1 (важно)

7. Search typo → ilike fallback returns results  
8. Search `foo & bar` → no SQL error  
9. Cron: no auth → 401; `Bearer $CRON_SECRET` → 200 JSON  
10. Review: admin `delivered` + cron same order → single email  
11. Auth cart: login → server cart replaces localStorage  
12. Paid order + закрытие вкладки до `onComplete` → server cart пуст (webhook clear)  

### P2 (риск)

13. Extreme promo (~99%) на multi-qty cart — ожидаемое поведение при session create  
14. Concurrent cart mutations (rapid add) — last write wins  
15. `fulfillOrderFromCheckoutSession` + Stripe Tax — tax drift warning only  
16. Два одновременных draft на promo `max_uses=1` — оба могут пройти validate  

---

## 7. Наиболее рискованные места

| Ранг | Область | Риск |
|------|---------|------|
| 1 | **Promo + Stripe reconciliation** | Был production blocker; fix требует staging proof на multi-line cart |
| 2 | **Promo `max_uses` TOCTOU** | Два draft → два paid → `used_count` > `max_uses` |
| 3 | **Webhook retry chain** | Зависит от идемпотентности всех handlers (после fixes — OK) |
| 4 | **Client cart vs server cart at checkout** | Цены/количество из localStorage; server re-fetch не на checkout |
| 5 | **Extreme percent promos** | `distributeDiscountAcrossLines` throw при target < per-line qty constraints |
| 6 | **Email claim-before-send** | При rollback failure — редкий stuck state (мониторинг Resend) |

---

## 8. Рекомендация Claude

**Начать с опровержения A4-H2:** draft order с promo на multi-line cart → сравнить `session.amount_total` и `orders.total_cents`.  
**Затем A4-H1:** double `consume_promo_code`.  
**Затем A4-M3:** parallel confirmation send.  
Если P0 PASS → **Phase 4 PASS** для production staging; иначе **FAIL** с конкретным сценарием.

---

## 9. Git / ops (не выполнялось)

```bash
# Локально (пользователь):
cd /Users/yakovlew/Downloads/Projects-pharmiperia-lv/pharmiperia-lv-update
pnpm db:reset && pnpm typecheck && pnpm test && pnpm build
git add .
git commit -m "fix(phase-4): audit round 2 — confirmation claim, cart clear on paid"
bash scripts/tag-phase-4.sh
# push/deploy — по решению пользователя
```

**Push, merge, deploy в этом цикле не выполнялись.**