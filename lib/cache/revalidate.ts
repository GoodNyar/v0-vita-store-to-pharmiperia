import 'server-only'

import { revalidateTag } from 'next/cache'
import type { Locale } from '@/lib/i18n/config'
import { CATALOG_CACHE_TAGS } from '@/lib/cache/catalog'

/** Invalidate catalog caches after admin product/stock changes (ADR-0006). */
export async function revalidateCatalogTags(options?: {
  locale?: Locale
  productSlug?: string
  categorySlug?: string
  brandSlug?: string
}): Promise<void> {
  const locale = options?.locale ?? 'lv'
  revalidateTag(CATALOG_CACHE_TAGS.all(locale), 'max')
  revalidateTag(CATALOG_CACHE_TAGS.all(locale === 'lv' ? 'ru' : 'lv'), 'max')

  if (options?.productSlug) {
    revalidateTag(CATALOG_CACHE_TAGS.product(options.productSlug, 'lv'), 'max')
    revalidateTag(CATALOG_CACHE_TAGS.product(options.productSlug, 'ru'), 'max')
  }
  if (options?.categorySlug) {
    revalidateTag(CATALOG_CACHE_TAGS.category(options.categorySlug, 'lv'), 'max')
    revalidateTag(CATALOG_CACHE_TAGS.category(options.categorySlug, 'ru'), 'max')
  }
  if (options?.brandSlug) {
    revalidateTag(CATALOG_CACHE_TAGS.brand(options.brandSlug, 'lv'), 'max')
    revalidateTag(CATALOG_CACHE_TAGS.brand(options.brandSlug, 'ru'), 'max')
  }
}