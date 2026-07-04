# ADR-0022: Event handlers + atomic webhook claim

- **Статус:** принят
- **Дата:** 2026-07-04

## Контекст

Stripe webhook выполнял side-effects inline; идемпотентность check→insert (M-10) допускала TOCTOU при параллельной доставке.

## Решение

1. `claimStripeEvent` — INSERT в `stripe_webhook_events` с unique `id`; duplicate → 200 без обработки.
2. При ошибке обработки после claim — `releaseStripeEventClaim` удаляет строку, чтобы Stripe retry мог повторить обработку (500 → release → retry → re-claim).
3. `lib/events` — `dispatchCommerceEvent` для `order.paid`: email, stock, loyalty.
4. Webhook route только verify → claim → fulfill → dispatch; catch → release claim.

## Последствия

- Проще тестировать и расширять (Inngest позже подписывается на те же handlers).
- Side-effect порядок зафиксирован в `order-paid.ts`.