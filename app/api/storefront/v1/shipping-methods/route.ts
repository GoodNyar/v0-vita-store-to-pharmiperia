import { enforceRateLimit, API_RATE_LIMITS } from '@/lib/rate-limit'
import {
  listStorefrontShipping,
  requireStorefrontMarket,
} from '@/lib/commerce/storefront'
import {
  storefrontErrorResponse,
  storefrontJsonResponse,
} from '@/lib/commerce/storefront-http'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const rateLimited = await enforceRateLimit(request, API_RATE_LIMITS.storefront)
  if (rateLimited) return rateLimited

  const url = new URL(request.url)
  const marketResult = requireStorefrontMarket(url.searchParams.get('market'))
  if (!marketResult.ok) {
    return storefrontErrorResponse(marketResult.error)
  }

  const result = await listStorefrontShipping(marketResult.data)
  if (!result.ok) {
    return storefrontErrorResponse(result.error)
  }

  return storefrontJsonResponse({
    market: marketResult.data,
    methods: result.data,
  })
}