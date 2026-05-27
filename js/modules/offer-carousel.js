const DESKTOP_MEDIA = '(min-width: 480px)';
const NAV_DURATION = 0.45;
const NAV_EASE = 'power1.inOut';
const AUTO_SCROLL_MS = 2250;
/** 4 slides fit in viewport → half peek + 3 full + half peek */
const SLIDES_IN_VIEW = 4;

/**
 * GSAP horizontalLoop carousel. Auto-advances until first arrow/dot click.
 */
class OfferCarousel {
  /** @param {HTMLElement} root */
  constructor(root) {
    this.root = root;
    this.viewport = root.querySelector('.offer-carousel__viewport');
    this.track = root.querySelector('.offer-carousel__track');
    this.realSlides = [...root.querySelectorAll('.project-collection-item')];
    this.prevButton = root.querySelector('.offer-carousel__arrow--prev');
    this.nextButton = root.querySelector('.offer-carousel__arrow--next');
    this.dotsRoot = root.querySelector('.offer-carousel__dots');
    this.dots = [];
    this.index = 0;
    this.loop = null;
    this.gsapContext = null;
    this.autoScrollTimer = null;
    this.manualMode = false;
    this.mediaQuery = window.matchMedia(DESKTOP_MEDIA);
    this.onMediaChange = this.onMediaChange.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  init() {
    if (!this.track || !this.realSlides.length || !this.viewport) return;

    this.buildDots();
    this.bindControls();
    this.mediaQuery.addEventListener('change', this.onMediaChange);
    window.addEventListener('resize', this.onResize);

    if (this.mediaQuery.matches) {
      this.waitForGsap(() => this.initLoop());
    }

    this.updateDots();
    this.updateArrows();
  }

  waitForGsap(callback) {
    if (typeof gsap !== 'undefined' && typeof window.horizontalLoop === 'function') {
      callback();
      return;
    }

    window.addEventListener('load', callback, { once: true });
  }

  updateSlideMetrics() {
    const carouselWidth = this.root.classList.contains('offer-carousel--gsap')
      ? window.innerWidth
      : this.root.clientWidth;
    const slideWidth = carouselWidth / SLIDES_IN_VIEW;

    this.root.style.setProperty('--offer-carousel-slide-width', `${slideWidth}px`);
  }

  buildDots() {
    if (!this.dotsRoot) return;

    this.dotsRoot.innerHTML = '';
    this.dots = this.realSlides.map((_, slideIndex) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'offer-carousel__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Przejdź do slajdu ${slideIndex + 1}`);
      dot.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.goTo(slideIndex);
      });
      this.dotsRoot.appendChild(dot);
      return dot;
    });
  }

  bindControls() {
    this.prevButton?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.previous();
    });

    this.nextButton?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.next();
    });
  }

  onMediaChange() {
    if (this.mediaQuery.matches) {
      this.waitForGsap(() => this.initLoop());
      return;
    }

    this.destroyLoop();
    this.updateDots();
    this.updateArrows();
  }

  onResize() {
    if (!this.mediaQuery.matches) return;

    const activeIndex = this.index;
    const wasManual = this.manualMode;

    this.waitForGsap(() => {
      this.initLoop(activeIndex, wasManual);
    });
  }

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  startAutoScroll() {
    this.stopAutoScroll();

    if (this.manualMode || !this.loop || this.prefersReducedMotion()) return;

    this.autoScrollTimer = window.setInterval(() => {
      if (this.manualMode || !this.loop) return;

      this.loop.next({ duration: NAV_DURATION, ease: NAV_EASE });
    }, AUTO_SCROLL_MS);
  }

  stopAutoScroll() {
    if (this.autoScrollTimer) {
      window.clearInterval(this.autoScrollTimer);
      this.autoScrollTimer = null;
    }
  }

  enableManualMode() {
    if (this.manualMode) return;

    this.manualMode = true;
    this.stopAutoScroll();
    this.loop?.pause();
    this.root.classList.add('offer-carousel--manual');
  }

  /** @param {number} [startIndex] @param {boolean} [manualMode] */
  initLoop(startIndex = 0, manualMode = this.manualMode) {
    if (typeof gsap === 'undefined' || typeof window.horizontalLoop !== 'function') {
      return;
    }

    this.destroyLoop();
    this.manualMode = manualMode;
    this.root.classList.add('offer-carousel--gsap');
    if (this.manualMode) {
      this.root.classList.add('offer-carousel--manual');
    }
    this.updateSlideMetrics();

    requestAnimationFrame(() => {
      this.updateSlideMetrics();

      this.gsapContext = gsap.context(() => {
        this.loop = window.horizontalLoop(this.realSlides, {
          paused: true,
          center: this.viewport,
          paddingRight: 0,
          onChange: (_, index) => {
            this.index = index;
            this.updateDots();
            this.updateArrows();
          },
        });

        this.loop.toIndex(startIndex, { duration: 0 });
        this.index = this.loop.current();
        this.updateDots();

        if (!this.manualMode) {
          this.startAutoScroll();
        }
      }, this.root);
    });
  }

  destroyLoop() {
    this.stopAutoScroll();
    this.gsapContext?.revert();
    this.gsapContext = null;
    this.loop = null;
    this.manualMode = false;
    this.root.classList.remove('offer-carousel--gsap', 'offer-carousel--manual');
    this.root.style.removeProperty('--offer-carousel-slide-width');
  }

  previous() {
    if (!this.loop) return;

    this.enableManualMode();
    this.loop.previous({ duration: NAV_DURATION, ease: NAV_EASE });
  }

  next() {
    if (!this.loop) return;

    this.enableManualMode();
    this.loop.next({ duration: NAV_DURATION, ease: NAV_EASE });
  }

  goTo(slideIndex) {
    if (!this.loop) return;

    this.enableManualMode();
    this.loop.toIndex(slideIndex, { duration: NAV_DURATION, ease: NAV_EASE });
  }

  updateDots() {
    this.dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === this.index;
      dot.classList.toggle('offer-carousel__dot--active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  updateArrows() {
    if (this.prevButton) this.prevButton.disabled = false;
    if (this.nextButton) this.nextButton.disabled = false;
  }
}

/** @param {Document} [doc] */
export function initOfferCarousel(doc = document) {
  const root = doc.querySelector('[data-offer-carousel]');
  if (!root) return;

  const carousel = new OfferCarousel(root);
  carousel.init();
}
