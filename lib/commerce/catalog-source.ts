import 'server-only'

import {
  getProductBySlug as getLegacyProductBySlug,
  products as legacyProducts,
  type Product,
} from '@/lib/data'
import type { Locale } from '@/lib/i18n/config'
import {
  cachedGetProductBySlug,
  cachedListActiveProducts,
  cachedListProductsByBrandSlug,
  cachedListProductsByCategorySlug,
} from '@/lib/cache/catalog'
import { applyMarketPricingToCommerceProducts } from './apply-market-pricing'
import { mapCommerceToLegacyProduct } from './products'
import { resolveMarketFromCookies } from './resolve-market-server'
import type { CommerceProduct } from './types'

export type CatalogSource = 'db' | 'legacy'

const legacyById = new Map(legacyProducts.map((product) => [product.id, product]))

function prefersLegacyCatalog(): boolean {
  return process.env.CATALOG_SOURCE === 'legacy'
}

function badgeFromCommerce(product: CommerceProduct): string | undefined {
  if (product.originalPrice) return 'discount'
  if (product.isBestseller) return 'bestSeller'
  if (product.isFeatured) return 'popular'
  return undefined
}

async function withMarketPricing(products: CommerceProduct[]): Promise<CommerceProduct[]> {
  const { code } = await resolveMarketFromCookies()
  return applyMarketPricingToCommerceProducts(products, code)
}

/** Merge DB prices with legacy-only UI fields (badges, tags, education blocks). */
export function mergeLegacyExtras(product: CommerceProduct): Product {
  const mapped = mapCommerceToLegacyProduct(product)
  const seed = product.legacyId != null ? legacyById.get(product.legacyId) : undefined

  if (!seed) {
    return { ...mapped, badge: badgeFromCommerce(product) }
  }

  return {
    ...mapped,
    badge: seed.badge ?? badgeFromCommerce(product),
    tags: seed.tags,
    activeIngredient: seed.activeIngredient,
    images: seed.images,
    activeIngredients: seed.activeIngredients,
    whyChoose: seed.whyChoose,
    texture: seed.texture,
    application: seed.application,
    freeFrom: seed.freeFrom,
    price: mapped.price,
    originalPrice: mapped.originalPrice,
  }
}

export async function getCatalogProducts(
  locale: Locale
): Promise<{ products: Product[]; source: CatalogSource }> {
  if (prefersLegacyCatalog()) {
    return { products: legacyProducts, source: 'legacy' }
  }

  const result = await cachedListActiveProducts(locale)
  if (!result.ok) {
    return { products: [], source: 'db' }
  }

  const priced = await withMarketPricing(result.data)
  return {
    products: priced.map(mergeLegacyExtras),
    source: 'db',
  }
}

export async function getCatalogProductBySlug(
  slug: string,
  locale: Locale
): Promise<Product | null> {
  if (prefersLegacyCatalog()) {
    return getLegacyProductBySlug(slug) ?? null
  }

  const result = await cachedGetProductBySlug(slug, locale)
  if (result.ok) {
    const [priced] = await withMarketPricing([result.data])
    return mergeLegacyExtras(priced)
  }

  return getLegacyProductBySlug(slug) ?? null
}

export async function getCatalogProductsByCategorySlug(
  categorySlug: string,
  locale: Locale
): Promise<Product[]> {
  if (prefersLegacyCatalog()) {
    return legacyProducts.filter((product) => product.category === categorySlug)
  }

  const result = await cachedListProductsByCategorySlug(categorySlug, locale)
  if (!result.ok) {
    return []
  }

  const priced = await withMarketPricing(result.data)
  return priced.map(mergeLegacyExtras)
}

export async function getCatalogProductsByBrandSlug(
  brandSlug: string,
  locale: Locale
): Promise<Product[]> {
  const { getProductsByBrandSlug } = await import('@/lib/data')

  if (prefersLegacyCatalog()) {
    return getProductsByBrandSlug(brandSlug)
  }

  const result = await cachedListProductsByBrandSlug(brandSlug, locale)
  if (!result.ok) {
    return []
  }

  const priced = await withMarketPricing(result.data)
  return priced.map(mergeLegacyExtras)
}