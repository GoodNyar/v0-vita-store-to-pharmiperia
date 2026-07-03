/** Client-safe AI feature flags (NEXT_PUBLIC_*). Server also requires OPENAI_API_KEY. */

export function isAiRecommendationsPublicEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AI_RECOMMENDATIONS_ENABLED === 'true'
}

export function isAiChatPublicEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AI_CHAT_ENABLED === 'true'
}

export function getAiMaxInputChars(): number {
  const value = Number(process.env.AI_MAX_INPUT_CHARS ?? '2000')
  return Number.isFinite(value) && value > 0 ? value : 2000
}

export function getAiMaxChatMessages(): number {
  const value = Number(process.env.AI_MAX_CHAT_MESSAGES ?? '20')
  return Number.isFinite(value) && value > 0 ? value : 20
}

export function getAiMaxOutputTokens(): number {
  const value = Number(process.env.AI_MAX_OUTPUT_TOKENS ?? '500')
  return Number.isFinite(value) && value > 0 ? value : 500
}

export function getAiDailyRequestCap(): number {
  const value = Number(process.env.AI_DAILY_REQUEST_CAP ?? '100')
  return Number.isFinite(value) && value > 0 ? value : 100
}