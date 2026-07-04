import type { Locale } from '@/lib/i18n/config'
import { createAdminClient } from '@/lib/supabase/admin'

import {
  commerceDatabase,
  commerceFail,
  commerceNotFound,
  commerceOk,
  type CommerceResult,
} from './errors'
import { legacyProductIdToUuid } from './ids'
import {
  mapCommerceToLegacyProduct,
  mapDbProductToCommerce,
  pricesMatchLegacy,
} from './product-mapper'
import type { KeysetCursor, KeysetPage } from './pagination'
import type { CommerceProduct, DbProduct } from './types'

export { mapCommerceToLegacyProduct, mapDbProductToCommerce, pricesMatchLegacy }

const PRODUCT_COLUMNS =
  'id, sku, slug, name_ru, name_lv, description_ru, description_lv, how_to_use_ru, how_to_use_lv, brand_id, category_id, price_cents, original_price_cents, currency, volume, stock_quantity, is_active, is_featured, is_new, is_bestseller, rating, review_count' as const

type ProductRow = DbProduct & {
  brands?: { name: string; slug: string } | { name: string; slug: string }[] | null
  categories?: { slug: string } | { slug: string }[] | null
  product_images?: { image_url: string; is_primary: boolean | null; sort_order: number | null }[]
}

export async function getProductByLegacyId(
  legacyId: number,
  locale: Locale
): Promise<CommerceResult<CommerceProduct>> {
  return getProductByUuid(legacyProductIdToUuid(legacyId), locale)
}

export async function getProductByUuid(
  id: string,
  locale: Locale
): Promise<CommerceResult<CommerceProduct>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select(
      `${PRODUCT_COLUMNS}, brands ( name, slug ), categories ( slug ), product_images ( image_url, is_primary, sort_order )`
    )
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    return commerceFail(commerceDatabase('Failed to load product', error))
  }
  if (!data) {
    return commerceFail(commerceNotFound('product', id))
  }
  return commerceOk(mapDbProductToCommerce(data as ProductRow, locale))
}

export async function getProductBySlug(
  slug: string,
  locale: Locale
): Promise<CommerceResult<CommerceProduct>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select(
      `${PRODUCT_COLUMNS}, brands ( name, slug ), categories ( slug ), product_images ( image_url, is_primary, sort_order )`
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    return commerceFail(commerceDatabase('Failed to load product', error))
  }
  if (!data) {
    return commerceFail(commerceNotFound('product', slug))
  }
  return commerceOk(mapDbProductToCommerce(data as ProductRow, locale))
}

export async function listActiveProducts(
  locale: Locale,
  options?: { limit?: number; featured?: boolean }
): Promise<CommerceResult<CommerceProduct[]>> {
  const supabase = createAdminClient()
  let query = supabase
    .from('products')
    .select(
      `${PRODUCT_COLUMNS}, brands ( name, slug ), categories ( slug ), product_images ( image_url, is_primary, sort_order )`
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (options?.featured) {
    query = query.eq('is_featured', true)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  if (error) {
    return commerceFail(commerceDatabase('Failed to list products', error))
  }

  return commerceOk(
    ((data as ProductRow[] | null) ?? []).map((row) => mapDbProductToCommerce(row, locale))
  )
}

const PRODUCT_LIST_SELECT = `${PRODUCT_COLUMNS}, brands ( name, slug ), categories ( slug ), product_images ( image_url, is_primary, sort_order )` as const

function mapProductRows(rows: ProductRow[] | null, locale: Locale): CommerceProduct[] {
  return (rows ?? []).map((row) => mapDbProductToCommerce(row, locale))
}

export async function listProductsByCategorySlug(
  categorySlug: string,
  locale: Locale
): Promise<CommerceResult<CommerceProduct[]>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select(`${PRODUCT_LIST_SELECT}, categories!inner ( slug )`)
    .eq('is_active', true)
    .eq('categories.slug', categorySlug)
    .order('review_count', { ascending: false })

  if (error) {
    return commerceFail(commerceDatabase('Failed to list products by category', error))
  }

  return commerceOk(mapProductRows(data as ProductRow[] | null, locale))
}

export async function listProductsByBrandSlug(
  brandSlug: string,
  locale: Locale
): Promise<CommerceResult<CommerceProduct[]>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select(`${PRODUCT_LIST_SELECT}, brands!inner ( slug )`)
    .eq('is_active', true)
    .eq('brands.slug', brandSlug)
    .order('review_count', { ascending: false })

  if (error) {
    return commerceFail(commerceDatabase('Failed to list products by brand', error))
  }

  return commerceOk(mapProductRows(data as ProductRow[] | null, locale))
}

export async function listActiveProductsKeyset(
  locale: Locale,
  options: { limit: number; cursor?: KeysetCursor | null }
): Promise<CommerceResult<KeysetPage<CommerceProduct>>> {
  const limit = Math.max(1, Math.min(options.limit, 100))
  const supabase = createAdminClient()

  let query = supabase
    .from('products')
    .select(`${PRODUCT_LIST_SELECT}, created_at`)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit + 1)

  if (options.cursor) {
    query = query.or(
      `created_at.lt.${options.cursor.createdAt},and(created_at.eq.${options.cursor.createdAt},id.lt.${options.cursor.id})`
    )
  }

  const { data, error } = await query
  if (error) {
    return commerceFail(commerceDatabase('Failed to list products (keyset)', error))
  }

  const rows = (data as ProductRow[] | null) ?? []
  const hasMore = rows.length > limit
  const pageRows = hasMore ? rows.slice(0, limit) : rows
  const last = pageRows[pageRows.length - 1]

  return commerceOk({
    items: mapProductRows(pageRows, locale),
    nextCursor:
      hasMore && last
        ? { createdAt: last.created_at ?? new Date().toISOString(), id: last.id }
        : null,
  })
}

export async function listProductSlugs(): Promise<CommerceResult<string[]>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('slug')
    .eq('is_active', true)

  if (error) {
    return commerceFail(commerceDatabase('Failed to list product slugs', error))
  }

  return commerceOk(((data as { slug: string }[] | null) ?? []).map((row) => row.slug))
}