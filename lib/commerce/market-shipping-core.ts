import type { Money } from '@/lib/money'

export interface ShippingMethodCost {
  code: string
  carrier: string
  name: string
  cost: Money
  supportsParcelLocker: boolean
}

export function findShippingMethodByCost(
  methods: ShippingMethodCost[],
  cost: Money
): ShippingMethodCost | null {
  return (
    methods.find(
      (method) =>
        method.cost.amount === cost.amount && method.cost.currency === cost.currency
    ) ?? null
  )
}