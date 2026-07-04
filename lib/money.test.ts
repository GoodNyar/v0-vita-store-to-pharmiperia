import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  addMoney,
  eur,
  extractInclusiveVatCents,
  multiplyMoney,
  sumMoney,
} from '@/lib/money'

describe('lib/money', () => {
  it('eur rejects non-integer cents', () => {
    assert.throws(() => eur(18.99), /integer/)
  })

  it('extractInclusiveVatCents at 21%', () => {
    const gross = 12100
    const vat = extractInclusiveVatCents(gross)
    assert.equal(vat, 2100)
  })

  it('addMoney and multiplyMoney', () => {
    const total = addMoney(eur(1000), multiplyMoney(eur(500), 2))
    assert.equal(total.amount, 2000)
    assert.equal(total.currency, 'EUR')
  })

  it('sumMoney empty returns zero EUR', () => {
    assert.deepEqual(sumMoney([]), eur(0))
  })
})