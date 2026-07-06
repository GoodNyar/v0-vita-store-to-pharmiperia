# Manual Actions Checklist — Launch Infrastructure v1.0

> **Owner actions only.** AI/CI cannot complete these.  
> **RC:** `v1.0.0-rc.2` · **Domain:** `pharm.lv`

Формат: отмечайте `[x]` по мере выполнения. Поле **Status**: `Todo` → `Done` / `Blocked`.

---

## DNS & Domain

| [ ] | Service | Action | What to copy | Where to paste | How to verify | Status |
|-----|---------|--------|--------------|----------------|---------------|--------|
| [x] | NIC.lv | Login to domain management | — | [nic.lv](https://www.nic.lv) | Dashboard opens | Done |
| [ ] | NIC.lv | Add A record for apex | `216.198.79.1` | DNS → Type `A`, Name `@` | `dig +short pharm.lv A` | Todo |
| [ ] | NIC.lv | Add CNAME for www | `cname.vercel-dns.com` | DNS → Type `CNAME`, Name `www` | `dig +short www.pharm.lv CNAME` | Todo |
| [ ] | Vercel | Add domain pharm.lv | Domain name | Project → Settings → Domains | Status: Valid Configuration | Todo |
| [ ] | Vercel | Add www redirect | `www.pharm.lv` → `pharm.lv` | Vercel Domains | `curl -I https://www.pharm.lv` → 308 | Todo |
| [ ] | Browser | Confirm SSL | — | `https://pharm.lv` | Padlock valid, no cert warning | Todo |

---

## Email — Google Workspace

| [ ] | Service | Action | What to copy | Where to paste | How to verify | Status |
|-----|---------|--------|--------------|----------------|---------------|--------|
| [x] | Google Workspace | Create account | Plan: Business Starter | [workspace.google.com](https://workspace.google.com) | Admin console opens | Done |
| [x] | Google Workspace | Create user admin@ | `admin@pharm.lv` | Users → Add user | Can login to Gmail | Done |
| [x] | Google Admin | Verify domain | TXT or CNAME value | NIC.lv DNS | Admin → Domains → Verified | Done |
| [x] | Google Admin | Add MX records | Google MX servers | NIC.lv DNS | Admin → MX: Configured | Done |
| [ ] | Google Admin | Generate DKIM | TXT value | NIC.lv → `google._domainkey` | Admin → DKIM: Authenticating | Todo |
| [ ] | NIC.lv | Add SPF TXT | `v=spf1 include:_spf.google.com include:amazonses.com ~all` | DNS → TXT `@` | `dig +short pharm.lv TXT` | Todo |
| [ ] | NIC.lv | Add DMARC TXT | `v=DMARC1; p=none; rua=mailto:admin@pharm.lv` | DNS → TXT `_dmarc` | `dig +short _dmarc.pharm.lv TXT` | Todo |
| [x] | Google Admin | Add aliases | support@, orders@, noreply@, info@, sales@, returns@, privacy@, legal@, jobs@, marketing@, finance@ | User admin@ → Aliases | support@ and orders@ tested | Done |
| [ ] | mail-tester.com | Send test email | — | Send from admin@ | Score ≥ 9/10 | Todo |

---

## Resend — Transactional Email

> Canonical owner sequence: [EMAIL_PRODUCTION_SETUP.md](../infrastructure/EMAIL_PRODUCTION_SETUP.md). DNS/API values must come from live provider dashboards.

| [ ] | Service | Action | What to copy | Where to paste | How to verify | Status |
|-----|---------|--------|--------------|----------------|---------------|--------|
| [ ] | Resend | Create account | — | [resend.com](https://resend.com) | Dashboard opens | Todo |
| [ ] | Resend | Add domain pharm.lv | Domain name | Domains → Add | Domain listed | Todo |
| [ ] | Resend | Copy DNS records | DKIM/verify TXT/CNAME | NIC.lv DNS | Each record added | Todo |
| [ ] | Resend | Verify domain | — | Domains → Verify | Status: **Verified** | Todo |
| [ ] | Resend | Create API key | `re_...` | Vercel → `RESEND_API_KEY` | Key saved in password manager | Todo |
| [ ] | Vercel | Set EMAIL_FROM | `Pharm.lv <orders@pharm.lv>` | Production env | Redeploy | Todo |
| [ ] | Vercel | Set EMAIL_ENABLED | `true` | Production env | — | Todo |
| [ ] | Resend | Send test email | From: orders@pharm.lv | Emails → Send | Inbox, not spam | Todo |
| [ ] | Supabase | Configure SMTP | Host: smtp.resend.com, User: resend, Pass: re_... | Auth → SMTP Settings | SMTP enabled | Todo |
| [ ] | Supabase | Set sender | `noreply@pharm.lv` | SMTP sender email | — | Todo |
| [ ] | App | Test password reset | — | /lv/auth/forgot-password | Email from noreply@ received | Todo |

---

## Supabase Production

| [ ] | Service | Action | What to copy | Where to paste | How to verify | Status |
|-----|---------|--------|--------------|----------------|---------------|--------|
| [ ] | Supabase | Create project (EU) | Region: Frankfurt eu-central-1 | [supabase.com/dashboard](https://supabase.com/dashboard) | Project active | Todo |
| [ ] | Supabase | Copy Project URL | `https://<ref>.supabase.co` | Vercel → `NEXT_PUBLIC_SUPABASE_URL` | — | Todo |
| [ ] | Supabase | Copy anon key | `eyJ...` | Vercel → `NEXT_PUBLIC_SUPABASE_ANON_KEY` | — | Todo |
| [ ] | Supabase | Copy service_role key | `eyJ...` | Vercel → `SUPABASE_SERVICE_ROLE_KEY` | Never expose client-side | Todo |
| [ ] | Supabase CLI | Push migrations | `supabase db push` | Terminal (24 files) | `migration list` → 24 | Todo |
| [ ] | Supabase | Seed catalog | seed SQL or script | SQL Editor / CLI | `SELECT count(*) FROM products` > 0 | Todo |
| [ ] | Supabase | Set Site URL | `https://pharm.lv` | Auth → URL Configuration | — | Todo |
| [ ] | Supabase | Add redirect URLs | `https://pharm.lv/**` | Auth → Redirect URLs | — | Todo |
| [ ] | Supabase | Enable daily backups | Pro plan | Settings → Database | Backups visible | Todo |
| [ ] | App | Test RLS | Register 2 users | /account/orders | Each sees only own orders | Todo |
| [ ] | App | Test reset password | — | /lv/auth/forgot-password | Full flow works | Todo |

---

## Vercel Production

| [ ] | Service | Action | What to copy | Where to paste | How to verify | Status |
|-----|---------|--------|--------------|----------------|---------------|--------|
| [ ] | Vercel | Link Git repo | — | New Project → Import | Project created | Todo |
| [ ] | Vercel | Set all production env vars | See [VERCEL_PRODUCTION_SETUP.md](./VERCEL_PRODUCTION_SETUP.md) | Settings → Env → Production | All required vars set | Todo |
| [ ] | Vercel | Deploy v1.0.0-rc.2 | Tag/commit hash | Promote to Production | Deployment ✅ Ready | Todo |
| [ ] | Vercel | Generate health token | `openssl rand -hex 32` | `MONITORING_HEALTH_TOKEN` | Deep health 200 | Todo |
| [ ] | curl | Shallow health | — | `curl https://pharm.lv/api/health` | `{"status":"ok"}` | Todo |
| [ ] | Browser | Verify homepage | — | `https://pharm.lv/lv` | Page renders | Todo |
| [ ] | Vercel | (Optional) Password protect | — | Deployment Protection | Site gated pre-launch | Todo |

---

## Stripe Live

| [ ] | Service | Action | What to copy | Where to paste | How to verify | Status |
|-----|---------|--------|--------------|----------------|---------------|--------|
| [ ] | Stripe | Activate Live account | Business details, bank | Dashboard → Activate | Live mode available | Todo |
| [ ] | Stripe | Copy live secret key | `sk_live_...` | Vercel → `STRIPE_SECRET_KEY` | — | Todo |
| [ ] | Stripe | Copy live publishable key | `pk_live_...` | Vercel → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | — | Todo |
| [ ] | Stripe | Create webhook | URL: `https://pharm.lv/api/webhooks/stripe` | Developers → Webhooks | Endpoint created | Todo |
| [ ] | Stripe | Select events | `checkout.session.completed` | Webhook config | Events listed | Todo |
| [ ] | Stripe | Copy signing secret | `whsec_...` | Vercel → `STRIPE_WEBHOOK_SECRET` | — | Todo |
| [ ] | Stripe | Disable Baltic/Klarna | — | Settings → Payment methods | Only cards enabled | Todo |
| [ ] | Vercel | Confirm NO Baltic flag | — | Production env | `STRIPE_BALTIC_METHODS_ENABLED` absent | Todo |
| [ ] | Stripe | Send test webhook | checkout.session.completed | Webhook → Send test | HTTP 200 | Todo |
| [ ] | App | Live payment smoke test | Real card, min amount | Checkout flow | Order `paid` + email + refund | Todo |

---

## Sentry

| [ ] | Service | Action | What to copy | Where to paste | How to verify | Status |
|-----|---------|--------|--------------|----------------|---------------|--------|
| [ ] | Sentry | Create Next.js project | — | [sentry.io](https://sentry.io) | Project created | Todo |
| [ ] | Sentry | Copy DSN | `https://...@sentry.io/...` | Vercel → `SENTRY_DSN` + `NEXT_PUBLIC_SENTRY_DSN` | — | Todo |
| [ ] | Vercel | Set environment | `production` | `SENTRY_ENVIRONMENT` | — | Todo |
| [ ] | Sentry | Create release | `v1.0.0-rc.2` | Releases → New | Release visible | Todo |
| [ ] | Sentry | Alert: checkout errors | URL contains /checkout | Alerts → Create | Alert active | Todo |
| [ ] | Sentry | Alert: webhook failures | URL contains /api/webhooks/stripe | Alerts → Create | Alert active | Todo |
| [ ] | App | Trigger test error | — | Staging first | Issue in Sentry dashboard | Todo |

---

## Analytics & Search Console

| [ ] | Service | Action | What to copy | Where to paste | How to verify | Status |
|-----|---------|--------|--------------|----------------|---------------|--------|
| [ ] | Google Search Console | Add property | `https://pharm.lv` | [search.google.com/search-console](https://search.google.com/search-console) | Verified | Todo |
| [ ] | GSC | Submit sitemap | `sitemap.xml` | Sitemaps → Add | Status: Success (after go-live) | Todo |
| [ ] | GSC | Check robots.txt | — | Settings → robots.txt | Correct sitemap URL | Todo |
| [ ] | GA4 | Create property + stream | `G-XXXXXXXX` | Vercel → `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | — | Todo |
| [ ] | App | Verify cookie consent | — | Visit site in incognito | No GA4 before accept | Todo |
| [ ] | Vercel | Enable analytics | `NEXT_PUBLIC_ANALYTICS_ENABLED=true` | Production env (after consent OK) | GA4 Realtime shows user | Todo |
| [ ] | PostHog (optional) | Create EU project | `phc_...` | Vercel env vars | Live events after consent | Todo |

---

## Monitoring

| [ ] | Service | Action | What to copy | Where to paste | How to verify | Status |
|-----|---------|--------|--------------|----------------|---------------|--------|
| [ ] | UptimeRobot | Create account | — | [uptimerobot.com](https://uptimerobot.com) | Dashboard opens | Todo |
| [ ] | UptimeRobot | Monitor homepage | `https://pharm.lv/lv` | New Monitor → HTTP 5min | Monitor active | Todo |
| [ ] | UptimeRobot | Monitor health | `https://pharm.lv/api/health` | New Monitor → HTTP 1min | Monitor active | Todo |
| [ ] | UptimeRobot | SSL monitor | `pharm.lv` | SSL Certificate monitor | Alert 14d before expiry | Todo |
| [ ] | UptimeRobot | Test alert | — | Test notification | Email received | Todo |

---

## Go-Live Gate

| [ ] | Service | Action | What to copy | Where to paste | How to verify | Status |
|-----|---------|--------|--------------|----------------|---------------|--------|
| [ ] | All | Review full checklist | — | This document | All above = Done | Todo |
| [ ] | Team | Staging Bug Bash complete | — | [LAUNCH_CHECKLIST.md](../release/LAUNCH_CHECKLIST.md) | E2E pass | Todo |
| [ ] | Team | Catalog seeded + images | — | Supabase + public/ | Products visible on site | Todo |
| [ ] | Owner | Remove password protection | — | Vercel (if used) | Site public | Todo |
| [ ] | GSC | Request indexing | Key URLs | URL Inspection | Indexed within days | Todo |
| [ ] | Owner | Announce go-live | — | — | 🚀 | Todo |

---

## Progress summary

| Section | Total | Done | Blocked |
|---------|-------|------|---------|
| DNS & Domain | 6 | 1 | 0 |
| Email | 9 | 5 | 0 |
| Resend | 11 | 0 | 0 |
| Supabase | 11 | 0 | 0 |
| Vercel | 7 | 0 | 0 |
| Stripe | 10 | 0 | 0 |
| Sentry | 7 | 0 | 0 |
| Analytics | 7 | 0 | 0 |
| Monitoring | 5 | 0 | 0 |
| Go-Live Gate | 6 | 0 | 0 |
| **Total** | **79** | **6** | **0** |
