import { getSiteUrl } from '@/lib/site'

function buildJsonLd() {
  const siteUrl = getSiteUrl()

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pharmiperia',
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+371-29-952-852',
      contactType: 'customer service',
      availableLanguage: ['Russian', 'Latvian'],
    },
    sameAs: [],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pharmiperia',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return { organizationJsonLd, websiteJsonLd }
}

export function OrgJsonLd() {
  const { organizationJsonLd, websiteJsonLd } = buildJsonLd()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    </>
  )
}