import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

/** Hold stock for a pending order (Phase 5 foundation). */
export async function reserveInventoryForOrder(
  orderId: string,
  ttlMinutes = 30
): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.rpc('reserve_inventory_for_order', {
    p_order_id: orderId,
    p_ttl_minutes: ttlMinutes,
  })

  if (error) {
    throw new Error(`Failed to reserve inventory for order ${orderId}: ${error.message}`)
  }
}

export async function releaseInventoryReservation(orderId: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.rpc('release_inventory_reservation', {
    p_order_id: orderId,
  })

  if (error) {
    throw new Error(`Failed to release inventory reservation for order ${orderId}: ${error.message}`)
  }
}