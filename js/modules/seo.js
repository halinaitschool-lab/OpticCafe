import { SITE } from '../config/site-config.js';

/**
 * Inject search-engine verification tags when configured in site-config.
 * @param {Document} doc
 */
export function initSeo(doc = document) {
  const { googleSiteVerification, bingSiteVerification } = SITE.seo ?? {};

  if (googleSiteVerification) {
    appendMeta(doc, 'google-site-verification', googleSiteVerification);
  }

  if (bingSiteVerification) {
    appendMeta(doc, 'msvalidate.01', bingSiteVerification);
  }
}

/**
 * @param {Document} doc
 * @param {string} name
 * @param {string} content
 */
function appendMeta(doc, name, content) {
  if (doc.querySelector(`meta[name="${name}"]`)) return;

  const meta = doc.createElement('meta');
  meta.name = name;
  meta.content = content;
  doc.head.appendChild(meta);
}
