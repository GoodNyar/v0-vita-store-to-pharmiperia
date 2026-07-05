import 'server-only'

import type { Locale } from '@/lib/i18n/config'
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config'
import { getProductBySlug, listActiveProducts } from './products'
import { listActiveMarkets, type MarketCode } from './markets'
import type { MarketDefinition } from './markets-config'
import { getMarketPriceForProduct } from './market-pricing'
import { listShippingMethodsForMarket } from './market-shipping'
import { listParcelStations, type ParcelCarrier } from './carriers'
import { commerceOk, type CommerceResult } from './errors'

export { parseStorefrontMarket, requireStorefrontMarket } from './storefront-parse'
import type { CommerceProduct } from './types'

export const STOREFRONT_API_VERSION = 'v1'

export interface StorefrontProduct {
  id: string
  legacyId: number | null
  slug: string
  sku: string
  name: string
  price: { amount: number; currency: string }
  originalPrice: { amount: number; currency: string } | null
  inStock: boolean
  marketCode: MarketCode
  priceSource: 'market_override' | 'catalog_default'
}

export interface StorefrontListOptions {
  market: MarketCode
  locale?: string
  limit?: number
}

function toStorefrontProduct(
  product: CommerceProduct,
  marketCode: MarketCode,
  priceSource: 'market_override' | 'catalog_default'
): StorefrontProduct {
  return {
    id: product.id,
    legacyId: product.legacyId,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    price: { amount: product.price.amount, currency: product.price.currency },
    originalPrice: product.originalPrice
      ? { amount: product.originalPrice.amount, currency: product.originalPrice.currency }
      : null,
    inStock: product.inStock,
    marketCode,
    priceSource,
  }
}

function parseStorefrontLocale(locale: string | undefined): Locale {
  if (locale && isLocale(locale)) return locale
  return DEFAULT_LOCALE
}

export async function listStorefrontProducts(
  options: StorefrontListOptions
): Promise<CommerceResult<StorefrontProduct[]>> {
  const locale = parseStorefrontLocale(options.locale)
  const limit = Math.max(1, Math.min(options.limit ?? 50, 100))

  const productsResult = await listActiveProducts(locale)
  if (!productsResult.ok) {
    return productsResult
  }

  const slice = productsResult.data.slice(0, limit)
  const storefrontProducts: StorefrontProduct[] = []

  for (const product of slice) {
    const priceResult = await getMarketPriceForProduct(product.id, options.market, {
      priceCents: product.price.amount,
      originalPriceCents: product.originalPrice?.amount ?? null,
      currency: product.price.currency,
    })

    if (!priceResult.ok) {
      return priceResult
    }

    const priced: CommerceProduct = {
      ...product,
      price: priceResult.data.price,
      originalPrice: priceResult.data.originalPrice,
    }

    storefrontProducts.push(
      toStorefrontProduct(priced, options.market, priceResult.data.source)
    )
  }

  return commerceOk(storefrontProducts)
}

export async function getStorefrontProductBySlug(
  slug: string,
  market: MarketCode,
  localeInput?: string
): Promise<CommerceResult<StorefrontProduct>> {
  const locale = parseStorefrontLocale(localeInput)
  const productResult = await getProductBySlug(slug, locale)
  if (!productResult.ok) {
    return productResult
  }

  const product = productResult.data
  const priceResult = await getMarketPriceForProduct(product.id, market, {
    priceCents: product.price.amount,
    originalPriceCents: product.originalPrice?.amount ?? null,
    currency: product.price.currency,
  })

  if (!priceResult.ok) {
    return priceResult
  }

  const priced: CommerceProduct = {
    ...product,
    price: priceResult.data.price,
    originalPrice: priceResult.data.originalPrice,
  }

  return commerceOk(toStorefrontProduct(priced, market, priceResult.data.source))
}

export async function listStorefrontMarkets(): Promise<CommerceResult<MarketDefinition[]>> {
  return listActiveMarkets()
}

export async function listStorefrontShipping(market: MarketCode) {
  return listShippingMethodsForMarket(market)
}

export async function listStorefrontParcelStations(
  market: MarketCode,
  carrier?: ParcelCarrier
) {
  return listParcelStations(market, carrier)
}

export type { MarketDefinition }