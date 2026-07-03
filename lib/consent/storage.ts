'use client'

import {
  CONSENT_COOKIE_NAME,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  type CookieConsent,
} from '@/lib/consent/types'

function parseConsent(raw: string | null | undefined): CookieConsent | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as CookieConsent
    if (parsed.version !== CONSENT_VERSION || parsed.necessary !== true) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeConsentCookie(consent: CookieConsent): void {
  const maxAge = 60 * 60 * 24 * 365
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(consent))};path=/;max-age=${maxAge};SameSite=Lax${secure ? ';Secure' : ''}`
}

export function readConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null

  const fromStorage = parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY))
  if (fromStorage) return fromStorage

  const cookieMatch = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`))

  if (!cookieMatch) return null

  const value = decodeURIComponent(cookieMatch.split('=').slice(1).join('='))
  const fromCookie = parseConsent(value)
  if (fromCookie) {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(fromCookie))
  }
  return fromCookie
}

export function writeConsent(consent: CookieConsent): void {
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent))
  writeConsentCookie(consent)
  window.dispatchEvent(new CustomEvent('pharm:consent-updated', { detail: consent }))
}

export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === true
}