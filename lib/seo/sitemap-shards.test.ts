import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { shardCount, sliceShard, SITEMAP_SHARD_SIZE } from '@/lib/seo/sitemap-shards'

describe('sitemap shards', () => {
  it('uses 45k shard size', () => {
    assert.equal(SITEMAP_SHARD_SIZE, 45_000)
  })

  it('computes shard count', () => {
    assert.equal(shardCount(0), 1)
    assert.equal(shardCount(1), 1)
    assert.equal(shardCount(45_000), 1)
    assert.equal(shardCount(45_001), 2)
  })

  it('slices product routes per shard', () => {
    const items = Array.from({ length: 5 }, (_, i) => i)
    assert.deepEqual(sliceShard(items, 0), [0, 1, 2, 3, 4])
    assert.deepEqual(sliceShard(items, 1), [])
  })
})