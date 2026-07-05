# Pharmiperia — Master Status

> Обновлено: 2026-07-06 · Release Candidate: **`v1.0.0-rc.1`**

---

## Текущая стадия

| Поле | Значение |
|------|----------|
| **Стадия** | Release Candidate |
| **Git tag** | `v1.0.0-rc.1` |
| **Предыдущий phase tag** | `v6.0-phase6-complete` (superseded для денежного пути) |
| **Целевой рынок v1.0** | **Латвия (LV-only)** |
| **Аудит RC** | [Отчёт 23](../reports/audits/23-final-release-candidate-audit.md) — WARNING → **RC зафиксирован** |

---

## Pipeline (подтверждено на RC-дереве)

| Команда | Результат |
|---------|-----------|
| `pnpm typecheck` | ✅ 0 ошибок |
| `pnpm lint` | ✅ 0 errors (44 warnings, pre-existing) |
| `pnpm test` | ✅ **45/45** pass |
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

- **23 миграции** Supabase — когерентная схема (статическая проверка)
- **Денежный путь** — идемпотентный (webhook claim/release, promo guards, loyalty UNIQUE)
- **Checkout** — `ƒ` dynamic (server-rendered, market-aware)
- **Каталог** — ISR `revalidate=3600` (● в build-таблице)
- **Storefront API v1** — 5 endpoints, rate-limited, market-aware

---

## Следующие шаги

1. **Bug Bash на staging** — сквозной сценарий с реальной БД (`supabase db:reset` + test Stripe)
2. **Ops-гейт боевого запуска** — [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)
3. **v1.0.0 GA** — после Bug Bash + ops checklist

---

## Документы

| Документ | Назначение |
|----------|------------|
| [Release Notes v1.0.0-rc.1](v1.0.0-rc.1.md) | Состав RC, фиксы, ограничения |
| [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) | RC-гейт |
| [../README.md](../README.md) | Индекс документации |
| [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) | Гейт приёма реальных заказов |
| [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) | Известные ограничения v1.0 |
| [ENGINEERING_PLAYBOOK.md](../architecture/ENGINEERING_PLAYBOOK.md) | Правила разработки |
| [reports/README.md](../reports/README.md) | Хронология аудитов |