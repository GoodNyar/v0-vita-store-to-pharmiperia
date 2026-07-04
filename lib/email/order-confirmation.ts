import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routes'
import { getEmailFrom, getSiteUrl, getSupportEmail, isOrderEmailEnabled } from '@/lib/email/config'
import {
  formatEmailMoney,
  getOrderConfirmationCopy,
  getShippingMethodLabel,
} from '@/lib/email/order-confirmation-copy'
import { getResend } from '@/lib/email/resend'

interface OrderItemRow {
  product_name: string
  quantity: number
  unit_price_cents: number
  total_price_cents: number
}

interface OrderRow {
  id: string
  order_number: string
  email: string
  first_name: string
  last_name: string
  locale: string
  subtotal_cents: number
  shipping_cost_cents: number
  tax_cents: number
  total_cents: number
  shipping_method: string
  parcel_station: string | null
  confirmation_email_sent_at: string | null
}

export type SendOrderConfirmationResult =
  | { sent: true; messageId: string }
  | { sent: false; reason: 'disabled' | 'already_sent' | 'no_recipient' }

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function buildOrderConfirmationHtml(params: {
  locale: Locale
  order: OrderRow
  items: OrderItemRow[]
}): string {
  const { locale, order, items } = params
  const copy = getOrderConfirmationCopy(locale)
  const customerName = `${order.first_name} ${order.last_name}`.trim()
  const shippingLabel = getShippingMethodLabel(locale, order.shipping_method)
  const deliveryLine = order.parcel_station
    ? `${shippingLabel} — ${order.parcel_station}`
    : shippingLabel
  const ordersUrl = `${getSiteUrl()}${localizedPath(locale, '/account/orders')}`

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(item.product_name)}</td>
          <td style="padding:8px 4px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatEmailMoney(item.total_price_cents, locale)}</td>
        </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="${locale}">
  <body style="margin:0;padding:0;background:#f6f7f9;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
    <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(copy.preview)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7f9;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:32px 28px;">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:13px;color:#6b7280;letter-spacing:0.04em;text-transform:uppercase;">Pharmiperia</p>
                <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;">${escapeHtml(copy.title)}</h1>
                <p style="margin:0 0 12px;font-size:15px;line-height:1.5;">${escapeHtml(copy.greeting(customerName))}</p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#374151;">${escapeHtml(copy.intro)}</p>

                <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">${escapeHtml(copy.orderNumberLabel)}</p>
                <p style="margin:0 0 24px;font-size:18px;font-weight:700;">${escapeHtml(order.order_number)}</p>

                <h2 style="margin:0 0 12px;font-size:16px;">${escapeHtml(copy.itemsTitle)}</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;font-size:14px;">
                  <thead>
                    <tr>
                      <th align="left" style="padding:0 0 8px;border-bottom:2px solid #e5e7eb;font-weight:600;"> </th>
                      <th align="center" style="padding:0 4px 8px;border-bottom:2px solid #e5e7eb;font-weight:600;">${escapeHtml(copy.quantityLabel)}</th>
                      <th align="right" style="padding:0 0 8px;border-bottom:2px solid #e5e7eb;font-weight:600;"> </th>
                    </tr>
                  </thead>
                  <tbody>${itemRows}</tbody>
                </table>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;font-size:14px;">
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">${escapeHtml(copy.subtotalLabel)}</td>
                    <td align="right" style="padding:4px 0;">${formatEmailMoney(order.subtotal_cents, locale)}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">${escapeHtml(copy.shippingLabel)}</td>
                    <td align="right" style="padding:4px 0;">${formatEmailMoney(order.shipping_cost_cents, locale)}</td>
                  </tr>
                  ${
                    order.tax_cents > 0
                      ? `<tr>
                    <td style="padding:4px 0;color:#6b7280;">${escapeHtml(copy.vatLabel)}</td>
                    <td align="right" style="padding:4px 0;">${formatEmailMoney(order.tax_cents, locale)}</td>
                  </tr>`
                      : ''
                  }
                  <tr>
                    <td style="padding:10px 0 4px;font-weight:700;border-top:1px solid #e5e7eb;">${escapeHtml(copy.totalLabel)}</td>
                    <td align="right" style="padding:10px 0 4px;font-weight:700;border-top:1px solid #e5e7eb;">${formatEmailMoney(order.total_cents, locale)}</td>
                  </tr>
                </table>

                <h2 style="margin:0 0 8px;font-size:16px;">${escapeHtml(copy.deliveryTitle)}</h2>
                <p style="margin:0 0 24px;font-size:14px;line-height:1.5;color:#374151;">${escapeHtml(deliveryLine)}</p>

                <a href="${ordersUrl}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;">${escapeHtml(copy.ordersCta)}</a>

                <p style="margin:28px 0 0;font-size:13px;line-height:1.5;color:#6b7280;">
                  ${escapeHtml(copy.supportText)}
                  <a href="mailto:${getSupportEmail()}" style="color:#0f766e;">${getSupportEmail()}</a>
                </p>
                <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">${escapeHtml(copy.footer)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export async function sendOrderConfirmationEmail(
  orderId: string
): Promise<SendOrderConfirmationResult> {
  if (!isOrderEmailEnabled()) {
    console.warn('[email] order confirmation skipped — RESEND_API_KEY not configured')
    return { sent: false, reason: 'disabled' }
  }

  const supabase = createAdminClient()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(
      'id, order_number, email, first_name, last_name, locale, subtotal_cents, shipping_cost_cents, tax_cents, total_cents, shipping_method, parcel_station, confirmation_email_sent_at'
    )
    .eq('id', orderId)
    .maybeSingle()

  if (orderError || !order) {
    throw new Error(`Order not found for confirmation email: ${orderId}`)
  }

  const typedOrder = order as OrderRow

  const recipient = typedOrder.email.trim()
  if (!recipient) {
    console.warn('[email] order confirmation skipped — missing recipient', { orderId })
    return { sent: false, reason: 'no_recipient' }
  }

  // Atomic claim before send — prevents duplicate emails on webhook retry
  const { data: claimed, error: claimError } = await supabase
    .from('orders')
    .update({ confirmation_email_sent_at: new Date().toISOString() })
    .eq('id', orderId)
    .is('confirmation_email_sent_at', null)
    .select(
      'id, order_number, email, first_name, last_name, locale, subtotal_cents, shipping_cost_cents, tax_cents, total_cents, shipping_method, parcel_station, confirmation_email_sent_at'
    )
    .maybeSingle()

  if (claimError) {
    throw new Error(`Failed to claim confirmation email for ${orderId}: ${claimError.message}`)
  }

  if (!claimed) {
    return { sent: false, reason: 'already_sent' }
  }

  const claimedOrder = claimed as OrderRow

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('product_name, quantity, unit_price_cents, total_price_cents')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true })

  if (itemsError) {
    await supabase
      .from('orders')
      .update({ confirmation_email_sent_at: null })
      .eq('id', orderId)
    throw new Error(`Failed to load order items for email: ${itemsError.message}`)
  }

  const locale: Locale = isLocale(claimedOrder.locale) ? claimedOrder.locale : DEFAULT_LOCALE
  const copy = getOrderConfirmationCopy(locale)
  const html = buildOrderConfirmationHtml({
    locale,
    order: claimedOrder,
    items: (items ?? []) as OrderItemRow[],
  })

  const { data, error: sendError } = await getResend().emails.send({
    from: getEmailFrom(),
    to: recipient,
    subject: copy.subject(claimedOrder.order_number),
    html,
  })

  if (sendError) {
    await supabase
      .from('orders')
      .update({ confirmation_email_sent_at: null })
      .eq('id', orderId)
    throw new Error(`Resend failed for order ${orderId}: ${sendError.message}`)
  }

  console.info('[email] order confirmation sent', {
    orderId,
    orderNumber: claimedOrder.order_number,
    messageId: data?.id,
    locale,
  })

  return { sent: true, messageId: data?.id ?? 'unknown' }
}