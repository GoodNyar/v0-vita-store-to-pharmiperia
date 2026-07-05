import { enforceRateLimit, API_RATE_LIMITS } from '@/lib/rate-limit'
import {
  listStorefrontProducts,
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

  const locale = url.searchParams.get('locale') ?? undefined
  const limitParam = url.searchParams.get('limit')
  const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined

  const result = await listStorefrontProducts({
    market: marketResult.data,
    locale,
    limit: Number.isFinite(limit) ? limit : undefined,
  })

  if (!result.ok) {
    return storefrontErrorResponse(result.error)
  }

  return storefrontJsonResponse({
    market: marketResult.data,
    products: result.data,
  })
}