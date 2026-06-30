import { SITE } from '../config/site-config.js';

/**
 * Inject page-appropriate JSON-LD (homepage: business + website; service pages: breadcrumbs).
 * @param {Document} doc
 */
export function injectStructuredData(doc = document) {
  if (doc.querySelector('.single-about-section')) {
    injectBreadcrumbSchema(doc);
    return;
  }

  injectLocalBusinessSchema(doc);
  injectWebSiteSchema(doc);
}

/**
 * @param {Document} doc
 */
function injectLocalBusinessSchema(doc = document) {
  if (doc.querySelector('script[data-schema="local-business"]')) return;

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Optician'],
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    alternateName: SITE.alternateNames,
    legalName: SITE.legalName,
    description: SITE.description,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phone,
    image: `${SITE.url}/${SITE.socialImage}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressCountry: SITE.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    openingHours: SITE.openingHours,
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: 'Poznań',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Oferta salonu optycznego',
      itemListElement: SITE.services.map((service, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          category: service.category,
          url: `${SITE.url}/project/${service.slug}.html`,
        },
      })),
    },
    sameAs: [
      SITE.mapsUrl,
      SITE.bookingUrl,
      ...(SITE.social?.map((profile) => profile.url) ?? []),
    ],
    inLanguage: SITE.language,
  };

  appendJsonLd(doc, 'local-business', schema);
}

/**
 * @param {Document} doc
 */
function injectWebSiteSchema(doc = document) {
  if (doc.querySelector('script[data-schema="website"]')) return;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    alternateName: SITE.alternateNames,
    url: SITE.url,
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: {
      '@id': `${SITE.url}/#business`,
    },
  };

  appendJsonLd(doc, 'website', schema);
}

/**
 * @param {Document} doc
 */
function injectBreadcrumbSchema(doc = document) {
  if (doc.querySelector('script[data-schema="breadcrumb"]')) return;

  const slug = window.location.pathname.match(/project\/([^/]+)\.html/)?.[1];
  if (!slug) return;

  const service = SITE.services.find((entry) => entry.slug === slug);
  const pageName = service?.name ?? doc.title.split('|')[0].trim();
  const pageUrl = `${SITE.url}/project/${slug}.html`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Strona główna',
        item: `${SITE.url}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Oferta',
        item: `${SITE.url}/#Project`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: pageName,
        item: pageUrl,
      },
    ],
  };

  appendJsonLd(doc, 'breadcrumb', schema);
}

/**
 * @param {Document} doc
 * @param {string} key
 * @param {Record<string, unknown>} schema
 */
function appendJsonLd(doc, key, schema) {
  const script = doc.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.schema = key;
  script.textContent = JSON.stringify(schema);
  doc.head.appendChild(script);
}
