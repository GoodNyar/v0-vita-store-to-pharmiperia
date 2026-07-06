# Pharmiperia — Documentation

> **Точка входа.** Новый разработчик: начните с [5-минутного онбординга](#рекомендуемый-порядок-чтения-5-минут) ниже.

**Текущий статус:** Email Infrastructure paused · ожидается NIC.lv Ticket #921631 · [WAITING_FOR_NICLV](status/WAITING_FOR_NICLV.md) · [MASTER_STATUS](release/MASTER_STATUS.md)

---

## Структура

```
docs/
├── README.md                 ← вы здесь
├── PROJECT_MAP.md            ← связи ADR / Roadmap / Release / Business
│
├── architecture/             ← как устроен код и правила разработки
├── adr/                      ← Architecture Decision Records (0001–0028)
├── roadmap/                  ← CTO roadmap + Phase 1–6 summaries & plans
├── reports/                  ← аудиты, ревью, исторические отчёты
│   ├── audits/               ← независимые и self-аудиты по фазам + RC
│   ├── reviews/              ← staff review, production readiness
│   └── history/              ← ранние аудиты и refactoring blueprint
├── release/                  ← RC/GA: notes, checklists, limitations, changelog
├── launch/                   ← Launch Infrastructure Pack (DNS, email, Stripe, Vercel, …)
├── infrastructure/           ← текущее состояние production-сервисов
├── status/                   ← активные паузы, handoff и resume points
├── business/                 ← бизнес-план, финмодель, VC due diligence
├── operations/             ← деплой, мониторинг, runbooks
└── archive/                  ← устаревшие документы (не удалять)
```

---

## Папки — когда смотреть

| Папка | Содержимое | Когда открывать |
|-------|------------|-----------------|
| [architecture/](architecture/README.md) | Playbook, обзор архитектуры | Перед любым PR; первый день в проекте |
| [adr/](adr/README.md) | Принятые архитектурные решения | Перед изменением денег, auth, checkout, каталога |
| [roadmap/](roadmap/README.md) | Фазы 1–6, CTO roadmap | Понять scope фазы и что уже закрыто |
| [reports/](reports/README.md) | Аудиты и ревью | Разобрать «почему так сделано» и риски |
| [release/](release/README.md) | RC, launch, limitations | Деплой, Bug Bash, GA |
| [launch/](launch/README.md) | DNS, email, Stripe Live, Vercel, Supabase ops | **Текущий этап** — production setup владельцем |
| [infrastructure/](infrastructure/EMAIL_INFRASTRUCTURE.md) | Фактическая email-инфраструктура и [production setup](infrastructure/EMAIL_PRODUCTION_SETUP.md) | Ops handoff, DNS/secrets и аудит |
| [status/](status/WAITING_FOR_NICLV.md) | Текущий внешний блокер и точка продолжения | Открывать перед возобновлением infrastructure work |
| [business/](business/README.md) | Стратегия и финансы | Контекст продукта (не блокер для кода) |
| [operations/](operations/README.md) | Ops и runbooks | Staging/prod, инциденты |
| [archive/](archive/README.md) | Superseded docs | Только для истории |

---

## Ключевые документы

| Документ | Зачем |
|----------|-------|
| [architecture/ENGINEERING_PLAYBOOK.md](architecture/ENGINEERING_PLAYBOOK.md) | Конституция разработки |
| [architecture/architecture-overview.md](architecture/architecture-overview.md) | Схема системы за 2 минуты |
| [PROJECT_MAP.md](PROJECT_MAP.md) | Карта связей всей документации |
| [roadmap/CTO-roadmap.md](roadmap/CTO-roadmap.md) | 12-месячный план |
| [release/MASTER_STATUS.md](release/MASTER_STATUS.md) | Текущее состояние проекта |
| [release/KNOWN_LIMITATIONS.md](release/KNOWN_LIMITATIONS.md) | Ограничения v1.0 (LV-only) |
| [reports/audits/23-final-release-candidate-audit.md](reports/audits/23-final-release-candidate-audit.md) | Финальный системный аудит |

---

## Рекомендуемый порядок чтения (5 минут)

1. **[architecture/architecture-overview.md](architecture/architecture-overview.md)** — стек, слои, денежный путь (2 мин)
2. **[release/MASTER_STATUS.md](release/MASTER_STATUS.md)** — где мы сейчас: RC, pipeline, блокеры (1 мин)
3. **[architecture/ENGINEERING_PLAYBOOK.md](architecture/ENGINEERING_PLAYBOOK.md)** — §1–3: non-negotiables и структура репо (2 мин)

Дальше по задаче:

- **Checkout / Stripe** → ADR [0005](adr/0005-stripe-webhook-istochnik-fakta-oplaty.md), [0008](adr/0008-stripe-tax-pvn-21-inclusive.md), [roadmap/phase-4.md](roadmap/phase-4.md)
- **Каталог / цены** → ADR [0001](adr/0001-edinyj-istochnik-kataloga-supabase.md), [0004](adr/0004-data-access-sloj-lib-commerce.md), [roadmap/phase-5.md](roadmap/phase-5.md)
- **Мульти-рынок** → ADR [0028](adr/0028-phase6-international-foundation.md), [roadmap/phase-6.md](roadmap/phase-6.md), [release/KNOWN_LIMITATIONS.md](release/KNOWN_LIMITATIONS.md)

---

## Быстрые команды (из корня репо)

```bash
pnpm dev                    # локальная витрина
pnpm typecheck && pnpm test # проверка перед PR
pnpm validate:production    # pre-deploy gate
git checkout v1.0.0-rc.1    # RC snapshot
```

---

## История документации

Ранее все отчёты лежали в плоском `docs/reports/`. С июля 2026 структура разделена по ролям (architecture / roadmap / release / …). Старые пути обновлены; superseded файлы — в [archive/](archive/README.md).
