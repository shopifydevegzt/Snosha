# Snosha — Project Plan

> Mandatory project-state file for `.claude/skills/horizon-figma-to-sections-workflow/SKILL.md`.
> This file records **state** (what exists, what's done, what's next). The rules live in the skill; the global design-foundation details live in `FIGMA_THEME_SETTINGS_REPORT.md`.
> Created 2026-11-08.

---

## A. Project overview

| Item | Value | Verified |
|---|---|---|
| Project | Snosha | — |
| Theme | Shopify **Horizon v4.4.0** (`config/settings_schema.json` → `theme_info`: `theme_name: Horizon`, `theme_version: 4.4.0`) | ✅ 2026-11-08 |
| Store (Shopify CLI) | `internal-zt-yzyuhhfk.myshopify.com` | ✅ (`shopify theme info`, earlier in this session) |
| Development theme | `Development (8ed237-DESKTOP-FP21D0B)` `#168066810072`, role `development`. The live theme "Horizon" `#168065859800` must not be touched. | ✅ |
| Figma file | `1fqyznLFgS65tTjGvBYPBm` (Snosha), page `0:1` | ✅ |
| Desktop frame | `190:3767` "Homepage — Desktop", 1480 × 8696 | ✅ |
| Mobile frame | `190:4082` "Homepage — Mobile", 390 × 9155 | ✅ |
| Target page / template | Homepage → `templates/index.json`; header and footer live in `sections/header-group.json` and `sections/footer-group.json` | ✅ |
| Language / direction | Design is Arabic, RTL-first. **The storefront itself is not RTL yet**: `<html lang="en" dir="ltr">`, `/ar` returns 404. `locales/ar.json` exists in the theme, but Arabic isn't published as a store language. Direction comes from `request.locale.direction` in `layout/theme.liquid`. | ✅ (see F) |
| Workflow skill | `.claude/skills/horizon-figma-to-sections-workflow/SKILL.md` | ✅ |
| Repo guidance | `CLAUDE.md`, `FIGMA_THEME_SETTINGS_REPORT.md` | ✅ |
| Git | Branch `main`, one commit (`448df6e First Commit`). The working tree holds the uncommitted design-foundation work (§B). | ✅ read-only |

**Development restrictions (standing):**
- No `shopify theme push`, publish, Git commit or Git push without explicit request.
- One section per task; stop after it.
- No locale edits.
- No Figma edits.
- Figma temporary asset URLs never go into code.
- Merchant adds final images through the Theme Editor.
- No Theme Check, new dev server or broad validation unless the task permits it.
- `config/settings_data.json` changes only with explicit user instruction (skill §25).

---

## B. Global design foundation

Source of truth: `FIGMA_THEME_SETTINGS_REPORT.md` (§ numbers below refer to it).

| Area | Implementation | Status |
|---|---|---|
| Cairo font | `snippets/custom-font.liquid`. Cairo WOFF2 files (Arabic and Latin subsets, weights 200–900) from Admin → Content → Files via `file_url`; overrides `--font-{body,heading,subheading,accent}--family`. Rendered after `theme-styles-variables`. | ✅ Validated on the preview: Latin and Arabic both render in Cairo (§8.3, §9.5) |
| Font weights | Weights come from the font-picker variants: body 400, subheading 500, heading 700, accent `inter_n6` = 600 (used by H2–H4, buttons, badges) | ✅ Validated (§2, §9.4) |
| Color palette | `color_palette`: `foreground #131311`, `color1 #5A5A59`, `color2 #DCF2FB`, `color3 #176BB0`, `color4 #60C1E1`, `color5 #F0FAFE`, `color6 #12568D`; 25 global settings mapped (§2) | ✅ Validated (§8.3) |
| Typography: desktop | Paragraph 16; H1 40/64, H2 32/52, H3 24/40, H4 20/34 (line heights via `custom-design-tokens`) | ✅ Validated (§9.4) |
| Typography: mobile (< 750px) | H1 28/44, H2 24/38 | ✅ Validated (§9.4) |
| Typography gaps | Mobile H4 still 20 (Figma 18/30). Body line height 1.6 (Figma 1.75 desktop, 15/26 mobile). Display Hero 56/84 is section-level. | ⏳ Pending (§9.6) |
| Page width | 4th `page_width` option **`custom_1376`** (active): content capped at 86rem (1376px) and centered; image-`sizes` branches added in 3 snippets | ✅ DOM-measured at 390–1920 on 5 templates (§10.6). ⏳ Theme Editor dropdown not checked in the admin (§10.7) |
| Page gutters | `--page-margin` = 24px at ≤ 390px → 52px at ≥ 1480px (linear) | ✅ Validated, LTR and injected RTL (§10.6) |
| Buttons | Primary `#176BB0`, white, radius 12, weight 600; hover `#12568D` (token override; disabled keeps native). Secondary white / `#176BB0` / 1px `#60C1E1`, radius 12. | ✅ Validated (§9.4). ⚠️ Secondary border 1px vs Figma 1.5px; padding 16×32 vs 13×28 |
| Badges | Radius 8, sale badge `#F0FAFE` / `#176BB0`, weight 600 | ✅ By CSS (injected sample). ⏳ Not seen on real products |
| Inputs | Radius 12, border `#DCF2FB`, white background | ✅ Validated |
| Product card | Native block settings in 6 templates: radius 20, 1px `#EFEDED` border, title/price padding 12 | ✅ Placeholder cards only. ⏳ Real products |
| Design-token file | `snippets/custom-design-tokens.liquid`, rendered after `color-palette` in `layout/theme.liquid` and `layout/password.liquid`. Variable overrides only, no `!important`. | ✅ |

**Verified native breakpoint map** (evidence: counts of media queries in `assets/`, `sections/`, `blocks/`, `snippets/`):

| Breakpoint | Evidence | Use |
|---|---|---|
| **750px** (`min-width: 750px` / `max-width: 749px`) | 214 / 119 occurrences; `base.css` page gutters, the `.section--mobile-full-width` grid, most sections | Primary mobile ↔ desktop switch |
| **990px** (`min-width: 990px` / `max-width: 989px`) | 14 / 4 occurrences; `base.css`, `footer.liquid`, `_header-menu.liquid`, `email-signup.liquid`, `filters.liquid`, `collection-wrapper-styles.liquid`, `theme-drawer.liquid`, `scroll-container.js` | Secondary large-desktop switch (header menu, footer, filters) |
| Container queries | `@container resource-list` at 450 / 750 / 1200px; `@container resource-list-carousel` at 750px | Product and collection grids / carousels adapt to their container |
| Others | One-off values (`1200px` ×8 max-width, 1400, 1600, 900/901, 389) inside individual components | Component-local, not layout breakpoints |

QA target widths (not breakpoints): 320, 375, **390** (Figma mobile), 749/750, 989/990, 1024, 1376, **1480** (Figma desktop), 1920.

**Reusable Horizon architecture available:**
- Sections: `hero`, `slideshow`, `layered-slideshow`, `media-with-content`, `product-list`, `collection-list`, `collection-links`, `carousel`, `featured-blog-posts`, `featured-product`, `product-hotspots`, `marquee`, generic `section`, `custom-liquid`.
- Theme blocks: `group`, `text`, `button`, `icon`, `image`, `video`, `accordion` / `_accordion-row`, `comparison-slider`, `product-card`, `price`, `review`, `product-description`, `email-signup`, `menu`, `logo`, `social-links`, `spacer`, `divider`.
- `product-list` and `collection-list` both offer a `carousel` layout.

---

## C. Homepage section inventory

Section order matches between the desktop and mobile frames. Node IDs are top-level children of each frame, from `get_metadata` with frame sizes reconfirmed on 2026-11-08. "Current storefront" means what `templates/index.json` and the groups contain now.

| Order | Section | Desktop node | Mobile node | Native candidate (initial; confirm per section) | Complexity | Major dependencies | Status |
|---|---|---|---|---|---|---|---|
| 1 | Announcement bar | `190:3768` | `190:4083` | `header-announcements` + `_announcement` (exists in `header-group.json`) | Low | Header group | `NOT_STARTED` |
| 2 | Header + navigation | `190:3769` (header row) + `190:3776` (navigation row) | `190:4084` (menu icon, no nav row) | `header` + `_header-logo`, `_header-menu`, header actions (exists in `header-group.json`) | Medium | Logo asset, navigation menu in Admin, RTL icon order | `NOT_STARTED` |
| 3 | **Hero + Trust Strip** | `190:3789` (Hero `190:3790`, Trust Strip `190:4081`) | `335:3959` (Hero `335:3960`, Trust `382:4564` / `335:4229`) | **Implemented as new `sections/snosha-hero.liquid`** (native `hero` can't anchor chips to a positioned image or overlap a trust card) + `snippets/snosha-icon.liquid`; instance `snosha_hero` in `index.json`; old `hero_jVaWmY` set `disabled: true` (data kept). **Trust strip fix (2026-11-08):** desktop card 1236×102 at x 122, mobile 346×100 at x 24. **Hero refactor (2026-11-08):**
- static CSS moved to `assets/main.css` (scoped under `.snosha-hero`, loaded after the tokens in `layout/theme.liquid`);
- `assets/main.js` created but not loaded (no JS needed);
- heading is now `<h1>`; on the homepage only, the header's hidden `<h1>` shop name became a `<p>`;
- live-preview measurements at 1480 and 390 match the Figma geometry.

Styles: `assets/main.css` | High | Hero product image (merchant upload pending); real Arabic/RTL storefront | `IMPLEMENTED` |
| 4 | Collections carousel | `190:3830` | `190:4133` | **Implemented (branch `dev1`) as `sections/snosha-collections.liquid`**: thin wrapper over Horizon's native collection list (same `resource-list` → `resource-list-carousel` → `slideshow` path, static `_collection-card` blocks, native arrows/RTL/swipe). Styles in `assets/dev1.css` (`.snosha-collections`). Instance `snosha_collections` in `index.json` between `snosha_hero` and `product_list_fa6P9H` | Medium | **No collections assigned** (placeholders shown; the merchant picks collections in the Theme Editor); collection images; mobile progress = shared CSS scroll-timeline bar (see #5 / log), with the shared `assets/snosha-carousel-progress.js` as a fallback only for browsers without scroll-driven animations | `IMPLEMENTED` |
| 5 | Featured collection (best sellers) | `190:3844` | `190:4149` | **Implemented (branch `dev1`) on the existing native `product-list` instance `product_list_fa6P9H`** (layout `carousel`, static `_product-card` with `_product-card-gallery`, `product-title`, `custom-liquid` description, `review`, `price`, `custom-liquid` product link; native quick add). Opt-in section setting "Snosha featured collection style" adds the `.snosha-featured-collection` scope; styles in `assets/dev1.css`; mobile progress = the CSS scroll-timeline bar shared with #4 (`assets/snosha-carousel-progress.js` is only a fallback for browsers without scroll-driven animations) | Medium–High | Only 1 product in the store (no compare-at price, no review metafields), so discount badge and stars were checked with sample DOM only; quick-add label comes from the locale ("إضافة", Figma "أضف إلى السلة") | `IMPLEMENTED` |
| 6 | F1 banner | `190:3851` | `190:4167` | **Implemented (branch `main`) as `sections/snosha-f1-banner.liquid`**: isolated section (same pattern as #3), section settings for copy/CTA/images/colors, repeatable `spec` blocks. Styles in `assets/main.css` (`.snosha-f1-banner`). Decorative assets from Figma in `assets/snosha-f1-*`. Instance `snosha_f1_banner` in `index.json` after `product_list_fa6P9H` | High | **Not checked in a browser** (no preview serves `main`; user chose to skip); product image (merchant upload pending); CTA product not selected | `IMPLEMENTED` |
| 7 | Featured collection · 2 (bundles title) | `190:3896` | `190:4204` | Second `product-list` instance; same card configuration as #5 | Low (after #5) | #5 card configuration; products | `NOT_STARTED` |
| 8 | Before / After | `190:3903` | `190:4222` | **Implemented (branch `dev1`) as `sections/snosha-before-after.liquid`**: thin container for native blocks: `comparison-slider` (drag, touch, keyboard and intro animation stay native), `group` / `text` / `button`, and the new project block `blocks/snosha-icon.liquid` for the Figma benefit icons. Instance `snosha_before_after` in `index.json`, after `product_list_fa6P9H` (#6 and #7 not built yet; they go before it). Styles in `assets/dev1.css` (`.snosha-before-after`, `.snosha-icon-block`) | Medium | Before/after photos (merchant); **browser validation not done** (user chose static checks only); the RTL fix to the native slider is still to be tested by hand; the slider starts at a fixed 50 % (Figma 48.3 % desktop, 49.6 % mobile); CTA link set to `/collections/all` until the N2 product exists | `IMPLEMENTED` |
| 9 | Reels | `190:3935` | `190:4254` | `carousel` section with `video` blocks, or `product-list` carousel. Reel cards may link products | Medium–High | Video files/URLs (merchant); autoplay/performance policy. *Open: card content and links not inspected.* | `NOT_STARTED` |
| 10 | Choose Your Care | `190:3943` | `190:4265` | **Implemented (branch `main`) as `sections/snosha-choose-care.liquid`** with private theme blocks `blocks/_snosha-care-card.liquid` (product picker, "Featured card" toggle, title/description/badge/button overrides, optional image) and nested `blocks/_snosha-care-spec.liquid` (text + icon). ≥ 990px: static row (cards shrink in proportion below ~1445px); < 990px: native CSS scroll-snap carousel that opens on the featured card; `<snosha-care-carousel>` in `assets/main.js` adds mouse dragging, the centering fallback and the progress fallback. Mobile cards are the desktop cards zoomed like Figma (user decision). Styles in `assets/main.css` (`.snosha-choose-care`). Instance `snosha_choose_care` in `index.json` | High | No products selected (placeholder images, no prices, CTA disabled until a product is picked); mobile text is Figma's scaled 7.9–9.2px; touch QA on real iOS/Android devices pending | `IMPLEMENTED` |
| 11 | Bundle | `190:3987` | `190:4318` | `product-hotspots` (mobile hotspots) + bundle list. Selectable items and a bundle total likely need an app or custom logic | High | **Bundle pricing logic / app (unknown)**; products. *Open: commerce behavior undecided; may become `BLOCKED`.* | `NOT_STARTED` |
| 12 | Blog | `190:4018` | `190:4349` | `featured-blog-posts` + `_featured-blog-posts-card` (carousel on mobile) | Medium | Blog posts must exist | `NOT_STARTED` |
| 13 | Why SNOSHA | `190:4024` | `190:4361` | `section` + `group` / `icon` / `text` (4 columns desktop, 2×2 mobile) | Low–Medium | Icons | `NOT_STARTED` |
| 14 | FAQ | `217:14604` | `217:14813` | `section` + `accordion` / `_accordion-row` (2 columns desktop, 1 column mobile) | Low–Medium | — | `NOT_STARTED` |
| 15 | Footer | `190:4048` | `190:14491` | `footer` + `email-signup`, `menu`, `logo`, `text`; `footer-utilities` (copyright, policies) (exists in `footer-group.json`) | Medium | Menus in Admin; mobile column order differs from desktop | `NOT_STARTED` |

**Totals:** 15 homepage sections, all `NOT_STARTED`. Every section's boundaries are clear in both frames, so none needed `NEEDS_VERIFICATION`. Open questions about native fit (#9, #10, #11) are noted in their rows.
- Sections 1, 2 and 15 live in section groups shared by every page.
- Sections 3–14 belong in `templates/index.json`, which currently holds only the Horizon placeholder `hero` and `product-list`.

Shared Figma components that recur across sections (exact node IDs come at section time):
- Section Heading
- Button
- Badge
- Product Card
- Spec Chip
- Progress bar (mobile carousels)
- Link with arrow

---

## D. Implementation strategy

Native-first, one section per task:

1. Read this plan and the section's entry.
2. Inspect the exact desktop and mobile section nodes the user supplies (`get_design_context`, `get_variable_defs`, `get_screenshot` for confirmation only).
3. Inspect the closest native Horizon architecture: the section, the theme blocks, the active instance in the template or group, and every consumer of shared blocks.
4. Produce the pre-implementation inspection report (skill §4).
5. Implement with the smallest safe change, following the skill's rules:
   - `custom_class` setting
   - merchant-editable colors
   - scoped CSS
   - verified breakpoints only
   - no hardcoded brand colors
   - no Figma asset URLs
6. Run only the limited read-only validation the task permits.
7. Report what needs manual visual and functional QA.
8. Update **this section's entry** in C and append to G.
9. Stop. Don't start the next section.

Project conventions:
- Prefix for new project-specific components: `snosha-` / `snosha_`. Neither is in use yet.
- Global tokens (§B) are consumed through Horizon variables and palette settings, never re-declared per section.

---

## E. Section status tracking

| Status | Meaning |
|---|---|
| `NOT_STARTED` | Not inspected in detail |
| `SPEC_READY` | Pre-implementation report done and approved; ready to build |
| `IN_PROGRESS` | Being implemented |
| `IMPLEMENTED` | Code done, read-only checks done; manual QA pending |
| `BLOCKED` | Can't proceed (data, app or decision missing); reason recorded |
| `FIX_REQUESTED` | User reported a defect after implementation |
| `VERIFIED` | **Only** after actual visual and functional verification has been confirmed |

The design foundation (§B) isn't a homepage section. Its validated items are tracked in the report, not with these statuses.

---

## F. Dependencies and risks

| # | Dependency / risk | Impact | Affects |
|---|---|---|---|
| 1 | **No products in the store** (`/collections/all`: "No products found.") | Product cards, badges, prices, reviews and product pages can't be validated | 3, 5, 7, 9, 10, 11 |
| 2 | **Arabic not published as a store language** (`/ar` returns 404; storefront `dir="ltr"`) | Real RTL rendering is unverified; RTL so far tested only by injecting `dir="rtl"` in a headless browser | All |
| 3 | Images and video added manually by the merchant later | Sections must work with empty pickers (blank states) and placeholders | 3, 4, 6, 8, 9, 11, 12 |
| 4 | Theme Editor UI not verified (needs an admin session) | `page_width` "Custom — 1376px" dropdown and block editing behavior unconfirmed | All |
| 5 | Third-party integrations not identified | Reviews/stars (#5, #10), bundle pricing (#11) and reels/social video (#9) may need apps; none are installed or identified | 5, 9, 10, 11 |
| 6 | Shared blocks and groups | Changing `_product-card` / `product-card` affects 6 templates. Header and footer groups affect every page. Section Heading and Button patterns repeat across sections. | 1, 2, 5, 7, 10, 15 |
| 7 | Collections, menus and blog posts must exist in Admin | Collections carousel, navigation, footer menus and blog can only show placeholders | 2, 4, 12, 15 |
| 8 | Password page doesn't load Cairo (`custom-font` not rendered in `layout/password.liquid`) | Password page typography differs | Outside the homepage |
| 9 | Typography gaps (mobile H4, body line height, Display Hero 56) | Small visual differences until handled at section level or added to tokens | 3, 6, others |

---

## G. Implementation log (append-only)

| Date | Entry |
|---|---|
| 2026-11-08 | Cairo integration fixed: `custom-font` moved after `theme-styles-variables`; Latin `unicode-range` corrected; header-actions font family uses variables (report pre-§1 history / CLAUDE.md). |
| 2026-11-08 | Global theme settings mapped from Figma: 25 settings in `settings_data.json` (report §1–§7). Validated on the dev preview (§8). |
| 2026-11-08 | `snippets/custom-design-tokens.liquid` added: heading line heights, mobile H1/H2, primary hover, page gutters. Product card native settings in 6 templates (report §9). |
| 2026-11-08 | `page_width` option `custom_1376` added and activated; gutter re-tuned to 24 → 52px; image-`sizes` branches; password layout loads tokens (report §10). |
| 2026-11-08 | `CLAUDE.md` created. |
| 2026-11-08 | **Project plan created.** Homepage inventory: 15 sections from Figma `190:3767` / `190:4082`. No section implemented. |
| 2026-11-08 | **#3 Hero + Trust Strip → `IMPLEMENTED`.** Figma nodes `190:3790`, `335:3960`, `190:4081`, `382:4564`. New files `sections/snosha-hero.liquid` and `snippets/snosha-icon.liquid` (Figma icons converted to `currentColor`). `templates/index.json`: `snosha_hero` added first in `order` (4 `spec_chip` + 4 `trust_item` blocks with the exact Figma copy); `hero_jVaWmY` `disabled: true`; `product_list_fa6P9H` untouched. Decisions: one section instead of hero + separate trust section (the trust card overlaps the hero by 58/49px); breakpoints < 750 / < 990 stacked / ≥ 990 split; media stage uses physical positioning on purpose. Checks run: schema/template consistency, tag balance, scope/URL/`!important` scans, `git diff --check`, server render on the preview (no Liquid errors). Not run: Theme Check, browser visual QA. |
| 2026-11-08 | **#3 bugfix: trust strip width.**
- **Root cause:** on desktop `.snosha-hero__trust` is a `.section` grid item with `margin-inline: auto`; auto margins make a grid item shrink to its content, so the card rendered 837.78px wide instead of 1236 (cells 191 instead of 290.25, subtitle wrapping, card 123px tall instead of 102).
- **Fix** (`sections/snosha-hero.liquid` only):
  - `inline-size: 100%` + `max-inline-size: 1242px` (card + 3px frame);
  - the 1.5px stroke drawn as an inset `box-shadow`, matching Figma's inside stroke;
  - 1px dividers placed in a 1px column gap;
  - glint at 68.12%;
  - mobile: `margin-inline-start: -4px` (Figma 24/20 gutters), card padding `10 10 4`, 3px title/subtitle gap.
- **Measured** in a headless-Edge harness built from the real theme files:
  - 1480: card 122/1236×102, cells 290.25 at 36/327.25/618.5/909.75, overlap 55 = Figma.
  - 390: frame 24/346×100, card 342×96, cells 79×82 = Figma.
  - No overflow at 320–1480.
  - Card-area pixel diff vs Figma (strong): 18.85% → 0.53% desktop, 4.54% → 0.51% mobile; the remainder is anti-aliasing.
  - Images in `docs/figma-validation/hero-trust/`.
- **Not done:** live-preview confirmation; the dev server returned 401 (CLI session needs re-auth). |
| 2026-11-08 | **#3 hero refactor + Figma correction** (Figma `190:3790`, `382:4563` = Hero Container inside `335:3960`).

**Architecture**
- New `assets/main.css` (project CSS, native nesting, one top-level `.snosha-hero` scope) is linked once in `layout/theme.liquid`, after `custom-design-tokens` and before Shopify's compiled section bundle.
- The section's `{% stylesheet %}` was removed; the compiled bundle now has 0 `snosha-hero` rules (no duplicates).
- The `{% style %}` color bridge stays in the section.
- `assets/main.js` was created with no logic and is not loaded (no JS needed).

**Semantics**
- The hero heading is now `<h1>`.
- `sections/header.liquid`: the hidden `<h1>{{ shop.name }}</h1>`, rendered only when `request.page_type == 'index'`, became `<p class="visually-hidden">`, so the homepage has exactly one `<h1>`. Other pages are unaffected.

**Root causes of the visual drift**
- The content column was vertically centered (Figma: top-aligned), so all text sat 4px too low.
- The chip border added 2px (Figma strokes are inside), making chips 36 tall instead of 34.
- Integer-percent chip positions were up to about 3px off.
- The CTA was hug-width at 129.6 (Figma: 122).
- The subtitle was 499 wide (Figma: 500).
- The heading used `clamp()`.
- The stage width was a rounded percentage.

**Fixes**
- Top-aligned content.
- Chip label padding 6/19/6/13 + 1px border.
- `spec_chip` `desktop_x/y`, `mobile_x/y` changed from `range` to `number` (same IDs; desktop = left edge %, mobile = center %, exact Figma decimals in the preset and the template).
- CTA `min-inline-size: 122px`, padding 24.
- Subtitle `calc(100% + 1px)`.
- Fixed pixel type: 28/44 (< 750), 56/84 (≥ 750).
- Stage `calc(749/1336*100%)` with a fixed 500px height.
- Visible sparkle offset 3px on desktop, as in Figma.

**Measured on the live preview**
- At 1480 everything equals Figma: content 821/587×492, pill y 34, H1 869/84 499×168, subtitle 868/268 500×64, CTA 1246/348 122×48, chips (428,122) (−29,156) (−18,316) (428,257), 34 tall; trust card 122/1236×102, overlap 55.
- At 390: stage 24/342×330, content y 348, H1 394 342×88, subtitle 494, CTA 554 342×48, chips within 0.3px; trust card 342×96.
- Text-area strong pixel diff vs Figma: 4.30% → 0.63% desktop; 1.60% mobile (Figma's leading space after the manual line break, and anti-aliasing).
- No overflow from 320 to 1920 in RTL or LTR.

The template was re-saved once because Shopify validated it before the new schema had uploaded. |
| 2026-11-08 | **#3 responsive follow-up** (status stays `IMPLEMENTED`).

**(1) 990–1240px heading**
- Cause: the fixed 56px heading in a 295–399px split column (Figma: 499) gave 4 lines at 990/1024 (band 692px) and 3 lines at 1100/1240 (576px).
- Fix: the content column is a size container; in the split layout the heading is `min(56px, calc(100cqi * 56 / 499))` with line-height 1.5.
- Result: 2 lines and a 500px band at every width from 990 up; exactly 56/84 at 1480 and above. No new breakpoint.

**(2) Clipped chip at 320px**
- Cause: "5 أوضاع تنظيف" (center 13.89% of a 272px stage) started at x −4.39.
- Fix: the stage is a size container below 990; the mobile chip's −50% centering shift is clamped so the chip stays inside the viewport.
- Result: x ≈ 0 at 320. The clamp is inactive at 375/390, so the Figma positions are unchanged.

**(3) Chip storage precision (found during validation)**
- Shopify keeps `number` settings to one decimal (`57.1429` became `57.1`), which moved desktop chips by 0.33px.
- Chip settings now hold **Figma reference pixels** (desktop 749×500: left/top; mobile 342×330: center/top). Same IDs and type; preset and template updated; CSS converts them with `calc(v / 749 * 100%)` etc.
- Result: 1480 chips exactly (428,122) (−29,156) (−18,316) (428,257); 390 tops exact, centers exact, left edges within 0.3px (Chrome renders chip text slightly narrower).

**(4) Mobile heading line 2**
- Figma's text has a stray space after the manual line break (" الفم والأسنان"), 6.1px in Cairo Bold 28, so Figma's visible glyphs sit 3.05px off-center.
- The browser centers both lines at x=195. A leading space can't survive a soft wrap in HTML, and an invisible character would be a hack, so this is documented and not changed.

**Docs**
- `CLAUDE.md`: `main.css` / `main.js` architecture and the number-precision rule.
- Skill §9: a central project stylesheet takes precedence over per-section `{% stylesheet %}` (generic wording).

**Validation (live preview, RTL + LTR)**
- 320/375/390/749/750/989/990/1024/1100/1240/1480/1920: no overflow, no clipped chips.
- Trust card 1236×102 at 1480, 342×96 at 390.
- 1480 / 390 reference geometry unchanged.
- Screenshots in `docs/figma-validation/hero/responsive/`. |
| 2026-11-08 | **#4 Collections carousel → `IMPLEMENTED`** (branch/worktree `dev1`; Figma `190:3830` / `190:4133`).

**Architecture**
- New `sections/snosha-collections.liquid`: a thin wrapper reproducing the native `collection-list` render path. The wrapper exists so the shared native section needs no new settings (`custom_class`, colors).
- Settings: `collection_list` (merchant picks and orders collections), desktop arrows show/hide, 7 color settings (palette defaults where the color exists), `custom_class`.
- Heading: native `text` block, H2 preset ("مجموعات SNOSHA", `<h2>`).
- Cards: static `_collection-card` (image below, centered, 18px gap) → `_collection-card-image` (square, radius 12) + `collection-title` (H3 preset, centered, 4px inline padding).
- Preset colors use hex (Shopify rejects palette references inside section presets); the template keeps palette references.

**Styles** (`assets/dev1.css`, new, linked once after `main.css` in `layout/theme.liquid`)
- Figma gutters (72 desktop / 20 mobile, derived from `--util-page-margin-offset`), card widths 292/97, gaps 24/10, card heights 368/152 (the mobile title clips to one line as in Figma), mobile title 11/40.
- Arrows: 44px white circles, 1px border, shadow, Figma chevron via CSS mask, at 50px from the edges; a disabled arrow stays visible at 40 % opacity.
- Mobile progress: track + fill as pseudo-elements; the fill is a CSS scroll-driven animation (40 % → 100 %, RTL-aware). **No JavaScript.**
- Selectors repeat the native parent chain because Horizon's compiled section CSS loads after `dev1.css`.

**Preview**
- The existing `theme dev` (port 9292) serves the `main` worktree. With user approval, the live theme was duplicated as unpublished **"Snosha dev1 preview" #168071135448** (not GitHub-connected), and `theme dev` runs from `dev1` on port **9293**.

**Measured on 9293 (RTL)**
- 1480: section 611, heading 52,50 1376×52, cards x 1116/800/484/168/−148 (292×368), images 292², titles y 452, arrows x 50/1386 y 304 (44×44). All equal to Figma.
- 390: section 294, heading y 35 h 38, cards x 273/166/59/−48/−155 (97×152), titles y 216, progress at y 281 inset 20, fill 140 → 244 → 350 px while scrolling. All equal to Figma.
- Arrows: next/previous scroll and disable at the ends.
- No overflow at 320–1480 in RTL or LTR; LTR mirrors correctly.
- Images in `docs/figma-validation/collections/`.

**Pending**
- Assign real collections and images.
- Manual Theme Editor QA.
- Another session works on #5 in the same worktree (`product-list`, `snosha-carousel-progress.js`, also `dev1.css`); its mobile progress uses a JS thumb, while #4 uses a CSS fill, so align them if both bars should behave the same. |
| 2026-11-08 | **#5 Featured collection → `IMPLEMENTED`** (branch `dev1`; Figma `190:3844` desktop, `190:4149` mobile).

**Architecture (native first)**
- Reused `product_list_fa6P9H` (no new section): layout `carousel`, `columns_gap` 24, `icons_style` none (Figma has no arrows), `gap` 40, padding 60 / 91, `max_products` kept at 8.
- Header: existing `_product-list-text` → `<h2>الأكثر مبيعًا</h2>` (H2 preset, color6); new subtitle text block (Paragraph preset, color1); `_product-list-button` "عرض الكل" (Link style) → the selected collection's URL.
- Card: gallery `square`; title H5 preset; `custom-liquid` short description (`product.description`, stripped, 2-line clamp; nothing if empty); `review` (outline stars, no count, label "التقييمات"); `price` with discount badge; `custom-liquid` "عرض المنتج" link (`tabindex=-1`; the title link is the keyboard path).

**Additive, off-by-default extensions** (product lists on cart and 404 templates checked unchanged)
- `sections/product-list.liquid`: `custom_class`, `snosha_style` (adds the scope + progress element), mobile padding, 10 color settings bridged by a scoped `{% style %}`.
- `_product-list-button`: `always_show` (the native link hides when the collection has ≤ max products).
- `_product-card-gallery`: `custom_badge_text` + optional `custom_badge_tag` (blank text = no badge; blank tag = every product in this list, not store-wide).
- `price` block + `snippets/price.liquid`: `show_discount_badge` + `discount_badge_label` (`[percent]` computed from variant price / compare-at in cents; only when on sale).
- `review`: optional `label`, rendered only when a rating exists.
- `assets/snosha-carousel-progress.js` (custom element, loaded only by this section): thumb size = visible / scroll width, offset = |scrollLeft| / max; RTL safe; Horizon still owns drag, snap and keyboard.
- Icons: `assets/snosha-arrow-left.svg`, `snosha-cart.svg`, `snosha-cart-16.svg` (Figma geometry) used as CSS masks in `currentColor`.

**Measured on a dev1 preview** (`theme dev` on 9294 → dev theme #168066810072, stopped afterwards; the storefront now renders `lang="ar" dir="rtl"`)
- 1480: section 840.98 (Figma 841.1; the padding setting is an integer, 91 vs 91.1); heading 72/60 1336×52; subtitle y 118 ×32; View All 78/118.09 (= Figma); cards 316 at 1092/752/412/72 (RTL mirror of Figma), y 190; image 316×316, top radius 16; badge +13/+16.23; text stack title 520, description 553, rating 607, price 635.89, link 673.89; card 541.89 (Figma 541.9); hover add-to-cart 288×50 at 14px insets, radius 12; hover shadow 0 12 32 @10 %.
- 390: section 573 (= Figma); h2 y 59 ×38; subtitle 114 ×26; cards 165×283 at 201/24/−153/−330, y 165 (= Figma track); image 165×165; badge 7.83 / 8.93; FAB 32×32 at 7/7; text stack within 0.06px of Figma; progress 24/473 342×4; View All y 491.
- Rating row and discount badge were measured with **sample DOM injected in the browser** (no store data); everything else comes from the real render (1 real product, earlier placeholders).
- Sweep 320/375/390/749/750/989/990/1024/1376/1480/1920, RTL and LTR: no horizontal overflow; 316 / 165 cards stable; desktop carousel clipped at the container (no gutter peek), mobile peek as in Figma.
- Native quick add on the real product: cart 0 → 1 and the cart bubble updates (1480 and 390). The bar shows on hover and on keyboard focus.
- Progress follows real scroll in RTL (offset 0 → 0.5 → 1, thumb right → left); hidden when nothing scrolls.
- Theme Check: only the 9 baseline offenses. `git diff --check` clean. No `!important`, hex colors or physical left/right in the new CSS; 750px breakpoint only.
- Screenshots: `docs/figma-validation/featured-collection/`.

**Known differences / pending (user QA)**
- Quick-add label is the locale string "إضافة" (locales not edited); Figma says "أضف إلى السلة".
- Stars use Horizon's native star glyph sized to the Figma glyph, not the Figma star path.
- Mobile progress thumb width depends on product count (Figma's 4 products → 49 %; 8 → 27 %).
- 750–989: Horizon's spacing scale (0.7) applies to padding and gap.
- The mobile FAB shows even though the global "mobile quick add" setting is off (design requirement, scoped to this style).
- Needs real data: compare-at prices (discount badge), review metafields/app (stars), more products (scroll, progress), a multi-variant product (Choose → quick-add modal), a sold-out product.
- Theme Editor: new settings, block selection, color independence. |
| 2026-11-08 | **#4 + #5 carousel progress unified** (status of both stays `IMPLEMENTED`). User decision: keep Horizon's native carousels and avoid extra JavaScript unless strictly needed.

**Finding: is JavaScript needed?**
- Both Figma bars are a fill growing from the inline start (#4 starts at 40 %, #5 at 168/342 = 49.12 %). CSS scroll-driven animations bind that fill to the real scroll position of Horizon's own scroller, RTL included, in Chrome/Edge 115+, Samsung Internet and Safari 26+. No JS needed there.
- In browsers without scroll-driven animations (Safari < 26, Firefox) CSS alone would leave the bar frozen at its starting width, so a JS fallback is still needed for those browsers. It exits immediately when the CSS feature is supported.

**Changes**
- `assets/dev1.css`: new shared block "CAROUSEL PROGRESS" for `.snosha-collections` and `.snosha-featured-collection`. Track and fill are `::before` / `::after` of the native `slideshow-component`; a named `scroll-timeline` sits on the native scroller (direct-child chain) and its `timeline-scope` on the outer `.resource-list` wrapper. Each section only sets `--snosha-progress-inset / -space / -initial / -track / -start / -end`.
- #4 block: removed its private timeline, pseudo-element bar and keyframes. It no longer replaces Horizon's `timeline-scope` on `slideshow-component` (Horizon's per-slide timelines are intact again). Figma values unchanged (inset = gutter, 20px gap, 40 %).
- #5 block: removed the `<snosha-carousel-progress>` element rules. Its bar now uses the same "fill from the start" behavior as #4 and Figma (49.12 % → 100 %), instead of the earlier thumb whose width depended on product count.
- #5 fix found during review: the gutter and desktop `clip-path` rules also matched nested product-image slideshows inside the cards (the clip would have hidden multi-image product photos on desktop). Both now use the direct-child chain.
- `assets/snosha-carousel-progress.js`: rewritten as one shared fallback (about 30 lines). It does nothing when `animation-timeline: scroll()` is supported. Otherwise one delegated capture-phase scroll listener writes `--snosha-carousel-progress` (0–1, `|scrollLeft|` so RTL works) on the carousel's `slideshow-component`. No custom element, no per-instance state, no carousel logic; it survives Theme Editor re-renders.
- `sections/product-list.liquid`: progress element removed; `data-snosha-carousel-progress` on the section when the Snosha style is on; fallback script kept.
- `sections/snosha-collections.liquid` (#4, other session's file; edit limited to this): `data-snosha-carousel-progress` on the wrapper + the same script tag (modules load once).

**Validated on the dev1 preview (9293, theme #168071135448, RTL storefront)**
- 390, CSS path: #4 track 20/350, fill 40 → 69.8 → 100 % at scroll 0 / 50 / 100 %, bar 20px under the carousel; #5 track 24/342, fill 49.12 → 74.6 → 100 %, 25px under the cards. Fill grows from the right in RTL and from the left in LTR. The JS variable stays unset, so the JS is idle.
- 390, fallback simulated (feature test forced false, CSS animation disabled): identical widths, driven by the JS variable.
- Geometry unchanged: #4 section 294 / 611, cards 273/166/59 (97×152) and 1116/800/484 (292×368), as logged for #4; #5 section 573, cards 201/24/−153 (165×283), View All y 491; desktop cards 316 at 1092/752/412.
- Native behavior kept: `scroll-snap-type: x mandatory`; the desktop #4 arrow scrolls the native scroller (0 → −220) and disables at the end; no bar at ≥ 750.
- 320–1920: no horizontal overflow; card sizes stable.
- Theme Check: only the 9 baseline offenses; `git diff --check` clean.

**Remaining**
- When a carousel has nothing to scroll, the bar shows the Figma starting width (CSS can't detect "not scrollable" from the bar's element).
- The fallback path was tested by simulation in Edge, not in a real Safari < 26 or Firefox. |
| 2026-11-08 | **#8 Before / After → `IMPLEMENTED`** (branch `dev1`; Figma `190:3903` desktop, `190:4222` mobile; both nodes inspected with `get_design_context`).

**Native architecture**
- Evaluated:
  - `media-with-content`: its media slot only takes image/video, so the comparison slider can't go there.
  - Generic `section`: hosts any theme block, but would need a design-specific mode (scope, mobile-only padding, column geometry) on a section shared with the collection and contact templates.
  - Native `icon` block: no tooth / sparkle artwork; its heart and stopwatch differ from Figma.
- Chosen: new thin container `sections/snosha-before-after.liquid` (same pattern as #4) hosting native blocks only, plus the new project block `snosha-icon`.
- Block tree (26 blocks, all merchant-editable):
  - `comparison-slider`: 2 image pickers, labels "قبل" / "بعد", label background, radius 18.
  - `group` Content, containing:
    - `text` H2 "روتينك اليومي ممكن يغير شكل ابتسامتك." (H2 preset, color6);
    - `text` body (Paragraph preset, color1);
    - `group` Benefits: 4 × `group` row (`snosha-icon` tile + `group` with `text` title (H5 preset) and `text` description (Paragraph preset));
    - `button` "اكتشف SNOSHA N2" (secondary style; link editable, set to `/collections/all` for now).
- Benefits can be reordered, removed or duplicated in the Theme Editor. Exact Figma copy, punctuation included. Section preset includes the slider, heading, body and button.
- `snippets/snosha-icon.liquid`: added `tooth`, `sparkle_detail`, `timer`, `heart` (Figma geometry, `currentColor` strokes, `--snosha-icon-fill` at 20 %).
- `blocks/snosha-icon.liquid`: icon select, image-picker override, tile toggle, 5 color settings (palette defaults).
- Section settings: desktop and mobile top/bottom padding (60/60, 56/40), label text, grip and shadow colors, `custom_class`.

**CSS (`assets/dev1.css`, `.snosha-before-after`)**
- ≥ 990: grid `557fr / 774fr`, gap 27, 20px start inset, −2px end overhang. At 1480 this should give content 851–1408 and slider 50–824 × 535, vertically centered (+8.5). Computed from CSS, not measured.
- < 990: stacked (slider, then content), gap 20; slider 342 / 248.38, radius 24 (< 750) or 18 (≥ 750); content gap 14 below 750.
- 990 is Horizon's secondary breakpoint, used because the two Figma columns don't fit side by side at 750–989.
- Slider: images `object-fit: cover` in one shared viewport; divider 3px; handle 34 × 58 (mobile 29 × 48), radius 17, 3 grip lines; label chips 13/18 with 16px insets (mobile 45 × 21, radius 20, 12/18, "قبل" 3px from the edge as in Figma); Soft shadow from a section color setting; visible focus ring on the handle.
- **RTL fix (scoped CSS, no JS):** the native slider places the divider and clips the layers with physical left/right, but its range input runs right-to-left in RTL and its labels follow the inline direction. Fix: the input stays `direction: ltr` so the divider follows the pointer, and in RTL the two layers are mirrored so "before" sits on the right under its label, as in Figma. LTR is unchanged. Native drag, touch, keyboard and intro animation are untouched; no JS added.
- CTA: secondary-button tokens, scoped `--button-border-width: 1.5px`, padding 13 × 28, 16/26.

**Checks run**
- Schema JSON valid; no duplicate IDs; ranges ≤ 101 steps.
- Template tree: 26 blocks, all ordered, all types exist.
- Theme Check: only the 9 baseline offenses.
- `git diff --check` clean.
- New CSS: no hex/rgb, no `!important`, no physical left/right properties; breakpoints 750 / 990 only. No Figma URLs.

**Not run (user chose static checks only):** browser geometry at 1480/390/320/750/990/1024; drag, touch, keyboard and RTL behavior; screenshots. The dev1 preview on 9293 shows a stale upload-error page: a temp file from `sed -i` was briefly in `sections/` and was rejected. The file is gone, and the section and template uploaded afterwards. The page clears when that server restarts.

**Pending / known differences**
- Before/after photos (merchant): image framing can only be judged with real photos.
- Initial divider: Horizon fixes it at 50 % (no setting; the intro animation also ends at 50). Figma has 48.26 % from the right (desktop, 6.7px) and 49.56 % (mobile, 1.5px).
- Icons drawn at 24px centered in the tile (Figma: a 24px vector in a 22px frame, about 1px offset for the sparkle).
- Manual QA: geometry at 1480/390, drag, touch and keyboard in RTL and LTR, 750–989 stacked layout, Theme Editor block editing, CTA link to the N2 product. |
| 2026-11-08 | **Homepage container + H2 max-width audit** (no code changes; statuses unchanged). Measured on the dev1 preview (port 9292), RTL and LTR, at 390 / 1024 / 1480 / 1920.

**H2 `--max-width: var(--max-width--body-none)`: works as intended, not a bug**
- `snippets/text.liquid` writes `--max-width: var(--max-width--{type}-{max_width})`. `theme-styles-variables.liquid` defines only `-normal` / `-narrow` (and `display-tight`), so for "None" the variable is undefined by design.
- The undefined `var()` makes `--max-width` invalid; it computes to `""`.
- The only consumer is `.text-block > * { max-inline-size: min(100%, var(--max-width, 100%)) }`, which falls back to `100%`: no limit.
- Measured: every H2 / body text block set to "None" has `max-inline-size: 100%` and fills its parent exactly (collections H2 1376, best-sellers H2 1336, before/after H2 557). Product titles use "Normal" (`min(100%, 520px)`, no effect in 292px cards).
- `type` comes from the block's custom `font_size` setting, so preset headings resolve to `body-*`; this doesn't matter for "None".

**Global container** (`page_width = custom_1376` → `<body class="page-width-custom_1376">` → `--page-content-width: 86rem`, `--page-margin` 24 → 52px in `custom-design-tokens.liquid`; Horizon's `.section` 3-column grid)
- Every homepage section, plus the header and footer groups, uses `.section section--page-width`. Center column: 52/1376 at 1480, 272/1376 at 1920, 40.3/943.4 at 1024, 24/342 at 390. No double padding, no horizontal overflow, backgrounds full width (hero band, best-sellers background 0–viewport).

**Intentional Figma offsets inside the container (kept)**
- Hero: content 821–1408 (20px inset); trust card 119/1242 (3px frame + 20px inset); mobile trust 24/346 (Figma 4px overhang).
- Collections: heading 52/1376; cards from 1408 (20px inset); carousel full-bleed with peek and arrows; mobile card gutter 20.
- Best sellers: header 52/1376; cards 72–1408, clipped at the container on desktop.
- Before/after: content 851/557; slider 50/774. The layout box is 1378 wide because Figma's slider overhangs the 1376 container by 2px at the inline end; kept as in Figma.
- LTR mirrors all of the above. |

| 2026-11-08 | **#6 F1 banner → `IMPLEMENTED`** (branch `main`; Figma `190:3851` desktop 1480 × 520, `190:4167` mobile 390 × 714; both nodes read in full via Figma MCP).

**Architecture.** New isolated section `sections/snosha-f1-banner.liquid` (like #3). Native `media-with-content` / `hero` can't put the full-width front wave *between* the dotted arc and the product (Figma stacking), position the decorative stage, or lay out the spec badges without changing those shared sections.

**Files**
- New: `sections/snosha-f1-banner.liquid`; `assets/snosha-f1-arc.png` (1020², desktop), `assets/snosha-f1-arc-mobile.png` (640², different dash count), `assets/snosha-f1-wave-back.svg` (1480 × 170, also used on mobile: the mobile wave is the same path scaled to 390 × 44.8), `assets/snosha-f1-wave-front.svg` (1480 × 407). All unmodified Figma exports.
- `snippets/snosha-icon.liquid`: additive `tank` and `gauge` icons (Figma `Icon / tank`, `Icon / gauge`, converted to `currentColor`). `sliders`, `brush_head` and `sparkle` were already exact matches and are reused.
- `assets/main.css`: new `.snosha-f1-banner` block (native nesting, no `!important`, colors only from section variables).
- `templates/index.json`: targeted insertion of `snosha_f1_banner` (4 `spec` blocks with the Figma copy) and its id at the end of `order`. Other sections untouched.

**Implementation notes**
- Layout: < 990 Figma mobile structure (330px stage above the copy; mobile type < 750, desktop type 750–989); ≥ 990 Figma split, grid `584fr / 752fr` inside the 1376 container with 20px padding, 520px min height, content centered (copy y 46).
- Stage decor uses Figma reference pixels: desktop as % of a 752 × 520 stage (Figma x − 72), so it scales between 990 and 1480; mobile as fixed px offsets from the stage center. The desktop watermark has its own small size container so the 380px "F1" scales with the stage; the stage itself is deliberately not a container (that would create a stacking context and break the wave layering).
- Product image box = Figma image bounds (558² at stage 81 / −8 desktop, 400² mobile), not the 438 / 280 frame, because the Figma render includes its glow. No image is embedded; empty picker shows Horizon's placeholder in the Theme Editor only.
- Spec badges reproduce Figma's left-to-right, right-packed auto layout (`row-reverse` + `flex-end`), which gives 3 + 1 on desktop and 2 + 2 on mobile with one block order (tank, modes, pressure, heads). In LTR the whole row mirrors.
- Glow and bubbles are CSS shapes with the Figma geometry (ellipse + 75px blur; circles with 22 % fill or 1.5px 30 % ring) so their color follows the accent setting. Waves and arcs stay Figma assets (their gradient colors are fixed in the files).
- CTA: product picker → `product.url`; URL setting as fallback; neither → non-navigating link with `aria-disabled`.

**Checks run:** Theme Check (only the 9 baseline offenses), `index.json` and schema parse, unknown/duplicate setting ids, CSS brace balance, no `!important`.

**Not run (user chose to skip browser validation: no running preview serves `main`):** browser measurements against Figma at 1480 / 390, overflow at 320–1480, RTL/LTR rendering, Theme Editor behavior, rendered font, watermark baseline. Section stays `IMPLEMENTED` until these and user QA are done. |

| 2026-11-08 | **#10 Choose Your Care → `IMPLEMENTED`** (branch `main`; Figma `190:3943` desktop 1480 × 1072, `190:4265` mobile 390 × 695; both read in full, plus metadata of every card instance).

**Architecture.** Native `product-list` renders all products through one shared `_product-card` template: it can't give one card the featured layout or give each product its own spec rows without changing the shared card (6 templates). So: an isolated section whose cards are private theme blocks. Each `_snosha-care-card` picks a real product; nested `_snosha-care-spec` blocks give per-product rows that can be added, removed, reordered and hidden in the Theme Editor.

**Product data.** Price, compare-at price, discount % (computed, shown only when compare-at > price), sold-out label (`content.product_badge_sold_out`) and the button URL come from the selected product; prices use the shop's `money` format (Figma shows "EGP  2499"). No product → placeholder image, no price, non-navigating button with `aria-disabled`. Title falls back to the product title when the override is blank; the template keeps Figma's short names as overrides. Nothing from Figma's prices or the "20%" is hardcoded.

**Files**
- New: `sections/snosha-choose-care.liquid`, `blocks/_snosha-care-card.liquid`, `blocks/_snosha-care-spec.liquid`.
- `snippets/snosha-icon.liquid`: additive `timer`, `drop`, `sparkle_detail` (Figma icons → `currentColor`). Reused exact matches: tank, sliders, brush_head, gauge, sonic, battery, shield_check, package (the last two are Figma 20px components: drawn at 20px with the Figma 1.7px stroke).
- `assets/main.css`: new `.snosha-choose-care` block.
- `templates/index.json`: `snosha_choose_care` added at the end of `order` (Reels #9 / Bundle #11 not on this branch), 3 cards with the Figma copy and specs.

**Layout decisions**
- Card order tongue cleaner → N2 → F1 so RTL shows Figma's desktop arrangement (F1 left, N2 centre, tongue cleaner right).
- Desktop (section ≥ 1440px, container query): row 400 / 462 / 400 with 40px gaps, centred; side cards vertically centred (y 67). Side card: 24/24/13 padding, `space-between` like the Figma component (min-height 672, so longer content grows instead of clipping). Featured: 3px conic-gradient ring (Figma angular gradient, stretched to the card's 462 × 806 proportions, stops derived from the glow colors), radius 27/24, two shadows; image 300, title 32/52, price row with compare-at + discount badge, filled button.
- 750–1439px: three desktop cards don't fit, so the same cards scroll in the native carousel (40px block padding to keep most of the glow).
- < 750px (user decision: Figma-exact scale): cards use `zoom` 0.655 / 0.5671, giving 262 × 440.16 and 262 × ~457 (Figma 460.89; Figma's featured internals aren't uniformly scaled, e.g. its 5.15px button label — rendered at the consistent 9.07px). Carousel 469px tall, 12px gaps, 24px gutters, snap start / centre / end; Figma's frame shows the middle snap position (N2 centred, 52px peeks), the page loads at the start position (first card at the right).
- Progress: same model as #4/#5 (fill grows from the inline start, Figma 168/342 = 49.12 % at rest → 100 %) as a CSS scroll-driven animation of this section's scroller. The shared #4/#5 rules and JS fallback are bound to Horizon's slideshow markup (and owned by dev1), so they weren't reused or edited; browsers without scroll-driven animations (Firefox) show a static 49.12 % fill.

**Checks run:** Theme Check (only the 9 baseline offenses), template/schema parse, settings and icon values cross-checked against the schemas and snippet, CSS brace balance, no `!important`, `git diff --check`.

**Not run (no preview serves `main`):** browser measurements at 1480 / 390, overflow at 320–1480, swipe/snap/progress behavior, RTL/LTR rendering, `zoom` and conic border rendering, Theme Editor behavior. Section stays `IMPLEMENTED` until these and user QA are done. |

| 2026-11-09 | **#10 bugfix: mobile carousel, featured centering, desktop sizing** (status stays `IMPLEMENTED`). Validated on the `main` preview (9292, dev theme #168066810072; served `main.css` matched the worktree byte for byte) until it was restarted from another worktree (see below).

**1. "Carousel doesn't slide" — root cause.** The scroller itself worked for touch, trackpad and horizontal wheel (measured: touch swipes snapped 0 / −234 / −468 and the bar followed). But a native scroll container can't be dragged with a mouse, and its scrollbar is hidden, so with a mouse (desktop window at phone width, Theme Editor mobile preview) nothing moved: a mouse drag left `scrollLeft` at 0. Fix: `<snosha-care-carousel>` (the carousel wrapper, `assets/main.js`, loaded once from `snippets/scripts.liquid`) adds mouse dragging only (`pointerType === 'mouse'`): snapping paused while dragging, then a smooth scroll to the nearest card, and the click after a drag is swallowed so links aren't followed. Touch keeps native scrolling.

**2. Featured card centred on load.** CSS `scroll-initial-target: nearest` on the featured card (< 990px only, so it never targets the page scroller) — no JS, no jump, in Chromium. `<snosha-care-carousel>` centres the featured card once after layout in other browsers (verified by stripping the CSS rule: still −234). It follows whichever card has "Featured card" checked, never re-centres after user input (wheel/touch/key/drag cancel it), and re-runs on Theme Editor section reloads (new element). The featured card always snaps to centre. No featured card → native start position.

**3. Desktop height — diagnosis.** At 1480 the cards matched Figma (400 × 672, 352 × 240 images, x 69 / 1011). The tall look on a laptop is (a) Figma's own 806px featured card / 1072px section, which is taller than a 768–800px laptop viewport, and (b) a real responsive problem: between 750 and 1439 the row was a carousel of full-size cards, cutting the third card at the page edge (1366: F1 at x −25). Fix: from 990px the row is static in the page column; cards `flex: 0 1 <Figma width>` shrink in proportion; image frames use the Figma aspect ratios (352/240, 408/300) and the side-card minimum height keeps 400 : 672 (card container query), so cards get shorter as they narrow; type sizes unchanged. 750–989 keeps the desktop-size carousel (now draggable, centred on the featured card).

**4. Also fixed:** `snippets/snosha-icon.liquid` — the merge `cbb424c` left `sparkle_detail` and `timer` defined twice and one `sparkle_detail` without `</svg>` (Theme Check LiquidHTMLSyntaxError; Liquid renders every matching `when`, so cards got doubled / unclosed icons). Removed the broken `sparkle_detail` copy and the second `timer` (identical paths); one definition each, shared with Before/After. Theme Check back to the 9 baseline offenses.

**Files:** `assets/main.js` (new module), `snippets/scripts.liquid` (one module script tag), `sections/snosha-choose-care.liquid` (wrapper → `<snosha-care-carousel>`), `assets/main.css` (`.snosha-choose-care` only), `snippets/snosha-icon.liquid` (dedupe), `CLAUDE.md` (main.js is now loaded).

**Measured (headless Edge 157, RTL)**
- 1480: section 1010 (1072 once products add the featured price row), side cards 400 × 672 at x 69 / 1011, featured 462 wide at x 509, images 352 × 240 / 408 × 300 — unchanged from Figma.
- 1440 / 1366 / 1280 / 1024 / 990: all three cards visible, no overflow; side cards 399 / 376 / 350 / 273 / 263 wide, 670 / 632 / 589 / 564 / 557 tall; featured 461 / 435 / 405 / 317 / 306 wide.
- 750: carousel of 400 / 462 cards, opens on the featured card (−329 of 658).
- 390: section 695, carousel 469, cards 262 × 440.16, featured centred at x 64 with neighbours at 338 and −210 (= Figma), bar 342 × 4 at 254.98px (74.6 %) at the centred position. 375 / 320: featured centred, no overflow (320: subtitle wraps, section 771).
- 390 behaviour, RTL and LTR: touch swipes both ways and mouse drags both ways snap to the 3 positions; bar 168 → 255 → 342px; no page overflow or page scroll.

**Not verified:** behaviour runs at 320 / 375 / 750 (the preview at 9292 was restarted mid-run from another worktree — its `main.css` then matched dev1/dev2 — so it no longer showed this section; geometry at those widths was measured before that); real iOS Safari / Android touch; Firefox (no `scroll-initial-target`/scroll-driven animations: JS paths, not run); Theme Editor reload and block changes. |

---

## H. Next section

**Hero + Trust Strip** (#3) is `IMPLEMENTED`; manual QA pending (see below). Next target: not yet chosen by the user. In page order it would be **#4 Collections carousel**. Don't start it without the user's request and node URLs.

**#3 manual QA still required (user):**
- Desktop 1480 and mobile 390 compared with Figma once the product image is uploaded.
- 750–989 stacked tablet layout.
- Arabic RTL storefront (needs Arabic published) and the current LTR state.
- Theme Editor: add, reorder and remove chip and trust blocks; image pickers; color settings independence; chip position ranges; block selection.
- CTA focus and hover, plus keyboard navigation.
- Chips at 320–375px (the outer chip can be clipped by the band).
- ~~After restarting `shopify theme dev`: re-run the trust strip measurement on the live preview.~~ Done 2026-11-08: 1236×102 at x 122 desktop, 342×96 mobile.
- Theme Editor: the chip position fields are now number inputs (decimals and negatives allowed); check that editing them works.
- ~~990–1240px: the heading wraps to 4 lines.~~ Fixed 2026-11-08: 2 lines and a 500px band from 990 up. Visually check the scaled heading (33–45px between 990 and 1240).
- Chip position fields are now Figma reference pixels (desktop 749×500, mobile 342×330); check editing them in the Theme Editor.
- At 320px the eyebrow pill (275px in Figma) wraps to two lines inside the 272px column; at 990/1024 the free-shipping subtitle wraps (trust card 121px tall). Neither overflows; no Figma frame covers these widths.
