import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import type { MarketCode } from './markets-config'
import { commerceDatabase, commerceFail, commerceOk, type CommerceResult } from './errors'
import {
  resolveMarketPrice,
  type MarketPrice,
  type PriceOverride,
} from './market-pricing-core'

export type { MarketPrice } from './market-pricing-core'
export { resolveMarketPrice } from './market-pricing-core'

export async function fetchMarketPriceOverride(
  productId: string,
  marketCode: MarketCode
): Promise<PriceOverride | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('market_product_prices')
    .select('price_cents, original_price_cents, currency, markets!inner ( code )')
    .eq('product_id', productId)
    .eq('markets.code', marketCode)
    .maybeSingle()

  if (error) {
    console.warn('[market-pricing] override lookup failed', error.message)
    return null
  }

  if (!data) return null

  return {
    priceCents: data.price_cents,
    originalPriceCents: data.original_price_cents,
    currency: data.currency,
  }
}

export async function getMarketPriceForProduct(
  productId: string,
  marketCode: MarketCode,
  catalog: { priceCents: number; originalPriceCents: number | null; currency: string }
): Promise<CommerceResult<MarketPrice>> {
  try {
    const override = await fetchMarketPriceOverride(productId, marketCode)
    return commerceOk(resolveMarketPrice(
      catalog.priceCents,
      catalog.originalPriceCents,
      catalog.currency,
      override
    ))
  } catch (err) {
    return commerceFail(
      commerceDatabase('Failed to resolve market price', err instanceof Error ? err : undefined)
    )
  }
}