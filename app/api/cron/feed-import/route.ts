import { NextResponse } from 'next/server'

import { listPendingFeedBatches } from '@/lib/commerce/feed-import'

function authorizeCron(request: Request): boolean {
  const secret = process.env.FEED_IMPORT_CRON_SECRET?.trim()
  if (!secret) return false
  const header = request.headers.get('authorization')
  return header === `Bearer ${secret}`
}

/** Lists pending PIM batches — processing hook for future supplier feeds. */
export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const pending = await listPendingFeedBatches(25)

  return NextResponse.json(
    { ok: true, pending, ranAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}