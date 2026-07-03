export function isCaptchaEnabled(): boolean {
  return (
    process.env.CAPTCHA_ENABLED !== 'false' &&
    Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY)
  )
}

export function getTurnstileSiteKey(): string | undefined {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
}