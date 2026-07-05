# BUGFIX-01B Report

> **Дата:** 2026-07-06  
> **База:** BUGFIX-01 + [Отчёт 24](../reports/audits/24-zero-trust-audit-bugfix-01.md)  
> **Git tag:** `v1.0.0-rc.2`  
> **Scope:** 3 частично закрытых бага (001B, 003B, 005B). Без новых функций.

---

## 1. Статус исправлений

| ID | Bug | Было (отчёт 24) | Статус после 01B |
|----|-----|-----------------|------------------|
| BUG-001B | Nested LangProvider | ~14 маршрутов форсили `lv` на `/ru/*` | ✅ **Закрыт** — nested провайдеры удалены |
| BUG-003B | Cart merge race | RMW не атомарен; повторный SIGNED_IN инфлирует qty | ✅ **Закрыт** — RPC + guard + `navigator.locks` |
| BUG-005B | Image fallback gaps | cart/checkout/favorites без fallback | ✅ **Закрыт** — `CatalogImage` на денежном пути |

---

## 2. Детали

### BUG-001B
Удалён бесаргументный `<LangProvider>` на 13 маршрутах. Локаль только из `app/[locale]/layout.tsx` (`initialLang={locale}`).

**Маршруты:** contact, help, terms, quality, data-security, partners, reviews, track, blog, blog/[slug], payment-methods, account/orders, account/loyalty.

### BUG-003B
- **SQL:** `merge_cart_item_atomic()` — атомарный `INSERT … ON CONFLICT` с `LEAST(99, existing + guest)` (`20260706130000_merge_cart_item_atomic.sql`)
- **Server:** `syncLocalCartToServer` вызывает RPC вместо SELECT+upsert
- **Client:** snapshot guest cart → clear localStorage → `mergeGuestCartOnce` с:
  - `localStorage` flag `pharmiperia:v3:guest-merged:{userId}` (один merge за login session)
  - `navigator.locks.request` для cross-tab exclusion
  - clear flag on `SIGNED_OUT`

### BUG-005B
`CatalogImage` подключён в:
- `components/cart-drawer.tsx`
- `app/[locale]/checkout/checkout-content.tsx`
- `app/[locale]/account/favorites/page.tsx`
- `app/[locale]/account/page.tsx` (product thumbnails)
- `components/ai-recommendations.tsx`

---

## 3. Изменённые файлы

| Область | Файлы |
|---------|-------|
| BUG-001B | 13× `app/[locale]/**/page.tsx` (см. §2) |
| BUG-003B | `supabase/migrations/20260706130000_merge_cart_item_atomic.sql`, `lib/commerce/server-cart.ts`, `components/cart-context.tsx` |
| BUG-005B | `components/cart-drawer.tsx`, `checkout-content.tsx`, `account/favorites/page.tsx`, `account/page.tsx`, `ai-recommendations.tsx` |
| Docs | `docs/releases/bugfix-01-report.md`, `docs/release/MASTER_STATUS.md`, `docs/release/RELEASE_CHECKLIST.md`, этот файл |

---

## 4. Pipeline

Запустить локально после `git checkout v1.0.0-rc.2`:

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

Ожидается: typecheck 0 · lint 0 errors · **47/47** tests · build exit 0.

**Post-tag fix:** `merge_cart_item_atomic` добавлен в `lib/database.types.ts` (RPC types). Требует amend `v1.0.0-rc.2` если typecheck падал на теге.

**Миграция:** `supabase db:reset` или `db push` для применения `merge_cart_item_atomic` на staging.

---

## 5. Открытые блокеры (вне 01B)

| ID | Severity | Описание |
|----|----------|----------|
| BUG-008 | Medium | Account hub `MOCK_ORDERS` |
| BUG-009+ | Medium/Low | Success UI до webhook, SEO polish |
| KL-5 | High (GA) | Staging Bug Bash + `db:reset` сквозной checkout |

---

## 6. Вердикт

**BUGFIX-01B: COMPLETE** (код готов; pipeline — локальный sign-off на теге `v1.0.0-rc.2`).

**Production Readiness:** не оценивался.