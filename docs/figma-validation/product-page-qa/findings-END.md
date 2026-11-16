# findings-END — Recommended · You May Also Like · Contact · Footer · responsive (saved by coordinator from agent hand-back)
Responsive sweep (14 widths), arrow/swipe/link tests, end-full-1024/768/360.png: NOT TESTED (preview down). Scripts ready: end-sweep.mjs, end-interact.mjs.

## Scorecard
| Section | Desktop | Mobile | Functional | Overall | Notes |
|---|---|---|---|---|---|
| Recommended (منتجات ذات صلة) | FAIL | FAIL | PARTIAL | PARTIAL | card +50 (portrait image, no rating row); 3 products; arrows with nothing to scroll; mobile heading −3 |
| You May Also Like (قد يعجبك أيضًا) | FAIL | FAIL | NOT TESTED | PARTIAL | same card cause; identical 3 products; F1 excluded ✓ |
| 14 Contact | PASS | PASS | PASS (hrefs) | PASS | ≤1.6px; placeholder contact links |
| 15 Footer | PARTIAL | PARTIAL | n/a | PARTIAL | logo 198×48 vs 186×45; mobile padding-top 48 vs 32 |
| Responsive sweep | — | — | NOT TESTED | NOT TESTED | preview down |

## Key measurements
- Recommended 1480: 835.6 vs 785; heading y60 600 32/52 #12568D centred PASS; card 316×592 vs 316×541.9; image 316×395 (portrait) vs 316×316; rating row missing (−28.9); title/desc/price/compare/CTA type PASS; badge h26 vs 28; arrows y444 vs 419; 3 cards in 4-col grid, slot x72 empty vs Figma peek row of 5.
- 390: Recommended 497.1 vs 477; Also-like 503.1 vs 477; card 165×309.1 vs 165×283; image 165×206.3 vs 165; radius 20 vs 12; RTL card x 201/24/−153 PASS; progress 342×4, fill 168, 33 below PASS; recommended heading y40 vs 43; FAB/badge mirrored vs product Figma (follows homepage Figma 190:4149).
- Loading shift: recommended 678→836 (+158) desktop, 371→497 (+126) mobile; CLS 0.034 / 0.028.
- Contact: 397.6 vs 396; card 1336×277.3; all type/CTA/gradient/shadow ≤1.6 PASS; mobile 426.6/426.6 PASS.
- Footer 1480: 469/469; columns, fonts, divider PASS; logo 198.4×48 vs 186×45 (+3 desc y). 390: logo y48 vs 32; everything +19; total 764 vs 745.

## Defects
- **END-D1 · P2 · both carousels · both VP** — image_ratio portrait (4:5) vs Figma square: +79 / +41.3. `templates/product.json` `image_ratio: "portrait"` in both `product_card_gallery_677WP3` blocks (~L3077, ~L3301). Fix: `square` on product-page instances only (template). Shared: homepage also portrait (index.json) — do not change via shared CSS without checking 190:3844.
- **END-D2 · P2 · both carousels** — rating row absent (no rating data on Kids brush / N2 / Tongue cleaner). Data/decision.
- **END-D3 · P2 · content** — both carousels show the same 3 products; empty desktop slot. Merchant: more products / different collection / S&D recommendations.
- **END-D4 · P2 · Contact** — placeholder `https://wa.me/201001234567`, `mailto:support@yourstore.com`; logo alt "Internal-ZT" (also footer). Merchant settings.
- **END-D5 · P3 · both carousels · 1480** — arrows shown though nothing scrolls (scrollWidth = clientWidth); "next" enabled. Fix: hide when no overflow. Shared: arrow CSS in main.css used by both.
- **END-D6 · P3 · Recommended · 390** — heading 3px high: dev1.css `.section-resource-list__header .text-block.h2 { padding-block:3px }` doesn't reach `.section-resource-list__content`. Fix: same rule scoped `.snosha-recommended-products .section-resource-list__content .text-block.h2` (<750) in main.css. Shared: no.
- **END-D7 · P3 · both carousels · 390** — card radius 20 vs 12 (native border_radius setting not scaled). Product-page scoped mobile radius var. Shared risk if dev1.css.
- **END-D8 · P3 · both carousels · 390** — FAB/badge mirrored vs product Figma; follows homepage Figma; Figma itself inconsistent → design decision.
- **END-D9 · P3 · Recommended** — loading shift +158/+126; placeholder min-height.
- **END-D10 · P3 · content** — Kids brush source 370×246 upscaled 1.6–1.9×.
- **END-D11 · P3 · Footer** — logo pixel_height 48 vs 45 (`sections/footer-group.json`). Shared: all pages.
- **END-D12 · P3 · Footer · 390** — `snosha_padding_top_mobile: 48` vs 32 (+16) + logo +3 = +19. Shared: all pages; verify homepage Figma first.

## Correct
Heading typography both sections; heading→cards 62/33; section padding 60/54 & 40/40; all card text styles; desktop border/radius; RTL order and mobile peek; mobile progress; arrow styling; quick add hover/FAB; F1 excluded; correct hrefs; Contact ≤1.6px; Footer desktop columns/fonts/form/divider/469.

## Not tested
Responsive sweep; arrow clicks; hover shot; swipe + progress update; link click; homepage-Figma check for footer values; copyright x.
