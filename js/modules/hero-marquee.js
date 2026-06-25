/** Desktop hero marquee reference (scroll-motion a-5). */
const REF_DURATION_S = 80;
const MOVE_PERCENT = 88;
const REF_FONT_SIZE_PX = 300;
/** Hero text sits in the right ~66% panel on desktop. */
const DESKTOP_VISIBLE_RATIO = 0.66;
const DESKTOP_MQ = '(min-width: 992px)';

/** @type {gsap.core.Timeline | null} */
let marqueeTimeline = null;
let resizeTimer = null;

/**
 * Match desktop marquee speed on smaller screens.
 * Webflow uses a fixed 80s for -88% of element width; smaller mobile type
 * moves fewer pixels in the same time, so we shorten duration proportionally.
 */
function getDurationSeconds(heading) {
  const fontSize = Number.parseFloat(getComputedStyle(heading).fontSize);
  const widthRatio = fontSize / REF_FONT_SIZE_PX;
  const visibleRatio = window.matchMedia(DESKTOP_MQ).matches ? DESKTOP_VISIBLE_RATIO : 1;
  return REF_DURATION_S * widthRatio * (visibleRatio / DESKTOP_VISIBLE_RATIO);
}

function startMarquee(heading) {
  if (typeof gsap === 'undefined') return;

  marqueeTimeline?.kill();
  gsap.killTweensOf(heading);

  const duration = getDurationSeconds(heading);

  marqueeTimeline = gsap.timeline({ repeat: -1 });
  marqueeTimeline
    .fromTo(heading, { xPercent: 0 }, { xPercent: -MOVE_PERCENT, duration, ease: 'none' })
    .set(heading, { xPercent: 0 });
}

/**
 * Responsive hero title marquee (homepage).
 * @param {Document} doc
 */
export function initHeroMarquee(doc = document) {
  const heading = doc.querySelector('.hero-heading');
  if (!heading) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const run = () => {
    requestAnimationFrame(() => startMarquee(heading));
  };

  if (doc.fonts?.ready) {
    doc.fonts.ready.then(run);
  } else {
    window.addEventListener('load', run, { once: true });
  }

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(run, 150);
  });
}
