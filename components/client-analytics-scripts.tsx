'use client'

import { useEffect, useSyncExternalStore } from 'react'
import Script from 'next/script'
import { hasAnalyticsConsent } from '@/lib/consent/storage'
import { isAnalyticsEnabled, isClientAnalyticsConfigured } from '@/lib/analytics/client'

function subscribeConsent(onStoreChange: () => void) {
  window.addEventListener('pharm:consent-updated', onStoreChange)
  return () => window.removeEventListener('pharm:consent-updated', onStoreChange)
}

export function ClientAnalyticsScripts() {
  const consented = useSyncExternalStore(
    subscribeConsent,
    hasAnalyticsConsent,
    () => false
  )

  const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
  const enabled =
    consented && isAnalyticsEnabled() && isClientAnalyticsConfigured()

  useEffect(() => {
    if (!enabled || !ga4Id) return
    window.dataLayer = window.dataLayer ?? []
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args)
    }
    window.gtag('js', new Date())
    window.gtag('config', ga4Id, { send_page_view: false })
  }, [enabled, ga4Id])

  if (!enabled || !ga4Id) return null

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
      strategy="afterInteractive"
    />
  )
}