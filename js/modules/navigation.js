/**
 * Smooth in-page navigation and mobile menu accessibility.
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

  doc.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href')?.slice(1);
      if (!targetId) return;

      const target = doc.getElementById(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', `#${targetId}`);
    });
  });
}
