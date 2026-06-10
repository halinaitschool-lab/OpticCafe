/**
 * Responsive BTS quote scroll — reveals full text on every screen width.
 * Replaces fixed-% Webflow animation (same desktop feel, adaptive on mobile/tablet).
 * @param {Document} doc
 */
export function initBtsScroll(doc = document) {
  const block = doc.querySelector('.bts-scroll-block');
  const line1 = doc.querySelector('.bts-text._1');
  const line2 = doc.querySelector('.bts-text._2');
  const viewport = block?.querySelector('.bts-section');

  if (!block || !line1 || !line2 || !viewport) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ticking = false;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getOverflowPx(el, container) {
    return Math.max(0, el.scrollWidth - container.clientWidth);
  }

  function getScrollProgress() {
    const scrollable = block.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    return clamp(-block.getBoundingClientRect().top / scrollable, 0, 1);
  }

  function applyTransforms() {
    const overflow1 = getOverflowPx(line1, viewport);
    const overflow2 = getOverflowPx(line2, viewport);

    if (reducedMotion || (overflow1 === 0 && overflow2 === 0)) {
      line1.style.transform = 'translate3d(0, 0, 0)';
      line2.style.transform = 'translate3d(0, 0, 0)';
      return;
    }

    const progress = getScrollProgress();
    const line1Progress = clamp(progress / 0.65, 0, 1);
    const line2Progress = clamp((progress - 0.12) / 0.78, 0, 1);

    line1.style.transform = `translate3d(${-overflow1 * line1Progress}px, 0, 0)`;
    line2.style.transform = `translate3d(${overflow2 * line2Progress}px, 0, 0)`;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      applyTransforms();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  applyTransforms();
}
