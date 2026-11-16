/**
 * Snosha carousel progress — the one progress implementation for Snosha carousels built on
 * Horizon's native slideshow (<slideshow-component> > <slideshow-container> > <slideshow-slides>).
 *
 * Shared model (assets/dev1.css, "SNOSHA — CAROUSEL PROGRESS"): a fill that starts at the Figma
 * width (--snosha-progress-initial) at the inline start and grows to the full track at the end of the
 * scroll. Drawn by CSS and bound to the real scroll position with a named scroll-timeline
 * (--snosha-carousel-scroll); browsers without scroll-driven animations (e.g. Safari < 26, Firefox)
 * get the same bar sized from --snosha-carousel-progress (0–1), written by this module.
 * Progress = |scrollLeft| / (scrollWidth − clientWidth) (scrollLeft runs 0 → negative in RTL).
 *
 * 1. Display-only bars (#4 Collections, #5 Featured collection, #12 Blog): the bar is the
 *    ::before / ::after of the slideshow-component; nothing here runs where scroll-driven animations
 *    are supported. Fallback: one delegated capture listener writes the variable on the
 *    slideshow-component, for every instance, including sections re-rendered by the Theme Editor.
 *
 * 2. Interactive bar (opt-in, S08 Reviews screenshots): <snosha-carousel-progress> placed inside the
 *    slideshow-component (the slideshow snippet's `controls` slot), with role="scrollbar":
 *    click / tap / drag on the bar scrolls the carousel there, ArrowLeft / ArrowRight move one card,
 *    Home / End jump to the ends; keeps aria-valuenow and [data-scrollable] (CSS hides the bar when
 *    nothing scrolls) up to date, and writes the fallback variable on itself. Listeners and observers
 *    are released on disconnect (Theme Editor re-renders create a fresh element).
 *
 * Horizon keeps owning swipe, drag on the cards, snapping and arrows in every case.
 */
const SCROLLER = '[data-snosha-carousel-progress] slideshow-component.resource-list__carousel > slideshow-container > slideshow-slides';
const supportsScrollTimeline = CSS.supports('animation-timeline', 'scroll()');

/**
 * Scroll progress of a horizontal scroller, 0 (start) – 1 (end), in RTL and LTR.
 * @param {Element} scroller
 */
const scrollProgress = (scroller) => {
  const max = scroller.scrollWidth - scroller.clientWidth;
  return max > 1 ? Math.min(1, Math.abs(scroller.scrollLeft) / max) : 0;
};

/* 1. Display-only bars: fallback for browsers without scroll-driven animations ------------------ */
if (!supportsScrollTimeline && !window.snoshaCarouselProgress) {
  window.snoshaCarouselProgress = true;

  /** @param {Element} scroller */
  const update = (scroller) => {
    scroller
      .closest('slideshow-component')
      ?.style.setProperty('--snosha-carousel-progress', scrollProgress(scroller).toFixed(4));
  };

  let frame = 0;
  const updateAll = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => document.querySelectorAll(SCROLLER).forEach(update));
  };

  // Scroll events don't bubble, so listen in the capture phase.
  document.addEventListener(
    'scroll',
    (event) => {
      if (event.target instanceof Element && event.target.matches(SCROLLER)) update(event.target);
    },
    { capture: true, passive: true }
  );
  window.addEventListener('resize', updateAll, { passive: true });
  document.addEventListener('shopify:section:load', updateAll);
}

/* 2. Interactive bar: <snosha-carousel-progress> ------------------------------------------------- */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

class SnoshaCarouselProgress extends HTMLElement {
  /** @type {HTMLElement | null} */
  #scroller = null;
  /** @type {AbortController | undefined} */
  #controller;
  /** @type {ResizeObserver | undefined} */
  #resizeObserver;
  /** @type {MutationObserver | undefined} */
  #mutationObserver;
  #frame = 0;
  #dragging = false;

  connectedCallback() {
    const scroller = this.closest('slideshow-component')?.querySelector(':scope > slideshow-container > slideshow-slides');
    this.#scroller = scroller instanceof HTMLElement ? scroller : null;
    if (!this.#scroller) return;

    this.#controller = new AbortController();
    const { signal } = this.#controller;
    this.#scroller.addEventListener('scroll', this.#schedule, { passive: true, signal });
    this.addEventListener('pointerdown', this.#handlePointerDown, { signal });
    this.addEventListener('pointermove', this.#handlePointerMove, { signal });
    this.addEventListener('pointerup', this.#handlePointerEnd, { signal });
    this.addEventListener('pointercancel', this.#handlePointerEnd, { signal });
    this.addEventListener('keydown', this.#handleKeydown, { signal });

    // Viewport / card size changes and cards added or removed.
    this.#resizeObserver = new ResizeObserver(this.#schedule);
    this.#resizeObserver.observe(this.#scroller);
    this.#mutationObserver = new MutationObserver(this.#schedule);
    this.#mutationObserver.observe(this.#scroller, { childList: true });

    this.#update();
  }

  disconnectedCallback() {
    this.#controller?.abort();
    this.#resizeObserver?.disconnect();
    this.#mutationObserver?.disconnect();
    cancelAnimationFrame(this.#frame);
  }

  get #isRtl() {
    return this.#scroller ? getComputedStyle(this.#scroller).direction === 'rtl' : false;
  }

  /** Figma start width of the fill (same variable as the display-only bars). */
  get #initial() {
    const value = parseFloat(getComputedStyle(this).getPropertyValue('--snosha-progress-initial'));
    return Number.isFinite(value) ? Math.min(0.99, Math.max(0, value)) : 0;
  }

  #update = () => {
    const scroller = this.#scroller;
    if (!scroller) return;
    const progress = scrollProgress(scroller);
    this.toggleAttribute('data-scrollable', scroller.scrollWidth - scroller.clientWidth > 1);
    this.setAttribute('data-ready', '');
    this.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    if (!supportsScrollTimeline) this.style.setProperty('--snosha-carousel-progress', progress.toFixed(4));
  };

  #schedule = () => {
    cancelAnimationFrame(this.#frame);
    this.#frame = requestAnimationFrame(this.#update);
  };

  /**
   * @param {number} progress 0 (start) – 1 (end)
   * @param {boolean} smooth
   */
  #scrollToProgress(progress, smooth) {
    const scroller = this.#scroller;
    if (!scroller) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    const clamped = Math.min(1, Math.max(0, progress));
    scroller.scrollTo({
      left: (this.#isRtl ? -1 : 1) * clamped * max,
      behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto',
    });
  }

  /**
   * Progress that puts the end of the fill under the pointer (inverse of
   * fill = initial + (1 − initial) × progress, measured from the inline start).
   * @param {PointerEvent} event
   */
  #progressAt(event) {
    const rect = this.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const fromStart = (this.#isRtl ? rect.right - event.clientX : event.clientX - rect.left) / rect.width;
    const initial = this.#initial;
    return (fromStart - initial) / (1 - initial);
  }

  /** @param {PointerEvent} event */
  #handlePointerDown = (event) => {
    if (!this.hasAttribute('data-scrollable') || event.button > 0) return;
    this.#dragging = true;
    this.setPointerCapture(event.pointerId);
    this.#scrollToProgress(this.#progressAt(event), true);
  };

  /** @param {PointerEvent} event */
  #handlePointerMove = (event) => {
    if (!this.#dragging) return;
    this.#scrollToProgress(this.#progressAt(event), false);
  };

  /** @param {PointerEvent} event */
  #handlePointerEnd = (event) => {
    if (!this.#dragging) return;
    this.#dragging = false;
    if (this.hasPointerCapture(event.pointerId)) this.releasePointerCapture(event.pointerId);
  };

  /** @param {KeyboardEvent} event */
  #handleKeydown = (event) => {
    const scroller = this.#scroller;
    if (!scroller || !this.hasAttribute('data-scrollable')) return;
    const behavior = reducedMotion.matches ? 'auto' : 'smooth';
    const slide = scroller.querySelector('slideshow-slide');
    const gap = parseFloat(getComputedStyle(scroller).columnGap) || 0;
    const step = slide instanceof HTMLElement ? slide.offsetWidth + gap : scroller.clientWidth;

    switch (event.key) {
      case 'ArrowRight':
        scroller.scrollBy({ left: step, behavior });
        break;
      case 'ArrowLeft':
        scroller.scrollBy({ left: -step, behavior });
        break;
      case 'Home':
        this.#scrollToProgress(0, true);
        break;
      case 'End':
        this.#scrollToProgress(1, true);
        break;
      default:
        return;
    }
    event.preventDefault();
  };
}

if (!customElements.get('snosha-carousel-progress')) {
  customElements.define('snosha-carousel-progress', SnoshaCarouselProgress);
}
