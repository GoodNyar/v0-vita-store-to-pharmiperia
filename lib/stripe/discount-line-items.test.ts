import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { eur } from '@/lib/money'
import type { ResolvedOrderLine } from '@/lib/orders'
import { distributeDiscountAcrossLines } from '@/lib/stripe/discount-line-items'

const lines: ResolvedOrderLine[] = [
  {
    catalogProductId: 1,
    name: 'A',
    sku: '001',
    quantity: 2,
    unitPrice: eur(1000),
    lineTotal: eur(2000),
  },
  {
    catalogProductId: 2,
    name: 'B',
    sku: '002',
    quantity: 1,
    unitPrice: eur(3000),
    lineTotal: eur(3000),
  },
]

function stripeSum(result: ReturnType<typeof distributeDiscountAcrossLines>): number {
  return result.reduce((sum, line) => sum + line.unitPrice.amount * line.quantity, 0)
}

describe('distributeDiscountAcrossLines', () => {
  it('returns original lines when discount is zero', () => {
    const result = distributeDiscountAcrossLines(lines, 0)
    assert.equal(result[0].unitPrice.amount, 1000)
    assert.equal(result[1].unitPrice.amount, 3000)
  })

  it('matches exact discounted subtotal for Stripe webhook check', () => {
    const discount = 500
    const result = distributeDiscountAcrossLines(lines, discount)
    const expected = 5000 - discount
    assert.equal(stripeSum(result), expected)
  })
})