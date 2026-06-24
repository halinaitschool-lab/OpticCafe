import { SITE } from '../config/site-config.js';

/** @type {Record<string, string>} */
const SOCIAL_ICONS = {
  instagram: 'fa-brands fa-instagram',
  facebook: 'fa-brands fa-facebook-f',
  youtube: 'fa-brands fa-youtube',
};

/**
 * @param {Document} doc
 */
export function initSocialLinks(doc = document) {
  const containers = doc.querySelectorAll('[data-social-links]');
  if (!containers.length || !SITE.social?.length) return;

  containers.forEach((container) => {
    if (container.childElementCount > 0) return;

    const variant = container.dataset.socialVariant || 'footer';
    container.classList.add(`social-links--${variant}`);

    SITE.social.forEach(({ id, url, label }) => {
      const link = doc.createElement('a');
      link.href = url;
      link.className = `social-links__item social-links__item--${id}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${label} (otwiera się w nowej karcie)`);

      const icon = doc.createElement('i');
      icon.className = SOCIAL_ICONS[id] || 'fa-solid fa-link';
      icon.setAttribute('aria-hidden', 'true');
      link.appendChild(icon);

      container.appendChild(link);
    });
  });
}
