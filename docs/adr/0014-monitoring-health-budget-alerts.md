# ADR-0014: Monitoring — health endpoint, budget alerts, ops checklist

- **Статус:** принят
- **Дата:** 2026-07-03
- **Авторы:** Engineering (Phase 1 task 20)

## Контекст

Аудит 04 §4: нет uptime-мониторинга, health-endpoint, алертов квот (Supabase, AI, Vercel). Roadmap Phase 1 §6: uptime + budget caps. Sentry (ADR-0010) и AI budget cap (ADR-0013) закрывают часть; нужен публичный health и операционный чеклист.

## Решение

1. **`GET /api/health`** — liveness для внешнего uptime (UptimeRobot, Better Stack, Vercel). Без auth: `{ status, version, checks.app }`. `?deep=1` — проверка Supabase `/auth/v1/health`; при `MONITORING_HEALTH_TOKEN` — обязателен `?token=`.
2. **AI budget alerts:** при 50% / 80% / 100% дневного `AI_DAILY_REQUEST_CAP` — `Sentry.captureMessage` с тегами `monitoring.budget=ai` (fallback: structured `console.warn`).
3. **Операционный чеклист (не код):**
   - **Vercel:** Spending Limits + email alerts в Team Settings.
   - **Supabase:** Usage alerts (Auth MAU, DB size, egress) в Dashboard → Settings.
   - **Stripe:** Billing alerts + webhook failure notifications в Dashboard.
   - **Sentry:** alert на `commerce.checkout=true` (ADR-0010) + `monitoring.budget=ai`.
   - **Uptime:** poll `https://<SITE_URL>/api/health` каждые 1–5 мин; deep check 15 мин с token.

## Последствия

- Проще: внешний монитор видит падение до пользователей; AI burn виден в Sentry.
- Сложнее: deep health раскрывает зависимость от Supabase — только с token в prod.
- Затронут Playbook §9, ADR-0010, ADR-0013.

## Альтернативы

- **Синтетический e2e по крону** — Phase 1 task 21 (Playwright), не дублируем здесь.
- **Собственный uptime-сервис** — отклонено: SaaS достаточно на старте.

## Ссылки

Отчёты 04 (§4, §23), 05 (Phase 1 §6), ADR-0010, ADR-0013.