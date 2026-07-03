import 'server-only'

import type Stripe from 'stripe'
import type { CheckoutCustomerInput } from '@/lib/orders'
import { extractInclusiveVatCents } from '@/lib/money'

/** Stripe product tax code: general tangible goods (cosmetics, retail). */
export const STRIPE_TANGIBLE_GOODS_TAX_CODE = 'txcd_99999999'

const DEFAULT_LV_POSTAL = 'LV-1010'
const DEFAULT_LV_CITY = 'Rīga'

export function isStripeTaxEnabled(): boolean {
  return process.env.STRIPE_TAX_ENABLED !== 'false'
}

export function stripeInclusivePriceTaxFields(): Pick<
  Stripe.Checkout.SessionCreateParams.LineItem.PriceData,
  'tax_behavior'
> & { product_data: { tax_code: string } } {
  return {
    tax_behavior: 'inclusive',
    product_data: {
      tax_code: STRIPE_TANGIBLE_GOODS_TAX_CODE,
    },
  }
}

function resolveTaxAddress(
  customer: CheckoutCustomerInput
): Stripe.Checkout.SessionCreateParams.PaymentIntentData.Shipping['address'] {
  const address = customer.shippingAddress
  if (address?.street && address.city) {
    return {
      line1: address.street.trim(),
      city: address.city.trim(),
      postal_code: address.postalCode?.trim() || DEFAULT_LV_POSTAL,
      country: 'LV',
    }
  }

  return {
    line1: customer.parcelStation?.trim() || 'Latvia',
    city: DEFAULT_LV_CITY,
    postal_code: DEFAULT_LV_POSTAL,
    country: 'LV',
  }
}

export function buildPaymentIntentShippingForTax(
  customer: CheckoutCustomerInput
): Stripe.Checkout.SessionCreateParams.PaymentIntentData.Shipping {
  const name = `${customer.firstName.trim()} ${customer.lastName.trim()}`.trim()
  return {
    name: name || customer.email.trim(),
    address: resolveTaxAddress(customer),
  }
}

export function resolveTaxCentsFromSession(session: Stripe.Checkout.Session): number {
  const stripeTax = session.total_details?.amount_tax
  if (stripeTax != null && stripeTax >= 0) {
    return stripeTax
  }

  if (session.amount_total != null) {
    return extractInclusiveVatCents(session.amount_total)
  }

  return 0
}