/**
 * Progressive enhancement for images and external links.
 * @param {Document} doc
 */
export function initAccessibility(doc = document) {
  doc.querySelectorAll('img:not([alt])').forEach((img) => {
    img.setAttribute('alt', '');
  });

  doc.querySelectorAll('a[target="_blank"]').forEach((link) => {
    if (!link.getAttribute('rel')?.includes('noopener')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}
