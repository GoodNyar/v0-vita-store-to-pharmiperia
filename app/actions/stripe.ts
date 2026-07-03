"use server"

import { products } from "@/lib/data"
import { stripe } from "@/lib/stripe"

const ALLOWED_SHIPPING_COSTS = [0, 2.95, 2.99, 3.2, 3.5, 5.99]
const MAX_QUANTITY_PER_LINE = 99

export interface CheckoutCartItem {
  id: number
  quantity: number
}

interface ResolvedLineItem {
  id: number
  name: string
  price: number
  quantity: number
}

function resolveLineItems(items: CheckoutCartItem[]): ResolvedLineItem[] {
  if (!items?.length) {
    throw new Error("Cart is empty")
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
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
    }
  })
}

function validateShippingCost(cost: number): number {
  const normalized = Math.round(Number(cost) * 100) / 100
  const isAllowed = ALLOWED_SHIPPING_COSTS.some(
    (allowed) => Math.abs(allowed - normalized) < 0.01
  )
  if (!isAllowed) {
    throw new Error("Invalid shipping cost")
  }
  return normalized
}

export async function createCheckoutSession(
  items: CheckoutCartItem[],
  shippingCost: number,
  customerEmail?: string
) {
  const resolvedItems = resolveLineItems(items)
  const validatedShipping = validateShippingCost(shippingCost)

  const lineItems = resolvedItems.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.name,
        metadata: {
          product_id: String(item.id),
        },
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  if (validatedShipping > 0) {
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Piegāde / Shipping",
          metadata: {
            product_id: "shipping",
          },
        },
        unit_amount: Math.round(validatedShipping * 100),
      },
      quantity: 1,
    })
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded_page",
    redirect_on_completion: "never",
    line_items: lineItems,
    mode: "payment",
    customer_email: customerEmail || undefined,
    metadata: {
      order_items: JSON.stringify(
        resolvedItems.map((i) => ({ id: i.id, qty: i.quantity }))
      ),
    },
  })

  if (!session.client_secret) {
    throw new Error("Failed to create checkout session")
  }

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