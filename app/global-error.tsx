'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { RouteError } from '@/components/route-error'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="lv">
      <body>
        <RouteError error={error} reset={reset} />
      </body>
    </html>
  )
}