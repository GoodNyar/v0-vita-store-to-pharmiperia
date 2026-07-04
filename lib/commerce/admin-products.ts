import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { productSlug } from './slugs'

export interface AdminProductStockItem {
  id: string
  sku: string
  nameLv: string
  nameRu: string
  stockQuantity: number
  isActive: boolean
}

export interface AdminProductDetail extends AdminProductStockItem {
  slug: string
  descriptionLv: string | null
  descriptionRu: string | null
  priceCents: number
  originalPriceCents: number | null
  currency: string
  volume: string | null
  brandId: string | null
  categoryId: string | null
}

export interface AdminProductInput {
  sku: string
  nameLv: string
  nameRu: string
  descriptionLv?: string | null
  descriptionRu?: string | null
  priceCents: number
  originalPriceCents?: number | null
  stockQuantity: number
  isActive?: boolean
  brandId?: string | null
  categoryId?: string | null
  volume?: string | null
}

export interface AdminProductUpdateInput {
  sku?: string
  nameLv?: string
  nameRu?: string
  descriptionLv?: string | null
  descriptionRu?: string | null
  priceCents?: number
  originalPriceCents?: number | null
  stockQuantity?: number
  isActive?: boolean
  brandId?: string | null
  categoryId?: string | null
  volume?: string | null
}

type ProductStockRow = {
  id: string
  sku: string
  name_lv: string
  name_ru: string
  stock_quantity: number | null
  is_active: boolean | null
}

type ProductDetailRow = ProductStockRow & {
  slug: string
  description_lv: string | null
  description_ru: string | null
  price_cents: number
  original_price_cents: number | null
  currency: string
  volume: string | null
  brand_id: string | null
  category_id: string | null
}

const ADMIN_PRODUCT_COLUMNS =
  'id, sku, slug, name_lv, name_ru, description_lv, description_ru, price_cents, original_price_cents, currency, volume, stock_quantity, is_active, brand_id, category_id' as const

function mapStockRow(row: ProductStockRow): AdminProductStockItem {
  return {
    id: row.id,
    sku: row.sku,
    nameLv: row.name_lv,
    nameRu: row.name_ru,
    stockQuantity: row.stock_quantity ?? 0,
    isActive: row.is_active ?? false,
  }
}

function mapDetailRow(row: ProductDetailRow): AdminProductDetail {
  return {
    ...mapStockRow(row),
    slug: row.slug,
    descriptionLv: row.description_lv,
    descriptionRu: row.description_ru,
    priceCents: row.price_cents,
    originalPriceCents: row.original_price_cents,
    currency: row.currency,
    volume: row.volume,
    brandId: row.brand_id,
    categoryId: row.category_id,
  }
}

function normalizeSku(sku: string): string {
  const trimmed = sku.trim()
  if (!trimmed) {
    throw new Error('SKU is required')
  }
  return trimmed
}

function normalizePriceCents(value: number, field: string): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${field} must be a non-negative integer (cents)`)
  }
  return value
}

function normalizeStockQuantity(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('stockQuantity must be a non-negative integer')
  }
  return value
}

function buildInsertPayload(input: AdminProductInput) {
  const sku = normalizeSku(input.sku)
  const nameLv = input.nameLv.trim()
  const nameRu = input.nameRu.trim()

  if (!nameLv || !nameRu) {
    throw new Error('Product names (LV and RU) are required')
  }

  return {
    sku,
    slug: productSlug({ name: nameRu, sku }),
    name_lv: nameLv,
    name_ru: nameRu,
    description_lv: input.descriptionLv?.trim() || null,
    description_ru: input.descriptionRu?.trim() || null,
    price_cents: normalizePriceCents(input.priceCents, 'priceCents'),
    original_price_cents:
      input.originalPriceCents == null
        ? null
        : normalizePriceCents(input.originalPriceCents, 'originalPriceCents'),
    currency: 'EUR',
    volume: input.volume?.trim() || null,
    stock_quantity: normalizeStockQuantity(input.stockQuantity),
    is_active: input.isActive ?? true,
    brand_id: input.brandId ?? null,
    category_id: input.categoryId ?? null,
    updated_at: new Date().toISOString(),
  }
}

function buildUpdatePayload(input: AdminProductUpdateInput) {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (input.sku !== undefined) {
    payload.sku = normalizeSku(input.sku)
  }
  if (input.nameLv !== undefined) {
    const nameLv = input.nameLv.trim()
    if (!nameLv) throw new Error('nameLv cannot be empty')
    payload.name_lv = nameLv
  }
  if (input.nameRu !== undefined) {
    const nameRu = input.nameRu.trim()
    if (!nameRu) throw new Error('nameRu cannot be empty')
    payload.name_ru = nameRu
  }
  if (input.descriptionLv !== undefined) {
    payload.description_lv = input.descriptionLv?.trim() || null
  }
  if (input.descriptionRu !== undefined) {
    payload.description_ru = input.descriptionRu?.trim() || null
  }
  if (input.priceCents !== undefined) {
    payload.price_cents = normalizePriceCents(input.priceCents, 'priceCents')
  }
  if (input.originalPriceCents !== undefined) {
    payload.original_price_cents =
      input.originalPriceCents == null
        ? null
        : normalizePriceCents(input.originalPriceCents, 'originalPriceCents')
  }
  if (input.volume !== undefined) {
    payload.volume = input.volume?.trim() || null
  }
  if (input.stockQuantity !== undefined) {
    payload.stock_quantity = normalizeStockQuantity(input.stockQuantity)
  }
  if (input.isActive !== undefined) {
    payload.is_active = input.isActive
  }
  if (input.brandId !== undefined) {
    payload.brand_id = input.brandId
  }
  if (input.categoryId !== undefined) {
    payload.category_id = input.categoryId
  }

  if (input.sku !== undefined || input.nameRu !== undefined) {
    const sku = (payload.sku as string | undefined) ?? undefined
    const nameRu = (payload.name_ru as string | undefined) ?? undefined
    if (sku && nameRu) {
      payload.slug = productSlug({ name: nameRu, sku })
    }
  }

  return payload
}

export async function listAdminProductStock(): Promise<AdminProductStockItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, sku, name_lv, name_ru, stock_quantity, is_active')
    .order('sku', { ascending: true })

  if (error) {
    throw new Error(`Failed to load product stock: ${error.message}`)
  }

  return ((data as ProductStockRow[] | null) ?? []).map(mapStockRow)
}

export async function getAdminProductById(productId: string): Promise<AdminProductDetail | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(ADMIN_PRODUCT_COLUMNS)
    .eq('id', productId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load product: ${error.message}`)
  }

  if (!data) return null
  return mapDetailRow(data as ProductDetailRow)
}

export async function createAdminProduct(input: AdminProductInput): Promise<AdminProductDetail> {
  const supabase = await createClient()
  const payload = buildInsertPayload(input)

  const { data, error } = await supabase
    .from('products')
    .insert(payload)
    .select(ADMIN_PRODUCT_COLUMNS)
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error(`Product with SKU "${payload.sku}" already exists`)
    }
    throw new Error(`Failed to create product: ${error.message}`)
  }

  return mapDetailRow(data as ProductDetailRow)
}

export async function updateAdminProduct(
  productId: string,
  input: AdminProductUpdateInput
): Promise<AdminProductDetail> {
  const supabase = await createClient()
  const payload = buildUpdatePayload(input)

  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', productId)
    .select(ADMIN_PRODUCT_COLUMNS)
    .maybeSingle()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Product SKU must be unique')
    }
    throw new Error(`Failed to update product: ${error.message}`)
  }

  if (!data) {
    throw new Error(`Product not found: ${productId}`)
  }

  return mapDetailRow(data as ProductDetailRow)
}

/** Soft-delete — deactivates product without removing order history references. */
export async function deactivateAdminProduct(productId: string): Promise<AdminProductDetail> {
  return updateAdminProduct(productId, { isActive: false })
}