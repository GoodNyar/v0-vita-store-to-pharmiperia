# ADR-0024: Loyalty accrual on order.paid

- **Статус:** принят
- **Дата:** 2026-07-04

## Решение

RPC `accrue_loyalty_for_order` — 1 point per EUR (floor), idempotent по `loyalty_transactions.order_id`. Вызывается из `lib/events/order-paid.ts` после email/stock.