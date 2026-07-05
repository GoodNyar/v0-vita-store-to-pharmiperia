import 'server-only'

import type { Locale } from '@/lib/i18n/config'
import type { Tables } from '@/lib/database.types'
import { createAdminClient } from '@/lib/supabase/admin'
import { eur, type Money } from '@/lib/money'
import { commerceDatabase, commerceFail, commerceOk, type CommerceResult } from './errors'

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  slugSuffix: string | null
  name: string
  price: Money | null
  originalPrice: Money | null
  stockQuantity: number
  attributes: Record<string, unknown>
  isDefault: boolean
}

type VariantListRow = Pick<
  Tables<'product_variants'>,
  | 'id'
  | 'product_id'
  | 'sku'
  | 'slug_suffix'
  | 'name_ru'
  | 'name_lv'
  | 'price_cents'
  | 'original_price_cents'
  | 'currency'
  | 'stock_quantity'
  | 'attributes'
  | 'is_default'
>

function mapVariant(row: VariantListRow, locale: Locale): ProductVariant {
  const name = locale === 'lv' ? row.name_lv ?? '' : row.name_ru ?? ''
  const attributes =
    row.attributes && typeof row.attributes === 'object' && !Array.isArray(row.attributes)
      ? (row.attributes as Record<string, unknown>)
      : {}
  return {
    id: row.id,
    productId: row.product_id,
    sku: row.sku,
    slugSuffix: row.slug_suffix,
    name,
    price: row.price_cents != null ? eur(row.price_cents) : null,
    originalPrice:
      row.original_price_cents != null ? eur(row.original_price_cents) : null,
    stockQuantity: row.stock_quantity,
    attributes,
    isDefault: row.is_default,
  }
}

export async function listVariantsForProduct(
  productId: string,
  locale: Locale
): Promise<CommerceResult<ProductVariant[]>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('product_variants')
    .select(
      'id, product_id, sku, slug_suffix, name_ru, name_lv, price_cents, original_price_cents, currency, stock_quantity, attributes, is_default'
    )
    .eq('product_id', productId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    return commerceFail(commerceDatabase('Failed to list product variants', error))
  }

  return commerceOk((data ?? []).map((row) => mapVariant(row, locale)))
}