import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routes'
import { getEmailFrom, getSiteUrl, getSupportEmail, isOrderEmailEnabled } from '@/lib/email/config'
import { getReviewRequestCopy } from '@/lib/email/review-request-copy'
import { getResend } from '@/lib/email/resend'
import { buildTransactionalEmailHtml, escapeHtml } from '@/lib/email/shared'

interface OrderRow {
  id: string
  order_number: string
  email: string
  first_name: string
  last_name: string
  locale: string
  status: string | null
  review_request_email_sent_at: string | null
}

export type SendReviewRequestResult =
  | { sent: true; messageId: string }
  | { sent: false; reason: 'disabled' | 'no_recipient' | 'not_delivered' | 'already_sent' }

export async function processReviewRequestBatch(
  limit = 25
): Promise<{ processed: number; sent: number; skipped: number }> {
  const orderIds = await listOrdersPendingReviewRequest(limit)
  let sent = 0
  let skipped = 0

  for (const orderId of orderIds) {
    const result = await sendReviewRequestEmail(orderId)
    if (result.sent) {
      sent += 1
    } else {
      skipped += 1
    }
  }

  return { processed: orderIds.length, sent, skipped }
}

function buildReviewRequestHtml(params: {
  locale: Locale
  order: OrderRow
}): string {
  const { locale, order } = params
  const copy = getReviewRequestCopy(locale)
  const customerName = `${order.first_name} ${order.last_name}`.trim()
  const reviewsUrl = `${getSiteUrl()}${localizedPath(locale, '/reviews')}`

  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:15px;line-height:1.5;">${escapeHtml(copy.greeting(customerName))}</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.5;color:#374151;">${escapeHtml(copy.intro)}</p>
    <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">${escapeHtml(copy.orderNumberLabel)}</p>
    <p style="margin:0 0 24px;font-size:18px;font-weight:700;">${escapeHtml(order.order_number)}</p>`

  return buildTransactionalEmailHtml({
    locale,
    preview: copy.preview,
    title: copy.title,
    bodyHtml,
    cta: { href: reviewsUrl, label: copy.reviewCta },
    footer: copy.footer,
    supportText: copy.supportText,
    supportEmail: getSupportEmail(),
  })
}

export async function listOrdersPendingReviewRequest(limit = 25): Promise<string[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .select('id')
    .eq('status', 'delivered')
    .is('review_request_email_sent_at', null)
    .order('updated_at', { ascending: true })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to list review-request orders: ${error.message}`)
  }

  return (data ?? []).map((row) => row.id)
}

export async function sendReviewRequestEmail(
  orderId: string
): Promise<SendReviewRequestResult> {
  if (!isOrderEmailEnabled()) {
    console.warn('[email] review request skipped — RESEND_API_KEY not configured')
    return { sent: false, reason: 'disabled' }
  }

  const supabase = createAdminClient()
  const { data: order, error } = await supabase
    .from('orders')
    .select('id, order_number, email, first_name, last_name, locale, status, review_request_email_sent_at')
    .eq('id', orderId)
    .maybeSingle()

  if (error || !order) {
    throw new Error(`Order not found for review request: ${orderId}`)
  }

  const typed = order as OrderRow

  if (typed.status !== 'delivered') {
    return { sent: false, reason: 'not_delivered' }
  }

  const recipient = typed.email.trim()
  if (!recipient) {
    console.warn('[email] review request skipped — missing recipient', { orderId })
    return { sent: false, reason: 'no_recipient' }
  }

  // Atomic claim before send — prevents duplicate emails (admin + cron race)
  const { data: claimed, error: claimError } = await supabase
    .from('orders')
    .update({ review_request_email_sent_at: new Date().toISOString() })
    .eq('id', orderId)
    .eq('status', 'delivered')
    .is('review_request_email_sent_at', null)
    .select('id')
    .maybeSingle()

  if (claimError) {
    throw new Error(`Failed to claim review request for ${orderId}: ${claimError.message}`)
  }

  if (!claimed) {
    return { sent: false, reason: 'already_sent' }
  }

  const locale: Locale = isLocale(typed.locale) ? typed.locale : DEFAULT_LOCALE
  const copy = getReviewRequestCopy(locale)
  const html = buildReviewRequestHtml({ locale, order: typed })

  const { data, error: sendError } = await getResend().emails.send({
    from: getEmailFrom(),
    to: recipient,
    subject: copy.subject(typed.order_number),
    html,
  })

  if (sendError) {
    await supabase
      .from('orders')
      .update({ review_request_email_sent_at: null })
      .eq('id', orderId)
    throw new Error(`Resend failed for review request ${orderId}: ${sendError.message}`)
  }

  console.info('[email] review request sent', {
    orderId,
    orderNumber: typed.order_number,
    messageId: data?.id,
  })

  return { sent: true, messageId: data?.id ?? 'unknown' }
}