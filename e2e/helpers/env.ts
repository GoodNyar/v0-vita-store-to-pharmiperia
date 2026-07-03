const REQUIRED_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
] as const

export function isE2EEnabled(): boolean {
  if (process.env.E2E_ENABLED !== 'true') return false
  return REQUIRED_VARS.every((key) => Boolean(process.env[key]?.trim()))
}

export function e2eSkipReason(): string {
  if (process.env.E2E_ENABLED !== 'true') {
    return 'E2E_ENABLED is not true — smoke checkout skipped (CI-safe default)'
  }
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]?.trim())
  if (missing.length > 0) {
    return `Missing env for e2e: ${missing.join(', ')}`
  }
  return ''
}

export function uniqueE2EEmail(): string {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@pharm.lv.test`
}