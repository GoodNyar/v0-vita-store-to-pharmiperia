import "server-only"

import type { Money } from "@/lib/money"

/** Stripe Checkout unit_amount for EUR — already minor units. */
export function toStripeUnitAmount(money: Money): number {
  if (money.currency !== "EUR") {
    throw new Error(`Unsupported Stripe currency: ${money.currency}`)
  }
  return money.amount
}