import { runHealthChecks } from '@/lib/monitoring/health'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function isDeepCheckAuthorized(request: Request): boolean {
  const token = process.env.MONITORING_HEALTH_TOKEN
  if (!token) return true

  const url = new URL(request.url)
  return url.searchParams.get('token') === token
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const deep = url.searchParams.get('deep') === '1'

  if (deep && !isDeepCheckAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await runHealthChecks(deep)
  const httpStatus = result.status === 'ok' ? 200 : 503

  return Response.json(result, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}