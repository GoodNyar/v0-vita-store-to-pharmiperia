import 'server-only'

import { sendWelcomeEmail } from '@/lib/email/welcome'

/**
 * Phase 3 stub — enqueue welcome series after signup.
 * Wire from auth callback / confirmed signup when job queue lands (PR-28).
 */
export async function triggerWelcomeEmail(userId: string): Promise<void> {
  try {
    const result = await sendWelcomeEmail(userId)
    if (result.sent) {
      console.info('[email/triggers/welcome] dispatched', {
        userId,
        messageId: result.messageId,
      })
    } else {
      console.info('[email/triggers/welcome] skipped', {
        userId,
        reason: result.reason,
      })
    }
  } catch (error) {
    console.error('[email/triggers/welcome] failed (non-blocking)', { userId, error })
  }
}