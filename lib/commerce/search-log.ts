import 'server-only'

import type { Locale } from '@/lib/i18n/config'
import { createAdminClient } from '@/lib/supabase/admin'

const MAX_QUERY_LENGTH = 200

function normalizeQuery(query: string): string | null {
  const trimmed = query.trim()
  if (!trimmed) return null
  return trimmed.slice(0, MAX_QUERY_LENGTH)
}

/**
 * Fire-and-forget search query logging for product discovery analytics.
 */
export async function logSearchQuery(input: {
  query: string
  locale: Locale
  resultsCount: number
  userId?: string | null
}): Promise<void> {
  const normalized = normalizeQuery(input.query)
  if (!normalized) return

  const supabase = createAdminClient()
  const { error } = await supabase.from('search_queries').insert({
    query: normalized,
    locale: input.locale,
    results_count: Math.max(0, input.resultsCount),
    user_id: input.userId ?? null,
  })

  if (error) {
    console.warn('[search-log] failed to insert query', error.message)
  }
}