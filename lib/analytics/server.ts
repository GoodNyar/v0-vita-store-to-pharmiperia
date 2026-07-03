import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

export interface PurchaseEventInput {
  orderId: string
  userId?: string | null
  orderNumber: string
  totalCents: number
  currency: string
  taxCents: number
  locale: string
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  lineItems: Array<{
    productId: string | null
    productSku: string
    productName: string
    quantity: number
    unitPriceCents: number
  }>
}

/**
 * Records a server-side purchase event (ADR-0017).
 * Idempotent: skips if orders.analytics_event_id is already set.
 */
export async function recordPurchaseEvent(
  input: PurchaseEventInput
): Promise<string | null> {
  const supabase = createAdminClient()

  const { data: existing, error: fetchError } = await supabase
    .from('orders')
    .select('analytics_event_id')
    .eq('id', input.orderId)
    .maybeSingle()

  if (fetchError) {
    throw new Error(`Failed to load order for analytics: ${fetchError.message}`)
  }
  if (existing?.analytics_event_id) {
    return existing.analytics_event_id
  }

  const properties = {
    order_number: input.orderNumber,
    value: input.totalCents / 100,
    currency: input.currency,
    tax: input.taxCents / 100,
    locale: input.locale,
    items: input.lineItems.map((line) => ({
      item_id: line.productId ?? line.productSku,
      item_name: line.productName,
      quantity: line.quantity,
      price: line.unitPriceCents / 100,
    })),
  }

  const { data: event, error: insertError } = await supabase
    .from('analytics_events')
    .insert({
      event_name: 'purchase',
      order_id: input.orderId,
      user_id: input.userId ?? null,
      properties,
      utm_source: input.utmSource ?? null,
      utm_medium: input.utmMedium ?? null,
      utm_campaign: input.utmCampaign ?? null,
    })
    .select('id')
    .single()

  if (insertError || !event) {
    throw new Error(`Failed to record purchase event: ${insertError?.message ?? 'unknown'}`)
  }

  const { error: linkError } = await supabase
    .from('orders')
    .update({ analytics_event_id: event.id })
    .eq('id', input.orderId)
    .is('analytics_event_id', null)

  if (linkError) {
    throw new Error(`Failed to link purchase event to order: ${linkError.message}`)
  }

  console.info('[analytics] purchase recorded', {
    orderId: input.orderId,
    eventId: event.id,
  })

  return event.id
}