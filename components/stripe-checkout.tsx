'use client'

import { useCallback, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createCheckoutSession } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CartItem {
  id: number
  quantity: number
}

interface StripeCheckoutProps {
  items: CartItem[]
  shippingCost: number
  customerEmail?: string
  onComplete?: () => void
}

export function StripeCheckout({ 
  items, 
  shippingCost, 
  customerEmail,
  onComplete 
}: StripeCheckoutProps) {
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    try {
      const clientSecret = await createCheckoutSession(items, shippingCost, customerEmail)
      if (!clientSecret) {
        throw new Error('Failed to create checkout session')
      }
      return clientSecret
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment error')
      throw err
    }
  }, [items, shippingCost, customerEmail])

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
          onComplete: onComplete
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
