import { NextResponse } from 'next/server'
import { enforceRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

/** Phase 3 PR-27: Helpdesk ticket stub — logs payload for future Intercom/Zendesk wiring. */
export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, {
    namespace: 'api:helpdesk',
    limit: 10,
    windowSec: 60,
  })
  if (limited) return limited

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const payload = body as Record<string, unknown>
  console.info('[helpdesk/ticket] stub received', {
    hasEmail: typeof payload.email === 'string',
    hasName: typeof payload.name === 'string',
    subjectLength: typeof payload.subject === 'string' ? payload.subject.length : 0,
    bodyLength: typeof payload.message === 'string' ? payload.message.length : 0,
  })
  return NextResponse.json({ received: true, ticketId: `stub-${Date.now()}` })
}