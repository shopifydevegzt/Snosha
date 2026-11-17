# SNOSHA — UI Components Follow-up QA Report

Date: 2026-11-17 · Branch / worktree: `main` (`E:/Work/Snosha/Project`, HEAD `6a1ad47`, no merge in progress) · Theme: Horizon v4.4.0
Preview: running `theme dev` on 127.0.0.1:9292, verified to serve this worktree (served `main.css` byte-identical to the local file). Not restarted.
Measurement: headless Edge + puppeteer-core (scratchpad), `getBoundingClientRect()`, computed styles, and pixel ink bounds from 4× screenshots.
Pre-existing uncommitted Theme Editor changes (`config/settings_data.json`, `sections/header-group.json` incl. the three uploaded icons, `templates/*.json`) were left untouched.

Status labels: **PASS** = verified on the preview · **FAIL** · **NOT VERIFIED** = not testable here (reason given).

---

## Task 1 — Uploaded header SVG icons vs Figma

### Root cause
The merchant uploaded Figma exports (`shopify://shop_images/user.svg`, `search.svg`, `cart.svg`; no custom menu icon). Their drawings are identical to the Figma vectors, but:

1. **Account too small (91 %).** `user.svg` is **24 × 22** (Figma's 24px vector, exported unscaled). `snippets/snosha-header-icon.liquid` rendered every upload as an `<img>` contained (`object-fit: contain`) in a 22 × 22 square, so it was scaled to 22/24.
2. **Wrong colour on mobile.** The files hard-code `stroke="#12568D"` (color6). As `<img>` they could not take the header's mobile icon colour (Figma mobile: color3 `#176BB0`), nor hover / focus colour.
3. `search.svg` / `cart.svg` are 22 × 22 with Figma geometry, so their size was already right (the clip-path in `search.svg` does not clip the visible artwork).

### Fix
- **SVG uploads** are now drawn at **their own pixel size** (Shopify reports SVG width / height: user 24 × 22, search / cart 22 × 22), scaled by "Custom icon size" ÷ 22, top-left aligned on the 22px slot like the Figma frame, as a **CSS mask filled with `currentColor`** (`.snosha-header-icon--mask`). No transform tricks beyond the Figma anchor offset; the uploaded files are not modified.
- **Raster uploads** (PNG / JPG) keep the previous behaviour: `<img alt="">` contained in a "Custom icon size" square.
- Image pickers, the size control, native fallbacks, buttons and labels are unchanged.

### Figma (MCP `get_metadata` re-checked today; vector geometry from today's `get_design_context` export)
Desktop `190:3769`: user `190:3772`, search `190:3773`, cart `190:3774`, 22 × 22 slots, 22px gaps. Mobile `190:4084`: cart `190:4086`, search `190:4087`, menu `190:4090`, gap 18.

### Measurements (pixel ink bounds; the method reads ≈ 0.1px under geometric size)

| Icon | Viewport | Figma visible size | Uploaded SVG before | After | Match |
|---|---|---|---|---|---|
| Account | 1480 | 17.6 × 18.6 at 1301.2, 81.2 | 16 × 16.75 at 1301, 82 | 17.5 × 18.5 at 1301.25, 81.25 | **PASS** |
| Account | 990 | 17.6 × 18.6 | 16 × 16.75 | 17.5 × 18.5 | **PASS** |
| Search | 1480 / 990 | 17.1 × 17.1 (box 18 at slot + 2) | 17.25 × 17.25 at 1344.25, 80.25 | unchanged | **PASS** |
| Cart | 1480 / 990 | 17.15 × 16.3 | 17.25 × 16.5 at 1388, 81 | unchanged | **PASS** |
| Search | 390 / 320 | 17.1, color3 | 17.25, **rgb(25, 91, 144) = color6** | 17.25, rgb(28, 110, 178) ≈ color3 | FAIL → **PASS** |
| Cart | 390 / 320 | 17.15 × 16.3, color3 | 17.25 × 16.5, **color6** | 17.25 × 16.5, rgb(30, 111, 178) ≈ color3 | FAIL → **PASS** |
| Menu | 390 / 320 | 17.6 × 11.6, color3 | no upload — Figma SVG, 17.5 × 11.5, color3 | unchanged | **PASS** |
| Account | 390 / 320 | hidden in Figma | hidden | hidden | **PASS** |

Positions: 1480 slots 1298 / 1342 / 1386 (22 gap); 390 cart 20, search 60, menu 348 — all equal to Figma. (Mobile icons sit 0.5px above Figma: pre-existing header row padding, see SNOSHA_HEADER_ICONS_QA_REPORT.md §4.)
Cart badge (1 item): 20 × 20 at 1377.5, 71.5 (1480) / 11.5, 59 (390) — same native position as before. Touch targets: search / cart / account 44 × 44; menu 22 × 44 (pre-existing, dev1.css). Header actions after the change: search modal, cart drawer, account button, mobile menu open / close, hover dimming, focus rings — **PASS**.

## Task 2 — Product card Add to Cart success state

### Root cause (black checkmark over the label)
The SNOSHA card button is Horizon's quick-add `add-to-cart-button` (`snippets/quick-add.liquid` → `add-to-cart-button.liquid`), restyled by `assets/dev1.css` (`:is(.snosha-featured-collection, .snosha-collection-grid) .quick-add .quick-add__button`).
1. Horizon hides the label on success with `.quick-add__button[data-added='true'] { color: transparent }`; dev1's more specific `color: var(--snosha-fc-on-accent)` won, so **the label stayed visible**.
2. The checkmark (`icon-checkmark-burst.svg`: ring + tick + 8 burst lines) is coloured `var(--quick-add-foreground, var(--color-foreground))` → **dark**, drawn over the label.
3. Horizon's success state is **optimistic**: `AddToCartComponent.handleClick` sets `data-added` on click, before `/cart/add` answers (also on failure).

No second animation, app indicator or pseudo-element was involved.

### Fix (native mechanism reused, scoped)
- `assets/product-form.js` (small documented branches): inside `[data-add-to-cart-feedback="success"]` the click no longer calls `animateAddToCart()`; the form calls the same native `animateAddToCart()` after a **successful** cart response (single add and queued batch paths). Elsewhere behaviour is unchanged.
- `sections/product-list.liquid`, `sections/product-recommendations.liquid`: the attribute is added only when "Snosha style" is on.
- `assets/main.css`: in that scope the label and cart icon fade out (icon also moves 4px up), only the native `.tick` is shown (ring / burst hidden) in **white** (`--snosha-fc-on-accent`, i.e. the button text token), centred, at its final size (Horizon's delayed second "pop" of the tick removed), then the reverse. Blue background unchanged. `prefers-reduced-motion: reduce` → no transitions, instant swap.

### Affected buttons (actual consumers)
| Consumer | Section | Attribute | Tested |
|---|---|---|---|
| Homepage Best sellers | `product-list` (Snosha style) | yes | PASS (1480, 390) |
| Homepage Bundles | `product-list` (Snosha style) | yes | not clicked separately (same section type / markup) |
| Product page Recommended | `product-recommendations` (Snosha style) | yes | PASS (1480, product page) |
| Product page You may also like | `product-list` (Snosha style) | yes | covered by the product page run (first visible Snosha card) |
| Collection page cards | `main-collection` | — | not a consumer: cards have a "عرض المنتج" link, no add button |

Untouched: product page Buy Box add to cart, sticky add to cart, Buy Now / accelerated checkout, bundle / complementary forms, cart drawer, quick-add modal.

### Results
| Check | Result |
|---|---|
| Success state only after success: `/cart/add` 200 at 816 ms → `data-added` at 818 ms (390: 853 → 918 ms; product page: 924 → 928 ms) | **PASS** |
| Label hidden while the check shows (label colour → transparent), no overlap | **PASS** |
| White tick (stroke rgb(255, 255, 255)), centred: 1480 tick centre 1250, 456.3 vs button centre 1250, 456; 390 centre 224, 331.3 vs 224, 331 | **PASS** |
| Blue background kept: rgb(23, 107, 176) throughout | **PASS** |
| Label restored after ≈ 1.9 s, check fades out (opacity 0.04 mid-transition at 390) | **PASS** |
| Forced failure (intercepted 422): no success state, cart 0 | **PASS** (cards' quick add shows no inline error text — native) |
| Rapid double click: two native requests, one continuous success state, cart = 2, header count = 2 | **PASS** (one `AbortError: Transition was skipped` from Horizon's overlapping cart view transitions) |
| Cart count / drawer sync after add | **PASS** |
| Reduced motion | **NOT VERIFIED** (no emulation run; rules are inside `prefers-reduced-motion: no-preference`) |
| Sold-out / unavailable cards | **NOT VERIFIED** (no sold-out product on the preview; disabled state untouched) |

Note: the label reads «أضف إلي السلة» (ي) — the existing locale typo P-013 (pending approval); the brief writes «أضف إلى السلة». Not changed here.

## Task 3 — Judge.me reviews section on products without reviews

### Findings
- The product page section is the project section `snosha-judgeme-reviews` hosting Judge.me's **Cards Carousel app block** (`@app`).
- Count source: Judge.me's synced Shopify product metafields **`reviews.rating_count`** (count) and `reviews.rating` (average) — product-specific, available server-side before any widget loads. The section already skipped rendering on the **storefront** when the count is 0 (`show_when_empty` = false).
- **Root cause:** the Theme Editor (`request.design_mode`) always rendered the section, with an English editor hint and Judge.me's own English empty / sample content — what the merchant sees while editing. On the storefront, zero-review products already served no empty-state text (HTML searched for "Be the first / No reviews / Write a review": none).

### Fix
`sections/snosha-judgeme-reviews.liquid`: the zero-review rule now applies in the Theme Editor too. The existing setting "Show on products without reviews" (info text updated) turns it on temporarily to edit the section while previewing such a product. No DOM-text matching, no JS, no async fallback needed (server-side count).

### Results (all 7 products, normal load + 3.5 s for Judge.me async init; each product loaded separately = product navigation)
| Product | Reviews | Section | Result |
|---|---|---|---|
| snosha-f1 | 12 (4.5) | rendered (754px, heading, summary, carousel) | **PASS** |
| 6 other products | 0 | not rendered, no visible Judge.me element | **PASS** |
| Theme Editor, zero-review product | — | — | **NOT VERIFIED** (Theme Editor not available headless; logic: same condition without the design-mode exception) |

Not affected: Buy Box rating block (`blocks/snosha-product-rating.liquid`), card ratings, Judge.me scripts.

## Task 4 — Prev / Next arrows on product page carousels

### Root cause
Both carousels (`product-recommendations` "Recommended" and `product-list` "You may also like", Snosha style) use Horizon's `resource-list-carousel` → `slideshow-component`. Arrows are rendered whenever the icon style isn't "none"; Horizon's overflow check (`#updateControlsVisibility`, `auto-hide-controls`) only hides the dots/counter, never the arrows. On mobile the "next" arrow was additionally present at **opacity 0 but 44px wide and clickable** over the cards.

### Fix (native capability extended)
- `assets/slideshow.js`: inside `[data-carousel-arrows="auto"]`, the same overflow check publishes `data-overflow="true|false"` (`scrollWidth > offsetWidth + 1`) on setup, for 0–1 slides, and on every resize (existing ResizeObserver).
- `assets/main.css`: `data-overflow="false"` → arrows `display: none` (not clickable, not focusable). Below 750px the arrows are removed for these carousels (Figma mobile: swipe + progress bar).
- Attribute set by `product-recommendations` (Snosha style) and by `product-list` only on the **product template**. Homepage carousels and all other sliders unchanged (homepage HTML: 0 occurrences).
- Recommendations loaded asynchronously create their own `slideshow-component`, which runs the check on setup.

### Results — real store data (counts available: 1, 3, 4; 2 and 5+ not available without changing merchant data)
| Products | 1480 | 1200 | 990 | 900 | 768 | 390 | 320 |
|---|---|---|---|---|---|---|---|
| 1 (Recommended, couple kit) | fits → hidden ✓ | — (not loaded in time) | fits → hidden ✓ | — | fits → hidden ✓ | hidden ✓ | hidden ✓ |
| 3 (F1, both carousels) | fits → hidden ✓ | fits → hidden ✓ | fits → hidden ✓ | overflow 405 → shown ✓ | overflow 342 → shown ✓ | hidden, bar ✓ | hidden, bar ✓ |
| 4 (Bundle, both carousels) | fits → hidden ✓ | fits → hidden ✓ | fits → hidden ✓ | overflow 810 → shown ✓ | overflow 685 → shown ✓ | hidden, bar ✓ | hidden, bar ✓ |

Before the fix (F1, 3 products): arrows visible at 1480 / 1200 / 990 with no overflow (FAIL).

### Simulated counts (DOM-only clone / remove of slides, live resize; nothing saved)
| Products | 1200 | 990 | 900 | 768 | 390 / 320 | back to 1480 |
|---|---|---|---|---|---|---|
| 2 | hidden (fits) | hidden | hidden | hidden | hidden | hidden |
| 5 | shown (overflow 274) | shown (224) | shown | shown | hidden | shown (340) |
| 6 | shown | shown | shown | shown | hidden | shown (680) |

Desktop capacity at 1480 is 4 cards, so 5+ overflow and show arrows (verified after resize). The very first 1480 reading in the simulation was stale because injected slides don't resize the container — a simulation artefact (real carousels render their slides, or are replaced whole when recommendations load).

Other checks: keyboard Tab never reaches hidden arrows (0 stops at 1480, 4 products) — **PASS**; RTL directions at 900 (previous on the right, next on the left) — **PASS**; mobile progress bar unchanged — **PASS**.

## Files changed
| File | Change |
|---|---|
| `snippets/snosha-header-icon.liquid` | SVG uploads → own-size `currentColor` mask; raster uploads unchanged |
| `assets/product-form.js` (Horizon) | success-gated `animateAddToCart()` inside `[data-add-to-cart-feedback="success"]` |
| `assets/slideshow.js` (Horizon) | `data-overflow` inside `[data-carousel-arrows="auto"]` |
| `sections/product-list.liquid` | `data-add-to-cart-feedback` (Snosha style); `data-carousel-arrows` (Snosha style, product template) |
| `sections/product-recommendations.liquid` | both attributes (Snosha style) |
| `sections/snosha-judgeme-reviews.liquid` | zero-review rule also in the Theme Editor; setting info |
| `assets/main.css` | header SVG mask rule; card success state; carousel arrow rules |
| `docs/figma-validation/followup-*.png` | screenshots (below) |

Not touched: `assets/dev1.css`, locales, product / review data, merchant settings, other worktrees.

## Screenshots (`docs/figma-validation/`)
- Header: `followup-header-before-1480.png`, `followup-header-after-1480.png`, `followup-header-before-390.png`, `followup-header-after-390.png`
- Add to cart: `followup-atc-1480-idle.png`, `followup-atc-1480-success.png`, `followup-atc-390-idle.png`, `followup-atc-390-success.png`
- Arrows: `followup-arrows-after-1480.png` (4 fit, none), `followup-arrows-after-900.png` (overflow, shown)

## Validation
Theme Check: 10 offenses = baseline. `node --check` on both edited JS modules: OK. `git diff --check`: clean.

## Remaining limitations
- SVG mask: the uploaded SVG is used as a monochrome shape in the icon colour (multi-colour SVGs would be flattened; raster uploads keep their colours).
- Theme Editor behaviour of the Judge.me section, reduced motion, sold-out cards, and real 2 / 5+ product carousels were not verified in a browser (reasons above).
- Add-to-cart label typo «إلي» (P-013) awaits approval.
