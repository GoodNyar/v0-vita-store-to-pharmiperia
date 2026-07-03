import 'server-only'

import type Stripe from 'stripe'

/** Checkout payment methods enabled for Pharmiperia LV (ADR-0020). */
export const BALTIC_CHECKOUT_PAYMENT_METHODS = [
  'card',
  'link',
  'paypal',
  'klarna',
] as const satisfies readonly Stripe.Checkout.SessionCreateParams.PaymentMethodType[]

export function isBalticPaymentMethodsEnabled(): boolean {
  return process.env.STRIPE_BALTIC_METHODS_ENABLED !== 'false'
}

export function getCheckoutPaymentMethodTypes(): Stripe.Checkout.SessionCreateParams.PaymentMethodType[] {
  if (!isBalticPaymentMethodsEnabled()) {
    return ['card']
  }
  return [...BALTIC_CHECKOUT_PAYMENT_METHODS]
}