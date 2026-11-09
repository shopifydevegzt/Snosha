/* =========================================================================
   SNOSHA — PROJECT SCRIPTS
   Home for Snosha-specific JavaScript (Horizon v4.4.0). Loaded once as a module by
   snippets/scripts.liquid (fetchpriority low).

   Rules for anything added here:
   - isolated, idempotent modules (custom elements, or guarded initializers);
   - support Theme Editor re-renders (custom elements re-run connectedCallback on section reload)
     and clean up listeners in disconnectedCallback;
   - only behavior that HTML/CSS or Horizon's own components can't provide.
   Do not move or rewrite Horizon's own modules here.
   ========================================================================= */

/* -------------------------------------------------------------------------
   <snosha-care-carousel> — Choose Your Care (sections/snosha-choose-care.liquid)
   The carousel itself is native CSS scroll-snap (touch, trackpad, wheel, keyboard focus, RTL).
   This element only adds what CSS can't do everywhere:
   1. Centers the featured card once on load (Figma mobile state). Chromium does this in CSS with
      `scroll-initial-target`; this is the fallback for other browsers. Never re-applied after the
      user scrolls.
   2. Mouse dragging (native scrollers can't be dragged with a mouse; the scrollbar is hidden).
   3. Progress fallback: writes --snosha-care-progress (0–1) when scroll-driven animations aren't
      supported (Firefox), so the CSS bar still follows the scroll.
   It does nothing when the row isn't scrollable (desktop static row).
   ------------------------------------------------------------------------- */
const DRAG_THRESHOLD = 6;
const supportsScrollTimeline = CSS.supports('animation-timeline', 'scroll()');

class SnoshaCareCarousel extends HTMLElement {
  /** @type {AbortController | undefined} */
  #controller;
  #userScrolled = false;
  #dragging = false;
  #suppressClick = false;

  get #scrollable() {
    return this.scrollWidth - this.clientWidth > 1;
  }

  connectedCallback() {
    this.#controller = new AbortController();
    const { signal } = this.#controller;

    this.addEventListener('pointerdown', this.#onPointerDown, { signal });
    this.addEventListener('click', this.#onClick, { capture: true, signal });
    this.addEventListener('dragstart', (event) => event.preventDefault(), { signal });
    this.addEventListener('scroll', this.#onScroll, { passive: true, signal });
    // Any user input before the initial centering runs cancels it.
    for (const type of ['wheel', 'touchstart', 'keydown']) {
      this.addEventListener(type, () => (this.#userScrolled = true), { passive: true, once: true, signal });
    }

    // Wait for layout (fonts, zoom) before centering.
    requestAnimationFrame(() => requestAnimationFrame(() => this.#centerFeatured()));
  }

  disconnectedCallback() {
    this.#controller?.abort();
  }

  #centerFeatured() {
    if (this.#userScrolled || !this.#scrollable) return this.#updateProgress();
    const card = this.querySelector('.snosha-care-card--featured');
    if (card) {
      const cardBox = card.getBoundingClientRect();
      const box = this.getBoundingClientRect();
      const delta = cardBox.left + cardBox.width / 2 - (box.left + box.width / 2);
      if (Math.abs(delta) > 1) this.scrollTo({ left: this.scrollLeft + delta, behavior: 'instant' });
    }
    this.#updateProgress();
  }

  #onScroll = () => {
    this.#updateProgress();
  };

  #updateProgress() {
    if (supportsScrollTimeline) return;
    const max = this.scrollWidth - this.clientWidth;
    // scrollLeft runs 0 → negative in RTL, 0 → positive in LTR
    const progress = max > 1 ? Math.min(1, Math.abs(this.scrollLeft) / max) : 0;
    this.closest('.snosha-choose-care')?.style.setProperty('--snosha-care-progress', progress.toFixed(4));
  }

  /** @param {PointerEvent} event */
  #onPointerDown = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !this.#scrollable) return;
    this.#userScrolled = true;
    this.#suppressClick = false;

    const startX = event.clientX;
    const startScroll = this.scrollLeft;
    const controller = new AbortController();
    const { signal } = controller;

    /** @param {PointerEvent} moveEvent */
    const onMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      if (!this.#dragging) {
        if (Math.abs(delta) < DRAG_THRESHOLD) return;
        this.#dragging = true;
        this.#suppressClick = true;
        this.setAttribute('dragging', '');
        this.setPointerCapture(moveEvent.pointerId);
      }
      this.scrollLeft = startScroll - delta;
    };

    const onUp = () => {
      controller.abort();
      if (!this.#dragging) return;
      this.#dragging = false;
      this.removeAttribute('dragging');
      this.#snapToNearest();
    };

    this.addEventListener('pointermove', onMove, { signal });
    this.addEventListener('pointerup', onUp, { signal });
    this.addEventListener('pointercancel', onUp, { signal });
    this.addEventListener('lostpointercapture', onUp, { signal });
  };

  /** Scrolls to the card closest to the center; mandatory snapping settles the exact position. */
  #snapToNearest() {
    const box = this.getBoundingClientRect();
    const center = box.left + box.width / 2;
    let best = 0;
    let bestDistance = Infinity;
    for (const card of this.querySelectorAll('.snosha-care-card')) {
      const cardBox = card.getBoundingClientRect();
      const delta = cardBox.left + cardBox.width / 2 - center;
      if (Math.abs(delta) < bestDistance) {
        bestDistance = Math.abs(delta);
        best = delta;
      }
    }
    this.scrollTo({ left: this.scrollLeft + best, behavior: 'smooth' });
  }

  /** @param {MouseEvent} event */
  #onClick = (event) => {
    if (!this.#suppressClick) return;
    this.#suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  };
}

if (!customElements.get('snosha-care-carousel')) {
  customElements.define('snosha-care-carousel', SnoshaCareCarousel);
}
