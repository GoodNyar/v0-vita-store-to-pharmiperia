import 'server-only'

/**
 * Phase 3 PR-25/26: AI v2 scaffold — retrieval + budget gate.
 * Full pgvector wiring deferred until embedding pipeline is provisioned.
 */
export function isAiRecommendationsProdEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AI_RECOMMENDATIONS_ENABLED === 'true'
}

export async function getCachedRecommendations(
  productIds: number[],
  locale: string
): Promise<{ productIds: number[]; source: 'cache' | 'fallback' }> {
  void productIds
  void locale
  if (!isAiRecommendationsProdEnabled()) {
    return { productIds: [], source: 'fallback' }
  }
  return { productIds: [], source: 'fallback' }
}