import { generateText, Output } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const recommendationSchema = z.object({
  recommendations: z.array(z.object({
    productId: z.string(),
    reason: z.string(),
    matchScore: z.number().min(0).max(100)
  })),
  skinType: z.string().nullable(),
  concerns: z.array(z.string())
})

export async function POST(req: Request) {
  try {
    const { skinType, concerns, budget, currentProducts } = await req.json()

    const supabase = await createClient()
    
    // Fetch available products from database
    const { data: products } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        rating,
        brand:brands(name),
        category:categories(name)
      `)
      .eq('active', true)
      .limit(50)

    if (!products || products.length === 0) {
      return Response.json({ recommendations: [], message: 'No products available' })
    }

    const productList = products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      rating: p.rating,
      brand: p.brand?.name || 'Unknown',
      category: p.category?.name || 'Unknown'
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

    const recommendations = result.object

    // Enrich recommendations with full product data
    const enrichedRecommendations = recommendations.recommendations.map(rec => {
      const product = products.find(p => p.id === rec.productId)
      return {
        ...rec,
        product: product || null
      }
    }).filter(rec => rec.product !== null)

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
