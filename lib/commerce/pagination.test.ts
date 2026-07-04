import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { decodeKeysetCursor, encodeKeysetCursor } from '@/lib/commerce/pagination'

describe('keyset cursor codec', () => {
  it('round-trips cursor', () => {
    const cursor = { createdAt: '2026-07-04T12:00:00.000Z', id: 'abc-123' }
    const encoded = encodeKeysetCursor(cursor)
    assert.deepEqual(decodeKeysetCursor(encoded), cursor)
  })

  it('returns null for invalid payload', () => {
    assert.equal(decodeKeysetCursor('not-valid'), null)
  })
})