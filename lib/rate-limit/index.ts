import 'server-only'

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

import { getClientIp } from '@/lib/rate-limit/identify'
import { checkMemoryRateLimit } from '@/lib/rate-limit/memory'

export interface RateLimitConfig {
  /** Unique scope, e.g. `api:chat` */
  namespace: string
  /** Max requests per window */
  limit: number
  /** Window length in seconds */
  windowSec: number
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export function isUpstashRateLimitConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  )
}

export function isRateLimitDisabled(): boolean {
  return process.env.RATE_LIMIT_ENABLED === 'false'
}

const upstashLimiters = new Map<string, Ratelimit>()

function getUpstashLimiter(config: RateLimitConfig): Ratelimit {
  const cacheKey = `${config.namespace}:${config.limit}:${config.windowSec}`
  const existing = upstashLimiters.get(cacheKey)
  if (existing) return existing

  const redis = Redis.fromEnv()
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.limit, `${config.windowSec} s`),
    prefix: `pharm:${config.namespace}`,
    analytics: true,
  })

  upstashLimiters.set(cacheKey, limiter)
  return limiter
}

export async function checkRateLimit(
  request: Request,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  if (isRateLimitDisabled()) {
    const reset = Date.now() + config.windowSec * 1000
    return { success: true, limit: config.limit, remaining: config.limit, reset }
  }

  const ip = getClientIp(request)
  const key = `${config.namespace}:${ip}`

  if (isUpstashRateLimitConfigured()) {
    const limiter = getUpstashLimiter(config)
    const result = await limiter.limit(key)
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    }
  }

  const result = checkMemoryRateLimit(key, config.limit, config.windowSec * 1000)
  return result
}

export function rateLimitExceededResponse(result: RateLimitResult): Response {
  const retryAfterSec = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))

  return Response.json(
    { error: 'Too many requests', code: 'rate_limit_exceeded' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSec),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset),
      },
    }
  )
}

export async function enforceRateLimit(
  request: Request,
  config: RateLimitConfig
): Promise<Response | null> {
  const result = await checkRateLimit(request, config)
  if (!result.success) {
    return rateLimitExceededResponse(result)
  }
  return null
}

/** Presets for public API routes (Phase 1 task 17) */
export const API_RATE_LIMITS = {
  chat: { namespace: 'api:chat', limit: 20, windowSec: 60 },
  recommendations: { namespace: 'api:recommendations', limit: 10, windowSec: 60 },
  storefront: { namespace: 'api:storefront', limit: 60, windowSec: 60 },
} as const satisfies Record<string, RateLimitConfig>