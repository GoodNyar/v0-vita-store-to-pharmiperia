import 'server-only'

import type Stripe from 'stripe'
import { products } from '@/lib/data'
import {
  addMoney,
  eur,
  extractInclusiveVatCents,
  multiplyMoney,
  sumMoney,
  validateShippingMoney,
  type Money,
} from '@/lib/money'
import { createAdminClient } from '@/lib/supabase/admin'
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
}

export function resolveOrderLines(items: CheckoutLineInput[]): ResolvedOrderLine[] {
  if (!items?.length) {
    throw new Error('Cart is empty')
  }

  return items.map((item) => {
    const productId = Number(item.id)
    const product = products.find((p) => p.id === productId)

    if (!product) {
      throw new Error(`Product not found: ${item.id}`)
    }
    if (!product.inStock) {
      throw new Error(`Product out of stock: ${product.name}`)
    }

    const quantity = Math.max(
      1,
      Math.min(MAX_QUANTITY_PER_LINE, Math.floor(Number(item.quantity) || 1))
    )

    return {
      catalogProductId: product.id,
      name: product.name,
      sku: product.sku,
      unitPrice: product.price,
      quantity,
      lineTotal: multiplyMoney(product.price, quantity),
    }
  })
}

function generateOrderNumber(): string {
  return `PH${Date.now().toString(36).toUpperCase()}`
}

export interface DraftOrderResult {
  orderId: string
  orderNumber: string
  subtotal: Money
  shippingCost: Money
  tax: Money
  total: Money
  lines: ResolvedOrderLine[]
}

export async function createDraftOrder(
  items: CheckoutLineInput[],
  customer: CheckoutCustomerInput
): Promise<DraftOrderResult> {
  const lines = resolveOrderLines(items)
  const shippingCost = validateShippingMoney(customer.shippingCost)
  const subtotal = sumMoney(lines.map((line) => line.lineTotal))
  const total = addMoney(subtotal, shippingCost)
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
      discount_cents: 0,
      tax_cents: taxCents,
      total_cents: total.amount,
      currency: total.currency,
    })
    .select('id, order_number')
    .single()

  if (orderError || !order) {
    throw new Error(`Failed to create order: ${orderError?.message ?? 'unknown'}`)
  }

  const orderItems = lines.map((line) => ({
    order_id: order.id,
    product_id: null,
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
    shippingCost,
    tax: eur(taxCents),
    total,
    lines,
  }
}

export async function hasProcessedStripeEvent(eventId: string): Promise<boolean> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('stripe_webhook_events')
    .select('id')
    .eq('id', eventId)
    .maybeSingle()
  return data != null
}

export async function recordStripeEvent(eventId: string, type: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('stripe_webhook_events').insert({ id: eventId, type })
  if (error && error.code !== '23505') {
    throw new Error(`Failed to record webhook event: ${error.message}`)
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
    .select('id, payment_status, total_cents, tax_cents')
    .eq('id', orderId)
    .maybeSingle()

  if (fetchError || !existing) {
    throw new Error(`Order not found: ${orderId}`)
  }

  if (existing.payment_status === 'paid') {
    return { orderId: existing.id, alreadyPaid: true }
  }

  const expectedCents = existing.total_cents
  if (session.amount_total != null && session.amount_total !== expectedCents) {
    throw new Error(
      `Payment amount mismatch for order ${orderId}: expected ${expectedCents}, got ${session.amount_total}`
    )
  }

  const taxCents = resolveTaxCentsFromSession(session)
  if (existing.tax_cents > 0 && taxCents > 0 && existing.tax_cents !== taxCents) {
    console.warn('[orders] tax_cents drift between draft and Stripe', {
      orderId,
      draftTaxCents: existing.tax_cents,
      stripeTaxCents: taxCents,
    })
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      payment_status: 'paid',
      payment_intent_id: session.id,
      tax_cents: taxCents,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (updateError) {
    throw new Error(`Failed to update order: ${updateError.message}`)
  }

  return { orderId: existing.id, alreadyPaid: false }
}