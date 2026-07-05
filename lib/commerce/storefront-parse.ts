import { isMarketCode, type MarketCode } from './markets-config'
import { commerceValidation, commerceFail, commerceOk, type CommerceResult } from './errors'

export function parseStorefrontMarket(value: string | null | undefined): MarketCode | null {
  return isMarketCode(value) ? value : null
}

export function requireStorefrontMarket(
  value: string | null | undefined
): CommerceResult<MarketCode> {
  const market = parseStorefrontMarket(value)
  if (!market) {
    return commerceFail(commerceValidation('Invalid or missing market parameter'))
  }
  return commerceOk(market)
}