import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routes'
import { getEmailFrom, getSiteUrl, getSupportEmail, isOrderEmailEnabled } from '@/lib/email/config'
import {
  formatRefundEmailMoney,
  getRefundNoticeCopy,
} from '@/lib/email/refund-notice-copy'
import { getResend } from '@/lib/email/resend'
import { buildTransactionalEmailHtml, escapeHtml } from '@/lib/email/shared'

interface OrderRow {
  id: string
  order_number: string
  email: string
  first_name: string
  last_name: string
  locale: string
  total_cents: number
  refund_notice_sent_at: string | null
}

export type SendRefundNoticeResult =
  | { sent: true; messageId: string }
  | { sent: false; reason: 'disabled' | 'already_sent' | 'no_recipient' }

function buildRefundNoticeHtml(params: {
  locale: Locale
  order: OrderRow
  refundAmountCents: number
}): string {
  const { locale, order, refundAmountCents } = params
  const copy = getRefundNoticeCopy(locale)
  const customerName = `${order.first_name} ${order.last_name}`.trim()
  const ordersUrl = `${getSiteUrl()}${localizedPath(locale, '/account/orders')}`

  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:15px;line-height:1.5;">${escapeHtml(copy.greeting(customerName))}</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#374151;">${escapeHtml(copy.intro)}</p>
    <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">${escapeHtml(copy.orderNumberLabel)}</p>
    <p style="margin:0 0 20px;font-size:18px;font-weight:700;">${escapeHtml(order.order_number)}</p>
    <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">${escapeHtml(copy.amountLabel)}</p>
    <p style="margin:0 0 20px;font-size:18px;font-weight:700;color:#0f766e;">${escapeHtml(formatRefundEmailMoney(refundAmountCents, locale))}</p>
    <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">${escapeHtml(copy.timelineLabel)}</p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.5;color:#374151;">${escapeHtml(copy.timelineValue)}</p>
    <p style="margin:0 0 24px;font-size:13px;line-height:1.5;color:#6b7280;">${escapeHtml(copy.note)}</p>`

  return buildTransactionalEmailHtml({
    locale,
    preview: copy.preview,
    title: copy.title,
    bodyHtml,
    cta: { href: ordersUrl, label: copy.ordersCta },
    footer: copy.footer,
    supportText: copy.supportText,
    supportEmail: getSupportEmail(),
  })
}

export async function sendRefundNoticeEmail(
  orderId: string,
  options?: { refundAmountCents?: number }
): Promise<SendRefundNoticeResult> {
  if (!isOrderEmailEnabled()) {
    console.warn('[email] refund notice skipped — RESEND_API_KEY not configured')
    return { sent: false, reason: 'disabled' }
  }

  const supabase = createAdminClient()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(
      'id, order_number, email, first_name, last_name, locale, total_cents, refund_notice_sent_at'
    )
    .eq('id', orderId)
    .maybeSingle()

  if (orderError || !order) {
    throw new Error(`Order not found for refund notice: ${orderId}`)
  }

  const typedOrder = order as OrderRow

  if (typedOrder.refund_notice_sent_at) {
    return { sent: false, reason: 'already_sent' }
  }

  const recipient = typedOrder.email.trim()
  if (!recipient) {
    console.warn('[email] refund notice skipped — missing recipient', { orderId })
    return { sent: false, reason: 'no_recipient' }
  }

  const claimedAt = new Date().toISOString()
  const { data: claimed, error: claimError } = await supabase
    .from('orders')
    .update({ refund_notice_sent_at: claimedAt })
    .eq('id', orderId)
    .is('refund_notice_sent_at', null)
    .select('id')
    .maybeSingle()

  if (claimError) {
    throw new Error(`Failed to claim refund notice for ${orderId}: ${claimError.message}`)
  }

  if (!claimed) {
    return { sent: false, reason: 'already_sent' }
  }

  const locale: Locale = isLocale(typedOrder.locale) ? typedOrder.locale : DEFAULT_LOCALE
  const copy = getRefundNoticeCopy(locale)
  const refundAmountCents = options?.refundAmountCents ?? typedOrder.total_cents
  const html = buildRefundNoticeHtml({ locale, order: typedOrder, refundAmountCents })

  const { data, error: sendError } = await getResend().emails.send({
    from: getEmailFrom(),
    to: recipient,
    subject: copy.subject(typedOrder.order_number),
    html,
  })

  if (sendError) {
    await supabase
      .from('orders')
      .update({ refund_notice_sent_at: null })
      .eq('id', orderId)
      .eq('refund_notice_sent_at', claimedAt)
    throw new Error(`Resend failed for refund notice ${orderId}: ${sendError.message}`)
  }

  console.info('[email] refund notice sent', {
    orderId,
    orderNumber: typedOrder.order_number,
    messageId: data?.id,
    locale,
    refundAmountCents,
  })

  return { sent: true, messageId: data?.id ?? 'unknown' }
}
