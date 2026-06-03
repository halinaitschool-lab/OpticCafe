import { SITE } from '../config/site-config.js';

/**
 * Fixed “Umów wizytę” CTA — visible after the first viewport of scroll.
 * @param {Document} doc
 */
export function initStickyBooking(doc = document) {
  if (doc.querySelector('.sticky-booking')) return;

  const link = doc.createElement('a');
  link.href = SITE.bookingUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'sticky-booking';
  link.setAttribute('aria-label', 'Umów wizytę (otwiera się w nowej karcie)');
  link.textContent = 'UMÓW WIZYTĘ';
  link.setAttribute('aria-hidden', 'true');
  link.tabIndex = -1;

  doc.body.appendChild(link);

  const updateVisibility = () => {
    const pastFirstScreen = window.scrollY >= window.innerHeight;
    link.classList.toggle('sticky-booking--visible', pastFirstScreen);
    link.setAttribute('aria-hidden', pastFirstScreen ? 'false' : 'true');
    link.tabIndex = pastFirstScreen ? 0 : -1;
  };

  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility, { passive: true });
  updateVisibility();
}
