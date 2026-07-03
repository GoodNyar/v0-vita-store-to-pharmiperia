import 'server-only'

import Stripe from 'stripe'

let stripeClient: Stripe | null = null

/** Lazy Stripe client — avoids module-load failure when STRIPE_SECRET_KEY is absent (CI/build). */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key)
  }
  return stripeClient
}