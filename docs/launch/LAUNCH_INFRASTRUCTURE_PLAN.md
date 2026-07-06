# Launch Infrastructure Plan — Pharmiperia v1.0

> **Версия:** 1.0  
> **Дата:** 2026-07-06  
> **RC:** `v1.0.0-rc.2`  
> **Аудит:** CONDITIONAL PASS — инженерных блокеров нет

---

## Цель этапа

Подготовить production-инфраструктуру для **LV-only v1.0** на домене **pharm.lv**, чтобы владелец проекта мог по чеклисту настроить все внешние сервисы без изменения кода приложения.

---

## Scope

### В scope (этот pack)

| Область | Сервис | Документ |
|---------|--------|----------|
| DNS | NIC.lv / Cloudflare | [DNS_RECORDS.md](./DNS_RECORDS.md) |
| Корпоративная почта | Google Workspace (рекоменд.) | [EMAIL_SETUP.md](./EMAIL_SETUP.md) |
| Transactional email | Resend | [RESEND_SETUP.md](./RESEND_SETUP.md) |
| Payments | Stripe Live | [STRIPE_LIVE_SETUP.md](./STRIPE_LIVE_SETUP.md) |
| Hosting | Vercel Production | [VERCEL_PRODUCTION_SETUP.md](./VERCEL_PRODUCTION_SETUP.md) |
| Database + Auth | Supabase Production (EU) | [SUPABASE_PRODUCTION_SETUP.md](./SUPABASE_PRODUCTION_SETUP.md) |
| Error tracking | Sentry | [SENTRY_SETUP.md](./SENTRY_SETUP.md) |
| SEO + Analytics | GSC, GA4/PostHog | [ANALYTICS_SEARCH_CONSOLE_SETUP.md](./ANALYTICS_SEARCH_CONSOLE_SETUP.md) |
| Uptime | Health + external monitor | [MONITORING_SETUP.md](./MONITORING_SETUP.md) |

### Out of scope (не меняем на этом этапе)

- Новые функции приложения
- Baltic/Klarna payment methods (`STRIPE_BALTIC_METHODS_ENABLED` остаётся **unset/false**)
- Мульти-рынок LT/EE
- Перенос регистратора домена (остаётся NIC.lv)

---

## Зависимости между задачами

```
DNS (A/CNAME для pharm.lv)
  ├── Email MX/SPF/DKIM/DMARC
  │     ├── Resend domain verify
  │     └── Supabase Auth SMTP (Resend)
  ├── Vercel custom domain SSL
  └── Google Search Console verify

Supabase Production (EU)
  ├── 25 migrations applied
  ├── RLS verified
  └── Auth redirect URLs → pharm.lv

Vercel Production env
  ├── All secrets from Stripe/Supabase/Resend/Sentry
  └── Deploy tag v1.0.0-rc.2

Stripe Live
  └── Webhook → https://pharm.lv/api/webhooks/stripe
        (требует working production deploy)
```

---

## Рекомендуемый таймлайн

| День | Задачи | Блокирует |
|------|--------|-----------|
| D0 | DNS A/CNAME на Vercel (вариант A, NIC.lv) | Всё остальное |
| D0–D1 | Google Workspace + MX/SPF/DKIM | Resend, support inbox |
| D1 | Resend domain verify + test email | Order confirmations |
| D1–D2 | Supabase EU project + migrations + seed | Checkout, auth |
| D2 | Vercel production env + domain + deploy rc.2 | Stripe webhook test |
| D2–D3 | Stripe Live + webhook + test payment | Revenue |
| D3 | Sentry + monitoring + GSC | Observability |
| D4 | Analytics (после cookie consent live) | Marketing data |
| D5 | Final MANUAL_ACTIONS_CHECKLIST review | Go-live |

---

## Production env — сводная таблица

Скопируйте в Vercel **Production** (полный список — в [VERCEL_PRODUCTION_SETUP.md](./VERCEL_PRODUCTION_SETUP.md)):

| Переменная | Пример значения | Источник |
|------------|-----------------|----------|
| `NEXT_PUBLIC_SITE_URL` | `https://pharm.lv` | Фиксировано |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase Dashboard (secret) |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe Dashboard (Live) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Stripe Dashboard (Live) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe Webhook endpoint |
| `RESEND_API_KEY` | `re_...` | Resend Dashboard |
| `EMAIL_FROM` | `Pharm.lv <orders@pharm.lv>` | Фиксировано |
| `EMAIL_ENABLED` | `true` | Фиксировано |
| `AUTH_EMAIL_ADDRESS` | `noreply@pharm.lv` | Supabase SMTP sender |
| `SENTRY_DSN` | `https://...@sentry.io/...` | Sentry Project |
| `NEXT_PUBLIC_SENTRY_DSN` | (same as SENTRY_DSN) | Sentry Project |
| `SENTRY_ENVIRONMENT` | `production` | Фиксировано |
| `MONITORING_HEALTH_TOKEN` | `<random 32+ chars>` | Сгенерировать |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `true` | После consent banner live |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | `G-XXXXXXXX` | Google Analytics |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x...` | Cloudflare Turnstile |
| `TURNSTILE_SECRET_KEY` | `0x...` | Cloudflare Turnstile |
| `UPSTASH_REDIS_REST_URL` | `https://...` | Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | `...` | Upstash |

**Не задавать в production v1.0:**

| Переменная | Причина |
|------------|---------|
| `STRIPE_BALTIC_METHODS_ENABLED` | Baltic/Klarna требуют async payment flow — не готов для v1.0 |

---

## Критерии готовности этапа

- [ ] `https://pharm.lv` открывается с валидным SSL
- [ ] `GET https://pharm.lv/api/health` → `200`
- [ ] Supabase: 25/25 migrations, RLS smoke test pass
- [ ] Stripe Live: test payment → order `paid` via webhook
- [ ] Resend: order confirmation delivered to inbox
- [ ] Sentry: test error visible in production project
- [ ] GSC: sitemap submitted, no critical coverage errors
- [ ] Uptime monitor: alert channel tested
- [ ] [MANUAL_ACTIONS_CHECKLIST.md](./MANUAL_ACTIONS_CHECKLIST.md) — все пункты `Done`

---

## Когда выполнять: сейчас или после каталога?

**Рекомендация: начинать сейчас, параллельно с наполнением каталога.**

| Можно делать сейчас (не зависит от каталога) | Лучше после seed каталога |
|----------------------------------------------|---------------------------|
| DNS, email, Resend verify | Stripe live test payment (нужен товар) |
| Supabase project + migrations | Staging Bug Bash end-to-end |
| Vercel domain + env skeleton | GSC indexing (пустые страницы — waste) |
| Sentry, monitoring setup | Go-live announcement |

DNS-пропагация и верификации Resend/Workspace занимают 24–72 часа. Их лучше запустить заранее, пока идёт seed каталога и загрузка изображений.

**Go-live** (открытие сайта публично) — после: seed каталога, staging Bug Bash, live payment smoke test.
