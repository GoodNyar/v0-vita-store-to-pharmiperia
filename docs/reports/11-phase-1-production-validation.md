# Отчёт 11 — Phase 1 Production Validation

> Дата: 2026-07-03 · Задача Roadmap: 22/22 · Скрипт: `pnpm validate:production`

## Вердикт

| Область | Статус | Комментарий |
|---------|--------|-------------|
| **Phase 1 engineering (код)** | ✅ **COMPLETE** | 22/22 задач, коммиты `94021ab`…`1d3e2da` |
| **Автоматические гейты** | ✅ **PASS** | `validate:production` + `tsc` + `next build` |
| **Запуск в прод (ops)** | 🟠 **CONDITIONAL GO** | DNS, live Stripe, SMTP verify, uptime — вручную |

**Итог:** код готов к деплою на `pharm.lv` через env; **приём платежей** — только после ops-чеклиста ниже.

---

## Phase 1 Checklist (22/22)

| # | Задача | Статус |
|---|--------|--------|
| 1 | Git Repository | ✅ |
| 2 | CI/CD | ✅ |
| 3 | Production build (typecheck) | ✅ |
| 4 | Stripe lazy init | ✅ |
| 5 | Stripe Webhook | ✅ |
| 6 | Server Orders | ✅ |
| 7 | Price Validation | ✅ |
| 8 | Supabase Migration | ✅ |
| 9 | Catalog Database (seed) | ✅ |
| 10 | Money Type (ADR-0002) | ✅ |
| 11 | URL Slugs + Localization (ADR-0003) | ✅ |
| 12 | Stripe Tax / PVN 21% (ADR-0008) | ✅ |
| 13 | Order Emails (Resend) | ✅ |
| 14 | SMTP / site env (pharm.lv) | ✅ |
| 15 | GDPR minimum (ADR-0009) | ✅ |
| 16 | Sentry + error boundaries (ADR-0010) | ✅ |
| 17 | Rate limiting (ADR-0011) | ✅ |
| 18 | CAPTCHA Turnstile (ADR-0012) | ✅ |
| 19 | AI Protection (ADR-0013) | ✅ |
| 20 | Monitoring health (ADR-0014) | ✅ |
| 21 | Playwright e2e smoke (ADR-0015) | ✅ |
| 22 | Production Validation (ADR-0016) | ✅ |

**Progress: 22/22 = 100%**

---

## Ops checklist перед приёмом заказов

Выполнить владельцу продукта / DevOps (не блокирует CI):

1. **Домен** — `pharm.lv`: A/AAAA → Vercel, www-редирект, автопродление.
2. **Почта** — Resend: verify domain, SPF/DKIM/DMARC; `AUTH_EMAIL_*`, `EMAIL_FROM`.
3. **Supabase** — EU project, `db:push` / migrations, service role в Vercel env.
4. **Stripe** — live keys, webhook `https://pharm.lv/api/webhooks/stripe`, Tax LV 21%.
5. **Sentry** — `SENTRY_DSN`, alert `commerce.checkout=true`.
6. **Uptime** — poll `/api/health` каждые 1–5 мин; deep check с `MONITORING_HEALTH_TOKEN`.
7. **E2E staging** — `E2E_ENABLED=true` + test keys на preview/staging.
8. **Budget caps** — Vercel spend, Supabase usage, `AI_DAILY_REQUEST_CAP`.

---

## Discovered During Implementation (остаточный техдолг)

| Severity | Issue | Фаза |
|----------|-------|------|
| Medium | ESLint ~43 errors (не блокирует build) | Phase 2 |
| Medium | `images.unoptimized: true` — LCP на мобильных | Phase 2 |
| Low | Нет `global-error.tsx` | Phase 2 |
| Low | Витрина читает `lib/data.ts`, не Supabase (ADR-0001 partial) | Phase 2 B6 |
| Low | Дубли `CartProvider` на страницах | Phase 2 cleanup |

---

## Сравнение с аудитом 04 (2026-07-02)

| Было (NO-GO) | Стало (Phase 1) |
|--------------|-----------------|
| Нет git/CI | ✅ Git + GitHub Actions |
| `ignoreBuildErrors` | ✅ Убрано, tsc в CI |
| Нет webhook / server orders | ✅ ADR-0005 |
| Нет Sentry / health | ✅ ADR-0010, ADR-0014 |
| Нет GDPR consent | ✅ ADR-0009 |
| Нет rate limit / captcha | ✅ ADR-0011, ADR-0012 |
| Нет e2e | ✅ ADR-0015 (gated) |
| Домен не зарегистрирован | 🟠 Ops — `pharm.lv` через env, регистрация вне репо |
| Банклинки в футере | 🟠 Phase 2 |

---

## Как перепроверить

```bash
pnpm validate:production
# или без build (быстрее):
VALIDATE_RUN_BUILD=false pnpm validate:production
```