/** @typedef {import('../types/site.js').SiteConfig} SiteConfig */

/** @type {SiteConfig} */
export const SITE = {
  name: 'Optic Café',
  legalName: 'Salon optyczny Optic Cafe Olaf Tabaczyński',
  description:
    'Salon optyczny w centrum Poznania. Badania wzroku, terapia widzenia, dobór opraw i soczewek okularowych. Umów wizytę u optometrysty i ortoptystki.',
  locale: 'pl_PL',
  language: 'pl',
  url: 'https://www.optic-cafe.pl',
  alternateNames: [
    'Optic Cafe',
    'Optic Cafe Poznań',
    'Optic Café Poznań',
    'Salon optyczny Optic Cafe',
  ],
  seo: {
    /** Paste token from Google Search Console → HTML tag method */
    googleSiteVerification: 'vobWmK1pd11XXN4cdrhFs42aCK7MIG_34pgbwwyLyrI',
    /** Paste token from Bing Webmaster Tools */
    bingSiteVerification: '',
  },
  email: 'maestro@awm.pl',
  phone: '+48690910091',
  phoneDisplay: '+48 690 91 00 91',
  bookingUrl: 'https://www.myglasson.com/optic-cafe',
  address: {
    street: 'ul. Garbary 65',
    postalCode: '61-578',
    city: 'Poznań',
    country: 'PL',
  },
  geo: {
    latitude: 52.4081333,
    longitude: 16.9377291,
  },
  mapsUrl:
    'https://www.google.com/maps/place/Salon+optyczny+-+Optic+Cafe+Olaf+Tabaczy%C5%84ski/@52.4081365,16.9351542,17z',
  social: [
    {
      id: 'instagram',
      url: 'https://www.instagram.com/optic_cafe/',
      label: 'Instagram Optic Café',
    },
    {
      id: 'facebook',
      url: 'https://www.facebook.com/OpticCafeOlafTabaczynski/',
      label: 'Facebook Optic Café',
    },
    {
      id: 'youtube',
      url: 'https://www.youtube.com/@OPTIC-CAFE',
      label: 'YouTube Optic Café',
    },
  ],
  developer: {
    name: 'Halina IT',
    url: 'https://halinait.com/',
    creditText: 'Realizacja i wdrożenie strony',
  },
  fonts: ['Antonio:300,400,500,600,700', 'Poppins:300,400,500,600,700'],
  socialImage: 'images/hero/1.jpg',
  favicon: 'images/logo_optic_cafe.jpeg',
  appleTouchIcon: 'images/logo_optic_cafe.jpeg',
  openingHours: ['Mo-Fr 10:00-18:00', 'Sa 10:00-14:00'],
  services: [
    {
      slug: 'salon-optyczny-w-centrum-poznania',
      name: 'Optic Café — salon optyczny',
      category: 'Salon optyczny',
    },
    {
      slug: 'optometria-i-badania-wzroku',
      name: 'Badania wzroku',
      category: 'Optometria',
    },
    {
      slug: 'ortoptyka-i-rehabilitacja-widzenia',
      name: 'Terapia widzenia',
      category: 'Ortoptyka',
    },
    {
      slug: 'nowoczesne-rozwiazania-dla-korekcji-wzroku',
      name: 'Soczewki okularowe',
      category: 'Technologia',
    },
    {
      slug: 'dobor-opraw-okularowych',
      name: 'Dobór opraw',
      category: 'Stylizacja',
    },
    {
      slug: 'od-dzieci-po-seniorow',
      name: 'Od dzieci po seniorów',
      category: 'Opieka okulistyczna',
    },
  ],
};
