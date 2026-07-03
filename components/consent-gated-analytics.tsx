'use client'

import { useSyncExternalStore } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { hasAnalyticsConsent } from '@/lib/consent/storage'

function subscribeConsent(onStoreChange: () => void) {
  window.addEventListener('pharm:consent-updated', onStoreChange)
  return () => window.removeEventListener('pharm:consent-updated', onStoreChange)
}

export function ConsentGatedAnalytics() {
  const enabled = useSyncExternalStore(
    subscribeConsent,
    hasAnalyticsConsent,
    () => false
  )

  if (!enabled) return null

  return <Analytics />
}