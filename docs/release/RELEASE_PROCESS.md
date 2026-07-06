# Release Process

> Как Pharmiperia переходит от разработки к RC и GA.

---

## 1. Типы артефактов

| Артефакт | Git tag | Назначение |
|----------|---------|------------|
| Phase complete | `vN.0-phaseN-complete` | Инженерный milestone фазы |
| Release Candidate | `v1.0.0-rc.N` | Зафиксированный билд для Bug Bash |
| General Availability | `v1.0.0` | Production launch |

---

## 2. Phase closure

1. Закрыть scope по [roadmap/phase-N.md](../roadmap/phase-N.md)
2. Прогнать pipeline: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
3. Независимый аудит → [reports/audits/](../reports/audits/README.md)
4. Commit + `bash scripts/tag-phase-N.sh`
5. Обновить [MASTER_STATUS.md](MASTER_STATUS.md)

---

## 3. Release Candidate

1. Системный аудит → [23-final-release-candidate-audit.md](../reports/audits/23-final-release-candidate-audit.md)
2. Закрыть блокеры (B-1: commit + tag; B-2: document or fix)
3. Checklist → [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)
4. `bash scripts/commit-rc.sh` → tag `v1.0.0-rc.N`
5. Release notes → `v1.0.0-rc.N.md` + [CHANGELOG.md](CHANGELOG.md)

---

## 4. Bug Bash (staging)

- [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) section B
- Реальная БД: `supabase db:reset` (25 migrations)
- Test Stripe keys
- Сквозной: каталог → checkout → webhook → order `paid`

---

## 5. Launch Infrastructure v1.0 ← **ТЕКУЩИЙ ЭТАП**

Подготовка production-инфраструктуры для **ручной настройки владельцем** (без изменения кода).

| Документ | Назначение |
|----------|------------|
| [docs/launch/README.md](../launch/README.md) | Точка входа |
| [docs/launch/MANUAL_ACTIONS_CHECKLIST.md](../launch/MANUAL_ACTIONS_CHECKLIST.md) | 79 ручных действий |

**Критерии завершения:** все пункты MANUAL_ACTIONS_CHECKLIST = Done; [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) section C закрыт.

**Кто выполняет:** владелец (DNS, email, Stripe, Vercel, Supabase accounts). Engineering — support и smoke tests.

---

## 6. General Availability

1. [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) sections B + C complete
2. `pnpm validate:production` — CONDITIONAL GO → full GO
3. Tag `v1.0.0`
4. Post-launch monitoring — section E

---

## 7. Документация при релизе

Обновить:

- [MASTER_STATUS.md](MASTER_STATUS.md)
- [RELEASE_NOTES.md](RELEASE_NOTES.md)
- [CHANGELOG.md](CHANGELOG.md)
- [../README.md](../README.md) (если меняется текущий tag)

---

## 8. Rollback

```bash
git checkout v1.0.0-rc.1   # last known good RC
# Vercel: promote previous deployment
```
