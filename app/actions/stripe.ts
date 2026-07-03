"use server"

import type Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"
import { getStripe } from "@/lib/stripe"
import { toStripeUnitAmount } from "@/lib/stripe/money"
import {
  buildPaymentIntentShippingForTax,
  isStripeTaxEnabled,
  stripeInclusivePriceTaxFields,
} from "@/lib/stripe/tax"
import {
  createDraftOrder,
  type CheckoutCustomerInput,
  type CheckoutLineInput,
} from "@/lib/orders"
import { captureCheckoutError } from "@/lib/sentry/capture-checkout"
import { getCheckoutPaymentMethodTypes } from "@/lib/stripe/payment-methods"

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
  let draftOrderId: string | undefined
  let draftOrderNumber: string | undefined

  try {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const draft = await createDraftOrder(items, {
    ...customer,
    userId: user?.id ?? null,
  })
  draftOrderId = draft.orderId
  draftOrderNumber = draft.orderNumber

  const stripe = getStripe()

  const taxFields = stripeInclusivePriceTaxFields()

  const lineItems = draft.lines.map((item) => ({
    price_data: {
      currency: item.unitPrice.currency.toLowerCase(),
      product_data: {
        name: item.name,
        tax_code: taxFields.product_data.tax_code,
        metadata: {
          product_id: String(item.catalogProductId),
          product_sku: item.sku,
        },
      },
      unit_amount: toStripeUnitAmount(item.unitPrice),
      tax_behavior: taxFields.tax_behavior,
    },
    quantity: item.quantity,
  }))

  if (draft.shippingCost.amount > 0) {
    lineItems.push({
      price_data: {
        currency: draft.shippingCost.currency.toLowerCase(),
        product_data: {
          name: "Piegāde / Shipping",
          tax_code: taxFields.product_data.tax_code,
          metadata: {
            product_id: "shipping",
            product_sku: "shipping",
          },
        },
        unit_amount: toStripeUnitAmount(draft.shippingCost),
        tax_behavior: taxFields.tax_behavior,
      },
      quantity: 1,
    })
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    ui_mode: "embedded_page",
    redirect_on_completion: "never",
    line_items: lineItems,
    mode: "payment",
    payment_method_types: getCheckoutPaymentMethodTypes(),
    customer_email: customer.email.trim() || undefined,
    payment_intent_data: {
      shipping: buildPaymentIntentShippingForTax(customer),
    },
    metadata: {
      order_id: draft.orderId,
      order_number: draft.orderNumber,
      order_locale: customer.locale ?? "lv",
    },
    ...(isStripeTaxEnabled() ? { automatic_tax: { enabled: true } } : {}),
  }

  const session = await stripe.checkout.sessions.create(sessionParams)

  if (!session.client_secret) {
    throw new Error("Failed to create checkout session")
  }

  return {
    clientSecret: session.client_secret,
    orderId: draft.orderId,
    orderNumber: draft.orderNumber,
  }
  } catch (err) {
    captureCheckoutError(err, {
      stage: "session_create",
      orderId: draftOrderId,
      orderNumber: draftOrderNumber,
    })
    throw err
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
    taxAmount: session.total_details?.amount_tax ?? null,
    orderId: session.metadata?.order_id ?? null,
    orderNumber: session.metadata?.order_number ?? null,
  }
}