import 'server-only'

import type Stripe from 'stripe'
import { getProductByLegacyId } from '@/lib/commerce/products'
import {
  addMoney,
  eur,
  extractInclusiveVatCents,
  multiplyMoney,
  sumMoney,
  validateShippingMoney,
  type Money,
} from '@/lib/money'
import { legacyProductIdToUuid } from '@/lib/commerce/ids'
import { createAdminClient } from '@/lib/supabase/admin'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n/config'
import { recordPurchaseEvent } from '@/lib/analytics/server'
import { validatePromoCode } from '@/lib/commerce/promo'
import { resolveTaxCentsFromSession } from '@/lib/stripe/tax'

const MAX_QUANTITY_PER_LINE = 99

export interface CheckoutLineInput {
  id: number
  quantity: number
}

export interface ResolvedOrderLine {
  catalogProductId: number
  name: string
  sku: string
  unitPrice: Money
  quantity: number
  lineTotal: Money
}

export interface CheckoutCustomerInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  shippingMethod: string
  shippingCost: Money
  parcelStation?: string
  shippingAddress?: {
    street: string
    city: string
    postalCode: string
  }
  userId?: string | null
  locale?: Locale
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  promoCode?: string | null
}

export async function resolveOrderLines(
  items: CheckoutLineInput[],
  locale: Locale = DEFAULT_LOCALE
): Promise<ResolvedOrderLine[]> {
  if (!items?.length) {
    throw new Error('Cart is empty')
  }

  const lines: ResolvedOrderLine[] = []

  for (const item of items) {
    const productId = Number(item.id)
    const quantity = Math.max(
      1,
      Math.min(MAX_QUANTITY_PER_LINE, Math.floor(Number(item.quantity) || 1))
    )

    const result = await getProductByLegacyId(productId, locale)
    if (!result.ok) {
      throw new Error(`Product not found: ${item.id}`)
    }

    const product = result.data
    if (!product.legacyId) {
      throw new Error(`Product missing legacy id: ${item.id}`)
    }
    if (!product.inStock || product.stockQuantity < quantity) {
      throw new Error(`Product out of stock: ${product.name}`)
    }

    lines.push({
      catalogProductId: product.legacyId,
      name: product.name,
      sku: product.sku,
      unitPrice: product.price,
      quantity,
      lineTotal: multiplyMoney(product.price, quantity),
    })
  }

  return lines
}

function generateOrderNumber(): string {
  return `PH${Date.now().toString(36).toUpperCase()}`
}

export interface DraftOrderResult {
  orderId: string
  orderNumber: string
  subtotal: Money
  discount: Money
  shippingCost: Money
  tax: Money
  total: Money
  lines: ResolvedOrderLine[]
  promoCodeId: string | null
}

export async function createDraftOrder(
  items: CheckoutLineInput[],
  customer: CheckoutCustomerInput
): Promise<DraftOrderResult> {
  const locale = isLocale(customer.locale) ? customer.locale : DEFAULT_LOCALE
  const lines = await resolveOrderLines(items, locale)
  const shippingCost = validateShippingMoney(customer.shippingCost)
  const subtotal = sumMoney(lines.map((line) => line.lineTotal))

  let discount = eur(0)
  let promoCodeId: string | null = null
  const promoInput = customer.promoCode?.trim()
  if (promoInput) {
    const promo = await validatePromoCode(promoInput, subtotal.amount)
    if (!promo.valid) {
      throw new Error(`Invalid promo code: ${promo.error ?? 'invalid'}`)
    }
    discount = eur(promo.discountCents ?? 0)
    promoCodeId = promo.promoId ?? null
  }

  const discountedSubtotal = eur(Math.max(0, subtotal.amount - discount.amount))
  const total = addMoney(discountedSubtotal, shippingCost)
  const taxCents = extractInclusiveVatCents(total.amount)

  const supabase = createAdminClient()
  const orderNumber = generateOrderNumber()

  const shippingAddress =
    customer.shippingAddress != null
      ? {
          street: customer.shippingAddress.street,
          city: customer.shippingAddress.city,
          postal_code: customer.shippingAddress.postalCode,
        }
      : null

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: customer.userId ?? null,
      order_number: orderNumber,
      status: 'pending',
      payment_status: 'pending',
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      first_name: customer.firstName.trim(),
      last_name: customer.lastName.trim(),
      shipping_method: customer.shippingMethod,
      shipping_cost_cents: shippingCost.amount,
      shipping_address: shippingAddress,
      parcel_station: customer.parcelStation ?? null,
      subtotal_cents: subtotal.amount,
      discount_cents: discount.amount,
      promo_code_id: promoCodeId,
      tax_cents: taxCents,
      total_cents: total.amount,
      currency: total.currency,
      locale,
      utm_source: customer.utmSource ?? null,
      utm_medium: customer.utmMedium ?? null,
      utm_campaign: customer.utmCampaign ?? null,
    })
    .select('id, order_number')
    .single()

  if (orderError || !order) {
    throw new Error(`Failed to create order: ${orderError?.message ?? 'unknown'}`)
  }

  const orderItems = lines.map((line) => ({
    order_id: order.id,
    product_id: legacyProductIdToUuid(line.catalogProductId),
    product_name: line.name,
    product_sku: line.sku,
    quantity: line.quantity,
    unit_price_cents: line.unitPrice.amount,
    total_price_cents: line.lineTotal.amount,
    currency: line.unitPrice.currency,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

  if (itemsError) {
    throw new Error(`Failed to create order items: ${itemsError.message}`)
  }

  return {
    orderId: order.id,
    orderNumber: order.order_number,
    subtotal,
    discount,
    shippingCost,
    tax: eur(taxCents),
    total,
    lines,
    promoCodeId,
  }
}

export async function markOrderNeedsInventoryAttention(orderId: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'needs_attention',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) {
    throw new Error(`Failed to mark order needs_attention: ${error.message}`)
  }
}

/** Atomically claim a Stripe event (M-10). Returns true if this caller owns processing. */
export async function claimStripeEvent(eventId: string, type: string): Promise<boolean> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('stripe_webhook_events')
    .insert({ id: eventId, type })
    .select('id')
    .maybeSingle()

  if (error) {
    if (error.code === '23505') {
      return false
    }
    throw new Error(`Failed to claim webhook event: ${error.message}`)
  }

  return data != null
}

/** Release a failed claim so Stripe retries can re-process (ADR-0022). */
export async function releaseStripeEventClaim(eventId: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('stripe_webhook_events').delete().eq('id', eventId)

  if (error) {
    throw new Error(`Failed to release webhook event claim: ${error.message}`)
  }
}

export async function fulfillOrderFromCheckoutSession(
  session: Stripe.Checkout.Session
): Promise<{ orderId: string; alreadyPaid: boolean } | null> {
  const orderId = session.metadata?.order_id
  if (!orderId) {
    console.error('[orders] checkout.session.completed missing order_id metadata', session.id)
    return null
  }

  if (session.payment_status !== 'paid') {
    console.warn('[orders] session not paid yet', session.id, session.payment_status)
    return null
  }

  const supabase = createAdminClient()

  const { data: existing, error: fetchError } = await supabase
    .from('orders')
    .select(
      'id, payment_status, total_cents, tax_cents, order_number, currency, locale, user_id, utm_source, utm_medium, utm_campaign, analytics_event_id'
    )
    .eq('id', orderId)
    .maybeSingle()

  if (fetchError || !existing) {
    throw new Error(`Order not found: ${orderId}`)
  }

  const alreadyPaid = existing.payment_status === 'paid'

  const taxCents = resolveTaxCentsFromSession(session)

  if (!alreadyPaid) {
    const expectedCents = existing.total_cents
    if (session.amount_total != null && session.amount_total !== expectedCents) {
      throw new Error(
        `Payment amount mismatch for order ${orderId}: expected ${expectedCents}, got ${session.amount_total}`
      )
    }

    if (existing.tax_cents > 0 && taxCents > 0 && existing.tax_cents !== taxCents) {
      console.warn('[orders] tax_cents drift between draft and Stripe', {
        orderId,
        draftTaxCents: existing.tax_cents,
        stripeTaxCents: taxCents,
      })
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id ?? null

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_status: 'paid',
        payment_intent_id: paymentIntentId ?? session.id,
        tax_cents: taxCents,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (updateError) {
      throw new Error(`Failed to update order: ${updateError.message}`)
    }
  }

  if (!existing.analytics_event_id) {
    const { data: lineRows, error: linesError } = await supabase
      .from('order_items')
      .select('product_id, product_sku, product_name, quantity, unit_price_cents')
      .eq('order_id', orderId)

    if (linesError) {
      throw new Error(`Failed to load order items for analytics: ${linesError.message}`)
    }

    await recordPurchaseEvent({
      orderId: existing.id,
      userId: existing.user_id,
      orderNumber: existing.order_number,
      totalCents: existing.total_cents,
      currency: existing.currency,
      taxCents: taxCents,
      locale: existing.locale,
      utmSource: existing.utm_source,
      utmMedium: existing.utm_medium,
      utmCampaign: existing.utm_campaign,
      lineItems: (lineRows ?? []).map((line) => ({
        productId: line.product_id,
        productSku: line.product_sku,
        productName: line.product_name,
        quantity: line.quantity,
        unitPriceCents: line.unit_price_cents,
      })),
    })
  }

  return { orderId: existing.id, alreadyPaid }
}