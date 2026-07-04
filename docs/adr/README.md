# Architecture Decision Records

Каждое важное архитектурное решение фиксируется здесь **до** или **вместе** с реализацией. Что требует ADR — Playbook §16. Новый ADR — копия [шаблона](0000-adr-template.md) со следующим свободным номером.

| # | Решение | Статус | Реализуется в |
|---|---------|--------|---------------|
| [0001](0001-edinyj-istochnik-kataloga-supabase.md) | Единый источник каталога — Supabase | принят | Blueprint B6 |
| [0002](0002-dengi-v-minornyh-edinicah.md) | Деньги — минорные единицы + валюта | принят | Blueprint B4 |
| [0003](0003-slagi-i-lokal-v-url.md) | Слаги и локаль в URL | принят | Blueprint C1 |
| [0004](0004-data-access-sloj-lib-commerce.md) | Data-access-слой `lib/commerce` | принят | Blueprint B3 |
| [0005](0005-stripe-webhook-istochnik-fakta-oplaty.md) | Вебхук Stripe — источник факта оплаты | принят | Blueprint C2 |
| [0006](0006-rendering-rsc-first-isr.md) | RSC-first + ISR с cache tags | принят | Blueprint D1 |
| [0007](0007-i18n-namespace-slovari-i-perevody-kontenta.md) | i18n: namespace-словари, контент в БД | принят | Blueprint C3 |
| [0008](0008-stripe-tax-pvn-21-inclusive.md) | Stripe Tax — PVN 21%, цены включают НДС | принят | Phase 1 §5 |
| [0009](0009-gdpr-minimum-phase-1.md) | GDPR-минимум: consent, процессоры, удаление | принят | Phase 1 §7 |
| [0010](0010-sentry-error-boundaries-checkout-alerts.md) | Sentry, error boundaries, алерты чекаута | принят | Phase 1 §6 |
| [0011](0011-rate-limit-api-endpoints.md) | Rate limit на публичных API | принят | Phase 1 task 17 |
| [0012](0012-captcha-auth-turnstile.md) | CAPTCHA на auth (Turnstile) | принят | Phase 1 task 18 |
| [0013](0013-ai-protection-phase-1.md) | AI Protection: flags, guards, budget | принят | Phase 1 task 19 |
| [0014](0014-monitoring-health-budget-alerts.md) | Monitoring: health, budget alerts, ops | принят | Phase 1 task 20 |
| [0015](0015-playwright-e2e-checkout-smoke.md) | Playwright e2e: smoke checkout path | принят | Phase 1 task 21 |
| [0016](0016-phase-1-production-validation.md) | Phase 1 production validation gates | принят | Phase 1 task 22 |
| [0017](0017-analytics-server-client.md) | Analytics: server purchase + consent client | принят | Phase 2 PR-15–16 |
| [0018](0018-admin-rbac-v0.md) | Admin RBAC v0 (`profiles.role`) | принят | Phase 2 PR-19–21 |
| [0019](0019-inventory-decrement.md) | Inventory decrement RPC + idempotency | принят | Phase 2 PR-18 |
| [0020](0020-baltic-stripe-payment-methods.md) | Baltic Stripe payment methods | принят | Phase 2 PR-24 |
| [0021](0021-image-optimization-cwv.md) | Image optimization + CWV budget | принят | Phase 2 PR-28–29 |
| [0022](0022-event-handlers-webhook-claim.md) | Event handlers + atomic webhook claim | принят | Phase 3 |
| [0023](0023-server-side-cart.md) | Server-side cart | принят | Phase 3–4 cutover |
| [0024](0024-loyalty-accrual.md) | Loyalty accrual | принят | Phase 3 |
| [0025](0025-search-pgtrgm.md) | Search pg_trgm + search_vector | принят | Phase 3–4 |
| [0026](0026-phase4-feature-gaps.md) | Phase 4 feature-gap closure | принят | Phase 4 |
| [0027](0027-phase5-catalog-foundation.md) | Phase 5 catalog foundation | принят | Phase 5 |

Blueprint: [`docs/reports/06-refactoring-blueprint.md`](../reports/06-refactoring-blueprint.md).
