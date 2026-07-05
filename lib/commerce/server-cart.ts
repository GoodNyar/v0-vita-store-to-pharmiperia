import 'server-only'

import type { Locale } from '@/lib/i18n/config'
import { mergeLegacyExtras } from '@/lib/commerce/catalog-source'
import { legacyProductIdToUuid, uuidToLegacyProductId } from '@/lib/commerce/ids'
import { applyMarketPricingToCommerceProduct } from '@/lib/commerce/apply-market-pricing'
import { getProductByLegacyId } from '@/lib/commerce/products'
import { resolveMarketFromCookies } from '@/lib/commerce/resolve-market-server'
import type { Product } from '@/lib/data'
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

const MAX_QUANTITY = 99

async function touchCart(cartId: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase
    .from('carts')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', cartId)
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

  const { code: marketCode } = await resolveMarketFromCookies()

  for (const item of items) {
    const product = await getProductByLegacyId(item.legacyId, locale)
    if (!product.ok) continue

    const { product: priced } = await applyMarketPricingToCommerceProduct(product.data, marketCode)
    const productId = legacyProductIdToUuid(item.legacyId)
    const quantity = Math.max(1, Math.min(MAX_QUANTITY, item.quantity))
    await supabase.from('cart_items').upsert(
      {
        cart_id: cart.id,
        product_id: productId,
        quantity,
        unit_price_cents: priced.price.amount,
        currency: priced.price.currency,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'cart_id,product_id' }
    )
  }

  await touchCart(cart.id)
  return loadCart(cart.id, locale)
}

export async function upsertServerCartLine(
  userId: string,
  locale: Locale,
  legacyId: number,
  quantity: number
): Promise<ServerCart> {
  const cart = await getOrCreateUserCart(userId, locale)
  const product = await getProductByLegacyId(legacyId, locale)
  if (!product.ok) {
    throw new Error(`Product not found: ${legacyId}`)
  }

  const { code: marketCode } = await resolveMarketFromCookies()
  const { product: priced } = await applyMarketPricingToCommerceProduct(product.data, marketCode)

  const clampedQty = Math.max(1, Math.min(MAX_QUANTITY, Math.floor(quantity)))
  const supabase = createAdminClient()
  const productId = legacyProductIdToUuid(legacyId)

  await supabase.from('cart_items').upsert(
    {
      cart_id: cart.id,
      product_id: productId,
      quantity: clampedQty,
      unit_price_cents: priced.price.amount,
      currency: priced.price.currency,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'cart_id,product_id' }
  )

  await touchCart(cart.id)
  return loadCart(cart.id, locale)
}

export async function removeServerCartLine(
  userId: string,
  legacyId: number
): Promise<ServerCart> {
  const supabase = createAdminClient()
  const { data: existing } = await supabase
    .from('carts')
    .select('id, locale')
    .eq('user_id', userId)
    .maybeSingle()

  if (!existing?.id) {
    return { id: '', locale: 'lv', lines: [] }
  }

  const productId = legacyProductIdToUuid(legacyId)
  await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', existing.id)
    .eq('product_id', productId)

  await touchCart(existing.id)
  return loadCart(existing.id, (existing.locale as Locale) ?? 'lv')
}

export async function clearServerCart(userId: string): Promise<void> {
  const supabase = createAdminClient()
  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!cart?.id) return

  await supabase.from('cart_items').delete().eq('cart_id', cart.id)
  await touchCart(cart.id)
}

export async function getAuthenticatedUserCart(locale: Locale): Promise<ServerCart | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  return getOrCreateUserCart(user.id, locale)
}

/** Map server cart lines to storefront Product[] for CartProvider. */
export async function serverCartToStorefrontProducts(
  cart: ServerCart
): Promise<Product[]> {
  const products: Product[] = []

  for (const line of cart.lines) {
    if (line.legacyId == null) continue
    const result = await getProductByLegacyId(line.legacyId, cart.locale)
    if (!result.ok) continue
    const mapped = mergeLegacyExtras(result.data)
    products.push({
      ...mapped,
      price: line.unitPrice,
    })
  }

  return products
}