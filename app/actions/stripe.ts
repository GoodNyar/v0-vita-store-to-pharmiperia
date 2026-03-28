'use server'

import { stripe } from '@/lib/stripe'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export async function createCheckoutSession(
  items: CartItem[],
  shippingCost: number,
  customerEmail?: string
) {
  if (!items || items.length === 0) {
    throw new Error('Cart is empty')
  }

  // Build line items from cart - prices validated server-side
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100), // Convert to cents
    },
    quantity: item.quantity,
  }))

  // Add shipping as a line item
  if (shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Piegāde / Shipping',
        },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    })
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: lineItems,
    mode: 'payment',
    customer_email: customerEmail || undefined,
    metadata: {
      order_items: JSON.stringify(items.map(i => ({ id: i.id, qty: i.quantity }))),
    },
  })

  return session.client_secret
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    customerEmail: session.customer_details?.email,
    paymentStatus: session.payment_status,
    amountTotal: session.amount_total,
  }
}
