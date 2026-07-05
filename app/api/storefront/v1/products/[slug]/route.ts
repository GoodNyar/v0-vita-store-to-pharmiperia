import { enforceRateLimit, API_RATE_LIMITS } from '@/lib/rate-limit'
import {
  getStorefrontProductBySlug,
  requireStorefrontMarket,
} from '@/lib/commerce/storefront'
import {
  storefrontErrorResponse,
  storefrontJsonResponse,
} from '@/lib/commerce/storefront-http'

export const runtime = 'nodejs'

interface RouteContext {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, context: RouteContext) {
  const rateLimited = await enforceRateLimit(request, API_RATE_LIMITS.storefront)
  if (rateLimited) return rateLimited

  const { slug } = await context.params
  const url = new URL(request.url)
  const marketResult = requireStorefrontMarket(url.searchParams.get('market'))
  if (!marketResult.ok) {
    return storefrontErrorResponse(marketResult.error)
  }

  const locale = url.searchParams.get('locale') ?? undefined
  const result = await getStorefrontProductBySlug(slug, marketResult.data, locale)

  if (!result.ok) {
    return storefrontErrorResponse(result.error)
  }

  return storefrontJsonResponse({ product: result.data })
}