# ADR-0010: Sentry, error boundaries, алерты чекаута

- **Статус:** принят
- **Дата:** 2026-07-03
- **Авторы:** Engineering (Phase 1 §6)

## Контекст

Аудит 04: нет `error.tsx` / `global-error.tsx`, нет Sentry, денежный путь «слепой» — ошибки Stripe-сессии, embedded checkout и вебхука не видны до жалоб клиентов. Playbook §9: наблюдаемость — часть фичи.

## Решение

1. **Sentry SDK (`@sentry/nextjs`):** инициализация только при наличии DSN (`SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN`) и `SENTRY_ENABLED !== 'false'`. Без DSN — build и CI проходят без Sentry.
2. **Конфигурация:** `instrumentation.ts` (server + edge), `instrumentation-client.ts` (replay on error), `withSentryConfig` в `next.config.mjs` только при DSN; `tunnelRoute: '/monitoring'` (исключён из locale middleware).
3. **Error boundaries:** `app/global-error.tsx`, `app/[locale]/error.tsx`, `app/[locale]/checkout/error.tsx` (lv/ru UI через `RouteError`), `app/not-found.tsx`.
4. **Теги чекаута:** `captureCheckoutError()` ставит `commerce.checkout=true` и `commerce.stage` (`session_create`, `embedded_checkout`, `webhook_fulfill`, `webhook_email`) в `app/actions/stripe.ts`, `components/stripe-checkout.tsx`, `app/api/webhooks/stripe/route.ts`.
5. **Алерты:** в Sentry Dashboard — правило на `commerce.checkout:true` (операционный чеклист, не код). Sample rate traces: 10% prod, 100% dev.

## Последствия

- Проще: единый путь ошибок чекаута; пользователь видит локализованный fallback вместо белого экрана.
- Сложнее: DSN и `SENTRY_AUTH_TOKEN` в CI для source maps; GDPR — Sentry как процессор (уже в privacy ADR-0009).
- Затронут Playbook §9, §15 (чеклист PR).

## Альтернативы

- **Только Vercel Logs** — отклонено: нет группировки, нет client-side, нет алертов по тегам.
- **Всегда включать Sentry в build** — отклонено: ломает локальную разработку и CI без аккаунта.

## Ссылки

Отчёты 04 (§3), 05 (Phase 1 §6), ADR-0005, ADR-0009.