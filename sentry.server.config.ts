import * as Sentry from '@sentry/nextjs'

import {
  getSentryDsn,
  getSentryEnvironment,
  getTracesSampleRate,
  isSentryEnabled,
} from '@/lib/sentry/shared'

if (isSentryEnabled('server')) {
  Sentry.init({
    dsn: getSentryDsn('server'),
    environment: getSentryEnvironment(),
    tracesSampleRate: getTracesSampleRate(),
    includeLocalVariables: true,
    enableLogs: true,
  })
}