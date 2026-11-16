# findings-LD — Long Description (saved by coordinator from the LD agent hand-back)
Preview went down mid-audit: tablet widths 990/989/900/768/750 NOT TESTED (re-run `node ld-tablet.mjs 990 989 900 768 750`).

## Scorecard
| Panel | Desktop | Mobile | Overall | Notes |
|---|---|---|---|---|
| Intro | PASS | PASS | PASS | all 0px |
| Sonic | PASS | PARTIAL | PARTIAL | mobile icons 24 vs 20 (D3); heading_fit 21px 1 line OK |
| Box | PASS | PARTIAL | PARTIAL | mobile list 261 vs 273 (D4); desktop row 2 +2 (D9) |
| Cleaning Modes | FAIL | PASS | FAIL | image not clipped, spills into Box/Brush (D1); shadow 2× soft (D2) |
| Brush Heads | PARTIAL | PARTIAL | PARTIAL | icons 24 vs 22/20 (D3); aspect kept vs Figma squash (D7) |
| Battery | PASS | PASS | PASS | indicators match |
| Water | PARTIAL | PARTIAL | PARTIAL | frame 538×669 vs 540×672, border 1 vs 1.5 (D5); icons (D3); mobile crop 9.8 (D8) |

Section height: desktop 3680.2 vs 3683 (−2.8: Box +0.3, Modes −1.4, Brush +1.0, Water −2.7); mobile 3726 vs 3738 (−12, all Box).

## Key measurements
- LD-04/07 Intro: 32/52 #12568D, 18/32 #4C85B3 (3 lines); mobile 22/52, 12/24 (5 lines) — PASS.
- LD-08..16 Sonic: rows/tiles/image 412×405 r24, heading 2 lines, body 5 lines — PASS; mobile image 350×313.9 (Δ≤1) PASS; LD-18 mobile icon 20 vs 24 FAIL.
- LD-19..29 Box: frame 805×560.3 PASS; desktop rows 943/1013/1085/1155/1225 vs …1083/1153/1223 (+2, D9); mobile list 261 vs 273, row 2 +6.7, image y −6 (D4).
- LD-30..38 Modes: panel 513.6 vs 515; rotated bbox 3° ≤1px PASS; visible image spans ~1288…1934 vs clipped 1339…1854 (+51/+81) FAIL; drop-shadow σ44 vs Figma σ22 FAIL; floor visible vs clipped FAIL; mobile all PASS.
- LD-40..46 Brush: frame 639.4×445 (±1.4); image 791×445 aspect kept (Figma squashed 17%); icon 24 vs 22 (desktop) / 20 (mobile).
- LD-47..53 Battery: all ≤1.2 PASS.
- LD-54..60 Water: panel 565.3 vs 568; frame 538×669.3 vs 540×672, 1px vs 1.5px dashed; mobile fill y 0 vs +9.8.
- LD-61 overflow: none at 1480/1024/390.

## Defects
- **LD-D1 · P2 · Modes · ≥990** — image not clipped to panel (Figma frame 190:10580 clips): +51 above / +81 below, overlaps Box frame (12,768 px²), floor visible above Brush heading. Cause: spill 46/76 + floor_shadow, no block-axis clip. Files: main.css `.snosha-long-description__media-frame`, `__media-floor`; product.json modes media. Fix: scoped vertical clip for Modes on desktop (modifier/setting), not global (Box/Brush/Water rely on spill). Evidence: ld-zoom-modes-image-1480.png, ld-pair-modes/box/brush-1480.png.
- **LD-D2 · P3 · Modes · desktop** — drop-shadow blur = std-dev → 2× softer. `.snosha-long-description__media-frame--shadow` → `drop-shadow(-14px 24px 22px …)`.
- **LD-D3 · P2 mobile / P3 desktop · Sonic, Brush, Water** — icons 24 vs 20 (mobile) / 22 (Brush, Water desktop). main.css `.panel--large --snosha-ld-icon-mobile:24px`, `.panel--medium --snosha-ld-icon/-mobile:24px` → 20 / 22 / 20. Battery uses medium but has a more specific 27px ring rule — verify.
- **LD-D4 · P2 (low) · Box · 390** — flex list 261 vs Figma absolute 273 (row 2 64px tall in Figma). Optional fix or accept (plan 4C).
- **LD-D5 · P3 · Water · desktop** — settings width 61→61.2, offset 100→101; 1.5px border renders 1px at DPR1. (template)
- **LD-D6 · P3 · Modes/Brush** — width 55→55.2, spill_top 46→47; Brush 72.5→72.3. (template)
- **LD-D7 · P3 · Brush** — design decision (aspect kept vs Figma squash).
- **LD-D8 · P3 · Water · 390** — known; merchant image_y_mobile/zoom setting. (template)
- **LD-D9 · P3 · Box · desktop** — item 2 50 vs 48 (Figma text overflows its fixed row).

## Correct
All typography (Cairo sizes/weights/LH/colors/line counts), gradient, paddings, gaps, tiles, RTL, Battery indicators, Box mobile composite, Modes tilt/bbox and mobile image, mobile crops ≤1.4px, no overflow.

## Tablet
1024: no text overlap/clipping/overflow; height 3452; Sonic/Water headings 2 lines; Battery/Water frames touch across gap (980 px², frames only); Modes spills 49 above (D1). 990/989/900/768/750 NOT TESTED.
