# ADR-0017: Analytics — server purchase + consent-gated client funnel

- **Статус:** принят
- **Дата:** 2026-07-03
- **Авторы:** Engineering (Phase 2 Wave D, PR-15–16)
- **Ревьюеры:** —

## Контекст

Аудит 04: нет e-commerce-событий (view_item, add_to_cart, begin_checkout, purchase), UTM не сохраняются, маркетинг работает вслепую. ADR-0005 фиксирует Stripe webhook как источник факта оплаты — client-side `purchase` дублировал бы revenue и ломал атрибуцию. ADR-0009 требует consent перед аналитическими cookies/скриптами.

## Решение

1. **Server purchase (источник истины):** при `checkout.session.completed` webhook записывает событие `purchase` в таблицу `analytics_events` и связывает `orders.analytics_event_id`. Revenue берётся из `orders.total_cents` после верификации Stripe.
2. **UTM на заказе:** `utm_source`, `utm_medium`, `utm_campaign` захватываются на клиенте (URL → sessionStorage) и сохраняются в `orders` при `createDraftOrder`.
3. **Client funnel (только с consent):** `lib/analytics/client.ts` отправляет `view_item`, `add_to_cart`, `begin_checkout` в GA4 и/или PostHog только при `pharm_consent.analytics === true` **и** `ANALYTICS_ENABLED=true`.
4. **Opt-out по умолчанию:** `ANALYTICS_ENABLED=false` в `.env.example`; без явного включения скрипты не грузятся даже при consent.
5. **Vercel Analytics:** остаётся в `ConsentGatedAnalytics` (ADR-0009), отдельно от GA4/PostHog.

## Последствия

- Проще: один server purchase на заказ; UTM привязаны к order row; откат через env flag.
- Сложнее: двойная интеграция GA4 + PostHog; ручное обновление `database.types.ts` до `db:types` на staging.
- Необратимо: схема `analytics_events` + UTM columns на `orders`.
- Playbook §1.5 (события), §15 (privacy/consent).

## Рассмотренные альтернативы

- **Client-only purchase (gtag purchase на success page)** — отклонено: расхождение с webhook, двойной revenue, пропуск embedded checkout без redirect.
- **Segment / GTM container** — отклонено на Phase 2: лишний процессор и настройка; прямой GA4/PostHog достаточен для v0.
- **Inngest fan-out purchase** — отклонено: <3 подписчиков, webhook side-effect достаточен (master plan § defer).

## Ссылки

- [phase-2-master-plan.md](../reports/phase-2-master-plan.md) PR-15, PR-16
- ADR-0005, ADR-0009
- [04-production-readiness-audit.md](../reports/04-production-readiness-audit.md) § analytics