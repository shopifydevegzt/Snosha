# findings-MID — Comparison · Video · Before & After · Judge.me reviews (saved by coordinator from agent hand-back)
Layout complete at 1480/390. ALL interaction tests NOT TESTED (preview down). Script ready: mid-interact.mjs.

## Scorecard
| Section | Desktop | Mobile | Functional | Overall | Notes |
|---|---|---|---|---|---|
| 06 Comparison | PARTIAL | PARTIAL | n/a | PARTIAL | grid/type/panel/strip match; brush image −11% & offset; logo small; mobile glow weaker; panel shadow bleeds into video section |
| 05 Video | PASS | PASS | NOT TESTED | PARTIAL | frame/radius/poster/overlay/play identical |
| 09 Before & After | PASS | PASS | NOT TESTED | PARTIAL | all ≤1px; merchant images (content); desktop upscaled |
| 08 Reviews (Judge.me) | FAIL | FAIL | NOT TESTED | FAIL | +13 desktop / −30 mobile; card #F9F9F9, text #000; mobile track LTR |

## Key measurements
- Comparison 1480: height 975/976, container 52/1376, H2 600 32/52 #FFF, subtitle 400 18/32, glass panel 1120×612 (fill/border/r24/shadow/blur identical), rows 64 + 7×78 PASS; strip 376×667 vs 664 (+3); logo visible 132×27 vs 177×36 FAIL; brush bbox x1208–1319 y391–813 vs x1239–1343 y373–848 FAIL. 390: 788/788, all geometry PASS; glow alpha .45 vs .65; shadow spill ~30px into video.
- Video: 911/911, frame 400×711 r24 at 540,140; mobile 300×533 r16; play 88/56 — PASS.
- Before & After: 844/844 & 558.19/558.19; heading y60 600 32/52 #12568D; desc 860×64 400 18/32 #5A5A59; gaps 24/24; slider 1336×560 r24 / 350×254.19; handle 34×58 / 29×48; chips قبل right, بعد left — PASS. Images merchant last_before.webp / last_after.png 780×975 (CONTENT; 1.71× upscale at 1480).
- Reviews 1480: 736 vs 723; card 496 vs 483; fill #F9F9F9 vs #FFF; quote #000 vs #131311, min-height 130 (4 lines) vs 3 lines; stars 24/2 vs 22/4; arrows y+7. 390: 570 vs 600; cards y160 h352 vs y168 h367; first card x20–180 vs x210–370 (LTR track); progress y526 vs 556.

## Defects
- **MID-D01 · P2 · Comparison · 1480** — brush image −11%, −31 x, bottom −35. Cause: exported PNG aspect 0.572 vs Figma crop 0.505 + settings image_width 400 / overhang 172 / top −88 (template). Fix: re-export or retune (~445). Shared: no.
- **MID-D02 · P3 · Comparison · 1480** — logo 132×27 vs 177×36; logo_width 140 copies instance box; source raster 139×34. Fix: logo_width ≈187 or SVG (template/asset).
- **MID-D03 · P3 · Comparison · 390** — glow alpha .45 vs .65; gradient 2 vs 3 stops. Needs mobile glow setting.
- **MID-D04 · P3 · Comparison→Video · 390** — panel shadow 0 24 60 bleeds ~30px into video section. Fix: `overflow: clip` on `.snosha-comparison` (or stacking). Shared: no.
- **MID-D05 · P2 · Reviews · 1480** — +13: `.jdgm-text` min-height calc(--line-clamp(4)*28+18)=130 vs Figma 3 lines (+28); card missing pb 18 (−18); star glyph +1; borders +2. File assets/dev1.css ~L4590–4630 `.snosha-jdgm .jdgm-cards-carousel .jdgm-media-card`. Fix: reserve 3 lines (or app "short"), `padding-block-end:18px`. Shared: no (scoped .snosha-jdgm).
- **MID-D06 · P2 · Reviews · 390** — −30: carousel 8px block padding missing (−15), card pb 18 missing, +3 border/star. Fix: card pb 18 + track 8px block padding.
- **MID-D07 · P2 · Reviews · 390** — mobile track LTR (`.jdgm-content{direction:ltr}` dev1.css ~L4555; app only translates LTR). Progress fills from right → disagree. App limit; mirror/start-at-end or document.
- **MID-D08 · P3 · Reviews** — card #F9F9F9 / text #000 from Judge.me app block settings (merchant) vs #FFF / #131311.
- **MID-D09 · P3 · Reviews · 1480** — summary stars 24/2 vs 22/4 (settings).
- **MID-D10 · P3 · Before & After · 1480** — portrait 780×975 shown cover at 1336×560 (1.71× upscale). Merchant: landscape ≥2672×1120.

## Correct
Comparison container/heading/panel/strip/rows/columns 342/376/402, mobile geometry; Video everything; Before & After everything (layout); Reviews heading/summary order, 4.5 half star, desktop card width/gap/x/border/radius/shadow/photo, mobile progress style; 1376 container in all 4 at 1480; 20px gutter (Figma) at 390.

## Not tested
Video play; B/A drag/keyboard/touch; Judge.me arrows/swipe/progress; Figma screenshots 190:10376 & 190:11101 (rate limit; values from metadata/design context); star colour in cards; DPR2; LTR.
