import type { NextRequest } from 'next/server'
import { stripLocalePrefix } from '@/lib/i18n/routes'

/** Cookie set after a valid bypass (secret URL, API, or admin session). */
export const LAUNCH_BYPASS_COOKIE = 'pharm_launch_bypass'

const BYPASS_HMAC_SALT = 'pharm-lv-launch-v1'
const textEncoder = new TextEncoder()

function parseEnvFlag(value: string | undefined): boolean | null {
  if (value == null || value === '') return null
  if (value === 'false' || value === '0') return false
  if (value === 'true' || value === '1') return true
  return null
}

/**
 * Launch lockdown switch.
 * - `MAINTENANCE_MODE=false` → open store (Go-Live)
 * - `MAINTENANCE_MODE=true` → closed
 * - unset in production → **closed by default** (pre-GA safe default)
 * - unset in development → open (local dev convenience)
 */
export function isMaintenanceMode(): boolean {
  const primary = parseEnvFlag(process.env.MAINTENANCE_MODE)
  if (primary != null) return primary

  const legacy = parseEnvFlag(process.env.SITE_MAINTENANCE_MODE)
  if (legacy != null) return legacy

  if (process.env.NODE_ENV === 'production') {
    // Vercel preview deployments stay open unless explicitly locked.
    if (process.env.VERCEL_ENV === 'preview') return false
    return true
  }

  return false
}

export function getLaunchBypassSecret(): string | null {
  const secret = process.env.LAUNCH_BYPASS_SECRET?.trim()
  return secret ? secret : null
}

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, textEncoder.encode(message))
  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function hashLaunchBypassSecret(secret: string): Promise<string> {
  return hmacSha256Hex(BYPASS_HMAC_SALT, secret)
}

export async function isValidLaunchBypassCookie(
  value: string | undefined
): Promise<boolean> {
  const secret = getLaunchBypassSecret()
  if (!secret || !value) return false
  const expected = await hashLaunchBypassSecret(secret)
  return timingSafeEqualString(value, expected)
}

export function isLaunchBypassQueryToken(token: string | null): boolean {
  const secret = getLaunchBypassSecret()
  if (!secret || !token) return false
  return timingSafeEqualString(token, secret)
}

function parseBypassIps(): string[] {
  const raw = process.env.LAUNCH_BYPASS_IPS?.trim()
  if (!raw) return []
  return raw.split(',').map((ip) => ip.trim()).filter(Boolean)
}

export function isLaunchBypassIp(request: NextRequest): boolean {
  const allowed = parseBypassIps()
  if (allowed.length === 0) return false

  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = request.headers.get('x-real-ip')?.trim()
  const candidate = forwarded ?? realIp
  return candidate != null && allowed.includes(candidate)
}

const EXEMPT_PREFIXES = [
  '/api',
  '/admin',
  '/auth/callback',
  '/launch/coming-soon',
  '/monitoring',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/sitemap/',
] as const

const EXEMPT_LOCALE_PATHS = ['/auth'] as const

/** Paths that must keep working during lockdown (webhooks, admin, auth, SEO endpoints). */
export function isLaunchExemptPath(pathname: string): boolean {
  if (EXEMPT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix))) {
    return true
  }

  const { path } = stripLocalePrefix(pathname)
  return EXEMPT_LOCALE_PATHS.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  )
}

export function launchRobotsNoIndex(): boolean {
  return isMaintenanceMode()
}

export const LAUNCH_ROBOTS_HEADER = 'noindex, nofollow, noarchive, nosnippet'