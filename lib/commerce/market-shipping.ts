import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { moneyFromDb, type Money } from '@/lib/money'
import type { MarketCode } from './markets-config'
import {
  commerceDatabase,
  commerceFail,
  commerceOk,
  commerceValidation,
  type CommerceResult,
} from './errors'
import {
  findShippingMethodByCost,
  type ShippingMethodCost,
} from './market-shipping-core'

export type MarketShippingMethod = ShippingMethodCost
export { findShippingMethodByCost } from './market-shipping-core'

export async function listShippingMethodsForMarket(
  marketCode: MarketCode
): Promise<CommerceResult<MarketShippingMethod[]>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('market_shipping_methods')
    .select('code, carrier, name, cost_cents, currency, supports_parcel_locker, markets!inner ( code )')
    .eq('markets.code', marketCode)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    return commerceFail(commerceDatabase('Failed to list market shipping methods', error))
  }

  return commerceOk(
    (data ?? []).map((row) => ({
      code: row.code,
      carrier: row.carrier,
      name: row.name,
      cost: moneyFromDb(row.cost_cents, 'EUR'),
      supportsParcelLocker: row.supports_parcel_locker,
    }))
  )
}

export async function validateShippingForMarket(
  cost: Money,
  marketCode: MarketCode
): Promise<CommerceResult<MarketShippingMethod>> {
  const methodsResult = await listShippingMethodsForMarket(marketCode)
  if (!methodsResult.ok) {
    return methodsResult
  }

  const match = findShippingMethodByCost(methodsResult.data, cost)
  if (!match) {
    return commerceFail(
      commerceValidation(`Shipping cost not allowed for market ${marketCode}`)
    )
  }

  return commerceOk(match)
}