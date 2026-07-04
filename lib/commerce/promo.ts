import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

export interface PromoValidationResult {
  valid: boolean
  promoId?: string
  code?: string
  discountCents?: number
  discountType?: string
  error?: string
  minOrderCents?: number
}

export async function validatePromoCode(
  code: string,
  subtotalCents: number
): Promise<PromoValidationResult> {
  const supabase = createAdminClient()
  const { data, error } = await supabase.rpc('validate_promo_code', {
    p_code: code,
    p_subtotal_cents: subtotalCents,
  })

  if (error) {
    throw new Error(`Promo validation failed: ${error.message}`)
  }

  const payload = data as Record<string, unknown> | null
  if (!payload) {
    return { valid: false, error: 'unknown' }
  }

  if (payload.valid !== true) {
    return {
      valid: false,
      error: String(payload.error ?? 'invalid'),
      minOrderCents:
        typeof payload.min_order_cents === 'number' ? payload.min_order_cents : undefined,
    }
  }

  return {
    valid: true,
    promoId: String(payload.promo_id),
    code: String(payload.code),
    discountCents: Number(payload.discount_cents),
    discountType: String(payload.discount_type),
  }
}