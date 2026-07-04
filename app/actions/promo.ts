'use server'

import { validatePromoCode, type PromoValidationResult } from '@/lib/commerce/promo'

export async function validateCheckoutPromoCode(
  code: string,
  subtotalCents: number
): Promise<PromoValidationResult> {
  const trimmed = code.trim()
  if (!trimmed) {
    return { valid: false, error: 'empty_code' }
  }
  return validatePromoCode(trimmed, subtotalCents)
}