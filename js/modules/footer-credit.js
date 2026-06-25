import { SITE } from '../config/site-config.js';

/**
 * @param {Document} doc
 */
export function initFooterCredit(doc = document) {
  const { developer } = SITE;
  if (!developer?.url || !developer?.name) return;

  doc.querySelectorAll('[data-developer-credit]').forEach((slot) => {
    if (slot.childElementCount > 0) return;

    const creditText = developer.creditText || 'Realizacja i wdrożenie strony';
    const link = doc.createElement('a');
    link.href = developer.url;
    link.className = 'footer-link footer-legal__credit-link';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = developer.name;
    link.setAttribute(
      'aria-label',
      `${creditText} — ${developer.name} (otwiera się w nowej karcie)`,
    );

    slot.append(`${creditText} — `, link);
    slot.hidden = false;
  });
}
