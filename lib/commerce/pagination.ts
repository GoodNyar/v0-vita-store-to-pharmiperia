/** Keyset cursor for stable pagination at scale (ADR-0027). Pure codec — no server-only. */
export interface KeysetCursor {
  createdAt: string
  id: string
}

export interface KeysetPage<T> {
  items: T[]
  nextCursor: KeysetCursor | null
}

export function encodeKeysetCursor(cursor: KeysetCursor): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url')
}

export function decodeKeysetCursor(encoded: string): KeysetCursor | null {
  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as KeysetCursor
    if (typeof parsed.createdAt === 'string' && typeof parsed.id === 'string') {
      return parsed
    }
    return null
  } catch {
    return null
  }
}