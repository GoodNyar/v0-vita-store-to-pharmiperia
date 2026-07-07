import { NextResponse, type NextRequest } from 'next/server'
import { hasAdminBypassInMiddleware } from '@/lib/launch/bypass-middleware'
import {
  getLaunchBypassSecret,
  hashLaunchBypassSecret,
  isLaunchBypassIp,
  isLaunchBypassQueryToken,
  isLaunchExemptPath,
  isMaintenanceMode,
  isValidLaunchBypassCookie,
  LAUNCH_BYPASS_COOKIE,
  LAUNCH_ROBOTS_HEADER,
} from '@/lib/launch/lockdown'

function bypassCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  }
}

export function applyLaunchRobotsHeaders(response: NextResponse): NextResponse {
  if (isMaintenanceMode()) {
    response.headers.set('X-Robots-Tag', LAUNCH_ROBOTS_HEADER)
  }
  return response
}

async function setBypassCookie(response: NextResponse): Promise<void> {
  const secret = getLaunchBypassSecret()
  if (!secret) return
  response.cookies.set(
    LAUNCH_BYPASS_COOKIE,
    await hashLaunchBypassSecret(secret),
    bypassCookieOptions()
  )
}

async function hasLaunchBypass(request: NextRequest): Promise<boolean> {
  if (isLaunchBypassIp(request)) return true

  const cookie = request.cookies.get(LAUNCH_BYPASS_COOKIE)?.value
  if (await isValidLaunchBypassCookie(cookie)) return true

  const queryToken =
    request.nextUrl.searchParams.get('launch_bypass') ??
    request.nextUrl.searchParams.get('token')

  if (isLaunchBypassQueryToken(queryToken)) return true

  return hasAdminBypassInMiddleware(request)
}

export async function maybeLaunchLockdown(
  request: NextRequest
): Promise<NextResponse | null> {
  if (!isMaintenanceMode()) return null

  const { pathname } = request.nextUrl
  if (isLaunchExemptPath(pathname)) return null

  const bypass = await hasLaunchBypass(request)
  if (bypass) {
    const queryToken =
      request.nextUrl.searchParams.get('launch_bypass') ??
      request.nextUrl.searchParams.get('token')

    if (isLaunchBypassQueryToken(queryToken)) {
      const url = request.nextUrl.clone()
      url.searchParams.delete('launch_bypass')
      url.searchParams.delete('token')
      const response = NextResponse.redirect(url)
      await setBypassCookie(response)
      return applyLaunchRobotsHeaders(response)
    }

    return null
  }

  const url = request.nextUrl.clone()
  url.pathname = '/launch/coming-soon'
  return applyLaunchRobotsHeaders(NextResponse.rewrite(url))
}