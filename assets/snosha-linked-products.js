/* =========================================================================
   SNOSHA — <snosha-linked-colors>: AJAX navigation between linked colour products
   (Horizon v4.4.0). Markup: snippets/snosha-linked-colors.liquid (+ snosha-linked-color-item),
   rendered by snippets/variant-main-picker.liquid from the product metafield
   custom.linked_color_products. Loaded by that snippet only when the variant picker setting
   "Enable AJAX navigation for linked products" is on and the page is not in the Theme Editor.
   Kept out of assets/main.js (shared project module on `main`), like snosha-tabs.js.

   Every colour is a real link to the product's own URL. This module only upgrades a plain
   left-click on another colour into an in-place transition:

   1. Collect the template sections inside <main> (real IDs read from the DOM, never hardcoded).
   2. Fetch them for the target product URL with the Section Rendering API (?sections=, at most
      5 IDs per request). Every section must come back (null = different template/unavailable).
   3. Validate before touching the page:
      - the returned linked-colour row belongs to the target URL and the same template;
      - the main product form is rendered for the target product (Add to Cart can't submit the
        previous product);
      - no inline executable <script> (it would not run when inserted); external module scripts
        that the page has not loaded yet are added once after the swap;
      - app blocks (Judge.me etc.): the target's app block markup must be identical to the
        current product's (fetched the same way). Then the live, already-initialised widget is
        kept in place. If it differs (product-specific widget), the transition is NOT done.
   4. Swap all sections in one synchronous step (fresh nodes, so every Horizon / Snosha custom
      element re-runs connectedCallback with the new product's data), push the new URL, update
      document.title, move focus to the new active colour.
   Anything unexpected (network error, missing section, failed validation) falls back to normal
   navigation to the product URL, so the page never shows one product with another's form.
   Back / Forward: popstate restores the product for the URL the same way (reload on failure).
   Not updated in place: <head> metadata (canonical, Open Graph, JSON-LD in <head>) and Shopify's
   page-view analytics; they are correct on every direct load of a product URL.
   ========================================================================= */

const SECTION_PREFIX = 'shopify-section-';
const SECTION_BATCH_SIZE = 5; // Section Rendering API: max sections per request
const HISTORY_KEY = 'snoshaLinkedProduct';

/** A transition that cannot be done safely in place: navigate normally instead. */
class FallbackError extends Error {}

/**
 * Comparable pathname (decoded, no trailing slash) of a URL or path.
 * @param {string} url
 */
const pathOf = (url) => {
  const { pathname } = new URL(url, window.location.origin);
  try {
    return decodeURI(pathname).replace(/\/$/, '');
  } catch {
    return pathname.replace(/\/$/, '');
  }
};

/** @param {string} html */
const normalizeHtml = (html) => html.replace(/\s+/g, ' ').trim();

/**
 * Third-party widget roots that need their own JavaScript to initialise: Shopify app blocks, and
 * Judge.me widgets even if rendered outside an app block wrapper.
 */
const WIDGET_SELECTOR = '.shopify-app-block, .jdgm-widget';

/**
 * Outermost widget roots inside a section, in document order.
 * @param {Element} root
 */
const widgetRoots = (root) =>
  [...root.querySelectorAll(WIDGET_SELECTOR)].filter((el) => {
    const outer = el.parentElement?.closest(WIDGET_SELECTOR);
    return !outer || !root.contains(outer);
  });

/** Top-level template sections inside <main> (not section groups such as header / footer). */
const templateSections = () => {
  const main = document.querySelector('main');
  if (!main) return [];
  return /** @type {HTMLElement[]} */ (
    [...main.querySelectorAll('.shopify-section')].filter(
      (section) => section.id.startsWith(SECTION_PREFIX) && !section.parentElement?.closest('.shopify-section')
    )
  );
};

/**
 * Section Rendering API, in batches of at most 5 sections.
 * @param {string} url - product URL (its query, e.g. ?variant=, is kept)
 * @param {string[]} ids - section IDs
 * @param {AbortSignal} signal
 * @returns {Promise<Record<string, string | null>>}
 */
const fetchSections = async (url, ids, signal) => {
  /** @type {Record<string, string | null>} */
  const result = {};
  const batches = [];
  for (let index = 0; index < ids.length; index += SECTION_BATCH_SIZE) {
    batches.push(ids.slice(index, index + SECTION_BATCH_SIZE));
  }

  await Promise.all(
    batches.map(async (batch) => {
      const requestUrl = new URL(url, window.location.origin);
      requestUrl.searchParams.set('sections', batch.join(','));
      const response = await fetch(requestUrl, { signal, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new FallbackError(`Section request failed (${response.status})`);
      const json = await response.json();
      for (const id of batch) {
        result[id] = typeof json?.[id] === 'string' ? json[id] : null;
      }
    })
  );

  return result;
};

/**
 * Parses one Section Rendering API entry into its section wrapper element.
 * @param {string} id
 * @param {string | null | undefined} html
 */
const parseSection = (id, html) => {
  if (!html) throw new FallbackError(`Section "${id}" is not rendered for this product`);
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const section = doc.getElementById(SECTION_PREFIX + id);
  if (!section) throw new FallbackError(`Section "${id}" returned unexpected markup`);
  return section;
};

/**
 * @typedef {object} PreparedTransition
 * @property {Map<string, HTMLElement>} incoming - section ID → new section element (parsed)
 * @property {Array<[Element, Element]>} keepLive - [new app block placeholder, live app block]
 * @property {Array<{ src: string, type: string }>} scripts - external scripts not loaded yet
 * @property {string} title - new document title
 * @property {string} productId - new product ID
 */

class LinkedProductNavigator {
  /** @type {AbortController | null} */
  #controller = null;

  #token = 0;

  /** Path being loaded ('' when idle). */
  #pendingPath = '';

  /** The product URL the current page content was rendered for. */
  #rendered = { path: pathOf(window.location.href), url: window.location.href };

  constructor() {
    window.addEventListener('popstate', this.#onPopState);
  }

  /**
   * Shows another linked product in place.
   * @param {string} href - target product URL
   * @param {{ push?: boolean, link?: HTMLElement | null }} [options]
   */
  async go(href, { push = true, link = null } = {}) {
    const target = new URL(href, window.location.origin);
    const targetPath = pathOf(target.href);

    if (targetPath === this.#rendered.path) {
      this.#cancel();
      return;
    }
    if (targetPath === this.#pendingPath) return; // the same colour is already loading

    this.#controller?.abort();
    const controller = new AbortController();
    this.#controller = controller;
    const token = ++this.#token;
    this.#pendingPath = targetPath;
    this.#setLoading(true, link);

    /** @type {PreparedTransition} */
    let prepared;
    try {
      prepared = await this.#prepare(target, controller.signal);
    } catch (error) {
      if (token !== this.#token || (error instanceof Error && error.name === 'AbortError')) return;
      console.warn('[snosha-linked-products] Full page load instead of an in-place transition:', error);
      if (push) {
        window.location.assign(target.href);
      } else {
        window.location.reload();
      }
      return; // the loading state stays until the browser navigates
    }

    if (token !== this.#token) return; // a newer selection superseded this one

    try {
      this.#commit(prepared, target, push);
    } catch (error) {
      // The DOM may be partly updated: a full load of the target is the only consistent state.
      console.error('[snosha-linked-products] Transition failed, reloading the product page:', error);
      window.location.assign(target.href);
      return;
    }

    this.#pendingPath = '';
    this.#controller = null;
    this.#setLoading(false);
  }

  /** Drops a pending transition (newer navigation, or Back to the shown product). */
  #cancel() {
    if (!this.#pendingPath) return;
    this.#controller?.abort();
    this.#controller = null;
    this.#token++;
    this.#pendingPath = '';
    this.#setLoading(false);
  }

  /**
   * Fetches and validates everything; throws FallbackError for anything unsafe. No DOM changes.
   * @param {URL} target
   * @param {AbortSignal} signal
   * @returns {Promise<PreparedTransition>}
   */
  async #prepare(target, signal) {
    const host = document.querySelector('snosha-linked-colors');
    const hostSection = host?.closest('.shopify-section');
    if (!(host instanceof HTMLElement) || !hostSection) throw new FallbackError('Linked colours not found');

    const sections = templateSections();
    const ids = sections.map((section) => section.id.slice(SECTION_PREFIX.length));
    const hostId = hostSection.id.slice(SECTION_PREFIX.length);
    if (!ids.includes(hostId)) throw new FallbackError('Linked colours are not in a template section');

    const responses = await fetchSections(target.href, ids, signal);
    /** @type {Map<string, HTMLElement>} */
    const incoming = new Map(ids.map((id) => [id, parseSection(id, responses[id])]));

    // 1. The new content is the target product, on the same template
    const newHostSection = /** @type {HTMLElement} */ (incoming.get(hostId));
    const newHost = newHostSection.querySelector('snosha-linked-colors');
    const activeLink = newHost?.querySelector('a[aria-current="page"]');
    if (!(newHost instanceof HTMLElement) || !(activeLink instanceof HTMLElement)) {
      throw new FallbackError('The target product has no linked colours');
    }
    if (pathOf(activeLink.getAttribute('href') ?? '') !== pathOf(target.href)) {
      throw new FallbackError('The returned product does not match the requested URL');
    }
    if ((newHost.dataset.template ?? '') !== (host.dataset.template ?? '')) {
      throw new FallbackError('The target product uses another product template');
    }

    const productId = newHost.dataset.productId ?? '';
    const currentProductId = host.dataset.productId ?? '';
    const hadMainForm =
      currentProductId &&
      hostSection.querySelector(`product-form-component[data-product-id="${CSS.escape(currentProductId)}"]`);
    if (
      hadMainForm &&
      !newHostSection.querySelector(`product-form-component[data-product-id="${CSS.escape(productId)}"]`)
    ) {
      throw new FallbackError('The product form for the target product is missing');
    }

    // 2. Third-party widgets (app blocks, Judge.me): their server markup must be identical for the
    //    current and the target product; then the live, already-initialised widget is kept. A
    //    product-specific widget can't be re-initialised safely here, so that case falls back.
    /** @type {Array<[Element, Element]>} */
    const keepLive = [];
    const widgetSectionIds = [...incoming]
      .filter(([id, el]) => {
        const live = document.getElementById(SECTION_PREFIX + id);
        return widgetRoots(el).length > 0 || (live !== null && widgetRoots(live).length > 0);
      })
      .map(([id]) => id);
    if (widgetSectionIds.length) {
      const currentResponses = await fetchSections(this.#rendered.url, widgetSectionIds, signal);
      for (const id of widgetSectionIds) {
        const currentWidgets = widgetRoots(parseSection(id, currentResponses[id]));
        const newWidgets = widgetRoots(/** @type {HTMLElement} */ (incoming.get(id)));
        const liveSection = document.getElementById(SECTION_PREFIX + id);
        const liveWidgets = liveSection ? widgetRoots(liveSection) : [];
        if (currentWidgets.length !== newWidgets.length || liveWidgets.length !== newWidgets.length) {
          throw new FallbackError(`Widgets in section "${id}" differ between products`);
        }
        newWidgets.forEach((widget, index) => {
          const before = /** @type {Element} */ (currentWidgets[index]);
          if (normalizeHtml(before.outerHTML) !== normalizeHtml(widget.outerHTML)) {
            throw new FallbackError(`Widget "${widget.id || widget.className}" depends on the product`);
          }
          keepLive.push([widget, /** @type {Element} */ (liveWidgets[index])]);
        });
      }
    }

    // 3. Scripts: JSON is data; external scripts load once; inline code would not run → fallback
    const kept = new Set(keepLive.map(([placeholder]) => placeholder));
    /** @type {Array<{ src: string, type: string }>} */
    const scripts = [];
    for (const section of incoming.values()) {
      for (const script of section.querySelectorAll('script')) {
        if ([...kept].some((placeholder) => placeholder.contains(script))) continue;
        const type = (script.getAttribute('type') ?? '').toLowerCase();
        const src = script.getAttribute('src');
        if (src) {
          const loaded = [...document.scripts].some((existing) => existing.getAttribute('src') === src);
          if (!loaded && !scripts.some((entry) => entry.src === src)) scripts.push({ src, type });
          continue;
        }
        if (type.includes('json')) continue;
        throw new FallbackError('A section contains an inline script');
      }
    }

    return {
      incoming,
      keepLive,
      scripts,
      title: activeLink.dataset.documentTitle ?? '',
      productId,
    };
  }

  /**
   * Applies a validated transition in one synchronous step.
   * @param {PreparedTransition} prepared
   * @param {URL} target
   * @param {boolean} push
   */
  #commit({ incoming, keepLive, scripts, title, productId }, target, push) {
    const focusWasInRow = Boolean(document.activeElement?.closest?.('snosha-linked-colors'));

    /** @type {Array<[HTMLElement, HTMLElement]>} */
    const swaps = [];
    for (const [id, section] of incoming) {
      const current = document.getElementById(SECTION_PREFIX + id);
      if (!current) throw new Error(`Section "${id}" disappeared`);
      swaps.push([current, /** @type {HTMLElement} */ (document.adoptNode(section))]);
    }

    // Keep initialised third-party widgets whose markup is product-independent
    for (const [placeholder, live] of keepLive) placeholder.replaceWith(live);
    for (const [current, fresh] of swaps) current.replaceWith(fresh);

    for (const { src, type } of scripts) {
      const script = document.createElement('script');
      if (type) script.type = type;
      script.src = src;
      document.head.append(script);
    }

    if (push) {
      if (!window.history.state?.[HISTORY_KEY]) {
        window.history.replaceState({ ...(window.history.state ?? {}), [HISTORY_KEY]: true }, '');
      }
      window.history.pushState({ [HISTORY_KEY]: true }, '', target.href);
    }
    this.#rendered = { path: pathOf(target.href), url: target.href };
    if (title) document.title = title;

    if (focusWasInRow) {
      const active = document.querySelector('snosha-linked-colors a[aria-current="page"]');
      if (active instanceof HTMLElement) active.focus({ preventScroll: true });
    }

    document.dispatchEvent(
      new CustomEvent('snosha:linked-product:change', { detail: { productId, url: target.href } })
    );
  }

  /**
   * @param {boolean} loading
   * @param {HTMLElement | null} [link]
   */
  #setLoading(loading, link = null) {
    const main = document.querySelector('main');
    if (loading) {
      main?.setAttribute('aria-busy', 'true');
      main?.setAttribute('data-snosha-linked-loading', '');
    } else {
      main?.removeAttribute('aria-busy');
      main?.removeAttribute('data-snosha-linked-loading');
    }
    for (const busy of document.querySelectorAll('snosha-linked-colors a[aria-busy]')) {
      busy.removeAttribute('aria-busy');
    }
    if (loading && link) link.setAttribute('aria-busy', 'true');
  }

  #onPopState = () => {
    const path = pathOf(window.location.href);
    if (path === this.#rendered.path) {
      this.#cancel(); // same product (hash or variant entry), or Back while a colour was loading
      return;
    }
    if (!document.querySelector('snosha-linked-colors[data-ajax="true"]')) {
      window.location.reload();
      return;
    }
    this.go(window.location.href, { push: false });
  };
}

/** @type {LinkedProductNavigator} */
const linkedNavigator =
  // One navigator per page, however often the element is re-rendered
  /** @type {any} */ (window).snoshaLinkedNavigator ??
  (/** @type {any} */ (window).snoshaLinkedNavigator = new LinkedProductNavigator());

class SnoshaLinkedColors extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', this.#onClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#onClick);
  }

  /** @param {MouseEvent} event */
  #onClick = (event) => {
    if (this.dataset.ajax !== 'true' || /** @type {any} */ (window).Shopify?.designMode) return;
    // New tab / window, download, or anything but a plain primary click: the browser handles it
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!(link instanceof HTMLAnchorElement) || !this.contains(link)) return;
    if ((link.target && link.target !== '_self') || link.hasAttribute('download')) return;

    if (link.getAttribute('aria-current') === 'page') {
      event.preventDefault(); // already showing this colour
      return;
    }

    const url = new URL(link.href, window.location.origin);
    if (url.origin !== window.location.origin) return;
    // Another product template: its sections have other IDs, so use a normal page load
    if ((link.dataset.template ?? '') !== (this.dataset.template ?? '')) return;

    event.preventDefault();
    linkedNavigator.go(url.href, { link });
  };
}

if (!customElements.get('snosha-linked-colors')) {
  customElements.define('snosha-linked-colors', SnoshaLinkedColors);
}
