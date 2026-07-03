import 'server-only'

import { Redis } from '@upstash/redis'

import { getAiDailyRequestCap } from '@/lib/features/ai'
import { isUpstashRateLimitConfigured } from '@/lib/rate-limit'

const memoryCounts = new Map<string, number>()

function budgetDayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function isAiBudgetEnabled(): boolean {
  return process.env.AI_BUDGET_ENABLED !== 'false'
}

export async function consumeAiRequestBudget(): Promise<{
  allowed: boolean
  remaining: number
}> {
  if (!isAiBudgetEnabled()) {
    const cap = getAiDailyRequestCap()
    return { allowed: true, remaining: cap }
  }

  const cap = getAiDailyRequestCap()
  const key = `ai:budget:${budgetDayKey()}`

  if (isUpstashRateLimitConfigured()) {
    const redis = Redis.fromEnv()
    const count = await redis.incr(key)

    if (count === 1) {
      await redis.expire(key, 60 * 60 * 48)
    }

    if (count > cap) {
      await redis.decr(key)
      return { allowed: false, remaining: 0 }
    }

    return { allowed: true, remaining: Math.max(0, cap - count) }
  }

  const count = (memoryCounts.get(key) ?? 0) + 1
  if (count > cap) {
    return { allowed: false, remaining: 0 }
  }

  memoryCounts.set(key, count)
  return { allowed: true, remaining: Math.max(0, cap - count) }
}