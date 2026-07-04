import 'server-only'

import { createClient } from '@/lib/supabase/server'

export interface AdminPromoListItem {
  id: string
  code: string
  discountType: string
  discountValueCents: number
  minOrderAmountCents: number
  isActive: boolean
  usedCount: number
  maxUses: number | null
  validFrom: string | null
  validUntil: string | null
  createdAt: string | null
}

type PromoRow = {
  id: string
  code: string
  discount_type: string
  discount_value_cents: number
  min_order_amount_cents: number
  is_active: boolean | null
  used_count: number | null
  max_uses: number | null
  valid_from: string | null
  valid_until: string | null
  created_at: string | null
}

function mapPromoRow(row: PromoRow): AdminPromoListItem {
  return {
    id: row.id,
    code: row.code,
    discountType: row.discount_type,
    discountValueCents: row.discount_value_cents,
    minOrderAmountCents: row.min_order_amount_cents,
    isActive: row.is_active ?? false,
    usedCount: row.used_count ?? 0,
    maxUses: row.max_uses,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    createdAt: row.created_at,
  }
}

export async function listAdminPromoCodes(limit = 100): Promise<AdminPromoListItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('promo_codes')
    .select(
      'id, code, discount_type, discount_value_cents, min_order_amount_cents, is_active, used_count, max_uses, valid_from, valid_until, created_at'
    )
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to load promo codes: ${error.message}`)
  }

  return ((data as PromoRow[] | null) ?? []).map(mapPromoRow)
}