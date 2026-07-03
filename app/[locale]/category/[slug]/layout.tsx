import type { Metadata } from 'next'
import { categories } from '@/lib/data'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getSiteUrl } from '@/lib/site'

const SITE_URL = getSiteUrl()

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  skincare:      { title: 'Уход за лицом', description: 'Очищение, увлажнение, сыворотки и маски для лица. Лучшие французские марки в Pharmiperia.' },
  haircare:      { title: 'Уход за волосами', description: 'Шампуни, кондиционеры и маски для волос от французских брендов — Vichy, Klorane, Ducray.' },
  bodycare:      { title: 'Уход за телом', description: 'Кремы, масла и средства для тела от французских аптечных брендов в Pharmiperia.' },
  sunprotection: { title: 'Солнцезащита', description: 'Солнцезащитные средства SPF 30–50+ для лица и тела. Avène, La Roche-Posay, Bioderma.' },
  makeup:        { title: 'Декоративная косметика', description: 'Натуральная и дерматологически протестированная декоративная косметика для чувствительной кожи.' },
  mencare:       { title: 'Уход для мужчин', description: 'Средства для бритья, увлажнение и очищение для мужской кожи от французских брендов.' },
  womencare:     { title: 'Уход для женщин', description: 'Антивозрастной уход, осветление, парфюмерия и наборы для женщин от французских марок.' },
  brands:        { title: 'Все бренды', description: 'Официальные французские бренды дермо-косметики — Bioderma, Vichy, Avène, La Roche-Posay и другие.' },
}

interface Props {
  params: Promise<{ locale: string; slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}

  const meta = CATEGORY_META[slug]
  const categoryName = meta?.title ?? categories.find((c) => c.id === slug)?.name ?? slug
  const description =
    meta?.description ??
    `Купить ${categoryName} в Pharmiperia — французская дермо-косметика с доставкой по Латвии.`

  return buildPageMetadata({
    locale: locale as Locale,
    path: `/category/${slug}`,
    title: categoryName,
    description,
  })
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.id }))
}

export default async function CategoryLayout({ params, children }: Props) {
  const { slug } = await params
  const meta = CATEGORY_META[slug]
  const categoryName = meta?.title ?? categories.find((c) => c.id === slug)?.name ?? slug
  const url = `${SITE_URL}/category/${slug}`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Pharmiperia', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: categoryName, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  )
}
