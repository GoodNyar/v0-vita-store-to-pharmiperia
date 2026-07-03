'use server'

import { deleteUserAccount } from '@/lib/account/delete-user'
import { createClient } from '@/lib/supabase/server'

export async function deleteAccount(): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await deleteUserAccount(user.id)
    await supabase.auth.signOut()
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Account deletion failed'
    console.error('[account] deleteAccount failed', { userId: user.id, message })
    return { success: false, error: message }
  }
}