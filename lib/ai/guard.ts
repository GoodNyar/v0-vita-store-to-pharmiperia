import 'server-only'

import { consumeAiRequestBudget } from '@/lib/ai/budget'
import {
  isAiChatPublicEnabled,
  isAiRecommendationsPublicEnabled,
} from '@/lib/features/ai'

function isOpenAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY)
}

export function isAiChatEnabled(): boolean {
  return isAiChatPublicEnabled() && isOpenAiConfigured()
}

export function isAiRecommendationsEnabled(): boolean {
  return isAiRecommendationsPublicEnabled() && isOpenAiConfigured()
}

function aiDisabledResponse(feature: 'chat' | 'recommendations'): Response {
  return Response.json(
    {
      error: 'AI feature is disabled',
      code: 'ai_disabled',
      feature,
    },
    { status: 503 }
  )
}

function aiBudgetExceededResponse(): Response {
  return Response.json(
    { error: 'AI daily request budget exceeded', code: 'ai_budget_exceeded' },
    { status: 429, headers: { 'Retry-After': '3600' } }
  )
}

export function guardAiChatEnabled(): Response | null {
  if (!isAiChatEnabled()) return aiDisabledResponse('chat')
  return null
}

export function guardAiRecommendationsEnabled(): Response | null {
  if (!isAiRecommendationsEnabled()) return aiDisabledResponse('recommendations')
  return null
}

export async function enforceAiBudget(): Promise<Response | null> {
  const budget = await consumeAiRequestBudget()
  if (!budget.allowed) return aiBudgetExceededResponse()
  return null
}