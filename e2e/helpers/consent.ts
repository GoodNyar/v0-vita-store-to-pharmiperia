import type { Page } from '@playwright/test'

const CONSENT_COOKIE_NAME = 'pharm_consent'
const CONSENT_STORAGE_KEY = 'pharm_consent'

function buildConsentPayload(analytics = false): string {
  return JSON.stringify({
    version: 1,
    necessary: true,
    analytics,
    recordedAt: new Date().toISOString(),
  })
}

/** Pre-seed GDPR consent so the banner does not block checkout interactions. */
export async function seedCookieConsent(page: Page): Promise<void> {
  const payload = buildConsentPayload(false)
  await page.addInitScript(
    ({ storageKey, cookieName, consentJson }) => {
      localStorage.setItem(storageKey, consentJson)
      document.cookie = `${cookieName}=${encodeURIComponent(consentJson)};path=/;max-age=31536000;SameSite=Lax`
    },
    {
      storageKey: CONSENT_STORAGE_KEY,
      cookieName: CONSENT_COOKIE_NAME,
      consentJson: payload,
    }
  )
}

/** Fallback when init script was not applied before first navigation. */
export async function dismissCookieBannerIfVisible(page: Page): Promise<void> {
  const necessaryOnly = page.getByRole('button', { name: 'Tikai nepieciešamās' })
  if (await necessaryOnly.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await necessaryOnly.click()
  }
}