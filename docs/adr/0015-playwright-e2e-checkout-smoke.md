# ADR-0015: Playwright e2e — smoke checkout critical path

- **Статус:** принят
- **Дата:** 2026-07-03
- **Авторы:** Engineering (Phase 1 task 21)

## Контекст

Аудит 04 §8: тестов нет; Playbook §9 требует e2e на critical path (каталог → корзина → оплата → заказ). ADR-0005: факт оплаты — только Stripe webhook; UI не маркирует заказ paid. Нужен воспроизводимый smoke без обязательного `stripe listen` в CI.

## Решение

1. **Playwright** (`@playwright/test`) в `e2e/`, конфиг `playwright.config.ts`, скрипты `pnpm test:e2e`.
2. **Smoke-сценарий** `e2e/checkout.spec.ts`:
   - `/lv` → «Pievienot grozam» → `/lv/checkout` → форма → шаг оплаты;
   - видим `#stripe-checkout` + iframe Stripe Embedded Checkout;
   - через `SUPABASE_SERVICE_ROLE_KEY` — заказ в `orders` с `payment_status: pending` (draft при `createCheckoutSession`).
3. **Gating:** `E2E_ENABLED=true` + реальные Supabase/Stripe test keys. Без флага тесты **skip** (CI без секретов проходит).
4. **Cookie banner:** pre-seed `pharm_consent` + fallback клик «Tikai nepieciešamās».
5. **Полный paid-flow** (карта 4242 + webhook) — вне scope Phase 1 smoke; для staging/cron с `stripe listen` или Dashboard test webhooks.

## Последствия

- Проще: регрессии чекаута ловятся до деплоя; CI остаётся без секретов.
- Сложнее: локальный прогон требует `.env.local`, Chromium (`pnpm test:e2e:install`), живой Supabase.
- Затронут Playbook §9, ADR-0005, ADR-0014 (синтетический cron — тот же сценарий).

## Альтернативы

- **Cypress** — отклонено: Playbook уже указывает Playwright.
- **Обязательный e2e в CI без секретов** — отклонено: mock Stripe/Supabase не проверяет интеграцию.

## Ссылки

Отчёты 04 (§8), 05 (Phase 1 §6), 06 (Blueprint e2e), ADR-0005, ADR-0014.