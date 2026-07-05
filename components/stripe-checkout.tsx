'use client'

import { useCallback, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import {
  createCheckoutSession,
  type CheckoutCustomerInput,
} from '@/app/actions/stripe'
import { captureCheckoutError } from '@/lib/sentry/capture-checkout'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CartItem {
  id: number
  quantity: number
}

interface StripeCheckoutProps {
  items: CartItem[]
  checkoutDetails: CheckoutCustomerInput
  existingOrderId?: string | null
  onCheckoutPrepared?: (meta: { orderId: string; orderNumber: string }) => void
  onComplete?: () => void
}

export function StripeCheckout({
  items,
  checkoutDetails,
  existingOrderId,
  onCheckoutPrepared,
  onComplete,
}: StripeCheckoutProps) {
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    try {
      const result = await createCheckoutSession(items, checkoutDetails, {
        existingOrderId,
      })
      onCheckoutPrepared?.({
        orderId: result.orderId,
        orderNumber: result.orderNumber,
      })
      return result.clientSecret
    } catch (err) {
      captureCheckoutError(err, { stage: 'embedded_checkout' })
      setError(err instanceof Error ? err.message : 'Payment error')
      throw err
    }
  }, [items, checkoutDetails, existingOrderId, onCheckoutPrepared])

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-2 text-sm text-red-500 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div id="stripe-checkout" className="rounded-lg overflow-hidden">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
          onComplete,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}