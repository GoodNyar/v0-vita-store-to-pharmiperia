import {
  DEFAULT_MARKET_CODE,
  type MarketCode,
  getMarketDefinition,
  isMarketCode,
  marketCodeFromCountryIso,
} from './markets-config'

export const MARKET_COOKIE_NAME = 'pharm_market'
export const MARKET_HEADER_NAME = 'x-pharmiperia-market'

export interface MarketResolutionInput {
  cookieMarket?: string | null
  headerMarket?: string | null
  geoCountryIso?: string | null
}

export interface ResolvedMarket {
  code: MarketCode
  source: 'cookie' | 'header' | 'geo' | 'default'
  vatRateBps: number
  ossEnabled: boolean
}

/**
 * Resolve active market for a request.
 * Priority: explicit header → cookie → geo country → default (lv).
 */
export function resolveMarket(input: MarketResolutionInput): ResolvedMarket {
  if (isMarketCode(input.headerMarket)) {
    const def = getMarketDefinition(input.headerMarket)
    return {
      code: input.headerMarket,
      source: 'header',
      vatRateBps: def.vatRateBps,
      ossEnabled: def.ossEnabled,
    }
  }

  if (isMarketCode(input.cookieMarket)) {
    const def = getMarketDefinition(input.cookieMarket)
    return {
      code: input.cookieMarket,
      source: 'cookie',
      vatRateBps: def.vatRateBps,
      ossEnabled: def.ossEnabled,
    }
  }

  const geoMarket = marketCodeFromCountryIso(input.geoCountryIso)
  if (geoMarket) {
    const def = getMarketDefinition(geoMarket)
    return {
      code: geoMarket,
      source: 'geo',
      vatRateBps: def.vatRateBps,
      ossEnabled: def.ossEnabled,
    }
  }

  const def = getMarketDefinition(DEFAULT_MARKET_CODE)
  return {
    code: DEFAULT_MARKET_CODE,
    source: 'default',
    vatRateBps: def.vatRateBps,
    ossEnabled: def.ossEnabled,
  }
}

/** Extract geo country from common edge headers (Vercel / Cloudflare). */
export function geoCountryFromHeaders(headers: Headers): string | null {
  return (
    headers.get('x-vercel-ip-country') ??
    headers.get('cf-ipcountry') ??
    headers.get('x-country-code')
  )
}