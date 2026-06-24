import { SITE } from '../config/site-config.js';

/**
 * Inject LocalBusiness structured data when no page-specific schema exists.
 * @param {Document} doc
 */
export function injectLocalBusinessSchema(doc = document) {
  if (doc.querySelector('script[data-schema="local-business"]')) return;

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Optician'],
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
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

  const script = doc.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.schema = 'local-business';
  script.textContent = JSON.stringify(schema);
  doc.head.appendChild(script);
}
