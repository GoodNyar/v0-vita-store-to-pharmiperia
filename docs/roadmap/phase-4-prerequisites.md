# Phase 4/5 — Prerequisites & Baseline

> **Phase 4 (feature gaps):** ✅ закрыта — см. [phase-4.md](phase-4.md)  
> **Этот документ** описывает baseline для **Phase 5 (PIM / 100k SKU)**.  
> **Baseline tag:** `v4.0-phase4-complete` · предыдущий: `v3.0-phase3-complete`.

---

## 1. Триггер входа (обязателен)

Phase 4 **не начинается** без бизнес-триггера из [CTO Roadmap §Phase 4](CTO-roadmap.md):

| Условие | Статус |
|---------|--------|
| Подписан крупный поставщик с CSV/XML фидом | ⏳ ожидается |
| Объём каталога > ~5 000 SKU в горизонте 6 мес. | ⏳ ожидается |

Без триггера допустима только **подготовительная** работа (ADR, spike, дизайн схемы variants) — без миграций прод-модели и без Meilisearch в prod.

---

## 2. Зафиксированный baseline (Phase 3 → Phase 4)

### Git

```bash
git checkout phase-2/pr-02-commerce-scaffold
bash scripts/tag-phase-3.sh                    # если тег ещё не создан
git checkout -b phase-4/pr-01-foundation v3.0-phase3-complete
```

| Артефакт | Значение |
|----------|----------|
| Tag | `v3.0-phase3-complete` |
| Commit (remediation) | `2195a70` — `feat(phase-3): complete post-audit remediation` |
| Ветка baseline | `phase-2/pr-02-commerce-scaffold` |
| Рекомендуемая ветка Phase 4 | `phase-4/pr-01-foundation` |

### Pipeline gate (должен быть зелёным на baseline)

```bash
pnpm install
pnpm lint          # 0 errors (warnings Phase 2 — OK)
pnpm typecheck     # 0 errors
pnpm build
pnpm validate:production
pnpm test          # 18/18
```

### Миграции (18 файлов, `pnpm db:reset`)

| Период | Файлы |
|--------|-------|
| Baseline | `20260703120000_baseline.sql` |
| Phase 1–2 | `20260703140000` … `20260703220000` (7) |
| Phase 3 | `20260704100000` … `20260704170000` (7) |

---

## 3. Что уже есть (не переписывать в Phase 4)

| Capability | Где | Примечание |
|------------|-----|------------|
| Data-access слой | `lib/commerce/*` | Расширять, не обходить |
| ISR + cache tags | `lib/cache/catalog.ts`, ADR-0006 | On-demand `revalidateTag(tag, 'max')` |
| Webhook + atomic claim | `lib/orders.ts`, ADR-0022 | Источник факта оплаты |
| Events `order.paid` | `lib/events/` | Side-effects через handlers |
| Server cart | `lib/commerce/server-cart.ts`, ADR-0023 | Merge guest→auth |
| Поиск v1 | pg_trgm + facets | Достаточно до ~5–10k SKU |
| Admin v1 | `/admin`, RBAC, audit log | CRUD товаров, promo stub |
| Money type | `lib/money.ts` | Только integer cents |
| Unit tests | `pnpm test` | 18 commerce tests |

---

## 4. Scope Phase 4 (CTO Roadmap)

1. **Модель каталога:** variants, переводы, атрибуты (тип кожи, SPF, ингредиенты)
2. **Mini-PIM:** импорт CSV/XML → валидация → dedup → staging → публикация
3. **Медиа:** object storage + CDN + `product_images` деривативы
4. **Поиск v2:** Meilisearch/Typesense (опечатки, синонимы, LV/RU, мерчандайзинг)
5. **Programmatic SEO:** категория × бренд × свойство; sitemap shards 45k URL
6. **Inventory reservations** (до массовых продаж)
7. **Нагрузка:** keyset-пагинация, ревизия индексов, load test
8. **Мерчандайзинг** в админке

**Оценка:** ~48–56 чн · **Зависимости:** Admin v1 ✅ · data-слой ✅ · RSC/ISR ✅

---

## 5. Что НЕ подключать на старте Phase 4

| Сервис / фича | Почему не сейчас | Когда |
|---------------|------------------|-------|
| **Market / мультивалюта** | Нет второй страны с юнит-экономикой | Phase 5 |
| **Storefront API (public)** | Нет стабильной variants-модели | Phase 5 |
| **Мобильное приложение** | Нет API | Phase 5 |
| **Inngest (prod)** | Достаточно sync handlers + webhook; очередь — при росте side-effects | По метрикам |
| **OpenAI prod recommendations** | AI v2 scaffold only; флаг выключен | После бюджетов + pgvector data |
| **Полный promo checkout** | RPC есть; UI checkout integration — отдельный PR в P4/P5 | Phase 4+ |

---

## 6. ENV — дополнения для Phase 4 (планируемые)

Существующие переменные из `.env.example` остаются. Новые (добавить при первом PR фазы):

| Variable | Назначение |
|----------|------------|
| `MEILISEARCH_HOST` / `MEILISEARCH_API_KEY` | Dedicated search (dev/staging) |
| `S3_BUCKET` / `CDN_URL` | Product media pipeline |
| `FEED_IMPORT_CRON_SECRET` | Защита cron импорта фидов |

Не коммитить prod secrets. Staging — отдельный Supabase project.

---

## 7. Архитектурная готовность (чеклист)

- [ ] Прочитан [Phase 3 Final Summary](phase-3.md)
- [ ] Прочитан [CTO Roadmap Phase 4](CTO-roadmap.md) § месяцы 5–9
- [ ] Триггер поставщика задокументирован (контракт / LOI)
- [ ] ADR на variants-модель **черновик** до первой миграции схемы
- [ ] `pnpm db:reset` на чистой машине = 18 миграций без ошибок
- [ ] Baseline tag `v3.0-phase3-complete` создан локально

---

## 8. Откат к Phase 3 baseline

```bash
git checkout v3.0-phase3-complete
pnpm db:reset
pnpm test
```

Удаление ветки Phase 4 (если эксперимент неудачен):

```bash
git checkout phase-2/pr-02-commerce-scaffold
git branch -D phase-4/pr-01-foundation
```

---

## 9. Следующий документ

После триггера и чеклиста — создать `phase-4-master-plan.md` (PR sequence, ~40 PR, milestones M1–M8).