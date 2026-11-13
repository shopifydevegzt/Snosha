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
   SnoshaSnapCarousel — shared base for Snosha's native scroll-snap carousels
   (<snosha-care-carousel>, <snosha-reels-carousel>).
   The carousel itself is native CSS scroll-snap (touch, trackpad, wheel, keyboard focus, RTL).
   This base only adds what CSS can't do everywhere:
   1. Centers one card once on load (subclass picks it). Chromium can do this in CSS with
      `scroll-initial-target`; this is the fallback for other browsers. Never re-applied after the
      user scrolls, on resize or on video playback.
   2. Mouse dragging (native scrollers can't be dragged with a mouse; the scrollbar is hidden),
      with the click that ends a drag swallowed so links/buttons don't fire.
   3. Progress fallback: reports scroll progress (0–1) when scroll-driven animations aren't
      supported (Firefox), so the CSS bar still follows the scroll.
   It does nothing when the row isn't scrollable.
   ------------------------------------------------------------------------- */
const DRAG_THRESHOLD = 6;
const supportsScrollTimeline = CSS.supports('animation-timeline', 'scroll()');

class SnoshaSnapCarousel extends HTMLElement {
  /** @type {AbortController | undefined} */
  #controller;
  #userScrolled = false;
  #dragging = false;
  #suppressClick = false;

  /** Selector for the snap cards. @returns {string} */
  get cardSelector() {
    return '';
  }

  /** Card to center once on load; null keeps the native start position. @returns {Element | null} */
  getInitialCard() {
    return null;
  }

  /** Receives the progress fallback (0–1). @param {number} _progress */
  setProgress(_progress) {}

  /** Whether a mouse press may start a drag. @param {PointerEvent} _event */
  canStartDrag(_event) {
    return true;
  }

  get isScrollable() {
    return this.scrollWidth - this.clientWidth > 1;
  }

  connectedCallback() {
    this.#controller = new AbortController();
    const { signal } = this.#controller;

    this.addEventListener('pointerdown', this.#onPointerDown, { signal });
    // Window capture runs before Horizon's declarative `on:click` handlers (document capture,
    // assets/component.js), so the click that ends a drag can't start a video or follow a link.
    window.addEventListener('click', this.#onClick, { capture: true, signal });
    this.addEventListener('dragstart', (event) => event.preventDefault(), { signal });
    this.addEventListener('scroll', this.#onScroll, { passive: true, signal });
    // Any user input before the initial centering runs cancels it.
    for (const type of ['wheel', 'touchstart', 'keydown']) {
      this.addEventListener(type, () => (this.#userScrolled = true), { passive: true, once: true, signal });
    }

    this.onConnect(signal);
  }

  disconnectedCallback() {
    this.#controller?.abort();
  }

  /**
   * Default start-up: wait for layout (fonts, zoom) before centering.
   * @param {AbortSignal} _signal
   */
  onConnect(_signal) {
    requestAnimationFrame(() => requestAnimationFrame(() => this.centerInitialCard()));
  }

  centerInitialCard() {
    if (this.#userScrolled || !this.isScrollable) return this.updateProgress();
    const card = this.getInitialCard();
    if (card) this.scrollCardToCenter(card, 'instant');
    this.updateProgress();
  }

  /**
   * @param {Element} card
   * @param {ScrollBehavior} behavior
   */
  scrollCardToCenter(card, behavior) {
    const cardBox = card.getBoundingClientRect();
    const box = this.getBoundingClientRect();
    const delta = cardBox.left + cardBox.width / 2 - (box.left + box.width / 2);
    if (Math.abs(delta) > 1) this.scrollTo({ left: this.scrollLeft + delta, behavior });
  }

  #onScroll = () => {
    this.updateProgress();
  };

  updateProgress() {
    if (supportsScrollTimeline) return;
    const max = this.scrollWidth - this.clientWidth;
    // scrollLeft runs 0 → negative in RTL, 0 → positive in LTR
    this.setProgress(max > 1 ? Math.min(1, Math.abs(this.scrollLeft) / max) : 0);
  }

  /** @param {PointerEvent} event */
  #onPointerDown = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !this.isScrollable) return;
    if (!this.canStartDrag(event)) return;
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
    for (const card of this.querySelectorAll(this.cardSelector)) {
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
    if (!this.#suppressClick || !(event.target instanceof Node) || !this.contains(event.target)) return;
    this.#suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  };
}

/* -------------------------------------------------------------------------
   <snosha-care-carousel> — Choose Your Care (sections/snosha-choose-care.liquid)
   Opens on the featured card (< 990px, where the row scrolls); progress → --snosha-care-progress.
   ------------------------------------------------------------------------- */
class SnoshaCareCarousel extends SnoshaSnapCarousel {
  get cardSelector() {
    return '.snosha-care-card';
  }

  getInitialCard() {
    return this.querySelector('.snosha-care-card--featured');
  }

  /** @param {number} progress */
  setProgress(progress) {
    this.closest('.snosha-choose-care')?.style.setProperty('--snosha-care-progress', progress.toFixed(4));
  }
}

if (!customElements.get('snosha-care-carousel')) {
  customElements.define('snosha-care-carousel', SnoshaCareCarousel);
}

/* -------------------------------------------------------------------------
   <snosha-reels-carousel> — Reels (sections/snosha-reels.liquid)
   - Mobile (< 750px) opens on the middle reel: index floor((count - 1) / 2) of the rendered reels
     (1, 2 → 1st; 3, 4 → 2nd; 5, 6 → 3rd; 7 → 4th). Chromium does it in CSS (`scroll-initial-target`
     on .snosha-reel--initial, same index from Liquid). Elsewhere it runs synchronously on upgrade —
     card widths are fixed lengths, so the layout is final — and CSS keeps the row transparent until
     [data-positioned], so the first reel is never painted first. If the row is first laid out at
     >= 750px, the start is applied the first time it becomes the mobile scroller instead. Applied
     once per element: Theme Editor block changes re-render the section (new element); later
     resizing and playback never re-center, and any user input before it cancels it.
   - Toggles [data-overflow] on .snosha-reels (ResizeObserver) so the progress bar only shows when
     the reels overflow. Progress fallback → --snosha-reels-progress.
   - Starting one video pauses the others in this carousel (native controls can resume any of them).
   - A mouse press on a playing video (its controls) never starts a drag.
   - Theme Editor: selecting a Reel block scrolls it into view.
   ------------------------------------------------------------------------- */
const reelsMobileQuery = window.matchMedia('(max-width: 749px)');

class SnoshaReelsCarousel extends SnoshaSnapCarousel {
  get cardSelector() {
    return '.snosha-reel';
  }

  get #root() {
    return this.closest('.snosha-reels');
  }

  getInitialCard() {
    if (!reelsMobileQuery.matches) return null;
    const cards = this.querySelectorAll(this.cardSelector);
    if (cards.length === 0) return null;
    return cards[Math.floor((cards.length - 1) / 2)] ?? null;
  }

  /** @param {number} progress */
  setProgress(progress) {
    this.#root?.style.setProperty('--snosha-reels-progress', progress.toFixed(4));
  }

  /** @param {PointerEvent} event */
  canStartDrag(event) {
    return !(event.target instanceof Element && event.target.closest('video'));
  }

  /** @param {AbortSignal} signal */
  onConnect(signal) {
    this.#updateOverflow();
    this.#applyInitialPosition();
    this.setAttribute('data-positioned', '');

    // Re-evaluates overflow (progress bar visibility). The only movement it can trigger is the
    // pending one-time middle-reel start (see #applyInitialPosition); never a re-center.
    const observer = new ResizeObserver(() => {
      this.#updateOverflow();
      this.#applyInitialPosition();
    });
    observer.observe(this);
    if (this.firstElementChild) observer.observe(this.firstElementChild);
    signal.addEventListener('abort', () => observer.disconnect(), { once: true });

    this.addEventListener('play', this.#onPlay, { capture: true, signal });
    this.addEventListener('shopify:block:select', this.#onBlockSelect, { signal });
  }

  #initialPositionApplied = false;

  /**
   * One-time middle-reel start for the mobile layout. Applied the first time the carousel is laid
   * out as the mobile scroller, not only at load: when the page first renders at >= 750px (Theme
   * Editor desktop → mobile toggle, DevTools device mode, tablet rotation), `scroll-initial-target`
   * has already been consumed by the desktop layout and the row would stay on the first reel.
   * Runs before paint (connect / ResizeObserver), so there is no visible jump. Cancelled by any
   * user input (base class), and never repeated afterwards.
   */
  #applyInitialPosition() {
    if (this.#initialPositionApplied || !reelsMobileQuery.matches || !this.isScrollable) return;
    this.#initialPositionApplied = true;
    this.centerInitialCard();
  }

  #updateOverflow() {
    this.#root?.toggleAttribute('data-overflow', this.isScrollable);
    this.updateProgress();
  }

  /** @param {Event} event */
  #onPlay = (event) => {
    for (const video of this.querySelectorAll('video')) {
      if (video !== event.target && !video.paused) video.pause();
    }
  };

  /** @param {Event} event */
  #onBlockSelect = (event) => {
    const card = event.target instanceof Element ? event.target.closest(this.cardSelector) : null;
    if (card && this.isScrollable) this.scrollCardToCenter(card, 'smooth');
  };
}

if (!customElements.get('snosha-reels-carousel')) {
  customElements.define('snosha-reels-carousel', SnoshaReelsCarousel);
}

/* -------------------------------------------------------------------------
   <snosha-bundle-hotspot> — Bundle showcase (sections/snosha-bundle.liquid)
   One hotspot dot + its product popup (a plain link to the component product; never adds to cart).
   - Mouse: opens on hover; stays open while the pointer moves from the dot into the popup (the
     popup is a child of this element and CSS bridges the gap); closes shortly after leaving both.
   - Touch and keyboard: the dot is a button that toggles the popup (aria-expanded). Tapping or
     clicking outside, Escape, or focus leaving the hotspot closes it. Only one popup is open at a time.
   - Keeps the popup inside the viewport: shifts it sideways and flips it below the dot when there
     is no room above (writes --snosha-popup-shift and [data-below]).
   ------------------------------------------------------------------------- */
const HOTSPOT_CLOSE_DELAY = 120;
const VIEWPORT_MARGIN = 12;

class SnoshaBundleHotspot extends HTMLElement {
  /** @type {AbortController | undefined} */
  #controller;
  /** @type {AbortController | undefined} */
  #openController;
  /** @type {number | undefined} */
  #closeTimer;
  #lastPointerType = '';

  get #button() {
    return /** @type {HTMLButtonElement | null} */ (this.querySelector('.snosha-bundle__dot'));
  }

  get #popup() {
    return /** @type {HTMLElement | null} */ (this.querySelector('.snosha-bundle__popup'));
  }

  get isOpen() {
    return this.hasAttribute('open');
  }

  connectedCallback() {
    this.#controller = new AbortController();
    const { signal } = this.#controller;

    this.addEventListener('pointerdown', (event) => (this.#lastPointerType = event.pointerType), { signal });
    this.addEventListener('pointerenter', this.#onPointerEnter, { signal });
    this.addEventListener('pointerleave', this.#onPointerLeave, { signal });
    this.addEventListener('focusout', this.#onFocusOut, { signal });
    this.#button?.addEventListener('click', this.#onButtonClick, { signal });
  }

  disconnectedCallback() {
    this.#controller?.abort();
    this.#openController?.abort();
    clearTimeout(this.#closeTimer);
  }

  open() {
    clearTimeout(this.#closeTimer);
    if (this.isOpen) return;
    const popup = this.#popup;
    if (!popup) return;

    for (const other of document.querySelectorAll('snosha-bundle-hotspot[open]')) {
      if (other !== this && other instanceof SnoshaBundleHotspot) other.close();
    }

    this.setAttribute('open', '');
    popup.hidden = false;
    this.#button?.setAttribute('aria-expanded', 'true');
    this.#place(popup);

    this.#openController = new AbortController();
    const { signal } = this.#openController;
    document.addEventListener('pointerdown', this.#onDocumentPointerDown, { signal });
    document.addEventListener('keydown', this.#onKeyDown, { signal });
  }

  close() {
    clearTimeout(this.#closeTimer);
    if (!this.isOpen) return;
    this.removeAttribute('open');
    this.removeAttribute('data-below');
    this.style.removeProperty('--snosha-popup-shift');
    const popup = this.#popup;
    if (popup) popup.hidden = true;
    this.#button?.setAttribute('aria-expanded', 'false');
    this.#openController?.abort();
  }

  /** @param {HTMLElement} popup */
  #place(popup) {
    this.removeAttribute('data-below');
    this.style.removeProperty('--snosha-popup-shift');

    let box = popup.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    let shift = 0;
    if (box.left < VIEWPORT_MARGIN) shift = VIEWPORT_MARGIN - box.left;
    else if (box.right > viewportWidth - VIEWPORT_MARGIN) shift = viewportWidth - VIEWPORT_MARGIN - box.right;
    if (shift) this.style.setProperty('--snosha-popup-shift', `${Math.round(shift)}px`);

    if (box.top < VIEWPORT_MARGIN) {
      this.setAttribute('data-below', '');
      box = popup.getBoundingClientRect();
      // No room below either: keep it above (the page can scroll it into view).
      if (box.bottom > window.innerHeight - VIEWPORT_MARGIN) this.removeAttribute('data-below');
    }
  }

  /** @param {PointerEvent} event */
  #onPointerEnter = (event) => {
    if (event.pointerType !== 'mouse') return;
    this.open();
  };

  /** @param {PointerEvent} event */
  #onPointerLeave = (event) => {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(this.#closeTimer);
    this.#closeTimer = window.setTimeout(() => {
      if (!this.matches(':focus-within')) this.close();
    }, HOTSPOT_CLOSE_DELAY);
  };

  #onButtonClick = () => {
    // A mouse click on a dot that hover already opened keeps it open.
    const pointerType = this.#lastPointerType;
    this.#lastPointerType = '';
    if (pointerType === 'mouse' && this.isOpen) return;
    if (this.isOpen) this.close();
    else this.open();
  };

  /** @param {FocusEvent} event */
  #onFocusOut = (event) => {
    if (event.relatedTarget instanceof Node && this.contains(event.relatedTarget)) return;
    if (this.matches(':hover')) return;
    this.close();
  };

  /** @param {PointerEvent} event */
  #onDocumentPointerDown = (event) => {
    if (event.target instanceof Node && this.contains(event.target)) return;
    this.close();
  };

  /** @param {KeyboardEvent} event */
  #onKeyDown = (event) => {
    if (event.key !== 'Escape') return;
    const hadFocus = this.matches(':focus-within');
    this.close();
    if (hadFocus) this.#button?.focus();
  };
}

if (!customElements.get('snosha-bundle-hotspot')) {
  customElements.define('snosha-bundle-hotspot', SnoshaBundleHotspot);
}

/* -------------------------------------------------------------------------
   <snosha-bundle-form> — Bundle showcase add-to-cart loading state
   Wraps Horizon's native <product-form-component>, which does the add to cart, cart drawer, cart
   count and error message. This only adds a busy state: from the moment the form dispatches its
   cart update until that request settles, the button is disabled (aria-busy), so repeated clicks
   can't add the bundle twice. The button's original disabled state (sold out) is restored after.
   ------------------------------------------------------------------------- */
class SnoshaBundleForm extends HTMLElement {
  /** @type {AbortController | undefined} */
  #controller;

  connectedCallback() {
    this.#controller = new AbortController();
    const { signal } = this.#controller;

    // Same module Horizon's product form uses; loaded lazily so a failure can't affect the rest of main.js.
    import('@shopify/events')
      .then(({ StandardEvents }) => {
        if (signal.aborted) return;
        this.addEventListener(StandardEvents.cartLinesUpdate, this.#onCartUpdate, { signal });
      })
      .catch(() => {});
  }

  disconnectedCallback() {
    this.#controller?.abort();
  }

  /** @param {Event & {promise?: Promise<unknown>}} event */
  #onCartUpdate = (event) => {
    const button = /** @type {HTMLButtonElement | null} */ (this.querySelector('[ref="addToCartButton"]'));
    if (!button || !event.promise || button.hasAttribute('aria-busy')) return;

    const wasDisabled = button.disabled;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');

    event.promise
      .catch(() => {})
      .finally(() => {
        button.removeAttribute('aria-busy');
        button.disabled = wasDisabled;
      });
  };
}

if (!customElements.get('snosha-bundle-form')) {
  customElements.define('snosha-bundle-form', SnoshaBundleForm);
}

/* -------------------------------------------------------------------------
   Product gallery — keep the selected slide aligned after a thumbnail jump
   (Snosha gallery only: .media-gallery--snosha, product page Buy Box layout).

   Horizon jumps to a non-adjacent slide (thumbnail 1 → 3) by moving the target next to the current
   slide, smooth-scrolling one step, then — when Scroller.finished resolves — putting the slide back
   and scrolling to it instantly (assets/slideshow.js select()). Scroller.finished is a 50ms debounce
   on scroll events, not the real end of the scroll: when the main thread stalls for > 50ms during the
   step (slower phones, busy page), it resolves mid-animation, the DOM is restored, and the browser
   then applies the rest of its smooth animation on top of the instant scroll, so the track rests
   between slides (measured 86–492px off at 4× CPU throttling; exact when idle).

   This guard leaves Horizon's code untouched. After a programmatic selection (thumbnails, zoom,
   variant media) it waits for the browser's own `scrollend` and, if the selected slide isn't aligned
   with the stage, scrolls it into place. Any user scroll, drag, swipe or wheel cancels it, so it never
   fights the user. No timers or polling; one delegated listener set covers every gallery, including
   sections the Theme Editor re-renders. Browsers without `scrollend` keep the native behavior.
   ------------------------------------------------------------------------- */
const GALLERY_SCROLLER = '.media-gallery--snosha slideshow-component > slideshow-container > slideshow-slides';

if (!window.snoshaGalleryAlign && 'onscrollend' in window) {
  window.snoshaGalleryAlign = true;

  /** Selected slide awaiting a settled, aligned scroll, per slideshow. @type {WeakMap<Element, Element>} */
  const pending = new WeakMap();

  /** @param {EventTarget | null} target */
  const galleryScroller = (target) =>
    target instanceof Element ? target.closest(GALLERY_SCROLLER) : null;

  /**
   * Distance (px) between the slide's start edge and the scroller's start edge (padding included).
   * @param {Element} scroller
   * @param {Element} slide
   */
  const startOffset = (scroller, slide) => {
    const style = getComputedStyle(scroller);
    const padding = parseFloat(style.paddingInlineStart) || 0;
    const slideRect = slide.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    return style.direction === 'rtl'
      ? slideRect.right - (scrollerRect.right - padding)
      : slideRect.left - (scrollerRect.left + padding);
  };

  document.addEventListener('slideshow:select', (event) => {
    const slideshow = event.target;
    if (!(slideshow instanceof Element) || !slideshow.querySelector(':scope > slideshow-container > slideshow-slides')) return;
    if (!slideshow.closest('.media-gallery--snosha')) return;

    const { trigger, slide } = /** @type {CustomEvent} */ (event).detail ?? {};
    if (trigger === 'select' && slide instanceof Element) pending.set(slideshow, slide);
    else pending.delete(slideshow); // the user scrolled to a slide: their position wins
  });

  // The user takes over: forget the pending alignment
  for (const type of ['pointerdown', 'wheel', 'touchstart']) {
    document.addEventListener(
      type,
      (event) => {
        const scroller = galleryScroller(event.target);
        const slideshow = scroller?.closest('slideshow-component');
        if (slideshow) pending.delete(slideshow);
      },
      { capture: true, passive: true }
    );
  }

  // scrollend doesn't bubble: listen in the capture phase
  document.addEventListener(
    'scrollend',
    (event) => {
      const scroller = event.target;
      if (!(scroller instanceof Element) || !scroller.matches(GALLERY_SCROLLER)) return;

      const slideshow = scroller.closest('slideshow-component');
      const slide = slideshow && pending.get(slideshow);
      if (!slideshow || !slide) return;

      if (!slide.isConnected || slide.hasAttribute('hidden') || !scroller.contains(slide)) {
        pending.delete(slideshow);
        return;
      }
      if (slideshow.hasAttribute('dragging')) return;

      const offset = startOffset(scroller, slide);
      if (Math.abs(offset) <= 1) return; // aligned (also mid-jump, while Horizon has moved the slide)

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      scroller.scrollTo({ left: scroller.scrollLeft + offset, behavior: reduceMotion ? 'instant' : 'smooth' });
    },
    { capture: true }
  );
}
