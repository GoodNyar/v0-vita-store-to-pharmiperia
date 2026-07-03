import 'server-only'

import * as Sentry from '@sentry/nextjs'

import { isSentryEnabled } from '@/lib/sentry/shared'

const alertedKeys = new Set<string>()

function budgetDayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function crossedThreshold(count: number, cap: number): 50 | 80 | 100 | null {
  if (count > cap) return 100

  const at50 = Math.max(1, Math.ceil(cap * 0.5))
  const at80 = Math.max(1, Math.ceil(cap * 0.8))

  if (count === at50) return 50
  if (count === at80) return 80
  if (count === cap) return 100

  return null
}

export function alertAiBudgetUsage(count: number, cap: number): void {
  const threshold = crossedThreshold(count, cap)
  if (!threshold) return

  const dedupeKey = `ai-budget:${budgetDayKey()}:${threshold}`
  if (alertedKeys.has(dedupeKey)) return
  alertedKeys.add(dedupeKey)

  const payload = { service: 'openai', count, cap, threshold, day: budgetDayKey() }

  if (!isSentryEnabled('server')) {
    console.warn('[monitoring] AI budget threshold crossed', payload)
    return
  }

  Sentry.withScope((scope) => {
    scope.setTag('monitoring.budget', 'ai')
    scope.setTag('monitoring.threshold_pct', String(threshold))
    scope.setLevel(threshold === 100 ? 'error' : 'warning')
    scope.setContext('budget', payload)
    Sentry.captureMessage(
      count > cap
        ? `AI daily budget exceeded (${count}/${cap})`
        : `AI daily budget at ${threshold}% (${count}/${cap})`
    )
  })
}