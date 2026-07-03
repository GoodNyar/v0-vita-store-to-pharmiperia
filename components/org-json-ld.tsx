const SITE_URL = 'https://pharmiperia.lv'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Pharmiperia',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
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
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

// Server component — renders JSON-LD scripts into the page
export function OrgJsonLd() {
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
