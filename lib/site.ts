/**
 * Site URL and email configuration — single switch for production domain (pharm.lv).
 * No hardcoded production hostnames; set NEXT_PUBLIC_SITE_URL in deployment env.
 */

const DEV_SITE_URL = 'http://localhost:3000'

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, '')
}

/** Public site origin, e.g. https://pharm.lv */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (process.env.NODE_ENV === 'development' ? DEV_SITE_URL : '')

  if (!raw) {
    throw new Error('NEXT_PUBLIC_SITE_URL (or SITE_URL) must be set')
  }

  return normalizeSiteUrl(raw)
}

/** Hostname without port, e.g. pharm.lv */
export function getSiteHost(): string {
  return new URL(getSiteUrl()).hostname
}

export function getSupportEmail(): string {
  return (
    process.env.SUPPORT_EMAIL ??
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ??
    `support@${getSiteHost()}`
  )
}

export function getInfoEmail(): string {
  return (
    process.env.INFO_EMAIL ??
    process.env.NEXT_PUBLIC_INFO_EMAIL ??
    `info@${getSiteHost()}`
  )
}

export function getOrdersEmail(): string {
  return (
    process.env.ORDERS_EMAIL ??
    process.env.NEXT_PUBLIC_ORDERS_EMAIL ??
    `orders@${getSiteHost()}`
  )
}

/** Bare address for Supabase SMTP admin_email, e.g. noreply@pharm.lv */
export function getAuthEmailAddress(): string {
  const configured =
    process.env.AUTH_EMAIL_ADDRESS ??
    process.env.AUTH_EMAIL_FROM ??
    process.env.NEXT_PUBLIC_AUTH_EMAIL_ADDRESS

  if (!configured) {
    return `noreply@${getSiteHost()}`
  }

  const wrapped = configured.match(/<([^>]+)>/)
  return wrapped ? wrapped[1] : configured
}

export function getAuthEmailFrom(): string {
  const from = process.env.AUTH_EMAIL_FROM
  if (from) return from
  return `Pharmiperia <${getAuthEmailAddress()}>`
}

export function getTransactionalEmailFrom(): string {
  return process.env.EMAIL_FROM ?? `Pharmiperia <${getOrdersEmail()}>`
}

/** Interpolate {siteUrl}, {siteHost}, {supportEmail}, … in UI copy. */
export function getSitePlaceholderVars(): Record<string, string> {
  return {
    siteUrl: getSiteUrl(),
    siteHost: getSiteHost(),
    supportEmail: getSupportEmail(),
    infoEmail: getInfoEmail(),
    ordersEmail: getOrdersEmail(),
  }
}

export function applySitePlaceholders(text: string): string {
  const vars = getSitePlaceholderVars()
  let result = text
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{${key}}`, value)
  }
  return result
}