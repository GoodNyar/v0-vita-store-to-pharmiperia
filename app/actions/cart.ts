'use server'

import type { Product } from '@/lib/data'
import {
  clearServerCart,
  getAuthenticatedUserCart,
  removeServerCartLine,
  serverCartToStorefrontProducts,
  syncLocalCartToServer,
  upsertServerCartLine,
} from '@/lib/commerce/server-cart'
import { isLocale, type Locale } from '@/lib/i18n/config'

async function requireUserId(): Promise<string | null> {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function mergeGuestCartToServer(
  locale: string,
  items: { legacyId: number; quantity: number }[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const userId = await requireUserId()
    if (!userId) {
      return { ok: false, error: 'not_authenticated' }
    }

    const resolved: Locale = isLocale(locale) ? locale : 'lv'
    await syncLocalCartToServer(userId, resolved, items)
    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'merge_failed'
    return { ok: false, error: message }
  }
}

export async function loadAuthenticatedCart(
  locale: string
): Promise<{ ok: true; items: { product: Product; quantity: number }[] } | { ok: false }> {
  const resolved: Locale = isLocale(locale) ? locale : 'lv'
  const cart = await getAuthenticatedUserCart(resolved)
  if (!cart) {
    return { ok: false }
  }

  const products = await serverCartToStorefrontProducts(cart)
  const items = cart.lines
    .map((line) => {
      const product = products.find((p) => p.id === line.legacyId)
      if (!product) return null
      return { product, quantity: line.quantity }
    })
    .filter((item): item is { product: Product; quantity: number } => item != null)

  return { ok: true, items }
}

export async function persistCartLine(
  locale: string,
  legacyId: number,
  quantity: number
): Promise<{ ok: true } | { ok: false }> {
  const userId = await requireUserId()
  if (!userId) return { ok: false }

  const resolved: Locale = isLocale(locale) ? locale : 'lv'
  if (quantity <= 0) {
    await removeServerCartLine(userId, legacyId)
  } else {
    await upsertServerCartLine(userId, resolved, legacyId, quantity)
  }
  return { ok: true }
}

export async function persistRemoveCartLine(
  legacyId: number
): Promise<{ ok: true } | { ok: false }> {
  const userId = await requireUserId()
  if (!userId) return { ok: false }
  await removeServerCartLine(userId, legacyId)
  return { ok: true }
}

export async function persistClearCart(): Promise<{ ok: true } | { ok: false }> {
  const userId = await requireUserId()
  if (!userId) return { ok: false }
  await clearServerCart(userId)
  return { ok: true }
}