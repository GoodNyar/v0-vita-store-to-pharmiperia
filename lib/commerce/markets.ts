import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import {
  MARKET_DEFINITIONS,
  type MarketCode,
  type MarketDefinition,
} from './markets-config'
import { commerceDatabase, commerceFail, commerceOk, type CommerceResult } from './errors'

export type { MarketCode, MarketDefinition }
export {
  MARKET_CODES,
  DEFAULT_MARKET_CODE,
  MARKET_DEFINITIONS,
  getMarketDefinition,
  isMarketCode,
} from './markets-config'
export {
  resolveMarket,
  geoCountryFromHeaders,
  MARKET_COOKIE_NAME,
  MARKET_HEADER_NAME,
  type ResolvedMarket,
} from './resolve-market'

export async function listActiveMarkets(): Promise<CommerceResult<MarketDefinition[]>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('markets')
    .select('code, country_iso, name, default_locale, locales, currency, vat_rate_bps, oss_enabled, legal_entity_name')
    .eq('is_active', true)
    .order('code', { ascending: true })

  if (error) {
    return commerceFail(commerceDatabase('Failed to list markets', error))
  }

  if (!data?.length) {
    return commerceOk([...MARKET_DEFINITIONS])
  }

  return commerceOk(
    data.map((row) => ({
      code: row.code as MarketCode,
      countryIso: row.country_iso,
      name: row.name,
      defaultLocale: row.default_locale,
      locales: row.locales,
      currency: 'EUR' as const,
      vatRateBps: row.vat_rate_bps,
      ossEnabled: row.oss_enabled,
      legalEntityName: row.legal_entity_name ?? 'Pharmiperia SIA',
    }))
  )
}