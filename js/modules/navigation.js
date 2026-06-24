/**
 * In-page navigation — smooth scroll that starts immediately (no ease-in pause).
 * Replaces Webflow hash handler to avoid double-scroll and easeInOutCubic dead zone.
 * @param {Document} doc
 */
const MOBILE_MENU_QUERY = '(max-width: 991px)';
const NAV_ANCHOR_SELECTOR = 'a[href^="#"]';

/**
 * @param {number} progress 0–1
 * @returns {number}
 */
function easeOutCubic(progress) {
  return 1 - (1 - progress) ** 3;
}

/**
 * @param {Document} doc
 * @returns {boolean}
 */
function isMobileMenuOpen(doc) {
  const menuClose = doc.querySelector('.header__menu-toggle--close, .navbar-menu-icon.close');
  if (!menuClose) return false;
  return getComputedStyle(menuClose).display !== 'none';
}

/**
 * @param {Document} doc
 */
function closeMobileMenu(doc) {
  if (!window.matchMedia(MOBILE_MENU_QUERY).matches || !isMobileMenuOpen(doc)) return;

  const menuBlock = doc.querySelector('.header__nav, .navbar-menu-block');
  const menuOpen = doc.querySelector('.header__menu-toggle--open, .navbar-menu-icon.open');
  const menuClose = doc.querySelector('.header__menu-toggle--close, .navbar-menu-icon.close');
  if (!menuBlock || !menuOpen || !menuClose) return;

  menuBlock.classList.add('navbar-menu-block--instant');
  menuOpen.style.display = 'block';
  menuClose.style.display = 'none';
  menuBlock.style.height = '0px';
  menuBlock.style.overflow = 'hidden';

  window.requestAnimationFrame(() => {
    menuBlock.classList.remove('navbar-menu-block--instant');
  });
}

/**
 * @param {Document} doc
 * @returns {number}
 */
function getFixedHeaderOffset(doc) {
  const header = doc.querySelector('header, .header, .navbar-section, .w-nav:not([data-no-scroll])');
  if (!header) return 0;

  const position = getComputedStyle(header).position;
  if (position !== 'fixed' && position !== 'sticky') return 0;

  return header.getBoundingClientRect().height;
}

/**
 * @param {Document} doc
 * @param {HTMLElement} target
 * @returns {number}
 */
function getTargetScrollTop(doc, target) {
  return Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - getFixedHeaderOffset(doc),
  );
}

/**
 * @param {number} distance
 * @returns {number}
 */
function getScrollDuration(distance) {
  return Math.min(1000, Math.max(450, Math.abs(distance) * 0.35));
}

/**
 * @param {number} targetY
 */
function scrollToY(targetY) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (distance === 0) return;

  const duration = getScrollDuration(distance);
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    window.scrollTo(0, startY + distance * easeOutCubic(progress));

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      window.dispatchEvent(new Event('scroll'));
    }
  }

  requestAnimationFrame(step);
}

/**
 * @param {Document} doc
 * @param {HTMLElement} target
 */
function scrollToSection(doc, target) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    window.scrollTo(0, getTargetScrollTop(doc, target));
    window.dispatchEvent(new Event('scroll'));
    return;
  }

  scrollToY(getTargetScrollTop(doc, target));
}

/**
 * @param {HTMLAnchorElement} anchor
 * @param {Document} doc
 * @returns {HTMLElement | null}
 */
function getAnchorTarget(anchor, doc) {
  const href = anchor.getAttribute('href');
  if (!href || href === '#') return null;

  const targetId = href.slice(1);
  if (!targetId) return null;

  return doc.getElementById(targetId);
}

/**
 * @param {Document} doc
 */
export function initNavigation(doc = document) {
  const menuOpen = doc.querySelector('.header__menu-toggle--open, .navbar-menu-icon.open');
  const menuClose = doc.querySelector('.header__menu-toggle--close, .navbar-menu-icon.close');
  const menuBlock = doc.querySelector('.header__nav, .navbar-menu-block');

  if (menuOpen && menuClose && menuBlock) {
    menuOpen.setAttribute('role', 'button');
    menuOpen.setAttribute('aria-label', 'Otwórz menu');
    menuOpen.setAttribute('tabindex', '0');
    menuClose.setAttribute('role', 'button');
    menuClose.setAttribute('aria-label', 'Zamknij menu');
    menuClose.setAttribute('tabindex', '0');

    [menuOpen, menuClose].forEach((control) => {
      control.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          control.click();
        }
      });
    });

    if (menuBlock.tagName !== 'NAV' && !menuBlock.getAttribute('role')) {
      menuBlock.setAttribute('role', 'navigation');
      menuBlock.setAttribute('aria-label', 'Menu główne');
    }
  }

  doc.addEventListener(
    'click',
    (event) => {
      const anchor = event.target.closest(NAV_ANCHOR_SELECTOR);
      if (!anchor) return;

      const target = getAnchorTarget(anchor, doc);
      if (!target) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      closeMobileMenu(doc);
      scrollToSection(doc, target);
      history.pushState(null, '', `#${target.id}`);
    },
    true,
  );
}
