import { createClient } from '@/lib/supabase/client'
import {
  commerceDatabase,
  commerceFail,
  commerceOk,
  commerceValidation,
  type CommerceResult,
} from './errors'

export const RETURN_REASONS = [
  'damaged',
  'wrong_item',
  'not_as_described',
  'changed_mind',
  'other',
] as const

export type ReturnReason = (typeof RETURN_REASONS)[number]

export const RETURN_STATUSES = ['pending', 'approved', 'rejected', 'refunded'] as const
export type ReturnStatus = (typeof RETURN_STATUSES)[number]

export interface ReturnRequest {
  id: string
  orderId: string
  orderNumber: string
  reason: ReturnReason
  description: string | null
  status: ReturnStatus
  refundAmountCents: number | null
  createdAt: string
  updatedAt: string
}

type ReturnRow = {
  id: string
  order_id: string
  reason: string
  description: string | null
  status: string
  refund_amount_cents: number | null
  created_at: string
  updated_at: string
  order: { order_number: string } | { order_number: string }[] | null
}

function mapReturnRow(row: ReturnRow): ReturnRequest {
  const order = Array.isArray(row.order) ? (row.order[0] ?? null) : row.order
  return {
    id: row.id,
    orderId: row.order_id,
    orderNumber: order?.order_number ?? '',
    reason: row.reason as ReturnReason,
    description: row.description,
    status: row.status as ReturnStatus,
    refundAmountCents: row.refund_amount_cents,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function listReturnRequestsForUser(
  userId: string
): Promise<CommerceResult<ReturnRequest[]>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('return_requests')
    .select(
      'id, order_id, reason, description, status, refund_amount_cents, created_at, updated_at, order:orders ( order_number )'
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return commerceFail(commerceDatabase('Failed to load return requests', error))
  }

  return commerceOk(((data ?? []) as ReturnRow[]).map(mapReturnRow))
}

export async function createReturnRequest(input: {
  userId: string
  orderId: string
  reason: ReturnReason
  description?: string
}): Promise<CommerceResult<ReturnRequest>> {
  if (!RETURN_REASONS.includes(input.reason)) {
    return commerceFail(commerceValidation('Invalid return reason'))
  }

  const supabase = createClient()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, order_number, payment_status, user_id')
    .eq('id', input.orderId)
    .eq('user_id', input.userId)
    .maybeSingle()

  if (orderError) {
    return commerceFail(commerceDatabase('Failed to verify order', orderError))
  }
  if (!order) {
    return commerceFail(commerceValidation('Order not found'))
  }
  if (order.payment_status !== 'paid') {
    return commerceFail(commerceValidation('Only paid orders can be returned'))
  }

  const { data: existing, error: existingError } = await supabase
    .from('return_requests')
    .select('id')
    .eq('order_id', input.orderId)
    .in('status', ['pending', 'approved'])
    .maybeSingle()

  if (existingError) {
    return commerceFail(commerceDatabase('Failed to check existing return', existingError))
  }
  if (existing) {
    return commerceFail(commerceValidation('Return request already exists for this order'))
  }

  const { data, error } = await supabase
    .from('return_requests')
    .insert({
      user_id: input.userId,
      order_id: input.orderId,
      reason: input.reason,
      description: input.description?.trim() || null,
      status: 'pending',
    })
    .select(
      'id, order_id, reason, description, status, refund_amount_cents, created_at, updated_at, order:orders ( order_number )'
    )
    .single()

  if (error) {
    return commerceFail(commerceDatabase('Failed to create return request', error))
  }

  return commerceOk(mapReturnRow(data as ReturnRow))
}

export async function listReturnEligibleOrders(
  userId: string
): Promise<CommerceResult<{ id: string; orderNumber: string; createdAt: string }[]>> {
  const supabase = createClient()

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, order_number, created_at')
    .eq('user_id', userId)
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })

  if (ordersError) {
    return commerceFail(commerceDatabase('Failed to load orders', ordersError))
  }

  const { data: activeReturns, error: returnsError } = await supabase
    .from('return_requests')
    .select('order_id')
    .eq('user_id', userId)
    .in('status', ['pending', 'approved'])

  if (returnsError) {
    return commerceFail(commerceDatabase('Failed to load return requests', returnsError))
  }

  const blocked = new Set((activeReturns ?? []).map((row) => row.order_id))

  const eligible = (orders ?? [])
    .filter((order) => !blocked.has(order.id))
    .map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      createdAt: order.created_at ?? new Date().toISOString(),
    }))

  return commerceOk(eligible)
}