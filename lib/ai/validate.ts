import { z } from 'zod'

import {
  getAiMaxChatMessages,
  getAiMaxInputChars,
} from '@/lib/features/ai'

const recommendationsRequestSchema = z.object({
  skinType: z.string().max(50).nullable().optional(),
  concerns: z.array(z.string().max(50)).max(8).optional(),
  budget: z.union([z.string().max(32), z.number(), z.null()]).optional(),
  currentProducts: z.array(z.string().max(100)).max(20).optional(),
})

export type RecommendationsRequest = z.infer<typeof recommendationsRequestSchema>

export function parseRecommendationsRequest(
  body: unknown
): { success: true; data: RecommendationsRequest } | { success: false } {
  const parsed = recommendationsRequestSchema.safeParse(body)
  if (!parsed.success) return { success: false }
  return { success: true, data: parsed.data }
}

function extractMessageText(message: Record<string, unknown>): string {
  if (typeof message.content === 'string') {
    return message.content
  }

  const parts = message.parts
  if (!Array.isArray(parts)) return ''

  return parts
    .filter((part): part is { type: string; text?: string } => typeof part === 'object' && part !== null)
    .filter((part) => part.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text as string)
    .join('\n')
}

export function validateChatMessages(
  messages: unknown
): { success: true; messages: unknown[] } | { success: false; reason: string } {
  if (!Array.isArray(messages)) {
    return { success: false, reason: 'invalid_messages' }
  }

  const maxMessages = getAiMaxChatMessages()
  if (messages.length === 0 || messages.length > maxMessages) {
    return { success: false, reason: 'message_count' }
  }

  const maxChars = getAiMaxInputChars()
  let totalChars = 0

  for (const message of messages) {
    if (typeof message !== 'object' || message === null) {
      return { success: false, reason: 'invalid_message' }
    }

    const record = message as Record<string, unknown>
    if (record.role !== 'user' && record.role !== 'assistant' && record.role !== 'system') {
      return { success: false, reason: 'invalid_role' }
    }

    const text = extractMessageText(record)
    totalChars += text.length
    if (text.length > maxChars || totalChars > maxChars) {
      return { success: false, reason: 'input_too_long' }
    }
  }

  return { success: true, messages }
}