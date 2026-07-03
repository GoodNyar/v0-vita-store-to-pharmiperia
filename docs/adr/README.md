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

Blueprint: [`docs/reports/06-refactoring-blueprint.md`](../reports/06-refactoring-blueprint.md).
