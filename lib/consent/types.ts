export const CONSENT_VERSION = 1
export const CONSENT_COOKIE_NAME = 'pharm_consent'
export const CONSENT_STORAGE_KEY = 'pharm_consent'

export interface CookieConsent {
  version: number
  necessary: true
  analytics: boolean
  recordedAt: string
}

export function createConsent(analytics: boolean): CookieConsent {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics,
    recordedAt: new Date().toISOString(),
  }
}