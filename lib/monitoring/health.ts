import 'server-only'

export type HealthStatus = 'ok' | 'degraded' | 'error'

export interface HealthCheckResult {
  status: HealthStatus
  timestamp: string
  version: string
  checks: {
    app: 'ok'
    supabase: HealthStatus | 'skipped'
  }
}

export function getDeploymentVersion(): string {
  return (
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.GITHUB_SHA ??
    'local'
  )
}

export async function checkSupabaseHealth(): Promise<HealthStatus | 'skipped'> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) return 'skipped'

  try {
    const response = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: key },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    })
    return response.ok ? 'ok' : 'error'
  } catch {
    return 'error'
  }
}

export async function runHealthChecks(deep: boolean): Promise<HealthCheckResult> {
  const checks: HealthCheckResult['checks'] = {
    app: 'ok',
    supabase: 'skipped',
  }

  if (deep) {
    checks.supabase = await checkSupabaseHealth()
  }

  const status: HealthStatus =
    checks.supabase === 'error' ? 'degraded' : 'ok'

  return {
    status,
    timestamp: new Date().toISOString(),
    version: getDeploymentVersion(),
    checks,
  }
}