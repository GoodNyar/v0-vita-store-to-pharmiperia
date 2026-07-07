import { updateSession } from "@/lib/supabase/proxy"
import { LEGACY_PRODUCT_ID_REDIRECTS } from "@/lib/commerce/redirects"
import {
  MARKET_COOKIE_NAME,
  MARKET_HEADER_NAME,
  geoCountryFromHeaders,
  resolveMarket,
} from "@/lib/commerce/resolve-market"
import { isMarketCode } from "@/lib/commerce/markets-config"
import {
  DEFAULT_LOCALE,
  type Locale,
  isLocale,
} from "@/lib/i18n/config"
import { localizedPath, stripLocalePrefix } from "@/lib/i18n/routes"
import { applyLaunchRobotsHeaders, maybeLaunchLockdown } from "@/lib/launch/middleware"
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

const SESSION_REFRESH_PREFIXES = [
  "/account",
  "/admin",
  "/api",
  "/auth",
  "/checkout",
  "/protected",
]

function applyMarketCookie(request: NextRequest, response: NextResponse): NextResponse {
  const resolved = resolveMarket({
    cookieMarket: request.cookies.get(MARKET_COOKIE_NAME)?.value,
    headerMarket: request.headers.get(MARKET_HEADER_NAME),
    geoCountryIso: geoCountryFromHeaders(request.headers),
  })

  const existing = request.cookies.get(MARKET_COOKIE_NAME)?.value
  if (!isMarketCode(existing) || (resolved.source === "geo" && resolved.code !== existing)) {
    response.cookies.set(MARKET_COOKIE_NAME, resolved.code, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    })
  }

  return response
}

function pathnameNeedsSessionRefresh(pathname: string): boolean {
  if (shouldSkipLocale(pathname)) {
    return true
  }
  const { path } = stripLocalePrefix(pathname)
  return SESSION_REFRESH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  )
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

  const lockdownResponse = await maybeLaunchLockdown(request)
  if (lockdownResponse) {
    return applyMarketCookie(request, applyLaunchRobotsHeaders(lockdownResponse))
  }

  if (shouldSkipLocale(pathname)) {
    return applyLaunchRobotsHeaders(
      applyMarketCookie(request, await updateSession(request))
    )
  }

  const legacyRedirect = legacyProductRedirect(request, pathname)
  if (legacyRedirect) {
    return applyLaunchRobotsHeaders(legacyRedirect)
  }

  if (pathname === "/") {
    const locale = detectLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}`
    return applyLaunchRobotsHeaders(
      applyMarketCookie(request, redirectWithLocaleCookie(url, locale, 307))
    )
  }

  const firstSegment = pathname.split("/")[1]
  if (!isLocale(firstSegment)) {
    const locale = detectLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = localizedPath(locale, pathname)
    return applyLaunchRobotsHeaders(
      applyMarketCookie(request, redirectWithLocaleCookie(url, locale, 307))
    )
  }

  const response = pathnameNeedsSessionRefresh(pathname)
    ? await updateSession(request)
    : NextResponse.next()
  response.cookies.set("preferredLang", firstSegment as Locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  })
  return applyLaunchRobotsHeaders(applyMarketCookie(request, response))
}

export const config = {
  matcher: [
    "/((?!monitoring|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}