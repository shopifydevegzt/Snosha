/**
 * Snosha carousel progress — compatibility fallback only.
 *
 * The mobile progress bars of the Collections carousel (#4) and the Featured collection (#5) are
 * pure CSS: assets/dev1.css binds them to Horizon's native carousel scroller with a scroll-driven
 * animation (scroll-timeline). This module does nothing in browsers that support that.
 *
 * In browsers without scroll-driven animations (e.g. Safari < 26, Firefox) it writes the real scroll
 * progress (0–1) of each carousel scroller to --snosha-carousel-progress on its slideshow-component;
 * the same CSS then sizes the bar from that variable. Horizon keeps owning dragging, snapping,
 * arrows and keyboard behavior. One delegated listener covers every section instance, including
 * sections re-rendered by the Theme Editor.
 */
const SCROLLER = '[data-snosha-carousel-progress] slideshow-component.resource-list__carousel > slideshow-container > slideshow-slides';

if (!CSS.supports('animation-timeline', 'scroll()') && !window.snoshaCarouselProgress) {
  window.snoshaCarouselProgress = true;

  /** @param {Element} scroller */
  const update = (scroller) => {
    const max = scroller.scrollWidth - scroller.clientWidth;
    // scrollLeft runs 0 → negative in RTL, 0 → positive in LTR
    const progress = max > 1 ? Math.min(1, Math.abs(scroller.scrollLeft) / max) : 0;
    scroller.closest('slideshow-component')?.style.setProperty('--snosha-carousel-progress', progress.toFixed(4));
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
