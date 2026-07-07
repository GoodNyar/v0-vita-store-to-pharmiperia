import { NextResponse, type NextRequest } from 'next/server'
import {
  getLaunchBypassSecret,
  hashLaunchBypassSecret,
  isLaunchBypassQueryToken,
  LAUNCH_BYPASS_COOKIE,
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

/** Set preview cookie when `?token=` matches LAUNCH_BYPASS_SECRET, then redirect home. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!isLaunchBypassQueryToken(token)) {
    return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 })
  }

  const secret = getLaunchBypassSecret()
  if (!secret) {
    return NextResponse.json({ error: 'Bypass not configured' }, { status: 503 })
  }

  const redirectTo = request.nextUrl.searchParams.get('redirect') ?? '/lv'
  const url = new URL(redirectTo, request.url)
  const response = NextResponse.redirect(url)
  response.cookies.set(
    LAUNCH_BYPASS_COOKIE,
    await hashLaunchBypassSecret(secret),
    bypassCookieOptions()
  )
  return response
}