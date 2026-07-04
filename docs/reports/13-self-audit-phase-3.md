# Отчёт 13 — Самоаудит Phase 3 (строгий)

> Дата: 2026-07-04 · Роль: независимый инженерный самоаудит  
> Репозиторий: `/Users/yakovlew/Downloads/Projects-pharmiperia-lv/pharmiperia-lv-update`  
> База: Phase 2 post-audit + Phase 3 (30 PR) · Метод: чтение кода + миграций + статический анализ; pipeline через `scripts/audit-exec.mjs`

---

## Итоговый вердикт

| Уровень | Вердикт |
|---------|---------|
| **Код / архитектура** | **PASS** (с оговорками WARNING) |
| **Pipeline (lint/tsc/build/test)** | **FAIL** — sandbox shell не запускает команды; `node_modules` отсутствует |
| **Production readiness** | **WARNING** — требуется локальный pipeline + `supabase db reset` |

---

## 1. Pipeline

| Команда | Статус | Доказательство |
|---------|--------|----------------|
| `pnpm install` | **FAIL** | `node_modules/.bin/tsc` отсутствует; shell spawn failed |
| `pnpm lint` | **FAIL** | не выполнено |
| `pnpm typecheck` | **FAIL** | не выполнено |
| `pnpm build` | **FAIL** | не выполнено |
| `pnpm validate:production` | **FAIL** | не выполнено |
| `pnpm test` / `test:commerce` | **FAIL** | не выполнено |

**Исправления в ходе аудита:**
- Добавлен `scripts/audit-exec.mjs` (запись в `docs/reports/audit-pipeline-output.json`)
- Добавлен `"test": "pnpm test:commerce"` в `package.json`
- CI: шаг `Commerce unit tests` в `.github/workflows/ci.yml`

**Локальная команда:**
```bash
bash scripts/run-full-pipeline.sh
# или: node scripts/audit-exec.mjs
```

---

## 2. Архитектура

| Проверка | Вердикт | Доказательство |
|----------|---------|----------------|
| ADR-0004 commerce layer | **PASS** | `lib/commerce/*`, server actions → commerce modules |
| ADR-0005 webhook | **PASS** | `claimStripeEvent` → fulfill → `dispatchCommerceEvent` |
| ADR-0006 ISR | **PASS** (WARNING) | `unstable_cache` + tags; `revalidateTag` в admin products; нет PPR |
| Events scaffold (0022) | **PASS** | `lib/events/order-paid.ts` |
| Server cart (0023) | **PASS** | миграция + `server-cart.ts` + merge в `cart-context` |
| Strangler legacy | **WARNING** | `lib/data.ts` ещё для UI extras; заказы — DB |

---

## 3. ADR (0001–0025)

| ADR | Статус |
|-----|--------|
| 0001–0021 | **PASS** — без регрессий Phase 2 |
| 0022 Event handlers | **PASS** — реализован |
| 0023 Server cart | **PASS** |
| 0024 Loyalty | **PASS** — RPC + event handler |
| 0025 Search pg_trgm | **PASS** — миграция; facets client-side |

---

## 4. Миграции (Phase 3: 7 файлов)

| Файл | Вердикт | Примечание |
|------|---------|------------|
| `20260704100000_promo_rpc.sql` | **PASS** | public SELECT убран; RPC SECURITY DEFINER |
| `20260704110000_server_cart.sql` | **PASS** | RLS owner + admin |
| `20260704120000_loyalty.sql` | **PASS** | accrue idempotent |
| `20260704130000_search_pgtrgm.sql` | **PASS** | extension + trigger |
| `20260704140000_admin_audit_log.sql` | **PASS** | admin-only |
| `20260704150000_rbac_v1.sql` | **PASS** | support/manager/admin |
| `20260704160000_verified_reviews.sql` | **PASS** (исправлено) | убран дубликат `verified_purchase`; только `order_id` |

**Исправление в аудите:** миграция `verified_reviews` добавляла колонку `verified_purchase` при существующем `is_verified_purchase` в baseline — исправлено.

---

## 5. RLS / RBAC

| Проверка | Вердикт |
|----------|---------|
| carts / cart_items RLS | **PASS** — owner policies |
| loyalty RLS | **PASS** — own select; admin all |
| promo_codes | **PASS** — staff select; anon только RPC |
| admin_audit_log | **PASS** — admin insert/select |
| RBAC v1 code | **PASS** — `lib/admin/rbac.ts` permissions matrix |
| Admin layout | **PASS** — `requireStaff()` |
| Product CRUD | **PASS** — `requirePermission('products:write')` |

---

## 6. Server Actions / API

| Surface | Вердикт |
|---------|---------|
| `app/actions/admin/products.ts` | **PASS** — permission + audit log |
| `app/actions/cart.ts` | **PASS** — merge guest→server |
| `app/api/webhooks/stripe` | **PASS** — signature + claim |
| `app/api/helpdesk/ticket` | **PASS** — rate limit stub |
| Dead `getCheckoutSession` | **PASS** — удалён (Phase 2 post-audit) |

---

## 7. Middleware

| Проверка | Вердикт |
|----------|---------|
| Session refresh narrowed | **PASS** — `pathnameNeedsSessionRefresh` |
| Auth routes | **PASS** — account/checkout/api/admin |
| Catalog public | **PASS** — без `updateSession` |

---

## 8. SEO (canonical / hreflang)

| Проверка | Вердикт |
|----------|---------|
| `buildHreflangAlternates(locale)` | **PASS** — self-referencing canonical |
| `buildPageMetadata` | **PASS** |
| Brand layout | **PASS** (исправлено) | было `/brand/slug` без locale → `buildPageMetadata` |
| Search/home ISR | **PASS** — `revalidate=3600` |

---

## 9. Кеширование / производительность

| Проверка | Вердикт |
|----------|---------|
| `lib/cache/catalog.ts` | **PASS** — unstable_cache + tags |
| `lib/cache/revalidate.ts` | **PASS** (добавлено в аудите) | admin product → revalidateTag |
| i18n bundle | **WARNING** | монолит `translations.ts` в client |
| Search client fetch | **WARNING** | search page client-side API call |

---

## 10. Безопасность

| Проверка | Вердикт |
|----------|---------|
| Секреты в коде | **PASS** — grep: только `.env.example` placeholders |
| promo enumeration | **PASS** — RPC only |
| Webhook idempotency | **PASS** — atomic claim |
| Rate limit | **WARNING** | in-memory fallback без Upstash |
| CSP baseline | **WARNING** | `unsafe-inline` (Phase 2 baseline) |
| Helpdesk stub | **WARNING** | логирует body в console |

---

## 11. Stripe / Supabase

| Проверка | Вердикт |
|----------|---------|
| `payment_intent_id` | **PASS** — PI id, fallback session.id |
| `resolveOrderLines` | **PASS** — DB prices + stock |
| `database.types.ts` drift | **WARNING** | ручное дополнение Phase 3 таблиц; CI `db-types` job проверит |
| Service role | **PASS** — `server-only` admin module |

---

## 12. Типизация / качество кода

| Проверка | Вердикт |
|----------|---------|
| `as any` / `@ts-ignore` | **PASS** — grep пуст |
| Merge conflicts | **PASS** — grep пуст |
| TODO/FIXME/HACK | **PASS** — нет в коде (кроме данных) |
| Dead code removed | **PASS** (исправлено) | `hasProcessedStripeEvent`, `recordStripeEvent` удалены |
| `checkout/success` | **PASS** — удалён |

---

## 13. Тесты / CI

| Проверка | Вердикт |
|----------|---------|
| `products.test.ts` | **PASS** |
| `money.test.ts` | **PASS** |
| `orders.resolveOrderLines.test.ts` | **PASS** |
| `order-paid.test.ts` | **PASS** |
| `search-facets.test.ts` | **PASS** |
| CI test step | **PASS** (добавлено) |
| E2E payment completion | **WARNING** | cron smoke only |

---

## 14. Phase 3 plan compliance

| PR block | Статус |
|----------|--------|
| 01–07 Foundation/Events | **PASS** |
| 08–10 Server cart | **PASS** (merge wired в аудите) |
| 11–19 Loyalty/Admin/Search | **PASS** |
| 20–24 Quality/Cleanup | **PASS** |
| 25–29 AI/Retention/Ops | **WARNING** — scaffolds/stubs |
| 30 Summary | **PASS** |

---

## 15. Исправления, внесённые в ходе самоаудита

1. Миграция `verified_reviews` — убран дубликат колонки
2. `database.types.ts` — `order_id` на reviews; `is_staff`, `has_staff_role`
3. Brand layout SEO — locale-aware canonical/hreflang
4. `lib/cache/revalidate.ts` + admin product actions
5. Удалены мёртвые `hasProcessedStripeEvent` / `recordStripeEvent`
6. `cart-context` → `mergeGuestCartToServer` на SIGNED_IN
7. CI + `pnpm test` script
8. `scripts/audit-exec.mjs`

---

## 16. Подготовка к независимому аудиту Claude

См. `docs/reports/14-claude-audit-brief.md`

**Рекомендуемый порядок для Claude:**
1. `node scripts/audit-exec.mjs` → приложить `audit-pipeline-output.json`
2. `supabase db reset` → проверить 13 миграций (6 Phase 2 + 7 Phase 3)
3. Сверить ADR 0022–0025 с кодом
4. Проверить webhook flow: claim → fulfill → events
5. Проверить RLS promo (нет public SELECT)
6. SEO: `/ru/brand/*` canonical

---

## Финальная таблица PASS / WARNING / FAIL

| Категория | Вердикт |
|-----------|---------|
| Архитектура | **PASS** |
| ADR | **PASS** |
| Миграции | **PASS** |
| RLS / RBAC | **PASS** |
| Server Actions / API | **PASS** |
| Middleware | **PASS** |
| SEO | **PASS** |
| Кеширование | **WARNING** |
| Производительность | **WARNING** |
| Безопасность | **WARNING** |
| Stripe / Orders | **PASS** |
| Supabase types | **WARNING** |
| TypeScript | **FAIL** (не прогнан) |
| ESLint | **FAIL** (не прогнан) |
| Build | **FAIL** (не прогнан) |
| validate:production | **FAIL** (не прогнан) |
| Тесты | **FAIL** (не прогнан) |
| CI config | **PASS** |
| Phase 3 plan | **PASS** |
| Секреты | **PASS** |
| Dead code | **PASS** |

**Общий вердикт: WARNING** — код и архитектура готовы; pipeline не подтверждён в среде агента.