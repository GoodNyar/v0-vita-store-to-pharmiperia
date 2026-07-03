import 'server-only'

import {
  getSiteUrl,
  getSupportEmail,
  getTransactionalEmailFrom,
} from '@/lib/site'

export { getSiteUrl, getSupportEmail }

export function getEmailFrom(): string {
  return getTransactionalEmailFrom()
}

export function isOrderEmailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY) && process.env.EMAIL_ENABLED !== 'false'
}