# SNOSHA — Homepage Featured Collection: Visual QA and Fix

Date: 2026-11-16 · Worktree `main` (merge with dev1 `6eca4bb` still unresolved; nothing staged or committed) · Horizon 4.4.0, RTL, Cairo.

- **Preview:** `127.0.0.1:9292`, dev theme #168066810072. Served `main.css` and `dev1.css` are byte-identical to the worktree.
- **Section:** `templates/index.json` → `product_list_fa6P9H` (native `product-list`, layout carousel, "Snosha featured collection style" on, collection `best-seller`, 4 products).
- **Figma:** desktop `190:3844` ("06 Featured Collection", 1480 × 841.1), mobile `190:4149` (390 × 573), read with `get_metadata`.

## A. Confirmed issues

| ID | Severity | Issue | Widths |
|---|---|---|---|
| FC-1 | **P1** | Card content wider than its slide. Text, price, badge and the image itself paint past the card edge and over the neighbouring card. | 1366 → 990 (card content 299 px in 289 / 250 / 208 / 200 px slides) |
| FC-2 | **P1** | Product **title missing on mobile cards**: squeezed to 0 px height. This is most likely the "missing heading on mobile" the merchant saw (see FC-0). | < 750 (390, 375, 360, 320, 430) |
| FC-0 | — (not reproduced) | Section heading "الأكثر مبيعًا" hidden on mobile. | Visible at every tested width: no `display / visibility / opacity` hiding; Cairo 600 24/38 at y 59 on mobile, 600 32/52 at y 60 on desktop. Subtitle and "عرض الكل" also visible. |
| FC-3 | P3 (setting) | Cards taller than Figma: the image is 4:5 portrait, Figma is square. | all |
| FC-4 | P3 (design trade-off) | At 360 and 320 only one card is fully visible (cards keep the 165 px Figma minimum). | 360, 320 |

**Tablet (989 → 750):** no overlap was found before or after the fix. The layout shows 2 cards per view (`snosha_columns_tablet: 2`, card 423 → 310 px). The overlap the merchant reported is FC-1, which starts at the 990 px desktop breakpoint, just above "tablet".

## B. Root causes

- **FC-1.**
  - `assets/dev1.css`, `.snosha-featured-collection .product-card__content .text-block.h5` sets the title to one line: `white-space: nowrap; overflow: hidden; text-overflow: ellipsis`.
  - Its min-content width is still the full unbroken product name (275 px). The card's content box can't shrink below 275 + 2 × 12 padding = 299 px.
  - Slide widths are computed correctly from the native "Columns" setting (4) and the container (`--snosha-fc-card-width`), so the card overflows its slide whenever that is < 299 px.
  - The image followed the oversized content box, which is why it measured a fixed-looking 300 px.
- **FC-2.**
  - `assets/dev1.css` (< 750): `.product-card__content.product-grid__card { block-size: 283px; overflow: clip }` fixes the card at Figma's 165 × 283.
  - The gallery setting `image_ratio: "portrait"` makes the image 206 px tall instead of Figma's 165 (+41 px).
  - The card's `> * { flex-shrink: 0 }` rule does not reach the title, which sits inside a `display: contents` link. So the title is the one flex item that shrinks: its height went to 0, and the content below it was clipped by `overflow: clip`.
- **FC-3.** The gallery's merchant setting `image_ratio: "portrait"` in `templates/index.json` (`product_card_gallery_677WP3`). Not a CSS defect.
- **FC-4.** Deliberate `dev1.css` floor: the mobile card is never narrower than at the 390 Figma frame (165 px), because the card typography scales with the card width and Figma's mobile title is already 8.35 px. Narrower cards would make the text smaller still; narrower phones scroll instead.

## C. Figma comparison (browser measured with `getBoundingClientRect`, section-relative)

### Desktop 1480 (Figma `190:3844`)
| Element | Figma | Before | Δ | After |
|---|---|---|---|---|
| Heading (H2) | y 60, row 90 incl. subtitle | y 60, 600 32/52 #12568D, subtitle 400 18/32 (y 118) | 0 | unchanged |
| First card x / row inset | 72 (52 container + 20) | 72 | 0 | 72 |
| Card size | 316 × 541.9 | 316 × 621 | h +79.1 (FC-3) | 316 × 621 |
| Card gap | 24 | 24 (340 step) | 0 | 24 |
| Image | 316 × 316 | 316 × 395 | h +79 (FC-3) | 316 × 395 |
| Title | one line | 600 16/27, 1 line | 0 | same |
| Price row | one line | h 32 | 0 | h 32 |
| Section height | 841.1 | 920 | +78.9 (FC-3) | 920 |

### Mobile 390 (Figma `190:4149`)
| Element | Figma | Before | Δ | After |
|---|---|---|---|---|
| Section height | 573 | 573 | 0 | 614.1 (+41 = portrait image, FC-3) |
| Title row y | 56 (section padding) | heading y 59 (3 px row padding) | 0 | same |
| Cards | 165 × 283, step 177 (gap 12) | 165 × 283, x 201 / 24 / −153 | 0 | 165 × 324 |
| **Product title** | present (≈ 8.35 / 14.1) | **height 0** | missing | **14.1 px, visible** |
| Image | 165 × 165 | 165 × 206.3 | +41.3 (FC-3) | 165 × 206.3 |
| Progress bar | 342 × 4, fill 168 | track 342, fill 168 | 0 | fill 168 → 255 after one swipe |

### Wider than the card (FC-1), before → after
| Width | Slide | Card content before | Spill elements | Card content after | Spill after |
|---|---|---|---|---|---|
| 1366 | 289 | 299 (image 300) | 12 | 289 (image 289 × 361) | 0 |
| 1200 | 250 | 299 (image 300) | 12 | 250 (image 250 × 313) | 0 |
| 1024 | 208 | 299 (image 300) | 12 | 208 (image 208 × 260) | 0 |
| 990 | 200 | 299 (image 300) | 12 | 200 (image 200 × 250) | 0 |

Below 1440 the price row (price + compare-at + discount) needs more than one line. It now wraps tidily inside the card (68 px) instead of overflowing it.

## D. Fixes applied

**`assets/main.css`** only: new block "SNOSHA — FEATURED COLLECTION CARDS: responsive fixes" at the end. `dev1.css` is the unresolved merge file and was not touched. Each selector is stronger than the `dev1.css` rule it adjusts, because `dev1.css` loads later.

| Selector | Declarations | Fixes |
|---|---|---|
| `.snosha-featured-collection .product-card__content .text-block.h5` | `contain: inline-size; flex-shrink: 0` | FC-1 (the title no longer sets the card's minimum width; the one-line ellipsis is kept), and part of FC-2 (the title never shrinks) |
| `.snosha-featured-collection .resource-list__slide .product-card__content.product-grid__card` (< 750) | `block-size: auto; overflow: visible` | FC-2. The card keeps the shared rule's `min-block-size` (283 px scaled) and grows with its content instead of clipping it. |

No markup, settings, product card blocks, carousel JS or templates were changed. The carousel, progress bar and card widths remain native and setting-driven (no hardcoded card widths added).

## E. Responsive results (after; measured on the live preview)

| Width | Cards fully visible | Card | Overlaps | Spill | Page overflow-x | Title |
|---|---|---|---|---|---|---|
| 1480 | 4 | 316 × 621 | 0 | 0 | 0 | 27 |
| 1440 | 4 | 307 × 610 | 0 | 0 | 0 | 27 |
| 1366 | 4 | 289 × 623 | 0 | 0 | 0 | 27 |
| 1200 | 4 | 250 × 574 | 0 | 0 | 0 | 27 |
| 1024 | 4 | 208 × 522 | 0 | 0 | 0 | 27 |
| 990 | 4 | 200 × 512 | 0 | 0 | 0 | 27 |
| 989 | 2 | 423 × 732 | 0 | 0 | 0 | 27 |
| 900 | 2 | 381 × 678 | 0 | 0 | 0 | 27 |
| 820 | 2 | 343 × 655 | 0 | 0 | 0 | 27 |
| 768 | 2 | 318 × 625 | 0 | 0 | 0 | 27 |
| 750 | 2 | 310 × 613 | 0 | 0 | 0 | 27 |
| 749 | 2 | 335 × 660 | 0 | 0 | 0 | 28.6 |
| 430 | 2 + peek | 184 × 361 | 0 | 0 | 0 | 15.7 |
| 390 | 2 + peek | 165 × 324 | 0 | 0 | 0 | 14.1 |
| 375 | 2 + peek | 165 × 324 | 0 | 0 | 0 | 14.1 |
| 360 | 1 + partials | 165 × 324 | 0 | 0 | 0 | 14.1 (FC-4) |
| 320 | 1 + partials | 165 × 324 | 0 | 0 | 0 | 14.1 (FC-4) |

**Interaction at 390, touch-emulated:**
- One swipe scrolls the carousel one card (scrollLeft −177). The slides move right-to-left (RTL-correct), and the progress fill grows 168 → 255 px.
- The 4 card links point to the correct product URLs.
- 4 quick-add buttons render (32 px round).

**Not tested this pass:** desktop arrows. With 4 products in 4 columns nothing scrolls; they behave as before.

## F. Regression checks (same rules apply to every `.snosha-featured-collection`)

| Consumer | 1200 | 390 | Result |
|---|---|---|---|
| Homepage Bundles (`product_list_gKe9AJ`) | 250 × 483, 0 overlap, 0 spill | 165 × 283, title 14 | OK (unchanged at 390: its image fits 283) |
| Product page Recommended / You may also like | 250 × 483, 0 overlap | 165 × 283, title 14 | **Improved.** They had the same FC-1 overflow before: the gallery was 300 px in a 250 px slide. Their "spill" count is the card gallery's 2nd/3rd photos, which sit off-screen inside the gallery's clipped scroller, identical with or without the fix. |
| Collection page grid (`.snosha-collection-grid`) | 260 × 500, 0 overlap | 173 × 354 | Not affected (rules are scoped to `.snosha-featured-collection`) |

**Static checks:**
- Theme Check: 10 offenses (baseline).
- `git diff --check` clean.
- `main.css` braces balanced.

## G. Remaining issues / merchant input

1. **FC-3: image ratio.** To match Figma exactly, set the product card **Image ratio** to **Square**: Theme Editor → Home page → Best sellers section → Product card → Card gallery. Cards then compute to Figma's 316 × 541.9 (desktop) and 165 × 283 (mobile), and the section to ≈ 841 / 573. The Bundles section and the product page carousels have the same setting.
2. **FC-4: 360 / 320.** Two full cards would need cards of ~150 / 136 px, which shrinks the already-small Figma mobile text (8.35 px title) further. Kept as is; confirm with the designer if two full cards are required on those phones.
3. **FC-0.** The section heading is visible on every width tested. If the merchant still sees it missing, it's likely on a specific device or browser; the product titles (FC-2) were the content actually missing on mobile.
4. **Content:** only 4 products in `best-seller`, so the desktop carousel never scrolls.

## H. Screenshots (`docs/figma-validation/featured-collection-qa/`)

- **Before / after pairs:** `fc-before-<w>.png` / `fc-after-<w>.png` for **1480, 1200, 900, 768, 390, 320**.
  - `fc-before-1200.png` was rendered on the live preview with only the new title rule switched off (headless page only).
- **Raw measurements:** `fc-before.json`, `fc-after.json`.
