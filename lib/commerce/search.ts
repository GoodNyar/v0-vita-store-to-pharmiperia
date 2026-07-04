import 'server-only'

import type { Locale } from '@/lib/i18n/config'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  commerceDatabase,
  commerceFail,
  commerceOk,
  type CommerceResult,
} from './errors'
import { mapDbProductToCommerce } from './product-mapper'
import type { CommerceProduct, DbProduct } from './types'

const PRODUCT_COLUMNS =
  'id, sku, slug, name_ru, name_lv, description_ru, description_lv, how_to_use_ru, how_to_use_lv, brand_id, category_id, price_cents, original_price_cents, currency, volume, stock_quantity, is_active, is_featured, is_new, is_bestseller, rating, review_count, search_vector' as const

type ProductRow = DbProduct & {
  brands?: { name: string; slug: string } | { name: string; slug: string }[] | null
  categories?: { slug: string } | { slug: string }[] | null
  product_images?: { image_url: string; is_primary: boolean | null; sort_order: number | null }[]
}

function escapeIlike(value: string): string {
  return value.replace(/[%_\\]/g, '\\$&')
}

/** Strip tsquery operators; plainto_tsquery treats them as syntax otherwise. */
function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[&|!():*<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const SELECT_WITH_RELATIONS =
  `${PRODUCT_COLUMNS}, brands ( name, slug ), categories ( slug ), product_images ( image_url, is_primary, sort_order )` as const

async function fetchProductsByIds(
  ids: string[],
  locale: Locale
): Promise<CommerceProduct[]> {
  if (ids.length === 0) return []

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select(SELECT_WITH_RELATIONS)
    .eq('is_active', true)
    .in('id', ids)

  if (error) {
    throw new Error(`Failed to load search results: ${error.message}`)
  }

  const rows = (data as ProductRow[] | null) ?? []
  const byId = new Map(rows.map((row) => [row.id, row]))
  return ids
    .map((id) => byId.get(id))
    .filter((row): row is ProductRow => row != null)
    .map((row) => mapDbProductToCommerce(row, locale))
}

type VectorSearchResult =
  | { status: 'ok'; products: CommerceProduct[] }
  | { status: 'empty' }
  | { status: 'error' }

async function searchByVector(
  query: string,
  locale: Locale,
  limit: number
): Promise<VectorSearchResult> {
  const sanitized = sanitizeSearchQuery(query)
  if (!sanitized) {
    return { status: 'empty' }
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase.rpc('search_products_vector', {
    p_query: sanitized,
    p_limit: limit,
  })

  if (error) {
    console.warn('[search] vector RPC failed, falling back to ilike', error.message)
    return { status: 'error' }
  }

  const rows = (data as { product_id: string }[] | null) ?? []
  if (rows.length === 0) {
    return { status: 'empty' }
  }

  const products = await fetchProductsByIds(
    rows.map((row) => row.product_id),
    locale
  )
  return { status: 'ok', products }
}

async function searchByIlike(
  query: string,
  locale: Locale,
  limit: number
): Promise<CommerceResult<CommerceProduct[]>> {
  const pattern = `%${escapeIlike(query)}%`
  const nameColumn = locale === 'lv' ? 'name_lv' : 'name_ru'
  const descriptionColumn = locale === 'lv' ? 'description_lv' : 'description_ru'

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select(SELECT_WITH_RELATIONS)
    .eq('is_active', true)
    .or(
      `${nameColumn}.ilike.${pattern},${descriptionColumn}.ilike.${pattern},sku.ilike.${pattern}`
    )
    .order('review_count', { ascending: false })
    .limit(limit)

  if (error) {
    return commerceFail(commerceDatabase('Failed to search products', error))
  }

  return commerceOk(
    ((data as ProductRow[] | null) ?? []).map((row) => mapDbProductToCommerce(row, locale))
  )
}

export async function searchProducts(
  query: string,
  locale: Locale,
  options?: { limit?: number }
): Promise<CommerceResult<CommerceProduct[]>> {
  const trimmed = query.trim()
  if (!trimmed) {
    return commerceOk([])
  }

  const limit = options?.limit ?? 50

  try {
    const vectorResults = await searchByVector(trimmed, locale, limit)
    if (vectorResults.status === 'ok') {
      return commerceOk(vectorResults.products)
    }
    if (vectorResults.status === 'empty') {
      return searchByIlike(trimmed, locale, limit)
    }
  } catch (err) {
    console.warn('[search] vector search error', err)
  }

  return searchByIlike(trimmed, locale, limit)
}