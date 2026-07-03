'use server'

import { createClient } from '@/lib/supabase/server'
import {
  createReturnRequest,
  listReturnEligibleOrders,
  listReturnRequestsForUser,
  type ReturnReason,
} from '@/lib/commerce/returns'
import { isCommerceError } from '@/lib/commerce/errors'

export async function submitReturnRequest(input: {
  orderId: string
  reason: ReturnReason
  description?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false as const, error: 'auth_required' }
  }

  const result = await createReturnRequest({
    userId: user.id,
    orderId: input.orderId,
    reason: input.reason,
    description: input.description,
  })

  if (!result.ok) {
    return {
      ok: false as const,
      error: isCommerceError(result.error) ? result.error.code : 'unknown',
      message: result.error.message,
    }
  }

  return { ok: true as const, data: result.data }
}

export async function fetchReturnRequests() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false as const, error: 'auth_required' as const }
  }

  const [requests, eligible] = await Promise.all([
    listReturnRequestsForUser(user.id),
    listReturnEligibleOrders(user.id),
  ])

  if (!requests.ok) {
    return { ok: false as const, error: 'load_failed' as const }
  }
  if (!eligible.ok) {
    return { ok: false as const, error: 'load_failed' as const }
  }

  return {
    ok: true as const,
    requests: requests.data,
    eligibleOrders: eligible.data,
  }
}