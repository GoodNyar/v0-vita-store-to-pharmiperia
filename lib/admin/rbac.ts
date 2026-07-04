import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/** All profile roles stored in `profiles.role`. */
export const PROFILE_ROLES = ['customer', 'support', 'manager', 'admin'] as const
export type ProfileRole = (typeof PROFILE_ROLES)[number]

/** Roles that may access `/admin/*`. */
export const STAFF_ROLES = ['support', 'manager', 'admin'] as const
export type StaffRole = (typeof STAFF_ROLES)[number]

export type AdminPermission =
  | 'orders:read'
  | 'orders:write'
  | 'products:read'
  | 'products:write'
  | 'promo:read'
  | 'promo:write'
  | 'audit:read'

const ROLE_PERMISSIONS: Record<StaffRole, readonly AdminPermission[]> = {
  support: ['orders:read', 'orders:write', 'products:read'],
  manager: [
    'orders:read',
    'orders:write',
    'products:read',
    'products:write',
    'promo:read',
    'promo:write',
  ],
  admin: [
    'orders:read',
    'orders:write',
    'products:read',
    'products:write',
    'promo:read',
    'promo:write',
    'audit:read',
  ],
}

export class AdminAccessError extends Error {
  readonly status = 403

  constructor(message = 'Admin access required') {
    super(message)
    this.name = 'AdminAccessError'
  }
}

export function isStaffRole(role: string): role is StaffRole {
  return (STAFF_ROLES as readonly string[]).includes(role)
}

export function isAdminRole(role: string): boolean {
  return role === 'admin'
}

export function roleHasPermission(role: StaffRole, permission: AdminPermission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}

export async function getProfileRole(userId: string): Promise<ProfileRole> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (error || !data?.role) return 'customer'
  const role = data.role
  if ((PROFILE_ROLES as readonly string[]).includes(role)) {
    return role as ProfileRole
  }
  return 'customer'
}

export interface StaffSession {
  userId: string
  email: string | null
  role: StaffRole
}

export async function requireStaff(): Promise<StaffSession> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/lv/auth/login?redirect=/admin')
  }

  const role = await getProfileRole(user.id)
  if (!isStaffRole(role)) {
    throw new AdminAccessError('Staff access required')
  }

  return { userId: user.id, email: user.email ?? null, role }
}

/** Full admin only — audit log, destructive ops. */
export async function requireAdmin(): Promise<StaffSession> {
  const session = await requireStaff()
  if (session.role !== 'admin') {
    throw new AdminAccessError('Admin role required')
  }
  return session
}

export async function requirePermission(permission: AdminPermission): Promise<StaffSession> {
  const session = await requireStaff()
  if (!roleHasPermission(session.role, permission)) {
    throw new AdminAccessError(`Missing permission: ${permission}`)
  }
  return session
}