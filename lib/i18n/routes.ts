import { type Locale, DEFAULT_LOCALE, isLocale } from "./config"

/** Build a locale-prefixed path, e.g. `/lv/products/foo`. */
export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (normalized === "/") return `/${locale}`
  return `/${locale}${normalized}`
}

/** Strip the locale segment from a pathname, if present. */
export function stripLocalePrefix(pathname: string): {
  locale: Locale | null
  path: string
} {
  const segments = pathname.split("/")
  const maybeLocale = segments[1]
  if (maybeLocale && isLocale(maybeLocale)) {
    const rest = segments.slice(2).join("/")
    return { locale: maybeLocale, path: rest ? `/${rest}` : "/" }
  }
  return { locale: null, path: pathname }
}

/** Replace the locale segment while preserving the rest of the path. */
export function swapLocaleInPath(pathname: string, newLocale: Locale): string {
  const { path } = stripLocalePrefix(pathname)
  return localizedPath(newLocale, path)
}

export function localeFromPathname(pathname: string): Locale {
  const { locale } = stripLocalePrefix(pathname)
  return locale ?? DEFAULT_LOCALE
}