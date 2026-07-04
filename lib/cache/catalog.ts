import 'server-only'

import { unstable_cache } from 'next/cache'
import type { Locale } from '@/lib/i18n/config'
import {
  listActiveProducts,
  listProductsByBrandSlug,
  listProductsByCategorySlug,
  getProductBySlug,
} from '@/lib/commerce/products'
import type { CommerceResult } from '@/lib/commerce/errors'
import type { CommerceProduct } from '@/lib/commerce/types'

export const CATALOG_CACHE_TAGS = {
  all: (locale: Locale) => `catalog:all:${locale}`,
  category: (slug: string, locale: Locale) => `catalog:category:${slug}:${locale}`,
  brand: (slug: string, locale: Locale) => `catalog:brand:${slug}:${locale}`,
  product: (slug: string, locale: Locale) => `catalog:product:${slug}:${locale}`,
} as const

const REVALIDATE_SEC = 3600

function wrap<T>(fn: () => Promise<CommerceResult<T>>, key: string[], tags: string[]) {
  return unstable_cache(fn, key, { revalidate: REVALIDATE_SEC, tags })()
}

export function cachedListActiveProducts(locale: Locale): Promise<CommerceResult<CommerceProduct[]>> {
  return wrap(
    () => listActiveProducts(locale),
    ['listActiveProducts', locale],
    [CATALOG_CACHE_TAGS.all(locale)]
  )
}

export function cachedListProductsByCategorySlug(
  categorySlug: string,
  locale: Locale
): Promise<CommerceResult<CommerceProduct[]>> {
  return wrap(
    () => listProductsByCategorySlug(categorySlug, locale),
    ['listProductsByCategorySlug', categorySlug, locale],
    [CATALOG_CACHE_TAGS.category(categorySlug, locale), CATALOG_CACHE_TAGS.all(locale)]
  )
}

export function cachedListProductsByBrandSlug(
  brandSlug: string,
  locale: Locale
): Promise<CommerceResult<CommerceProduct[]>> {
  return wrap(
    () => listProductsByBrandSlug(brandSlug, locale),
    ['listProductsByBrandSlug', brandSlug, locale],
    [CATALOG_CACHE_TAGS.brand(brandSlug, locale), CATALOG_CACHE_TAGS.all(locale)]
  )
}

export function cachedGetProductBySlug(
  slug: string,
  locale: Locale
): Promise<CommerceResult<CommerceProduct>> {
  return wrap(
    () => getProductBySlug(slug, locale),
    ['getProductBySlug', slug, locale],
    [CATALOG_CACHE_TAGS.product(slug, locale), CATALOG_CACHE_TAGS.all(locale)]
  )
}