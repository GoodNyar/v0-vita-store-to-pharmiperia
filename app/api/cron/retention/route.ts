import { NextResponse } from 'next/server'

import { processAbandonedCartBatch } from '@/lib/email/abandoned-cart'
import { processReviewRequestBatch } from '@/lib/email/review-request'

function authorizeCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false
  const header = request.headers.get('authorization')
  return header === `Bearer ${secret}`
}

export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const [abandoned, reviews] = await Promise.all([
    processAbandonedCartBatch(24, 25),
    processReviewRequestBatch(25),
  ])

  return NextResponse.json(
    {
      ok: true,
      abandoned,
      reviews,
      ranAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}