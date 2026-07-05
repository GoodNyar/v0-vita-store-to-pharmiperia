import 'server-only'

import type { MarketCode } from './markets-config'
import { getMarketPriceForProduct } from './market-pricing'
import type { MarketPrice } from './market-pricing-core'
import type { CommerceProduct } from './types'

export type MarketPriceSource = MarketPrice['source']

export interface MarketPricedProduct {
  product: CommerceProduct
  source: MarketPriceSource
}

/** Single pricing path: catalog base → market_product_prices override → charged price. */
export async function applyMarketPricingToCommerceProduct(
  product: CommerceProduct,
  marketCode: MarketCode
): Promise<MarketPricedProduct> {
  const priceResult = await getMarketPriceForProduct(product.id, marketCode, {
    priceCents: product.price.amount,
    originalPriceCents: product.originalPrice?.amount ?? null,
    currency: product.price.currency,
  })

  if (!priceResult.ok) {
    return { product, source: 'catalog_default' }
  }

  return {
    product: {
      ...product,
      price: priceResult.data.price,
      originalPrice: priceResult.data.originalPrice,
    },
    source: priceResult.data.source,
  }
}

export async function applyMarketPricingToCommerceProducts(
  products: CommerceProduct[],
  marketCode: MarketCode
): Promise<CommerceProduct[]> {
  const priced = await Promise.all(
    products.map((product) => applyMarketPricingToCommerceProduct(product, marketCode))
  )
  return priced.map((entry) => entry.product)
}