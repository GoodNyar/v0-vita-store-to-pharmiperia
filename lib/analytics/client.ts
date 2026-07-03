'use client'

import { hasAnalyticsConsent } from '@/lib/consent/storage'

const DISTINCT_ID_KEY = 'pharm_analytics_id'

export interface AnalyticsItem {
  itemId: string
  itemName: string
  price: number
  quantity?: number
  currency?: string
}

function isAnalyticsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'
}

function canTrack(): boolean {
  return isAnalyticsEnabled() && hasAnalyticsConsent()
}

function getDistinctId(): string {
  if (typeof window === 'undefined') return 'anonymous'
  try {
    const existing = localStorage.getItem(DISTINCT_ID_KEY)
    if (existing) return existing
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `anon-${Date.now()}`
    localStorage.setItem(DISTINCT_ID_KEY, id)
    return id
  } catch {
    return 'anonymous'
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

function trackGa4(eventName: string, params: Record<string, unknown>): void {
  if (!process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID) return
  if (typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}

async function trackPostHog(eventName: string, properties: Record<string, unknown>): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com'
  if (!apiKey) return

  try {
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        event: eventName,
        distinct_id: getDistinctId(),
        properties: {
          ...properties,
          $lib: 'pharmiperia-web',
        },
      }),
      keepalive: true,
    })
  } catch {
    // analytics must not break UX
  }
}

function toGa4Items(items: AnalyticsItem[]) {
  return items.map((item) => ({
    item_id: item.itemId,
    item_name: item.itemName,
    price: item.price,
    quantity: item.quantity ?? 1,
  }))
}

function dispatch(eventName: string, properties: Record<string, unknown>, items?: AnalyticsItem[]): void {
  if (!canTrack()) return

  const currency = (items?.[0]?.currency ?? 'EUR').toUpperCase()
  const ga4Params: Record<string, unknown> = {
    currency,
    ...properties,
  }
  if (items?.length) {
    ga4Params.items = toGa4Items(items)
  }

  trackGa4(eventName, ga4Params)
  void trackPostHog(eventName, { currency, ...properties, items })
}

export function trackViewItem(item: AnalyticsItem): void {
  dispatch('view_item', { value: item.price }, [item])
}

export function trackAddToCart(item: AnalyticsItem & { quantity: number }): void {
  dispatch(
    'add_to_cart',
    { value: item.price * item.quantity },
    [{ ...item, quantity: item.quantity }]
  )
}

export function trackBeginCheckout(items: AnalyticsItem[]): void {
  const value = items.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0
  )
  dispatch('begin_checkout', { value }, items)
}

export function isClientAnalyticsConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || process.env.NEXT_PUBLIC_POSTHOG_KEY
  )
}

export { isAnalyticsEnabled }