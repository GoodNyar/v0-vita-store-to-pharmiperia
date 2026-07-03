export interface UtmParams {
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
}

const UTM_STORAGE_KEY = 'pharm_utm'
const UTM_PARAM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const

function normalizeUtmValue(value: string | null | undefined): string | null {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed.slice(0, 255) : null
}

export function parseUtmFromSearchParams(searchParams: URLSearchParams): UtmParams {
  return {
    utm_source: normalizeUtmValue(searchParams.get('utm_source')),
    utm_medium: normalizeUtmValue(searchParams.get('utm_medium')),
    utm_campaign: normalizeUtmValue(searchParams.get('utm_campaign')),
  }
}

export function hasUtmParams(params: UtmParams): boolean {
  return Boolean(params.utm_source || params.utm_medium || params.utm_campaign)
}

export function mergeUtmParams(base: UtmParams, incoming: UtmParams): UtmParams {
  return {
    utm_source: incoming.utm_source ?? base.utm_source ?? null,
    utm_medium: incoming.utm_medium ?? base.utm_medium ?? null,
    utm_campaign: incoming.utm_campaign ?? base.utm_campaign ?? null,
  }
}

export function persistUtm(params: UtmParams): void {
  if (typeof window === 'undefined' || !hasUtmParams(params)) return
  try {
    const existing = readPersistedUtm()
    sessionStorage.setItem(
      UTM_STORAGE_KEY,
      JSON.stringify(mergeUtmParams(existing, params))
    )
  } catch {
    // sessionStorage unavailable (private mode, SSR)
  }
}

export function readPersistedUtm(): UtmParams {
  if (typeof window === 'undefined') {
    return { utm_source: null, utm_medium: null, utm_campaign: null }
  }
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY)
    if (!raw) return { utm_source: null, utm_medium: null, utm_campaign: null }
    const parsed = JSON.parse(raw) as Record<string, unknown>
    return {
      utm_source: normalizeUtmValue(
        typeof parsed.utm_source === 'string' ? parsed.utm_source : null
      ),
      utm_medium: normalizeUtmValue(
        typeof parsed.utm_medium === 'string' ? parsed.utm_medium : null
      ),
      utm_campaign: normalizeUtmValue(
        typeof parsed.utm_campaign === 'string' ? parsed.utm_campaign : null
      ),
    }
  } catch {
    return { utm_source: null, utm_medium: null, utm_campaign: null }
  }
}

export function utmParamKeys(): readonly string[] {
  return UTM_PARAM_KEYS
}