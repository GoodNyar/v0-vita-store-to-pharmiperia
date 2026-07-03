import { convertToModelMessages, streamText, type UIMessage } from 'ai'

import { enforceAiBudget, guardAiChatEnabled } from '@/lib/ai/guard'
import { validateChatMessages } from '@/lib/ai/validate'
import { getAiMaxOutputTokens } from '@/lib/features/ai'
import { API_RATE_LIMITS, enforceRateLimit } from '@/lib/rate-limit'
import { getSupportEmail } from '@/lib/site'

export async function POST(req: Request) {
  const disabled = guardAiChatEnabled()
  if (disabled) return disabled

  const rateLimited = await enforceRateLimit(req, API_RATE_LIMITS.chat)
  if (rateLimited) return rateLimited

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { messages } = (body ?? {}) as { messages?: unknown }
  const validated = validateChatMessages(messages)
  if (!validated.success) {
    return Response.json({ error: 'Invalid chat messages', code: validated.reason }, { status: 400 })
  }

  const budgetBlocked = await enforceAiBudget()
  if (budgetBlocked) return budgetBlocked

  const supportEmail = getSupportEmail()

  const systemPrompt = `Ты - консультант интернет-магазина Pharmiperia, специализирующегося на аптечной косметике из Европы.

Твои задачи:
1. Помогать клиентам выбрать подходящую косметику
2. Отвечать на вопросы о продуктах, доставке, оплате и возврате
3. Давать рекомендации по уходу за кожей

Информация о магазине:
- Бесплатная доставка по Латвии при заказе от 40 EUR
- Доставка 1-3 рабочих дня
- Возврат в течение 14 дней
- Все продукты оригинальные, из европейских аптек
- Бренды: La Roche-Posay, Vichy, Bioderma, Avène, CeraVe, Eucerin, Nuxe, SVR и др.

Правила общения:
- Будь дружелюбным и профессиональным
- Отвечай кратко и по делу
- Если не знаешь ответ - предложи связаться с поддержкой по email: ${supportEmail}
- Отвечай на русском языке, если клиент пишет на русском, на латышском - если на латышском, на английском - если на английском`

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: systemPrompt,
    messages: await convertToModelMessages(validated.messages as UIMessage[]),
    maxOutputTokens: getAiMaxOutputTokens(),
  })

  return result.toUIMessageStreamResponse()
}