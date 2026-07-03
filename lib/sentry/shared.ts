export function getSentryDsn(runtime: 'client' | 'server' = 'server'): string | undefined {
  if (runtime === 'client') {
    return process.env.NEXT_PUBLIC_SENTRY_DSN
  }
  return process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN
}

export function isSentryEnabled(runtime: 'client' | 'server' = 'server'): boolean {
  return Boolean(getSentryDsn(runtime)) && process.env.SENTRY_ENABLED !== 'false'
}

export function getTracesSampleRate(): number {
  return process.env.NODE_ENV === 'development' ? 1.0 : 0.1
}

export function getSentryEnvironment(): string {
  return process.env.SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development'
}