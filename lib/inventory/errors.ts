export function isInsufficientStockError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return message.includes('Insufficient stock')
}