# Launch Checklist — Pharmiperia v1.0

> RC: `v1.0.0-rc.1` · Целевой рынок: **Латвия (LV-only)**

---

## A. Release Candidate (инженерный гейт)

Выполнено для `v1.0.0-rc.1`:

- [x] Аудит 22 P0 закрыт (market-aware checkout, unified pricing, DB shipping)
- [x] Аудит 23 B-1 закрыт (commit + tag `v1.0.0-rc.1`)
- [x] Аудит 23 B-2 задокументирован ([KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) KL-1)
- [x] `pnpm typecheck` — 0 ошибок
- [x] `pnpm lint` — 0 errors
- [x] `pnpm test` — 45/45 pass
- [x] `pnpm build` — exit 0
- [ ] **Staging Bug Bash** — каталог → корзина → checkout → test card → webhook → order `paid`
- [ ] **`supabase db:reset`** на staging — 23 миграции применяются чисто

---

## B. Bug Bash (staging, test keys)

Сквозные сценарии:

1. [ ] Каталог `/lv` — товары, цены, корзина
2. [ ] Checkout — shipping options из БД, VAT 21%, promo code
3. [ ] Stripe test card — оплата успешна
4. [ ] Webhook `checkout.session.completed` — order `paid`, `market_code=lv`
5. [ ] Email confirmation (Resend test/staging)
6. [ ] Account orders — заказ виден
7. [ ] Admin orders — статус корректен
8. [ ] `/api/health` — 200

---

## C. Production ops (гейт приёма реальных денег)

Не блокирует RC / Bug Bash. Обязательно перед GA:

### Домен и DNS

- [ ] `pharm.lv` — A/AAAA → Vercel
- [ ] www-редирект
- [ ] SSL активен

### Почта

- [ ] Resend: verify domain
- [ ] SPF / DKIM / DMARC
- [ ] `EMAIL_FROM`, `AUTH_EMAIL_*` в production env

### Supabase

- [ ] EU project, production instance
- [ ] Миграции применены (`pnpm db:push` или CI)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` в Vercel (server-only)
- [ ] RLS smoke на staging

### Stripe

- [ ] Live keys (`sk_live_`, `pk_live_`)
- [ ] Webhook `https://pharm.lv/api/webhooks/stripe` (live endpoint)
- [ ] Stripe Tax LV 21% (или manual inclusive VAT)
- [ ] Test payment на live mode (минимальная сумма + refund)

### Observability

- [ ] `SENTRY_DSN` в production
- [ ] Alert на `commerce.checkout` errors
- [ ] Uptime monitor на `/api/health` (1–5 min interval)
- [ ] `MONITORING_HEALTH_TOKEN` для deep health check

### Security & limits

- [ ] Turnstile keys (auth)
- [ ] Rate limits (Upstash Redis)
- [ ] `AI_DAILY_REQUEST_CAP` установлен
- [ ] Budget caps (Vercel, Supabase)

### E2E (optional pre-GA)

- [ ] `E2E_ENABLED=true` на staging с test keys
- [ ] Playwright checkout smoke green

---

## D. LV-only launch constraints (явное принятие)

Перед GA подтвердить продуктовое решение:

- [x] v1.0 запускается **только для Латвии** — один рынок, VAT 21%
- [x] `market_product_prices` overrides **не используются** в production
- [x] ISR catalog с LV-baked ценами **принято** ([KL-1](KNOWN_LIMITATIONS.md#kl-1--per-market-display-pricing-vs-isr-b-2))
- [ ] LT/EE traffic routing **отключён** или ведёт на LV-витрину (middleware geo → `lv` acceptable)

### Не запускать до remediation

- [ ] LT/EE storefront без KL-1 fix
- [ ] Per-market price overrides в admin без KL-1 fix
- [ ] `INVENTORY_RESERVATIONS_ENABLED=true` без full lifecycle

---

## E. Post-launch monitoring (первые 72 часа)

- [ ] Stripe dashboard — failed payments < 1%
- [ ] Sentry — zero unhandled checkout errors
- [ ] Webhook delivery — 100% success rate
- [ ] Order fulfillment — все `paid` имеют `market_code=lv`
- [ ] Email delivery rate > 95%

---

## Ссылки

- [MASTER_STATUS.md](MASTER_STATUS.md)
- [Release Notes v1.0.0-rc.1](v1.0.0-rc.1.md)
- [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md)
- `pnpm validate:production`