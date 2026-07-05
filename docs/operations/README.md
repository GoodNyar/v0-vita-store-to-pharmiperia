# Operations

Деплой, мониторинг, runbooks. Гейт **боевого запуска** — не RC.

## Документы

| Документ | Суть |
|----------|------|
| [deployment.md](deployment.md) | Vercel, env, migrations, validate:production |
| [monitoring.md](monitoring.md) | Sentry, /api/health, uptime (ADR-0014) |
| [backups.md](backups.md) | Supabase backups, PITR |
| [incident-response.md](incident-response.md) | Эскалация, rollback |
| [runbooks/](runbooks/README.md) | Пошаговые процедуры |

## Когда смотреть

- **Перед production launch** → [../release/LAUNCH_CHECKLIST.md](../release/LAUNCH_CHECKLIST.md) section C
- **Инцидент** → incident-response + runbooks
- **Новый deploy** → deployment.md

## Связанные ADR

- [0014](../adr/0014-monitoring-health-budget-alerts.md) — health, budget alerts
- [0016](../adr/0016-phase-1-production-validation.md) — validate:production