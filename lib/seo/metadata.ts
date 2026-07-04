import type { Metadata } from 'next'
import { LOCALES, type Locale } from '@/lib/i18n/config'
import { localizedPath, stripLocalePrefix } from '@/lib/i18n/routes'
import { getSiteUrl } from '@/lib/site'

const SITE_NAME = 'Pharmiperia'

export interface PageMetadataInput {
  locale: Locale
  /** Path without locale prefix, e.g. `/delivery` or `/products/foo` */
  path: string
  title: string
  description: string
  /** Open Graph type; product pages may override in layout */
  type?: 'website' | 'article'
  image?: { url: string; width?: number; height?: number; alt?: string }
  noindex?: boolean
}

function absoluteUrl(path: string): string {
  const site = getSiteUrl()
  return path.startsWith('http') ? path : `${site}${path}`
}

/** Build hreflang alternates for lv + ru (+ x-default → default locale). */
export function buildHreflangAlternates(
  path: string,
  locale: Locale
): Metadata['alternates'] {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const { path: withoutLocale } = stripLocalePrefix(normalized)
  const basePath = withoutLocale === '/' ? '/' : withoutLocale

  const languages: Record<string, string> = {}
  for (const loc of LOCALES) {
    languages[loc] = absoluteUrl(localizedPath(loc, basePath))
  }
  languages['x-default'] = absoluteUrl(localizedPath('lv', basePath))

  return {
    canonical: absoluteUrl(localizedPath(locale, basePath)),
    languages,
  }
}

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const {
    locale,
    path,
    title,
    description,
    type = 'website',
    image,
    noindex,
  } = input

  const pagePath = localizedPath(locale, path)
  const url = absoluteUrl(pagePath)
  const ogImage = image ?? {
    url: '/og-default.jpg',
    width: 1200,
    height: 630,
    alt: `${SITE_NAME} — ${title}`,
  }
  const imageUrl = ogImage.url.startsWith('http')
    ? ogImage.url
    : absoluteUrl(ogImage.url)

  const alternates = buildHreflangAlternates(pagePath, locale)

  return {
    title,
    description,
    alternates,
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type,
      url,
      locale: locale === 'lv' ? 'lv_LV' : 'ru_RU',
      alternateLocale: locale === 'lv' ? ['ru_RU'] : ['lv_LV'],
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [
        {
          url: imageUrl,
          width: ogImage.width ?? 1200,
          height: ogImage.height ?? 630,
          alt: ogImage.alt ?? title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
  }
}