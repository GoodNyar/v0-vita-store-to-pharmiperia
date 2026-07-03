import 'server-only'

export const DEFAULT_EMAIL_FROM = 'Pharmiperia <orders@pharmiperia.lv>'
export const SUPPORT_EMAIL = 'support@pharmiperia.lv'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pharmiperia.lv'

export function getEmailFrom(): string {
  return process.env.EMAIL_FROM ?? DEFAULT_EMAIL_FROM
}

export function isOrderEmailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY) && process.env.EMAIL_ENABLED !== 'false'
}