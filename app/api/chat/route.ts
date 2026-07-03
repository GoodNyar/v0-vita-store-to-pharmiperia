import { streamText, convertToModelMessages } from 'ai'

import { API_RATE_LIMITS, enforceRateLimit } from '@/lib/rate-limit'
import { getSupportEmail } from '@/lib/site'

export async function POST(req: Request) {
  const rateLimited = await enforceRateLimit(req, API_RATE_LIMITS.chat)
  if (rateLimited) return rateLimited

  const { messages } = await req.json()
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
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 500,
  })

  return result.toUIMessageStreamResponse()
}
