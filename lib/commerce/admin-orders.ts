import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { ORDER_STATUSES, type OrderStatus } from './types'

const ADMIN_ORDER_COLUMNS =
  'id, order_number, status, payment_status, email, first_name, last_name, total_cents, currency, created_at' as const

export interface AdminOrderListItem {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  email: string
  firstName: string
  lastName: string
  totalCents: number
  currency: string
  createdAt: string
}

type AdminOrderRow = {
  id: string
  order_number: string
  status: string | null
  payment_status: string | null
  email: string
  first_name: string
  last_name: string
  total_cents: number
  currency: string
  created_at: string | null
}

function mapAdminOrder(row: AdminOrderRow): AdminOrderListItem {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status ?? 'pending',
    paymentStatus: row.payment_status ?? 'pending',
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    totalCents: row.total_cents,
    currency: row.currency,
    createdAt: row.created_at ?? new Date().toISOString(),
  }
}

export async function listAdminOrders(limit = 100): Promise<AdminOrderListItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(ADMIN_ORDER_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to load admin orders: ${error.message}`)
  }

  return ((data as AdminOrderRow[] | null) ?? []).map(mapAdminOrder)
}

export async function updateAdminOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  if (!ORDER_STATUSES.includes(status)) {
    throw new Error(`Invalid order status: ${status}`)
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('orders')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) {
    throw new Error(`Failed to update order status: ${error.message}`)
  }
}