# SNOSHA — Product Page Final QA Report (audit + correction pass)

Date: 2026-11-16 · Branch `main` (HEAD `bc19f2e`, working tree: your own uncommitted `assets/main.css` edits plus this pass) · Horizon 4.4.0 · Arabic / RTL / Cairo

## A. Executive summary

**Status: NOT READY.** Two things block release:
- **Reels is still missing.** The merchant's Reels change is not in this worktree, and not on the theme the preview serves.
- **Setting-level fixes are blocked.** Most of the remaining Figma differences are template settings, and the local template is stale.

**Correction pass.** All confirmed CSS-level defects are fixed and verified in the browser: 9 issue IDs, 8 CSS changes, all in `assets/main.css`. Nothing in the purchase flow is broken.

| Item | Value |
|---|---|
| Page / products | Default product template (`templates/product.json`). Primary product **SNOSHA F1** (`/products/snosha-f1`: 4 colour variants, Judge.me reviews, 5 media). SNOSHA N2 is the Figma subject, but has no variants or reviews, so it was used only for content notes. |
| Preview | `http://127.0.0.1:9292`, dev theme **#168066810072** (`Development (8ed237-DESKTOP-FP21D0B)`). Served `main.css` / `main.js` / `dev1.css` are byte-identical to the `main` worktree, not to `dev1`/`dev2`. Checked twice: audit with `theme dev` PID 15440; corrections with PID 14648 after your restart. |
| Figma | File `1fqyznLFgS65tTjGvBYPBm`. "Product N2 — Desktop" `190:10187` (1480 × 14658) and "Product N2 — Mobile" `190:10905` (390 × 14151). Every section frame was inspected (§B), with `get_metadata`, `get_design_context` and screenshots. |
| Viewports | Figma comparison at 1480 and 390. Regression checks at 1440 (audit), 1366, 1200, 1024, 990, 989, 900, 768, 750, 749, 430, 375, 360 (audit), 320. |
| Section results (17 rows) | PASS 5 · PARTIAL 9 · FAIL 1 (Reels: blocked) · NO FIGMA REFERENCE 1 (sticky bar) · FIXED in this pass: issues in 7 sections |
| Issues found | P0 0 · P1 1 · P2 20 · P3 31 (grouped by root cause). **Fixed: 9** · Blocked by template/settings: 14 · Design decision needed: 11 · Merchant content: 10 · Deferred, shared code: 5 · Not a defect after re-test: 3 |
| Theme Check | 10 offenses, equal to the baseline |

**Main risks before launch:**
1. Reels section empty (P1).
2. The template must be reconciled with the merchant's Theme Editor changes before any setting fix.
3. The announcement bar merge regression (+11 px, global header group).
4. Header design conflict: the product Figma has a 1-row header, the homepage Figma 2 rows.
5. Placeholder contact details (WhatsApp / email).
6. Both product carousels show the same 3 products.

> **Two notes on the brief's node table.**
> - Two labels were swapped: `190:10753` is **Storage & Care** (the brief said How to Use), and `190:10750` is **How To Use** (the brief said Promotional).
> - "Promotional section" has no separate frame. The Figma order is: Hero → 06 Comparison → 05 Video → 09 Before After → 08 Reviews → Long Description → 12 Reels → 14 FAQ → 09 How To Use → 10 Storage & Care → 08 Reviews Screenshots → Featured Collection ×2 → 14 Contact → 15 Footer. `templates/product.json` follows the same order.

### Blockers found during this pass
1. **The preview went down mid-audit.** `theme dev` exited. Per the rules I didn't restart it. You restarted it (PID 14648) and every correction was verified on it.
2. **Reels: the merchant change is not reachable.**
   - The local `templates/product.json` (last written 11:02) has 5 `reel` blocks with no `video`. The served dev theme renders the section at 0 px with no children.
   - The storefront is password-protected and `theme pull` is forbidden, so the merchant's version can't be read.
   - So either the change was made on another theme, or the `theme dev` restart (which uploads local files) overwrote it. **Please check in the Theme Editor of the theme the merchant used.**
   - Per rule 6, **I made no edits to `templates/product.json` or `sections/header-group.json`**.
3. **Your uncommitted `main.css` edits are kept as the baseline.** They comment out the gallery `.product-media` padding, add `object-fit: cover`, and reformat the Long Description rules. They change the gallery against Figma; see GAL-01.

## B. Section scorecard (page order)

| # | Section (Figma desktop / mobile) | Desktop | Mobile | Functional | Overall | Notes |
|---|---|---|---|---|---|---|
| 1 | Announcement (`190:10188` / `190:10906`) | FAIL | FAIL | n/a | FAIL | 55 vs 44: padding 15 vs 10 (merge regression), BLOCKED (`header-group.json`) |
| 2 | Header (`190:10189` / `190:10907`) | PARTIAL | PASS | PASS (focus) | PARTIAL | 131 vs 88: second nav row. Design conflict with the homepage Figma |
| 3 | Product hero: breadcrumbs, gallery, Buy Box (`190:10204` / `190:10914`) | PARTIAL | PARTIAL | PASS | PARTIAL | Typography and colours exact. **FIXED** stepper order. Paddings BLOCKED (template). Height gap is mostly content |
| 4 | Complementary (in hero) | PASS | PARTIAL | PASS | PASS | Correct product, cart and bubble update, **0 fly-to-cart**. Only 1 product configured (content) |
| 5 | Sticky add to cart | NO FIGMA REFERENCE | NO FIGMA REFERENCE | PASS (previous pass) | PASS | **FIXED** stepper order to match the Buy Box |
| 6 | 06 Comparison (`190:10461` / `190:11173`) | PARTIAL | PASS | n/a | PARTIAL | **FIXED** mobile shadow spill. Brush and logo settings BLOCKED |
| 7 | 05 How-to-use video (`190:10510` / `190:11221`) | PASS | PASS | PASS (plays) | PASS | — |
| 8 | 09 Before & After (`190:10376` / `190:11087`) | PASS | PASS | PASS | PASS | Merchant photos are portrait and upscaled (content) |
| 9 | 08 Judge.me reviews (`190:10390` / `190:11101`) | PARTIAL | PASS | PARTIAL | PARTIAL | **FIXED** card bottom padding and mobile track padding. Desktop +31 is content (a 4-line test review). Mobile LTR track is an app limit |
| 10 | Long Description, 7 panels (`190:10527` / `190:11237`) | PASS | PARTIAL | n/a | PASS | **FIXED** Modes clip, shadow and icons. Width settings BLOCKED (≤ 2.7 px) |
| 11 | 12 Reels (`190:10516` / `360:7240`) | FAIL | FAIL | NOT TESTED | FAIL | **BLOCKED**: 0 px, no videos on the served theme |
| 12 | 14 FAQ (`190:10720` / `190:11436`) | PARTIAL | PARTIAL | PASS | PARTIAL | **FIXED** mobile 14 px. Open row and mobile padding BLOCKED (template) |
| 13 | 09 How To Use (`190:10750` / `190:11464`) | PASS | PASS | n/a | PASS | Everything within 1 px |
| 14 | 10 Storage & Care (`190:10753` / `190:11511`) | PASS | PASS | PASS | PASS | Active pill +2 px is a deliberate equal-size choice. Tab 2/3 copy is placeholder (content) |
| 15 | 08 Reviews screenshots (`190:10779` / `190:11550`) | PARTIAL | PASS | PASS | PASS | Star size settings BLOCKED |
| 16 | Recommended products (`190:10816` / `190:11593`) | FAIL | PARTIAL | PASS | PARTIAL | **FIXED** mobile heading. Portrait image ratio BLOCKED (template). Rating row: data |
| 17 | You may also like (`190:10830` / `190:11613`) | FAIL | PARTIAL | PASS | PARTIAL | Same card cause as row 16. Same 3 products (content) |
| 18 | 14 Contact (`190:10844` / `190:11633`) | PASS | PASS | PASS (hrefs) | PASS | Placeholder WhatsApp and email (content) |
| 19 | 15 Footer (`190:14531` / `340:6895`) | PARTIAL | PARTIAL | n/a | PARTIAL | Logo +3 and mobile padding +16. Global; check the homepage Figma first |

## C. Pixel accuracy: corrected items (before → after)

| ID | Section | VP | Element | Figma | Original | Corrected | Remaining | Status |
|---|---|---|---|---|---|---|---|---|
| LD-D1 | LD Cleaning Modes | ≥990 | Visible image vs panel | clipped to the panel (frame `190:10580` clips), floor hidden | +51 above / +81 below, overlapping the Box frame (12,768 px²), floor visible | `overflow-y: clip` on the panel: image cut at the panel edges, floor hidden | 0 | FIXED ✔ (`fixed-ld-modes-1480.png`) |
| LD-D2 | LD Cleaning Modes | ≥990 | Image shadow | −14 24 blur 44 (σ 22) | `drop-shadow(-14px 24px 44px)` = σ 44, 2× softer | `drop-shadow(-14px 24px 22px)` (computed) | 0 | FIXED ✔ |
| LD-D3 | LD Sonic | 390 | Row icon | 20 | 24 | 20 | 0 | FIXED ✔ |
| LD-D3 | LD Brush / Water | 1480 | Row icon | 22 | 24 | 22 | 0 | FIXED ✔ |
| LD-D3 | LD Brush / Water | 390 | Row icon | 20 | 24 | 20 | 0 | FIXED ✔ (Battery ring unchanged at 27) |
| LOW-D04 | FAQ | 390 | Question / answer size | 14 / 14 | 16 / 16 | 14 / 14 (homepage FAQ still 16, its own Figma) | 0 | FIXED ✔ |
| MID-D04 | Comparison → Video | 390 | Panel shadow below the section | none | ~30 px grey haze on the video section | `overflow-y: clip` (mobile only); haze gone | 0 | FIXED ✔ (`fixed-comparison-video-boundary-390.png`) |
| MID-D05 | Judge.me | 1480 | Card bottom padding | 18 | 0 | 18 | 0 | FIXED ✔ |
| MID-D05 | Judge.me | 1480 | Card / section height | 483 / 723 | 496 / 736 | 514 / 754 | +31 = +28 (one test review wraps to 4 lines; Judge.me equalises card heights) +3 (star glyph / border). **Content**: a 3-line review gives 486 / 726 | PARTIAL (content) |
| MID-D06 | Judge.me | 390 | Card / section height | 367 / 600 | 352 / 570 | 370 / 604 (track padding 8 / 8 added) | +3 / +4 | FIXED ✔ |
| HERO-D05 | Buy Box quantity | 1480 / 390 | Button order | "+" right, "−" left | "−" right (x1367), "+" left | "+" x1367 / "−" x1295; 390: "+" x334 / "−" x272 | 0 | FIXED ✔ (`fixed-quantity-*.png`) |
| HERO-D05b | Sticky stepper | ≥750 | Button order | same as the Buy Box | "−" right | "+" right (x320.7), "−" left (x254.7) | 0 | FIXED ✔ |
| END-D6 | Recommended | 390 | Heading text y (section-relative) | 43 | 40 | 43 (padding 3 / 3) | 0 | FIXED ✔ (section 497 → 503, the same as also-like) |

### Key audit measurements that still differ (not fixed; see §I)

| ID | Section | VP | Element | Figma | Actual | Δ | Status |
|---|---|---|---|---|---|---|---|
| HERO-01 | Announcement | both | Height | 44 | 55 | +11 | FAIL: BLOCKED (setting) |
| HERO-04 | Header | 1480 | Height | 88 (1 row) | 131 (2 rows) | +43 | Design conflict |
| HERO-17 | Buy Box | 1480 / 390 | Rating y | 88 / 512 | 112 / 532 | +24 / +20 | BLOCKED (`product-details` padding) |
| HERO-33 | Hero | 1480 | Bottom space | 60 | 24 | −36 | BLOCKED (setting) |
| GAL-01 | Gallery (your edit) | 1480 | Main image | 749.4 wide, 57 px down in the 712×660 stage | 749×658 cover, top 0 (padding commented out) | y −57, h fills | Intentional (your change) |
| GAL-02 | Gallery (your edit) | 390 | Main image | — | 390×259 source drawn 369×362 (cover) | 1.4× upscale | Note: soft image |
| LOW-05 / 13 | FAQ | 1480 / 390 | Height | 498 / 614 | 460 / 564 | −38 / −50 | BLOCKED (`open_by_default`, `padding_top_mobile`) |
| LOW-01 / 02 | Reels | 1480 / 390 | Height | 735 / 804 | 0 / 0 | — | BLOCKED |
| END-04 | Product cards | 1480 | Card | 316 × 541.9 (square image) | 316 × 592 (4:5 image) | +50 | BLOCKED (`image_ratio`) |
| END-18 | Product cards | 390 | Card | 165 × 283 | 165 × 309 | +26 | BLOCKED |
| MID-14 | Comparison | 1480 | Brush body bbox | x1239–1343, y373–848 | x1208–1319, y391–813 | −11 % size | BLOCKED (settings / asset) |
| MID-13 | Comparison | 1480 | Strip logo | 177 × 36 | 132 × 27 | −45 w | BLOCKED (setting / asset) |
| LD-55 | LD Water | 1480 | Frame | 540 × 672, 1.5 px dashed | 538 × 669, 1 px | −2 / −3 | BLOCKED (settings, P3) |
| LOW-31 / MID-43 | Ratings (screenshots, Judge.me) | 1480 | Stars | 22, gap 4 | 24, gap 2 | +2 | BLOCKED (settings, P3) |
| END-38 / 42 | Footer | 1480 / 390 | Logo / mobile padding-top | 186×45 / 32 | 198×48 / 48 | +3 / +16 | Deferred (global) |

Full per-element tables (≈ 250 rows) are in the audit appendices listed in §M.

## D. Typography

- **Cairo is loaded and applied.** `document.fonts` shows Cairo 400/500/600/700 loaded on every run. Every measured text node computes `Cairo`. The Judge.me widget adds JudgemeStar (icons) and GTStandard-M 500 (desktop app chrome).
- **Matches Figma exactly** (size, weight, line height, colour, alignment, line count) at 1480 and 390:
  - Buy Box: H1 700 38/64 colour3; price 600 32/52; compare 14/22; badge 12/18; capsule, benefits, trust pills, accordion, complementary.
  - Breadcrumbs: 14/24 and 11/24.
  - Comparison, Video, Before & After: headings 600 32/52 #12568D, descriptions 400 18/32 #5A5A59.
  - Long Description: all 7 panels.
  - How To Use, Storage & Care, Reviews screenshots, both carousels' card text, Contact, footer link columns.
- **Fixed:** FAQ mobile question and answer (16 → 14). Recommended mobile heading position (+3).
- **Remaining:**
  - Judge.me quote and name colour #000 vs #131311, from the app block's `text_color` (merchant setting).
  - The add-to-cart label reads "أضف إلي السلة" vs Figma "أضف إلى السلة" (locale string, content).
- **Content-driven wraps:**
  - Complementary title on 390 wraps to 2 lines, because the store money format "EGP 2,499.00" is 93 px against Figma's "EGP 200" 59 px.
  - LD Sonic and Water headings wrap to 2 lines at 1024 (no Figma frame at that width).

## E. Spacing and layout

- **Containers:**
  - 1480: content x72–1408 inside the 1376 container (52 gutter) in every section.
  - 390: 20 / 24 gutters exactly as each Figma section specifies.
  - Hero columns 712 · 64 · 560.
- **Section heights after the fixes:**

| VP | Section heights (Figma in parentheses) |
|---|---|
| 1480 | announcement 55 (44) · header 131 (88) · hero 1511 (1807) · comparison 975 (976) · video 911 (911) · before-after 844 (844) · Judge.me 754 (723) · long description 3680 (3683) · reels 0 (735) · FAQ 460 (498) · how to use 672 (672) · storage 584 (584) · screenshots 660 (658) · recommended 836 (785) · also-like 836 (785) · contact 398 (396) · footer 469 (469) |
| 390 | header 64 (64) · hero 1898 (2203) · comparison 788 (788) · video 679 (679) · before-after 558 (558.19) · Judge.me 604 (600) · long description 3726 (3738) · FAQ 564 (614) · how to use 914 (914) · storage 630 (630) · screenshots 389 (389) · recommended 503 (477) · also-like 503 (477) · contact 427 (426.6) · footer 764 (745) |

- **Hero height gap, fully explained.**
  - Desktop −296 = +24 (Buy Box top padding) −86 (second complementary card not configured) −128 ("الوصف" text is 1 sentence in F1) −70 (warranty row hidden: empty) −36 (bottom padding).
  - Mobile −305 is the same terms (+20, +19 wrap, −86, −184, −70, −4).
  - Only the padding terms are styling, and those are template settings (BLOCKED). **The section must not be forced to Figma's height.**
- **Compounded spacing:** none found. Section paddings follow Figma, and the large gaps are content or setting driven as listed.

## F. Images and assets

| Item | Finding | Class |
|---|---|---|
| Gallery | Your edit makes the main image fill the stage (`cover`, top-anchored). Figma places the image 57 px down. The 390 source (390×259) is upscaled 1.4×. | Intentional / content |
| Comparison brush | PNG crop and aspect (0.572 vs Figma 0.505) plus settings: −11 % size, offset −31 px | BLOCKED (asset / settings) |
| Comparison logo | 139×34 raster shown at 132×27 vs 177×36 | BLOCKED (setting; SVG recommended) |
| Before & After | Merchant portrait 780×975 images shown cover in 1336×560 (1.71× upscale, middle 34 % visible) | Content |
| LD Modes | The shadow and clip now match Figma's intent. LD Brush keeps its aspect ratio (Figma squashes it 17 %). | FIXED / design decision |
| LD Water 390 | Image 9.8 px higher than Figma | Merchant image setting |
| Product cards | 4:5 portrait instead of square. The Kids brush source is 370×246, upscaled 1.6–1.9×. | BLOCKED / content |
| Reviews screenshots | Cards 5–6 repeat screenshot 4 (Figma shows placeholders). LOW-D09 "broken images" **not reproducible**: all 6 load (`run-low-img.log`). | Content / resolved |
| Header logo | Uploaded logo is 4.13:1 vs Figma 4.94:1 (153 vs 184 wide) | Known asset |

## G. Interactive QA (performed after the preview came back)

| Test | Result |
|---|---|
| Gallery: thumbnail click (adjacent and non-adjacent 1→3→5→1) and mouse drag | PASS |
| Variant swatches ×4 | PASS. URL `?variant=` updates, legend and checked state update, all available. Image changes only where the variant has its own image (content). |
| Quantity +/−, minimum floor (− disabled at 1) | PASS |
| Main add to cart, qty 2 | PASS. `/cart.js` F1 ×2, bubble "2", native `fly-to-cart--main` (expected) |
| **Complementary "+"** | PASS. One `POST /cart/add.js`, the Tongue Cleaner variant added, bubble "1", **0 `<fly-to-cart>`**, button stays enabled |
| Cart drawer | The store opens no drawer on add (same for main and complementary: current store behaviour) |
| Sticky bar | Behaviour verified in the previous pass (9 widths, quantity / variant sync, sticky add). This pass re-checked stepper order only. |
| Accordions (click, Enter, Space) | PASS (1480 and 390) |
| Focus-visible | PASS on thumbnails, swatches, quantity, add to cart, complementary link and add, accordion, zoom, breadcrumbs |
| Video play | PASS: deferred video loads (ready state 4) and plays (t = 2.96 s at 390) |
| Before & After: mouse drag, click-to-position, touch drag, keyboard arrows, focus outline | PASS |
| Judge.me desktop arrows | PASS: the track translates one page per click (loop of cloned cards) |
| Judge.me mobile swipe | INCONCLUSIVE in headless touch emulation (app-controlled widget). Mobile arrows are hidden by the current setting. Check manually on a phone. |
| FAQ / Storage tabs / Reviews screenshots carousel | PASS (audit: keyboard roving tabs follow RTL; arrows, drag, swipe and progress) |
| Product carousels: mobile touch swipe | PASS: scrolls to the end (−177), progress fill 168 → 342 px. RTL correct. |
| Product carousels: desktop arrows | PARTIAL: they work, but stay enabled with nothing to scroll (3 products fit 4 columns; END-D5) |
| Card link | PASS (navigates to the product) |
| Reels playback / interaction | NOT TESTED (section empty: BLOCKED) |
| Sold-out state | NOT TESTED: all 4 F1 variants are available, and product data must not be changed |

## H. Responsive (after the fixes)

- **Overflow:** horizontal overflow is 0 at 1480, 1366, 1200, 990, 989, 750, 749, 430, 390, 375, 320. The only elements past the viewport are native off-screen ones: the skip link, and the closed menu drawer below 750.
- **Cleaning Modes clip:** active from 990 up, mobile layout below as designed (checked at 990 / 989).
- **LD tablet 750–989** (mobile stacked layout): no text-on-image overlap. The image frames sit behind the short right-aligned rows, matching the mobile "behind the list" design (`fixed-ld-modes-768.png`, `fixed-ld-water-768.png`). No clipping or overflow.
- **Hero height** by width: 1511 (1366 / 1200), 1554 (990), 1540 (989), 1672 (750), 2222 (749), 1911 (430), 1909 (375), 1914 (320). Purchase controls stay usable everywhere.
- **Judge.me** 754 desktop / 604 mobile at every width (694 at 320, where the card text wraps more).

## I. Defect register (grouped by root cause)

Legend: **FIXED** = changed and verified here · **BLOCKED** = needs the reconciled `templates/product.json` / `header-group.json` (or the Theme Editor) · **DESIGN** = needs a designer decision · **CONTENT** = merchant data · **DEFERRED** = shared or global code, needs approval.

| ID | Sev | Section | VP | Description | Expected → Actual | Cause / file | Fix | Status | Shared risk |
|---|---|---|---|---|---|---|---|---|---|
| LOW-D01 | P1 | Reels | both | Section renders 0 px | 735 / 804 → 0 | 5 `reel` blocks have no `video` in the local and served template; `snosha-reels.liquid` hides an empty section by design | Merchant: pick the videos in the Theme Editor on the dev theme, then re-audit | **BLOCKED** | Homepage instance too |
| LD-D1 | P2 | LD Modes | ≥990 | Image not clipped | see §C | no vertical clip | `main.css` `.snosha-long-description__panel--large_scaled { overflow-y: clip }` (≥990) | **FIXED** | No (Modes archetype only) |
| LD-D3 | P2 / P3 | LD Sonic / Brush / Water | both | Icons 24 | 20 / 22 | `--snosha-ld-icon(-mobile)` | `main.css` `--large` mobile 20; `--medium` 22 / 20 | **FIXED** | Battery checked (27, unchanged) |
| LOW-D04 | P2 | FAQ | 390 | 16 px text | 14 | `dev1.css` 16 px at all widths | `main.css` `body:has(.product-information) .snosha-faq` (<750) | **FIXED** | No (product page only; homepage still 16) |
| MID-D05 / D06 | P2 | Judge.me | both | Missing card bottom padding and mobile track padding | see §C | `dev1.css` | `main.css` `.snosha-jdgm .jdgm-cards-carousel` overrides | **FIXED** (desktop rest is content) | No |
| HERO-D05 | P3 | Buy Box + sticky | both | Stepper mirrored | "+" right | DOM order | `main.css` `order` (Buy Box scope + sticky stepper) | **FIXED** | No (scoped) |
| LD-D2 | P3 | LD Modes | ≥990 | Shadow 2× soft | σ 22 | drop-shadow semantics | `main.css` 44 → 22 px | **FIXED** | No |
| MID-D04 | P3 | Comparison | 390 | Shadow spill | none | no vertical clip | `main.css` `.snosha-comparison` `overflow-y: clip` (<750) | **FIXED** | Product page only (section not on the homepage) |
| END-D6 | P3 | Recommended | 390 | Heading 3 px high | y43 | `dev1.css` rule targets the header only | `main.css` padding 3 / 3 in the content area | **FIXED** | No |
| LOW-D02 | P2 | FAQ | both | Warranty row closed | open (−38 / −66) | `accordion_row_q7hAzK.open_by_default: false` | set `true` | **BLOCKED** | No |
| LOW-D03 | P2 | FAQ | 390 | Padding-top 56 | 40 | `padding_top_mobile: 56` | set 40 (with D02: exactly 614) | **BLOCKED** | No |
| HERO-D03 | P2 | Buy Box | both | Starts +24 / +20 | 0 | `product-details` `padding-block-start: 24` | set 0 | **BLOCKED** | No |
| HERO-D04 | P3 | Hero | 1480 | Bottom 24 | 60 | `product-details` `padding-block-end` | 60 desktop / 24 mobile | **BLOCKED** | No |
| END-D1 | P2 | Both carousels | both | 4:5 images | square (+50 / +26) | `image_ratio: "portrait"` in both product-page card blocks | `square` (product page only) | **BLOCKED** | Homepage stays portrait |
| HERO-D01 | P2 | Announcement | both | 55 vs 44 | py 10 | `header-group.json` padding 15 (reverted by merge `c5a7390`) | set 10 / 10 | **BLOCKED** | Global (the homepage Figma is also 44) |
| MID-D01 / D02 / D03 | P2 / P3 | Comparison | 1480 / 390 | Brush −11 %, logo small, mobile glow .45 | see §C | settings / asset; the glow needs a mobile setting | `image_width` ≈ 445 plus re-tune, `logo_width` ≈ 187 or SVG, mobile glow | **BLOCKED** | No |
| LD-D5 / D6 | P3 | LD Water / Modes / Brush | 1480 | ≤ 2.7 px rounding | — | widths 61 / 55 / 72.5, offset 100, spill 46 | 61.2 / 55.2 / 72.3, 101, 47 | **BLOCKED** | No |
| LOW-D06, MID-D09 | P3 | Rating stars | both | 24 / 2 | 22 / 4 (14 / 3 mobile) | block settings | set | **BLOCKED** | No |
| HERO-D02 | P2 | Header | 1480 | 2-row header | the product Figma has 1 row, the homepage Figma 2 | — | Designer decision | **DESIGN** | Global |
| END-D8 | P3 | Cards | 390 | FAB and badge mirrored vs the product Figma | the homepage Figma agrees with the current build | — | Designer | **DESIGN** | Homepage |
| MID-D07 | P2 | Judge.me | 390 | LTR track (first card on the left) | RTL | the app translates LTR only | Accept or document | **DESIGN / app limit** | No |
| LD-D4, LD-D7, LD-D9 | P3 | LD Box / Brush | — | Figma row-height quirk; squash; text overflow | — | accepted in plan 4C | — | **DESIGN (accepted)** | No |
| LOW-D05 | P3 | FAQ | 1480 | "عرض الكل ←" link not built | — | no setting | Confirm, then add | **DESIGN** | Homepage FAQ |
| LOW-D07 | P3 | Storage | both | Active pill +2 | 50 / 34 | a deliberate equal-size choice (`dev1.css` comment) | Accept | **DESIGN (accepted)** | No |
| HERO-D06 / D07 | P3 | Complementary / gallery | — | Wrap from price width; image x +5.7 (different asset) | — | — | Money format / accept | **DESIGN** | No |
| END-D5 | P3 | Both carousels | 1480 | Arrows enabled with nothing to scroll | hidden | native arrows; needs an overflow check after async load | Small JS or setting | **DEFERRED** | Yes (both sections) |
| END-D7 | P3 | Cards | 390 | Radius 20 vs 12 | — | native card setting, shared styling | Product-scope radius variable | **DEFERRED** | Homepage |
| END-D9 | P3 | Recommended | both | Loading shift +158 / +126 (CLS 0.03) | — | async placeholder | Placeholder min-height | **DEFERRED** | No |
| END-D11 / D12 | P3 | Footer | both | Logo 48 vs 45; mobile padding 48 vs 32 | — | `footer-group.json` | Check the homepage Figma first | **DEFERRED** | Global |
| END-D2, END-D3, END-D4, LOW-D08, MID-D08, MID-D10, HERO-D08, LD-D8, END-D10 | P2 / P3 | various | — | No ratings on 3 products; both carousels show the same 3 products; placeholder WhatsApp and email, alt text "Internal-ZT"; Storage tabs 2–3 and 5 / 6 FAQ answers are placeholders or empty; Judge.me card colours (app settings); portrait B/A photos; 1 complementary product, empty warranty, short F1 description, "أضف إلي" typo, "ازرق"; Water image y; low-res Kids image; Judge.me test reviews | — | merchant data | Merchant | **CONTENT** | — |
| LOW-D09, carousel swipe, MID-D05 "4-line clamp" | — | — | — | Earlier suspicions | — | re-tested: images load, swipe works, `--line-clamp` is unset (the theme reserves 3 lines) | — | **Not a defect** | — |

## J. What is already correct

- **Hero:** column geometry; mobile stacking order identical to Figma; gallery stage (712×660 r28 / 352×364 r22), thumbs, badge and zoom.
- **Buy Box:** every typographic and colour value; trust pills; accordion styling; complementary card styling and add-to-cart (no animation).
- **Sections matching within 1 px at both widths:** Comparison panel, strip, rows and gradient; Video; Before & After (slider 1336×560 / 350×254, handle, chips, gaps 24 / 24); How To Use; Storage & Care; Reviews screenshots; Contact.
- **Long Description:** all typography; Intro, Sonic and Battery geometry; tiles, gradient and rhythm; Sonic one-line mobile heading; Box composite image.
- **Product cards:** text styles; RTL order and peek; mobile progress bar; current product excluded from both carousels.
- **Footer** desktop columns and fonts.
- **Page-wide:** Cairo applied everywhere; no horizontal overflow at any tested width; purchase flow fully functional.

## K. Recommended fix order (for the next pass)

1. **Reconcile the template first** (merchant / you). Get the merchant's Theme Editor version of `templates/product.json` into the worktree; this is the Reels state. Use a pull you run yourself, or `theme dev --theme-editor-sync`, so the next `theme dev` upload doesn't overwrite it. Then re-audit Reels against `190:10516` / `360:7240`.
2. **Product template settings, in one batch:**
   - FAQ: `open_by_default`, `padding_top_mobile` 40.
   - `product-details` padding 0 / 60.
   - Card `image_ratio` square ×2.
   - Star sizes.
   - LD widths.
   - Comparison brush and logo.

   This should close the FAQ, hero-offset and carousel height gaps. Re-measure afterwards.
3. **Global header group** (separately, every page): announcement padding 10. Header layout only after a design decision.
4. **Deferred code:** carousel arrow overflow check (END-D5), recommended placeholder height (END-D9), mobile card radius (END-D7). Each touches shared carousel or card code, so test the homepage with each.
5. **Footer** values: only after checking the homepage footer Figma.
6. **Merchant content** list (§I CONTENT).

## L. Final acceptance assessment

**Not ready — blocked by missing merchant content (Reels) and by the stale template**, which stops the remaining setting-level corrections. Every CSS-level defect that could be fixed safely is fixed and verified. The purchase flow (variants, quantity, add to cart, complementary add, sticky bar) works.

## M. Files and evidence

**Changed in this pass:** `assets/main.css` only, on top of your uncommitted edits.
- Long Description: `--large` mobile icon 20; `--medium` icons 22 / 20; Modes `overflow-y: clip` (≥990); drop-shadow blur 22.
- Buy Box quantity `order`; sticky stepper `order`.
- Recommended / related mobile heading padding.
- New block "SNOSHA — PRODUCT PAGE QA CORRECTIONS" at the end: FAQ mobile 14 px (product page), comparison mobile `overflow-y: clip`, Judge.me card / track padding.

No Liquid, JS, JSON, locale or settings files were touched. Nothing was committed, pushed, pulled or published.

**Evidence** in `docs/figma-validation/product-page-qa/` (34 PNG, ~26 MB):
- Before: `full-1480.png`, `full-390.png`, and the audit crops `ld-zoom-modes-image-1480.png`, `ld-pair-modes-1480.png`, `mid-video-390-topband.png`, `mid-reviews-*.png`, `end-recs-*.png`, `low-faq-*.png`, `hero-header-1480.png`.
- After: `fixed-full-1480.png`, `fixed-full-390.png`, `fixed-full-990/750/320.png`, `fixed-ld-modes-1480.png`, `fixed-ld-sonic-390.png`, `fixed-ld-modes-768.png`, `fixed-ld-water-768.png`, `fixed-faq-390.png`, `fixed-jdgm-1480/390.png`, `fixed-quantity-1480/390.png`, `fixed-recommended-390.png`, `fixed-comparison-video-boundary-390.png`, `fixed-gallery-1480/390.png`.
- Figma renders: `figma-190-10204.png`, `figma-190-10914.png`, `figma-190-10189.png`, `figma-190-10390.png`, `figma-190-10527.png`, `figma-190-11237.png`, `figma-190-10720.png`, `figma-190-11436.png`, `figma-190-10816.png`, `figma-190-11593.png`, `figma-190-10516.png`, `figma-360-7240.png`.

**Audit appendices** (per-section measurement tables, in the same folder): `findings-HERO.md`, `findings-MID.md`, `findings-LD.md`, `findings-LOW.md`, `findings-END.md`. Measurement scripts and raw logs stay in the session scratchpad (`C:\Users\pop\AppData\Local\Temp\claude\b508b26346e18e55\e9e69fb0-cca3-42be-9afd-c49580f26fec\scratchpad\audit\`), which may be cleared.
