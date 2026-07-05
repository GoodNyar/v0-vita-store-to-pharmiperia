import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

/** Disabled until full lifecycle (checkout gate, consume/release on paid, expiry cron) ships. */
export function isInventoryReservationsEnabled(): boolean {
  return process.env.INVENTORY_RESERVATIONS_ENABLED === 'true'
}

/** Hold stock for a pending order (schema + RPC exist; execution path gated off). */
export async function reserveInventoryForOrder(
  orderId: string,
  ttlMinutes = 30
): Promise<void> {
  if (!isInventoryReservationsEnabled()) {
    return
  }

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
  if (!isInventoryReservationsEnabled()) {
    return
  }

  const supabase = createAdminClient()
  const { error } = await supabase.rpc('release_inventory_reservation', {
    p_order_id: orderId,
  })

  if (error) {
    throw new Error(`Failed to release inventory reservation for order ${orderId}: ${error.message}`)
  }
}