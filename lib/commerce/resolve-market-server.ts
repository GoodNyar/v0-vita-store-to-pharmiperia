import 'server-only'

import { cookies, headers } from 'next/headers'

import {
  MARKET_COOKIE_NAME,
  MARKET_HEADER_NAME,
  geoCountryFromHeaders,
  resolveMarket,
  type ResolvedMarket,
} from './resolve-market'

/** Resolve market for the current request (same priority as middleware). */
export async function resolveMarketFromCookies(): Promise<ResolvedMarket> {
  const cookieStore = await cookies()
  const headerStore = await headers()

  return resolveMarket({
    cookieMarket: cookieStore.get(MARKET_COOKIE_NAME)?.value,
    headerMarket: headerStore.get(MARKET_HEADER_NAME),
    geoCountryIso: geoCountryFromHeaders(headerStore),
  })
}