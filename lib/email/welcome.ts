import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routes'
import { getEmailFrom, getSiteUrl, getSupportEmail, isOrderEmailEnabled } from '@/lib/email/config'
import { getWelcomeEmailCopy } from '@/lib/email/welcome-copy'
import { getResend } from '@/lib/email/resend'
import { buildTransactionalEmailHtml, escapeHtml } from '@/lib/email/shared'

interface ProfileRow {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  preferred_language: string | null
  welcome_email_sent_at: string | null
}

export type SendWelcomeEmailResult =
  | { sent: true; messageId: string }
  | { sent: false; reason: 'disabled' | 'no_recipient' | 'already_sent' }

function buildWelcomeHtml(params: { locale: Locale; customerName: string }): string {
  const { locale, customerName } = params
  const copy = getWelcomeEmailCopy(locale)
  const shopUrl = `${getSiteUrl()}${localizedPath(locale, '/')}`

  const perksHtml = copy.perks
    .map(
      (perk) =>
        `<li style="margin:0 0 8px;font-size:14px;line-height:1.5;color:#374151;">${escapeHtml(perk)}</li>`
    )
    .join('')

  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:15px;line-height:1.5;">${escapeHtml(copy.greeting(customerName))}</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.5;color:#374151;">${escapeHtml(copy.intro)}</p>
    <h2 style="margin:0 0 12px;font-size:16px;">${escapeHtml(copy.perksTitle)}</h2>
    <ul style="margin:0 0 24px;padding-left:20px;">${perksHtml}</ul>`

  return buildTransactionalEmailHtml({
    locale,
    preview: copy.preview,
    title: copy.title,
    bodyHtml,
    cta: { href: shopUrl, label: copy.shopCta },
    footer: copy.footer,
    supportText: copy.supportText,
    supportEmail: getSupportEmail(),
  })
}

export async function sendWelcomeEmail(userId: string): Promise<SendWelcomeEmailResult> {
  if (!isOrderEmailEnabled()) {
    console.warn('[email] welcome skipped — RESEND_API_KEY not configured')
    return { sent: false, reason: 'disabled' }
  }

  const supabase = createAdminClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, preferred_language, welcome_email_sent_at')
    .eq('id', userId)
    .maybeSingle()

  if (error || !profile) {
    throw new Error(`Profile not found for welcome email: ${userId}`)
  }

  const typed = profile as ProfileRow
  if (typed.welcome_email_sent_at) {
    return { sent: false, reason: 'already_sent' }
  }

  const recipient = typed.email?.trim()
  if (!recipient) {
    console.warn('[email] welcome skipped — missing recipient', { userId })
    return { sent: false, reason: 'no_recipient' }
  }

  const claimedAt = new Date().toISOString()
  const { data: claimed, error: claimError } = await supabase
    .from('profiles')
    .update({ welcome_email_sent_at: claimedAt })
    .eq('id', userId)
    .is('welcome_email_sent_at', null)
    .select('id')
    .maybeSingle()

  if (claimError) {
    throw new Error(`Failed to claim welcome email for ${userId}: ${claimError.message}`)
  }

  if (!claimed) {
    return { sent: false, reason: 'already_sent' }
  }

  const locale: Locale = isLocale(typed.preferred_language ?? '')
    ? (typed.preferred_language as Locale)
    : DEFAULT_LOCALE
  const customerName =
    `${typed.first_name ?? ''} ${typed.last_name ?? ''}`.trim() || recipient.split('@')[0]
  const copy = getWelcomeEmailCopy(locale)
  const html = buildWelcomeHtml({ locale, customerName })

  const { data, error: sendError } = await getResend().emails.send({
    from: getEmailFrom(),
    to: recipient,
    subject: copy.subject,
    html,
  })

  if (sendError) {
    await supabase
      .from('profiles')
      .update({ welcome_email_sent_at: null })
      .eq('id', userId)
      .eq('welcome_email_sent_at', claimedAt)
    throw new Error(`Resend failed for welcome email ${userId}: ${sendError.message}`)
  }

  console.info('[email] welcome sent', { userId, messageId: data?.id, locale })
  return { sent: true, messageId: data?.id ?? 'unknown' }
}
