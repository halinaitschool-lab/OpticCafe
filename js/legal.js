import { initCookieConsent, openCookieSettings } from './modules/cookie-consent.js';
import { initSeo } from './modules/seo.js';

function bootstrap() {
  initCookieConsent();
  initSeo();
  bindCookieSettingsButton();
}

function bindCookieSettingsButton() {
  const button = document.getElementById('open-cookie-settings');
  if (!button || button.dataset.cookieSettingsBound) return;

  button.dataset.cookieSettingsBound = 'true';
  button.addEventListener('click', (event) => {
    event.preventDefault();
    openCookieSettings();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
