import { enforceRateLimit, API_RATE_LIMITS } from '@/lib/rate-limit'
import {
  listStorefrontParcelStations,
  requireStorefrontMarket,
} from '@/lib/commerce/storefront'
import type { ParcelCarrier } from '@/lib/commerce/carriers'
import {
  storefrontErrorResponse,
  storefrontJsonResponse,
} from '@/lib/commerce/storefront-http'

export const runtime = 'nodejs'

function parseCarrier(value: string | null): ParcelCarrier | undefined {
  if (value === 'omniva' || value === 'dpd') return value
  return undefined
}

export async function GET(request: Request) {
  const rateLimited = await enforceRateLimit(request, API_RATE_LIMITS.storefront)
  if (rateLimited) return rateLimited

  const url = new URL(request.url)
  const marketResult = requireStorefrontMarket(url.searchParams.get('market'))
  if (!marketResult.ok) {
    return storefrontErrorResponse(marketResult.error)
  }

  const carrier = parseCarrier(url.searchParams.get('carrier'))
  const result = await listStorefrontParcelStations(marketResult.data, carrier)
  if (!result.ok) {
    return storefrontErrorResponse(result.error)
  }

  return storefrontJsonResponse({
    market: marketResult.data,
    stations: result.data,
  })
}