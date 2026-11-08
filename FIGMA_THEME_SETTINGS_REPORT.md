# Figma → Horizon Global Theme Settings Report

- **Theme:** Shopify Horizon v4.4.0 (`config/settings_schema.json` → `theme_version: 4.4.0`)
- **Figma file:** `1fqyznLFgS65tTjGvBYPBm` (Snosha). Desktop frame `190:3767` (1480 px), Mobile frame `190:4082` (390 px)
- **Scope:** Global theme settings in `config/settings_data.json` → `current` only. No sections, blocks, templates, locales or schema were changed.
- **Backup of the original file:** `C:\Users\pop\AppData\Local\Temp\claude\b508b26346e18e55\0f56e18b-5694-4135-84a9-d0cf810b7d5f\scratchpad\settings_data.backup.json`
- **Store (Shopify CLI):** `internal-zt-yzyuhhfk.myshopify.com`. Nothing was pushed or published.

---

## 1. Figma Design System

Source: Figma variables and text styles (`get_variable_defs`), confirmed on component instances (`get_design_context`).

### Colors (Figma variables)

| Token                           | Value                      | Used for                                            |
| ------------------------------- | -------------------------- | --------------------------------------------------- |
| `--color-brand-primary`         | `#60C1E1`                  | Brand accent; same value as `--color-border-strong` |
| `--color-brand-secondary`       | `#176BB0`                  | Primary button fill, best-seller badge              |
| `--color-state-hover`           | `#12568D`                  | Hover state, product title, price                   |
| `--color-text-primary`          | `#131311`                  | Main text                                           |
| `--color-text-secondary`        | `#5A5A59`                  | Secondary text, placeholders, struck-through price  |
| `--color-text-link`             | `#176BB0`                  | Links, secondary button text, discount badge text   |
| `--color-text-on-brand`         | `#FFFFFF`                  | Text on brand fills                                 |
| `--color-background-primary`    | `#FFFFFF`                  | Page and card background                            |
| `--color-background-secondary`  | `#F0FAFE`                  | Tinted surfaces, discount badge                     |
| `--color-border-default`        | `#DCF2FB`                  | Input border, badge border, dividers                |
| `--color-border-strong`         | `#60C1E1`                  | Secondary button border                             |
| `Miscellaneous/Text Field - BG` | `#FFFFFF`                  | Input background                                    |
| `Shadow/Soft`                   | `0 12px 32px #0F64A81A`    | Card shadow                                         |
| `Gradient/Brand`                | `#63CDFF → #0F64A8` (160°) | Hero button text and highlights                     |

### Typography (Cairo throughout, letter-spacing 0)

| Style                  | Desktop size / line height | Weight | Mobile size / line height |
| ---------------------- | -------------------------- | ------ | ------------------------- |
| Display Hero           | 56 / 84                    | 700    | 28 / 44 (Mobile/H1)       |
| H1                     | 40 / 64                    | 700    | 28 / 44                   |
| H2 (section titles)    | 32 / 52                    | 600    | 24 / 38                   |
| H3                     | 24 / 40                    | 600    | — (no mobile style)       |
| H4                     | 20 / 34                    | 600    | 18 / 30                   |
| Body Large             | 18 / 32                    | 400    | —                         |
| Body                   | 16 / 28                    | 400    | 15 / 26                   |
| Body Small             | 14 / 24                    | 400    | 13 / 22                   |
| Caption                | 12 / 20                    | 400    | 12 / 19                   |
| Label Overline         | 12 / 18                    | 600    | —                         |
| Navigation             | 15 / 24                    | 500    | —                         |
| Button CTA             | 16 / 26                    | 600    | —                         |
| Product Name           | 16 / 27                    | 600    | —                         |
| Product Price          | 18 / 28                    | 700    | —                         |
| Product Price Discount | 14 / 22                    | 400    | —                         |

The line heights work out to 1.5–1.75 × the font size.

### Layout

| Item                     | Desktop                                    | Mobile                                   |
| ------------------------ | ------------------------------------------ | ---------------------------------------- |
| Frame width              | 1480                                       | 390                                      |
| Container width          | 1376 (52 px side margins)                  | 342 (24 px margins; some sections 20 px) |
| Inner content width      | 1336 (20 px inner padding)                 | 342                                      |
| Section vertical padding | 60 px (most sections)                      | 48–56 px                                 |
| Card grid gap            | 24 px (product cards), 16 px (collections) | 12 px                                    |

### Components

| Component                      | Figma values                                                                              |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| Primary button                 | bg `#176BB0`, text `#FFFFFF`, no border, radius **12**, padding 13 × 28, Cairo 600 16/26  |
| Secondary button               | bg `#FFFFFF`, text `#176BB0`, border **1.5 px** `#60C1E1`, radius **12**                  |
| Hero button (section-specific) | bg white, radius 10, text uses the brand gradient                                         |
| Input                          | bg `#FFFFFF`, border 1 px `#DCF2FB`, radius **12**, padding 13 × 16, text `#5A5A59` 14/24 |
| Product card                   | bg white, border 1 px `#EFEDED`, radius **20**, image top corners 16, padding 12, gap 14  |
| Badge: best seller (on image)  | bg `#176BB0`, text white, radius **8**, padding 4 × 12, Cairo 600 12/18                   |
| Badge: discount (price row)    | bg `#F0FAFE`, border 1 px `#DCF2FB`, text `#176BB0`, radius 8                             |
| Logo                           | Desktop 184 × 37.18, mobile 138 × 27.89, footer 186 × 45                                  |

---

## 2. Applied Changes

All changes are in `config/settings_data.json` → `current`. Every value was checked against the type, options and range in `config/settings_schema.json`.

| Setting                               | Previous Value      | New Value                                 | Figma Source                                                                         | Status                                |
| ------------------------------------- | ------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------- |
| `color_palette.foreground`            | `#000000`           | `#131311`                                 | `--color-text-primary`                                                               | ✅ Exact                              |
| `color_palette.color1`                | `#333333`           | `#5A5A59`                                 | `--color-text-secondary` (feeds input text)                                          | ✅ Exact                              |
| `color_palette.color2`                | `#DFDFDF`           | `#DCF2FB`                                 | `--color-border-default` (feeds input, drawer, popover, variant and divider borders) | ✅ Exact                              |
| `color_palette.color3`                | — (new)             | `#176BB0`                                 | `--color-brand-secondary` / `--color-text-link`                                      | ✅ Added                              |
| `color_palette.color4`                | — (new)             | `#60C1E1`                                 | `--color-brand-primary` / `--color-border-strong`                                    | ✅ Added                              |
| `color_palette.color5`                | — (new)             | `#F0FAFE`                                 | `--color-background-secondary`                                                       | ✅ Added                              |
| `color_palette.color6`                | — (new)             | `#12568D`                                 | `--color-state-hover` (available to sections)                                        | ✅ Added                              |
| `type_size_paragraph`                 | `14`                | `16`                                      | Desktop/Body 16                                                                      | ✅ Exact (desktop)                    |
| `type_size_h1`                        | `56`                | `40`                                      | Desktop/H1 40                                                                        | ✅ Exact (desktop)                    |
| `type_size_h2`                        | `48`                | `32`                                      | Desktop/H2 32                                                                        | ✅ Exact (desktop)                    |
| `type_size_h3`                        | `32`                | `24`                                      | Desktop/H3 24                                                                        | ✅ Exact                              |
| `type_size_h4`                        | `24`                | `20`                                      | Desktop/H4 20                                                                        | ✅ Exact (desktop)                    |
| `type_accent_font`                    | `inter_n7`          | `inter_n6`                                | Weight 600 for H2–H4 and buttons (see note)                                          | ✅ Weight only                        |
| `type_font_h2`                        | `heading`           | `accent`                                  | H2 weight 600                                                                        | ✅                                    |
| `type_font_h3`                        | `heading`           | `accent`                                  | H3 weight 600                                                                        | ✅                                    |
| `type_font_h4`                        | `heading`           | `accent`                                  | H4 weight 600                                                                        | ✅                                    |
| `type_font_button_primary`            | unset (`body`, 400) | `accent`                                  | Button CTA weight 600                                                                | ✅                                    |
| `type_font_button_secondary`          | unset (`body`, 400) | `accent`                                  | Button CTA weight 600                                                                | ✅                                    |
| `palette_primary_button_background`   | `{{ …foreground }}` | `{{ settings.color_palette.color3 }}`     | `#176BB0`                                                                            | ✅ Exact                              |
| `palette_primary_button_border`       | `{{ …foreground }}` | `{{ settings.color_palette.color3 }}`     | Same as fill (no visible border)                                                     | ✅                                    |
| `button_border_radius_primary`        | `14`                | `12`                                      | Button radius 12                                                                     | ✅ Exact                              |
| `palette_secondary_button_background` | `rgba(0,0,0,0)`     | `{{ settings.color_palette.background }}` | `#FFFFFF`                                                                            | ✅ Exact                              |
| `palette_secondary_button_text`       | `{{ …foreground }}` | `{{ settings.color_palette.color3 }}`     | `#176BB0`                                                                            | ✅ Exact                              |
| `palette_secondary_button_border`     | `{{ …foreground }}` | `{{ settings.color_palette.color4 }}`     | `#60C1E1`                                                                            | ✅ Exact (width approximated, see §4) |
| `button_border_radius_secondary`      | `14`                | `12`                                      | Button radius 12                                                                     | ✅ Exact                              |
| `inputs_border_radius`                | `4`                 | `12`                                      | Input radius 12                                                                      | ✅ Exact                              |
| `badge_corner_radius`                 | `100`               | `8`                                       | Badge radius 8                                                                       | ✅ Exact                              |
| `badge_sale_background_color`         | `{{ …background }}` | `{{ settings.color_palette.color5 }}`     | Discount badge `#F0FAFE`                                                             | ✅ Exact                              |
| `badge_sale_text_color`               | `{{ …foreground }}` | `{{ settings.color_palette.color3 }}`     | Discount badge text `#176BB0`                                                        | ✅ Exact                              |
| `badge_font_family`                   | unset (`body`, 400) | `accent`                                  | Label Overline weight 600                                                            | ✅                                    |
| `logo_height`                         | `36`                | `37`                                      | Desktop logo height 37.18                                                            | ✅ Rounded to 1 px                    |

That is 25 setting keys. `color_palette` counts as one key with seven values changed or added.

**Font weight note.** Cairo's integration is unchanged. `snippets/custom-font.liquid` still renders right after `theme-styles-variables` in `layout/theme.liquid`, so `--font-body/heading/subheading/accent--family` all stay `'Cairo', sans-serif`. Horizon takes each font's **weight** from the font picker's variant (`--font-accent--weight: {{ settings.type_accent_font.weight }}`). Switching the accent picker from Inter 700 to Inter 600 changes only that weight variable. The family is still overridden to Cairo, and the unused Inter `@font-face` is never downloaded. No section or block uses `accent` as its default, so the change only reaches the presets and buttons pointed at it above.

Resulting weights:

- H1 → `heading` = 700 ✅
- H2–H4 → `accent` = 600 ✅
- Body = 400 ✅
- Subheading = 500, matching Navigation ✅
- Buttons → 600 ✅
- Badges → 600 ✅

---

## 3. Unchanged Settings (already matching or intentionally kept)

| Setting                                                                                              | Value                          | Reason                                                                                         |
| ---------------------------------------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------- |
| `color_palette.background`, `page_background_color`                                                  | `#ffffff` / palette background | Matches `--color-background-primary`                                                           |
| `page_text_color`                                                                                    | palette foreground             | Now resolves to `#131311`                                                                      |
| `palette_primary_button_text`                                                                        | palette background (`#FFFFFF`) | Matches `--color-text-on-brand`                                                                |
| `primary_button_border_width`                                                                        | `0`                            | Figma primary button has no border                                                             |
| `palette_input_background` / `_text` / `_border`                                                     | background / color1 / color2   | Now resolve to `#FFFFFF` / `#5A5A59` / `#DCF2FB`                                               |
| `input_border_width`                                                                                 | `1`                            | Matches 1 px                                                                                   |
| `type_body_font` (`inter_n4`), `type_heading_font` (`inter_n7`), `type_subheading_font` (`inter_n5`) | —                              | Supply weights 400 / 700 / 500 for Cairo; families are overridden by the Cairo snippet         |
| `type_font_h1`                                                                                       | `heading`                      | Weight 700 matches                                                                             |
| `type_letter_spacing_h1…h6`                                                                          | `heading-normal` (0 em)        | Figma letter-spacing is 0 everywhere                                                           |
| `type_case_h1…h6`                                                                                    | `none`                         | No uppercase in Figma                                                                          |
| `type_line_height_paragraph`                                                                         | `body-loose` (1.6)             | Closest option to Figma's 1.75                                                                 |
| `page_width`                                                                                         | `narrow` (1440 px max content) | Closest to Figma's 1376 px container; `normal` (1920) and `wide` (2400) are much wider         |
| `badge_position`                                                                                     | `top-right`                    | Uses `inset-inline-end`, so in RTL it renders top-left, matching Figma                         |
| `badge_text_transform`                                                                               | `none`                         | Matches                                                                                        |
| `logo_height_mobile`                                                                                 | `28`                           | Matches 27.89                                                                                  |
| `drawer_*`, `popover_*` colors                                                                       | palette refs                   | Follow the new palette; no Figma design for drawers or popovers                                |
| `type_size_h5`, `type_size_h6` and their font, line-height and case settings                         | 14 / 12, subheading            | Figma has no H5 or H6 style, so there is nothing to map                                        |
| `card_hover_effect`, animations, quick add, swatches, variant pickers, cart, prices                  | unchanged                      | No Figma source on the homepage frames                                                         |
| `card_corner_radius`, `product_corner_radius`                                                        | `4`, `0`                       | These only affect **search results** cards (`snippets/search-modal.liquid`), not product cards |
| `pills_border_radius`, `popover_border_radius`                                                       | unchanged                      | No unambiguous Figma source                                                                    |

---

## 4. Unsupported Settings (manual review needed)

| #   | Figma value                                                                    | Closest native option                                                                                        | Difference                                                                                                                                                                                   | Action                                                                                                                                                                                                   |
| --- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Heading line heights** 1.5–1.7 (e.g. H1 40/64, H2 32/52, H3 24/40, H4 20/34) | `display-loose` = 1.2 (options are 1.0 / 1.1 / 1.2)                                                          | Much tighter than Figma. Arabic text with Cairo needs the taller leading.                                                                                                                    | **Not changed** (current: H1/H2/H4 `display-tight` 1.0, H3 `display-normal` 1.1). Needs the user's decision. Setting all four to `display-loose` is the nearest native option; matching Figma needs CSS. |
| 2   | **Mobile type scale**: H1 28, H2 24, H4 18, Body 15, Body Small 13             | None                                                                                                         | Horizon only scales sizes ≥ 48 px with screen width (`fluid_size_cutoff = 48`). Every size now set is below 48, so mobile shows the desktop size (H1 40 instead of 28, H2 32 instead of 24). | Needs a responsive override later, or per-block mobile sizes                                                                                                                                             |
| 3   | **Display Hero 56/84** desktop → 28/44 mobile                                  | `h1` preset                                                                                                  | Global H1 follows Figma H1 = 40. The hero's 56 is a one-off.                                                                                                                                 | Set in the hero section (see §5)                                                                                                                                                                         |
| 4   | **Secondary button border 1.5 px**                                             | `secondary_button_border_width` 1 or 2 (step 1)                                                              | 0.5 px thinner or thicker                                                                                                                                                                    | Kept at **1**                                                                                                                                                                                            |
| 5   | **Button hover `#12568D`** (darker)                                            | None. Horizon computes hover automatically (`util-palette-hover-shift`); for `#176BB0` it **lightens** by 5% | Hover gets lighter instead of darker                                                                                                                                                         | Needs CSS if the exact hover matters. `#12568D` is stored in the palette as `color6` for later use.                                                                                                      |
| 6   | **Badge text 12 px**                                                           | None; badge size is fixed at `--font-size--xs` (13 px)                                                       | 1 px larger                                                                                                                                                                                  | Accepted (no setting)                                                                                                                                                                                    |
| 7   | **Discount badge 1 px `#DCF2FB` border**                                       | None                                                                                                         | Border missing                                                                                                                                                                               | Needs CSS                                                                                                                                                                                                |
| 8   | **"Best seller" badge** (`#176BB0` / white)                                    | None; Horizon only has _Sale_ and _Sold out_ badges                                                          | Separate badge type                                                                                                                                                                          | Mapped Sale → Figma's discount style; best-seller needs custom work                                                                                                                                      |
| 9   | **Page margins** 52 px desktop / 24 px mobile                                  | Hardcoded in `assets/base.css` (40 px / 16 px)                                                               | 12 px / 8 px narrower                                                                                                                                                                        | No setting; needs CSS if required                                                                                                                                                                        |
| 10  | **Body line height 1.75**                                                      | `body-loose` 1.6                                                                                             | About 2.4 px shorter per line at 16 px                                                                                                                                                       | Kept at closest                                                                                                                                                                                          |
| 11  | **Shadow/Soft** `0 12px 32px #0F64A81A`                                        | `popover_drop_shadow` only (popovers)                                                                        | No global card shadow setting                                                                                                                                                                | Section- or CSS-level                                                                                                                                                                                    |
| 12  | **Gradient/Brand** text gradient                                               | None                                                                                                         | —                                                                                                                                                                                            | Section-level                                                                                                                                                                                            |

---

## 5. Section-Specific Values (configure later at section or block level)

| Area                                     | Figma values                                                                                                                                                                                                                                                   |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Announcement bar                         | Height 44                                                                                                                                                                                                                                                      |
| Header                                   | Desktop height 88, logo centered, icons 22 px with 22 px gap. Navigation row 43 px high, Cairo 500 15/24. Mobile header height 64.                                                                                                                             |
| Hero                                     | Display heading 56/84 (mobile 28/44), subtitle Body Large 18/32. White button with radius 10 and gradient text. Spec chips 34 px high. Overline pill 34 px high, 12/18 600.                                                                                    |
| Section headings                         | H2 32/52 centered, subtitle Body Large 18/32. Heading block 90 px tall incl. subtitle; 40 px gap to content.                                                                                                                                                   |
| Section spacing                          | 60 px top/bottom on desktop, 48–56 px on mobile                                                                                                                                                                                                                |
| Product card (product-card block / grid) | Radius 20, border 1 px `#EFEDED`, image top corners 16, padding 12, gap 14 (text gap 6). Title 16/27 600 `#12568D`. Description 14/24 `#5A5A59`. Price 18/28 700 `#12568D`. Struck-through price 14/22 `#5A5A59`. Card width 316, gap 24 (mobile 165, gap 12). |
| Collection cards                         | 292 × 368 desktop, 97 × 152 mobile; carousel arrows 44 px                                                                                                                                                                                                      |
| F1 banner                                | Heading H1 40/64 (mobile 24/38), product tag pill 32 px, CTA 157 × 54                                                                                                                                                                                          |
| Bundle                                   | Full-width primary button 52 px high; price row badge                                                                                                                                                                                                          |
| Footer                                   | Logo height 45. Newsletter input radius 12 + button. Group titles 18/27 600. Links 16/24. Divider 1 px.                                                                                                                                                        |
| Mobile carousels                         | Progress bar 4 px high                                                                                                                                                                                                                                         |

Color tokens for sections are in the palette: `color3` brand blue, `color4` light brand blue / strong border, `color5` tinted background, `color6` hover / title blue.

---

## 6. Validation Results

### Code-level (done)

| Check                                                                       | Result                                                                                                                                                                                                  |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JSON syntax (`settings_data.json`)                                          | ✅ Parses                                                                                                                                                                                               |
| Each changed setting's type, option list or range vs `settings_schema.json` | ✅ 25 / 25 valid, 0 invalid                                                                                                                                                                             |
| `presets` block unchanged                                                   | ✅ Identical to the backup                                                                                                                                                                              |
| Keys removed from `current`                                                 | ✅ None                                                                                                                                                                                                 |
| Settings changed outside the list in §2                                     | ✅ None (diffed against the backup)                                                                                                                                                                     |
| Shopify Theme Check (CLI 4.9.4)                                             | ✅ No new offenses. The same 9 pre-existing offenses remain in untouched stock files: 2 `UnknownFilter` errors (`blocks/disclosures.liquid`, `snippets/cart-disclosure-tooltip.liquid`) and 7 warnings. |
| Cairo integration                                                           | ✅ `custom-font` still renders after `theme-styles-variables` (`layout/theme.liquid` lines 24–25); snippet unchanged                                                                                    |
| Contrast (WCAG AA)                                                          | ✅ White on `#176BB0` ≈ 5.5:1. `#176BB0` on `#F0FAFE` ≈ 5.2:1. `#5A5A59` on white ≈ 6.9:1.                                                                                                              |

### Browser / visual

Done afterwards on the development preview; see **§8 Visual Validation**.

---

## 7. Final Summary

| Metric                                                       | Count                                                                 |
| ------------------------------------------------------------ | --------------------------------------------------------------------- |
| Global settings in the installed schema                      | **133** (all reviewed)                                                |
| Settings modified                                            | **25 keys** (incl. `color_palette` with 3 values changed and 4 added) |
| Relevant settings already matching or kept at closest option | **20**                                                                |
| Items needing manual review / later implementation           | **12** (§4)                                                           |
| Files modified in this task                                  | `config/settings_data.json` only                                      |

**Unresolved issues**

1. Heading line heights. Horizon's maximum is 1.2, Figma uses 1.5–1.7. This needs a decision (`display-loose` or a CSS override).
2. No separate mobile type scale for sizes under 48 px.
3. Button hover gets lighter instead of Figma's darker `#12568D`.
4. Discount badge border and the best-seller badge style need custom work.
5. Page margins (52 / 24 px) are hardcoded in CSS.
6. Changing `color2` to `#DCF2FB` also recolors existing template references: product and header/footer dividers, footer and password input borders, **and the cart template's `background_color`** (`templates/cart.json`). Check the cart page background.
7. ~~Browser preview and visual comparison are still needed.~~ Done; see §8.

---

## 8. Visual Validation (development preview)

### 8.1 Environment

| Item                       | Value                                                                                                                                                                                                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Store (CLI)                | `internal-zt-yzyuhhfk.myshopify.com`                                                                                                                                                                                                                                                                                                  |
| Theme previewed            | **Development (8ed237-DESKTOP-FP21D0B)**, `#168066810072`, role `development`                                                                                                                                                                                                                                                         |
| Live theme                 | "Horizon" `#168065859800`. **Not touched.**                                                                                                                                                                                                                                                                                           |
| Preview server             | `http://127.0.0.1:9292`. A `shopify theme dev` session was **already running** on this port for the same development theme, so I used it rather than start a second one. I confirmed it serves the new settings (e.g. `--color-primary-button-background: rgb(23 107 176)`, `--font-accent--weight: 600`, `--font-size--h1: 2.5rem`). |
| Browser                    | Microsoft Edge (headless Chromium) via `puppeteer-core`, run from the scratchpad. Computed styles were read with `getComputedStyle`. **Rendered fonts** come from DevTools `CSS.getPlatformFontsForNode`, which reports the font actually used to draw the glyphs.                                                                    |
| Viewports                  | Desktop 1480 × 900 (Figma desktop width). Mobile 390 × 844 @2x (Figma mobile width).                                                                                                                                                                                                                                                  |
| Pages                      | `/` (home), `/cart`, `/collections/all`                                                                                                                                                                                                                                                                                               |
| No push / publish / commit | Confirmed                                                                                                                                                                                                                                                                                                                             |

**Limits of the store content (affects what can be compared):**

- The storefront is **English and LTR only**: `<html lang="en" dir="ltr">` and `/ar` returns 404. No Arabic locale is published.
- The store has **no products** (`/collections/all` shows "No products found."). The homepage still uses Horizon's default placeholder content (stock hero, placeholder product cards). The Figma homepage sections aren't built yet.
- So a side-by-side page comparison with Figma isn't meaningful yet. Instead I validated the **global tokens**: computed values on real theme elements, plus a temporary Arabic RTL sample injected **in the headless browser only**. The sample uses the theme's own classes (`h1`–`h4`, `.paragraph`, `.button`, `.button-secondary`, `input`, `.product-badges__badge.color-custom-badge-sale`). No theme file was changed for this.

### 8.2 Screenshots

All in `docs/figma-validation/`:

| File                                                        | Content                                                                                                                                  |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `figma-desktop-reference.png`                               | Figma desktop homepage (190:3767), downscaled                                                                                            |
| `desktop_.png`, `mobile_.png`                               | Storefront homepage (placeholder content), full page                                                                                     |
| `desktop_cart.png`, `mobile_cart.png`                       | Empty cart page. The "Continue shopping" button appears in its **hover** state because the script hovered it to measure the hover color. |
| `desktop_collections_all.png`, `mobile_collections_all.png` | Collection page (empty)                                                                                                                  |
| `arabic-desktop.png`, `arabic-mobile.png`                   | Injected Arabic RTL sample: H1–H4, paragraph, primary and secondary buttons, input, sale badge                                           |

### 8.3 Checks: passed / failed

| #   | Check                                                                                                               | Figma                                                                               | Storefront (measured)                                                                                                                                         | Result                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1   | Font files load                                                                                                     | Cairo WOFF2                                                                         | `cairo-latin-400/500/600/700` + `cairo-arabic-400/600/700`, all `200 font/woff2`. **No Inter file requested.** Only the files for weights in use are fetched. | ✅ Pass                                                                               |
| 2   | Rendered font, Latin                                                                                                | Cairo                                                                               | DevTools platform font: `Cairo` / `Cairo SemiBold` on headings, paragraphs and buttons (desktop + mobile)                                                     | ✅ Pass                                                                               |
| 3   | Rendered font, Arabic                                                                                               | Cairo                                                                               | `Cairo` (H1, paragraph) and `Cairo SemiBold` (H2–H4, buttons, badge); the Arabic subset files are fetched only when Arabic text is present                    | ✅ Pass                                                                               |
| 4   | Font CSS variables                                                                                                  | Cairo                                                                               | `--font-body/heading/accent--family: 'Cairo', sans-serif` (Cairo snippet wins over Horizon's Inter values)                                                    | ✅ Pass                                                                               |
| 5   | Text color                                                                                                          | `#131311`                                                                           | `rgb(19,19,17)`                                                                                                                                               | ✅ Pass                                                                               |
| 6   | Page background                                                                                                     | `#FFFFFF`                                                                           | `rgb(255,255,255)`                                                                                                                                            | ✅ Pass                                                                               |
| 7   | H1 desktop size / weight                                                                                            | 40 / 700                                                                            | 40px / 700                                                                                                                                                    | ✅ Pass                                                                               |
| 8   | H2 desktop size / weight                                                                                            | 32 / 600                                                                            | 32px / 600                                                                                                                                                    | ✅ Pass                                                                               |
| 9   | H3 size / weight                                                                                                    | 24 / 600                                                                            | 24px / 600                                                                                                                                                    | ✅ Pass                                                                               |
| 10  | H4 desktop size / weight                                                                                            | 20 / 600                                                                            | 20px / 600                                                                                                                                                    | ✅ Pass                                                                               |
| 11  | Body desktop size / weight                                                                                          | 16 / 400                                                                            | 16px / 400                                                                                                                                                    | ✅ Pass                                                                               |
| 12  | Body line height                                                                                                    | 1.75 (28px)                                                                         | 1.6 (25.6px)                                                                                                                                                  | ⚠️ Close (native max)                                                                 |
| 13  | **Heading line heights**                                                                                            | H1 1.6, H2 1.625, H3 1.667, H4 1.7                                                  | H1 **1.0**, H2 **1.0**, H3 **1.1**, H4 **1.0**                                                                                                                | ❌ Fail. Wrapped Arabic headings on mobile are visibly cramped (`arabic-mobile.png`). |
| 14  | **Mobile H1 / H2 / H4 / body**                                                                                      | 28 / 24 / 18 / 15                                                                   | **40 / 32 / 20 / 16** (same as desktop)                                                                                                                       | ❌ Fail                                                                               |
| 15  | Primary button                                                                                                      | `#176BB0`, white text, radius 12, 600                                               | `rgb(23,107,176)`, white, 12px, 600, Cairo SemiBold                                                                                                           | ✅ Pass                                                                               |
| 16  | **Primary button hover**                                                                                            | `#12568D` (darker)                                                                  | `#1A79C7` (lighter)                                                                                                                                           | ❌ Fail                                                                               |
| 17  | Secondary button                                                                                                    | white bg, `#176BB0` text, `#60C1E1` border, radius 12                               | white, `rgb(23,107,176)`, 1px `#60C1E1` (drawn as inset `box-shadow`), 12px, 600                                                                              | ✅ Pass (border 1px vs Figma 1.5px)                                                   |
| 18  | Button padding                                                                                                      | 13 × 28                                                                             | 16 × 32 (Horizon default)                                                                                                                                     | ⚠️ Minor; no global setting                                                           |
| 19  | Input                                                                                                               | white bg, 1px `#DCF2FB`, radius 12                                                  | white, 1px `rgb(220,242,251)`, 12px                                                                                                                           | ✅ Pass                                                                               |
| 20  | Input placeholder color                                                                                             | `#5A5A59`                                                                           | `rgb(90,90,89)` with Horizon's muted opacity                                                                                                                  | ✅ Pass                                                                               |
| 21  | Sale badge                                                                                                          | bg `#F0FAFE`, text `#176BB0`, radius 8, 600, 12px                                   | `rgb(240,250,254)`, `rgb(23,107,176)`, 8px, 600, **13px**                                                                                                     | ✅ Pass (size 13 vs 12; no border)                                                    |
| 22  | Badge position in RTL                                                                                               | Visual top-left                                                                     | `top-right` → `inset-inline-end` → left in RTL                                                                                                                | ✅ Pass (by CSS; needs a real sale product to see)                                    |
| 23  | **Page margins**                                                                                                    | Desktop: content 72px from edge (52 container + 20 inner), 1336 wide. Mobile: 24px. | Desktop: content 40px from edge, 1400 wide (`--page-margin: 40px`, `page-width-narrow`). Mobile: 16px.                                                        | ❌ Fail (32px desktop, 8px mobile)                                                    |
| 24  | Product card radius                                                                                                 | 20, border 1px `#EFEDED`                                                            | 0 (placeholder cards, block default)                                                                                                                          | ❌ Not set yet (block-level setting exists; see 8.4)                                  |
| 25  | Borders / dividers (`color2`)                                                                                       | `#DCF2FB`                                                                           | Header divider and footer input border show light blue                                                                                                        | ✅ Pass                                                                               |
| 26  | **Cart order-summary background** (`templates/cart.json` → `background_color: {{ settings.color_palette.color2 }}`) | Not designed                                                                        | Can't render: the cart is empty and the store has no products. By value it is now `#DCF2FB` (was `#DFDFDF` gray). Cart page body is white.                    | ⚠️ Unverified visually                                                                |
| 27  | Third-party font                                                                                                    | —                                                                                   | `GTStandard-MMedium.woff2` is loaded by Shopify's own account/sign-in web component (Shopify-hosted, outside the theme)                                       | ℹ️ Not a theme issue                                                                  |

**Summary:** 19 passed (5 with minor differences), 5 failed, 1 not configured yet, 1 unverified, 1 informational.

### 8.4 The five issues: native setting or scoped CSS?

**1. H1 / H2 mobile sizes don't match (40 → 28, 32 → 24; also H4 20 → 18, body 16 → 15)**

- **Native?** No.
  - `snippets/theme-styles-variables.liquid` only makes sizes scale with screen width when they are **≥ 48px** (`fluid_size_cutoff = 48`). Smaller sizes are output as fixed `rem` values.
  - Even raising H1 to 48 would not help. It would become `clamp(36px, 4.8vw, 48px)`: a 36px mobile minimum (Figma 28) and 48px on desktop (Figma 40).
  - There is no separate mobile size setting.
- **Needs scoped CSS.** Override the generated size variables on mobile, in a snippet rendered **after** `theme-styles-variables` (the existing `snippets/custom-font.liquid` position, or a new `snippets/custom-type-scale.liquid` rendered next to it):
  ```css
  @media screen and (max-width: 749px) {
    :root {
      --font-size--h1: 1.75rem; /* 28 */
      --font-size--h2: 1.5rem; /* 24 */
      --font-size--h4: 1.125rem; /* 18 */
      --font-size--paragraph: 0.9375rem; /* 15 */
    }
  }
  ```
  The presets (`--font-h1--size: var(--font-size--h1)`, etc.) pick this up automatically, so it reaches every place that uses the preset.
- **Hero Display 56 → 28:** section-level. Set the hero heading block to a custom size, or apply the same media-query approach scoped to the hero section.

**2. Arabic heading line heights too small (1.0–1.1 vs 1.6–1.7)**

- **Native?** Partly. `type_line_height_h1…h4` only offers `display-tight / normal / loose` = 1.0 / 1.1 / 1.2.
  - Recommended interim global correction: set all four to `display-loose`. This is the nearest native value and reduces Arabic crowding, but it is still well short of Figma.
  - Left unchanged pending your decision, per the "no material approximation" rule.
- **Needs scoped CSS** to match Figma. Override the preset variables (same snippet as above, after `theme-styles-variables`):
  ```css
  :root {
    --font-h1--line-height: 1.6; /* 40/64 */
    --font-h2--line-height: 1.625; /* 32/52 */
    --font-h3--line-height: 1.667; /* 24/40 */
    --font-h4--line-height: 1.7; /* 20/34 */
    --font-paragraph--line-height: 1.75; /* 16/28 */
  }
  ```
  Overriding the `--font-hX--line-height` presets, rather than `--line-height--display-*`, avoids changing other components that use the display scale.

**3. Page margins (desktop 72 vs 40, mobile 24 vs 16; content width 1336 vs 1400)**

- **Native?** No.
  - `page_width` only switches between narrow / normal / wide (90 / 120 / 150rem). `narrow` is already the closest.
  - `--page-margin` is hardcoded in `assets/base.css` (lines ~277–291): 16px mobile, 40px from 750px up.
- **Needs scoped CSS** (don't edit `base.css`):
  ```css
  :root {
    --narrow-page-width: 83.5rem;
  } /* 1336 content, as in Figma */
  .page-width-narrow {
    --page-margin: max(
      24px,
      var(--safe-area-inset-left, 0px),
      var(--safe-area-inset-right, 0px)
    );
  }
  @media screen and (min-width: 750px) {
    .page-width-narrow {
      --page-margin: max(
        52px,
        var(--safe-area-inset-left, 0px),
        var(--safe-area-inset-right, 0px)
      );
    }
  }
  ```
  At 1480px this gives content from 72 to 1408px, matching Figma. Tablet widths (750–1440) aren't designed in Figma; confirm with the designer.

**4. Product card radius isn't global**

- **Native? Yes, at block level.** No CSS needed. The global `card_corner_radius` / `product_corner_radius` only style search results (`snippets/search-modal.liquid`).
- Configure in the product grid / featured collection sections:
  - **Product card** block (`blocks/_product-card.liquid`): `border_radius` = **20** (range 0–32), `border` = solid, `border_width` = **1**, `border_color` = `#EFEDED`.
  - **Card gallery** block (`blocks/_product-card-gallery.liquid`): `border_radius` = **16** for the image's top corners. Bottom corners need checking once real products exist; Figma rounds only the top.
- Card shadow (`Shadow/Soft`) has no native setting → scoped CSS if wanted.

**5. Button hover color (`#12568D` vs computed `#1A79C7`)**

- **Native?** No. `snippets/color-palette.liquid` calculates the hover color through `snippets/util-palette-hover-shift.liquid`. For mid-dark colors (brightness 41–128), which includes `#176BB0`, it **lightens** by 5%. There is no hover-color setting.
- **Needs scoped CSS**, rendered **after** `color-palette` in `layout/theme.liquid`, because that snippet sets the variable on `:root`:
  ```css
  :root {
    --color-primary-button-hover-background: {{ settings.color_palette.color6 }}; /* #12568D */
    --color-primary-button-hover-border: {{ settings.color_palette.color6 }};
  }
  ```
  `#12568D` is already in the palette as `color6`, so the snippet can output `{{ settings.color_palette.color6 }}` rather than a hardcoded hex. Don't edit `util-palette-hover-shift.liquid`; it drives every hover color in the theme.

### 8.5 Global settings that need correction

| Setting                             | Current                | Recommended                                       | Why                                                   |
| ----------------------------------- | ---------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| `type_line_height_h1`, `_h2`, `_h4` | `display-tight` (1.0)  | `display-loose` (1.2), **if accepted as interim** | Arabic headings are cramped; full fix is CSS (8.4 #2) |
| `type_line_height_h3`               | `display-normal` (1.1) | `display-loose` (1.2), same condition             | Same                                                  |

All 25 settings applied earlier rendered as intended. **No applied value needs reverting.**

### 8.6 Section-level implementation needed

- Product card: radius 20, 1px `#EFEDED` border, image radius 16 (native block settings; see 8.4 #4). Title color `#12568D` 16/27 600; price 18/28 700 `#12568D`.
- Hero: Display 56/84 → mobile 28/44, white button with radius 10 and gradient text, spec chips, overline pill.
- **Cart summary background** (`templates/cart.json` → `main-cart` summary block → `background_color: {{ settings.color_palette.color2 }}`). It now resolves to `#DCF2FB`, the border blue. Recommend switching it to `{{ settings.color_palette.color5 }}` (`#F0FAFE`, Figma's tinted background) when the cart section is designed. It was not changed in this task because template edits were out of scope.
- Newsletter input in the footer: the pill radius comes from the section, not the global 12; set it to 12 in the footer section.
- Every other item in §5.

### 8.7 Custom CSS needed (one scoped snippet, rendered after `color-palette`)

| Need                           | Variables to override                                                                                                      | Ref    |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------ |
| Mobile type scale              | `--font-size--h1/h2/h4/paragraph` inside `@media (max-width: 749px)`                                                       | 8.4 #1 |
| Heading and body line heights  | `--font-h1…h4--line-height`, `--font-paragraph--line-height`                                                               | 8.4 #2 |
| Page margins / container width | `--narrow-page-width`, `.page-width-narrow { --page-margin }`                                                              | 8.4 #3 |
| Button hover                   | `--color-primary-button-hover-background/-border`                                                                          | 8.4 #5 |
| Optional                       | Button padding 13 × 28 (`--button-padding-block/-inline`), secondary border 1.5px, badge border and 12px size, card shadow | §4     |

The recommended approach is one new snippet (e.g. `snippets/custom-design-tokens.liquid`) holding only variable overrides, no component selectors except `.page-width-narrow`. Render it right after `{%- render 'color-palette' -%}` in `layout/theme.liquid`. **Not implemented**, per this task's no-CSS rule.

### 8.8 Still unverified

- Real **Arabic storefront** (`dir="rtl"` set by an Arabic locale): needs the Arabic language added and published in Shopify Admin → Settings → Languages. RTL behavior was tested only with injected sample markup.
- **Cart order-summary background**: needs at least one product in the cart.
- **Product cards, sale badges and sold-out badges on real products**: the store has no products.
- **Tablet widths (750–1440px)**: no Figma frame.
- **Section-by-section comparison with the Figma homepage**: the sections aren't built yet.
- The Theme Editor showing "Inter Semibold" for the accent font was not checked. The storefront output (`--font-accent--weight: 600`) confirms the value is valid.

> **Update:** the issues in §8.4 #1–#5 were implemented in §9. Line heights were matched exactly in CSS, so the interim `display-loose` setting change in §8.5 is **not needed**.

---

## 9. Finalization: remaining differences implemented

This round implements four items: mobile heading sizes, heading line heights, page margins and primary button hover. Each needed a CSS-variable override because Horizon has no setting for it (§8.4). The product card styling uses **native block settings only**. All four overrides live in one new snippet. Validated on the same development preview (`#168066810072`, `http://127.0.0.1:9292`). Nothing was pushed, published or committed.

### 9.1 Files modified

| File                                                                                              | Change                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `snippets/custom-design-tokens.liquid`                                                            | **New.** The only CSS added. Overrides Horizon variables only (no component styling, no `!important`). Commented with its Figma sources.                                                  |
| `layout/theme.liquid`                                                                             | One line: `{%- render 'custom-design-tokens' -%}` added **after** `color-palette`. Load order is now `theme-styles-variables` → `custom-font` → `color-palette` → `custom-design-tokens`. |
| `templates/index.json`, `collection.json`, `search.json`, `product.json`, `cart.json`, `404.json` | Native settings on the `_product-card` block and on its `product-title` and `price` child blocks (9.3). Targeted text edits; the auto-generated header comments and formatting are kept.  |

**Unchanged:**

- `config/settings_data.json`: all 25 validated settings are still identical; diffed against the original backup, exactly 25 keys differ.
- `snippets/custom-font.liquid` (Cairo).
- `assets/base.css` and all sections, blocks and locales.

### 9.2 CSS variables and selectors overridden (`snippets/custom-design-tokens.liquid`)

| Selector                                                                        | Variable                                                                         | Value                                                                             | Figma source                             |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------- |
| `:root`                                                                         | `--font-h1--line-height`                                                         | `calc(64 / 40)` = 1.6                                                             | Desktop/H1 40/64                         |
| `:root`                                                                         | `--font-h2--line-height`                                                         | `calc(52 / 32)` = 1.625                                                           | Desktop/H2 32/52                         |
| `:root`                                                                         | `--font-h3--line-height`                                                         | `calc(40 / 24)` = 1.667                                                           | Desktop/H3 24/40                         |
| `:root`                                                                         | `--font-h4--line-height`                                                         | `calc(34 / 20)` = 1.7                                                             | Desktop/H4 20/34                         |
| `:root`                                                                         | `--color-primary-button-hover-background`, `--color-primary-button-hover-border` | `{{ settings.color_palette.color6 }}` (`#12568D`)                                 | `--color-state-hover`                    |
| `.button:is(:disabled, [aria-disabled='true'])`, `.button-custom:is(…)`         | same two variables                                                               | Horizon's own computed value via `util-palette-hover-shift` (`#1a79c7`)           | Keeps disabled buttons exactly as before |
| `@media screen and (max-width: 749px)` → `:root`                                | `--font-size--h1`                                                                | `1.75rem` (28px)                                                                  | Mobile/H1 28/44                          |
| ″                                                                               | `--font-size--h2`                                                                | `1.5rem` (24px)                                                                   | Mobile/H2 24/38                          |
| ″                                                                               | `--font-h1--line-height`                                                         | `calc(44 / 28)` ≈ 1.571                                                           | Mobile/H1                                |
| ″                                                                               | `--font-h2--line-height`                                                         | `calc(38 / 24)` ≈ 1.583                                                           | Mobile/H2                                |
| `.page-width-wide, .page-width-normal, .page-width-narrow, .page-width-content` | `--page-margin`                                                                  | `max(clamp(24px, calc(6.83px + 4.404vw), 72px), safe-area-left, safe-area-right)` | 24px @ 390, 72px @ 1480                  |

**Why these hooks:**

- Line heights override Horizon's per-preset `--font-hX--line-height` variables, not the shared `--line-height--display-*` scale, so other components using that scale are unaffected.
- The Theme Editor still controls family (Cairo via `custom-font`), weight, color, letter-spacing and case.
- `.button-secondary` uses its own `--color-secondary-button-hover-*` variables, which were not touched.
- `--page-margin` is overridden on the same classes, with the same safe-area handling, that `assets/base.css` uses (lines ~277–291). The snippet loads after `base.css`, so equal specificity is enough. `<body>` carries `page-width-narrow`, so the change reaches every section.

**Responsive behavior chosen for margins.** This interpolation is my assumption between the two Figma frames; no tablet frame exists. The margin grows in a straight line between Figma's two verified points: 24px at 390px and 72px at 1480px. It stays at 24px below 390px and at 72px from 1480px up. There is no jump at the 750px breakpoint (39.8px at 749 vs 39.9px at 750).

### 9.3 Product card: native settings changed

| Template → block                  | Setting                                              | Before          | After              |
| --------------------------------- | ---------------------------------------------------- | --------------- | ------------------ |
| `_product-card` (all 6 templates) | `border`                                             | `none`          | `solid`            |
| ″                                 | `border_width`                                       | `1`             | `1` (now visible)  |
| ″                                 | `border_color`                                       | unset / `""`    | `#efeded`          |
| ″                                 | `border_opacity`                                     | `100`           | `100`              |
| ″                                 | `border_radius`                                      | `0`             | `20`               |
| `product-title` inside the card   | `padding-inline-start` / `-end`                      | `0` / `0`       | `12` / `12`        |
| `price` inside the card           | `padding-inline-start` / `-end`, `padding-block-end` | `0` / `0` / `0` | `12` / `12` / `12` |

Instances changed:

- homepage `product-list`
- `main-collection`
- `search-results`
- `product-recommendations` (product page)
- cart `product-list`
- 404 `product-list`

**Why title and price padding.** Adding the border and 20px radius on their own made the text sit against the card edge, and the corner clipped the start of the price ("LE 19.99" showed as "E 19.99"). Figma insets the card text by 12px and keeps the image flush (`Text` frame `px-12 pb-12`). The native padding settings on the title and price blocks reproduce this without CSS; the image stays edge-to-edge and is clipped to the 20px corners by the card's `overflow: clip`.

### 9.4 Before / after measurements (headless Edge, development preview)

**Typography.** Arabic RTL sample using the theme's `h1`–`h4`; real headings confirm the same variables.

| Element       | Figma                 | Before (desktop) | After (desktop 1480)                                                              | Before (mobile) | After (mobile 390) | Result                                |
| ------------- | --------------------- | ---------------- | --------------------------------------------------------------------------------- | --------------- | ------------------ | ------------------------------------- |
| H1            | 40/64 · mobile 28/44  | 40/40 (1.0)      | **40/64 (1.6)**                                                                   | 40/40           | **28/44 (1.571)**  | ✅                                    |
| H2            | 32/52 · mobile 24/38  | 32/32 (1.0)      | **32/52 (1.625)**                                                                 | 32/32           | **24/38 (1.583)**  | ✅                                    |
| H3            | 24/40                 | 24/26.4 (1.1)    | **24/40 (1.667)**                                                                 | 24/26.4         | **24/40**          | ✅ (no mobile H3 in Figma)            |
| H4            | 20/34 · mobile 18/30  | 20/20 (1.0)      | **20/34 (1.7)**                                                                   | 20/20           | 20/34              | ✅ desktop / ⚠️ mobile size (see 9.6) |
| Weights       | 700 / 600 / 600 / 600 | same             | 700 / 600 / 600 / 600                                                             | same            | same               | ✅ unchanged                          |
| Rendered font | Cairo                 | Cairo            | `Cairo` / `Cairo SemiBold` (DevTools platform fonts), Latin and Arabic WOFF2 only | same            | same               | ✅                                    |

**Page margins** (content edge of a page-width section; homepage "Products" heading):

| Viewport | Before             | After                 | Figma             | Overflow | Full-width sections span viewport |
| -------- | ------------------ | --------------------- | ----------------- | -------- | --------------------------------- |
| 360      | 16                 | **24**                | —                 | none     | ✅                                |
| 390      | 16                 | **24**                | 24                | none     | ✅                                |
| 600      | 16                 | 33                    | —                 | none     | ✅                                |
| 749      | 16                 | 40                    | —                 | none     | ✅                                |
| 750      | 40                 | 40                    | —                 | none     | ✅                                |
| 1024     | 40                 | 52                    | —                 | none     | ✅                                |
| 1280     | 40                 | 63                    | —                 | none     | ✅                                |
| 1480     | 40 (content 1400)  | **72 (content 1336)** | 72 (content 1336) | none     | ✅                                |
| 1920     | 240 (content 1440) | 240 (content 1440)    | —                 | none     | ✅                                |

**Buttons** (desktop; mobile identical):

| Button                                                      | Normal                   | Hover before                                | Hover after                                   | Result          |
| ----------------------------------------------------------- | ------------------------ | ------------------------------------------- | --------------------------------------------- | --------------- |
| Primary `.button`                                           | `#176BB0`, white text    | `#1A79C7`                                   | **`#12568D`**, white text                     | ✅              |
| Native cart "Continue shopping"                             | `#176BB0`                | `#1A79C7`                                   | **`#12568D`**                                 | ✅              |
| Secondary `.button-secondary`                               | white / `#176BB0`        | `#F2F2F2`                                   | `#F2F2F2` (unchanged)                         | ✅ not affected |
| `<button class="button" disabled>` / `aria-disabled="true"` | `#176BB0` at 50% opacity | `#1A79C7` at 50%                            | `#1A79C7` at 50% (unchanged)                  | ✅ not affected |
| Focus-visible                                               | —                        | outline from `--button-focus-outline-color` | `solid 1px #176BB0`, `:focus-visible` matched | ✅ unchanged    |

**Product card** (placeholder product cards; there is no real product data):

| Property    | Before                          | After                        | Figma         |
| ----------- | ------------------------------- | ---------------------------- | ------------- |
| Card radius | 0                               | 20px                         | 20            |
| Card border | none                            | 1px solid `rgb(239,237,237)` | 1px `#EFEDED` |
| Text inset  | 0 (price clipped at the corner) | 12px                         | 12            |

### 9.5 Visual checks

| Check                                            | Result                                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------- |
| Cairo still the rendered font (Latin and Arabic) | ✅ Pass                                                                         |
| Desktop typography sizes and weights unchanged   | ✅ Pass (H1 40, H2 32, H3 24, H4 20; 700/600)                                   |
| Mobile H1 28 and H2 24                           | ✅ Pass                                                                         |
| Heading line heights match Figma H1–H4           | ✅ Pass (desktop and mobile H1/H2)                                              |
| Page margins 72 desktop / 24 mobile              | ✅ Pass                                                                         |
| No horizontal overflow (360–1920)                | ✅ Pass                                                                         |
| Full-width sections still edge-to-edge           | ✅ Pass (hero, every `.section--full-width` = viewport width)                   |
| Primary hover `#12568D`, normal `#176BB0`        | ✅ Pass                                                                         |
| Secondary and disabled buttons unaffected        | ✅ Pass                                                                         |
| 25 global settings intact                        | ✅ Pass                                                                         |
| Theme Check                                      | ✅ No new offenses (same 9 pre-existing in stock files)                         |
| JSON templates valid                             | ✅ Pass (all six parse)                                                         |
| Product card radius and border                   | ✅ Rendered on **placeholder** cards only, not validated with real product data |

After-screenshots are in `docs/figma-validation/after/`:

- `home-1480-top.png`, `home-1024.png`, `home-390-top.png`
- `arabic-desktop.png`, `arabic-mobile.png`
- `buttons-hover-primary.png`
- `card-desktop.png`, `card-mobile.png`

### 9.6 Remaining deviations from Figma

| Item                                                               | Figma                       | Storefront                                                           | Why left                                                                                                                                                                                 |
| ------------------------------------------------------------------ | --------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile H4 size                                                     | 18/30                       | 20/34                                                                | Not in this task's scope (only H1 and H2 were requested). Two more variables in the same media query (`--font-size--h4: 1.125rem; --font-h4--line-height: calc(30 / 18);`) would fix it. |
| Body text                                                          | 16/28 desktop, 15/26 mobile | 16/25.6 both                                                         | Not requested; `--font-paragraph--line-height` and `--font-size--paragraph` could be added to the same snippet.                                                                          |
| Content width above 1480px                                         | Not designed                | Grows to Horizon's `narrow` maximum (1440 content)                   | Figma's 1336px content width at 1480 could be capped with `--narrow-page-width: 83.5rem`; left open because wider screens aren't designed.                                               |
| Product card image top corners                                     | 16 (inside a 20 card)       | Clipped by the card's 20px radius (about 19px inside the 1px border) | Visually equivalent; the gallery's own `border_radius` stays 0.                                                                                                                          |
| Card description, rating, CTA, title color `#12568D`, price 18/700 | Specified                   | Not set                                                              | Section-level work for the product grid sections.                                                                                                                                        |
| Secondary button border width                                      | 1.5px                       | 1px                                                                  | Native step is 1px (§4).                                                                                                                                                                 |
| Button padding                                                     | 13 × 28                     | 16 × 32                                                              | No global setting; not requested.                                                                                                                                                        |
| Badge 12px font and border                                         | 12px, 1px `#DCF2FB`         | 13px, none                                                           | No setting; not requested.                                                                                                                                                               |

### 9.7 Unverified

- **Product cards with real products:** the store has no products, so badges, sale prices and long titles inside the bordered card haven't been seen.
- **Real Arabic storefront** (`dir="rtl"` from an Arabic locale): RTL was tested with injected sample markup only, since `/ar` returns 404.
- **Cart order-summary background** (`color2` → `#DCF2FB`): needs items in the cart (§8.6).
- **Tablet range 750–1480px:** the linear margin interpolation is my choice; there is no Figma frame to compare against.
- **Real touch devices and Safari:** tested in headless Chromium (Edge) only.

> **Update:** §10 replaces the page-margin values from §9 (72px at 1480 / 1336px content). The desktop gutter is now 52px with a 1376px container.

---

## 10. Custom page width option: "Custom — 1376px"

### 10.1 Figma check

On the desktop frame (`190:3767`, 1480 wide), every section container is at **x = 52, width = 1376**: Header Container, Hero Container, Featured Container, Before/After, Reels, Care, Bundle, Blog, Why, FAQ, Footer. So **1376px is the content container, excluding the outer page margins (52px each side)**.

Several sections add a further **20px inner padding** inside that container, putting their content at 1336px (e.g. Featured "Product Row" x = 20, w = 1336). Others use the full 1376px (e.g. Collections "Section Heading" x = 52, w = 1376; header icons run to the container edge minus 20). That inner padding is per section, not global.

Mobile (`190:4082`, 390 wide): content sits at **x = 24, width = 342** in most sections (a few use 20).

### 10.2 How the setting reaches the page (before the change)

| Step | Where                                                 | What                                                                                                                                                                                                                                                              |
| ---- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `config/settings_schema.json` → `page_width` (select) | narrow / normal / wide                                                                                                                                                                                                                                            |
| 2    | `layout/theme.liquid` and `layout/password.liquid`    | `<body class="page-width-{{ settings.page_width }}">`                                                                                                                                                                                                             |
| 3    | `snippets/theme-styles-variables.liquid` (`:root`)    | `--narrow-page-width: 90rem`, `--normal-page-width: 120rem`, `--wide-page-width: 150rem`                                                                                                                                                                          |
| 4    | `assets/base.css` ~277–313                            | `.page-width-{narrow,normal,wide}` set `--page-content-width` and `--page-width`; the same classes set `--page-margin` (16 / 40px), now overridden in `custom-design-tokens`                                                                                      |
| 5    | `assets/base.css` `.section` grid                     | `grid-template-columns: minmax(margin, 1fr) min(page-width − 2·margin, 100% − 2·margin) minmax(margin, 1fr)`, so content is capped **and** centered, and `.section--full-width` spans all columns                                                                 |
| 6    | Liquid `case settings.page_width`                     | `snippets/background-media.liquid`, `snippets/util-mega-menu-img-sizes-attr.liquid`, `snippets/util-product-media-sizes-attr.liquid` build image `sizes` from the width. **A new value with no branch here would produce empty `rem` values and broken `sizes`.** |
| —    | JS                                                    | No JavaScript reads the page width                                                                                                                                                                                                                                |

### 10.3 Files modified

| File                                            | Change                                                                                                                                                                                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config/settings_schema.json`                   | `page_width` gets a 4th option `{ "value": "custom_1376", "label": "Custom — 1376px" }`. Narrow, Normal and Wide are unchanged; the schema default stays `narrow`. Plain-text label, because locale files are off-limits. |
| `config/settings_data.json`                     | `current.page_width`: `narrow` → **`custom_1376`**. The `Horizon` preset is untouched (`narrow`). The other 25 settings are unchanged.                                                                                    |
| `snippets/custom-design-tokens.liquid`          | Adds the `.page-width-custom_1376` width rule and the `--custom-1376-page-width` token, adds the class to the `--page-margin` rule, and re-tunes the gutter (10.4).                                                       |
| `snippets/background-media.liquid`              | `when 'custom_1376'` → `sizes = '(min-width: 1376px) 1376px, 100vw'`                                                                                                                                                      |
| `snippets/util-mega-menu-img-sizes-attr.liquid` | `when 'custom_1376'` → `page_max_width = '86rem'`, `breakpoint = '92.5rem'` (1376 + 2 × 52 = 1480px)                                                                                                                      |
| `snippets/util-product-media-sizes-attr.liquid` | `when 'custom_1376'` → `breakpoint = '92.5rem'`, equal columns `43rem` (½ × 86), unequal `61rem` (86 − 25, the same offset Horizon uses for narrow, normal and wide)                                                      |
| `layout/password.liquid`                        | `{%- render 'custom-design-tokens' -%}` after `color-palette`. This layout also outputs `page-width-{{ settings.page_width }}`; without the snippet the new class would have no width or margin there.                    |

**Not touched:**

- `assets/base.css` and `snippets/theme-styles-variables.liquid` (Horizon core files, so future Horizon updates apply cleanly)
- Cairo (`custom-font`)
- locales, sections, blocks and templates
- the typography, color and button tokens

The new width lives in `custom-design-tokens.liquid`, next to the `--page-margin` rule it depends on. That way the gutter is defined in one place and there are no competing global width or padding declarations.

### 10.4 CSS introduced or changed (`snippets/custom-design-tokens.liquid`)

```css
.page-width-wide,
.page-width-normal,
.page-width-narrow,
.page-width-custom_1376,
.page-width-content {
  --page-margin: max(
    clamp(24px, calc(13.98px + 2.569vw), 52px),
    var(--safe-area-inset-left, 0px),
    var(--safe-area-inset-right, 0px)
  );
}
:root {
  --custom-1376-page-width: 86rem;
} /* 1376px */
.page-width-custom_1376 {
  --page-content-width: var(--custom-1376-page-width);
  --page-width: calc(var(--page-content-width) + (var(--page-margin) * 2));
}
```

The `.page-width-custom_1376` rule mirrors Horizon's own `.page-width-narrow` (`--page-content-width` + `--page-width`), so every consumer of the section grid, `--util-page-margin-offset` and so on works unchanged.

**Resolving the margin conflict.** Figma has 1480 = 52 + 1376 + 52, so the earlier 72px desktop gutter could not stay; it would have capped content at 1336px. The gutter is now:

- 24px at ≤ 390px
- linear interpolation from 24px at 390px to 52px at 1480px: `24 + (100vw − 390px) × 28 / 1090`
- 52px from 1480px up

From 1480px up, the 1376px cap takes over and the extra space goes into the centered side columns.

### 10.5 Previous vs new behavior (homepage, page-width section content)

| Viewport | Previous (narrow 1440 cap, 72px gutter) | New (custom_1376, 52px gutter) |
| -------- | --------------------------------------- | ------------------------------ |
| 390      | 342 (24 / 24)                           | **342 (24 / 24)**              |
| 1024     | 920 (52 / 52)                           | 943.4 (40.3 / 40.3)            |
| 1480     | 1336 (72 / 72)                          | **1376 (52 / 52)**             |
| 1920     | 1440 (240 / 240)                        | **1376 (272 / 272)**           |

### 10.6 Measured container widths (`getBoundingClientRect()` on the widest centre-column child of `.section--page-width`)

The same values were measured on **all five pages tested**: `/`, `/collections/all`, `/cart`, `/search?q=shirt`, `/pages/contact`.

| Viewport     | Body class               | Content width               | Left gutter | Right gutter | RTL left / right | Full-width sections = viewport | Horizontal overflow (LTR / RTL) |
| ------------ | ------------------------ | --------------------------- | ----------- | ------------ | ---------------- | ------------------------------ | ------------------------------- |
| 390 (mobile) | `page-width-custom_1376` | 342                         | 24          | 24           | 24 / 24          | ✅                             | none / none                     |
| 750          | ″                        | 683.5                       | 33.3        | 33.3         | 33.3 / 33.3      | ✅                             | none / none                     |
| 1024         | ″                        | 943.4                       | 40.3        | 40.3         | 40.3 / 40.3      | ✅                             | none / none                     |
| 1376         | ″                        | 1277.3                      | 49.3        | 49.3         | 49.3 / 49.3      | ✅                             | none / none                     |
| 1440         | ″                        | 1338                        | 51          | 51           | 51 / 51          | ✅                             | none / none                     |
| **1480**     | ″                        | **1376**                    | **52**      | **52**       | 52 / 52          | ✅                             | none / none                     |
| **1920**     | ″                        | **1376 (capped, centered)** | 272         | 272          | 272 / 272        | ✅                             | none / none                     |

The homepage hero (`.section--full-width`) spans the full viewport at every width. Screenshots are in `docs/figma-validation/page-width/` (`home-390.png`, `home-1480.png`, `home-1920.png`; these were taken after switching to RTL).

**Existing options still work.** Measured by switching the `<body>` class in the browser only; settings were not changed.

| Option                  | Content @ 1480                       | Content @ 1920           |
| ----------------------- | ------------------------------------ | ------------------------ |
| narrow (90rem)          | 1376 (limited by viewport − gutters) | 1440, centered           |
| normal (120rem)         | 1376                                 | 1816 (viewport − 2 × 52) |
| wide (150rem)           | 1376                                 | 1816                     |
| **custom_1376 (86rem)** | **1376**                             | **1376, centered**       |

No option overflows at either width.

### 10.7 Theme Editor compatibility

- **Schema validity:** Theme Check reports no new offenses (the same 9 pre-existing ones in stock files). `settings_schema.json` parses, and the option has the standard `value` / `label` shape.
- **Accepted by Shopify:** the development theme was synced by the running `shopify theme dev`, and the storefront renders `<body class="page-width-custom_1376 …">`. Shopify validates `settings_data.json` against the schema on upload, so a rejected value would not have rendered.
- **Not verified:** **the dropdown in the Theme Editor UI**, and that selecting and saving each option works there. That needs an admin session, which the headless browser doesn't have. Check it manually: Online Store → Themes → Development (8ed237-DESKTOP-FP21D0B) → Customize → Theme settings → **Layout** (the group named `t:names.page_layout`) → Page width → expect Narrow / Normal / Wide / **Custom — 1376px**, with Custom selected.
- **Label language:** the option label is plain text ("Custom — 1376px"), not a `t:` translation key, because locale files were off-limits. It shows the same in every admin language.

### 10.8 Remaining issues and unverified items

- **Product template:** no products exist, so `/products/...` can't render. Its containers use the same section grid, but they weren't measured.
- **Image `sizes` branches:** the tested pages only show placeholder SVGs, so the three new `custom_1376` branches haven't run against real images yet. No broken `sizes` output was found on the tested pages.
- **Section-level inner padding:** many Figma sections add 20px inside the 1376px container (content 1336). That belongs to each section's padding settings when the sections are built.
- **Password page:** it now loads the design tokens, so the width and gutters work there. It still doesn't load the Cairo snippet (unchanged, per the "don't modify Cairo" rule).
- **Gutters between 750 and 1480px** are interpolated. No Figma tablet frame exists to confirm them.
