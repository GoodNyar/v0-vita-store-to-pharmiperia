# Phase 3 — Master Plan

> Версия: **3.0** · Дата: 2026-07-04 · База: `v2.0-phase2-complete`  
> Ветка: `phase-3/pr-01-foundation` → … → `phase-3/complete` · **30 PR** · CTO Roadmap §Phase 3

---

## Цели

1. ADR-0006: ISR + cache tags на каталоге
2. Событийный каркас `order.paid` (идемпотентность, side-effects)
3. Серверная корзина + merge guest→auth
4. Промо RPC, лояльность, verified reviews
5. Admin v1 (product CRUD, promo, audit log)
6. Search v1 (pg_trgm + facets)
7. Retention emails (abandoned cart, welcome, review request)
8. AI v2 scaffold, e2e expansion, money tests

---

## PR sequence (30)

| PR | Название | Wave |
|----|----------|------|
| 01 | Post-audit closure + Phase 2 verification record | Closure |
| 02 | Atomic webhook claim (M-10) | Foundation |
| 03 | Promo RPC validation (M-1) | Foundation |
| 04 | ISR cache tags (`lib/cache/catalog`) | Catalog |
| 05 | Search page RSC + ISR | Catalog |
| 06 | i18n server dictionary loader | i18n |
| 07 | `lib/events` scaffold + order.paid handlers | Events |
| 08 | Server cart schema migration | Cart |
| 09 | `lib/commerce/server-cart` | Cart |
| 10 | Cart guest→auth merge | Cart |
| 11 | Loyalty schema + accrual on order.paid | Loyalty |
| 12 | Verified purchase reviews | Trust |
| 13 | Abandoned cart detection + email | Retention |
| 14 | Admin audit log | Admin |
| 15 | Admin product CRUD | Admin |
| 16 | Admin promo management | Admin |
| 17 | RBAC v1 roles (manager/support) | Admin |
| 18 | pg_trgm + tsvector search migration | Search |
| 19 | Search v1 facets UI | Search |
| 20 | `lib/money` unit tests | Quality |
| 21 | `resolveOrderLines` unit tests | Quality |
| 22 | Webhook handler integration test | Quality |
| 23 | E2e checkout completion smoke | Quality |
| 24 | Remove dead checkout/success (M-8) | Cleanup |
| 25 | AI v2 pgvector scaffold | AI |
| 26 | AI recommendations cache + budgets | AI |
| 27 | Helpdesk ticket stub API | Ops |
| 28 | Welcome email series | Retention |
| 29 | Post-delivery review request email | Retention |
| 30 | Phase 3 final summary + tag `v3.0-phase3-complete` | Closure |

---

## ADR (новые)

| ID | Тема |
|----|------|
| 0022 | Event handlers + atomic webhook claim |
| 0023 | Server-side cart storage |
| 0024 | Loyalty accrual rules |
| 0025 | Search v1 pg_trgm |

---

## Чеклист после каждого PR

```bash
pnpm typecheck && pnpm lint && pnpm build && pnpm validate:production && pnpm test:commerce
```