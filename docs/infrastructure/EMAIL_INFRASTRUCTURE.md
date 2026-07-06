# Email Infrastructure — pharm.lv

> Status: **application layer ready; owner activation pending** · Updated: 2026-07-06

## Architecture

| Layer | Provider | Responsibility |
|---|---|---|
| Corporate inbox | Google Workspace Business Starter | Human inbound/outbound mail |
| Primary account | `admin@pharm.lv` | Admin Console, mailbox and alias destination |
| Transactional mail | Resend | Code ready; domain verification and secret pending |
| Authentication mail | Supabase Auth through Resend SMTP | Templates ready; hosted SMTP activation pending |

Google Workspace and Resend must remain separate delivery paths. All aliases currently route incoming mail to `admin@pharm.lv`; application secrets belong in Vercel/Supabase, never in this repository.

## Addresses

| Address | Purpose |
|---|---|
| `admin@pharm.lv` | Primary mailbox and infrastructure administration |
| `support@pharm.lv` | Customer support |
| `orders@pharm.lv` | Order correspondence and transactional sender |
| `noreply@pharm.lv` | Authentication/system sender; replies are not expected |
| `info@pharm.lv` | General enquiries |
| `sales@pharm.lv` | Commercial enquiries |
| `returns@pharm.lv` | Returns and refund correspondence |
| `privacy@pharm.lv` | GDPR and data-subject requests |
| `legal@pharm.lv` | Legal notices |
| `jobs@pharm.lv` | Recruitment |
| `marketing@pharm.lv` | Marketing enquiries |
| `finance@pharm.lv` | Billing and finance |

## Current status

- Domain ownership verified in Google Workspace.
- Gmail activated; Google MX records are working.
- `admin@pharm.lv` is operational.
- All aliases above are configured and route to the primary mailbox.
- Incoming mail was successfully tested on `support@pharm.lv` and `orders@pharm.lv`.
- No Google Workspace reconfiguration is required.

## Remaining owner work

1. Publish one combined SPF policy covering Google Workspace and the exact sender specified by Resend.
2. Enable Google DKIM and publish the separate DKIM records supplied by Resend.
3. Start DMARC with reporting (`p=none`), review reports, then progress to `quarantine` and `reject`.
4. Verify `pharm.lv` in Resend and create a restricted production API key.
5. Set `RESEND_API_KEY`, `EMAIL_FROM=Pharm.lv <orders@pharm.lv>` and `EMAIL_ENABLED=true` in Vercel.
6. Configure Supabase custom SMTP with Resend and sender `noreply@pharm.lv`.
7. Smoke-test signup confirmation, password reset, order confirmation, shipping and refund messages.

DNS values must be copied from the current Google/Resend dashboards; DKIM keys must never be invented. Execute [EMAIL_PRODUCTION_SETUP.md](EMAIL_PRODUCTION_SETUP.md). Google Workspace itself is complete and must not be reconfigured.
