import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

export async function deleteUserAccount(userId: string): Promise<void> {
  const admin = createAdminClient()

  const { error } = await admin.auth.admin.deleteUser(userId)

  if (error) {
    throw new Error(`Failed to delete user account: ${error.message}`)
  }
}