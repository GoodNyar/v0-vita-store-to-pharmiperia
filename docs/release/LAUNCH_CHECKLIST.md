# Launch Checklist — Pharmiperia v1.0

> RC: `v1.0.0-rc.2` · Целевой рынок: **Латвия (LV-only)** · Домен: **pharm.lv**

**Launch Infrastructure Pack:** [docs/launch/](../launch/README.md)
**Ручные действия владельца:** [MANUAL_ACTIONS_CHECKLIST.md](../launch/MANUAL_ACTIONS_CHECKLIST.md)

---

## A. Release Candidate (инженерный гейт)

Выполнено для `v1.0.0-rc.2`:

- [x] Аудит 22 P0 закрыт (market-aware checkout, unified pricing, DB shipping)
- [x] Аудит 23 B-1 закрыт (commit + tag)
- [x] BUGFIX-01 + BUGFIX-01B закрыты
- [x] Аудит 23 B-2 задокументирован ([KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) KL-1)
- [x] `pnpm typecheck` — 0 ошибок
- [x] `pnpm lint` — 0 errors
- [x] `pnpm test` — 47/47 pass
- [x] `pnpm build` — exit 0
- [x] Финальный аудит: **CONDITIONAL PASS**
- [ ] **Staging Bug Bash** — каталог → корзина → checkout → test card → webhook → order `paid`
- [ ] **`supabase db:reset`** на staging — **24** миграции применяются чисто

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

## C. Launch Infrastructure v1.0 (текущий этап)

> Пошаговые инструкции: [docs/launch/](../launch/README.md). Ничего не считается выполненным без подтверждения владельца.

Не блокирует RC. Обязательно перед GA. Детали — в отдельных файлах pack:

| Область | Документ | Ключевые пункты |
|---------|----------|-----------------|
| DNS | [DNS_RECORDS.md](../launch/DNS_RECORDS.md) | NIC.lv A/CNAME → Vercel, SSL |
| Email | [EMAIL_INFRASTRUCTURE.md](../infrastructure/EMAIL_INFRASTRUCTURE.md) | ✅ Workspace, mailbox, aliases, SPF/DKIM/DMARC |
| Resend | [WAITING_FOR_NICLV.md](../status/WAITING_FOR_NICLV.md) | ⏸️ Domain created; blocked only by NIC.lv #921631 for `send` MX |
| Supabase | [SUPABASE_PRODUCTION_SETUP.md](../launch/SUPABASE_PRODUCTION_SETUP.md) | EU, 25 migrations, RLS, auth URLs |
| Vercel | [VERCEL_PRODUCTION_SETUP.md](../launch/VERCEL_PRODUCTION_SETUP.md) | Domain, env, deploy `v1.0.0-rc.2` |
| Stripe Live | [STRIPE_LIVE_SETUP.md](../launch/STRIPE_LIVE_SETUP.md) | Live keys, webhook, card-only (no Baltic/Klarna) |
| Sentry | [SENTRY_SETUP.md](../launch/SENTRY_SETUP.md) | DSN, checkout alerts, release tag |
| Analytics/GSC | [ANALYTICS_SEARCH_CONSOLE_SETUP.md](../launch/ANALYTICS_SEARCH_CONSOLE_SETUP.md) | GSC, sitemap, GA4 после consent |
| Monitoring | [MONITORING_SETUP.md](../launch/MONITORING_SETUP.md) | `/api/health`, uptime 1–5 min |

**Чеклист:** [MANUAL_ACTIONS_CHECKLIST.md](../launch/MANUAL_ACTIONS_CHECKLIST.md) (79 пунктов)

### Краткий summary (section C legacy)

- [ ] DNS + SSL — [DNS_RECORDS.md](../launch/DNS_RECORDS.md)
- [x] Google Workspace + MX + aliases — [EMAIL_INFRASTRUCTURE.md](../infrastructure/EMAIL_INFRASTRUCTURE.md)
- [x] Resend Domain + SPF/DKIM/DMARC published
- [x] Supabase Email templates prepared
- [ ] Resend MX `send.pharm.lv` — **paused, NIC.lv Ticket #921631**
- [ ] Production key, Supabase SMTP activation and smoke tests — resume only after NIC.lv reply
- [ ] Supabase production EU — [SUPABASE_PRODUCTION_SETUP.md](../launch/SUPABASE_PRODUCTION_SETUP.md)
- [ ] Vercel production + `v1.0.0-rc.2` — [VERCEL_PRODUCTION_SETUP.md](../launch/VERCEL_PRODUCTION_SETUP.md)
- [ ] Stripe Live + webhook — [STRIPE_LIVE_SETUP.md](../launch/STRIPE_LIVE_SETUP.md)
- [ ] Sentry + monitoring — [SENTRY_SETUP.md](../launch/SENTRY_SETUP.md), [MONITORING_SETUP.md](../launch/MONITORING_SETUP.md)
- [ ] Turnstile, Upstash, budget caps — [VERCEL_PRODUCTION_SETUP.md](../launch/VERCEL_PRODUCTION_SETUP.md)
- [ ] `pnpm validate:production` — full GO

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
- [docs/launch/](../launch/README.md) — Launch Infrastructure Pack
- [Release Notes v1.0.0-rc.1](v1.0.0-rc.1.md)
- [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md)
- `pnpm validate:production`
