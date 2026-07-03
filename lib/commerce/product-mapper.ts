import type { Product as LegacyProduct } from '@/lib/data'
import { moneyFromDb } from '@/lib/money'
import type { Locale } from '@/lib/i18n/config'
import { uuidToLegacyProductId } from './ids'
import type { CommerceProduct, DbProduct } from './types'

type ProductRow = DbProduct & {
  brands?: { name: string; slug: string } | { name: string; slug: string }[] | null
  categories?: { slug: string } | { slug: string }[] | null
  product_images?: { image_url: string; is_primary: boolean | null; sort_order: number | null }[]
}

function pickName(row: ProductRow, locale: Locale): string {
  return locale === 'lv' ? row.name_lv : row.name_ru
}

function pickDescription(row: ProductRow, locale: Locale): string | null {
  const value = locale === 'lv' ? row.description_lv : row.description_ru
  return value ?? null
}

function pickHowToUse(row: ProductRow, locale: Locale): string | null {
  const value = locale === 'lv' ? row.how_to_use_lv : row.how_to_use_ru
  return value ?? null
}

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null
  return Array.isArray(value) ? (value[0] ?? null) : value
}

function primaryImage(row: ProductRow): string | null {
  const images = row.product_images ?? []
  const primary =
    images.find((img) => img.is_primary) ??
    images.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0]
  return primary?.image_url ?? null
}

export function mapDbProductToCommerce(row: ProductRow, locale: Locale): CommerceProduct {
  const currency = (row.currency ?? 'EUR') as 'EUR'
  const brand = relationOne(row.brands)
  const category = relationOne(row.categories)
  return {
    id: row.id,
    legacyId: uuidToLegacyProductId(row.id),
    slug: row.slug,
    sku: row.sku,
    name: pickName(row, locale),
    description: pickDescription(row, locale),
    howToUse: pickHowToUse(row, locale),
    brandId: row.brand_id,
    brandName: brand?.name ?? null,
    categoryId: row.category_id,
    categorySlug: category?.slug ?? null,
    price: moneyFromDb(row.price_cents, currency),
    originalPrice:
      row.original_price_cents != null
        ? moneyFromDb(row.original_price_cents, currency)
        : null,
    volume: row.volume,
    inStock: (row.stock_quantity ?? 0) > 0 && row.is_active !== false,
    stockQuantity: row.stock_quantity ?? 0,
    isFeatured: row.is_featured ?? false,
    isNew: row.is_new ?? false,
    isBestseller: row.is_bestseller ?? false,
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    imageUrl: primaryImage(row),
    locale,
  }
}

export function mapCommerceToLegacyProduct(
  product: CommerceProduct,
  extras?: Partial<LegacyProduct>
): LegacyProduct {
  const legacyId = product.legacyId ?? 0
  return {
    id: legacyId,
    sku: product.sku,
    name: product.name,
    brand: product.brandName ?? '',
    volume: product.volume ?? '',
    description: product.description ?? '',
    price: product.price,
    originalPrice: product.originalPrice ?? undefined,
    rating: product.rating,
    reviewCount: product.reviewCount,
    image: product.imageUrl ?? '/placeholder.svg',
    category: product.categorySlug ?? '',
    inStock: product.inStock,
    ...extras,
  }
}

export function pricesMatchLegacy(legacyPriceCents: number, dbPriceCents: number): boolean {
  return legacyPriceCents === dbPriceCents
}