import 'server-only'

import { isCaptchaEnabled } from '@/lib/captcha/shared'

interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
}

export async function verifyTurnstileToken(
  token: string | null | undefined
): Promise<{ success: boolean }> {
  if (!isCaptchaEnabled()) {
    return { success: true }
  }

  if (!token) {
    return { success: false }
  }

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return { success: false }
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    })

    if (!response.ok) {
      return { success: false }
    }

    const data = (await response.json()) as TurnstileVerifyResponse
    return { success: data.success === true }
  } catch {
    return { success: false }
  }
}