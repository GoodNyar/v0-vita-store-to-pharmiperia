'use client'

import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { hasAnalyticsConsent } from '@/lib/consent/storage'

export function ConsentGatedAnalytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(hasAnalyticsConsent())

    const onConsentUpdate = () => {
      setEnabled(hasAnalyticsConsent())
    }

    window.addEventListener('pharm:consent-updated', onConsentUpdate)
    return () => window.removeEventListener('pharm:consent-updated', onConsentUpdate)
  }, [])

  if (!enabled) return null

  return <Analytics />
}