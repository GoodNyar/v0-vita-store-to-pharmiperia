'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { parseUtmFromSearchParams, persistUtm } from '@/lib/analytics/utm'

/**
 * Persists UTM params from landing URL into sessionStorage for checkout attribution.
 */
export function UtmCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    persistUtm(parseUtmFromSearchParams(searchParams))
  }, [searchParams])

  return null
}