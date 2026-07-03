import type { Locale } from '@/lib/i18n/config'
import type { Money } from '@/lib/money'
import type { Database, Tables } from '@/lib/database.types'

/** Re-export generated row types — commerce modules map these to domain types. */
export type DbProduct = Tables<'products'>
export type DbOrder = Tables<'orders'>
export type DbOrderItem = Tables<'order_items'>
export type DbFavorite = Tables<'favorites'>
export type DbReview = Tables<'reviews'>
export type DbCategory = Tables<'categories'>
export type DbBrand = Tables<'brands'>
export type DbProductImage = Tables<'product_images'>

export type ProductId = string
export type OrderId = string
export type UserId = string

/** Canonical order lifecycle (single union — replaces scattered string literals). */
export const ORDER_STATUSES = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

/** Storefront product — locale-aware, money in minor units at boundary. */
export interface CommerceProduct {
  id: ProductId
  /** Legacy numeric id (1–16) when seeded from lib/data.ts; null for new SKUs. */
  legacyId: number | null
  slug: string
  sku: string
  name: string
  description: string | null
  howToUse: string | null
  brandId: string | null
  brandName: string | null
  categoryId: string | null
  categorySlug: string | null
  price: Money
  originalPrice: Money | null
  volume: string | null
  inStock: boolean
  stockQuantity: number
  isFeatured: boolean
  isNew: boolean
  isBestseller: boolean
  rating: number
  reviewCount: number
  imageUrl: string | null
  locale: Locale
}

export interface CommerceOrderLine {
  id: string
  productId: ProductId | null
  productName: string
  productSku: string
  quantity: number
  unitPrice: Money
  lineTotal: Money
}

export interface CommerceOrder {
  id: OrderId
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  email: string
  firstName: string
  lastName: string
  subtotal: Money
  shippingCost: Money
  discount: Money
  tax: Money
  total: Money
  locale: Locale
  createdAt: string
  lines: CommerceOrderLine[]
}

export interface CommerceFavorite {
  productId: ProductId
  createdAt: string
}

/** Supabase client typing helper for future commerce queries. */
export type CommerceDatabase = Database