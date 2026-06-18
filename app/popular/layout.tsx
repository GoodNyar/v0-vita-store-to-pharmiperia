import type { Metadata } from 'next'

const SITE_URL = 'https://pharmiperia.lv'

export const metadata: Metadata = {
  title: 'Популярные товары',
  description: 'Самые популярные средства французской дермо-косметики в Латвии — Bioderma, Vichy, La Roche-Posay, Avène и другие бренды в Pharmiperia.',
  alternates: { canonical: `${SITE_URL}/popular` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/popular`,
    title: 'Популярные товары | Pharmiperia',
    description: 'Самые популярные средства французской дермо-косметики в Латвии.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Популярные товары Pharmiperia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Популярные товары | Pharmiperia',
    description: 'Самые популярные средства французской дермо-косметики в Латвии.',
  },
}

export default function PopularLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
