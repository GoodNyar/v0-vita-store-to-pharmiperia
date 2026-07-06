# Email Production Setup — Owner Checklist

> Application code: **ready** · Google Workspace: **complete** · Owner actions below: **pending**
>
> Never paste API keys, SMTP passwords or private DKIM material into Git, screenshots, issues or this document.

## Ready in the repository

- Resend client is lazy-loaded and disabled safely until `RESEND_API_KEY` exists.
- Order confirmation is triggered by the paid-order event.
- Shipping, review-request and refund messages are triggered by matching admin status transitions.
- Welcome, order, shipping, refund, abandoned-cart and review messages have idempotency guards.
- Supabase confirmation and password-recovery templates are stored in `supabase/templates/`.
- `pnpm validate:email` checks production email environment variables without printing secrets.

The migration `20260706140000_welcome_email_idempotency.sql` must be deployed before enabling production email.

## Owner-only values

Collect these in a password manager, not in the repository:

| Value | Source | Destination |
|---|---|---|
| Resend DNS records | Resend → Domains → `pharm.lv` | Authoritative DNS for `pharm.lv` |
| Google DKIM status/value | Existing Google Admin email authentication screen | DNS verification only; do not reconfigure Workspace |
| DMARC TXT value | Approved policy in step 3 | DNS `_dmarc` |
| `RESEND_API_KEY` | Resend → API Keys | Vercel and Supabase SMTP password |
| Supabase project reference | Supabase project | Dashboard/CLI |

## 1. Resend domain

- [ ] Create or open the Resend account.
- [ ] Add domain `pharm.lv`.
- [ ] Copy every DNS record exactly as Resend displays it.
- [ ] Add those records at the authoritative DNS provider.
- [ ] Wait until Resend reports the domain **Verified**.
- [ ] Confirm Resend reports SPF and DKIM as passing.
- [ ] Create a production API key restricted to sending access.
- [ ] Store the key in the password manager.

Do not substitute record names or values from examples. Resend can use a custom return-path/subdomain; the dashboard is the source of truth.

## 2. SPF and DKIM verification

- [ ] Export/read the current TXT records for `pharm.lv`.
- [ ] Confirm there is exactly one SPF TXT record at the organizational domain.
- [ ] If Google and Resend require the same SPF scope, merge their mechanisms into that single record.
- [ ] Use the exact SPF mechanism shown by the current Resend dashboard.
- [ ] Confirm the existing Google DKIM selector passes.
- [ ] Confirm the Resend DKIM selector(s) pass.
- [ ] Verify with an independent message-header or deliverability test.

Google Workspace remains closed as a setup milestone. This step only verifies sender authentication; it does not recreate users, aliases, MX or Gmail configuration.

## 3. DMARC rollout

- [ ] Confirm both Google Workspace and Resend pass aligned SPF or DKIM.
- [ ] Publish one DMARC TXT record at `_dmarc.pharm.lv`.
- [ ] Begin with monitoring policy `p=none` and aggregate reports to a working controlled mailbox.
- [ ] Review reports for at least 2–4 weeks.
- [ ] Move to `quarantine`, then `reject`, only after every legitimate sender is aligned.

The exact DMARC record is an owner decision because the reporting destination and rollout policy are operational data. Do not copy a placeholder unchanged.

## 4. Vercel production environment

Set for **Production**:

```text
NEXT_PUBLIC_SITE_URL=https://pharm.lv
RESEND_API_KEY=<secret from Resend>
EMAIL_FROM=Pharm.lv <orders@pharm.lv>
EMAIL_ENABLED=true
SUPPORT_EMAIL=support@pharm.lv
ORDERS_EMAIL=orders@pharm.lv
INFO_EMAIL=info@pharm.lv
AUTH_EMAIL_ADDRESS=noreply@pharm.lv
AUTH_EMAIL_FROM=Pharm.lv <noreply@pharm.lv>
```

- [ ] Save values without exposing them in build logs.
- [ ] Redeploy production after saving.
- [ ] Run `pnpm validate:email` in an environment containing those variables.

## 5. Supabase migration and SMTP

- [ ] Apply all **25** migrations, including `20260706140000_welcome_email_idempotency.sql`.
- [ ] Open Authentication → SMTP Settings.
- [ ] Enable custom SMTP.
- [ ] Set host `smtp.resend.com`.
- [ ] Set port `587`.
- [ ] Set username `resend`.
- [ ] Set password to the Resend API key.
- [ ] Set sender email `noreply@pharm.lv`.
- [ ] Set sender name `Pharm.lv`.
- [ ] Save and confirm the settings.
- [ ] Copy the repository confirmation and recovery template content into the hosted Supabase Email Templates screen.
- [ ] Confirm production Site URL is `https://pharm.lv`.
- [ ] Confirm allowed redirect URLs include the production auth callback paths.
- [ ] Review the Supabase Auth email rate limit for expected launch traffic.

The checked-in `supabase/config.toml` and templates make local/CLI environments reproducible. Hosted Supabase settings still require owner credentials.

## 6. End-to-end acceptance

Use a fresh customer email address and one real test order:

- [ ] Signup confirmation arrives from `noreply@pharm.lv`.
- [ ] Confirmation link returns to `pharm.lv` and creates a session.
- [ ] Welcome message is delivered once.
- [ ] Password reset arrives and completes successfully.
- [ ] Paid order sends one order confirmation.
- [ ] Status `shipped` sends one shipping message.
- [ ] Repeating `shipped` does not send a duplicate.
- [ ] Status `delivered` sends one review request.
- [ ] Status `refunded` sends one refund notice.
- [ ] Replies/support links use `support@pharm.lv`.
- [ ] Gmail and another mailbox provider place messages in inbox, not spam.
- [ ] Message headers show SPF, DKIM and DMARC pass/alignment.
- [ ] Resend logs show no unexpected bounces or complaints.

## Completion gate

Email production infrastructure is closed only when every checkbox above passes and:

```bash
pnpm typecheck
pnpm test
pnpm validate:production
pnpm validate:email
```

all succeed in the production-configured environment.

References: [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [Supabase email templates](https://supabase.com/docs/guides/auth/auth-email-templates), [Resend domains](https://resend.com/docs/dashboard/domains/introduction), [Resend DMARC](https://resend.com/docs/dashboard/domains/dmarc).
