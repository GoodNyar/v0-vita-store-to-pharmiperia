interface MemoryBucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, MemoryBucket>()

export interface MemoryRateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export function checkMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): MemoryRateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    const resetAt = now + windowMs
    buckets.set(key, { count: 1, resetAt })
    return { success: true, limit, remaining: limit - 1, reset: resetAt }
  }

  if (bucket.count >= limit) {
    return { success: false, limit, remaining: 0, reset: bucket.resetAt }
  }

  bucket.count += 1
  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    reset: bucket.resetAt,
  }
}