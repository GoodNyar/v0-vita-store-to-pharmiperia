# Pharmiperia — Master Status

> Обновлено: 2026-07-06 · Release Candidate: **`v1.0.0-rc.2`**

---

## Текущая стадия

| Поле | Значение |
|------|----------|
| **Стадия** | **Launch Infrastructure v1.0** (следующий этап после RC) |
| **Git tag** | `v1.0.0-rc.2` (prev: `v1.0.0-rc.1`) |
| **Предыдущий phase tag** | `v6.0-phase6-complete` (superseded для денежного пути) |
| **Целевой рынок v1.0** | **Латвия (LV-only)** |
| **Аудит RC** | [Отчёт 23](../reports/audits/23-final-release-candidate-audit.md) — WARNING → **RC зафиксирован** |

---

## Pipeline (подтверждено на RC-дереве)

| Команда | Результат |
|---------|-----------|
| `pnpm typecheck` | ✅ 0 ошибок |
| `pnpm lint` | ✅ 0 errors (44 warnings, pre-existing) |
| `pnpm test` | ✅ **49/49** pass |
| `pnpm build` | ✅ exit 0 |
| `pnpm validate:production` | 🟠 CONDITIONAL GO (6 ops warnings) |

---

## Закрытые блокеры аудитов

| ID | Источник | Статус | Примечание |
|----|----------|--------|------------|
| Phase 6 H-1 | Отчёт 22 | ✅ Закрыт | Market-aware checkout: cookie → `createDraftOrder` → `orders.market_code` → VAT |
| Phase 6 M-1 | Отчёт 22 | ✅ Закрыт | Единый pricing path: `applyMarketPricingToCommerceProduct` |
| Phase 6 M-3 | Отчёт 22 | ✅ Закрыт | Shipping из `market_shipping_methods` в checkout UI |
| **B-1** | Отчёт 23 | ✅ Закрыт | Дерево закоммичено, тег `v1.0.0-rc.1` |
| **B-2** | Отчёт 23 | 📋 Документировано | ISR vs per-market display — см. [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) |

---

## Архитектура (сводка)

- **25 миграций** Supabase — incl. `merge_cart_item_atomic` and welcome-email idempotency
- **Денежный путь** — идемпотентный (webhook claim/release, promo guards, loyalty UNIQUE)
- **Checkout** — `ƒ` dynamic (server-rendered, market-aware)
- **Каталог** — ISR `revalidate=3600` (● в build-таблице)
- **Storefront API v1** — 5 endpoints, rate-limited, market-aware

---

## Текущий этап: Launch Infrastructure v1.0

Инженерный RC закрыт (CONDITIONAL PASS). Следующий этап — **ручная настройка production-инфраструктуры** владельцем.

| Pack | Ссылка |
|------|--------|
| Точка входа | [docs/launch/README.md](../launch/README.md) |
| Главный чеклист | [docs/launch/MANUAL_ACTIONS_CHECKLIST.md](../launch/MANUAL_ACTIONS_CHECKLIST.md) |
| Ops-гейт | [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) section C → детали в `docs/launch/` |

**Статус:** 🟠 в работе — Google Workspace, Gmail, MX и 11 aliases завершены; следующий email-гейт: Resend + SPF/DKIM/DMARC. Остальные ops-сервисы ещё требуют настройки.

---

## Следующие шаги

1. **Owner email activation** — [EMAIL_PRODUCTION_SETUP.md](../infrastructure/EMAIL_PRODUCTION_SETUP.md)
2. **Staging Bug Bash** — `supabase db:reset` (25 migrations) + сквозной checkout
3. **Go-live** — после ops checklist + Bug Bash
4. **v1.0.0 GA** — stable tag

---

## Документы

| Документ | Назначение |
|----------|------------|
| [Release Notes v1.0.0-rc.1](v1.0.0-rc.1.md) | Состав RC, фиксы, ограничения |
| [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) | RC-гейт |
| [../README.md](../README.md) | Индекс документации |
| [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) | Гейт приёма реальных заказов |
| [docs/launch/](../launch/README.md) | Launch Infrastructure Pack (DNS, email, Stripe, …) |
| [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) | Известные ограничения v1.0 |
| [ENGINEERING_PLAYBOOK.md](../architecture/ENGINEERING_PLAYBOOK.md) | Правила разработки |
| [reports/README.md](../reports/README.md) | Хронология аудитов |
