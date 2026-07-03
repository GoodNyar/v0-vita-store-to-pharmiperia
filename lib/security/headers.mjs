/** Baseline security headers for Next.js (PR-29). */

const STRIPE_ORIGINS =
  'https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com'
const SUPABASE_ORIGIN = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://*.supabase.co'

export function buildContentSecurityPolicy() {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${STRIPE_ORIGINS} https://www.googletagmanager.com https://www.google-analytics.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data:",
    `connect-src 'self' ${STRIPE_ORIGINS} ${SUPABASE_ORIGIN} https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://vitals.vercel-insights.com`,
    `frame-src 'self' ${STRIPE_ORIGINS}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ]
  return directives.join('; ')
}

export const BASELINE_SECURITY_HEADERS = {
  'Content-Security-Policy': buildContentSecurityPolicy(),
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}