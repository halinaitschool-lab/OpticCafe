import { initBtsScroll } from './modules/bts-scroll.js';
import { initHeroMarquee } from './modules/hero-marquee.js';
import { initAccessibility } from './modules/accessibility.js';
import { initCookieConsent } from './modules/cookie-consent.js';
import { initContactForm } from './modules/form.js';
import { initNavigation } from './modules/navigation.js';
import { initOfferCarousel } from './modules/offer-carousel.js';
import { injectLocalBusinessSchema } from './modules/schema.js';
import { initFooterCredit } from './modules/footer-credit.js';
import { initSocialLinks } from './modules/social-links.js';
import { initStickyBooking } from './modules/sticky-booking.js';

/**
 * Application bootstrap — single responsibility: wire modules on DOM ready.
 */
function bootstrap() {
  initNavigation();
  initContactForm();
  initAccessibility();
  initCookieConsent();
  initStickyBooking();
  initSocialLinks();
  initFooterCredit();
  initBtsScroll();
  initHeroMarquee();
  initOfferCarousel();
  injectLocalBusinessSchema();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
