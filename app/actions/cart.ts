'use server'

import { syncLocalCartToServer } from '@/lib/commerce/server-cart'
import { isLocale, type Locale } from '@/lib/i18n/config'

export async function mergeGuestCartToServer(
  locale: string,
  items: { legacyId: number; quantity: number }[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { ok: false, error: 'not_authenticated' }
    }

    const resolved: Locale = isLocale(locale) ? locale : 'lv'
    await syncLocalCartToServer(user.id, resolved, items)
    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'merge_failed'
    return { ok: false, error: message }
  }
}