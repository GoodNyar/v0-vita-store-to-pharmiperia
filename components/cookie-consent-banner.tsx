'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/i18n'
import { createConsent } from '@/lib/consent/types'
import { readConsent, writeConsent } from '@/lib/consent/storage'
import { Button } from '@/components/ui/button'

function needsConsentBanner() {
  return readConsent() == null
}

function subscribeConsent(onStoreChange: () => void) {
  window.addEventListener('pharm:consent-updated', onStoreChange)
  return () => window.removeEventListener('pharm:consent-updated', onStoreChange)
}

export function CookieConsentBanner() {
  const { t, localizedPath } = useLang()
  const [dismissed, setDismissed] = useState(false)
  const needsBanner = useSyncExternalStore(
    subscribeConsent,
    needsConsentBanner,
    () => false
  )
  const visible = needsBanner && !dismissed

  const save = (analytics: boolean) => {
    writeConsent(createConsent(analytics))
    setDismissed(true)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/95 p-4 shadow-lg backdrop-blur sm:p-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 id="cookie-consent-title" className="text-base font-semibold text-foreground">
            {t('cookieBannerTitle')}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t('cookieBannerDescription')}{' '}
            <Link href={localizedPath('/cookies')} className="text-primary hover:underline">
              {t('cookieBannerPolicyLink')}
            </Link>
            {' · '}
            <Link href={localizedPath('/privacy')} className="text-primary hover:underline">
              {t('footerPrivacy')}
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
          <Button variant="outline" onClick={() => save(false)}>
            {t('cookieBannerNecessaryOnly')}
          </Button>
          <Button onClick={() => save(true)}>{t('cookieBannerAcceptAll')}</Button>
        </div>
      </div>
    </div>
  )
}