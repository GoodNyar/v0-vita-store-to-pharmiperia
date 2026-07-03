# ADR-0019: Inventory decrement RPC + webhook idempotency

- **Статус:** принят
- **Дата:** 2026-07-03
- **Авторы:** Engineering (Phase 2 Wave D, PR-18)
- **Ревьюеры:** —

## Контекст

Находка H1 (master plan): `order_items.product_id` был null — исправлено в PR-05. Без декремента стока продажа сверх остатка возможна. Webhook Stripe уже идемпотентен через `stripe_webhook_events` (ADR-0005), но side-effect декремента должен быть идемпотентен отдельно: повторная доставка event или partial failure не должны списывать сток дважды.

## Решение

1. **RPC `decrement_stock(p_order_id UUID)`:** `SECURITY DEFINER`, в одной транзакции:
   - если `orders.inventory_adjusted_at IS NOT NULL` → return success (no-op);
   - иначе для каждой строки `order_items` с `product_id` уменьшить `products.stock_quantity` на `quantity`;
   - при `stock_quantity < 0` после списания — raise exception (не допускать oversell post-payment без manual ops);
   - установить `orders.inventory_adjusted_at = NOW()`.
2. **Вызов из webhook:** после `fulfillOrderFromCheckoutSession` (payment confirmed), до `recordStripeEvent`. При `alreadyPaid: true` — всё равно вызвать RPC (идемпотентен).
3. **Порядок side-effects:** fulfill payment → decrement stock → record purchase analytics → email (email failure не откатывает stock).
4. **Откат:** не вызывать RPC; column `inventory_adjusted_at` остаётся null.

## Последствия

- Проще: атомарное списание в Postgres; повтор webhook безопасен.
- Сложнее: race при двух одновременных заказах на последний SKU — последний платёж упадёт на RPC; нужен ops процесс refund.
- Необратимо: `inventory_adjusted_at` marker на orders.
- Playbook §4 (inventory), ADR-0005.

## Рассмотренные альтернативы

- **Decrement в application code (TS loop)** — отклонено: не атомарно, сложнее идемпотентность.
- **Trigger на order_items INSERT** — отклонено: списание до оплаты (draft orders).
- **Reserved inventory at draft** — отклонено на Phase 2: нужна server cart + TTL holds.

## Ссылки

- [phase-2-master-plan.md](../reports/phase-2-master-plan.md) PR-05, PR-18
- ADR-0005
- Milestone M5: stock decrement on staging test order