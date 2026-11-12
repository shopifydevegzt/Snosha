# Snosha — Project Plan

> Mandatory project-state file for `.claude/skills/horizon-figma-to-sections-workflow/SKILL.md`.
> This file records **state** (what exists, what's done, what's next). The rules live in the skill; the global design-foundation details live in `FIGMA_THEME_SETTINGS_REPORT.md`.
> Created 2026-11-08.

---

## A. Project overview

| Item                   | Value                                                                                                                                                                                                                                                                                    | Verified                                           |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Project                | Snosha                                                                                                                                                                                                                                                                                   | —                                                  |
| Theme                  | Shopify **Horizon v4.4.0** (`config/settings_schema.json` → `theme_info`: `theme_name: Horizon`, `theme_version: 4.4.0`)                                                                                                                                                                 | ✅ 2026-11-08                                      |
| Store (Shopify CLI)    | `internal-zt-yzyuhhfk.myshopify.com`                                                                                                                                                                                                                                                     | ✅ (`shopify theme info`, earlier in this session) |
| Development theme      | `Development (8ed237-DESKTOP-FP21D0B)` `#168066810072`, role `development`. The live theme "Horizon" `#168065859800` must not be touched.                                                                                                                                                | ✅                                                 |
| Figma file             | `1fqyznLFgS65tTjGvBYPBm` (Snosha), page `0:1`                                                                                                                                                                                                                                            | ✅                                                 |
| Desktop frame          | `190:3767` "Homepage — Desktop", 1480 × 8696                                                                                                                                                                                                                                             | ✅                                                 |
| Mobile frame           | `190:4082` "Homepage — Mobile", 390 × 9155                                                                                                                                                                                                                                               | ✅                                                 |
| Target page / template | Homepage → `templates/index.json`; header and footer live in `sections/header-group.json` and `sections/footer-group.json`                                                                                                                                                               | ✅                                                 |
| Language / direction   | Design is Arabic, RTL-first. **The storefront itself is not RTL yet**: `<html lang="en" dir="ltr">`, `/ar` returns 404. `locales/ar.json` exists in the theme, but Arabic isn't published as a store language. Direction comes from `request.locale.direction` in `layout/theme.liquid`. | ✅ (see F)                                         |
| Workflow skill         | `.claude/skills/horizon-figma-to-sections-workflow/SKILL.md`                                                                                                                                                                                                                             | ✅                                                 |
| Repo guidance          | `CLAUDE.md`, `FIGMA_THEME_SETTINGS_REPORT.md`                                                                                                                                                                                                                                            | ✅                                                 |
| Git                    | Branch `main`, one commit (`448df6e First Commit`). The working tree holds the uncommitted design-foundation work (§B).                                                                                                                                                                  | ✅ read-only                                       |

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

| Area                         | Implementation                                                                                                                                                                                                                                  | Status                                                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Cairo font                   | `snippets/custom-font.liquid`. Cairo WOFF2 files (Arabic and Latin subsets, weights 200–900) from Admin → Content → Files via `file_url`; overrides `--font-{body,heading,subheading,accent}--family`. Rendered after `theme-styles-variables`. | ✅ Validated on the preview: Latin and Arabic both render in Cairo (§8.3, §9.5)                               |
| Font weights                 | Weights come from the font-picker variants: body 400, subheading 500, heading 700, accent `inter_n6` = 600 (used by H2–H4, buttons, badges)                                                                                                     | ✅ Validated (§2, §9.4)                                                                                       |
| Color palette                | `color_palette`: `foreground #131311`, `color1 #5A5A59`, `color2 #DCF2FB`, `color3 #176BB0`, `color4 #60C1E1`, `color5 #F0FAFE`, `color6 #12568D`; 25 global settings mapped (§2)                                                               | ✅ Validated (§8.3)                                                                                           |
| Typography: desktop          | Paragraph 16; H1 40/64, H2 32/52, H3 24/40, H4 20/34 (line heights via `custom-design-tokens`)                                                                                                                                                  | ✅ Validated (§9.4)                                                                                           |
| Typography: mobile (< 750px) | H1 28/44, H2 24/38                                                                                                                                                                                                                              | ✅ Validated (§9.4)                                                                                           |
| Typography gaps              | Mobile H4 still 20 (Figma 18/30). Body line height 1.6 (Figma 1.75 desktop, 15/26 mobile). Display Hero 56/84 is section-level.                                                                                                                 | ⏳ Pending (§9.6)                                                                                             |
| Page width                   | 4th `page_width` option **`custom_1376`** (active): content capped at 86rem (1376px) and centered; image-`sizes` branches added in 3 snippets                                                                                                   | ✅ DOM-measured at 390–1920 on 5 templates (§10.6). ⏳ Theme Editor dropdown not checked in the admin (§10.7) |
| Page gutters                 | `--page-margin` = 24px at ≤ 390px → 52px at ≥ 1480px (linear)                                                                                                                                                                                   | ✅ Validated, LTR and injected RTL (§10.6)                                                                    |
| Buttons                      | Primary `#176BB0`, white, radius 12, weight 600; hover `#12568D` (token override; disabled keeps native). Secondary white / `#176BB0` / 1px `#60C1E1`, radius 12.                                                                               | ✅ Validated (§9.4). ⚠️ Secondary border 1px vs Figma 1.5px; padding 16×32 vs 13×28                           |
| Badges                       | Radius 8, sale badge `#F0FAFE` / `#176BB0`, weight 600                                                                                                                                                                                          | ✅ By CSS (injected sample). ⏳ Not seen on real products                                                     |
| Inputs                       | Radius 12, border `#DCF2FB`, white background                                                                                                                                                                                                   | ✅ Validated                                                                                                  |
| Product card                 | Native block settings in 6 templates: radius 20, 1px `#EFEDED` border, title/price padding 12                                                                                                                                                   | ✅ Placeholder cards only. ⏳ Real products                                                                   |
| Design-token file            | `snippets/custom-design-tokens.liquid`, rendered after `color-palette` in `layout/theme.liquid` and `layout/password.liquid`. Variable overrides only, no `!important`.                                                                         | ✅                                                                                                            |

**Verified native breakpoint map** (evidence: counts of media queries in `assets/`, `sections/`, `blocks/`, `snippets/`):

| Breakpoint                                          | Evidence                                                                                                                                                                                          | Use                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **750px** (`min-width: 750px` / `max-width: 749px`) | 214 / 119 occurrences; `base.css` page gutters, the `.section--mobile-full-width` grid, most sections                                                                                             | Primary mobile ↔ desktop switch                                   |
| **990px** (`min-width: 990px` / `max-width: 989px`) | 14 / 4 occurrences; `base.css`, `footer.liquid`, `_header-menu.liquid`, `email-signup.liquid`, `filters.liquid`, `collection-wrapper-styles.liquid`, `theme-drawer.liquid`, `scroll-container.js` | Secondary large-desktop switch (header menu, footer, filters)     |
| Container queries                                   | `@container resource-list` at 450 / 750 / 1200px; `@container resource-list-carousel` at 750px                                                                                                    | Product and collection grids / carousels adapt to their container |
| Others                                              | One-off values (`1200px` ×8 max-width, 1400, 1600, 900/901, 389) inside individual components                                                                                                     | Component-local, not layout breakpoints                           |

QA target widths (not breakpoints): 320, 375, **390** (Figma mobile), 749/750, 989/990, 1024, 1376, **1480** (Figma desktop), 1920.

**Reusable Horizon architecture available:**

- Sections: `hero`, `slideshow`, `layered-slideshow`, `media-with-content`, `product-list`, `collection-list`, `collection-links`, `carousel`, `featured-blog-posts`, `featured-product`, `product-hotspots`, `marquee`, generic `section`, `custom-liquid`.
- Theme blocks: `group`, `text`, `button`, `icon`, `image`, `video`, `accordion` / `_accordion-row`, `comparison-slider`, `product-card`, `price`, `review`, `product-description`, `email-signup`, `menu`, `logo`, `social-links`, `spacer`, `divider`.
- `product-list` and `collection-list` both offer a `carousel` layout.

---

## C. Homepage section inventory

Section order matches between the desktop and mobile frames. Node IDs are top-level children of each frame, from `get_metadata` with frame sizes reconfirmed on 2026-11-08. "Current storefront" means what `templates/index.json` and the groups contain now.

| Order | Section                | Desktop node                                          | Mobile node                                                 | Native candidate (initial; confirm per section)                                                                                                                                                                                                                                                                                                                                              | Complexity | Major dependencies                                   | Status                                                                                       |
| ----- | ---------------------- | ----------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1     | Announcement bar       | `190:3768`                                            | `190:4083`                                                  | `header-announcements` + `_announcement` (exists in `header-group.json`)                                                                                                                                                                                                                                                                                                                     | Low        | Header group                                         | `NOT_STARTED`                                                                                |
| 2     | Header + navigation    | `190:3769` (header row) + `190:3776` (navigation row) | `190:4084` (menu icon, no nav row)                          | `header` + `_header-logo`, `_header-menu`, header actions (exists in `header-group.json`)                                                                                                                                                                                                                                                                                                    | Medium     | Logo asset, navigation menu in Admin, RTL icon order | `IMPLEMENTED` (native header + opt-in "Snosha layout"; CSS in `dev1.css`; manual QA pending) |
| 3     | **Hero + Trust Strip** | `190:3789` (Hero `190:3790`, Trust Strip `190:4081`)  | `335:3959` (Hero `335:3960`, Trust `382:4564` / `335:4229`) | **Implemented as new `sections/snosha-hero.liquid`** (native `hero` can't anchor chips to a positioned image or overlap a trust card) + `snippets/snosha-icon.liquid`; instance `snosha_hero` in `index.json`; old `hero_jVaWmY` set `disabled: true` (data kept). **Trust strip fix (2026-11-08):** desktop card 1236×102 at x 122, mobile 346×100 at x 24. **Hero refactor (2026-11-08):** |

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
| 9 | Reels | `190:3935` | `190:4254` | **Implemented (branch `main`) as `sections/snosha-reels.liquid`**: up to 12 "Reel" section blocks (Shopify video, optional cover image, product, optional accessibility label). Video = Horizon `<deferred-media>` (poster only until click; plays with sound and native controls). Native scroll-snap carousel; `<snosha-reels-carousel>` (shared `SnoshaSnapCarousel` base with Choose Your Care, `assets/main.js`) opens mobile on the middle reel `floor((n − 1) / 2)`, adds mouse drag and the progress fallback, and flags overflow for the progress bar. Styles `.snosha-reels` in `assets/main.css`; Figma play icon `assets/snosha-reels-play.svg`. Instance `snosha_reels` in `index.json` between #8 and #10 | Medium–High | No videos or products picked yet (section is hidden on the storefront until a reel has a video); browser QA pending | `IMPLEMENTED` |
| 10 | Choose Your Care | `190:3943` | `190:4265` | **Implemented (branch `main`) as `sections/snosha-choose-care.liquid`** with private theme blocks `blocks/_snosha-care-card.liquid` (product picker, "Featured card" toggle, title/description/badge/button overrides, optional image) and nested `blocks/_snosha-care-spec.liquid` (text + icon). ≥ 990px: static row (cards shrink in proportion below ~1445px); < 990px: native CSS scroll-snap carousel that opens on the featured card; `<snosha-care-carousel>` in `assets/main.js` adds mouse dragging, the centering fallback and the progress fallback. Mobile cards are the desktop cards zoomed like Figma (user decision). Styles in `assets/main.css` (`.snosha-choose-care`). Instance `snosha_choose_care` in `index.json` | High | No products selected (placeholder images, no prices, CTA disabled until a product is picked); mobile text is Figma's scaled 7.9–9.2px; touch QA on real iOS/Android devices pending | `IMPLEMENTED` |
| 11 | Bundle | `190:3987` | `190:4318` | **Implemented (branch `main`) as `sections/snosha-bundle.liquid`**. Section setting `bundle_product` (a normal product = the bundle: total, compare-at, discount %, availability, the only item added to cart) + optional `bundle_image_override`; up to 3 section blocks "Bundle product" (display-only component product + desktop/mobile hotspot X/Y %). Rows show each component's own price (never summed). Add to cart = Horizon `product-form-component` + `add-to-cart-button` snippet; `<snosha-bundle-hotspot>` (hover / tap popups) and `<snosha-bundle-form>` (busy state) in `assets/main.js`. Styles `.snosha-bundle` in `assets/main.css`. Instance `snosha_bundle` in `index.json` after #10 | High | No products in the store (section is hidden on the storefront until a bundle product is picked); popup design not in Figma; browser QA pending | `IMPLEMENTED` |
| 12 | Blog | `190:4018` | `190:4349` | **Implemented (branch `dev1`) on the native `featured-blog-posts` section** (instance `snosha_blog` in `index.json`, after `snosha_before_after`; blog `news`, layout `carousel`, 3 posts). Native blocks: rich-text title (H2 + subtitle), `_featured-blog-posts-card` with image, `_heading`, `_blog-post-info-text` (date only) and `_blog-post-description`. Opt-in "Snosha blog style" adds the `.snosha-blog` scope; styles in `assets/dev1.css`; mobile progress = the shared CSS progress bar (#4 / #5) | Medium | **Blog `news` has no articles** (placeholders only); **browser validation not done**. Bugfix 2026-11-09 (date before title in the DOM, inline-SVG arrows, explicit Figma color defaults, image height/crop settings, progress toggle, "Snosha blog" preset) is checked by static analysis only | `IMPLEMENTED` |
| 13 | Why SNOSHA | `190:4024` | `190:4361` | **Implemented (branch `dev1`) as `sections/snosha-why.liquid`**: thin container for native blocks (static `text` heading and subtitle) and 4 `_snosha-why-item` blocks (existing `snosha-icon` block, new "Large" size, with the Figma illustration + native `text` title and description). Instance `snosha_why` in `index.json`, after `snosha_blog`. 6 Figma SVGs stored as `assets/snosha-illustration-*.svg` / `snosha-sparkle-*.svg`. Styles in `assets/dev1.css` (`.snosha-why`, `.snosha-icon-block--large`) | Low–Medium | **Browser validation not done** (static checks only; no dev1 preview running) | `IMPLEMENTED` |
| 14 | FAQ | `217:14604` | `217:14813` | **Implemented (branch `dev1`) as `sections/snosha-faq.liquid`**: thin container for native blocks (static `text` heading and subtitle) and 2 native `accordion` blocks (one per desktop column) holding native `_accordion-row` rows with native `text` answers. All rows closed by default. Instance `snosha_faq` in `index.json`, after `snosha_why`. Figma chevron stored as `assets/snosha-chevron-down.svg`. Styles in `assets/dev1.css` (`.snosha-faq`). 5 of 6 answers blank (no approved copy found) | Low–Medium | **Browser validation not done** (static checks + local static harness only; no dev1 preview running) | `IMPLEMENTED` |
| 15 | Footer | `190:4048` | `190:14491` | **Implemented (branch `dev1`) in the native footer group** (`sections/footer-group.json`): native `footer` section with native blocks (group [logo + text], menu "التسوق", group [menus "المساعدة" + "عن SNOSHA"], group [text + text + email-signup]); native `footer-utilities` with the copyright (policies and social links disabled, not deleted). Opt-in "Snosha layout" setting (+ `custom_class`) added to `footer` / `footer-utilities`; additive settings on `logo` (link to home), `email-signup` (placeholder), `footer-copyright` (text after store name). Styles in `assets/dev1.css` (`.snosha-footer`, `.snosha-footer-utilities`) | Medium | **Browser validation not done** (static checks + local static harness only). Merchant: upload logo (Theme settings → Logo), create and select the 3 menus | `IMPLEMENTED` |

**Totals:** 15 homepage sections: 13 `IMPLEMENTED`, 2 `NOT_STARTED` (#1 Announcement bar and #7 Featured collection · 2). Implementation status does not mean browser QA is complete.

- Sections 1, 2 and 15 live in section groups shared by every page.
- Sections 3–14 belong in `templates/index.json`; implemented instances are recorded individually in the inventory above. The footer is configured separately in `sections/footer-group.json`.

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

| Status          | Meaning                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| `NOT_STARTED`   | Not inspected in detail                                                     |
| `SPEC_READY`    | Pre-implementation report done and approved; ready to build                 |
| `IN_PROGRESS`   | Being implemented                                                           |
| `IMPLEMENTED`   | Code done, read-only checks done; manual QA pending                         |
| `BLOCKED`       | Can't proceed (data, app or decision missing); reason recorded              |
| `FIX_REQUESTED` | User reported a defect after implementation                                 |
| `VERIFIED`      | **Only** after actual visual and functional verification has been confirmed |

The design foundation (§B) isn't a homepage section. Its validated items are tracked in the report, not with these statuses.

---

## F. Dependencies and risks

| #   | Dependency / risk                                                                         | Impact                                                                                                                                                                 | Affects               |
| --- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 1   | **No products in the store** (`/collections/all`: "No products found.")                   | Product cards, badges, prices, reviews and product pages can't be validated                                                                                            | 3, 5, 7, 9, 10, 11    |
| 2   | **Arabic not published as a store language** (`/ar` returns 404; storefront `dir="ltr"`)  | Real RTL rendering is unverified; RTL so far tested only by injecting `dir="rtl"` in a headless browser                                                                | All                   |
| 3   | Images and video added manually by the merchant later                                     | Sections must work with empty pickers (blank states) and placeholders                                                                                                  | 3, 4, 6, 8, 9, 11, 12 |
| 4   | Theme Editor UI not verified (needs an admin session)                                     | `page_width` "Custom — 1376px" dropdown and block editing behavior unconfirmed                                                                                         | All                   |
| 5   | Third-party integrations not identified                                                   | Reviews/stars (#5, #10), bundle pricing (#11) and reels/social video (#9) may need apps; none are installed or identified                                              | 5, 9, 10, 11          |
| 6   | Shared blocks and groups                                                                  | Changing `_product-card` / `product-card` affects 6 templates. Header and footer groups affect every page. Section Heading and Button patterns repeat across sections. | 1, 2, 5, 7, 10, 15    |
| 7   | Collections, menus and blog posts must exist in Admin                                     | Collections carousel, navigation, footer menus and blog can only show placeholders                                                                                     | 2, 4, 12, 15          |
| 8   | Password page doesn't load Cairo (`custom-font` not rendered in `layout/password.liquid`) | Password page typography differs                                                                                                                                       | Outside the homepage  |
| 9   | Typography gaps (mobile H4, body line height, Display Hero 56)                            | Small visual differences until handled at section level or added to tokens                                                                                             | 3, 6, others          |

---

## G. Implementation log (append-only)

| Date       | Entry                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-11-08 | Cairo integration fixed: `custom-font` moved after `theme-styles-variables`; Latin `unicode-range` corrected; header-actions font family uses variables (report pre-§1 history / CLAUDE.md).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 2026-11-08 | Global theme settings mapped from Figma: 25 settings in `settings_data.json` (report §1–§7). Validated on the dev preview (§8).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 2026-11-08 | `snippets/custom-design-tokens.liquid` added: heading line heights, mobile H1/H2, primary hover, page gutters. Product card native settings in 6 templates (report §9).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 2026-11-08 | `page_width` option `custom_1376` added and activated; gutter re-tuned to 24 → 52px; image-`sizes` branches; password layout loads tokens (report §10).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 2026-11-08 | `CLAUDE.md` created.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 2026-11-08 | **Project plan created.** Homepage inventory: 15 sections from Figma `190:3767` / `190:4082`. No section implemented.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 2026-11-08 | **#3 Hero + Trust Strip → `IMPLEMENTED`.** Figma nodes `190:3790`, `335:3960`, `190:4081`, `382:4564`. New files `sections/snosha-hero.liquid` and `snippets/snosha-icon.liquid` (Figma icons converted to `currentColor`). `templates/index.json`: `snosha_hero` added first in `order` (4 `spec_chip` + 4 `trust_item` blocks with the exact Figma copy); `hero_jVaWmY` `disabled: true`; `product_list_fa6P9H` untouched. Decisions: one section instead of hero + separate trust section (the trust card overlaps the hero by 58/49px); breakpoints < 750 / < 990 stacked / ≥ 990 split; media stage uses physical positioning on purpose. Checks run: schema/template consistency, tag balance, scope/URL/`!important` scans, `git diff --check`, server render on the preview (no Liquid errors). Not run: Theme Check, browser visual QA. |
| 2026-11-08 | **#3 bugfix: trust strip width.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

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
  | 2026-11-09 | **#12 Blog → `IMPLEMENTED`** (branch `dev1`; Figma `190:4018` desktop, `190:4349` mobile, both inspected with `get_design_context` through the design-plugin Figma server).

**Figma**

- Desktop: section 664 (60 / 544 / 60); container 1376 with 20px inner padding; header 90 (H2 32/52 + 6 + subtitle 18/32); View All absolute, 6px from the inline end and 5.91 above the header bottom (same as #5); gap 40; 3 cards of 429.333, gap 24, 414 tall.
- Card stack: image 268 (radius 16) → 16 → text (4px inline padding, gap 8): date 12/18 SemiBold blue, title 20/34 color6, excerpt 16/28 color1, read more 16/26 + 18px arrow.
- Mobile: section 734 (56 / 638 / 40); header 66 (24/38 + 6 + 13/22); gap 14; cards 280 wide, gap 12, 476 tall; first card at 86–366 (RTL); progress bar 38px below the cards (track 24/342, fill starting at 150/342 = 43.86 %); View All 14px below the bar, centered.

**Architecture (native first)**

- Reused Horizon's `featured-blog-posts` section and its static card blocks; no new section, block or carousel.
- Heading + subtitle: the native rich-text title block (`<h2>` + `<p>`, merchant-editable).
- Date: native `time_tag` (localized, `<time>`).
- Excerpt: native `excerpt`, falling back to stripped, truncated content.
- Additive, off-by-default extensions:
  - `sections/featured-blog-posts.liquid`: `view_all_label` (links to the selected blog's URL; blank = hidden); `custom_class`; `snosha_style` (adds `.snosha-blog`, the progress hook and the fallback script); mobile padding; heading, accent and progress colors (scoped `{% style %}` bridge). The title block is now always inside an unstyled `.section-resource-list__header` wrapper, because a static block ID may only be rendered once.
  - `_featured-blog-posts-card`: `read_more_label` (blank = hidden) renders an article link under the excerpt (`tabindex=-1`, `aria-hidden`; the card's full-size link stays the keyboard target).
- Progress bar: the shared CSS scroll-timeline bar (selector now includes `.snosha-blog`; values: inset = page margin, space 38, initial 0.4386). The shared JS fallback is reused unchanged through the `data-snosha-carousel-progress` marker. No new JS.

**CSS (`assets/dev1.css`, `.snosha-blog`)**

- Card width `calc((1336px - 48px) / 3)` on desktop (= 429.333) and 280 on mobile.
- Gutter = page margin + 20 (desktop) or page margin (mobile); desktop carousel clipped at the container, as in #5.
- Image 268px tall, cover crop; date moved above the title with `order: -1` (DOM order kept); title and excerpt clamped to 2 lines.
- Mobile: padding 56 / 40, View All positioned under the progress bar.

**Checks run**

- Schema JSON valid (section 26 settings, card 13); no duplicate IDs; template settings all known to the schema.
- Theme Check: only the 9 baseline offenses (it caught a duplicate static-block render, which was fixed).
- `git diff --check` clean.
- New CSS: no hex/rgb, no `!important`, no physical left/right properties; 750px breakpoint only.

**Not run (user chose static checks only):** browser geometry at 1480/390/320/375/750/990/1024, swipe and snapping, progress updates, RTL check. Port 9292 now serves the `main` worktree, and no dev1 preview is running.

**Data-dependent / pending**

- Blog `news` has no articles, so real titles, dates, excerpts, images, article links and the View All destination are unverified (placeholders only).
- The #4 and #5 progress bars are unaffected by the shared change: same rules, one more scope in the selector list. To be re-checked in a browser.
- Theme Editor: new settings and the title rich text. |
  | 2026-11-09 | **#12 Blog bugfix** (status stays `IMPLEMENTED`; Figma `190:4018` / `190:4349` re-checked through the design-plugin Figma server).

**Root causes found**

- Every reported symptom (no progress bar, title before date, black heading, unstyled "Read more", no arrow) is what renders when the `.snosha-blog` CSS doesn't apply.
- In dev1 the code itself is valid: `dev1.css` parses completely in the browser engine (all Blog rules present, braces balanced) and the homepage instance has `snosha_style: true`.
- Two ways it fails in practice:
  - (1) The design was gated behind "Snosha blog style" (default off) and no preset turned it on, so a Blog section added or reset in the Theme Editor is plain Horizon. Black heading = theme foreground, because neither the scope nor a block color applied.
  - (2) `assets/dev1.css` exists in both `main` and `dev1` with different content (`main` has no Blog block). Worktrees syncing to the same development theme overwrite each other's copy. **Coordination needed:** don't run `main` and `dev1` previews against the same theme, or merge `dev1.css` first.
- Design weaknesses that made it fragile: the date order relied on CSS `order: -1`; the arrows were CSS masks; card text colors depended on block colors set only in `index.json` (preset block settings can't use palette references).

**Fixes**

- `blocks/_featured-blog-posts-card.liquid`:
  - "Date position" (below / above the title) renders the date and title in that DOM order;
  - "Show excerpt";
  - "Show read more arrow" (inline SVG `snosha-icon` `arrow_left`, `currentColor`);
  - in Snosha style the image slot is kept (native placeholder) for articles without an image, so cards stay aligned.
- `sections/featured-blog-posts.liquid`:
  - `view_all_url` (blank = selected blog);
  - View All arrow as inline SVG;
  - colors: subtitle, article title / date / excerpt as Figma defaults that the native block color settings override;
  - image height desktop / mobile (268 / 268) and crop position;
  - "Show mobile progress bar" (off → `.snosha-blog--no-progress`, no progress hook or script);
  - new **"Snosha blog" preset** with the style on and the Figma copy and layout.
- `snippets/snosha-icon.liquid`: `arrow_left` (Figma path).
- `assets/dev1.css` (`.snosha-blog` only):
  - removed the CSS reorder and the two masks;
  - heading / subtitle colors from section variables;
  - inherited `--color` / `--color-details` defaults for title, date and excerpt;
  - image container height from settings, image `object-fit: cover` at the chosen position (the source keeps its ratio);
  - no-progress override.
- Shared progress rules and `snosha-carousel-progress.js` unchanged.
- `templates/index.json` (`snosha_blog` only): date above title, excerpt and arrow on, new settings at the Figma values.

**Checks run:** browser-engine CSS parse; schema JSON (section 35 settings, card 16; range steps and defaults valid); every new setting wired in Liquid and every bridge variable used in CSS; template keys match the schemas; Theme Check: only the 9 baseline offenses; `git diff --check` clean; no hex, `!important`, physical left/right or masks in the Blog CSS; #4 / #5 progress code untouched.

**Pending (browser / data, not run):** 1480 / 390 geometry and colors; image cropping at 320–1920; RTL swipe and progress bar; Theme Editor controls; real articles (blog `news` is empty: links, dates, excerpts, images). |
| 2026-11-09 | **#13 Why SNOSHA → `IMPLEMENTED`** (branch `dev1`; Figma `190:4024` desktop, `190:4361` mobile, inspected with `get_design_context` through the design-plugin Figma server).

**Figma**

- Desktop: section 426 (60 / 306 / 60), background color5; container 1376 with 20px inner padding (1336); heading 90 (H2 32/52 + 6 + subtitle 18/32, centered); heading → grid 26; 4 equal columns, gap 32 (310 each); items 168 or 190 tall.
- Mobile: section 606 (60 / 498 / 48); 24px gutter (342); heading 88 (24/38 + 6 + subtitle 13/22 aligned to the start, 2 lines); heading → grid 18; 2 × 2 grid, gaps 12 (165 columns).
- Item: tile 96 × 96, radius 26, 1px color2 border, white → color5 gradient, drop shadow 0 10 11 #0F64A8 @ 8 %, inset top highlight white @ 90 %; illustration 64; tile → text 14; title 18/30 SemiBold color6; description 13/22 color1; title → description 6.
- Order: Figma places the benefits in the same physical left-to-right order on both frames (روتين أبسط, تفاصيل تصنع الفرق, مصممة لاحتياجاتك, تقنية أذكى). A reading-order RTL grid can't reproduce both, so the grid flows LTR physically and each item restores RTL text.
- Sparkles `190:4030/4031` (`190:4367/4368`) sit 52px above the heading inside a frame with overflow clipped, so they're invisible in both frames (mobile copies the desktop x 777).

**Architecture**

- Evaluated: the generic `section` + `group` (needs a design mode on a shared section for the grid, mobile padding and scope); the native image block (`image_picker` can't ship bundled SVG defaults); native icon (no matching artwork).
- Chosen: `sections/snosha-why.liquid`, a thin container (same pattern as #4 / #8):
  - static native `text` blocks `heading` (H2) and `subtitle`;
  - `{% content_for 'blocks' %}` with new private block `blocks/_snosha-why-item.liquid`, made of static children: `snosha-icon` `illustration`, native `text` `title`, native `text` `description`.
- `blocks/snosha-icon.liquid` extended additively:
  - `size` (small default = 40 / 24, unchanged for Before / After; large = 96 / 64);
  - 4 illustration options rendered as `<img src="{{ … | asset_url }}">`;
  - the image picker overrides them.
- Section settings: background, heading / subtitle / benefit title / description colors (Figma defaults inherited through `--color`, overridden by colors set on the native text blocks), tile shadow color, "Show heading sparkles" (off), desktop and mobile padding, `custom_class`. Section preset ships all 4 benefits.

**Assets added (original Figma SVGs, unmodified, 64 × 64):** `snosha-illustration-simple-routine.svg`, `-details.svg`, `-your-needs.svg`, `-smart-tech.svg`; `snosha-sparkle-large.svg` (27.4), `snosha-sparkle-small.svg` (14.4). Mapping confirmed by rendering them locally.

**CSS (`assets/dev1.css`):** `.snosha-icon-block--large`; `.snosha-why`:

- background on the full-width wrapper; `.section` page-width grid for the container (no new width system);
- grid `repeat(4 | 2, minmax(0, 1fr))`, 750px breakpoint only;
- no `nth-child`, transforms or negative margins; physical `left` only for the decorative sparkles.

**Checks run:** browser-engine CSS parse; schemas (section 12 settings, item 0, icon 9); template keys match the schemas; each benefit's icon option is valid and its asset file exists; Theme Check: only the 9 baseline offenses; `git diff --check` clean; no hex, `!important` or global selectors in the new CSS.

**Pending (manual browser QA, not run):**

- 1480: background full width, container 52–1428, inner 72–1408, columns 310 at 72 / 414 / 756 / 1098, section 426.
- 390: 342 grid at 24, columns 165, section 606, subtitle aligned to the start.
- Tile border, gradient and shadow; 320 / 375 wrapping; RTL / LTR order; sparkle toggle; Theme Editor add, reorder and remove of benefits. |
  | 2026-11-09 | **#14 FAQ → `IMPLEMENTED`** (branch `dev1`; Figma `217:14604` desktop, `217:14813` mobile, inspected with `get_design_context` through the design-plugin Figma server).

**Figma**

- Desktop: padding 60 / 60, white background; container 1376 with 20px inner padding (1336); heading 90 (H2 32/52 color6 + 6 + subtitle 18/32 color1, centered); heading → columns 61; 2 independent columns, gap 24 (656 each), rows 12 apart. Left column: payment methods, cash on delivery, authenticity; right column: warranty, returns, free shipping.
- Mobile: padding 56 / 40, 20px side padding (350 at 390); heading 24/38 + 6 + 13/22, centered; heading → list 12; one list, gaps 12, order payment → shipping (left column first, then right column).
- Card: 1px color2 border, radius 14, white closed / color5 open; padding 14 block, 16 inline desktop / 20 mobile; question 16/27 SemiBold foreground; chevron 18 (Figma `Icon / chevron-down`, color3, 1.6 stroke on 24 grid) on the inline end; question → chevron 12; question → answer 10; answer 16/28 color1.
- Figma shows the warranty row open as an example; per the brief every row ships closed.

**Architecture**

- Native reuse: `accordion` + `_accordion-row` (native `<details>`/`<summary>`, `accordion-custom`, keyboard and editor support) with native `text` answers. No new JS, no core files edited.
- `sections/snosha-faq.liquid`, a thin container (same pattern as #13): static `text` `heading` / `subtitle`; `{% content_for 'blocks' %}` accepting `accordion`. Each accordion block is one desktop column; on mobile they stack, which reproduces the Figma mobile order from one set of blocks (no duplicated content). The column grid flows physically left to right (as in #13) so column 1 sits on the left as in Figma; each column restores RTL.
- Rows: `open_by_default: false`, `icon: none`; accordion `dividers: false`, `icon: caret`.
- Chevron: the native caret element, painted with the unmodified Figma SVG via `mask` (`assets/snosha-chevron-down.svg`), rotated 180° when open. Native caret path differs in proportion and stroke.
- Section settings: background, heading, subtitle, question, answer, chevron colors; card background closed / open and border; desktop and mobile padding; `custom_class`. Section preset ships the 6 questions.
- Mobile 20px side padding: scoped `--page-margin: 20px` on `.snosha-faq` below 750px (global token untouched).

**Content source:** no FAQ section or answers existed in dev1, the main checkout, dev2, locales or project docs (only the hero chips "ضمان لمدة سنة" / "شحن مجاني" and the announcement bar "شحن مجاني للطلبات من 2000 جنيه فأكثر", which are not FAQ answers). The only answer in Figma is the warranty one, which is used. The other 5 answers are left blank for the merchant.

**Checks run:** browser-engine CSS parse; schema settings all rendered; template keys match the schema; no row has `open_by_default: true`; Theme Check: only the 9 baseline offenses; `git diff --check` clean. Local static harness (native markup + `base.css` + native accordion CSS + `dev1.css`, fallback font, not a Shopify preview): all 6 closed on load; 1480 columns 656 at x 72 / 752, cards 57, section 466 collapsed; 390 cards 350 at x 20, section 576; warranty opened 95 tall, color5 background, chevron rotated, closes again; no horizontal overflow at 320 / 749 / 750 / 990 / 1920.

**Pending (manual browser QA, not run):** initial load closed; open / close; Cairo typography and colors; 1480 columns; 390 list; long questions and answers wrapping; Theme Editor question / answer editing, add / remove / reorder rows (including dragging a row between columns); RTL chevron side; keyboard focus. |
| 2026-11-09 | **#15 Footer → `IMPLEMENTED`** (branch `dev1`; Figma `190:4048` desktop, `190:14491` mobile, inspected with `get_design_context` through the design-plugin Figma server).

**Figma**

- Desktop: background color5; padding 60 / 60; container 1376 with 20px inner padding (1336). Footer Top: one row, gap 48, bottom padding 25; physical right → left brand 300 (logo 186 × 45, 16, description 14/24 color1), Shopping, Help, About (flex 1 each = 168; heading 16/27 SemiBold color6; links 14/24 color1; gap 12), newsletter 340 (heading 20/34 color6, description 14/24, gap 14; form: input 16/13 padding, 1px color2, radius 12; button color3 28/13 padding, radius 12, 16/26 SemiBold; gap 8; button on the left). Then 48, divider 1px color2 (1336), 48, copyright 12/20 at the right.
- Mobile: padding 48 / 24; 20px side padding (350); gap 20; order brand → newsletter (17/34, 12/24, input 12/24 with 20 padding) → Help (right) + About (left) as two equal columns, gap 20 → Shopping full width → copyright 11/20 centered. No divider.

**Architecture (native footer group, no new section, nothing added to `index.json`)**

- `footer_m9NzUG` (native `footer`): `brand_group` (group: native `logo` + native `text`), `menu_shopping` (native `menu`), `links_group` (group, row: `menu_help`, `menu_about`), `group_H6VpwJ` (existing newsletter group, reused: its 2 text blocks + the existing `email_signup_crihX7`, moved into the group). Existing IDs kept.
- Menus: native `link_list` pickers left blank (`menu: ""`) for the merchant; headings are the native "Heading" setting (Figma text), falling back to the selected menu's title when cleared. No links are hardcoded; an unselected menu shows only its heading.
- Logo: native `logo` block (theme logo, Theme settings → Logo; alt = store name; shop-name text while empty), pixel height 48 (the native setting only allows steps of 8; Figma is 45, so 3px taller); new opt-in "Link to home page".
- Newsletter: native `email-signup` = `{% form 'customer' %}`, `contact[email]`, hidden label, native success / error messages; style "button" (primary color3), label "اشترك", new optional "Placeholder" setting ("البريد الإلكتروني"; blank = theme translation).
- `footer_utilities_jLGE8U` (native `footer-utilities`): copyright (year + store name automatic, new "Text after store name" = "— جميع الحقوق محفوظة.", powered-by off). Policies and social links set `disabled` (not in the design; can be re-enabled).
- Opt-in "Snosha layout" on both footer sections adds the scope classes + scoped variables (heading / text colors, mobile padding); `custom_class` added to both. Off by default, so other stores / presets are unaffected.
- Layout CSS tells blocks apart by content (`:has(.logo-block)`, `:has(.email-signup-block)`, group with menus, standalone menu), not by position. Desktop one row via a container query (≥ 1360px container) because the five areas don't fit at 990–1359 (menus would get < 135px); 750–1359 uses two rows (brand + newsletter, then menus). Mobile `order`: brand, newsletter, grouped menus, standalone menu.
- Desktop vertical rhythm: footer padding 60 / 73 (25 + 48); utilities padding 48 / 60 with the native divider inset 20px (1336). Mobile: footer 48 / 20, utilities 0 / 24, divider hidden.

**Checks run:** browser-engine CSS parse; every footer-group setting key exists in its schema; every new setting is wired; Theme Check: only the 9 baseline offenses; `git diff --check` clean. Fix 2026-11-09: the first upload of `footer-group.json` was rejected by Shopify ("Setting 'pixel_height' must be a step in the range"; 45 is not a step of 8), so the dev theme kept the default Horizon footer; now 48, and every footer-group value has been checked against its schema range/step/options. Local static harness (native markup + `base.css` + native block CSS + `dev1.css`, fallback font, not a Shopify preview): 1480 brand 1108–1408 (300), menus 168 at 892 / 676 / 460, newsletter 72–412 (input 235 + 8 + button 97), logo 186 × 45, divider 72–1408; 390 order brand → newsletter → Help | About (165 each) → Shopping, 350 wide at x 20, copyright 11px centered, no divider; two rows at 750–1359, one row at 1376 / 1920; no horizontal overflow at 320 / 375 / 749 / 750 / 989 / 990 / 1024 / 1376 / 1920.

**Pending merchant setup:** upload the logo (Theme settings → Logo); create the 3 menus in Admin → Content → Menus and select them on the footer's 3 Menu blocks.

**Pending (manual browser QA, not run):** 1480 / 390 geometry with Cairo; logo upload and size; the 3 menu selections and destinations; real newsletter submit (success, invalid email, already subscribed); 320–1920 responsive; RTL / LTR; footer on other templates (product, collection, cart, pages). |
| 2026-11-09 | **#2 Header + navigation → `IMPLEMENTED`** (branch `dev1`; Figma `190:3769` header, `190:3776` navigation, `346:4607` Nav Item variants, `190:4084` mobile; inspected with `get_design_context` + `get_metadata`).

**Figma**

- Desktop header (1480): white, 88 tall (padding 33 around 22px icons); container 1376 with 20px inner padding. Icons on the physical right, left → right account (1298), search (1342), cart (1386–1408), 22px slots, gap 22. Logo 184 × 37.18 at x 666, y 29: 18px right of and 3.59px below the frame center (absolutely positioned in Figma).
- Navigation row: white, padding 5 / 14 (43 tall); menu 912 wide, centered (284–1196), gap 32; Cairo Medium 15/24; default color6 `#12568D`; active (first item, physical right) color3 `#176BB0` with 5px side padding and a marker rgba(99,205,255,.45), top 9, 14.54 tall, radius 3, rotated 1.5°, spanning the item.
- Mobile (390): white, 64 tall, bottom border 1px color2; 20px sides; right → left menu icon (348–370), logo 138 × 27.885 centered (126–264), search (60–82), cart (20–42), 18px apart; no account icon, no nav row.

**Architecture (native header group, nothing added to `index.json`; only one header)**

- `header_section` (native `header`) settings: logo center, menu center in the bottom row, search shown (top row, end column), bottom border 1 / color2 (Horizon applies it to the mobile header row), bottom-row background = top-row background (white). `header-menu` (native `_header-menu`): menu `main-menu` (native picker), font Subheading (Cairo 500). Logo: theme setting `settings.logo` (already uploaded: `SNOSHA.png`), heights from the theme settings `logo_height` 37 / `logo_height_mobile` 28, which only the header uses (the footer `logo` block has its own height).
- New opt-in "Snosha layout" group in `sections/header.liquid` (off by default): scope class `snosha-header` + modifier classes, a scoped `{% style %}` variable bridge, `custom_class`. Settings: icons on the start side (desktop) + icon spacing 22; logo shift x 18 / y 3.5 (the vertical range steps by 0.5); top-row padding 22 / 22 (88 with 44px buttons); mobile padding 9.5 / 9.5 (63 + 1px border = 64) and mobile cart–search spacing 18; hide account icon on mobile; nav padding 5 / 14, link spacing 32, font size 15, line height 24, link color color6, active / hover color color3, active marker on/off + color `#63CDFF73`; border below navigation (desktop) off.
- Search, account (`shopify-account`), cart (drawer trigger, `cart-bubble` with the real count), drawer menu, overflow "More" list, sticky header and the active state (`link.active` → `menu-list__link--active`, `aria-current` on `link.current`) are all native; no JS added, no core header snippet changed.
- `assets/dev1.css` (`#header-component.snosha-header`; the ID beats Horizon's header rules, which load later). Desktop (≥ 750, menu mode): grid areas `'right center left'` so the native end column (search + actions) sits at the start (physical right in RTL); `header-actions` becomes `display: contents` so its account / cart join search in Figma order cart, search, account; cart glyph on the content edge. Nav: 15/24, colors, `::part(list)` margin and title padding for the 32 gap; marker as `::before` on the active title. Mobile (≤ 749 and Horizon's drawer mode): padding, 44px drawer row, 22px menu icon in a 44px button pinned to the edge, search moved next to cart (`rightA`), cart glyph on the content edge, account hidden; the empty navigation row is hidden in drawer mode.
- Tablet: Horizon's overflow list moves links that don't fit into "More", then switches to the drawer layout when fewer than 2 fit; touch devices always use the drawer.

**Checks run:** browser-engine CSS parse; header-group JSON valid, every setting key exists in its schema, every range / select value valid (step-checked); every new setting is wired (22 settings → bridge variables / classes, all used in `dev1.css`); `dev1.css` loaded once in `layout/theme.liquid`; one header (`header-group.json` only); Theme Check: the 9 baseline offenses (the header warning is the existing `ExcessiveSettingsCount`, now 64 instead of 42); `git diff --check` clean. Local static harness (native header markup + `base.css` + native header CSS + `dev1.css`, fallback font, no theme JS, not a Shopify preview): 1480 top row 88, nav row 43; logo 666, 29, 184 × 37; cart glyph 1386, search 1342 (y 33), account glyph centered at 1309; nav centered at 740, 15px / 24px, active color3, others color6; marker label + 10 wide, 14.53 tall, top 9, 1.5°. 390: row 64 incl. 1px border; logo 125.5–264.5 (139 × 28, centered); menu 348–370, search 60, cart 20 (y 20.5); account hidden. No horizontal overflow at 320 / 375 / 390 / 749 / 750 / 989 / 990 / 1024 / 1150 / 1376 / 1480 / 1920. Nav widths differ from Figma until Cairo loads.

**Pending merchant setup:** the main menu's links / order in Admin → Content → Menus (`main-menu`); add an Account link (`/account`) to it if customers need account access on mobile (the Figma mobile header has no account icon and Horizon's drawer has no account link).

**Pending (manual browser QA, not run):** 1480 header / navigation geometry with Cairo; active highlight on home, collection, product-in-collection, blog / article pages; 390 logo centering and icon order; drawer open / close, nested links, keyboard and focus; search modal; cart count updates; account dialog size on desktop (`shopify-account` renders its own button); logo sizing; Theme Editor controls; 320–1920 no overflow, including when the overflow list switches to the drawer (750–1150); header on product, collection, blog and cart pages; sticky behavior. |
| 2026-11-09 | **#2 Header: mobile menu drawer + menu icon refinement** (status stays `IMPLEMENTED`; Figma `190:4090` menu icon; the drawer itself isn't in Figma, so this is a Snosha extension in the header's palette and rhythm).

**Menu icon:** Figma `190:4090` = three 16px lines at y 7 / 12 / 17 in a 24 box, stroke 1.6, round caps (Horizon's `icon-menu.svg` is two lines in a 14 box). New project files `assets/snosha-icon-menu.svg` (Figma) and `assets/snosha-icon-menu-minimal.svg` (two lines, same weight), stroke `currentColor`; Horizon's shared icon is untouched. `snippets/snosha-menu-icon.liquid` picks the file from the header's new "Mobile menu icon" select (Horizon default / Snosha / Minimal; schema default Horizon, this store: Snosha); `header-drawer.liquid` renders it inside the existing `<summary>` (same button, label and toggle). "Mobile menu icon size" 16–32 (24): the SVG renders at that size, centered on the 22px slot inside the 44px button, so the header height doesn't change.

**Drawer** (native `header-drawer`: same details/summary, close / back buttons, submenus, focus, scroll lock, Escape, Admin menu):

- Header bar: `.menu-drawer::before` grid band, 64 tall (44 + mobile header padding + 1px border, same as the site header), background "Drawer header background" (color5), bottom border = drawer divider color. Optional title via `snippets/snosha-drawer-title.liquid` ("Drawer title" = "القائمة", Cairo 600 16px, link color) at the start; close button 44 × 44 at the end with its 22px glyph on the 20px gutter.
- Rows: Horizon's `--drawer-padding` set to 20px (header gutter); top-level links 16 / 26 Cairo 500 (Menu block font = Subheading), color6, padding 14 → 54px rows + 1px divider; long labels wrap (2 lines tested). Dividers = native Menu block "Drawer dividers" (now on) + "Drawer divider color" (color2); the last row has none; Horizon's 12.8px gap below flat rows removed. Child links: link color, 44px min height.
- Active: Shopify state only (`aria-current="page"` from `link.current`; `menu-drawer__menu-item--active` from `link.current` / `link.child_active`): color3 text, full-width color5 band, 3px color3 bar on the inline-start edge (right in RTL).
- New header settings (Header → Snosha mobile menu): icon style, icon size, drawer title, header background, link size, row padding, link color, active color, active background. Reused native: Menu block background, Drawer dividers, divider color, Drawer accordion.

**Checks run:** header-group values valid against the schema; settings wired (9 → snippets / bridge variables, all used in `dev1.css`); Theme Check: the 9 baseline offenses (moving the icon and title logic into the two project snippets kept `header-drawer.liquid` under the Liquid complexity limit; the header `ExcessiveSettingsCount` advisory now reads 73); `git diff --check` clean. Local static harness (open drawer markup + native CSS + `dev1.css`, fallback font, no JS): 390 drawer 370.5 wide from the right; bar 64 color5 / border color2; close glyph 20px from the edge; rows 55 apart, 16px / 26px / 500, color6, text right-aligned on the 20px gutter; active color3 + color5 band spanning the drawer + 3px bar at the right; child active band full width, 44 tall; no divider after the last row; no horizontal overflow at 320 / 375 / 390 / 430 / 749 / 750 / 989 (400px drawer from 750). Closed header unchanged (390: 64 tall; 1480 unchanged).

**Pending (manual browser QA, not run):** open / close (button, close button, Escape, backdrop), focus order and return, scroll lock, nested submenus and back button (3-level menus), accordion mode, active row on real pages, Cairo rendering and long Arabic labels, the three icon styles and sizes in the Theme Editor, LTR. |

| 2026-11-08 | **#6 F1 banner → `IMPLEMENTED`** (branch `main`; Figma `190:3851` desktop 1480 × 520, `190:4167` mobile 390 × 714; both nodes read in full via Figma MCP).

**Architecture.** New isolated section `sections/snosha-f1-banner.liquid` (like #3). Native `media-with-content` / `hero` can't put the full-width front wave _between_ the dotted arc and the product (Figma stacking), position the decorative stage, or lay out the spec badges without changing those shared sections.

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

**Product data.** Price, compare-at price, discount % (computed, shown only when compare-at > price), sold-out label (`content.product_badge_sold_out`) and the button URL come from the selected product; prices use the shop's `money` format (Figma shows "EGP 2499"). No product → placeholder image, no price, non-navigating button with `aria-disabled`. Title falls back to the product title when the override is blank; the template keeps Figma's short names as overrides. Nothing from Figma's prices or the "20%" is hardcoded.

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

| 2026-11-09 | **#11 Bundle showcase → `IMPLEMENTED`** (branch `main`; Figma `190:3987` desktop 1480 × 656, `190:4318` mobile 390 × 909; both read via design context + metadata).

**Commerce model (user spec).** Four independent Theme Editor product pickers, no metafields / apps / product relationships. `bundle_product` (section setting) is a normal product and the only source of the total (`selected_or_first_available_variant.price`), struck-through compare-at and discount badge (shown only when compare-at > price; % computed from the bundle variant), availability and the variant id in the form. Up to 3 "Bundle product" blocks (`max_blocks: 3`) are display only: row (image, title link, product description stripped and clamped to 2 lines, own `money` price, sold-out note) + hotspot. Row and hotspot come from the same block, so block order drives both. Multi-variant bundle → native `<select name="id">` (unavailable variants disabled); the total shows the first available variant.

**Native reuse.** `product-form-component` + `{% form 'product' %}` + `add-to-cart-button` snippet (cart drawer auto-open, cart count, error message, fly-to-cart); primary `.button` variables re-pointed to the section colors. Horizon's `product-hotspots` wasn't reused: one position per hotspot and its touch action opens quick add (an add-to-cart for the component), which the spec forbids.

**Figma values used.** Section padding 60 / 60 (desktop), 56 / 40 (mobile); container 1376 with 20px inner padding, 56px gap, 640 + 640 columns; image frame 744:560, radius 16 (mobile 7.355 = 16 × 342/744); heading 32/52 → 24/38, body 18/32 → 15/26 (switch at 750); content gap 18 / 14; rows 14px padding, 16px gap, 64px thumbs radius 8, 1px `color2` divider; total row pt 16, gap 34 / 20, badge 12/18 on `color5` with `color2` border; button 52px, radius 12, 16/26. Hotspot defaults (centres, rounded to the 1% range step): desktop 22/64, 51/54, 77/68; mobile 25/68, 53/57, 80/71. Hotspot 32px / 10px dot on mobile; on desktop it scales with the frame like Figma (27.5px at 640). Figma's check boxes were left out (spec).

**Not in Figma (designed here):** the popup (white card, 48px image, 14/22 title, left-pointing arrow, mirrored in LTR), the variant select, the error line. 750–989: stacked, max 640px wide.

**Checks run:** Theme Check (only the 9 baseline offenses), `index.json` parse, `node --check assets/main.js`, CSS brace balance, no `!important`, `git diff --check`.

**Not run (user manages the preview; no browser automation for this task):** rendering at 1480 / 390 / intermediate widths, hotspot hover/tap/Escape behaviour, popup edge placement, RTL/LTR, add to cart (needs real products: the store has none), cart drawer update, Theme Editor block reorder. |

| 2026-11-09 | **#9 Reels → `IMPLEMENTED`** (branch `main`; Figma `190:3935` desktop, `190:4254` mobile; both read via design context).

**Structure.** `sections/snosha-reels.liquid`, up to 12 "Reel" blocks: `video` (Shopify video), `poster` (optional, defaults to the video preview image), `product`, `label` (optional accessibility label). One block = one card, so block order is card order and each video keeps its own product. A reel is valid when it has a video; in the Theme Editor empty blocks render as placeholders and count. No valid reel → nothing renders on the storefront.

**Native reuse.** Horizon `<deferred-media>` (`assets/media.js`): poster button with `on:click="/showDeferredMedia"`, video in a `<template>` cloned on click (no video bytes before), any other deferred media pauses; Horizon's `deferred-media-video-styles` place the clone. The stock `video` snippet wasn't used: it always adds `muted` and Horizon's own play icon. The video plays with sound (started inside the click), `playsinline`, native controls (pause, seek, volume, fullscreen). Prices with `money` / `money_with_currency` (product-card currency setting), `content.price_from` when prices vary; unavailable products show the "Unavailable product text" setting (default "قريبًا", Figma), else `products.product.sold_out`. Product without a selection → video only.

**Carousel.** Choose Your Care's `<snosha-care-carousel>` logic was moved into a shared base `SnoshaSnapCarousel` (same code: one-time centering, mouse drag, drag-click swallow, progress fallback); `<snosha-care-carousel>` and `<snosha-reels-carousel>` are thin subclasses. Care behaviour is unchanged except that the drag-click guard now listens at window capture (before Horizon's document-capture `on:click`), so ending a drag can't trigger a declarative click in either section. Reels additions: middle-reel start on < 750px = `floor((count − 1) / 2)` of the rendered cards (Liquid marks the same card `.snosha-reel--initial` for CSS `scroll-initial-target` in Chromium; elsewhere main.js centres it synchronously on upgrade, and CSS keeps the row transparent until `[data-positioned]` so the first reel never shows first). Runs once per element: no re-centre on resize, playback or after the user scrolls; Theme Editor block changes re-render the section and re-run it. ResizeObserver only toggles `[data-overflow]` (progress visibility). Starting one reel pauses the others; a mouse press on a playing video never starts a drag; selecting a block in the editor scrolls it into view.

**Progress bar.** Same pattern as Choose Your Care: 4px track, 99px radius, fill grows from the inline start with a CSS scroll-driven animation (main.js fallback), gradient start → end. Rest width 19.88% = Figma's 68 / 342 fill; at the middle reel it shows the real scroll position (≈ 60% for 5 reels). Hidden when the reels don't overflow or there's only one reel; separate mobile / desktop toggles.

**Figma values (defaults, all section settings).** Desktop: padding 60 / 60, 1376 column + 20px inner padding, heading 32/52 SemiBold `color6`, 24px to the row, cards 248 wide, video 440 high, radius 18, gap 24 (5 cards = 1336, exact fit at 1480). Mobile: padding 48.5 / 40, heading 24/38, 43.5px to the row (20.5 head padding + 23 gap), 24px gutters, cards 290 × 516, gap 12, progress 23px below. Card: 12px video → info; info row padding 10, gap 14, 43px thumb (radius 6, `color5` fill, `color2` 40% border), title 14/24 Regular `color6` (desktop one line + ellipsis, mobile up to 2 lines), price 14/24 Bold `color3`; play 52px `color3` circle with the Figma 24px icon. Below 390 the mobile card narrows (`100cqi − 2 × gutter − 52px`) so neighbours still peek; frame keeps the width : height ratio from the settings, video `object-fit: cover`.

**Not in Figma (decided here):** play button hover (`color6`), desktop progress bar (only when reels overflow), 750–989 uses the desktop card sizes inside the page column, starting at the first reel.

**Checks run:** Theme Check (only the 9 baseline offenses), `index.json` parse and order, `node --check assets/main.js`, CSS brace balance, no `!important`.

**Not run (user manages the preview; no browser automation for this task) — NOT VERIFIED:** rendering at 1480 / 390 / intermediate widths, middle-reel start with no visible jump (Chromium CSS path and the JS fallback), swipe / trackpad / mouse drag, progress accuracy at both ends and in RTL/LTR, video playback with sound and inline on iOS, pause control, one-at-a-time playback, Theme Editor add / remove / reorder, regression check of Choose Your Care after the shared-base refactor. |

| 2026-11-09 | **#9 Reels — fix request (video/cover, RTL, preview visibility)** — stays `IMPLEMENTED`.

**Preview visibility (confirmed by reading the saved data, no browser).** Running `theme dev` (PID 15260, started 16:37, plain `shopify theme dev`, no `--theme-editor-sync`) serves this worktree (`main`; dev1/dev2 have no Reels files) to development theme #168066810072. That theme's saved `templates/index.json` (pulled read-only into the scratchpad) is identical to the local file: `snosha_reels` is present, enabled and ordered after #8, but all 5 reels have no video, cover or product. The section intentionally renders nothing on the storefront when no reel has a video (Theme Editor shows empty reels as placeholders), so the external preview was empty — not a Liquid bug. Unpublished "Snosha/main" #168066318552 has no Reels section at all. Not verified: whether the selections were never saved, or were saved and then overwritten — without `--theme-editor-sync`, `theme dev` doesn't pull editor saves and re-uploads the local `index.json` on start and on every local change to it.

**Video/cover.** No reel has a saved video, so no Liquid read of the video was ever exercised; the code path (`block.settings.video` → `<deferred-media>` + `video_tag` template, poster = cover → video preview image) was re-checked and is unchanged. Bug fixed: in the editor no-video state the chosen cover was ignored and the generic SVG placeholder shown; it now shows the cover when set, the placeholder only without any media, plus an editor-only hint (no video / still processing / hidden on storefront).

**RTL.** The title has `dir="auto"` and `text-align: start` resolved against its own direction, so a title starting with Latin text aligned left in RTL. Title and price now use `text-align: match-parent` (the row's start side: right in RTL as in Figma, left in LTR). Row order (thumbnail at inline start) unchanged.

**Checks:** Theme Check 9 baseline, CSS balance, no `!important`, `node --check`. Not run: browser rendering, playback. |

| 2026-11-12 | **Homepage improvements (Phase A) + read-only Figma audit (Phase B)** — statuses unchanged. Preview 9292 confirmed serving `main` (served `main.js` = worktree, byte for byte).

**1. Reels mobile start (#9).** Root cause: the middle-reel start ran only when the element connected; a row first laid out at >= 750px (Theme Editor desktop → mobile toggle, DevTools device mode, rotation, resized window) stayed on reel 1 (`HEAD`: `scrollLeft 0` after 1480 → 390, CSS and JS paths). Fix (already in the working tree uncommitted at the start of this task, verified and kept): `#applyInitialPosition()` in `assets/main.js` applies the one-time start from the existing ResizeObserver the first time the row is the mobile scroller. Verified at 390, RTL + LTR, CSS (`scroll-initial-target`) and simulated JS-fallback paths: 1–7 reels centre `floor((n−1)/2)` (2 reels: reel 1 at the scroll start, 26px off true centre — scroll boundary); progress 59.9 % at the middle of 5; drag / wheel / resize never re-centre.

**2. Cards per row (desktop ≥ 990 / tablet 750–989 / mobile < 750)** — CSS variables from section settings; card widths derived from the container, gaps and gutters (no fixed widths). Defaults reproduce Figma exactly (1480 / 390 measurements identical to the pre-change baseline).
- `snosha-collections`: new `cards_desktop` 2–6 (4), `cards_tablet` 2–5 (3), `cards_mobile` 1–4 (3). Width = (100cqi − gutters − peek − gaps) / n, peek 96 (desktop/tablet) / 39 (mobile) from Figma; item height = width + 76 (min, desktop/tablet) / + 55 (mobile one-line clip). `assets/dev1.css`.
- `product-list` (Snosha style): desktop reuses native `columns`; new `snosha_columns_tablet` 1–4 (2), `snosha_columns_mobile` 1–3 (2). Card width = registered `@property --snosha-fc-card-width`; mobile card metrics scale with it (exact Figma values at 2 per row) and never go below the 390px reference size; price row may wrap on narrow cards. `assets/dev1.css`, `sections/product-list.liquid`.
- `snosha-reels`: new `cards_desktop` 2–8 (5), `cards_tablet` 1–6 (3), `cards_mobile` 1–3 (1). Width = (carousel 100cqi − padding − gaps) / n; mobile keeps 52px of neighbour peeks and the "Maximum card width (mobile)" cap. Existing width/height settings keep their IDs/values and now set the frame ratio only (relabelled). `assets/main.css`, `sections/snosha-reels.liquid`.
- `snosha-why`: new `columns_desktop` 1–6 (4), `columns_tablet` 1–6 (4), `columns_mobile` 1–3 (2); `repeat(n, minmax(0, 1fr))`. `assets/dev1.css`, `sections/snosha-why.liquid`.
- Non-default values checked by injecting the same CSS variables before first render (template not edited): widths follow the counts at 1480 / 1024 / 768 / 390 / 320, no page overflow.

**3. Bundle mobile total (#11).** Confirmed mismatch, not changed: Figma is one 44px row; live wraps to two centred lines (78px) because the store money format ("LE 7,500.00" / "LE 9,000.00") needs 360px at Figma sizes vs 342 available. No overlap/overflow; order, type and the 14px gap to the 52px button match Figma. Needs a decision (money format vs. a mobile layout deviation).

**Checks:** Theme Check 9 baseline; `git diff --check` clean; `node --check assets/main.js`; CSS balanced, no `!important`; no Liquid errors on the rendered homepage. Not verified: Theme Editor UI (admin), real iOS/Android devices, Firefox/Safari (JS fallback simulated only). `assets/view-event-elements.js` showed an unrelated quote-style reformat (not part of this task; left as is). |

| 2026-11-12 | **Audit corrections** (statuses unchanged; measured on the 9292 `main` preview).
- **Best-seller badge:** both homepage product lists → `custom_badge_tag: "الاكثر مبيعا"` (`templates/index.json`); label unchanged. No store product has tags yet, so no badge shows until the merchant tags products.
- **Featured cards (#5, #7):** gallery `image_ratio` portrait → square (both instances). `assets/dev1.css`: slide → item → card fill the row height; card `min-block-size` = Figma (image + 225.9 desktop, 165 × 283 scaled on mobile) instead of the fixed mobile height + clip; children don't shrink (title was squeezed to 0); price + link on a shared bottom line. Measured: 1480 card 316 × 541.9, title 330, price 445.9, link 483.9, section 841 (Figma 841.1); 390 card 165 × 283, price 232.9, link 252.7, section 573 (= Figma). Content variations (missing / one-line description) keep alignment; no clipping or overflow at 1480 / 1366 / 390 / 375 / 320.
- **Bundle total (#11), < 750px only:** summary row (label at the inline start, price at the end, compare-at + badge beside or beneath the price, end-aligned), Figma type sizes; `assets/main.css`. 390 / 375 / 320: 74px block, no overlap or overflow. Desktop unchanged.
- **Announcement bar (#1):** opt-in block setting `snosha_style` in `blocks/_announcement.liquid` (Horizon private block, additive): Figma sparkle (`snosha-icon` `sparkle`) at the inline start, 10px gap; desktop 14 / 24 Medium, mobile 12 / 19 Regular (`assets/main.css`); section padding 15 → 10 (`sections/header-group.json`). Bar 44 + the existing 1px divider. 320: wraps to 2 lines (Horizon reserves 44px per side for slider arrows).
- **Header (#2):** cart glyph → Figma "Icon / cart" 22px (`assets/snosha-cart-22.svg`, CSS mask in the Snosha header scope; cart bubble, drawer and search verified). Logo unchanged: the uploaded logo is 4.13 : 1, Figma's header logo artwork 4.94 : 1 — needs the Figma logo asset uploaded by the merchant.
- **FAQ (#14):** warranty row `open_by_default: true` (native setting); card block padding 13 (Figma's stroke is inside its 14px padding). Desktop 498 / rows 55, 93; mobile 630 / rows 55, 121 (= Figma). Click and keyboard toggle verified.
- **Footer (#15):** `blocks/footer-copyright.liquid` optional `brand_name` (falls back to `shop.name`); set to "SNOSHA" in `sections/footer-group.json`.
- Checks: Theme Check 9 baseline, JSON parse (headers kept), `git diff --check`, CSS balance / no `!important`, no Liquid errors. |
| 2026-11-12 | **Product page Buy Box — `IMPLEMENTED` (not verified).** Figma desktop `190:10229` (560 wide), mobile `190:10940`. Existing `templates/product.json` → `product-information` → static `product-details` modified in place; no new template, gallery block/settings untouched.
- **Reused (native):** title text block (`<h1>{{ closest.product.title }}</h1>`), `price` (existing project discount badge, label `خصم [percent]%`), `review` (Shopify `reviews.*` metafields that Judge.me fills), `variant-picker` swatches, `buy-buttons` + `quantity` (custom input style: white, `color2` border 1.5, radius 50) + `add-to-cart` (primary), `accordion` / `_accordion-row` (description = the existing `text_aEtTtq` block, moved into the "الوصف" row, open by default), `<product-recommendations>` + `<product-card>` + `product-form-component` / `add-to-cart-component` for complementary products.
- **Extended (opt-in, default off):** `product-information` section `snosha_buy_box`, `snosha_details_width` (560), Buy Box colors, `custom_class` (output in `snippets/product-information-content.liquid`; `featured-product-information` inert); `variant-picker` `show_swatch_labels` (`snippets/variant-main-picker.liquid`); `review` `show_rating_value`; `accordion` `snosha_style` + 9 colors; `_accordion-row` `snosha_icon`, `hide_when_empty`; `snippets/snosha-icon.liquid` + discount, check, close, plus, chevron_down, document, wallet, cart (Figma geometry).
- **Created:** `blocks/snosha-capsule.liquid`, `snosha-benefits` + `_snosha-benefit`, `snosha-trust-list` + `_snosha-trust-item`, `snosha-complementary` (manual `product_list` first, else Search & Discovery complementary via native hydration; hidden when neither). CSS: `assets/main.css` (Buy Box, capsule, benefits, trust, complementary, accordion card style). No new JS.
- **Template changes:** section `desktop_media_position` left → right (Buy Box at the start/right in RTL, as in Figma), `snosha_buy_box: true`; details gap 28 → 20 (Horizon scales to 14 below 990); header group gap 12 → 20 + rating block first; title color `color3`; divider `disabled` (kept); swatches on; capsule, 6 benefits, 6 trust pills, complementary, label text, 6 accordion rows added (policy rows empty + `hide_when_empty`, so they show only once the merchant writes content).
- **Template-wide content:** capsule, benefits, trust pills, manual complementary products and policy rows apply to every product on this template. Per-product: connect a text setting to a product metafield (dynamic source; blank rows hide) or use an alternate template.
- **Checks run:** Theme Check 9 baseline; template JSON parses (header kept) and every block setting/option/range validated against its schema (0 problems); `git diff --check` clean; CSS balanced, no `!important`. **Not run (no products in the store, no browser automation per task):** rendering, variant switching, add to cart, Search & Discovery fetch, Theme Editor, all widths.
- **Merchant / QA:** create products + Color option with swatch data; install/configure Judge.me (rating hidden until review metafields exist); set complementary products in Search & Discovery or pick them manually; write policy row content; review whether the six Figma benefit/trust texts should stay template-wide. Accelerated checkout (static block) renders below the purchase row if enabled in Shopify. Mobile side padding is the global 24px gutter (Figma 20). |
| 2026-11-12 | **Product gallery — `IMPLEMENTED` (not verified).** Figma desktop Gallery `190:10212`, mobile Main Stage `190:10921` + Thumb Rail `190:10931` (parent `190:10914`). Native `_product-media-gallery` (static `media-gallery` in `templates/product.json`) reused: carousel + bottom thumbnails (desktop and mobile), aspect `adapt`, contain, zoom on, `hide_variants` kept; constrain-to-viewport off so the stage keeps the Figma ratio.
- **Extended (opt-in `snosha_style`, off elsewhere incl. featured-product carousel):** `blocks/_product-media-gallery.liquid` settings (stage background/border/radius desktop+mobile, thumb size desktop+mobile, mobile thumb radius, thumb border/selected colors, zoom button on/off + colors, badge text/tag/colors, custom class); `snippets/product-media-gallery-content.liquid` adds `media-gallery--snosha`, the tag-gated badge (exact tag `الاكثر مبيعا`, text `الأكثر مبيعًا`) and a per-slide zoom button whose click bubbles to the slide's native `#zoom-dialog/open/<index>`; `snosha-icon` `search`. CSS: `assets/main.css` (.media-gallery--snosha).
- **Figma notes:** the decorative "Ring" ellipse has no fill/stroke (empty export) → not drawn. Desktop stage width follows the column (≈768 at 1480 with the 560 Buy Box and 48 gap — calculated from the grid CSS, not measured; Figma 712 in a 1336 frame), same 712 : 660 ratio. Mobile stage 19px from the edges (full-bleed media column), rail full width with 20px padding. Breadcrumbs (Figma mobile) don't exist in the template — not added (out of scope).
- **Checks run:** Theme Check 9 baseline (`product-media-gallery-content.liquid` LiquidComplexity, pre-existing, now 138); template/schema validation 0 problems; range-step scan clean; `git diff --check` clean; CSS balanced. Not run: rendering, thumbnails/zoom/video interaction, all widths (no products; no browser automation per task).
- `snippets/variant-picker-styles.liquid` has an uncommitted change (selected-swatch focus outline commented out) not made in this task; left untouched. |
| 2026-11-12 | **Gallery responsive fix (measured on 9292, `/products/snosha-f1`).** Preview first unblocked: Theme Dev showed "Failed to Upload" for two stale `sed` temp paths in `blocks/` (left by an earlier `sed -i`), cleared by recreating and deleting them (no restart).
- **Mobile page overflow:** root cause = Horizon `slideshow-container { width: 100% }` + the stage's `margin-inline: 19px` → 100% + 19px, spilling 19px to the left in RTL (document 409 at 390, 394 at 375, 339 at 320). Fix: `inline-size: auto` on the stage container (`assets/main.css`). After: document = viewport at 390 / 375 / 320; stage 352 × 363.9 at x 19 (390), 337 × 348.4 (375), 282 × 291.5 (320); rail full width, first thumb 20px from the edge, thumbs scroll inside their container.
- **Desktop columns:** measured before: Horizon's ≥1200 `1fr : 2fr` (Buy Box 458.7, stage 893.3 at 1480) and `min(50vw, 25rem)` below 1200 — the earlier `--sidebar-width` override had no effect at ≥1200. Replaced with Buy Box-scoped tracks: Buy Box = width setting + half gap (max 50%), gallery = rest, gap = new section setting `snosha_column_gap` (64). After at 1480: Buy Box 560, gap 64, gallery 752 × 697 (Figma 712 in a 1336 row; the site container is 1376); 1366: 560 / 644; 1024: 440 / 440; 990: 424 / 424; 800: 334 / 334. Badge 20 / 20, zoom 25 / 27 inside the 1px border, stage → thumbs 23. No page overflow.
- **Image sizing (F1 image 1, 1537 × 1023 PNG, ratio 1.50):** contain in a 350 × 361.9 slide (390) renders 350 × 232; the empty bands come from the landscape-vs-stage ratio (CSS, contain) plus transparent margins baked into the file (content 85% × 82%: L168 R61 T60 B128 px). Other F1 media: 1456 × 2544 (opaque, full-bleed), 1254² (opaque), 480 × 360 (90% transparent), 1537 × 1023 (white margins ~10%). New `snosha_media_fit` (contain default / cover; Figma media padding only with contain).
- Removed the gallery-level custom class (section `custom_class` covers it) to stay at 40 block settings. Checks: Theme Check 9 baseline, template/schema 0 problems, `git diff --check` clean. Interaction (puppeteer): thumbnail selects; zoom button opens the dialog at the shown media; Enter opens, Escape closes. Native behavior noted, not changed: at 1480 a jump from thumbnail 1 to 3 (non-adjacent, RTL) leaves the track ~250px off; same with the Snosha class removed. `locales/ar.json` and `snippets/variant-picker-styles.liquid` have changes not made in this task. |

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
