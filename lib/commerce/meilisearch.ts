import 'server-only'

/**
 * Optional Meilisearch adapter (Phase 5). Falls back to Postgres when env unset.
 * Full index sync is deferred until MEILISEARCH_HOST is configured in staging/prod.
 */
export function isMeilisearchEnabled(): boolean {
  return Boolean(process.env.MEILISEARCH_HOST?.trim() && process.env.MEILISEARCH_API_KEY?.trim())
}

export interface MeilisearchHit {
  productId: string
  rank: number
}

/** Placeholder — returns empty until index pipeline is wired. */
export async function searchMeilisearch(
  query: string,
  options?: { limit?: number }
): Promise<MeilisearchHit[]> {
  if (!isMeilisearchEnabled()) {
    return []
  }

  void query
  void options

  // Index sync + HTTP client deferred to staging with real MEILISEARCH_HOST.
  console.warn('[meilisearch] enabled but index client not configured — using Postgres search')
  return []
}