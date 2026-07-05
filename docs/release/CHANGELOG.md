# Changelog

Формат основан на [Keep a Changelog](https://keepachangelog.com/). Версии соответствуют git tags.

---

## [v1.0.0-rc.1] — 2026-07-06

### Added
- Market-aware checkout: `resolveMarketFromCookies`, `orders.market_code`, per-market VAT
- Unified pricing: `applyMarketPricingToCommerceProduct` (catalog, Storefront API, checkout)
- DB-backed shipping options in checkout UI
- Release documentation structure

### Documented
- B-2 ISR vs per-market display as LV-only limitation ([KNOWN_LIMITATIONS](KNOWN_LIMITATIONS.md) KL-1)

### Pipeline
- typecheck 0 / lint 0 errors / test 45/45 / build ok

[Full notes →](v1.0.0-rc.1.md)

---

## Phase tags (engineering milestones)

| Tag | Summary |
|-----|---------|
| `v6.0-phase6-complete` | Markets LV/LT/EE, Storefront API v1 — [phase-6](../roadmap/phase-6.md) |
| `v5.0-phase5-complete` | Catalog foundation — [phase-5](../roadmap/phase-5.md) |
| `v4.0-phase4-complete` | Feature gaps — [phase-4](../roadmap/phase-4.md) |
| `v3.0-phase3-complete` | Events, server cart — [phase-3](../roadmap/phase-3.md) |
| `v2.0-phase2-complete` | Commerce layer, admin v0 — [phase-2](../roadmap/phase-2.md) |
| `v1.0-phase1-complete` | Launch readiness — [phase-1](../roadmap/phase-1.md) |