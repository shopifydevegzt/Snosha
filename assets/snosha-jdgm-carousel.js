/**
 * Snosha — Judge.me Cards Carousel helpers for sections/snosha-judgeme-reviews.liquid.
 * <snosha-jdgm-carousel> wraps the Judge.me app block(s); one instance per section, released on
 * disconnect (Theme Editor re-renders create a fresh element).
 *
 * Judge.me has no public carousel API. This module depends ONLY on Judge.me's rendered DOM, read-only:
 *   .jdgm-content                        gesture area (Judge.me's own touch listeners live here)
 *   .jdgm-content > .jdgm-arrow          Judge.me's Previous (first) / Next (last) <button>s
 *   .jdgm-videos-container               the track; Judge.me writes style="transform: translateX(-Npx)"
 *   track children [data-card-index]     original review index (also on loop clones) + [data-clone-type]
 * It never calls Judge.me functions, never writes Judge.me's DOM or styles and never moves the track.
 * If that DOM is missing or doesn't match, the swipe assist does nothing and the progress stays hidden.
 * Judge.me updates may change this DOM: re-check after updating the Judge.me app.
 *
 * 1. Swipe assist. Judge.me's own touch recognizer ignores swipes that take 700 ms or more, and
 *    gestures whose FIRST touchmove is more vertical than horizontal (iOS reports every pixel, so a
 *    1px vertical wobble at the start kills the swipe). This watches the same gesture passively; when
 *    it was clearly horizontal (≥ 40px, more horizontal than vertical, any duration) and Judge.me has not
 *    moved the track within 300 ms of touchend, it presses Judge.me's own Previous / Next button
 *    (the same as tapping its arrow, hidden or not). Judge.me's accepted swipes are left alone, so a
 *    swipe never moves twice. Finger left = next (Judge.me's track is LTR). Listeners use the capture
 *    phase because Judge.me stops propagation of horizontal touchmoves.
 *
 * 1b. Mouse drag (pointerType "mouse" only — e.g. the Theme Editor's mobile preview on a desktop).
 *    Judge.me has no mouse / pointer drag at all, so a horizontal drag (≥ 40px) presses its own
 *    Previous / Next button on release. Touch (and DevTools touch emulation) uses path 1, never this
 *    one, so a gesture can't navigate twice. The browser's native image / link drag is cancelled while
 *    dragging (it would end the pointer stream), and the click that ends a drag is swallowed so it
 *    doesn't open a review or link; plain clicks (and Theme Editor selection) are untouched.
 *
 * 2. Read-only progress (<span data-snosha-jdgm-progress>, optional). Judge.me writes the track's
 *    DESTINATION transform at the start of each move (swipe, arrow, autoplay, loop snap); a
 *    MutationObserver on that one style attribute (we never write it) maps it to the card at that
 *    offset → its data-card-index → progress = index / (reviews − 1), written as
 *    --snosha-carousel-progress on the bar (same variable / fill model as S08). Loop clones carry
 *    their original index, so the loop's clone ↔ real snap keeps the same value. Unknown state →
 *    bar hidden (no guessed position). Not interactive.
 */
const TRACK = '.jdgm-cards-carousel .jdgm-videos-container';
const SWIPE_MIN = 40;
const AXIS_LOCK = 10;
const JUDGEME_GRACE_MS = 300;

class SnoshaJdgmCarousel extends HTMLElement {
  /** @type {HTMLElement | null} */
  #track = null;
  /** @type {HTMLElement | null} */
  #progress = null;
  /** @type {AbortController | undefined} */
  #controller;
  /** @type {MutationObserver | undefined} */
  #trackObserver;
  /** @type {MutationObserver | undefined} */
  #treeObserver;
  /** @type {ResizeObserver | undefined} */
  #resizeObserver;
  #frame = 0;
  #graceTimer = 0;
  /** Number of transform writes Judge.me made (swipe assist compares it across touchend). */
  #writes = 0;
  /** @type {{ x: number, y: number, axis: 'x' | 'y' | null } | null} */
  #gesture = null;
  /** @type {{ id: number, x: number, y: number, axis: 'x' | 'y' | null } | null} */
  #drag = null;
  /** timeStamp of the last horizontal mouse drag end (its click is swallowed). */
  #dragEndedAt = -Infinity;

  connectedCallback() {
    const progress = this.querySelector('[data-snosha-jdgm-progress]');
    this.#progress = progress instanceof HTMLElement ? progress : null;

    this.#controller = new AbortController();
    const { signal } = this.#controller;
    // Capture phase: Judge.me's touchmove calls stopPropagation() on horizontal moves, so bubbling
    // listeners would never see the gesture. Capturing only observes; Judge.me still gets every event.
    this.addEventListener('touchstart', this.#onTouchStart, { capture: true, passive: true, signal });
    this.addEventListener('touchmove', this.#onTouchMove, { capture: true, passive: false, signal });
    this.addEventListener('touchend', this.#onTouchEnd, { capture: true, passive: true, signal });
    this.addEventListener('touchcancel', this.#onTouchCancel, { capture: true, passive: true, signal });
    this.addEventListener('pointerdown', this.#onPointerDown, { capture: true, signal });
    this.addEventListener('pointermove', this.#onPointerMove, { capture: true, signal });
    this.addEventListener('pointerup', this.#onPointerUp, { capture: true, signal });
    this.addEventListener('pointercancel', this.#onPointerCancel, { capture: true, signal });
    this.addEventListener('dragstart', this.#onDragStart, { capture: true, signal });
    this.addEventListener('click', this.#onClick, { capture: true, signal });

    this.#resizeObserver = new ResizeObserver(this.#schedule);
    this.#trackObserver = new MutationObserver(this.#onTrackWrite);
    // Judge.me builds / rebuilds its cards after load: re-bind when the track element changes.
    this.#treeObserver = new MutationObserver(this.#bind);
    this.#treeObserver.observe(this, { childList: true, subtree: true });
    this.#bind();
  }

  disconnectedCallback() {
    this.#controller?.abort();
    this.#trackObserver?.disconnect();
    this.#treeObserver?.disconnect();
    this.#resizeObserver?.disconnect();
    cancelAnimationFrame(this.#frame);
    clearTimeout(this.#graceTimer);
    this.#drag = null;
    this.removeAttribute('data-dragging');
    this.#track = null;
  }

  /**
   * Judge.me's own Previous / Next button (its click handler does the move).
   * @param {'next' | 'previous'} direction
   */
  #press(direction) {
    const content = this.#track?.isConnected ? this.#track.closest('.jdgm-content') : null;
    const arrows = content ? [...content.querySelectorAll(':scope > .jdgm-arrow')] : [];
    const button = direction === 'next' ? arrows.at(-1) : arrows[0];
    if (arrows.length >= 2 && button instanceof HTMLElement && !button.hasAttribute('disabled')) button.click();
  }

  #bind = () => {
    const track = this.querySelector(TRACK);
    const next = track instanceof HTMLElement ? track : null;
    if (next !== this.#track) {
      this.#trackObserver?.disconnect();
      this.#resizeObserver?.disconnect();
      this.#track = next;
      if (next) {
        this.#trackObserver?.observe(next, { attributes: true, attributeFilter: ['style'] });
        if (next.parentElement) this.#resizeObserver?.observe(next.parentElement);
      }
    }
    this.#schedule();
  };

  #onTrackWrite = () => {
    this.#writes += 1;
    this.#schedule();
  };

  #schedule = () => {
    if (!this.#progress) return;
    cancelAnimationFrame(this.#frame);
    this.#frame = requestAnimationFrame(this.#updateProgress);
  };

  /* ---------------- 2. Read-only progress ---------------- */

  /** @returns {{ index: number, count: number } | null} null when the position can't be determined. */
  #position() {
    const track = this.#track;
    if (!track?.isConnected) return null;
    const match = track.style.transform.match(/translateX\((-?[\d.]+)px\)/);
    if (!match) return null;
    const offset = -parseFloat(match[1]);
    const cards = /** @type {HTMLElement[]} */ ([...track.children].filter((card) => card instanceof HTMLElement && card.hasAttribute('data-card-index')));
    const count = cards.filter((card) => !card.hasAttribute('data-clone-type')).length;
    if (cards.length < 2 || count < 2) return null;

    // The card Judge.me is moving to: the one whose layout offset matches the destination transform.
    let best = null;
    let bestDiff = Infinity;
    for (const card of cards) {
      const diff = Math.abs(card.offsetLeft - offset);
      if (diff < bestDiff) {
        best = card;
        bestDiff = diff;
      }
    }
    // Exact match only (sub-pixel rounding allowed): after a viewport resize Judge.me can leave the
    // track between cards until its next move — then the position is unknown and the bar hides.
    if (!best || bestDiff > 2) return null;
    const index = Number.parseInt(best.dataset.cardIndex ?? '', 10);
    if (!Number.isInteger(index) || index < 0 || index >= count) return null;
    return { index, count };
  }

  #updateProgress = () => {
    const bar = this.#progress;
    if (!bar) return;
    const position = this.#position();
    if (!position) {
      bar.removeAttribute('data-ready');
      return;
    }
    const progress = position.index / (position.count - 1);
    bar.style.setProperty('--snosha-carousel-progress', progress.toFixed(4));
    bar.dataset.index = String(position.index);
    bar.dataset.count = String(position.count);
    bar.setAttribute('data-ready', '');
  };

  /* ---------------- 1. Swipe assist ---------------- */

  /** @param {TouchEvent} event */
  #onTouchStart = (event) => {
    const touch = event.touches[0];
    const content = this.#track?.closest('.jdgm-content');
    if (event.touches.length !== 1 || !touch || !content || !(event.target instanceof Node) || !content.contains(event.target)) {
      this.#gesture = null;
      return;
    }
    this.#gesture = { x: touch.clientX, y: touch.clientY, axis: null };
  };

  /** @param {TouchEvent} event */
  #onTouchMove = (event) => {
    const gesture = this.#gesture;
    const touch = event.touches[0];
    if (!gesture || !touch) return;
    if (event.touches.length !== 1) {
      this.#gesture = null;
      return;
    }
    const dx = touch.clientX - gesture.x;
    const dy = touch.clientY - gesture.y;
    if (!gesture.axis && Math.max(Math.abs(dx), Math.abs(dy)) >= AXIS_LOCK) {
      gesture.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    // Horizontal swipe: keep the page from scrolling under it (vertical gestures stay native).
    if (gesture.axis === 'x' && event.cancelable) event.preventDefault();
  };

  /** @param {TouchEvent} event */
  #onTouchEnd = (event) => {
    const gesture = this.#gesture;
    this.#gesture = null;
    const touch = event.changedTouches[0];
    if (!gesture || !touch || gesture.axis !== 'x') return;
    const dx = touch.clientX - gesture.x;
    const dy = touch.clientY - gesture.y;
    // No time limit: a slow, deliberate drag is still a swipe (Judge.me's own 700 ms limit is the bug).
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) <= Math.abs(dy)) return;

    // Let Judge.me's own swipe (or autoplay) move first; act only if it didn't move to another review.
    // Compared by review index, so a loop snap (clone → same real review) doesn't count as a move;
    // raw transform writes are the fallback when the index can't be read.
    const writes = this.#writes;
    const before = this.#position()?.index;
    clearTimeout(this.#graceTimer);
    this.#graceTimer = window.setTimeout(() => {
      if (!this.#track?.isConnected) return;
      const after = this.#position()?.index;
      const moved = before !== undefined && after !== undefined ? after !== before : this.#writes !== writes;
      if (moved) return;
      this.#press(dx < 0 ? 'next' : 'previous');
    }, JUDGEME_GRACE_MS);
  };

  #onTouchCancel = () => {
    this.#gesture = null;
  };

  /* ---------------- 1b. Mouse drag ---------------- */

  /** @param {PointerEvent} event */
  #onPointerDown = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const content = this.#track?.closest('.jdgm-content');
    const target = event.target;
    if (!content || !(target instanceof Element) || !content.contains(target) || target.closest('.jdgm-arrow')) return;
    this.#drag = { id: event.pointerId, x: event.clientX, y: event.clientY, axis: null };
  };

  /** @param {PointerEvent} event */
  #onPointerMove = (event) => {
    const drag = this.#drag;
    if (!drag || event.pointerId !== drag.id) return;
    if (!(event.buttons & 1)) {
      this.#endDrag(event.pointerId);
      return;
    }
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.axis && Math.max(Math.abs(dx), Math.abs(dy)) >= AXIS_LOCK) {
      drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (drag.axis === 'x') {
        this.setAttribute('data-dragging', '');
        try {
          this.setPointerCapture(event.pointerId);
        } catch {
          /* pointer already released */
        }
      }
    }
    // No text selection while dragging horizontally.
    if (drag.axis === 'x') event.preventDefault();
  };

  /** @param {PointerEvent} event */
  #onPointerUp = (event) => {
    const drag = this.#drag;
    if (!drag || event.pointerId !== drag.id) return;
    this.#endDrag(event.pointerId);
    if (drag.axis !== 'x') return;
    this.#dragEndedAt = event.timeStamp;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs(dy)) this.#press(dx < 0 ? 'next' : 'previous');
  };

  /** @param {PointerEvent} event */
  #onPointerCancel = (event) => {
    if (this.#drag && event.pointerId === this.#drag.id) this.#endDrag(event.pointerId);
  };

  /** @param {number} pointerId */
  #endDrag(pointerId) {
    this.#drag = null;
    this.removeAttribute('data-dragging');
    if (this.hasPointerCapture(pointerId)) this.releasePointerCapture(pointerId);
  }

  /**
   * Native image / link drag would cancel the pointer stream mid-gesture.
   * @param {DragEvent} event
   */
  #onDragStart = (event) => {
    if (this.#drag) event.preventDefault();
  };

  /**
   * Swallow the (trusted) click that ends a horizontal mouse drag; our own button.click() is untrusted.
   * @param {MouseEvent} event
   */
  #onClick = (event) => {
    if (!event.isTrusted || event.timeStamp - this.#dragEndedAt > 300) return;
    this.#dragEndedAt = -Infinity;
    event.preventDefault();
    event.stopPropagation();
  };
}

if (!customElements.get('snosha-jdgm-carousel')) {
  customElements.define('snosha-jdgm-carousel', SnoshaJdgmCarousel);
}
