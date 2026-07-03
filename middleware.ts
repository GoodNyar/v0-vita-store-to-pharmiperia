import { updateSession } from "@/lib/supabase/proxy"
import { LEGACY_PRODUCT_ID_REDIRECTS } from "@/lib/commerce/redirects"
import {
  DEFAULT_LOCALE,
  type Locale,
  isLocale,
} from "@/lib/i18n/config"
import { localizedPath } from "@/lib/i18n/routes"
import { type NextRequest, NextResponse } from "next/server"

const SKIP_LOCALE_PREFIXES = [
  "/admin",
  "/api",
  "/auth/callback",
  "/monitoring",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]

function shouldSkipLocale(pathname: string): boolean {
  return SKIP_LOCALE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("preferredLang")?.value
  if (cookie && isLocale(cookie)) return cookie

  const accept = request.headers.get("accept-language") ?? ""
  if (accept.toLowerCase().includes("ru")) return "ru"
  return DEFAULT_LOCALE
}

function redirectWithLocaleCookie(
  url: URL,
  locale: Locale,
  status: 301 | 307
): NextResponse {
  const response = NextResponse.redirect(url, status)
  response.cookies.set("preferredLang", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  })
  return response
}

function legacyProductRedirect(
  request: NextRequest,
  pathname: string
): NextResponse | null {
  const withLocale = pathname.match(/^\/(lv|ru)\/products\/(\d+)$/)
  const withoutLocale = pathname.match(/^\/products\/(\d+)$/)

  if (!withLocale && !withoutLocale) return null

  const locale = (withLocale?.[1] as Locale | undefined) ?? detectLocale(request)
  const legacyId = withLocale?.[2] ?? withoutLocale?.[1]
  if (!legacyId) return null

  const slug = LEGACY_PRODUCT_ID_REDIRECTS[legacyId]
  if (!slug) return null

  const url = request.nextUrl.clone()
  url.pathname = localizedPath(locale, `/products/${slug}`)
  return redirectWithLocaleCookie(url, locale, 301)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (shouldSkipLocale(pathname)) {
    return await updateSession(request)
  }

  const legacyRedirect = legacyProductRedirect(request, pathname)
  if (legacyRedirect) return legacyRedirect

  if (pathname === "/") {
    const locale = detectLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}`
    return redirectWithLocaleCookie(url, locale, 307)
  }

  const firstSegment = pathname.split("/")[1]
  if (!isLocale(firstSegment)) {
    const locale = detectLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = localizedPath(locale, pathname)
    return redirectWithLocaleCookie(url, locale, 307)
  }

  const response = await updateSession(request)
  response.cookies.set("preferredLang", firstSegment as Locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  })
  return response
}

export const config = {
  matcher: [
    "/((?!monitoring|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}