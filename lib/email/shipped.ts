import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routes'
import { getEmailFrom, getSiteUrl, getSupportEmail, isOrderEmailEnabled } from '@/lib/email/config'
import {
  getOrderShippedCopy,
  getShippedDeliveryLabel,
} from '@/lib/email/shipped-copy'
import { getResend } from '@/lib/email/resend'
import { buildTransactionalEmailHtml, escapeHtml } from '@/lib/email/shared'

interface OrderRow {
  id: string
  order_number: string
  email: string
  first_name: string
  last_name: string
  locale: string
  shipping_method: string
  parcel_station: string | null
  shipped_email_sent_at: string | null
  tracking_number: string | null
}

export type SendOrderShippedResult =
  | { sent: true; messageId: string }
  | { sent: false; reason: 'disabled' | 'already_sent' | 'no_recipient' }

function buildOrderShippedHtml(params: {
  locale: Locale
  order: OrderRow
  trackingNumber: string | null
}): string {
  const { locale, order, trackingNumber } = params
  const copy = getOrderShippedCopy(locale)
  const customerName = `${order.first_name} ${order.last_name}`.trim()
  const shippingLabel = getShippedDeliveryLabel(locale, order.shipping_method)
  const deliveryLine = order.parcel_station
    ? `${shippingLabel} — ${order.parcel_station}`
    : shippingLabel
  const ordersUrl = `${getSiteUrl()}${localizedPath(locale, '/account/orders')}`
  const trackingValue = trackingNumber?.trim() || copy.trackingPending

  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:15px;line-height:1.5;">${escapeHtml(copy.greeting(customerName))}</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#374151;">${escapeHtml(copy.intro)}</p>
    <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">${escapeHtml(copy.orderNumberLabel)}</p>
    <p style="margin:0 0 20px;font-size:18px;font-weight:700;">${escapeHtml(order.order_number)}</p>
    <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">${escapeHtml(copy.trackingLabel)}</p>
    <p style="margin:0 0 20px;font-size:15px;font-weight:600;">${escapeHtml(trackingValue)}</p>
    <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">${escapeHtml(copy.deliveryTitle)}</p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.5;color:#374151;">${escapeHtml(deliveryLine)}</p>`

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

export async function sendOrderShippedEmail(
  orderId: string,
  options?: { trackingNumber?: string | null }
): Promise<SendOrderShippedResult> {
  if (!isOrderEmailEnabled()) {
    console.warn('[email] shipped notice skipped — RESEND_API_KEY not configured')
    return { sent: false, reason: 'disabled' }
  }

  const supabase = createAdminClient()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(
      'id, order_number, email, first_name, last_name, locale, shipping_method, parcel_station, shipped_email_sent_at, tracking_number'
    )
    .eq('id', orderId)
    .maybeSingle()

  if (orderError || !order) {
    throw new Error(`Order not found for shipped email: ${orderId}`)
  }

  const typedOrder = order as OrderRow

  if (typedOrder.shipped_email_sent_at) {
    return { sent: false, reason: 'already_sent' }
  }

  const recipient = typedOrder.email.trim()
  if (!recipient) {
    console.warn('[email] shipped notice skipped — missing recipient', { orderId })
    return { sent: false, reason: 'no_recipient' }
  }

  const claimedAt = new Date().toISOString()
  const { data: claimed, error: claimError } = await supabase
    .from('orders')
    .update({
      shipped_email_sent_at: claimedAt,
      ...(options?.trackingNumber ? { tracking_number: options.trackingNumber } : {}),
    })
    .eq('id', orderId)
    .is('shipped_email_sent_at', null)
    .select('id')
    .maybeSingle()

  if (claimError) {
    throw new Error(`Failed to claim shipped email for ${orderId}: ${claimError.message}`)
  }

  if (!claimed) {
    return { sent: false, reason: 'already_sent' }
  }

  const locale: Locale = isLocale(typedOrder.locale) ? typedOrder.locale : DEFAULT_LOCALE
  const copy = getOrderShippedCopy(locale)
  const trackingNumber = options?.trackingNumber ?? typedOrder.tracking_number
  const html = buildOrderShippedHtml({ locale, order: typedOrder, trackingNumber })

  const { data, error: sendError } = await getResend().emails.send({
    from: getEmailFrom(),
    to: recipient,
    subject: copy.subject(typedOrder.order_number),
    html,
  })

  if (sendError) {
    await supabase
      .from('orders')
      .update({ shipped_email_sent_at: null })
      .eq('id', orderId)
      .eq('shipped_email_sent_at', claimedAt)
    throw new Error(`Resend failed for shipped email ${orderId}: ${sendError.message}`)
  }

  console.info('[email] order shipped notice sent', {
    orderId,
    orderNumber: typedOrder.order_number,
    messageId: data?.id,
    locale,
  })

  return { sent: true, messageId: data?.id ?? 'unknown' }
}
