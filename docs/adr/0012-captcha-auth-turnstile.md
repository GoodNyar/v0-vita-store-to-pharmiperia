# ADR-0012: CAPTCHA на auth — Cloudflare Turnstile

- **Статус:** принят
- **Дата:** 2026-07-03
- **Авторы:** Engineering (Phase 1 task 18)

## Контекст

Аудит 04: нет captcha на auth; Playbook §10 — auth-поверхности защищены captcha. Прямой `signInWithPassword` / `signUp` с клиента обходил серверную проверку.

## Решение

1. **Cloudflare Turnstile** — виджет на login/sign-up; серверная верификация через Siteverify API.
2. **Server actions** (`app/actions/auth.ts`): `signInWithCaptcha`, `signUpWithCaptcha`, `beginGoogleOAuth` — captcha проверяется до вызова Supabase Auth.
3. **Opt-in:** при отсутствии `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` captcha скрыта и пропускается (`CAPTCHA_ENABLED=false` для тестов).
4. **OAuth Google:** captcha обязательна перед редиректом (тот же токен, что для email/password).
5. **GDPR:** Cloudflare Turnstile — процессор при входе; упомянуть в privacy (операционный чеклист).

## Последствия

- Проще: брутфорс signup/login затруднён; единый путь auth через server actions + cookies Supabase SSR.
- Сложнее: ключи Turnstile в env; UX +1 шаг на форме.
- Затронут Playbook §10, ADR-0009 (процессоры).

## Альтернативы

- **reCAPTCHA** — отклонено: тяжелее UX, больше privacy-вопросов в ЕС.
- **Captcha только на sign-up** — отклонено: login тоже вектор брутфорса.

## Ссылки

Отчёты 04 (§6), 05 (Phase 1 §10), ADR-0011, ADR-0009.