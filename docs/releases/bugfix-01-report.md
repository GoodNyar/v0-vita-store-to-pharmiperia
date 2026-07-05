# BUGFIX-01 Report

> **Дата:** 2026-07-06  
> **База:** `v1.0.0-rc.1` + Bug Bash `docs/releases/bug-bash-v1.0.0-rc.1.md`  
> **Scope:** P0/P1 из BUGFIX-01 (7 пунктов). Без новых функций.

---

## 1. Статус исправлений

| # | Bug | Статус | Комментарий |
|---|-----|--------|-------------|
| 1 | BUG-001 LangProvider category | ✅ **Закрыт** (01B) | Category в 01; остальные 13 маршрутов — [BUGFIX-01B](bugfix-01b-report.md) |
| 2 | BUG-002 Reset password 404 | ✅ **Закрыт** | `/[locale]/auth/reset-password` + `/[locale]/auth/update-password` + server actions |
| 3 | BUG-003 Additive cart merge | ✅ **Закрыт** (01B) | Additive merge в 01; атомарный RPC + anti-replay — [BUGFIX-01B](bugfix-01b-report.md) |
| 4 | BUG-004 Orphan draft orders | ✅ **Закрыт** | `prepareDraftOrder` + `existingOrderId` в Stripe checkout |
| 5 | BUG-005 placeholder.svg | ✅ **Закрыт** (01B) | Каталог в 01; cart/checkout/favorites — [BUGFIX-01B](bugfix-01b-report.md) |
| 6 | BUG-006 invalid category 200 | ✅ **Закрыт** | `notFound()` для slug ∉ taxonomy |
| 7 | BUG-007 Klarna/Baltic PM | ✅ **Закрыт** | Baltic PMs opt-in (`STRIPE_BALTIC_METHODS_ENABLED=true`); default `card` only |

---

## 2. Изменённые файлы

### BUG-001, BUG-006
- `app/[locale]/category/[slug]/page.tsx`

### BUG-002
- `app/actions/auth.ts`
- `app/[locale]/auth/login/page.tsx`
- `app/[locale]/auth/reset-password/page.tsx` *(new)*
- `app/[locale]/auth/update-password/page.tsx` *(new)*
- `lib/i18n/translations.ts`

### BUG-003
- `lib/commerce/server-cart.ts`

### BUG-004
- `lib/orders.ts`
- `app/actions/stripe.ts`
- `components/stripe-checkout.tsx`
- `app/[locale]/checkout/checkout-content.tsx`

### BUG-005
- `public/placeholder.svg` *(new)*
- `components/catalog-image.tsx` *(new)*
- `components/product-card.tsx`
- `components/category-page-content.tsx`
- `components/product-page-content.tsx`
- `components/search-page-content.tsx`

### BUG-007
- `lib/stripe/payment-methods.ts`
- `lib/stripe/payment-methods.test.ts` *(new)*

### Tracking
- `docs/releases/bugfix-01-checklist.md` *(new)*
- `docs/releases/bugfix-01-report.md` *(this file)*

---

## 3. Тесты и pipeline

| Команда | Статус | Результат |
|---------|--------|-----------|
| `pnpm typecheck` | ✅ **PASS** | 0 errors |
| `pnpm test` | ✅ **PASS** | **47/47** (45 + 2 payment-methods) |
| `pnpm build` | ✅ **PASS** | exit 0; новые routes: `reset-password`, `update-password` |

Подтверждено локально (2026-07-06).

**Post-report fix:** `payment-methods.test.ts` переведён с vitest на `node:test` и добавлен в `test:commerce` script.

---

## 4. Детали по багам

### BUG-001
Убраны вложенные `<LangProvider>` на category routes. Локаль наследуется из `app/[locale]/layout.tsx` (`initialLang={locale}`).

### BUG-002
- `requestPasswordResetWithCaptcha` → Supabase `resetPasswordForEmail`
- Redirect: `/auth/callback?next=/{locale}/auth/update-password`
- `updatePasswordWithCaptcha` → `auth.updateUser({ password })`
- Login link: `localizedPath("/auth/reset-password")`

### BUG-003
При merge: `quantity = min(99, serverQty + guestQty)` вместо перезаписи guest qty.

### BUG-004
- `prepareDraftOrder()` пробует `tryReusePendingDraftOrder()` если передан `existingOrderId`
- Reuse только для `pending/pending` + ownership (user_id или guest email match)
- `StripeCheckout` передаёт `preparedOrder?.orderId` при retry

### BUG-005
- SVG placeholder в `public/`
- `CatalogImage` fallback на `/placeholder.svg` при null src или load error
- Подключён в product-card, category, search, PDP

### BUG-006
`isValidCategorySlug()` — `brands` или `categories[].id`; иначе `notFound()`.

### BUG-007
`isBalticPaymentMethodsEnabled()` теперь `=== 'true'` (opt-in). По умолчанию checkout — **card only**.

---

## 5. Открытые блокеры (вне BUGFIX-01)

Следующие пункты из Bug Bash **не входили** в scope и остаются открытыми:

| ID | Severity | Описание |
|----|----------|----------|
| BUG-008 | Medium | Account hub `MOCK_ORDERS` |
| BUG-009 | Medium | Success UI до webhook |
| BUG-010 | Medium | Failed payment status |
| BUG-011+ | Low/Medium | SEO, loading.tsx, i18n polish, etc. |
| KL-5 | High (GA) | Staging `db:reset` + сквозной checkout NOT TESTED |
| LAUNCH_CHECKLIST §B | — | Staging Bug Bash не выполнен |

---

## 6. Вердикт

**BUGFIX-01 P0/P1: COMPLETE** — код + pipeline подтверждены локально.

**Production Readiness:** не оценивался — ждём следующую команду.

**Следующий шаг (по запросу):** локальный `pnpm typecheck && pnpm test && pnpm build` → staging Bug Bash → P2 polish (BUG-008+).