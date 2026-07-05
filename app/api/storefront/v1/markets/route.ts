import { enforceRateLimit, API_RATE_LIMITS } from '@/lib/rate-limit'
import { listStorefrontMarkets } from '@/lib/commerce/storefront'
import {
  storefrontErrorResponse,
  storefrontJsonResponse,
} from '@/lib/commerce/storefront-http'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const rateLimited = await enforceRateLimit(request, API_RATE_LIMITS.storefront)
  if (rateLimited) return rateLimited

  const result = await listStorefrontMarkets()
  if (!result.ok) {
    return storefrontErrorResponse(result.error)
  }

  return storefrontJsonResponse({ markets: result.data })
}