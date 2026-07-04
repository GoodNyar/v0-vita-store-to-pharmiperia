import 'server-only'

import type { Locale } from '@/lib/i18n/config'
import { translations, type TranslationKey } from '@/lib/i18n/translations'
import { applySitePlaceholders } from '@/lib/site'

/** Server-side dictionary access (Phase 3 PR-06 — namespace split foundation). */
export function getServerTranslation(locale: Locale, key: TranslationKey): string {
  const dict = translations[locale] as Record<string, string>
  return applySitePlaceholders(dict[key] ?? key)
}

export function getServerDictionary(locale: Locale): Record<string, string> {
  return translations[locale] as Record<string, string>
}