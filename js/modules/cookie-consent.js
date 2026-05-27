const STORAGE_KEY = 'opticCafeCookieConsentV1';

const DEFAULT_CONSENT = {
  necessary: true,
  media: false,
  updatedAt: '',
};

/**
 * Cookie banner with category consent and media embed gating.
 * @param {Document} doc
 */
export function initCookieConsent(doc = document) {
  const stored = getStoredConsent();
  applyMediaConsent(doc, stored.media);

  if (stored.updatedAt) return;
  injectBanner(doc, stored);
}

function injectBanner(doc, consent) {
  if (doc.querySelector('[data-cookie-banner]')) return;

  const banner = doc.createElement('aside');
  banner.className = 'cookie-banner';
  banner.dataset.cookieBanner = 'true';
  banner.innerHTML = `
    <div class="cookie-banner__content">
      <p class="cookie-banner__title">Ustawienia prywatnosci</p>
      <p class="cookie-banner__text">
        Uzywamy niezbednych technologii, aby strona dzialala poprawnie. Media zewnetrzne
        (np. YouTube) sa ladowane dopiero po Twojej zgodzie.
      </p>
      <div class="cookie-banner__categories">
        <label class="cookie-banner__option">
          <input type="checkbox" checked disabled />
          <span>Niezbedne (zawsze aktywne)</span>
        </label>
        <label class="cookie-banner__option">
          <input type="checkbox" data-consent-media />
          <span>Media zewnetrzne (YouTube)</span>
        </label>
      </div>
      <div class="cookie-banner__actions">
        <button type="button" class="cookie-banner__btn" data-consent-necessary>
          Tylko niezbedne
        </button>
        <button type="button" class="cookie-banner__btn cookie-banner__btn--primary" data-consent-all>
          Akceptuj wszystkie
        </button>
        <button type="button" class="cookie-banner__btn" data-consent-save>
          Zapisz wybor
        </button>
      </div>
    </div>
  `;

  const mediaInput = banner.querySelector('[data-consent-media]');
  if (mediaInput) mediaInput.checked = Boolean(consent.media);

  banner.querySelector('[data-consent-necessary]')?.addEventListener('click', () => {
    saveConsent({ necessary: true, media: false });
    applyMediaConsent(doc, false);
    banner.remove();
  });

  banner.querySelector('[data-consent-all]')?.addEventListener('click', () => {
    saveConsent({ necessary: true, media: true });
    applyMediaConsent(doc, true);
    banner.remove();
  });

  banner.querySelector('[data-consent-save]')?.addEventListener('click', () => {
    const media = Boolean(mediaInput?.checked);
    saveConsent({ necessary: true, media });
    applyMediaConsent(doc, media);
    banner.remove();
  });

  doc.body.appendChild(banner);
}

function applyMediaConsent(doc, mediaAllowed) {
  doc.querySelectorAll('iframe[data-consent-src]').forEach((iframe) => {
    const src = iframe.dataset.consentSrc;
    if (!src) return;

    if (mediaAllowed) {
      iframe.setAttribute('src', src);
      iframe.removeAttribute('data-consent-blocked');
    } else {
      iframe.removeAttribute('src');
      iframe.setAttribute('data-consent-blocked', 'true');
    }
  });
}

function getStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONSENT };
    return { ...DEFAULT_CONSENT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONSENT };
  }
}

function saveConsent(consent) {
  const payload = {
    necessary: true,
    media: Boolean(consent.media),
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage failures
  }
}
