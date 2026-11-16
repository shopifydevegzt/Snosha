# findings-LOW — Reels · FAQ · How To Use · Storage & Care · Reviews Screenshots
(Delivered by the LOW agent as a message, saved verbatim in substance by the coordinator. Preview went down during the agent's final re-check: LOW-D09 unverified.)

## Scorecard
| Section | Desktop | Mobile | Functional | Overall | Notes |
|---|---|---|---|---|---|
| 12 Reels | FAIL | FAIL | NOT TESTED | FAIL | 0px; no videos set (merchant content/config) |
| 14 FAQ | PARTIAL | FAIL | PASS | PARTIAL | warranty row closed (−38/−66), mobile padding-top +16, mobile text 16 vs 14 |
| 09 How To Use | PASS | PASS | n/a | PASS | all within 1px |
| 10 Storage & Care | PASS | PASS | PASS | PASS (minor P3) | active pill +2 h; tabs 2–3 placeholder copy |
| 08 Reviews Screenshots | PARTIAL | PASS | PASS | PARTIAL | pill +2, stars 24/16 vs 22/14, cards 5–6 repeat image 4 |

## Measurements (section-relative; x page-left)
| ID | Section | VP | Element | Figma | Actual | Delta | Status |
|---|---|---|---|---|---|---|---|
| LOW-01 | Reels | 1480 | section h | 735 | 0 (wrapper innerHTML len 1) | −735 | FAIL |
| LOW-02 | Reels | 390 | section h | 804 | 0 | −804 | FAIL |
| LOW-03 | Reels | 1480 | expected cards | 5× 248×523, gap 24, carousel y152 | template card 248/440 frame, gap 24, 5 per view | settings match | NOT RENDERED |
| LOW-04 | Reels | 390 | expected cards | 290×623 (video 516), gap 12, centre x50; progress 342×4 y760 fill 68 | template 290/516/12, progress on | settings match | NOT RENDERED |
| LOW-05 | FAQ | 1480 | section h | 498 | 460 (498 with warranty row open) | −38 | FAIL |
| LOW-06 | FAQ | 1480 | container / content x | 52 / 72, w1336 | same | 0 | PASS |
| LOW-07 | FAQ | 1480 | title / subtitle | 600 32/52 #12568D; 400 18/32 #5A5A59 | same | 0 | PASS |
| LOW-08 | FAQ | 1480 | "عرض الكل ←" link | present (heading bottom-left) | not rendered | missing | FAIL P3 |
| LOW-09 | FAQ | 1480 | heading→columns; columns | 61; 2×656 gap 24, rows 12 apart | same | 0 | PASS |
| LOW-10 | FAQ | 1480 | closed row | 656×55 r14 1px #DCF2FB pad 14/16, Q 600 16/27 | same | 0 | PASS |
| LOW-11 | FAQ | 1480 | row 4 initial | open 93, bg #F0FAFE | closed 55 white | −38 | FAIL |
| LOW-12 | FAQ | both | chevron | 18px inline-end, #176BB0 | same | 0 | PASS |
| LOW-13 | FAQ | 390 | section h | 614 | 564 (630 opened) | −50 | FAIL |
| LOW-14 | FAQ | 390 | padding-top | 40 | 56 | +16 | FAIL |
| LOW-15 | FAQ | 390 | title / subtitle | 600 24/38; 400 13/22 | same | 0 | PASS |
| LOW-16 | FAQ | 390 | question | 600 14/27 | 600 16/27 | +2 | FAIL |
| LOW-17 | FAQ | 390 | answer | 400 14/28 | 400 16/28 | +2 | FAIL |
| LOW-18 | FAQ | 390 | row | 350×55 pad 14/20 | same | 0 | PASS |
| LOW-19 | How To Use | 1480 | section / title | 672; 700 32/52 #12568D | same | 0 | PASS |
| LOW-20 | How To Use | 1480 | panel | 1336×482 y70 #F0FAFE 1px #DCF2FB r16, shadow 0 8 18 rgba(13,64,128,.06) | same | 0 | PASS |
| LOW-21 | How To Use | 1480 | steps / badge | 46 apart, 16/28 #5A5A59; badge 30 gradient, Bold 14 | same | 0 | PASS |
| LOW-22 | How To Use | 1480 | note | 1286×54 white r14 600 14/24 #176BB0 | same | 0 | PASS |
| LOW-23 | How To Use | 390 | title/panel/steps/note | 700 22/52; panel 350×768 y106; note 320×102 | identical | 0 | PASS |
| LOW-24 | Storage | 1480 | section/title/tabs | 584; 700 32/52; tabs x521 h52 gap10 | same | 0 | PASS |
| LOW-25 | Storage | 1480 | active pill | 156×50 | 157.7×52 | +2 h | P3 |
| LOW-26 | Storage | 1480 | inactive pills | 98/164×52 | 97/163.7×52 | ≤1 | PASS |
| LOW-27 | Storage | 1480 | card/items | y204 1336×320 pad 24/28/26 r16 | same | 0 | PASS |
| LOW-28 | Storage | 390 | tabs/card | pills h34(active)/36; card 350×432 | active h36; card identical | +2 active | P3 |
| LOW-29 | Screenshots | 1480 | section h | 658 | 659.9 | +1.9 | P3 |
| LOW-30 | Screenshots | 1480 | rating pill | 371×60 | 381.2×62 | +2 h (width = content) | P3 |
| LOW-31 | Screenshots | 1480 | stars | 22, gap 4 | 24, gap 2 | +2 | FAIL P3 |
| LOW-32 | Screenshots | 1480 | count text | "(— تقييم)" | "(6 تقييمات)" | — | CONTENT |
| LOW-33 | Screenshots | 1480 | cards | 429×292 gap 24 r22 | 429.3×291.9 | +2 y | PASS |
| LOW-34 | Screenshots | 1480 | crops | 93.3/94.1/100/93.8% | 93/94/100/94% cover | ≤0.3% | PASS |
| LOW-35 | Screenshots | 1480 | arrows | 56px, x52/x1372 | same, +2 y | +2 | PASS |
| LOW-36 | Screenshots | 1480 | card order | Figma shot 1 at left (LTR) | shot 1 at right (RTL start) | mirrored | NOTE P3 |
| LOW-37 | Screenshots | both | cards 5–6 | dashed placeholders | copies of screenshot-4.jpg | — | CONTENT |
| LOW-38 | Screenshots | 390 | pill / stars | 256×39; stars 14 gap 3 | pill same; 16 gap 1 | +2 | P3 |
| LOW-39 | Screenshots | 390 | track/card/progress | track y155; card 238×162 x132; fill 88 | identical | 0 | PASS |

## Functional
- FAQ (both): click open/close PASS; keyboard Enter/Space PASS; focus outline 1px #131311 offset 3 (native `<details>`).
- Storage tabs: click, aria-selected, roving tabindex, hidden panels PASS; arrows RTL-correct (ArrowLeft = next), Home/End PASS; focus 2px #0F64A8.
- Reviews 1480: RTL scroller; prev disabled at start; next pages to end; drag 400px → one card + snap PASS; no progress on desktop (as Figma).
- Reviews 390 touch: 150px swipe = one card; progress fill grows from right (RTL) PASS; no arrows on mobile (as Figma).

## Defects
- **LOW-D01 · P1 · Reels · both** — section absent (0 vs 735/804). Cause: merchant content/config — 5 `reel` blocks in `templates/product.json` have no `video`; `sections/snosha-reels.liquid` L24-28 counts only blocks with video, L53 `if reel_count > 0 or request.design_mode` (intentional). Fix: merchant assigns 5 Shopify videos (+ products) in Theme Editor. Shared: section also used on homepage. Evidence: figma-190-10516.png, figma-360-7240.png, low-dump-*.json.
- **LOW-D02 · P2 · FAQ · both** — warranty row closed on load, Figma open (−38 / −66). Cause: config `accordion_row_q7hAzK.open_by_default: false` (homepage `true`). Fix: set true. Shared: no. Evidence: low-faq-1480.png vs low-faq-open-1480.png (= 498).
- **LOW-D03 · P2 · FAQ · 390** — padding-top 56 vs 40. Config `padding_top_mobile: 56`. Fix → 40 (with D02 = 614 exact). Shared: no.
- **LOW-D04 · P2 · FAQ · 390** — Q/A text 16 vs 14. CSS `assets/dev1.css` ~L1811 `.snosha-faq .accordion .details__header { font-size:16px }` (no mobile override), answer text block `1rem`. Fix: 14px <750 scoped via custom_class. Shared: YES (homepage FAQ matches its Figma at 16).
- **LOW-D05 · P3 · FAQ · 1480** — "عرض الكل ←" link not implemented (no setting). Confirm with designer. Shared: homepage FAQ.
- **LOW-D06 · P3 · Reviews screenshots · both** — stars 24/2 & 16/1 vs 22/4 & 14/3; pill border outside → 62 vs 60, carousel +2. Config (rating block settings). Shared: no.
- **LOW-D07 · P3 · Storage · both** — active tab keeps 1px transparent border → +2 h. `assets/main.css` active-tab rule. Shared: no.
- **LOW-D08 · P2 (content) · Storage + FAQ** — tabs 2–3 contain the pacemaker warning copied from tab 1; 5/6 FAQ answers empty. Merchant copy needed (or hide_when_empty / hide_empty_tabs).
- **LOW-D09 · P3 · UNVERIFIED · Reviews screenshots · 390** — broken-image icons for cards 4–6 after scrolling to end in the touch run (low-reviews-end-390.png); full-page runs loaded screenshot-4.jpg fine → probably lazy-load timing. Re-check `low-img.mjs` when preview is back.

## Correct
How To Use (all ≤1px); Storage geometry/type/card/markers; FAQ desktop grid/rows/chevron/open colour/heading; Reviews cards/shadows/crops/arrows/mobile pill/track/progress; container x72–1408 @1480, x20–370 @390; no overflow.

## Not tested
Reels interaction/type (no content); LOW-D09; 750–989 widths for these sections; hover; reduced motion; screen reader.
