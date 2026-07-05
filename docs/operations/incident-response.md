# Incident Response

---

## Severity

| Level | Пример | Действие |
|-------|--------|----------|
| **P0** | Checkout down, payments fail | Immediate rollback + Stripe status |
| **P1** | Webhook failures, orders stuck pending | Fix forward, manual reconcile |
| **P2** | Catalog stale, email delay | Monitor, fix in next deploy |

---

## P0 playbook

1. Check [Sentry](monitoring.md) + Vercel logs
2. Check Stripe status + webhook delivery
3. Rollback Vercel deployment to last green
4. Notify stakeholders
5. Post-mortem → [../reports/audits/](../reports/audits/README.md) if systemic

---

## Payment mismatch

- Compare `orders.total_cents` vs Stripe `amount_total`
- Webhook idempotency: `stripe_webhook_events` table
- ADR-0022: claim/release semantics

---

## Contacts

Configure in team runbook (not in repo).