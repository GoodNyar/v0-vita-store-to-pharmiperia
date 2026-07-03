# ADR-0011: Rate limit на публичных API-эндпоинтах

- **Статус:** принят
- **Дата:** 2026-07-03
- **Авторы:** Engineering (Phase 1 task 17)

## Контекст

Аудит 04: `/api/chat` и `/api/recommendations` — открытый прокси к OpenAI без лимитов; риск выжигания бюджета и DDoS. Playbook §10: каждый публичный endpoint — rate limit.

## Решение

1. **`lib/rate-limit/`** — единый helper `enforceRateLimit()` с идентификацией по IP (`x-forwarded-for` / `x-real-ip`).
2. **Upstash Redis** (production): `@upstash/ratelimit` sliding window при `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`.
3. **In-memory fallback** (local/CI без Upstash): per-process лимит — достаточно для dev; в проде Upstash обязателен.
4. **Пресеты:** `api:chat` — 20 req/min; `api:recommendations` — 10 req/min. Ответ `429` + `Retry-After`, `X-RateLimit-*`.
5. **`RATE_LIMIT_ENABLED=false`** — отключение для тестов (не для prod).
6. Stripe webhook не лимитируется по IP (подпись Stripe + идемпотентность ADR-0005).

## Последствия

- Проще: закрыт класс уязвимости «безлимитный AI»; единая точка для новых `/api/*`.
- Сложнее: Upstash как зависимость; captcha на auth — отдельная задача (task 18).
- Затронут Playbook §10, blueprint E2.

## Альтернативы

- **Только in-memory** — отклонено: на Vercel serverless не работает между инстансами.
- **Middleware на все `/api/*`** — отклонено: разные лимиты per-route, webhook исключение.

## Ссылки

Отчёты 02 (§3), 04 (§6, §22), 05 (Phase 1 §10), ADR-0009 (OpenAI как процессор).