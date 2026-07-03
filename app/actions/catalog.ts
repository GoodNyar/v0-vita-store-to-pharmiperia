'use server'

import { mergeLegacyExtras, getCatalogProducts } from '@/lib/commerce/catalog-source'
import { searchProducts } from '@/lib/commerce/search'
import { isLocale, type Locale } from '@/lib/i18n/config'
import type { Product } from '@/lib/data'

export async function fetchCatalogProducts(locale: string): Promise<Product[]> {
  const resolved = isLocale(locale) ? locale : 'lv'
  const { products } = await getCatalogProducts(resolved as Locale)
  return products
}

export async function searchCatalogProducts(
  locale: string,
  query: string
): Promise<Product[]> {
  const resolved: Locale = isLocale(locale) ? locale : 'lv'
  const result = await searchProducts(query, resolved)
  if (!result.ok) return []
  return result.data.map(mergeLegacyExtras)
}