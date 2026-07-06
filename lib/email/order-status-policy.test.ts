import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { ORDER_STATUSES } from '@/lib/commerce/types'
import { getOrderStatusEmail } from '@/lib/email/order-status-policy'

describe('getOrderStatusEmail', () => {
  it('maps customer-visible lifecycle transitions to transactional emails', () => {
    assert.equal(getOrderStatusEmail('shipped'), 'shipped')
    assert.equal(getOrderStatusEmail('delivered'), 'review_request')
    assert.equal(getOrderStatusEmail('refunded'), 'refund_notice')
  })

  it('does not send lifecycle email for internal or incomplete states', () => {
    for (const status of ORDER_STATUSES) {
      if (status === 'shipped' || status === 'delivered' || status === 'refunded') continue
      assert.equal(getOrderStatusEmail(status), null)
    }
  })
})
