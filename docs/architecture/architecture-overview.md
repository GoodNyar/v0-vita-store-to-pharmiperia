# Architecture Overview

> Краткий обзор Pharmiperia для нового разработчика. Подробности — [ENGINEERING_PLAYBOOK.md](ENGINEERING_PLAYBOOK.md) и [ADR](../adr/README.md).

---

## Продукт

**Pharmiperia** — интернет-аптека (косметика и OTC) для Латвии. v1.0 RC: **LV-only**, EUR, PVN 21%.

**Стек:** Next.js 16 · Supabase · Stripe · Resend · Sentry · `/lv` + `/ru`

---

## Слои репозитория

```
app/[locale]/          Витрина (RSC + ISR)
app/api/               Webhooks, Storefront API v1, cron
app/admin/             Admin RBAC v1
lib/commerce/          Единственный data-access слой (ADR-0004)
lib/orders.ts          Checkout draft + webhook fulfillment
lib/events/            order.paid side-effects
lib/cache/             unstable_cache + revalidateTag
supabase/migrations/   23 миграции (не scripts/)
middleware.ts          Locale + pharm_market cookie
```

---

## Денежный путь (критичный)

```
Каталог → Корзина → Checkout (ƒ dynamic)
  → createDraftOrder (server: market, VAT, shipping)
  → Stripe Embedded Checkout
  → webhook checkout.session.completed
  → fulfillOrderFromCheckoutSession
  → order.paid events (email, stock, loyalty)
```

**Источник факта оплаты:** только Stripe webhook (ADR-0005). UI не пишет `paid`.

---

## Данные

| Хранилище | Назначение |
|-----------|------------|
| Supabase Postgres | Каталог, заказы, корзины, промо, markets |
| RLS | Пользовательские данные; admin через service role |
| Stripe | Платежи, metadata `order_id`, `market_code` |
| Cookie `pharm_market` | Resolved market (middleware → server actions) |

---

## Рендеринг

| Маршрут | Режим | Примечание |
|---------|-------|------------|
| Каталог, PDP, category | ISR `revalidate=3600` | ● в build |
| Checkout | Dynamic `ƒ` | Market-aware server render |
| Storefront API | Dynamic | `?market=lv\|lt\|ee` |

**Ограничение v1.0:** ISR каталог не меняет цену по cookie в runtime — см. [KNOWN_LIMITATIONS KL-1](../release/KNOWN_LIMITATIONS.md#kl-1--per-market-display-pricing-vs-isr-b-2).

---

## Тесты и CI

- **45 unit tests** — `pnpm test` (commerce, money, orders, events)
- **Pre-deploy** — `pnpm validate:production`
- **E2E** — Playwright, env-gated (ADR-0015)

---

## Следующие шаги

1. [ENGINEERING_PLAYBOOK.md](ENGINEERING_PLAYBOOK.md) §1–8
2. [PROJECT_MAP.md](../PROJECT_MAP.md)
3. ADR по вашей области: [adr/README.md](../adr/README.md)