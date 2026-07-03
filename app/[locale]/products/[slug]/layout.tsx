import type { Metadata } from 'next'
import { localizedPath } from '@/lib/i18n/routes'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { getCatalogProductBySlug, getCatalogProducts } from '@/lib/commerce/catalog-source'
import { buildProductBreadcrumbJsonLd, buildProductJsonLd } from '@/lib/commerce/json-ld'
import { productSlug } from '@/lib/commerce/slugs'
import { getSiteUrl } from '@/lib/site'

const SITE_URL = getSiteUrl()

interface ProductRouteParams {
  locale: string
  slug: string
}

interface Props {
  params: Promise<ProductRouteParams>
  children: React.ReactNode
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ProductRouteParams>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) {
    return {
      title: 'Товар не найден',
      description: 'Запрошенный товар не найден в каталоге Pharmiperia.',
    }
  }

  const product = await getCatalogProductBySlug(slug, locale)
  if (!product) {
    return {
      title: 'Товар не найден',
      description: 'Запрошенный товар не найден в каталоге Pharmiperia.',
    }
  }

  const title = `${product.name} — ${product.brand}`
  const description = `${product.description}. ${product.volume}. Купить ${product.name} от ${product.brand} в Pharmiperia — французская дермо-косметика в Латвии.`
  const url = `${SITE_URL}${localizedPath(locale as Locale, `/products/${slug}`)}`
  const imageUrl = product.image.startsWith('http') ? product.image : `${SITE_URL}${product.image}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export async function generateStaticParams() {
  const { products } = await getCatalogProducts('lv')
  return products.map((product) => ({ slug: productSlug(product) }))
}

export default async function ProductLayout({ params, children }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) return <>{children}</>

  const product = await getCatalogProductBySlug(slug, locale)
  if (!product) return <>{children}</>

  const productJsonLd = buildProductJsonLd(product, locale, slug)
  const breadcrumbJsonLd = buildProductBreadcrumbJsonLd(product, locale, slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  )
}