import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routes'
import { getEmailFrom, getSiteUrl, getSupportEmail, isOrderEmailEnabled } from '@/lib/email/config'
import { getAbandonedCartCopy } from '@/lib/email/abandoned-cart-copy'
import { getResend } from '@/lib/email/resend'
import { buildTransactionalEmailHtml, escapeHtml } from '@/lib/email/shared'

export type SendAbandonedCartResult =
  | { sent: true; messageId: string }
  | { sent: false; reason: 'disabled' | 'no_recipient' | 'already_sent' | 'empty_cart' }

interface CartRow {
  id: string
  user_id: string
  locale: string
  abandoned_email_sent_at: string | null
}

interface ProfileRow {
  email: string | null
  first_name: string | null
  last_name: string | null
}

/** Detect stale carts with items for retention emails. */
export async function listAbandonedCarts(olderThanHours = 24, limit = 50) {
  const supabase = createAdminClient()
  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('carts')
    .select('id, user_id, locale, updated_at, abandoned_email_sent_at, cart_items ( quantity )')
    .lt('updated_at', cutoff)
    .is('abandoned_email_sent_at', null)
    .not('user_id', 'is', null)
    .limit(limit)

  if (error) {
    throw new Error(`Failed to list abandoned carts: ${error.message}`)
  }

  return (data ?? []).filter((row) => {
    const items = row.cart_items as { quantity: number }[] | null
    return (items?.length ?? 0) > 0
  })
}

export async function sendAbandonedCartEmail(cartId: string): Promise<SendAbandonedCartResult> {
  if (!isOrderEmailEnabled()) {
    return { sent: false, reason: 'disabled' }
  }

  const supabase = createAdminClient()
  const { data: cart, error } = await supabase
    .from('carts')
    .select('id, user_id, locale, abandoned_email_sent_at')
    .eq('id', cartId)
    .maybeSingle()

  if (error || !cart) {
    throw new Error(`Cart not found: ${cartId}`)
  }

  const typed = cart as CartRow

  const { count } = await supabase
    .from('cart_items')
    .select('id', { count: 'exact', head: true })
    .eq('cart_id', cartId)

  if (!count || count === 0) {
    return { sent: false, reason: 'empty_cart' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, first_name, last_name')
    .eq('id', typed.user_id)
    .maybeSingle()

  const profileRow = profile as ProfileRow | null
  const recipient = profileRow?.email?.trim()
  if (!recipient) {
    return { sent: false, reason: 'no_recipient' }
  }

  const { data: claimed, error: claimError } = await supabase
    .from('carts')
    .update({ abandoned_email_sent_at: new Date().toISOString() })
    .eq('id', cartId)
    .is('abandoned_email_sent_at', null)
    .select('id')
    .maybeSingle()

  if (claimError) {
    throw new Error(`Failed to claim abandoned cart ${cartId}: ${claimError.message}`)
  }

  if (!claimed) {
    return { sent: false, reason: 'already_sent' }
  }

  const locale: Locale = isLocale(typed.locale) ? typed.locale : DEFAULT_LOCALE
  const copy = getAbandonedCartCopy(locale)
  const customerName = `${profileRow?.first_name ?? ''} ${profileRow?.last_name ?? ''}`.trim()
  const cartUrl = `${getSiteUrl()}${localizedPath(locale, '/cart')}`

  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:15px;line-height:1.5;">${escapeHtml(copy.greeting(customerName))}</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#374151;">${escapeHtml(copy.intro)}</p>`

  const html = buildTransactionalEmailHtml({
    locale,
    preview: copy.preview,
    title: copy.title,
    bodyHtml,
    cta: { href: cartUrl, label: copy.cta },
    footer: copy.footer,
    supportText: copy.supportText,
    supportEmail: getSupportEmail(),
  })

  const { data: sendData, error: sendError } = await getResend().emails.send({
    from: getEmailFrom(),
    to: recipient,
    subject: copy.subject,
    html,
  })

  if (sendError) {
    await supabase
      .from('carts')
      .update({ abandoned_email_sent_at: null })
      .eq('id', cartId)
    throw new Error(`Resend failed for abandoned cart ${cartId}: ${sendError.message}`)
  }

  return { sent: true, messageId: sendData?.id ?? 'unknown' }
}

/** Cron entry: process a batch of abandoned carts. */
export async function processAbandonedCartBatch(
  olderThanHours = 24,
  limit = 25
): Promise<{ processed: number; sent: number; skipped: number }> {
  const carts = await listAbandonedCarts(olderThanHours, limit)
  let sent = 0
  let skipped = 0

  for (const cart of carts) {
    const result = await sendAbandonedCartEmail(cart.id)
    if (result.sent) {
      sent += 1
    } else {
      skipped += 1
    }
  }

  return { processed: carts.length, sent, skipped }
}