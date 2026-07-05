import 'server-only'

import type { Money } from '@/lib/money'
import { eur } from '@/lib/money'
import type { MarketCode } from './markets-config'
import { listShippingMethodsForMarket } from './market-shipping'

export interface CheckoutShippingOption {
  id: string
  name: string
  price: Money
  days: string
  supportsParcelLocker: boolean
}

const SHIPPING_DAYS: Record<string, string> = {
  omniva: '1-2',
  dpd: '1-2',
  venipak: '2-3',
  smartpost: '2-3',
  courier: '1-2',
}

/** Fallback mirrors migration seed when DB is unavailable. */
const FALLBACK_SHIPPING: CheckoutShippingOption[] = [
  { id: 'omniva', name: 'Omniva pakomāts', price: eur(350), days: '1-2', supportsParcelLocker: true },
  { id: 'dpd', name: 'DPD Pickup', price: eur(320), days: '1-2', supportsParcelLocker: true },
  { id: 'venipak', name: 'Venipak pakomāts', price: eur(295), days: '2-3', supportsParcelLocker: true },
  { id: 'smartpost', name: 'Smartpost / Itella', price: eur(299), days: '2-3', supportsParcelLocker: true },
  { id: 'courier', name: 'Kurjers', price: eur(599), days: '1-2', supportsParcelLocker: false },
]

export async function getCheckoutShippingOptions(
  marketCode: MarketCode
): Promise<CheckoutShippingOption[]> {
  const result = await listShippingMethodsForMarket(marketCode)
  if (!result.ok || result.data.length === 0) {
    return FALLBACK_SHIPPING
  }

  return result.data.map((method) => ({
    id: method.code,
    name: method.name,
    price: method.cost,
    days: SHIPPING_DAYS[method.code] ?? '1-2',
    supportsParcelLocker: method.supportsParcelLocker,
  }))
}