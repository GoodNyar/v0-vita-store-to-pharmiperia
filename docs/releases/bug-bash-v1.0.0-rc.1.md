# Bug Bash — v1.0.0-rc.1

> **Дата:** 2026-07-06  
> **Git tag:** `v1.0.0-rc.1`  
> **Целевой рынок:** Латвия (LV-only)  
> **Метод:** Статический code review + анализ миграций/тестов. **Runtime staging не выполнялся** (нет доступа к staging, Stripe test mode, Resend, Turnstile live keys).  
> **Правило:** Код не менялся. Новые функции не добавлялись.

---

## 1. Bug Bash Plan

План составлен на основе:

| Источник | Что покрывает |
|----------|---------------|
| [LAUNCH_CHECKLIST.md](../release/LAUNCH_CHECKLIST.md) §A–B | RC-гейт, сквозные сценарии staging |
| [RELEASE_CHECKLIST.md](../release/RELEASE_CHECKLIST.md) | Pre-tag pipeline, post-tag verify |
| [KNOWN_LIMITATIONS.md](../release/KNOWN_LIMITATIONS.md) | KL-1…KL-5, LV-only acceptance |
| [MASTER_STATUS.md](../release/MASTER_STATUS.md) | Закрытые блокеры аудитов 22–23 |
| [v1.0.0-rc.1.md](../release/v1.0.0-rc.1.md) | Состав RC, денежный путь |
| [ENGINEERING_PLAYBOOK.md](../architecture/ENGINEERING_PLAYBOOK.md) | Server-first, RLS, Stripe webhook, actions |
| ADR (релевантные) | 0005 webhook, 0008 PVN, 0012 Turnstile, 0015 E2E, 0020 Baltic PM, 0022 claim, 0023 cart |

### 1.1 Приоритеты прогона

| Приоритет | Область | Критерий успеха |
|-----------|---------|-----------------|
| **P0** | Checkout → Stripe → webhook → `order.paid` | Один заказ, одна оплата, один email, один stock decrement |
| **P0** | Security денежного пути | Цена/скидка/shipping только с сервера |
| **P1** | Auth cart + merge | Логин не теряет серверную корзину |
| **P1** | Account flows | Реальные заказы, reset password |
| **P2** | SEO / i18n / UX polish | Не блокирует LV-only, но влияет на качество |
| **P3** | Known limitations | Подтвердить, что KL не блокируют LV |

### 1.2 Staging checklist (ещё не выполнен — NOT TESTED)

Из LAUNCH_CHECKLIST §B, требует ручного прогона:

1. `supabase db:reset` — 23 миграции
2. Каталог `/lv` → корзина → checkout → Stripe test card
3. Webhook `checkout.session.completed` → `paid`, `market_code=lv`
4. Email confirmation (Resend staging)
5. `/api/health` — 200
6. Admin orders после оплаты

### 1.3 Автоматизированное покрытие на RC

| Команда | Результат |
|---------|-----------|
| `pnpm typecheck` | ✅ 0 ошибок (MASTER_STATUS) |
| `pnpm lint` | ✅ 0 errors |
| `pnpm test` | ✅ 45/45 |
| `pnpm build` | ✅ exit 0 |
| E2E `e2e/checkout.spec.ts` | ⚠️ До pending draft + Stripe iframe; **нет** paid webhook path |

---

## 2. Матрица сценариев

Легенда: **PASS** — код корректен по review · **FAIL** — дефект · **WARNING** — риск/долг · **NOT TESTED** — нужен runtime staging

### A. Каталог

| # | Сценарий | Статус | Комментарий |
|---|----------|--------|-------------|
| A1 | Главная `/lv`, `/ru` | **WARNING** | RSC + responsive grid; нет page-level `generateMetadata` (наследует root RU defaults) |
| A2 | Категория | **FAIL** | Nested `LangProvider` без `initialLang` ломает `/ru/category/*`; invalid slug → HTTP 200 |
| A3 | Бренд | **WARNING** | Работает; invalid slug — soft 404 (200 + пустой state) |
| A4 | Товар (PDP) | **PASS** | `notFound()` при miss; JSON-LD + metadata |
| A5 | Поиск | **PASS** | `searchCatalogProducts`, facets, Suspense |
| A6 | Пустой поиск | **PASS** | Empty-state с i18n |
| A7 | Фильтры | **WARNING** | Search + category filters работают; default price cap €100 скрывает дорогие товары; `product-filters.tsx` — dead code |
| A8 | Broken image fallback | **FAIL** | Fallback `/placeholder.svg`, файла нет в `public/`; нет `onError` на `next/image` |
| A9 | Mobile layout | **PASS** | `grid-cols-2`, mobile filter sheet на категории |

### B. Корзина

| # | Сценарий | Статус | Комментарий |
|---|----------|--------|-------------|
| B1 | Добавить товар | **PASS** | localStorage v3 + optional server persist |
| B2 | Изменить количество | **WARNING** | Нет stock cap в UI; server clamp 99 |
| B3 | Удалить товар | **PASS** | local + `persistRemoveCartLine` |
| B4 | Очистить корзину | **PASS** | + server clear on `order.paid` |
| B5 | Guest cart | **PASS** | `pharmiperia:v3:cart` only |
| B6 | Auth cart | **WARNING** | Silent persist failures (`void persist…`) |
| B7 | Merge после логина | **FAIL** | `syncLocalCartToServer` upsert **перезаписывает** qty, не суммирует |
| B8 | Refresh страницы | **WARNING** | Auth: flash stale localStorage до server hydrate |
| B9 | localStorage edge cases | **WARNING** | Invalid JSON filtered; delete account clears `v2`, cart — `v3` |

### C. Checkout

| # | Сценарий | Статус | Комментарий |
|---|----------|--------|-------------|
| C1 | Guest checkout | **PASS** | `createDraftOrder` с `userId: null`; drawer требует login — UX inconsistency |
| C2 | Auth checkout | **PASS** | `user?.id` с сервера |
| C3 | Пустая корзина | **PASS** | UI empty state + server throw |
| C4 | Неверные данные формы | **PASS** | `validateForm()` блокирует оплату |
| C5 | Промокод валидный | **PASS** | Client RPC + server re-validate в `createDraftOrder` |
| C6 | Промокод истёкший | **PASS** | RPC `expired` |
| C7 | Промокод с лимитом | **WARNING** | TOCTOU: два checkout могут пройти validate; один fail на consume |
| C8 | Доставка в пакомат | **PASS** | LV `LATVIAN_STATIONS` hardcoded (KL-2 accepted) |
| C9 | Shipping validation | **PASS** | `validateShippingForMarket` по cost из DB |
| C10 | `market = LV` | **PASS** | `resolveMarketFromCookies`, VAT 2100 bps, `orders.market_code` |

### D. Stripe

| # | Сценарий | Статус | Комментарий |
|---|----------|--------|-------------|
| D1 | Создание checkout session | **PASS** | `createCheckoutSession` → draft → embedded session |
| D2 | Правильные суммы | **PASS** | Server prices + `distributeDiscountAcrossLines`; webhook amount check |
| D3 | PVN included | **PASS** | `tax_behavior: inclusive`, `extractInclusiveVatCents` |
| D4 | Payment pending | **PASS** | Draft `status/payment_status: pending` |
| D5 | Webhook completed | **PASS** | `fulfillOrderFromCheckoutSession` → `order.paid` dispatch |
| D6 | Повторный webhook | **PASS** | `claimStripeEvent` + idempotent side effects |
| D7 | Failed payment | **FAIL** | Нет handlers `payment_intent.payment_failed` / async failed |
| D8 | Abandoned payment | **FAIL** | Каждый `fetchClientSecret` создаёт **новый** draft order |
| D9 | Klarna / async PM | **FAIL** | `klarna` в PM list; `payment_status !== 'paid'` → early return; нет `async_payment_succeeded` |
| D10 | Success UI до webhook | **WARNING** | `onComplete` → `clearCart()` + success screen до подтверждения webhook |

### E. Orders

| # | Сценарий | Статус | Комментарий |
|---|----------|--------|-------------|
| E1 | Order row создаётся | **PASS** | `createDraftOrder` → pending |
| E2 | order_items создаются | **PASS** | Server snapshot at checkout |
| E3 | order_number есть | **PASS** | `PH{base36}` UNIQUE |
| E4 | status корректный | **WARNING** | Backend OK; UI maps `paid` → «delivered» |
| E5 | payment_status корректный | **PASS** | Webhook-only update |
| E6 | Email один раз | **PASS** | `confirmation_email_sent_at` atomic claim |
| E7 | Stock один раз | **PASS** | `decrement_stock` + `inventory_adjusted_at` |
| E8 | Loyalty один раз | **WARNING** | UNIQUE index OK; RPC errors только `console.warn` |
| E9 | Runtime E2E paid flow | **NOT TESTED** | Нужен staging + test card + webhook |

### F. Account

| # | Сценарий | Статус | Комментарий |
|---|----------|--------|-------------|
| F1 | Login | **PASS** | Turnstile + `signInWithPassword` |
| F2 | Signup | **PASS** | Email confirmation flow |
| F3 | Logout | **PASS** | `signOut` + redirect |
| F4 | Reset password | **FAIL** | Link `/auth/reset-password` → **404**, route не существует |
| F5 | Account orders | **WARNING** | `/account/orders` — real DB; `/account` hub — `MOCK_ORDERS` |
| F6 | Favorites | **WARNING** | DB sync OK; UI фильтрует static `lib/data`, не Supabase catalog |
| F7 | Addresses | **PASS** | CRUD + RLS `addresses_*_own` |
| F8 | Delete account | **PASS** | Server action + CASCADE/SET NULL |

### G. Security

| # | Сценарий | Статус | Комментарий |
|---|----------|--------|-------------|
| G1 | Подмена цены с клиента | **PASS** | Server re-resolve; webhook amount mismatch throw |
| G2 | Подмена user_id | **PASS** | `user?.id` только с session |
| G3 | Чужой заказ | **PASS** | `.eq('user_id', userId)` + RLS |
| G4 | RLS работает | **PASS** | Статически: policies на orders, profiles, addresses, favorites |
| G5 | Admin routes закрыты | **PASS** | `requireStaff()` в `app/admin/layout.tsx` |
| G6 | API rate limit | **WARNING** | Upstash на AI/storefront/chat; memory fallback; `RATE_LIMIT_ENABLED=false` отключает |
| G7 | CAPTCHA auth flow | **WARNING** | Client/server key mismatch может сломать или обойти Turnstile |
| G8 | AI endpoints | **PASS** | Feature flags + rate limit + daily cap |
| G9 | RLS runtime smoke | **NOT TESTED** | Нужен staging с двумя test users |

### H. SEO

| # | Сценарий | Статус | Комментарий |
|---|----------|--------|-------------|
| H1 | Sitemap | **PASS** | Sharded `generateSitemaps`, tests |
| H2 | Robots | **WARNING** | `/*/search?*` disallowed; bare `/lv/search` — нет |
| H3 | Canonical | **WARNING** | Product/category OK; popular/specials без locale prefix |
| H4 | Hreflang | **WARNING** | Matrix OK; lt/et/en → LV URLs (accepted Phase 6) |
| H5 | Metadata | **WARNING** | Home/search без dedicated metadata; `og-default.jpg` отсутствует |
| H6 | Structured data | **WARNING** | Product OK; category breadcrumb URLs без locale |
| H7 | 404 / not-found | **FAIL** | Product `notFound()` OK; category/brand soft 404; root `not-found.tsx` English-only |

### I. UX

| # | Сценарий | Статус | Комментарий |
|---|----------|--------|-------------|
| I1 | Mobile Safari viewport | **NOT TESTED** | Нужен device/browser |
| I2 | Desktop Chrome | **NOT TESTED** | Нужен browser |
| I3 | Loading states | **FAIL** | Нет `loading.tsx` на catalog routes (кроме search Suspense) |
| I4 | Error states | **PASS** | `app/[locale]/error.tsx` LV/RU + Sentry |
| I5 | Empty states | **PASS** | Search, category, brand, cart, checkout |
| I6 | LV/RU тексты | **WARNING** | Category mobile filters — hardcoded RU; `/ru/category` broken (A2) |
| I7 | Cookie consent | **PASS** | `CookieConsentBanner` + consent-gated analytics; E2E helper |
| I8 | No white screens | **WARNING** | ISR маскирует; DB fail → silent empty grid |
| I9 | Checkout loading | **NOT TESTED** | Stripe iframe на staging |

### J. Known Limitations (KL-1…KL-5)

| ID | Описание | Блокирует LV v1.0? | Severity review | Статус проверки |
|----|----------|-------------------|-----------------|-----------------|
| **KL-1** | ISR catalog vs market display pricing | **Нет** (LV-only, no overrides) | Accepted | **PASS** — код подтверждает ISR `revalidate=3600`; checkout dynamic market-aware |
| **KL-2** | LT/EE parcel stations hardcoded LV | **Нет** | Accepted | **PASS** — `LATVIAN_STATIONS` в checkout; Storefront API для LT/EE |
| **KL-3** | Inventory reservations disabled | **Нет** | Accepted | **PASS** — env flag ≠ `true` |
| **KL-4** | CSP `unsafe-inline` | **Нет** (low debt) | Low | **PASS** — documented deferred |
| **KL-5** | Runtime DB verification pending | **Да для GA**, не для RC tag | **Повышено до High для GA** | **NOT TESTED** — `db:reset` + сквозной checkout на staging обязателен |

**Вывод §J:** KL-1…KL-4 **не блокируют** LV-only RC. KL-5 блокирует **GA / Production Readiness**, не отменяет RC tag.

---

## 3. Реестр багов

### Critical

#### BUG-001 · RU category pages forced to Latvian

| Поле | Значение |
|------|----------|
| **Severity** | Critical |
| **Блокирует v1.0?** | **Да** (bilingual storefront) |
| **Affected files** | `app/[locale]/category/[slug]/page.tsx`, `lib/i18n.tsx` |
| **Repro** | 1. Open `/ru/category/skincare` 2. Observe UI strings in Latvian |
| **Expected** | Russian copy from parent `LangProvider initialLang="ru"` |
| **Actual** | Nested `<LangProvider>` defaults to `initialLang="lv"`, overrides parent context |
| **Suggested fix** | Remove nested provider or pass `initialLang={locale}` from route params |

---

### High

#### BUG-002 · Forgot password → 404

| Поле | Значение |
|------|----------|
| **Severity** | High |
| **Блокирует v1.0?** | **Да** |
| **Affected files** | `app/[locale]/auth/login/page.tsx` (link); missing `auth/reset-password` route + action |
| **Repro** | Login → click «Forgot password» |
| **Expected** | Reset email flow (Supabase `resetPasswordForEmail`) |
| **Actual** | 404 — route does not exist |
| **Suggested fix** | Implement reset-password page + server action, or remove link until ready |

#### BUG-003 · Cart merge overwrites server quantities on login

| Поле | Значение |
|------|----------|
| **Severity** | High |
| **Блокирует v1.0?** | **Да** (auth users) |
| **Affected files** | `components/cart-context.tsx`, `lib/commerce/server-cart.ts` (`syncLocalCartToServer`), `app/actions/cart.ts` |
| **Repro** | 1. Login, add Product A ×3 2. Logout 3. Guest add A ×2 4. Login |
| **Expected** | Merged cart A ×5 |
| **Actual** | Upsert sets quantity to 2; server qty 3 lost |
| **Suggested fix** | Read existing line qty; `quantity = min(99, existing + guest)`; handle merge result errors |

#### BUG-004 · Multiple orphan draft orders on payment retry/abandon

| Поле | Значение |
|------|----------|
| **Severity** | High |
| **Блокирует v1.0?** | **Да** (ops/reporting; risk of duplicate payment confusion) |
| **Affected files** | `components/stripe-checkout.tsx`, `app/actions/stripe.ts` |
| **Repro** | 1. Proceed to payment (draft #1) 2. Close tab or click «Try again» |
| **Expected** | Reuse single draft or cancel superseded drafts |
| **Actual** | Each `fetchClientSecret` calls `createCheckoutSession` → new `PH…` order |
| **Suggested fix** | Pass `orderId` to reuse pending draft; debounce session creation |

#### BUG-005 · Missing `/placeholder.svg` asset

| Поле | Значение |
|------|----------|
| **Severity** | High |
| **Блокирует v1.0?** | **Да** (visual regression on null/broken images) |
| **Affected files** | `lib/commerce/product-mapper.ts`, `components/cart-context.tsx`, `components/product-card.tsx`, `public/` |
| **Repro** | Product with `imageUrl: null` or broken remote URL |
| **Expected** | Visible placeholder |
| **Actual** | 404 on `/placeholder.svg`; broken URLs show Next.js broken image |
| **Suggested fix** | Add `public/placeholder.svg`; shared `<CatalogImage onError={…}>` |

#### BUG-006 · Invalid category URL returns HTTP 200

| Поле | Значение |
|------|----------|
| **Severity** | High |
| **Блокирует v1.0?** | **Да** (SEO + UX) |
| **Affected files** | `app/[locale]/category/[slug]/page.tsx`, `components/category-page-content.tsx` |
| **Repro** | `/lv/category/nonexistent-slug` |
| **Expected** | `notFound()` → HTTP 404 |
| **Actual** | Empty products + «category not found» UI at 200; indexable metadata |
| **Suggested fix** | Validate slug against taxonomy/DB; `notFound()` before render |

#### BUG-007 · Klarna/async payments never fulfilled

| Поле | Значение |
|------|----------|
| **Severity** | High (conditional: default Baltic PMs **enabled**) |
| **Блокирует v1.0?** | **Да** if `STRIPE_BALTIC_METHODS_ENABLED` ≠ `false` |
| **Affected files** | `lib/stripe/payment-methods.ts`, `app/api/webhooks/stripe/route.ts`, `lib/orders.ts` |
| **Repro** | Pay with Klarna → `checkout.session.completed` with `payment_status: unpaid` |
| **Expected** | Order fulfilled on `async_payment_succeeded` |
| **Actual** | Early return at `payment_status !== 'paid'`; no async webhook handler |
| **Suggested fix** | Add `checkout.session.async_payment_succeeded` handler per ADR-0005; or disable Klarna until ready |

---

### Medium

#### BUG-008 · Account hub shows mock orders and fake loyalty points

| **Files** | `app/[locale]/account/page.tsx` |
| **Repro** | Login → `/account` |
| **Expected** | Real orders from `listOrdersForUser` |
| **Actual** | `MOCK_ORDERS`, `bonusPoints: 150` hardcoded |
| **Blocks v1.0?** | No, but misleading primary account UX |

#### BUG-009 · Success UI + cart clear before webhook confirmation

| **Files** | `checkout-content.tsx`, `stripe-checkout.tsx` |
| **Repro** | Complete Stripe UI; webhook delayed/fails |
| **Expected** | Poll order status or show «processing» |
| **Actual** | Success screen + empty cart while order still `pending` |
| **Blocks v1.0?** | No |

#### BUG-010 · Failed payments leave order `pending` forever

| **Files** | `app/api/webhooks/stripe/route.ts` |
| **Repro** | Card declined |
| **Expected** | `payment_status: failed` or cleanup |
| **Actual** | No `payment_intent.payment_failed` handler |
| **Blocks v1.0?** | No (soft ops debt)

#### BUG-011 · Default category price filter caps at €100

| **Files** | `components/category-page-content.tsx` |
| **Repro** | Load category with products >€100 |
| **Expected** | All products visible until user filters |
| **Actual** | `priceRange` default `[0, 100]` always applied |
| **Blocks v1.0?** | Conditional (if catalog has items >€100)

#### BUG-012 · Hardcoded Russian strings on category mobile UI

| **Files** | `components/category-page-content.tsx` |
| **Blocks v1.0?** | No

#### BUG-013 · CAPTCHA client/server key mismatch

| **Files** | `components/auth-captcha.tsx`, `lib/captcha/shared.ts` |
| **Blocks v1.0?** | No (ops config risk)

#### BUG-014 · Rate limit memory fallback in serverless

| **Files** | `lib/rate-limit/index.ts` |
| **Blocks v1.0?** | No (ops must set Upstash)

#### BUG-015 · No catalog `loading.tsx`

| **Files** | `app/[locale]/category/`, `brand/`, `products/`, `page.tsx` |
| **Blocks v1.0?** | No

#### BUG-016 · Silent DB failure → empty catalog grids

| **Files** | `lib/commerce/catalog-source.ts` |
| **Blocks v1.0?** | No

---

### Low

| ID | Summary | Files | Blocks v1.0? |
|----|---------|-------|--------------|
| BUG-017 | `paid` status shown as «delivered» in orders list | `app/[locale]/account/orders/page.tsx` | No |
| BUG-018 | Loyalty RPC failure only logged | `lib/events/order-paid.ts` | No |
| BUG-019 | Account delete clears cart `v2`, not `v3` | `app/[locale]/account/settings/page.tsx` | No |
| BUG-020 | Guest checkout via URL vs drawer login gate | `cart-drawer.tsx` vs checkout page | No |
| BUG-021 | Shipping validated by cost only, not method code | `lib/commerce/market-shipping-core.ts` | No |
| BUG-022 | Favorites UI uses static catalog | `app/[locale]/account/favorites/page.tsx` | No |
| BUG-023 | Invalid brand slug soft 404 | `app/[locale]/brand/[slug]/page.tsx` | No |
| BUG-024 | SEO: missing `og-default.jpg`, non-localized canonicals | `app/layout.tsx`, popular/specials layouts | No |
| BUG-025 | Root `not-found.tsx` English-only | `app/not-found.tsx` | No |
| BUG-026 | `product-filters.tsx` dead code | `components/product-filters.tsx` | No |

---

## 4. Сводка по severity

| Severity | Count | IDs |
|----------|-------|-----|
| **Critical** | 1 | BUG-001 |
| **High** | 6 | BUG-002 … BUG-007 |
| **Medium** | 9 | BUG-008 … BUG-016 |
| **Low** | 10 | BUG-017 … BUG-026 |

---

## 5. Bug Bash Verdict

### **CONDITIONAL PASS**

| Критерий | Оценка |
|----------|--------|
| RC tag `v1.0.0-rc.1` зафиксирован | ✅ |
| Pipeline green (typecheck/lint/test/build) | ✅ |
| Денежный путь architecturally sound | ✅ Server pricing, webhook claim, idempotent `order.paid` |
| Сквозной staging прогон | ❌ NOT TESTED (KL-5) |
| Customer-facing blockers | ❌ 1 Critical + 6 High |

**Интерпретация:** RC **пригоден для staging Bug Bash** и исправлений в BUGFIX-01. **Не пригоден** для GA / live payments без закрытия P0 багов и staging sign-off.

---

## 6. BUGFIX-01 — scope для Grok

### P0 — блокируют v1.0 GA

| # | Bug | Задача |
|---|-----|--------|
| 1 | BUG-001 | Убрать/исправить nested `LangProvider` на category routes |
| 2 | BUG-002 | Реализовать reset password flow (или убрать ссылку до готовности) |
| 3 | BUG-003 | Additive cart merge в `syncLocalCartToServer` |
| 4 | BUG-004 | Reuse pending draft order при retry Stripe session |
| 5 | BUG-005 | Добавить `public/placeholder.svg` + image `onError` fallback |
| 6 | BUG-006 | `notFound()` для invalid category slug |
| 7 | BUG-007 | Async payment webhooks **или** `STRIPE_BALTIC_METHODS_ENABLED=false` до handler |

### P1 — до GA, не блокируют staging retest

| # | Bug | Задача |
|---|-----|--------|
| 8 | BUG-008 | Account hub → real orders + loyalty from DB |
| 9 | BUG-009 | Post-payment polling / «processing» state |
| 10 | BUG-010 | Failed payment webhook → `payment_status: failed` |
| 11 | BUG-011 | Dynamic price filter max from catalog |

### P2 — polish (post-GA acceptable)

BUG-012…BUG-026 — i18n strings, SEO canonicals, loading.tsx, favorites catalog source, not-found localization.

### Обязательный staging gate (не код)

- `supabase db:reset` + миграции
- Stripe test card → webhook → email → account orders
- Turnstile + Upstash keys parity в staging env
- Sign-off QA в RELEASE_CHECKLIST

---

## 7. Production Readiness

### **Нет — переходить к Production Readiness рано**

| Гейт | Статус |
|------|--------|
| BUGFIX-01 P0 | ❌ Не выполнен |
| Staging Bug Bash (LAUNCH_CHECKLIST §B) | ❌ NOT TESTED |
| KL-5 runtime DB verification | ❌ Pending |
| Ops checklist (LAUNCH_CHECKLIST §C) | ❌ Не начат (expected pre-GA) |

**Можно:** deploy RC на **staging**, прогнать ручной checklist, затем BUGFIX-01.  
**Нельзя:** promote to production / live Stripe keys до P0 fixes + QA sign-off.

---

## 8. Ссылки

- [LAUNCH_CHECKLIST.md](../release/LAUNCH_CHECKLIST.md)
- [KNOWN_LIMITATIONS.md](../release/KNOWN_LIMITATIONS.md)
- [Отчёт 23 — Final RC Audit](../reports/audits/23-final-release-candidate-audit.md)
- [Отчёт 22 — Phase 6 Audit](../reports/audits/22-nezavisimyj-audit-phase-6.md)
- ADR: [0005](../adr/0005-stripe-webhook-istochnik-fakta-oplaty.md), [0020](../adr/0020-baltic-stripe-payment-methods.md), [0022](../adr/0022-event-handlers-webhook-claim.md), [0023](../adr/0023-server-side-cart.md)

---

*Документ создан в рамках Bug Bash RC v1.0.0-rc.1. Код приложения не изменялся.*