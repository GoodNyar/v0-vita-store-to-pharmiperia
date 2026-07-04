import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

/** Phase 3 PR-13: detect stale carts with items for retention emails. */
export async function listAbandonedCarts(olderThanHours = 24, limit = 50) {
  const supabase = createAdminClient()
  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('carts')
    .select('id, user_id, locale, updated_at, cart_items ( quantity )')
    .lt('updated_at', cutoff)
    .not('user_id', 'is', null)
    .limit(limit)

  if (error) {
    throw new Error(`Failed to list abandoned carts: ${error.message}`)
  }

  return (data ?? []).filter((row) => {
    const items = row.cart_items as { quantity: number }[] | null
    return (items?.length ?? 0) > 0
  })
}