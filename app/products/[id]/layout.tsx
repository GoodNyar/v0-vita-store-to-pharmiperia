import type { Metadata } from 'next'
import { products } from '@/lib/data'

const SITE_URL = 'https://pharmiperia.lv'

interface Props {
  params: Promise<{ id: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = products.find((p) => p.id === parseInt(id, 10))

  if (!product) {
    return {
      title: 'Товар не найден',
      description: 'Запрошенный товар не найден в каталоге Pharmiperia.',
    }
  }

  const title = `${product.name} — ${product.brand}`
  const description = `${product.description}. ${product.volume}. Купить ${product.name} от ${product.brand} в Pharmiperia — французская дермо-косметика в Латвии.`
  const url = `${SITE_URL}/products/${product.id}`
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
  return products.map((p) => ({ id: String(p.id) }))
}

export default async function ProductLayout({ params, children }: Props) {
  const { id } = await params
  const product = products.find((p) => p.id === parseInt(id, 10))

  if (!product) return <>{children}</>

  const imageUrl = product.image.startsWith('http') ? product.image : `${SITE_URL}${product.image}`
  const url = `${SITE_URL}/products/${product.id}`

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: imageUrl,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'EUR',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Pharmiperia',
      },
    },
    aggregateRating: product.reviewCount > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Pharmiperia', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: product.category, item: `${SITE_URL}/category/${product.category}` },
      { '@type': 'ListItem', position: 3, name: product.name, item: url },
    ],
  }

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
