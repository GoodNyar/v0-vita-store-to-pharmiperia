'use server'

import { z } from 'zod'

import { verifyTurnstileToken } from '@/lib/captcha/turnstile'
import { getSiteUrl } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'

const emailSchema = z.string().trim().email()
const passwordSchema = z.string().min(1)

export type AuthActionResult =
  | { success: true; needsEmailConfirmation?: boolean; email?: string }
  | { success: false; error: string; code?: 'captcha' | 'auth' | 'validation' }

export async function signInWithCaptcha(
  email: string,
  password: string,
  captchaToken: string | null
): Promise<AuthActionResult> {
  const parsedEmail = emailSchema.safeParse(email)
  const parsedPassword = passwordSchema.safeParse(password)
  if (!parsedEmail.success || !parsedPassword.success) {
    return { success: false, error: 'validation_failed', code: 'validation' }
  }

  const captcha = await verifyTurnstileToken(captchaToken)
  if (!captcha.success) {
    return { success: false, error: 'captcha_failed', code: 'captcha' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsedEmail.data,
    password: parsedPassword.data,
  })

  if (error) {
    const isInvalid =
      error.message === 'Invalid login credentials' ||
      error.message.toLowerCase().includes('invalid login')
    return {
      success: false,
      error: isInvalid ? 'invalid_credentials' : error.message,
      code: 'auth',
    }
  }

  return { success: true }
}

export async function signUpWithCaptcha(
  email: string,
  password: string,
  captchaToken: string | null
): Promise<AuthActionResult> {
  const parsedEmail = emailSchema.safeParse(email)
  const parsedPassword = passwordSchema.safeParse(password)
  if (!parsedEmail.success || !parsedPassword.success) {
    return { success: false, error: 'validation_failed', code: 'validation' }
  }

  if (parsedPassword.data.length < 6) {
    return { success: false, error: 'password_too_short', code: 'validation' }
  }

  const captcha = await verifyTurnstileToken(captchaToken)
  if (!captcha.success) {
    return { success: false, error: 'captcha_failed', code: 'captcha' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsedEmail.data,
    password: parsedPassword.data,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/account`,
    },
  })

  if (error) {
    return { success: false, error: error.message, code: 'auth' }
  }

  if (data.session) {
    return { success: true }
  }

  return { success: true, needsEmailConfirmation: true, email: parsedEmail.data }
}

export async function beginGoogleOAuth(
  captchaToken: string | null
): Promise<{ success: true; url: string } | { success: false; error: string; code?: 'captcha' | 'auth' }> {
  const captcha = await verifyTurnstileToken(captchaToken)
  if (!captcha.success) {
    return { success: false, error: 'captcha_failed', code: 'captcha' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/account`,
      skipBrowserRedirect: true,
    },
  })

  if (error || !data.url) {
    return { success: false, error: error?.message ?? 'oauth_failed', code: 'auth' }
  }

  return { success: true, url: data.url }
}