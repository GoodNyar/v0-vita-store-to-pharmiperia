'use server'

import { mergeLegacyExtras, getCatalogProducts } from '@/lib/commerce/catalog-source'
import { logSearchQuery } from '@/lib/commerce/search-log'
import { searchProducts } from '@/lib/commerce/search'
import { createClient } from '@/lib/supabase/server'
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

  const products = result.data.map(mergeLegacyExtras)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  void logSearchQuery({
    query,
    locale: resolved,
    resultsCount: products.length,
    userId: user?.id ?? null,
  })

  return products
}