import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface E2EOrderRow {
  id: string
  order_number: string
  payment_status: string
  status: string
  email: string
}

function createE2EAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase admin client is not configured for e2e')
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function waitForOrderByEmail(
  email: string,
  options: { timeoutMs?: number; paymentStatus?: string } = {}
): Promise<E2EOrderRow> {
  const { timeoutMs = 45_000, paymentStatus = 'pending' } = options
  const supabase = createE2EAdminClient()
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    const { data, error } = await supabase
      .from('orders')
      .select('id, order_number, payment_status, status, email')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`)
    }

    if (data && data.payment_status === paymentStatus) {
      return data as E2EOrderRow
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000))
  }

  throw new Error(`Order with email ${email} and payment_status=${paymentStatus} not found`)
}

export async function deleteOrdersByEmailPrefix(prefix = 'e2e-'): Promise<void> {
  const supabase = createE2EAdminClient()
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id')
    .like('email', `${prefix}%`)

  if (error || !orders?.length) return

  const ids = orders.map((row) => row.id)
  await supabase.from('order_items').delete().in('order_id', ids)
  await supabase.from('orders').delete().in('id', ids)
}