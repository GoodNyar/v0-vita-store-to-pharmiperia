'use server'

import { getCatalogProducts } from '@/lib/commerce/catalog-source'
import { isLocale, type Locale } from '@/lib/i18n/config'
import type { Product } from '@/lib/data'

export async function fetchCatalogProducts(locale: string): Promise<Product[]> {
  const resolved = isLocale(locale) ? locale : 'lv'
  const { products } = await getCatalogProducts(resolved as Locale)
  return products
}