# Waiting for NIC.lv

> Status: **PAUSED** · Updated: 2026-07-06 · External blocker: **NIC.lv Ticket #921631**

## Completed

- Google Workspace is fully complete and must not be reconfigured.
- Corporate mailbox `admin@pharm.lv` is operational.
- All corporate aliases are configured; inbound mail was tested.
- Resend domain `pharm.lv` was created in EU region `eu-west-1`.
- Resend SPF, DKIM and DMARC records were published and confirmed in public DNS.
- Supabase Email is prepared:
  - custom SMTP screen identified;
  - signup-confirmation template installed;
  - password-reset template installed;
  - application configuration and email code are ready.

## Remaining

- Publish the Resend MX record for `send.pharm.lv`.
- Complete Resend domain verification.
- Create a send-only production API key restricted to `pharm.lv`.
- Add the key and email variables to Vercel.
- Replace the temporary Supabase SMTP sender/key with production Resend credentials.
- Run end-to-end transactional and authentication email tests.

## Blocker

NIC.lv does not expose an owner/host field when creating an MX record through its current domain UI. The root Google MX must not be changed.

Support request **#921631** asks NIC.lv how to add:

- owner: `send.pharm.lv`;
- target: `feedback-smtp.eu-west-1.amazonses.com`;
- priority: `10`.

## Resume procedure

After NIC.lv replies:

1. Follow the supported NIC.lv procedure and add only the requested subdomain MX.
2. Confirm `dig +short MX send.pharm.lv`.
3. Run Resend DNS verification and wait for `pharm.lv` to become Verified.
4. Create the restricted production API key.
5. Finish Vercel and Supabase SMTP configuration.
6. Execute the acceptance tests in [EMAIL_PRODUCTION_SETUP.md](../infrastructure/EMAIL_PRODUCTION_SETUP.md).
7. Update launch status and remove the pause.

Until the support response arrives, **no email-infrastructure changes are required**.
