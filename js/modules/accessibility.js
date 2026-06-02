/**
 * Progressive enhancement: labels, landmarks, decorative content, external links.
 * @param {Document} doc
 */
import { SITE } from '../config/site-config.js';

export function initAccessibility(doc = document) {
  ensureSkipLink(doc);
  enhanceContactForm(doc);
  enhanceOfferCards(doc);
  enhanceDecorativeImages(doc);
  enhanceFooterBrand(doc);
  enhanceExternalLinks(doc);
  enhanceMenuToggles(doc);
}

/**
 * @param {Document} doc
 */
function ensureSkipLink(doc) {
  if (doc.querySelector('.skip-link')) return;

  const main =
    doc.querySelector('#main-content') ||
    doc.querySelector('.about-section') ||
    doc.querySelector('#About');

  if (!main) return;

  if (!main.id) {
    main.id = 'main-content';
  }

  if (!main.hasAttribute('tabindex')) {
    main.setAttribute('tabindex', '-1');
  }

  const skip = doc.createElement('a');
  skip.href = `#${main.id}`;
  skip.className = 'skip-link';
  skip.textContent = 'Przejdź do treści głównej';
  doc.body.prepend(skip);
}

/**
 * @param {Document} doc
 */
function enhanceContactForm(doc) {
  const fields = [
    { id: 'Name', label: 'Imię' },
    { id: 'Email', label: 'Adres e-mail' },
    { id: 'Message', label: 'Treść wiadomości' },
  ];

  fields.forEach(({ id, label }) => {
    const control = doc.getElementById(id);
    if (!control || doc.querySelector(`label[for="${id}"]`)) return;

    const fieldLabel = doc.createElement('label');
    fieldLabel.className = 'sr-only';
    fieldLabel.htmlFor = id;
    fieldLabel.textContent = label;
    control.before(fieldLabel);

    if (!control.getAttribute('aria-required') && control.hasAttribute('required')) {
      control.setAttribute('aria-required', 'true');
    }
  });

  const form = doc.querySelector('.contact__form, #email-form');
  const success = doc.querySelector('.contact__success, .w-form-done');
  const failure = doc.querySelector('.contact__error, .w-form-fail');

  if (form && success) {
    success.setAttribute('role', 'status');
    success.setAttribute('aria-live', 'polite');
  }

  if (form && failure) {
    failure.setAttribute('role', 'alert');
    failure.setAttribute('aria-live', 'assertive');
  }
}

/**
 * @param {Document} doc
 */
function enhanceOfferCards(doc) {
  doc.querySelectorAll('.offer-card.project-item, a.offer-card').forEach((link) => {
    const title = link
      .querySelector('.offer-card__title, .project-item-title')
      ?.textContent?.trim();
    const category = link
      .querySelector('.offer-card__category, .project-item-category')
      ?.textContent?.trim();

    if (title) {
      link.setAttribute('aria-label', category ? `${title} — ${category}` : title);
    }
  });
}

/**
 * @param {Document} doc
 */
function enhanceDecorativeImages(doc) {
  doc.querySelectorAll('img:not([alt])').forEach((img) => {
    img.setAttribute('alt', '');
  });

  doc.querySelectorAll('.work-image, .process-image').forEach((img) => {
    if (!img.getAttribute('alt')?.trim()) {
      img.setAttribute('alt', '');
      img.setAttribute('aria-hidden', 'true');
    }
  });

  doc.querySelectorAll('.header__menu-toggle, .navbar-menu-icon').forEach((img) => {
    img.setAttribute('alt', '');
    img.setAttribute('aria-hidden', 'true');
  });
}

/**
 * @param {Document} doc
 */
function enhanceFooterBrand(doc) {
  const footerBrand = doc.querySelector('.footer-flex-2');
  if (!footerBrand || footerBrand.querySelector('.footer__brand-sr')) return;

  const srBrand = doc.createElement('p');
  srBrand.className = 'sr-only footer__brand-sr';
  srBrand.textContent = 'Optic Café';
  footerBrand.prepend(srBrand);

  footerBrand.querySelectorAll('.footer-heading-block').forEach((block) => {
    block.setAttribute('aria-hidden', 'true');
  });
}

/**
 * @param {Document} doc
 */
function enhanceExternalLinks(doc) {
  const siteUrl = new URL(SITE.url);

  doc.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    let url;
    try {
      url = new URL(href, doc.baseURI);
    } catch {
      return;
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return;
    }

    const currentOrigin = new URL(doc.baseURI).origin;
    const sitePathPrefix = siteUrl.pathname.replace(/\/$/, '') || '';
    const isOwnSite =
      url.hostname === siteUrl.hostname &&
      (sitePathPrefix === '' || url.pathname.startsWith(sitePathPrefix));

    if (url.origin === currentOrigin || isOwnSite) {
      return;
    }

    link.setAttribute('target', '_blank');

    if (!link.getAttribute('rel')?.includes('noopener')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }

    if (link.getAttribute('aria-label') || link.textContent?.includes('(otwiera')) {
      return;
    }

    const text = link.textContent?.trim() || 'Link';
    link.setAttribute('aria-label', `${text} (otwiera się w nowej karcie)`);
  });
}

/**
 * @param {Document} doc
 */
function enhanceMenuToggles(doc) {
  doc.querySelectorAll('.header__menu-toggle--open, .navbar-menu-icon.open').forEach((toggle) => {
    if (toggle.getAttribute('role') === 'button') {
      toggle.setAttribute('tabindex', '0');
    }
  });

  doc.querySelectorAll('.header__menu-toggle--close, .navbar-menu-icon.close').forEach((toggle) => {
    if (toggle.getAttribute('role') === 'button') {
      toggle.setAttribute('tabindex', '0');
    }
  });
}
