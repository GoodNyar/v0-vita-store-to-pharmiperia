import 'server-only'

import type { Locale } from '@/lib/i18n/config'
import { legacyProductIdToUuid, uuidToLegacyProductId } from '@/lib/commerce/ids'
import { getProductByLegacyId } from '@/lib/commerce/products'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { eur, type Money } from '@/lib/money'

export interface ServerCartLine {
  productId: string
  legacyId: number | null
  name: string
  sku: string
  quantity: number
  unitPrice: Money
}

export interface ServerCart {
  id: string
  locale: Locale
  lines: ServerCartLine[]
}

type CartItemRow = {
  product_id: string
  quantity: number
  unit_price_cents: number
  currency: string
  products: {
    sku: string
    name_ru: string
    name_lv: string
  } | null
}

export async function getOrCreateUserCart(
  userId: string,
  locale: Locale
): Promise<ServerCart> {
  const supabase = createAdminClient()

  const { data: existing } = await supabase
    .from('carts')
    .select('id, locale')
    .eq('user_id', userId)
    .maybeSingle()

  let cartId = existing?.id
  if (!cartId) {
    const { data: created, error } = await supabase
      .from('carts')
      .insert({ user_id: userId, locale })
      .select('id, locale')
      .single()
    if (error || !created) {
      throw new Error(`Failed to create cart: ${error?.message ?? 'unknown'}`)
    }
    cartId = created.id
  }

  return loadCart(cartId, (existing?.locale as Locale) ?? locale)
}

async function loadCart(cartId: string, locale: Locale): Promise<ServerCart> {
  const supabase = createAdminClient()
  const { data: rows, error } = await supabase
    .from('cart_items')
    .select(
      'product_id, quantity, unit_price_cents, currency, products ( sku, name_ru, name_lv )'
    )
    .eq('cart_id', cartId)

  if (error) {
    throw new Error(`Failed to load cart items: ${error.message}`)
  }

  const lines: ServerCartLine[] = (rows ?? []).map((row) => {
    const typed = row as unknown as CartItemRow
    const product = typed.products
    const name = locale === 'lv' ? product?.name_lv ?? '' : product?.name_ru ?? ''
    return {
      productId: typed.product_id,
      legacyId: uuidToLegacyProductId(typed.product_id),
      name,
      sku: product?.sku ?? '',
      quantity: typed.quantity,
      unitPrice: eur(typed.unit_price_cents),
    }
  })

  return { id: cartId, locale, lines }
}

export async function syncLocalCartToServer(
  userId: string,
  locale: Locale,
  items: { legacyId: number; quantity: number }[]
): Promise<ServerCart> {
  const cart = await getOrCreateUserCart(userId, locale)
  const supabase = createAdminClient()

  for (const item of items) {
    const product = await getProductByLegacyId(item.legacyId, locale)
    if (!product.ok) continue

    const productId = legacyProductIdToUuid(item.legacyId)
    await supabase.from('cart_items').upsert(
      {
        cart_id: cart.id,
        product_id: productId,
        quantity: item.quantity,
        unit_price_cents: product.data.price.amount,
        currency: product.data.price.currency,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'cart_id,product_id' }
    )
  }

  return loadCart(cart.id, locale)
}

export async function getAuthenticatedUserCart(locale: Locale): Promise<ServerCart | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  return getOrCreateUserCart(user.id, locale)
}