import { LOCALES } from './config'
import { MARKET_DEFINITIONS } from '@/lib/commerce/markets-config'
import { localizedPath } from './routes'

/** BCP-47 tags for hreflang beyond storefront URL locales (Phase 6). */
const HREFLANG_BY_CONTENT_LOCALE: Record<string, string> = {
  lv: 'lv-LV',
  ru: 'ru-LV',
  lt: 'lt-LT',
  et: 'et-EE',
  en: 'en',
}

/**
 * Build hreflang language map for a page path.
 * Includes lv/ru storefront URLs plus market locales (lt-LT, et-EE, en) for expansion.
 */
export function buildMarketHreflangLanguages(
  basePath: string,
  absoluteUrl: (path: string) => string
): Record<string, string> {
  const normalized = basePath.startsWith('/') ? basePath : `/${basePath}`
  const languages: Record<string, string> = {}

  for (const locale of LOCALES) {
    const tag = HREFLANG_BY_CONTENT_LOCALE[locale] ?? locale
    languages[tag] = absoluteUrl(localizedPath(locale, normalized))
  }

  for (const market of MARKET_DEFINITIONS) {
    for (const contentLocale of market.locales) {
      if ((LOCALES as readonly string[]).includes(contentLocale)) continue
      const tag = HREFLANG_BY_CONTENT_LOCALE[contentLocale] ?? contentLocale
      languages[tag] = absoluteUrl(localizedPath('lv', normalized))
    }
  }

  languages['x-default'] = absoluteUrl(localizedPath('lv', normalized))
  return languages
}