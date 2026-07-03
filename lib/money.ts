export type CurrencyCode = "EUR"

/** Latvia standard VAT (PVN) rate in basis points: 21% = 2100 bps. */
export const LATVIA_STANDARD_VAT_BPS = 2100

/** Extract VAT from a gross (tax-inclusive) amount in minor units. */
export function extractInclusiveVatCents(
  grossCents: number,
  rateBps: number = LATVIA_STANDARD_VAT_BPS
): number {
  if (!Number.isInteger(grossCents) || grossCents < 0) {
    throw new Error(`Invalid gross amount for VAT extraction: ${grossCents}`)
  }
  return Math.round((grossCents * rateBps) / (10_000 + rateBps))
}

export interface Money {
  readonly amount: number
  readonly currency: CurrencyCode
}

export function eur(cents: number): Money {
  if (!Number.isInteger(cents)) {
    throw new Error(`Money amount must be integer minor units: ${cents}`)
  }
  return { amount: cents, currency: "EUR" }
}

/** Convert major EUR units (e.g. 18.99) to minor units at API boundaries only. */
export function moneyFromMajorEUR(major: number): Money {
  return eur(Math.round(major * 100))
}

export function moneyFromDb(cents: number, currency: CurrencyCode = "EUR"): Money {
  return { amount: cents, currency }
}

export function assertSameCurrency(money: Money, currency: CurrencyCode): void {
  if (money.currency !== currency) {
    throw new Error(`Currency mismatch: ${money.currency} vs ${currency}`)
  }
}

export function addMoney(...amounts: Money[]): Money {
  if (amounts.length === 0) return eur(0)
  const currency = amounts[0].currency
  for (const money of amounts) {
    assertSameCurrency(money, currency)
  }
  return {
    amount: amounts.reduce((sum, money) => sum + money.amount, 0),
    currency,
  }
}

export function multiplyMoney(money: Money, factor: number): Money {
  if (!Number.isFinite(factor) || factor < 0) {
    throw new Error("Invalid money multiply factor")
  }
  return { ...money, amount: Math.round(money.amount * factor) }
}

export function sumMoney(amounts: Money[]): Money {
  if (amounts.length === 0) return eur(0)
  return addMoney(...amounts)
}

export function compareMoney(a: Money, b: Money): number {
  assertSameCurrency(a, b.currency)
  return a.amount - b.amount
}

export function discountPercent(price: Money, original: Money): number {
  assertSameCurrency(price, original.currency)
  if (original.amount <= 0) return 0
  return Math.round((1 - price.amount / original.amount) * 100)
}

export function formatMoney(money: Money, locale = "de-DE"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
  }).format(money.amount / 100)
}

export const ALLOWED_SHIPPING_COSTS: readonly Money[] = [
  eur(0),
  eur(295),
  eur(299),
  eur(320),
  eur(350),
  eur(599),
]

export function validateShippingMoney(input: Money): Money {
  const match = ALLOWED_SHIPPING_COSTS.find(
    (allowed) => allowed.amount === input.amount && allowed.currency === input.currency
  )
  if (!match) {
    throw new Error("Invalid shipping cost")
  }
  return match
}

/** Major units for UI sliders and legacy filters. */
export function moneyToMajor(money: Money): number {
  return money.amount / 100
}