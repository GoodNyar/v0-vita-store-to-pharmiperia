#!/usr/bin/env node

const required = [
  'NEXT_PUBLIC_SITE_URL',
  'RESEND_API_KEY',
  'EMAIL_FROM',
  'EMAIL_ENABLED',
  'AUTH_EMAIL_ADDRESS',
]

const failures = []

for (const key of required) {
  if (!process.env[key]?.trim()) failures.push(`${key} is missing`)
}

if (process.env.EMAIL_ENABLED && process.env.EMAIL_ENABLED !== 'true') {
  failures.push('EMAIL_ENABLED must be true')
}

if (
  process.env.NEXT_PUBLIC_SITE_URL &&
  !/^https:\/\/pharm\.lv\/?$/.test(process.env.NEXT_PUBLIC_SITE_URL)
) {
  failures.push('NEXT_PUBLIC_SITE_URL must be https://pharm.lv')
}

if (process.env.EMAIL_FROM && !/<orders@pharm\.lv>$/.test(process.env.EMAIL_FROM.trim())) {
  failures.push('EMAIL_FROM must use orders@pharm.lv')
}

if (
  process.env.AUTH_EMAIL_ADDRESS &&
  process.env.AUTH_EMAIL_ADDRESS.trim() !== 'noreply@pharm.lv'
) {
  failures.push('AUTH_EMAIL_ADDRESS must be noreply@pharm.lv')
}

if (failures.length > 0) {
  console.error('Email production preflight failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Email production environment is ready (secret values were not printed).')
