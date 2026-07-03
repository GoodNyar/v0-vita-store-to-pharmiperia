import 'server-only'

import {
  getProductBySlug as getLegacyProductBySlug,
  products as legacyProducts,
  type Product,
} from '@/lib/data'
import type { Locale } from '@/lib/i18n/config'
import {
  getProductBySlug as getCommerceProductBySlug,
  listActiveProducts,
  listProductsByBrandSlug,
  listProductsByCategorySlug,
  mapCommerceToLegacyProduct,
} from './products'
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

  const result = await listActiveProducts(locale)
  if (!result.ok || result.data.length === 0) {
    return { products: legacyProducts, source: 'legacy' }
  }

  return {
    products: result.data.map(mergeLegacyExtras),
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

  const result = await getCommerceProductBySlug(slug, locale)
  if (result.ok) {
    return mergeLegacyExtras(result.data)
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

  const result = await listProductsByCategorySlug(categorySlug, locale)
  if (!result.ok || result.data.length === 0) {
    return legacyProducts.filter((product) => product.category === categorySlug)
  }

  return result.data.map(mergeLegacyExtras)
}

export async function getCatalogProductsByBrandSlug(
  brandSlug: string,
  locale: Locale
): Promise<Product[]> {
  const { getProductsByBrandSlug } = await import('@/lib/data')

  if (prefersLegacyCatalog()) {
    return getProductsByBrandSlug(brandSlug)
  }

  const result = await listProductsByBrandSlug(brandSlug, locale)
  if (!result.ok || result.data.length === 0) {
    return getProductsByBrandSlug(brandSlug)
  }

  return result.data.map(mergeLegacyExtras)
}