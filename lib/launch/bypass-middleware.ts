import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'
function isAdminProfileRole(role: string): boolean {
  return role === 'admin'
}

async function getProfileRoleFromRequest(
  request: NextRequest
): Promise<string | null> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {
          // Read-only role lookup for bypass decision.
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  return data?.role ?? null
}

/** Admin profile role bypasses storefront lockdown (preview before go-live). */
export async function hasAdminBypassInMiddleware(
  request: NextRequest
): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return false
  }

  const role = await getProfileRoleFromRequest(request)
  return role != null && isAdminProfileRole(role)
}