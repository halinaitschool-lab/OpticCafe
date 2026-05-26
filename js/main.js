import { initAccessibility } from './modules/accessibility.js';
import { initContactForm } from './modules/form.js';
import { initNavigation } from './modules/navigation.js';
import { injectLocalBusinessSchema } from './modules/schema.js';

/**
 * Application bootstrap — single responsibility: wire modules on DOM ready.
 */
function bootstrap() {
  initNavigation();
  initContactForm();
  initAccessibility();
  injectLocalBusinessSchema();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
