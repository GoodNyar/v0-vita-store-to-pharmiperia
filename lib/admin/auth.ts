import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const PROFILE_ROLES = ['customer', 'admin'] as const
export type ProfileRole = (typeof PROFILE_ROLES)[number]

export class AdminAccessError extends Error {
  readonly status = 403

  constructor(message = 'Admin access required') {
    super(message)
    this.name = 'AdminAccessError'
  }
}

export async function getProfileRole(userId: string): Promise<ProfileRole> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (error || !data?.role) return 'customer'
  return data.role === 'admin' ? 'admin' : 'customer'
}

export async function requireAdmin(): Promise<{ userId: string; email: string | null }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/lv/auth/login?redirect=/admin')
  }

  const role = await getProfileRole(user.id)
  if (role !== 'admin') {
    throw new AdminAccessError()
  }

  return { userId: user.id, email: user.email ?? null }
}