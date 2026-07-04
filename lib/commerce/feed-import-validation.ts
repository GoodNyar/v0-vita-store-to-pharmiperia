function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/** Minimal validation for CSV/XML rows before publish pipeline exists. */
export function validateFeedRow(payload: Record<string, unknown>): string[] {
  const errors: string[] = []
  if (!isNonEmptyString(payload.sku)) errors.push('missing_sku')
  if (!isNonEmptyString(payload.slug)) errors.push('missing_slug')
  if (!isNonEmptyString(payload.name_ru) && !isNonEmptyString(payload.name_lv)) {
    errors.push('missing_name')
  }
  const price = payload.price_cents
  if (typeof price !== 'number' || !Number.isInteger(price) || price < 0) {
    errors.push('invalid_price_cents')
  }
  return errors
}