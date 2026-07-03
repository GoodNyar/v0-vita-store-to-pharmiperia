import * as Sentry from '@sentry/nextjs'

import {
  getSentryDsn,
  getSentryEnvironment,
  getTracesSampleRate,
  isSentryEnabled,
} from '@/lib/sentry/shared'

if (isSentryEnabled('client')) {
  Sentry.init({
    dsn: getSentryDsn('client'),
    environment: getSentryEnvironment(),
    tracesSampleRate: getTracesSampleRate(),
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    enableLogs: true,
    integrations: [Sentry.replayIntegration()],
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart