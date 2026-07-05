import { moneyFromDb, type Money } from '@/lib/money'

export interface PriceOverride {
  priceCents: number
  originalPriceCents: number | null
  currency: string
}

export interface MarketPrice {
  price: Money
  originalPrice: Money | null
  source: 'market_override' | 'catalog_default'
}

/**
 * Resolve sell price for a product in a market (pure — no I/O).
 */
export function resolveMarketPrice(
  basePriceCents: number,
  baseOriginalCents: number | null,
  baseCurrency: string,
  override: PriceOverride | null
): MarketPrice {
  if (override) {
    return {
      price: moneyFromDb(override.priceCents, 'EUR'),
      originalPrice:
        override.originalPriceCents != null
          ? moneyFromDb(override.originalPriceCents, 'EUR')
          : null,
      source: 'market_override',
    }
  }

  const currency = baseCurrency === 'EUR' ? 'EUR' : 'EUR'
  return {
    price: moneyFromDb(basePriceCents, currency),
    originalPrice: baseOriginalCents != null ? moneyFromDb(baseOriginalCents, currency) : null,
    source: 'catalog_default',
  }
}