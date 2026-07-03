'use client'

import { Suspense } from 'react'
import { UtmCapture } from '@/components/utm-capture'

export function UtmCaptureRoot() {
  return (
    <Suspense fallback={null}>
      <UtmCapture />
    </Suspense>
  )
}