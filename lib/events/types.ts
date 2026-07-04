export type OrderPaidEvent = {
  type: 'order.paid'
  orderId: string
  alreadyPaid: boolean
  stripeEventId: string
  checkoutSessionId: string
}

export type CommerceEvent = OrderPaidEvent