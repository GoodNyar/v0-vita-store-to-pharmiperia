import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe"
import { sendOrderConfirmationEmail } from "@/lib/email/order-confirmation"
import {
  fulfillOrderFromCheckoutSession,
  hasProcessedStripeEvent,
  recordStripeEvent,
} from "@/lib/orders"
import { decrementStockForOrder } from "@/lib/inventory/decrement"
import { captureCheckoutError } from "@/lib/sentry/capture-checkout"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing Stripe webhook configuration" },
      { status: 400 }
    )
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature"
    console.error("[webhooks/stripe] Signature verification failed:", message)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (await hasProcessedStripeEvent(event.id)) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  let checkoutSessionId: string | undefined

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      checkoutSessionId = session.id
      const result = await fulfillOrderFromCheckoutSession(session)

      if (result) {
        console.info("[webhooks/stripe] order fulfilled", {
          eventId: event.id,
          sessionId: session.id,
          orderId: result.orderId,
          alreadyPaid: result.alreadyPaid,
        })

        await decrementStockForOrder(result.orderId)

        try {
          const emailResult = await sendOrderConfirmationEmail(result.orderId)
          if (emailResult.sent) {
            console.info("[webhooks/stripe] order confirmation email sent", {
              orderId: result.orderId,
              messageId: emailResult.messageId,
            })
          }
        } catch (emailErr) {
          captureCheckoutError(emailErr, {
            stage: "webhook_email",
            orderId: result.orderId,
            sessionId: checkoutSessionId,
          })
          throw emailErr
        }
      }
    }

    await recordStripeEvent(event.id, event.type)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler failed"
    captureCheckoutError(err, {
      stage: "webhook_fulfill",
      sessionId: checkoutSessionId,
    })
    console.error("[webhooks/stripe] Handler error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}