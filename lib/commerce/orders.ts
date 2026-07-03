import { createClient } from '@/lib/supabase/client'
import { moneyFromDb } from '@/lib/money'
import { isLocale, type Locale } from '@/lib/i18n/config'
import {
  commerceDatabase,
  commerceFail,
  commerceOk,
  type CommerceResult,
} from './errors'
import type {
  CommerceOrder,
  CommerceOrderLine,
  OrderStatus,
  PaymentStatus,
} from './types'

const ORDER_LIST_COLUMNS =
  'id, order_number, status, payment_status, email, first_name, last_name, subtotal_cents, shipping_cost_cents, discount_cents, tax_cents, total_cents, currency, locale, created_at' as const

const ORDER_ITEM_COLUMNS =
  'id, order_id, product_id, product_name, product_sku, quantity, unit_price_cents, total_price_cents, currency' as const

type OrderRow = {
  id: string
  order_number: string
  status: string
  payment_status: string
  email: string
  first_name: string
  last_name: string
  subtotal_cents: number
  shipping_cost_cents: number
  discount_cents: number
  tax_cents: number
  total_cents: number
  currency: string
  locale: string
  created_at: string
}

type OrderItemRow = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_sku: string
  quantity: number
  unit_price_cents: number
  total_price_cents: number
  currency: string
}

function mapOrder(row: OrderRow, lines: CommerceOrderLine[]): CommerceOrder {
  const currency = row.currency as 'EUR'
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status as OrderStatus,
    paymentStatus: row.payment_status as PaymentStatus,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    subtotal: moneyFromDb(row.subtotal_cents, currency),
    shippingCost: moneyFromDb(row.shipping_cost_cents, currency),
    discount: moneyFromDb(row.discount_cents, currency),
    tax: moneyFromDb(row.tax_cents, currency),
    total: moneyFromDb(row.total_cents, currency),
    locale: isLocale(row.locale) ? row.locale : 'lv',
    createdAt: row.created_at,
    lines,
  }
}

function mapOrderLine(row: OrderItemRow): CommerceOrderLine {
  const currency = row.currency as 'EUR'
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    productSku: row.product_sku,
    quantity: row.quantity,
    unitPrice: moneyFromDb(row.unit_price_cents, currency),
    lineTotal: moneyFromDb(row.total_price_cents, currency),
  }
}

export async function listOrdersForUser(
  userId: string
): Promise<CommerceResult<CommerceOrder[]>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_LIST_COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return commerceFail(commerceDatabase('Failed to load orders', error))
  }

  const orders = (data as OrderRow[] | null)?.map((row) => mapOrder(row, [])) ?? []
  return commerceOk(orders)
}

export async function getOrderWithLines(
  userId: string,
  orderId: string
): Promise<CommerceResult<CommerceOrder>> {
  const supabase = createClient()

  const { data: orderRow, error: orderError } = await supabase
    .from('orders')
    .select(ORDER_LIST_COLUMNS)
    .eq('id', orderId)
    .eq('user_id', userId)
    .maybeSingle()

  if (orderError) {
    return commerceFail(commerceDatabase('Failed to load order', orderError))
  }
  if (!orderRow) {
    return commerceFail(commerceDatabase('Order not found'))
  }

  const { data: itemRows, error: itemsError } = await supabase
    .from('order_items')
    .select(ORDER_ITEM_COLUMNS)
    .eq('order_id', orderId)

  if (itemsError) {
    return commerceFail(commerceDatabase('Failed to load order items', itemsError))
  }

  const lines = ((itemRows as OrderItemRow[] | null) ?? []).map(mapOrderLine)
  return commerceOk(mapOrder(orderRow as OrderRow, lines))
}

export type OrderListItem = CommerceOrder

export type OrderDetailLine = CommerceOrderLine & {
  imageUrl: string
}

export async function getOrderDetailLines(
  userId: string,
  orderId: string
): Promise<CommerceResult<OrderDetailLine[]>> {
  const supabase = createClient()

  const { data: orderRow, error: orderError } = await supabase
    .from('orders')
    .select('id')
    .eq('id', orderId)
    .eq('user_id', userId)
    .maybeSingle()

  if (orderError || !orderRow) {
    return commerceFail(commerceDatabase('Order not found', orderError))
  }

  const { data, error } = await supabase
    .from('order_items')
    .select(
      `${ORDER_ITEM_COLUMNS}, product:products ( name, product_images ( image_url, is_primary, sort_order ) )`
    )
    .eq('order_id', orderId)

  if (error) {
    return commerceFail(commerceDatabase('Failed to load order items', error))
  }

  type DetailRow = OrderItemRow & {
    product:
      | {
          name: string
          product_images: {
            image_url: string
            is_primary: boolean | null
            sort_order: number | null
          }[]
        }
      | {
          name: string
          product_images: {
            image_url: string
            is_primary: boolean | null
            sort_order: number | null
          }[]
        }[]
      | null
  }

  const lines: OrderDetailLine[] = ((data ?? []) as DetailRow[]).map((row) => {
    const base = mapOrderLine(row)
    const product = Array.isArray(row.product) ? (row.product[0] ?? null) : row.product
    const images = product?.product_images ?? []
    const primary =
      images.find((img) => img.is_primary) ??
      images.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0]
    return {
      ...base,
      productName: product?.name ?? row.product_name,
      imageUrl: primary?.image_url ?? '/placeholder.svg',
    }
  })

  return commerceOk(lines)
}