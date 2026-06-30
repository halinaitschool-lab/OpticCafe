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
  initCookieSettingsDelegation(doc);
  prepareYoutubeEmbeds(doc);
  ensureCookieSettingsLink(doc);

  const stored = getStoredConsent();
  applyMediaConsent(doc, stored.media);

  if (stored.updatedAt) return;
  injectBanner(doc, stored);
}

/**
 * Re-open the cookie banner with the visitor's saved choices.
 * @param {Document} doc
 */
export function openCookieSettings(doc = document) {
  closeBanner(doc);
  injectBanner(doc, getStoredConsent());
}

/**
 * @param {Document} doc
 */
function initCookieSettingsDelegation(doc) {
  if (doc.documentElement.dataset.cookieDelegationBound) return;
  doc.documentElement.dataset.cookieDelegationBound = 'true';

  doc.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-cookie-settings], #open-cookie-settings');
    if (!trigger) return;

    event.preventDefault();
    event.stopPropagation();
    openCookieSettings(doc);
  });

  doc.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!doc.querySelector('[data-cookie-banner]')) return;
    closeBanner(doc);
  });

  bindCookieSettingsButtons(doc);
}

/**
 * @param {Document} doc
 */
function bindCookieSettingsButtons(doc) {
  doc.querySelectorAll('[data-open-cookie-settings], #open-cookie-settings').forEach((trigger) => {
    if (trigger.dataset.cookieSettingsBound) return;
    trigger.dataset.cookieSettingsBound = 'true';
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openCookieSettings(doc);
    });
  });
}

/**
 * @param {Document} doc
 * @param {{ necessary: boolean, media: boolean, updatedAt?: string }} consent
 * @returns {HTMLElement | null}
 */
function injectBanner(doc, consent) {
  if (doc.querySelector('[data-cookie-banner]')) return null;

  const banner = doc.createElement('aside');
  banner.className = 'cookie-banner cookie-banner--modal';
  banner.setAttribute('data-cookie-banner', 'true');
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-modal', 'true');
  banner.setAttribute('aria-label', 'Ustawienia prywatności i cookies');
  banner.innerHTML = `
    <div class="cookie-banner__content">
      <p class="cookie-banner__title">Ustawienia prywatności</p>
      <p class="cookie-banner__text">
        Używamy niezbędnych technologii, aby strona działała poprawnie. Filmy YouTube
        ładujemy dopiero po Twojej zgodzie na media zewnętrzne.
      </p>
      <div class="cookie-banner__categories">
        <label class="cookie-banner__option">
          <input type="checkbox" checked disabled />
          <span>Niezbędne (zawsze aktywne)</span>
        </label>
        <label class="cookie-banner__option">
          <input type="checkbox" data-consent-media />
          <span>Media zewnętrzne (YouTube)</span>
        </label>
      </div>
      <div class="cookie-banner__actions">
        <button type="button" class="cookie-banner__btn" data-consent-necessary>
          Tylko niezbędne
        </button>
        <button type="button" class="cookie-banner__btn cookie-banner__btn--primary" data-consent-all>
          Akceptuj wszystkie
        </button>
        <button type="button" class="cookie-banner__btn" data-consent-save>
          Zapisz wybór
        </button>
      </div>
    </div>
  `;

  const mediaInput = banner.querySelector('[data-consent-media]');
  if (mediaInput) mediaInput.checked = Boolean(consent.media);

  banner.querySelector('[data-consent-necessary]')?.addEventListener('click', () => {
    saveConsent({ necessary: true, media: false });
    applyMediaConsent(doc, false);
    closeBanner(doc);
  });

  banner.querySelector('[data-consent-all]')?.addEventListener('click', () => {
    enableMediaConsent(doc);
    closeBanner(doc);
  });

  banner.querySelector('[data-consent-save]')?.addEventListener('click', () => {
    const media = Boolean(mediaInput?.checked);
    saveConsent({ necessary: true, media });
    applyMediaConsent(doc, media);
    closeBanner(doc);
  });

  banner.addEventListener('click', (event) => {
    if (event.target === banner) {
      closeBanner(doc);
    }
  });

  doc.body.appendChild(banner);
  doc.body.classList.add('cookie-banner-open');
  bindCookieSettingsButtons(doc);
  mediaInput?.focus();

  return banner;
}

/**
 * @param {Document} doc
 */
function closeBanner(doc) {
  doc.querySelector('[data-cookie-banner]')?.remove();
  doc.body.classList.remove('cookie-banner-open');
}

/**
 * Footer link to change cookie choices later.
 * @param {Document} doc
 */
function ensureCookieSettingsLink(doc) {
  const legalNav = doc.querySelector('.footer-legal__links');
  if (!legalNav || legalNav.querySelector('[data-open-cookie-settings]')) return;

  const link = doc.createElement('a');
  link.className = 'footer-link';
  link.href = '#ustawienia-cookies';
  link.dataset.openCookieSettings = 'true';
  link.textContent = 'Ustawienia cookies';
  legalNav.appendChild(link);
}

/**
 * @param {Document} doc
 */
function prepareYoutubeEmbeds(doc) {
  doc.querySelectorAll('iframe[data-consent-src]').forEach((iframe) => {
    ensureEmbedPrompt(doc, iframe);
  });
}

/**
 * @param {Document} doc
 * @param {HTMLIFrameElement} iframe
 */
function ensureEmbedPrompt(doc, iframe) {
  const block = iframe.closest('.single-image-block');
  if (!block) return;

  block.classList.add('youtube-embed');

  if (block.querySelector('[data-youtube-consent-prompt]')) return;

  const src = iframe.dataset.consentSrc || '';
  const videoId = src.match(/embed\/([^?&]+)/)?.[1];
  const watchUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : 'https://www.youtube.com/@OPTIC-CAFE';

  const prompt = doc.createElement('div');
  prompt.className = 'youtube-embed__prompt';
  prompt.dataset.youtubeConsentPrompt = 'true';
  prompt.innerHTML = `
    <p class="youtube-embed__eyebrow">YouTube</p>
    <p class="youtube-embed__text">
      Film nie jest odtwarzany, dopóki nie zezwolisz na media zewnętrzne (YouTube).
      Możesz zmienić decyzję w każdej chwili.
    </p>
    <div class="youtube-embed__actions">
      <button type="button" class="youtube-embed__btn youtube-embed__btn--primary" data-enable-youtube>
        Zezwól i odtwórz film
      </button>
      <button type="button" class="youtube-embed__btn" data-open-cookie-settings>
        Zmień ustawienia cookies
      </button>
      <a class="youtube-embed__btn" href="${watchUrl}" target="_blank" rel="noopener noreferrer">
        Otwórz na YouTube
      </a>
    </div>
  `;

  prompt.querySelector('[data-enable-youtube]')?.addEventListener('click', () => {
    enableMediaConsent(doc);
    closeBanner(doc);
  });

  block.appendChild(prompt);
}

/**
 * @param {Document} doc
 */
function enableMediaConsent(doc) {
  saveConsent({ necessary: true, media: true });
  applyMediaConsent(doc, true);
}

/**
 * @param {Document} doc
 * @param {boolean} mediaAllowed
 */
function applyMediaConsent(doc, mediaAllowed) {
  doc.querySelectorAll('iframe[data-consent-src]').forEach((iframe) => {
    const src = iframe.dataset.consentSrc;
    if (!src) return;

    const prompt = iframe
      .closest('.youtube-embed')
      ?.querySelector('[data-youtube-consent-prompt]');

    if (mediaAllowed) {
      iframe.setAttribute('src', src);
      iframe.removeAttribute('data-consent-blocked');
      prompt?.setAttribute('hidden', '');
    } else {
      iframe.removeAttribute('src');
      iframe.setAttribute('data-consent-blocked', 'true');
      prompt?.removeAttribute('hidden');
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
