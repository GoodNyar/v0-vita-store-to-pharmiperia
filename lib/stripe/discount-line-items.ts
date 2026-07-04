import type { ResolvedOrderLine } from '@/lib/orders'
import { eur, type Money } from '@/lib/money'

export interface DiscountedStripeLine {
  catalogProductId: number
  name: string
  sku: string
  quantity: number
  unitPrice: Money
}

function mapLine(line: ResolvedOrderLine): DiscountedStripeLine {
  return {
    catalogProductId: line.catalogProductId,
    name: line.name,
    sku: line.sku,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
  }
}

function stripeSubtotalCents(lines: DiscountedStripeLine[]): number {
  return lines.reduce((sum, line) => sum + line.unitPrice.amount * line.quantity, 0)
}

function toStripeLine(line: ResolvedOrderLine, lineTotalCents: number): DiscountedStripeLine {
  if (lineTotalCents % line.quantity !== 0) {
    throw new Error(
      `Stripe line total ${lineTotalCents} not divisible by quantity ${line.quantity}`
    )
  }
  return {
    catalogProductId: line.catalogProductId,
    name: line.name,
    sku: line.sku,
    quantity: line.quantity,
    unitPrice: eur(lineTotalCents / line.quantity),
  }
}

function reconcileToTarget(
  lines: DiscountedStripeLine[],
  targetSubtotal: number
): DiscountedStripeLine[] {
  const diff = targetSubtotal - stripeSubtotalCents(lines)
  if (diff === 0) {
    return lines
  }

  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i]
    if (diff % line.quantity !== 0) {
      continue
    }
    const adjustedUnit = line.unitPrice.amount + diff / line.quantity
    if (adjustedUnit < 1) {
      continue
    }
    const next = [...lines]
    next[i] = { ...line, unitPrice: eur(adjustedUnit) }
    return next
  }

  throw new Error(
    `Cannot reconcile Stripe subtotal to ${targetSubtotal} (current ${stripeSubtotalCents(lines)})`
  )
}

/**
 * Distributes discount so sum(unit×qty) === subtotal − discount (required by webhook amount check).
 */
export function distributeDiscountAcrossLines(
  lines: ResolvedOrderLine[],
  discountCents: number
): DiscountedStripeLine[] {
  if (discountCents <= 0 || lines.length === 0) {
    return lines.map(mapLine)
  }

  const subtotalCents = lines.reduce((sum, line) => sum + line.lineTotal.amount, 0)
  const cappedDiscount = Math.min(discountCents, subtotalCents)
  const targetSubtotal = subtotalCents - cappedDiscount

  if (targetSubtotal <= 0) {
    throw new Error('Discount exceeds subtotal — cannot create Stripe session')
  }

  const lineTotals: number[] = []
  let allocated = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isLast = i === lines.length - 1

    if (isLast) {
      lineTotals.push(targetSubtotal - allocated)
      break
    }

    let share = Math.floor((line.lineTotal.amount * targetSubtotal) / subtotalCents)
    share -= share % line.quantity
    share = Math.max(line.quantity, share)
    lineTotals.push(share)
    allocated += share
  }

  const built = lines.map((line, index) => toStripeLine(line, lineTotals[index]))
  return reconcileToTarget(built, targetSubtotal)
}