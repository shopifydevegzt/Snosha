# findings-HERO — Announcement · Header · Product Hero · Complementary · Sticky (saved by coordinator)
Layout measured at 1480/390 (from full-*.png run, before the user's 11:53 gallery CSS edit). All functional + sticky tests NOT TESTED (preview down). Scripts ready: hero-func.mjs <w>, hero-sticky.mjs <w,…> full.

## Scorecard
| Section | Desktop | Mobile | Functional | Overall | Notes |
|---|---|---|---|---|---|
| 01 Announcement | FAIL | FAIL | NOT TESTED | FAIL | padding 15 (Figma 10) + 1px divider = 55 vs 44 |
| 02 Header | FAIL vs product Figma (PASS vs homepage Figma) | PASS (64) | NOT TESTED | PARTIAL | Figma pages disagree (1 row vs 2 rows); logo 153 vs 184 (asset) |
| Product Hero | PARTIAL | PARTIAL | NOT TESTED | PARTIAL | geometry/type/colours exact; padding offsets; rest content |
| Complementary | PASS | PARTIAL | NOT TESTED | PARTIAL | 1 product configured (Figma 2); mobile title wraps |
| Sticky ATC | NO FIGMA REFERENCE | NO FIGMA REFERENCE | NOT TESTED | NOT TESTED | preview down (verified in previous task at 9 widths) |

## Hero height gap explained
Desktop −296 = +24 (details padding-top) −86 (2nd complementary card missing) −128 (open "الوصف" shorter: F1 1-sentence description) −70 (warranty row hidden, empty) −36 (bottom padding 24 vs 60).
Mobile −305 = +20 −… +19 (complementary title wraps) −86 −184 −70 −4. CSS share: only paddings.

## Key measurements
Announcement 55 vs 44 (text Cairo 500 14/24 white, icon 24, gap 10 PASS). Header 131 = 88 + 43 nav row vs 88 single row; icons mirrored vs product Figma; logo 153×37 vs 184×37.18. Breadcrumbs y40 14/24 PASS; mobile y10 11/24 PASS. Gallery stage 712×660 r28 PASS; image left −19.7 vs −25.4 (asset differs); thumbs 104 step 116 PASS. Columns 712·64·560 PASS. Buy Box rating y112 vs 88 (+24); mobile +20. H1 700 38/64 color3, price 32/52, compare 14/22, badge 72×26, capsule 203×36, benefits, swatches, ATC 428×58 r12, quantity 120×50, trust pills 272×48 — all PASS (y offset only). Stepper "−" right/"+" left vs Figma "+" right/"−" left (mirrored). Complementary card 560×76 PASS; count 1 vs 2 (content); mobile card 95 vs 76 (title wraps, price "EGP 2,499.00" 93px). Accordion rows 60 gap 10 style PASS; 5 rows vs 6; open row 101 vs 229 (content). Bottom 24 vs 60.

## Defects
- **HERO-D01 · P2 · Announcement · both** — padding-block 15 vs 10 in `sections/header-group.json` `header_announcements_9jGBFp` (was 10 at 9764cae; reverted by merge c5a7390). Fix: 10/10 (→45 with the accepted 1px divider). Shared: global header group (all pages; Figma homepage also 44).
- **HERO-D02 · P2 · Header · 1480** — 2-row header (homepage Figma 190:3769/3776) vs 1-row product Figma 190:10189. DESIGN DECISION; shared all pages. Do not change.
- **HERO-D03 · P2 · Buy Box · both** — `product-details` padding-block-start 24 (mobile 20) pushes Buy Box +24/+20. `templates/product.json` block setting. Fix: 0. Shared: no.
- **HERO-D04 · P3 · Hero · 1480** — bottom space 24 vs 60 (product-details padding-block-end). Fix: 60 desktop / 24 mobile. Template setting (+ CSS if responsive split needed).
- **HERO-D05 · P3 · Quantity · both** — − / + mirrored vs Figma. Fix: `order` on .quantity-minus/.quantity-plus within `.product-information.snosha-buy-box` (main.css ~L3296). Shared: scope only; check sticky stepper consistency.
- **HERO-D06 · P3 · Complementary · 390** — title wraps (price format width). Design decision / money format.
- **HERO-D07 · P3 · Gallery · 1480** — image x +5.7 (different asset). Accept.
- **HERO-D08 · P3 content** — 1 complementary product; empty warranty; short F1 description; breadcrumb middle "Best Seller"; "أضف إلي" locale typo vs "أضف إلى"; variant "ازرق" vs "أزرق". Merchant.

## Correct
Columns, mobile stacking order, stage/thumbs, all Buy Box typography & colours both widths, trust pills, accordion row styling, mobile header 64, announcement text.
