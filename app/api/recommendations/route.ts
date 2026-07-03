import { generateText, Output } from 'ai'
import { z } from 'zod'

import { enforceAiBudget, guardAiRecommendationsEnabled } from '@/lib/ai/guard'
import { parseRecommendationsRequest } from '@/lib/ai/validate'
import { createClient } from '@/lib/supabase/server'
import { moneyFromDb, type Money } from '@/lib/money'
import { API_RATE_LIMITS, enforceRateLimit } from '@/lib/rate-limit'

const recommendationSchema = z.object({
  recommendations: z.array(z.object({
    productId: z.string(),
    reason: z.string(),
    matchScore: z.number().min(0).max(100)
  })),
  skinType: z.string().nullable(),
  concerns: z.array(z.string())
})

type RecommendationOutput = z.infer<typeof recommendationSchema>

type RelatedName = { name: string }

interface ProductRow {
  id: string
  name: string
  description: string
  price_cents: number
  currency: string
  rating: number
  brand: RelatedName | RelatedName[] | null
  category: RelatedName | RelatedName[] | null
}

type EnrichedProduct = ProductRow & { price: Money }

type EnrichedRecommendation = RecommendationOutput['recommendations'][number] & {
  product: EnrichedProduct
}

function getRelatedName(
  relation: RelatedName | RelatedName[] | null | undefined
): string {
  if (!relation) return 'Unknown'
  if (Array.isArray(relation)) return relation[0]?.name ?? 'Unknown'
  return relation.name
}

export async function POST(req: Request) {
  const disabled = guardAiRecommendationsEnabled()
  if (disabled) return disabled

  const rateLimited = await enforceRateLimit(req, API_RATE_LIMITS.recommendations)
  if (rateLimited) return rateLimited

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = parseRecommendationsRequest(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const budgetBlocked = await enforceAiBudget()
  if (budgetBlocked) return budgetBlocked

  const { skinType, concerns, budget, currentProducts } = parsed.data

  try {
    const supabase = await createClient()

    const { data: products } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        price_cents,
        currency,
        rating,
        brand:brands(name),
        category:categories(name)
      `)
      .eq('active', true)
      .limit(50)

    if (!products || products.length === 0) {
      return Response.json({ recommendations: [], message: 'No products available' })
    }

    const productRows = products as ProductRow[]

    const productList = productRows.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price_cents / 100,
      rating: p.rating,
      brand: getRelatedName(p.brand),
      category: getRelatedName(p.category),
    }))

    const prompt = `You are a skincare expert at Pharmiperia, a European pharmacy cosmetics store.
    
Based on the customer's profile:
- Skin Type: ${skinType || 'Not specified'}
- Concerns: ${concerns?.length ? concerns.join(', ') : 'Not specified'}
- Budget: ${budget || 'No limit'}
- Products they already use: ${currentProducts?.length ? currentProducts.join(', ') : 'None specified'}

Available products:
${JSON.stringify(productList, null, 2)}

Recommend 3-5 products that would be most suitable for this customer. For each recommendation, explain why it's a good match and provide a match score (0-100).

Focus on:
1. Addressing their specific skin concerns
2. Compatibility with their skin type
3. Complementing products they already use (avoid duplicates)
4. Staying within budget if specified`

    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt,
      output: Output.object({ schema: recommendationSchema })
    })

    const recommendations: RecommendationOutput = result.output

    const enrichedRecommendations = recommendations.recommendations
      .map((rec) => {
        const product = productRows.find((p) => p.id === rec.productId)
        return {
          ...rec,
          product: product
            ? {
                ...product,
                price: moneyFromDb(
                  product.price_cents,
                  product.currency as 'EUR'
                ),
              }
            : null,
        }
      })
      .filter((rec): rec is EnrichedRecommendation => rec.product !== null)

    return Response.json({
      recommendations: enrichedRecommendations,
      skinType: recommendations.skinType,
      concerns: recommendations.concerns
    })

  } catch (error) {
    console.error('AI Recommendations error:', error)
    return Response.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}