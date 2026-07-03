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
  'id, sku, slug, name_ru, name_lv, description_ru, description_lv, how_to_use_ru, how_to_use_lv, brand_id, category_id, price_cents, original_price_cents, currency, volume, stock_quantity, is_active, is_featured, is_new, is_bestseller, rating, review_count' as const

type ProductRow = DbProduct & {
  brands?: { name: string; slug: string } | { name: string; slug: string }[] | null
  categories?: { slug: string } | { slug: string }[] | null
  product_images?: { image_url: string; is_primary: boolean | null; sort_order: number | null }[]
}

function escapeIlike(value: string): string {
  return value.replace(/[%_\\]/g, '\\$&')
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

  const pattern = `%${escapeIlike(trimmed)}%`
  const nameColumn = locale === 'lv' ? 'name_lv' : 'name_ru'
  const descriptionColumn = locale === 'lv' ? 'description_lv' : 'description_ru'

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select(
      `${PRODUCT_COLUMNS}, brands ( name, slug ), categories ( slug ), product_images ( image_url, is_primary, sort_order )`
    )
    .eq('is_active', true)
    .or(
      `${nameColumn}.ilike.${pattern},${descriptionColumn}.ilike.${pattern},sku.ilike.${pattern}`
    )
    .order('review_count', { ascending: false })
    .limit(options?.limit ?? 50)

  if (error) {
    return commerceFail(commerceDatabase('Failed to search products', error))
  }

  return commerceOk(
    ((data as ProductRow[] | null) ?? []).map((row) => mapDbProductToCommerce(row, locale))
  )
}