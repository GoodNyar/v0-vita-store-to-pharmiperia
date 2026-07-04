import 'server-only'

import { createClient } from '@/lib/supabase/server'

export async function logAdminAction(input: {
  action: string
  entityType: string
  entityId?: string
  metadata?: Record<string, unknown>
}): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('admin_audit_log').insert({
    actor_id: user?.id ?? null,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    metadata: input.metadata ?? null,
  })

  if (error) {
    console.error('[admin/audit] failed to log action', error.message)
  }
}