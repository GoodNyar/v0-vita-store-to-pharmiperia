import 'server-only'

import type { Locale } from '@/lib/i18n/config'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  buildSearchFacetsFromProducts,
  formatCategoryFacetLabel,
  type SearchFacets,
} from './search-facets'

type FacetRpcRow = { value: string; count: number }

type FacetRpcPayload = {
  brands: FacetRpcRow[]
  categories: FacetRpcRow[]
  on_sale_count: number
}

function escapeIlike(value: string): string {
  return value.replace(/[%_\\]/g, '\\$&')
}

function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[&|!():*<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function mapRpcFacets(payload: FacetRpcPayload): SearchFacets {
  return {
    brands: (payload.brands ?? []).map((row) => ({
      value: row.value,
      label: row.value,
      count: row.count,
    })),
    categories: (payload.categories ?? []).map((row) => ({
      value: row.value,
      label: formatCategoryFacetLabel(row.value),
      count: row.count,
    })),
    onSaleCount: payload.on_sale_count ?? 0,
  }
}

async function facetsByIlike(query: string, locale: Locale): Promise<SearchFacets> {
  const pattern = `%${escapeIlike(query)}%`
  const nameColumn = locale === 'lv' ? 'name_lv' : 'name_ru'

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select(
      'price_cents, original_price_cents, brands ( name ), categories ( slug )'
    )
    .eq('is_active', true)
    .or(`${nameColumn}.ilike.${pattern},sku.ilike.${pattern}`)

  if (error) {
    console.warn('[search-facets] ilike facet fallback failed', error.message)
    return { brands: [], categories: [], onSaleCount: 0 }
  }

  const rows = (data ?? []) as {
    price_cents: number
    original_price_cents: number | null
    brands: { name: string } | { name: string }[] | null
    categories: { slug: string } | { slug: string }[] | null
  }[]

  return buildSearchFacetsFromProducts(
    rows.map((row) => {
      const brand = Array.isArray(row.brands) ? row.brands[0]?.name : row.brands?.name
      const category = Array.isArray(row.categories)
        ? row.categories[0]?.slug
        : row.categories?.slug
      return {
        brand: brand ?? '',
        category: category ?? '',
        price: { amount: row.price_cents },
        originalPrice:
          row.original_price_cents != null ? { amount: row.original_price_cents } : null,
      }
    })
  )
}

/** Facets over the full match set (SQL), not the paginated product slice. */
export async function searchProductFacets(
  query: string,
  locale: Locale
): Promise<SearchFacets> {
  const sanitized = sanitizeSearchQuery(query.trim())
  if (!sanitized) {
    return { brands: [], categories: [], onSaleCount: 0 }
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase.rpc('search_product_facets_vector', {
    p_query: sanitized,
  })

  if (error) {
    console.warn('[search-facets] vector RPC failed, ilike fallback', error.message)
    return facetsByIlike(sanitized, locale)
  }

  const payload = data as FacetRpcPayload | null
  if (!payload) {
    return facetsByIlike(sanitized, locale)
  }

  const facets = mapRpcFacets(payload)
  const hasCounts =
    facets.brands.length > 0 || facets.categories.length > 0 || facets.onSaleCount > 0

  if (!hasCounts) {
    return facetsByIlike(sanitized, locale)
  }

  return facets
}