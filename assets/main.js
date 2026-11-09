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
