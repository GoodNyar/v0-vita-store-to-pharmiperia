/** Max URLs per sitemap shard (Google limit 50k; we use 45k per Phase 5 plan). Pure helpers — no server-only. */
export const SITEMAP_SHARD_SIZE = 45_000

export function shardIndexForPosition(position: number): number {
  return Math.floor(position / SITEMAP_SHARD_SIZE)
}

export function sliceShard<T>(items: T[], shardId: number): T[] {
  const start = shardId * SITEMAP_SHARD_SIZE
  return items.slice(start, start + SITEMAP_SHARD_SIZE)
}

export function shardCount(totalItems: number): number {
  return Math.max(1, Math.ceil(totalItems / SITEMAP_SHARD_SIZE))
}