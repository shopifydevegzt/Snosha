/* =========================================================================
   SNOSHA — <snosha-tabs>
   Tablist / tabpanel switching for Snosha tab sections (Horizon v4.4.0).
   Consumer: sections/snosha-storage-care.liquid (S10), which loads this file itself:
     <script src="{{ 'snosha-tabs.js' | asset_url }}" type="module" fetchpriority="low"></script>
   (Horizon's blocks/comparison-slider.liquid convention). A module URL executes once per page,
   however many sections include the tag, and the element is defined only if not yet registered.
   Kept out of assets/main.js on purpose: that file is the shared project module on `main`
   (loaded globally from snippets/scripts.liquid there), so a separate file avoids merge
   conflicts and loads only on pages that use the tabs.
   ========================================================================= */
import { Component } from '@theme/component';

/**
 * Markup contract (rendered by Liquid, which is the source of truth):
 * - buttons: [role="tab"] with aria-controls → panel id, aria-selected, roving tabindex;
 * - panels: [role="tabpanel"], the inactive ones carry `hidden`.
 * The server already renders the default tab as selected, so without JS the default tab is shown.
 *
 * Behavior: click / tap selects; ArrowLeft / ArrowRight (mirrored in RTL), Home and End move
 * the selection and focus (automatic activation); selecting a tab block or one of its child
 * blocks in the Theme Editor (shopify:block:select bubbles from the block element) opens that tab.
 * Theme Editor section re-renders replace the element: the old one aborts its listeners on
 * disconnect, the new one starts from the server-rendered state.
 *
 * @extends {Component}
 */
class SnoshaTabs extends Component {
  /** @type {AbortController | undefined} */
  #controller;

  connectedCallback() {
    super.connectedCallback();
    this.#controller?.abort();
    this.#controller = new AbortController();
    const { signal } = this.#controller;
    this.addEventListener('click', this.#handleClick, { signal });
    this.addEventListener('keydown', this.#handleKeydown, { signal });
    this.addEventListener('shopify:block:select', this.#handleBlockSelect, { signal });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#controller?.abort();
    this.#controller = undefined;
  }

  /** @returns {HTMLElement[]} the tab buttons owned by this component */
  get tabs() {
    return /** @type {HTMLElement[]} */ (
      [...this.querySelectorAll('[role="tab"]')].filter((tab) => tab.closest('snosha-tabs') === this)
    );
  }

  /**
   * Selects a tab and shows its panel; hides the other panels.
   * @param {HTMLElement} tab
   * @param {{ focus?: boolean }} [options]
   */
  select(tab, { focus = false } = {}) {
    for (const candidate of this.tabs) {
      const selected = candidate === tab;
      candidate.setAttribute('aria-selected', String(selected));
      candidate.tabIndex = selected ? 0 : -1;
      const panelId = candidate.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (panel) panel.hidden = !selected;
    }
    if (focus) tab.focus();
  }

  /** @param {MouseEvent} event */
  #handleClick = (event) => {
    const tab = event.target instanceof Element ? event.target.closest('[role="tab"]') : null;
    if (!(tab instanceof HTMLElement) || !this.tabs.includes(tab)) return;
    this.select(tab);
  };

  /** @param {KeyboardEvent} event */
  #handleKeydown = (event) => {
    const tab = event.target instanceof Element ? event.target.closest('[role="tab"]') : null;
    const tabs = this.tabs;
    if (!(tab instanceof HTMLElement) || !tabs.includes(tab)) return;

    const index = tabs.indexOf(tab);
    const step = getComputedStyle(this).direction === 'rtl' ? -1 : 1;
    /** @type {Record<string, number>} */
    const targets = {
      ArrowRight: index + step,
      ArrowLeft: index - step,
      Home: 0,
      End: tabs.length - 1,
    };
    const target = targets[event.key];
    if (target === undefined) return;

    event.preventDefault();
    const next = tabs[(target + tabs.length) % tabs.length];
    if (next) this.select(next, { focus: true });
  };

  /** @param {Event} event */
  #handleBlockSelect = (event) => {
    const panel = event.target instanceof Element ? event.target.closest('[role="tabpanel"]') : null;
    if (!panel || !this.contains(panel)) return;
    const tab = this.tabs.find((candidate) => candidate.getAttribute('aria-controls') === panel.id);
    if (tab) this.select(tab);
  };
}

if (!customElements.get('snosha-tabs')) {
  customElements.define('snosha-tabs', SnoshaTabs);
}
