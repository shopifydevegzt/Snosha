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
| 4 | Collections carousel | `190:3830` | `190:4133` | `collection-list` (carousel layout) + `collection-card` | Medium | Collections must exist in Admin; carousel arrows (desktop), progress bar (mobile) | `NOT_STARTED` |
| 5 | Featured collection (best sellers) | `190:3844` | `190:4149` | `product-list` (instance `product_list_fa6P9H` exists) with carousel on mobile; card blocks `product-title`, `product-description`, `review`, `price`, button/link | Medium–High | **Real products**; review data/app for stars; badges ("best seller" is not a native badge type) | `NOT_STARTED` |
| 6 | F1 banner | `190:3851` | `190:4167` | `media-with-content` or `hero`; spec chips via `group` / `icon` / `text` | High | Decorative waves, bubbles and watermark (assets/CSS); product image | `NOT_STARTED` |
| 7 | Featured collection · 2 (bundles title) | `190:3896` | `190:4204` | Second `product-list` instance; same card configuration as #5 | Low (after #5) | #5 card configuration; products | `NOT_STARTED` |
| 8 | Before / After | `190:3903` | `190:4222` | `media-with-content` + `comparison-slider` block + benefit list (`group` / `icon` / `text`) + `button` | Medium | Before/after images (merchant); `comparison-slider` RTL drag behavior | `NOT_STARTED` |
| 9 | Reels | `190:3935` | `190:4254` | `carousel` section with `video` blocks, or `product-list` carousel. Reel cards may link products | Medium–High | Video files/URLs (merchant); autoplay/performance policy. *Open: card content and links not inspected.* | `NOT_STARTED` |
| 10 | Choose Your Care | `190:3943` | `190:4265` | `product-list` / `featured-product` / `section` + `_card` | High | Featured middle card differs in size; products. *Open: native fit unclear.* | `NOT_STARTED` |
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
