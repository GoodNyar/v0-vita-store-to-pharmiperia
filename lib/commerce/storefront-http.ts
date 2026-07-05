import type { CommerceError } from './errors'
import { STOREFRONT_API_VERSION } from './storefront'

const VERSION_HEADER = 'X-Pharmiperia-Api-Version'

export function storefrontJsonResponse<T>(
  body: T,
  init?: ResponseInit
): Response {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  headers.set(VERSION_HEADER, STOREFRONT_API_VERSION)
  headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

  return Response.json(body, {
    ...init,
    headers,
  })
}

export function storefrontErrorResponse(error: CommerceError): Response {
  const status =
    error.code === 'not_found' ? 404 : error.code === 'validation' ? 400 : 500

  return storefrontJsonResponse(
    { error: error.message, code: error.code },
    { status }
  )
}