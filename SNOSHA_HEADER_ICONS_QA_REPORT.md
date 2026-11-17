# SNOSHA — Header & Navbar Icons: Visual QA Report

Date: 2026-11-17 · Branch / worktree: `main` (`E:/Work/Snosha/Project`, clean at start, no merge in progress) · Theme: Horizon v4.4.0
Scope: icons of the global header (`sections/header-group.json` → `header_section`, native `header` with the opt-in "Snosha layout"). The header renders on every page (layouts `theme.liquid`; `password.liquid` has no header group).

Status labels: **PASS** (measured match), **FAIL** (measured mismatch), **PARTIAL** (sub-pixel or explained residual), **N/A** (not in Figma / not rendered).

---

## 1. Figma nodes used (file `1fqyznLFgS65tTjGvBYPBm`, Figma MCP `get_metadata` + `get_design_context`)

| Viewport | Node | Content |
|---|---|---|
| Desktop 1480 | `190:3769` "02 Header" (88 tall, padding 33) | `190:3771` Header Icons (110 × 22, gap 22): `190:3772` Icon / user, `190:3773` Icon / search, `190:3774` Icon / cart; `190:3775` logo |
| Mobile 390 | `190:4084` "02 Header" (64 tall incl. 1px bottom border) | `190:4085` Header Actions (gap 18): `190:4086` Icon / cart, `190:4087` Icon / search; `190:4088` logo; `190:4089` Header Menu: `190:4090` Icon / menu |

Icon geometry from the exported vectors (paths compared 1:1 with the theme files):

| Figma icon | Slot | Vector | Stroke | Color |
|---|---|---|---|---|
| user | 22 × 22 | 24 × 24 vector placed unscaled at the slot's top-left (circle r4 at 12,8 + open shoulder arc) | 1.6, round caps/joins | desktop `#12568D` (color6) |
| search | 22 × 22 | 18 × 18 frame centered (lens r6.5 at 7.5,7.5 + handle to 16.5) | 1.6, round | desktop color6, mobile `#176BB0` (color3) |
| cart | 22 × 22 | 22 × 22 trolley (rail, basket, 2 wheels r1.375) | 1.2, round | desktop color6, mobile color3 |
| menu | 22 × 22 | 24 × 24 vector unscaled at the slot's top-left (3 lines 4→20 at y 7/12/17) | 1.6, round | mobile color3 |

Not in either Figma header frame: account on mobile (hidden by design), close / back / chevrons of the drawer (the drawer is a documented Snosha extension, not designed), language / country selectors (off in the store), hover / focus / active variants (the frames show the default state only; no state variants were inspected).

## 2. Icon inventory (theme)

| Icon | Rendered by | Source before | Source after | Kind | Where |
|---|---|---|---|---|---|
| Account | `snippets/header-actions.liquid` → `<shopify-account>` slot `signed-out-avatar` | Horizon inline SVG (15 × 17) | Figma `snosha-icon` `user` (new entry) via `snippets/snosha-header-icon.liquid` | inline SVG | desktop; hidden < 750 by `snosha_hide_mobile_account` |
| Search | `snippets/search.liquid` (rendered twice by `header.liquid`: top row + drawer copy) | Horizon `icon-search.svg` | existing project `snosha-icon` `search` (= Figma path) | inline SVG | desktop + mobile |
| Cart | `snippets/header-actions.liquid` `<cart-icon>` | Horizon `icon-cart.svg`, hidden; Figma `assets/snosha-cart-22.svg` drawn as a CSS mask (`assets/dev1.css`) | unchanged | CSS mask of SVG asset | desktop + mobile |
| Cart count | `snippets/cart-bubble.liquid` | native | unchanged | HTML | both |
| Mobile menu | `snippets/header-drawer.liquid` → `snippets/snosha-menu-icon.liquid` | Figma `assets/snosha-icon-menu.svg` (setting "Mobile menu icon" = Snosha) | unchanged glyph, 1px anchor fix | inline SVG | < 750 and drawer mode |
| Menu close (summary) / drawer close | `header-drawer.liquid` | Horizon `icon-close-menu.svg` / `icon-close.svg` | unchanged | inline SVG | drawer only |
| Drawer back / chevrons | `header-drawer.liquid` | Horizon | unchanged | inline SVG | drawer submenus only |

Existing Theme Editor settings before this task: "Mobile menu icon" (style) and "Mobile menu icon size" (24). No custom-icon mechanism existed in Horizon's header (`icon-or-image.liquid` is used by other blocks, not by header actions).

## 3. Measurements — Figma vs browser (before → after)

Method: dev preview `http://127.0.0.1:9292` (running `theme dev`, verified to serve this worktree by byte-comparing the served `main.css`), headless Edge + puppeteer-core, `getBoundingClientRect()` and SVG ink bounds (`getBBox` × `getScreenCTM`, incl. half stroke). Cairo loaded. The storefront header starts at y 45, Figma at y 44, so Figma y values below are shifted +1. Units: CSS px.

| Icon | Viewport | Figma size | Current size (before → after) | Shape match | Spacing delta | Status |
|---|---|---|---|---|---|---|
| Account | 1480 | slot 22 at 1298,78; ink 1301.2,81.2 · 17.6 × 18.6; stroke 1.6 | before: box 15 × 17, ink 1301.53,80.54 · 14.63 × 16.32, stroke 1.5 → after: ink 1301.23,81.18 · 17.6 × 18.6, stroke 1.6 | before ✗ (closed bell body, small head) → after ✓ (Figma paths) | slot center 1309.03 vs 1309 (0.03) | FAIL → **PASS** |
| Search | 1480 | box 18 × 18 at 1344,80; ink 17.1 × 17.1; stroke 1.6 | before: viewBox 20 at 22px, ink 1345.85,81.85 · 14.3 × 14.3, stroke 1.65 → after: box 18 at 1344,80, ink 1344.2,80.2 · 17.1, stroke 1.6 | before ✗ (lens r4.75 vs r6.5, short handle) → after ✓ | 0 | FAIL → **PASS** |
| Cart | 1480 | slot 22 at 1386,78; stroke 1.2 | glyph 22 × 22 centered in the 44px button 1375–1419 → 1386–1408 (unchanged) | ✓ (Figma asset) | 0 | **PASS** |
| Icon spacing | 1480 | slots 1298 / 1342 / 1386 (gap 22) | 1298 / 1342 / 1386 | — | 0 | **PASS** |
| Icon color | 1480 | color6 `#12568D` | rgb(18, 86, 141) | — | — | **PASS** |
| Cart | 390 | slot 20,66 | button 9–53 → glyph 20–42, y 65.5 | ✓ | y −0.5 (see §4) | **PASS** (position) |
| Search | 390 | box 18 at 62,68 | before: 22 box at 60,65.5, Horizon glyph → after: 18 box at 62,67.5, ink 17.1, stroke 1.6 | before ✗ → after ✓ | y −0.5 | FAIL → **PASS** (shape) / PARTIAL (0.5 y) |
| Menu | 390 | vector 24 at 348,66; ink 351.2,72.2 · 17.6 × 11.6 | before: 347,64.5, ink 350.2 → after: 348,65.5, ink 351.2,71.7 | ✓ | x 0 (was −1), y −0.5 | PARTIAL → **PASS** (x) / PARTIAL (0.5 y) |
| Icon color | 390 | color3 `#176BB0` (cart, search, menu) | before rgb(18, 86, 141) = color6 → after rgb(23, 107, 176) = color3 | — | — | FAIL → **PASS** |
| Account | 390 | not shown | hidden (`display: none`) | — | — | **PASS** |
| Cart ↔ search gap | 390 | 18 | slots 20–42 / 60–82 → 18 | — | 0 | **PASS** |
| Menu close (drawer) | 390 | not designed | Horizon close, 22 × 22 in 44 × 44, color6 | — | — | N/A |

### FAIL details (all corrected)

1. **Search shape** — Horizon `assets/icon-search.svg` (20 viewBox, lens r4.75, stroke `--icon-stroke-width` 1.5 → 1.65 px at 22) vs Figma 18 frame, lens r6.5, stroke 1.6. Cause: native icon never swapped. Fix: reuse `snosha-icon` `search` (identical Figma path) rendered at 18 × 18 (`calc(var(--icon-size-md) * 18 / 22)`), selector `#header-component.snosha-header .snosha-header-icon--search`.
2. **Account shape / size** — Horizon inline SVG in `header-actions.liquid` (15 × 17, closed path) vs Figma user 24 vector, ink 17.6 × 18.6. Cause: native icon never swapped; no project asset existed. Fix: Figma paths added to `snippets/snosha-icon.liquid` as `user`, rendered at 24 × 24 with the Figma top-left anchoring (`translate: 1px 1px` = `var(--icon-size-md) / 22`), keeping the native `account-button__icon` class (color token, transition).
3. **Mobile icon color** — header text color (color6) is shared by both breakpoints; Figma mobile uses color3. Fix: new optional "Mobile icon color" setting (blank = unchanged), set to color3 in `header-group.json`; applied < 750 to search, cart, menu and the account token.
4. **Menu anchoring (1px)** — the 24px Figma vector was centered on its 22px slot; Figma places it at the slot's top-left. Fix: `translate` of `clamp(0, (menu size − 22) / 2, 1px)` → exactly 1px at the store's 24px, ≤ 1px at other sizes (stays centered within 1px).

## 4. Remaining residuals (not changed)

- **Mobile vertical 0.5px**: every mobile icon sits 0.5px above Figma. Horizon centers the row in the 63px above the 1px border; Figma centers in the full 64px. Pre-existing header-row geometry (`snosha_padding_*_mobile` 9.5 / 9.5 in `dev1.css`); the padding range steps by 0.5, so it cannot be split as 10 / 9 without changing the 64px total. Left as is.
- **Menu button touch target**: 22 × 44 (`padding-inline: 0` in `assets/dev1.css`, pre-existing, so the glyph sits on the 20px gutter). Meets WCAG 2.5.8 via the spacing exception (no neighbor within 24px) but is narrower than the 44 × 44 of the other actions. Not changed (dev1.css-owned).
- **Cart count bubble**: native Horizon position (20px circle, top 4.5 / inline-end 2.5 of the 44px button → 1377.5,71.5 at 1480; 11.5,59 at 390), overlapping the trolley's inline-end corner. Figma shows no count state, so there is nothing to match; native kept.
- **Drawer close / back / chevrons**: not in Figma; Horizon icons kept. The Figma icon set has `Icon / close` (`snosha-icon` `close`) if a match is wanted later.

## 5. Native and project assets reused / added

- Reused unchanged: `assets/snosha-cart-22.svg` (cart, via `dev1.css` mask), `assets/snosha-icon-menu.svg` (menu), `snosha-icon` `search` (search), Horizon `icon-search.svg` / `icon-cart.svg` / account SVG / `icon-menu.svg` as fallbacks.
- Added: `snosha-icon` `user` — exact Figma "Icon / user" paths (vector `190:2727`), `currentColor`, no redraw. No new asset file; no Figma temporary URL in the theme.

## 6. Custom icon image pickers (Theme Editor)

**Location:** Online Store → Themes → Customize → any page → **Header** (header group) → section **Header** → settings panel, group **"Snosha header icons"** (directly below "Border below navigation (desktop)", above "Snosha mobile menu"). Visible only while **"Snosha layout"** is on.

| Setting ID | Label | Type | Default | Store value | Effect |
|---|---|---|---|---|---|
| `snosha_icon_color_mobile` | Mobile icon color | color | blank (header text color) | color3 | < 750px icon color |
| `snosha_account_icon_image` | Custom account icon | image_picker | blank | blank | replaces the signed-out account icon |
| `snosha_search_icon_image` | Custom search icon | image_picker | blank | blank | replaces the search icon (top row and drawer copy) |
| `snosha_cart_icon_image` | Custom cart icon | image_picker | blank | blank | replaces the cart glyph; the count bubble stays |
| `snosha_menu_icon_image` | Custom mobile menu icon | image_picker | blank | blank | replaces the "Mobile menu icon" style |
| `snosha_custom_icon_size` | Custom icon size | range 12–40 px | 22 | 22 | square for uploaded icons only, `object-fit: contain` |

Behavior: blank picker → the icon above (Figma glyph, or Horizon's when "Snosha layout" is off). Image set → only the image renders (`image_tag`, `alt=""`, `widths` 40–160, `sizes` = icon size, eager), inside the same native button / link / `<summary>` / `<shopify-account>`; the accessible names (`بحث`, `سلة التسوق`, `القائمة`, `الحساب`) and actions are unchanged. The custom cart image replaces `.svg-wrapper` with a 44px `.snosha-header-icon-slot`, so the dev1 mask glyph is not drawn as well.

Runtime test (temporary values in `header-group.json`, reverted and re-verified): all four set to the store's `SNOSHA.png` → each rendered once as a 22 × 22 contained image exactly in the Figma slot (1298 / 1342 / 1386 at 1480; 20 / 60 / 348 at 390), zero visible SVGs in those controls. Uploaded **SVG** files were not tested; a PNG with ≥ 3× resolution, tightly cropped, is recommended (internal whitespace shrinks the visible artwork: raise "Custom icon size" rather than stretching).

**Merchant uploads required:** none. Every Figma header icon is now rendered from the exact Figma vector; the pickers are optional.

## 7. Files modified

| File | Change |
|---|---|
| `snippets/snosha-header-icon.liquid` | **new** — picks custom image / Figma glyph / nothing (→ native fallback) |
| `snippets/snosha-icon.liquid` | + `user` icon (Figma paths) |
| `snippets/snosha-menu-icon.liquid` | custom image takes precedence over the style select |
| `snippets/search.liquid` (Horizon) | optional `section` param; icon from `snosha-header-icon` when it returns markup, `icon-search.svg` otherwise. Only consumer: `header.liquid` |
| `snippets/header-actions.liquid` (Horizon) | account icon and cart wrapper hooks (same fallback rule). Only consumer: `header.liquid` |
| `sections/header.liquid` (Horizon) | `section: section` on the two `search` renders; 6 settings + 1 group header; bridge vars `--snosha-header-custom-icon-size`, `--snosha-header-icon-color-mobile`; modifier class `snosha-header--icon-color-mobile` |
| `sections/header-group.json` | one key added: `snosha_icon_color_mobile` = color3 (targeted insertion; no other value touched) |
| `assets/main.css` | new block "SNOSHA — HEADER ICONS" under `#header-component.snosha-header` |

Untouched: `assets/dev1.css`, `config/settings_data.json`, locales, other worktrees, every other section. All changes are inert when "Snosha layout" is off (snippet returns nothing → Horizon markup).

## 8. Responsive results (after)

| Width | Mode | Account ink | Search box | Cart button | Menu svg | Overflow-x |
|---|---|---|---|---|---|---|
| 1480 | menu | 1301.23 · 17.6 × 18.6 | 1344,80 · 18 | 1375 · 44 | — | 0 |
| 1366 | menu | 1190.15 | 1232.92 | 1263.92 | — | 0 |
| 1200 | menu | 1028.42 | 1071.19 | 1102.19 | — | 0 |
| 990 | menu | 823.83 | 866.59 | 897.59 | — | 0 |
| 989 | menu | 822.84 | 865.61 | 896.61 | — | 0 |
| 900 | menu | 736.14 | 778.91 | 809.91 | — | 0 |
| 768 | menu | 607.53 | 650.30 | 681.30 | — | 0 |
| 750 | menu | 589.98 | 632.75 | 663.75 | — | 0 |
| 749 | mobile | hidden | 62 · 18 | 9 · 44 | 707 · 24 | 0 |
| 430 | mobile | hidden | 62 | 9 | 388 | 0 |
| 390 | mobile | hidden | 62,67.5 | 9 | 348,65.5 | 0 |
| 375 | mobile | hidden | 62 | 9 | 333 | 0 |
| 320 | mobile | hidden | 62 | 9 | 278 | 0 |

Icon sizes, strokes (1.6 / 1.2) and the 22 / 18 spacing are constant at every width; the 3 desktop icons keep 22px gaps at every desktop width; the logo never overlaps the icons (320: logo 108–212, search ends 80, menu starts 278). RTL order right → left: desktop cart, search, account (Figma: account, search, cart left → right); mobile menu | logo | search, cart. LTR (`dir` switch) **not run**.

## 9. Functional regression (after, 1480 and 390)

| Check | Result |
|---|---|
| Search button opens the search modal (desktop + mobile) | Passed |
| Cart button opens the cart drawer | Passed |
| Account: `shopify-account` shadow button present, label "الحساب", 44 × 44 | Passed (sign-in dialog itself not opened) |
| Cart count: add to cart → bubble "1" visible at both breakpoints; cart cleared afterwards | Passed |
| Menu drawer opens; drawer close button closes it | Passed |
| Hover: native sibling dimming (hovered 1, others 0.8) | Passed |
| Keyboard focus: search and cart show `:focus-visible` outline (solid 1px) | Passed; account focus ring is inside `shopify-account`'s shadow DOM (not measured) |
| Touch targets 390: search 44 × 44, cart 44 × 44, menu 22 × 44 | see §4 |
| Theme Check | 10 offenses = baseline (header `ExcessiveSettingsCount` advisory now 79 settings, was 73) |
| Schema JSON parse, duplicate IDs, header-group keys ⊂ schema, `git diff --check` | Passed |

## 10. Limitations / not verified

- Theme Editor UI not opened: setting visibility and image upload flow verified only through schema validation and a JSON-driven runtime test.
- Signed-in account avatar (rendered by `shopify-account`), uploaded SVG icons, LTR, transparent header (off for all templates), sticky-on-scroll state, and pages other than the homepage were not measured; the header markup is identical on all templates.
- Figma hover / focus states not inspected (none in the header frames).
- Screenshots: `docs/figma-validation/header-icons-{before,after}-{1480,390}.png`, `header-icons-cart-{1480,390}.png` (count bubble), `header-icons-custom-390.png` (custom-image test), `header-icons-drawer-390.png`.
