# Email Infrastructure — pharm.lv

> Status: **PAUSED — waiting for NIC.lv Ticket #921631** · Updated: 2026-07-06

## Architecture

| Layer | Provider | Responsibility |
|---|---|---|
| Corporate inbox | Google Workspace Business Starter | Human inbound/outbound mail |
| Primary account | `admin@pharm.lv` | Admin Console, mailbox and alias destination |
| Transactional mail | Resend | Domain created; SPF/DKIM/DMARC published; `send` MX blocked |
| Authentication mail | Supabase Auth through Resend SMTP | Hosted templates installed; production credentials pending |

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
- Resend Domain `pharm.lv` exists in `eu-west-1`.
- Resend SPF, DKIM and DMARC are published and visible in public DNS.
- Supabase signup-confirmation and password-reset templates are installed.

## Paused external blocker

The only current email-infrastructure blocker is **NIC.lv Ticket #921631**. NIC.lv support must confirm how to publish the Resend MX record for `send.pharm.lv` without changing the working Google MX at the root domain.

Until NIC.lv replies, no email-infrastructure changes are required. Resume from [WAITING_FOR_NICLV.md](../status/WAITING_FOR_NICLV.md), then finish the remaining activation steps in [EMAIL_PRODUCTION_SETUP.md](EMAIL_PRODUCTION_SETUP.md).
