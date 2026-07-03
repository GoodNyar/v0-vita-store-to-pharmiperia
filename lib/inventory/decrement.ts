import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Idempotent stock decrement for a paid order (ADR-0019).
 */
export async function decrementStockForOrder(orderId: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.rpc('decrement_stock', { p_order_id: orderId })

  if (error) {
    throw new Error(`Failed to decrement stock for order ${orderId}: ${error.message}`)
  }

  console.info('[inventory] stock decremented', { orderId })
}