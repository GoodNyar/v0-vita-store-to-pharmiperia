"use server"

import { createClient } from "@/lib/supabase/server"
import { getStripe } from "@/lib/stripe"
import {
  createDraftOrder,
  type CheckoutCustomerInput,
  type CheckoutLineInput,
} from "@/lib/orders"

export type { CheckoutCustomerInput, CheckoutLineInput }

export interface CheckoutSessionResult {
  clientSecret: string
  orderId: string
  orderNumber: string
}

export async function createCheckoutSession(
  items: CheckoutLineInput[],
  customer: CheckoutCustomerInput
): Promise<CheckoutSessionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const draft = await createDraftOrder(items, {
    ...customer,
    userId: user?.id ?? null,
  })

  const stripe = getStripe()

  const lineItems = draft.lines.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.name,
        metadata: {
          product_id: String(item.catalogProductId),
          product_sku: item.sku,
        },
      },
      unit_amount: Math.round(item.unitPrice * 100),
    },
    quantity: item.quantity,
  }))

  if (draft.shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Piegāde / Shipping",
          metadata: {
            product_id: "shipping",
            product_sku: "shipping",
          },
        },
        unit_amount: Math.round(draft.shippingCost * 100),
      },
      quantity: 1,
    })
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded_page",
    redirect_on_completion: "never",
    line_items: lineItems,
    mode: "payment",
    customer_email: customer.email.trim() || undefined,
    metadata: {
      order_id: draft.orderId,
      order_number: draft.orderNumber,
    },
  })

  if (!session.client_secret) {
    throw new Error("Failed to create checkout session")
  }

  return {
    clientSecret: session.client_secret,
    orderId: draft.orderId,
    orderNumber: draft.orderNumber,
  }
}

export async function getCheckoutSession(sessionId: string) {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    customerEmail: session.customer_details?.email,
    paymentStatus: session.payment_status,
    amountTotal: session.amount_total,
    orderId: session.metadata?.order_id ?? null,
    orderNumber: session.metadata?.order_number ?? null,
  }
}