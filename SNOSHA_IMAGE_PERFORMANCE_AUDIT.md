# SNOSHA — Image Performance Audit

Date: 2026-11-20 · Theme: dev `168066810072` (local `main`, uncommitted) · Live theme untouched.
Method: static inventory of every image path in the theme + runtime audit (puppeteer, Lighthouse viewports: mobile 412×823 @1.75, desktop 1350×940) + Lighthouse 12.2.1 (Edge, `theme dev` proxy on 127.0.0.1:9293).

> Performance scores through the `theme dev` proxy are **relative only** (assets served via the local proxy, hot-reload script injected, no CDN). Use them to compare before/after, not as production values.

## 1. Inventory (static)

203 image render paths: 101 `image_tag`, 17 raw `<img>`, 11 `<picture>` + 11 `<source>`, 10 hand-built `srcset`, 9 `image_url` backgrounds, 21 `image_url` plain URLs (JSON-LD / meta / JS data), 4 Liquid CSS backgrounds, 12 CSS masks, 4 JS image creations.

Loading logic that was already correct (unchanged):

| Path | Rule |
|---|---|
| `sections/snosha-hero.liquid` main image | `eager` + `fetchpriority=high` (homepage LCP) |
| `sections/hero.liquid`, `blocks/_slide.liquid`, `snippets/background-media.liquid` | Horizon: first section high/eager, later lazy |
| `snippets/product-media.liquid` (PDP gallery) | first media eager/high, rest lazy |
| `blocks/_blog-post-featured-image.liquid` | article hero eager/high |
| `sections/main-blog.liquid` | first cards eager, rest lazy |
| hero slides 2–3, reels, choose-care, comparison slider, long description, judge.me | lazy |

No `lcp-lazy-loaded` or `prioritize-lcp-image` failure in any baseline run.

## 2. Findings (runtime, before)

| # | Finding | Where | Impact |
|---|---|---|---|
| 1 | Grid/carousel `resource-image` always `eager` regardless of position | `snippets/resource-image.liquid` (homepage blog cards 27/33/51 KB, collection cards) | 12 eager offscreen images on home mobile |
| 2 | Product cards eager in sections 1–4 | `snippets/card-gallery.liquid` (`section.index < 5`) | homepage product list (section 3) eager offscreen on both viewports |
| 3 | `widths` jump 352 → 832 | `resource-image`, comparison slider (Shopify default widths) | mobile cards / before-after downloaded at 832 for ~490–650 px needed |
| 4 | `media-with-content` image has no `loading` and a height-based 1x/2x/3x srcset | `snippets/image.liquid` via `snippets/media.liquid` (bundle "why" image 265 KB) | eager offscreen 265 KB on bundle page |
| 5 | Long-description images: `sizes` 100vw on mobile but rendered 160–372 px | `blocks/_snosha-ld-media.liquid` | 150 KB file for a 228 px box |
| 6 | Hero main image mobile: need 628–721 px, nearest width 960 | `sections/snosha-hero.liquid` | ~20 % extra bytes on LCP image |
| 7 | Footer logo: no `loading`; `sizes` uses `var()` (invalid in `sizes`, falls back to 100vw) | `blocks/logo.liquid` (native) | 3–4 KB — not changed (block also renders at the top of the password page) |

False positives investigated (no change):

- Hero slides 2–3 and PDP gallery slides 2–3 report "lazy in view": they are horizontally off-screen slides; lazy is correct.
- Video poster (`snosha-how-to-use-video`): Lighthouse flags −64 KB, but `sizes` is the *drawn* width of a cover-cropped landscape poster in a portrait frame; a smaller file would be visibly soft.
- "got 3840 / 2880" rows with unknown KB: images not yet requested (fallback `src` width), not downloads.

## 3. Changes (dev theme only)

| File | Change |
|---|---|
| `snippets/resource-image.liquid` | grid/carousel: `lazy` + `sizes="auto, …"` when `section.index > 3` (Horizon's own `background-media` threshold); widths add 480, 640 |
| `blocks/comparison-slider.liquid` | explicit `widths` 360…3840 (both images) |
| `snippets/image.liquid` | optional `loading` param (omitted when blank — output unchanged for other callers) |
| `snippets/media.liquid` | passes `loading: 'lazy'` when `section.index > 3`, or on product pages after the main product section; otherwise no attribute (as before) |

Pre-push review (2026-11-20) — `snippets/card-gallery.liquid` **reverted to native** (`section.index < 5`). `section.index` counts only enabled sections. The collection grid (`templates/collection.json`) is index 2 today only because section 2 is disabled; enabling it would have made the first visible collection cards lazy under a `< 3` rule. For the same reason, the `resource-image` threshold moved from `> 2` to `> 3`, and `media` from `> 1` to the product-page rule above.
| `blocks/_snosha-ld-media.liquid` | `sizes="auto, …"` on `<img>` and mobile `<source>` (image is already lazy) |
| `sections/snosha-hero.liquid` | main image widths add 800; mobile `<source>` widths 240/480/640/800/960 |

All core-snippet edits are marked `Snosha (project addition/change)` in the file.

## 4. Results (runtime, same script)

| Page / viewport | Eager offscreen before → after | Notable byte changes |
|---|---|---|
| home mobile | 12 → 9 (collection cards in section 2, product list in section 3 (native), footer logo) | blog cards 27/33/51 KB → lazy; before/after 60+61 KB → 43+46 KB |
| home desktop | 8 → 5 (product list (native), footer logo) | blog cards now lazy |
| product mobile | 1 → 1 (footer logo). The final, stricter script also counts 5 product-recommendation cards (loaded via the Section Rendering API, eager by native design) and 1 native gallery image, both unchanged. | before/after 59+61 → 53+58 KB; long description 150 KB → 54 KB, 35 → 31 KB |
| bundle mobile / desktop | 2 → 1 | "why" image 265 KB no longer eager |

The "after" Lighthouse runs in §5 were taken **before** the pre-push revert of `card-gallery` (homepage product list was lazy then). The revert only restores native eager loading for 4 product-list images of 1–4 KB each, so it doesn't affect the SEO results; the performance numbers aren't re-measured for it.

Final attribute diff vs baseline (AR, all pages × mobile/desktop): the only `loading`/`sizes` changes are homepage blog cards (eager → lazy, `auto` sizes), long-description images (`auto` sizes) and the bundle "why" image (→ lazy). No `srcset`, `width`/`height`, `alt` or `fetchpriority` was lost.

Real LCP element (browser `PerformanceObserver`, AR + EN, mobile + desktop): hero image `eager` + `fetchpriority=high` (home); first gallery image `fetchpriority=high` (product, F1); `eager` cards (collection, blog); article image (no lazy); text on bundle and search. No LCP image is lazy-loaded.

Lighthouse before/after: see §5.

## 5. Lighthouse (before → after)

Performance score, one run per cell (36 before, 36 after), through the `theme dev` proxy:

| Page | AR mobile | AR desktop | EN mobile | EN desktop |
|---|---|---|---|---|
| home | 37 → 38 | 76 → 57 | 37 → 38 | 58 → 68 |
| product | 25 → 27 | 8 → 42 | 25 → 26 | 33 → 38 |
| f1 | 26 → 26 | 24 → 54 | 27 → 27 | 60 → 50 |
| bundle | 45 → 47 | 69 → 65 | 45 → 45 | 73 → 71 |
| collection | 40 → 48 | 73 → 68 | 47 → 41 | 72 → 59 |
| search | 48 → 47 | 61 → 71 | 47 → 51 | 61 → 57 |
| page | 46 → 44 | 63 → 64 | 51 → 43 | 66 → 66 |
| blog | 37 → 47 | 71 → 75 | 41 → 54 | 72 → 60 |
| article | 43 → 45 | 62 → 64 | 40 → 46 | 61 → 67 |

3-run check of the desktop cells that dropped (after only):

| Page | Runs | Median |
|---|---|---|
| home AR desktop | 61 / 72 / 62 | 62 |
| collection EN desktop | 68 / 72 / 69 | 69 |
| blog EN desktop | 64 / 65 / 74 | 65 |
| page EN desktop | 65 / 75 / 77 | 75 |

How to read this:

- Single-run variance through the proxy is ±10–15 points (home AR desktop alone ranges 61–72 across three identical runs), so most cell differences are noise.
- The large desktop swings on product (8 → 42) and F1 (24 → 54) come from CLS (0.629 / 0.277 before, 0.009 / 0.010 after). That CLS was intermittent before the change and Lighthouse could not attribute it (see below), so it is **not** claimed as a fix.
- Mobile product TBT dropped 5.1–5.9 s → 2.2–2.9 s, mostly third-party script timing (Judge.me, shop.app). Also not attributed to the image changes.
- Measured, attributable gains are the byte and request-priority changes in §4. A production comparison (PageSpeed Insights on the live URL after publish) is the reliable way to confirm score impact.
- No run before or after has an `lcp-lazy-loaded` or `prioritize-lcp-image` failure.

Tooling limit: with this Edge build, Lighthouse 12.2.1's TraceElements gatherer errors (`frame_sequence`), so the LCP element and layout-shift sources aren't reported in any run.

## 6. Remaining recommendations (not done)

- Bundle "why" image (`4aeb684217e4567f22b1769af6191a1e.jpg`, 2528 px, 265 KB): Horizon's `image` snippet builds a height-based srcset at the file's natural height. Upload a ~1300 px version (merchant), or later give `media.liquid` a width-based srcset.
- `assets/snosha-f1-arc.png` → WebP/SVG (−10 KB per Lighthouse).
- Collection cards (homepage section 2) stay eager by design (just below the fold); mobile still downloads 832 px for ~182 px needed because Horizon's mobile `sizes` is `100vw` for carousels.
- `compiled_assets/styles.css` ~434 KB unused CSS and third-party JS (Judge.me, shop.app, Shopify perf-kit) dominate mobile TBT — outside image scope.
- Footer logo `sizes` with `var()` is a Horizon bug (falls back to 100vw).
