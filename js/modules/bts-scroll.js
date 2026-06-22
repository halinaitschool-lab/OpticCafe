/**
 * Responsive BTS quote scroll — reveals full text on every screen width.
 * Uses scrollY-based progress (stable on iOS) and cached overflow measurements.
 * @param {Document} doc
 */
export function initBtsScroll(doc = document) {
  const block = doc.querySelector('.bts-scroll-block');
  const line1 = doc.querySelector('.bts-text._1 .bts-text-inner');
  const line2 = doc.querySelector('.bts-text._2 .bts-text-inner');
  const viewport = block?.querySelector('.bts-section');

  if (!block || !line1 || !line2 || !viewport) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktopMedia = window.matchMedia('(min-width: 992px)');
  let ticking = false;
  let scrollStart = 0;
  let scrollEnd = 0;
  let overflow1 = 0;
  let overflow2 = 0;
  let line1StartX = 0;
  let line2StartX = 0;
  let line2EndX = 0;
  let lastX1 = null;
  let lastX2 = null;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getOverflowPx(el, container) {
    return Math.max(0, Math.ceil(el.scrollWidth - container.clientWidth));
  }

  function measureLayout() {
    setShift(line1, 0);
    setShift(line2, 0);

    const scrollable = block.offsetHeight - window.innerHeight;
    scrollStart = block.getBoundingClientRect().top + window.scrollY;
    scrollEnd = scrollStart + Math.max(0, scrollable);
    overflow1 = getOverflowPx(line1, viewport);
    overflow2 = getOverflowPx(line2, viewport);
    line1StartX = desktopMedia.matches ? Math.round(viewport.clientWidth * 0.3) : 0;

    if (desktopMedia.matches) {
      const viewportRect = viewport.getBoundingClientRect();
      const styles = getComputedStyle(viewport);
      const padLeft = parseFloat(styles.paddingLeft) || 0;
      const line2Rect = line2.getBoundingClientRect();
      const centerX = viewportRect.left + viewportRect.width / 2;
      const clipLeft = viewportRect.left + padLeft;

      // Start: last letter at screen center
      line2StartX = Math.round(centerX - line2Rect.right);
      // End: first letters ("A zmysły…") visible on the left inside padding
      line2EndX = Math.round(clipLeft - line2Rect.left);
      // Safety: always shift enough to reveal full line width
      line2EndX = Math.max(line2EndX, overflow2);
    } else {
      line2StartX = 0;
      line2EndX = overflow2;
    }

    lastX1 = null;
    lastX2 = null;
  }

  function getLine1X(line1Progress) {
    if (!overflow1) return line1StartX * (1 - line1Progress);

    const endX = -overflow1;
    if (desktopMedia.matches) {
      return Math.round(line1StartX * (1 - line1Progress) + endX * line1Progress);
    }

    return Math.round(endX * line1Progress);
  }

  function getLine2X(line2Progress) {
    if (!desktopMedia.matches) {
      return overflow2 ? Math.round(overflow2 * line2Progress) : 0;
    }

    return Math.round(line2StartX + (line2EndX - line2StartX) * line2Progress);
  }

  function getScrollProgress() {
    const range = scrollEnd - scrollStart;
    if (range <= 0) return 0;
    return clamp((window.scrollY - scrollStart) / range, 0, 1);
  }

  function setShift(el, px) {
    el.style.transform = `translate3d(${px}px, 0, 0)`;
  }

  function applyTransforms() {
    if (reducedMotion) {
      setShift(line1, 0);
      setShift(line2, 0);
      return;
    }

    const progress = getScrollProgress();
    const line1Progress = clamp(progress / 0.65, 0, 1);
    const line2Progress = desktopMedia.matches
      ? clamp(progress / 0.65, 0, 1)
      : clamp((progress - 0.12) / 0.78, 0, 1);

    const x1 = getLine1X(line1Progress);
    const x2 = getLine2X(line2Progress);

    if (x1 !== lastX1) {
      setShift(line1, x1);
      lastX1 = x1;
    }

    if (x2 !== lastX2) {
      setShift(line2, x2);
      lastX2 = x2;
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      applyTransforms();
      ticking = false;
    });
  }

  let layoutFrame = 0;

  function scheduleLayoutMeasure() {
    if (layoutFrame) return;
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = 0;
      measureLayout();
      applyTransforms();
    });
  }

  const resizeObserver =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(scheduleLayoutMeasure)
      : null;

  resizeObserver?.observe(block);
  resizeObserver?.observe(viewport);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', scheduleLayoutMeasure, { passive: true });
  desktopMedia.addEventListener?.('change', scheduleLayoutMeasure);

  if (doc.fonts?.ready) {
    doc.fonts.ready.then(scheduleLayoutMeasure);
  } else {
    scheduleLayoutMeasure();
  }
}
