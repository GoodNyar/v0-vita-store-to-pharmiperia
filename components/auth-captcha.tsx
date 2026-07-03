'use client'

import { TurnstileWidget } from '@/components/turnstile-widget'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

interface AuthCaptchaProps {
  onToken: (token: string | null) => void
  resetKey?: number
}

export function AuthCaptcha({ onToken, resetKey = 0 }: AuthCaptchaProps) {
  if (!SITE_KEY) return null

  return (
    <div className="mb-4">
      <TurnstileWidget
        key={resetKey}
        siteKey={SITE_KEY}
        onToken={onToken}
      />
    </div>
  )
}

export function isAuthCaptchaRequired(): boolean {
  return Boolean(SITE_KEY)
}