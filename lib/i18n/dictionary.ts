import { applySitePlaceholders } from '@/lib/site'
import type { Locale } from './config'
import { translations, type TranslationKey } from './translations'

export function getDictionary(locale: Locale) {
  const t = (key: TranslationKey | string): string => translate(locale, key)
  return { locale, t }
}

export function translate(locale: Locale, key: TranslationKey | string): string {
  const dict = translations[locale] as Record<string, string>
  return applySitePlaceholders(dict[key] ?? String(key))
}