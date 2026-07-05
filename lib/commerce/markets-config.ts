/** Static market definitions — source of truth for resolution tests; DB seed mirrors this. */

export const MARKET_CODES = ['lv', 'lt', 'ee'] as const
export type MarketCode = (typeof MARKET_CODES)[number]

export const DEFAULT_MARKET_CODE: MarketCode = 'lv'

export interface MarketDefinition {
  code: MarketCode
  countryIso: string
  name: string
  defaultLocale: string
  /** Content locales served for this market (hreflang + API). */
  locales: readonly string[]
  currency: 'EUR'
  vatRateBps: number
  ossEnabled: boolean
  legalEntityName: string
}

export const MARKET_DEFINITIONS: readonly MarketDefinition[] = [
  {
    code: 'lv',
    countryIso: 'LV',
    name: 'Latvia',
    defaultLocale: 'lv',
    locales: ['lv', 'ru'],
    currency: 'EUR',
    vatRateBps: 2100,
    ossEnabled: false,
    legalEntityName: 'Pharmiperia SIA',
  },
  {
    code: 'lt',
    countryIso: 'LT',
    name: 'Lithuania',
    defaultLocale: 'lt',
    locales: ['lt', 'en'],
    currency: 'EUR',
    vatRateBps: 2100,
    ossEnabled: true,
    legalEntityName: 'Pharmiperia SIA',
  },
  {
    code: 'ee',
    countryIso: 'EE',
    name: 'Estonia',
    defaultLocale: 'et',
    locales: ['et', 'en'],
    currency: 'EUR',
    vatRateBps: 2200,
    ossEnabled: true,
    legalEntityName: 'Pharmiperia SIA',
  },
] as const

const marketByCode = new Map(MARKET_DEFINITIONS.map((m) => [m.code, m]))

export function isMarketCode(value: string | null | undefined): value is MarketCode {
  return value != null && (MARKET_CODES as readonly string[]).includes(value)
}

export function getMarketDefinition(code: MarketCode): MarketDefinition {
  const market = marketByCode.get(code)
  if (!market) {
    throw new Error(`Unknown market code: ${code}`)
  }
  return market
}

/** Map ISO country (from geo header) to market code. */
export function marketCodeFromCountryIso(countryIso: string | null | undefined): MarketCode | null {
  if (!countryIso) return null
  const upper = countryIso.toUpperCase()
  const match = MARKET_DEFINITIONS.find((m) => m.countryIso === upper)
  return match?.code ?? null
}