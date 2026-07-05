# Monitoring

> ADR-0014: health endpoint, Sentry, budget alerts.

---

## Health check

| Endpoint | Назначение |
|----------|------------|
| `GET /api/health` | Liveness (public) |
| Deep check | `MONITORING_HEALTH_TOKEN` header |

**Uptime:** poll every 1–5 min (see [LAUNCH_CHECKLIST](../release/LAUNCH_CHECKLIST.md)).

---

## Sentry

- SDK: `@sentry/nextjs`
- Checkout errors: `captureCheckoutError`
- Alert: `commerce.checkout=true` tag

Env: `SENTRY_DSN`, `SENTRY_AUTH_TOKEN` (CI).

---

## Budget alerts

| Service | Cap env |
|---------|---------|
| AI | `AI_DAILY_REQUEST_CAP` |
| Vercel | dashboard spend limit |
| Supabase | usage alerts |

---

## Logs

- Vercel Functions logs
- Stripe webhook dashboard
- Supabase logs (EU)

---

## Related

- [incident-response.md](incident-response.md)
- [../adr/0014-monitoring-health-budget-alerts.md](../adr/0014-monitoring-health-budget-alerts.md)