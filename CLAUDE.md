# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Snosha storefront: a **Shopify Horizon v4.4.0** theme (`config/settings_schema.json` → `theme_info`), customized to match a Figma design (file `1fqyznLFgS65tTjGvBYPBm`, desktop frame `190:3767` at 1480px, mobile frame `190:4082` at 390px). The design is Arabic/RTL-first with the **Cairo** font.

Full history of the design-foundation work, with measurements and open issues: `FIGMA_THEME_SETTINGS_REPORT.md`. Validation screenshots: `docs/figma-validation/`. Section-by-section Figma work follows the project skill `.claude/skills/horizon-figma-to-sections-workflow` (one section per task; it expects a `SNOSHA_PROJECT_PLAN.md`, which does not exist yet).

## Commands

No build step, package manager or test suite. Everything goes through Shopify CLI:

```sh
shopify theme info                 # shows the linked store and development theme
shopify theme list                 # roles: [live] / [unpublished] / [development]
shopify theme dev                  # local preview at http://127.0.0.1:9292, syncs to the development theme
shopify theme check --path .       # lint (Liquid, schema, JSON)
shopify theme check --path . --output json   # machine-readable, for per-file filtering
```

- Linked store: `internal-zt-yzyuhhfk.myshopify.com`. The development theme is `#168066810072`; the live theme is "Horizon". Confirm with `shopify theme info` before validating; the user may switch stores.
- A `theme dev` session is often **already running** on port 9292. Reuse it rather than starting a second one (that fails with `EADDRINUSE`). It hot-syncs local edits, including `config/*.json`.
- Theme Check baseline: 9 pre-existing offenses in stock Horizon files, which are not ours: 2 `UnknownFilter` errors for `applicable_disclosures`, plus warnings in `header.liquid`, `divider.liquid` and `product-media-gallery-content.liquid`. Anything beyond these is new.
- **Do not** `shopify theme push`, publish, commit or push unless explicitly asked.

## Architecture

### Rendering and JS
- Standard Online Store 2.0 layout: `layout/theme.liquid` (and a separate `layout/password.liquid`), JSON templates in `templates/*.json`, section groups in `sections/*-group.json`.
- Horizon builds pages from **theme blocks** (`blocks/`). Files prefixed `_` (e.g. `_product-card.liquid`) are private blocks that can only be nested inside specific parents. Content and per-instance styling (padding, borders, radius) live in block settings inside the JSON templates.
- JS consists of ES modules under `assets/`, wired through the import map in `snippets/scripts.liquid` (`@theme/*` aliases). Custom elements extend `Component` from `assets/component.js`, which manages `ref` attributes and declarative events. There is no bundler; type hints are JSDoc plus `assets/global.d.ts`.
- `templates/*.json` start with an auto-generated `/* … */` comment header and are rewritten by the Theme Editor. Edit them with targeted text replacements; don't parse and re-serialize them (that drops the header and reformats the file).

### Global styling: how settings become CSS
`<head>` render order in `layout/theme.liquid` matters. Later `:root` declarations win:

1. `snippets/stylesheets.liquid` → `assets/base.css`
2. `snippets/theme-styles-variables.liquid` → `:root` variables generated from theme settings (fonts, `--font-size--*`, `--font-hX--*` presets, `--narrow/normal/wide-page-width`, radii…)
3. `snippets/custom-font.liquid` → **Cairo** (project file)
4. `snippets/color-palette.liquid` → `--color-*` variables from the `color_palette` setting, including computed button hover colors
5. `snippets/custom-design-tokens.liquid` → **project overrides** (project file)
6. `assets/main.css` → **project section/component styles** (project file; linked once, after the tokens and before Shopify's compiled `{% stylesheet %}` bundle)

Key mechanics:
- **Fonts.** The Theme Editor font pickers still say Inter. `custom-font.liquid` declares Cairo `@font-face` rules from files in Shopify Admin → Content → Files (`file_url`, Arabic and Latin subsets, weights 200–900) and overrides `--font-{body,heading,subheading,accent}--family`. Weights still come from the picker variant (`--font-*--weight`). That is why `type_accent_font` is `inter_n6`: accent supplies weight 600 for H2–H4, buttons and badges. Don't change the Cairo snippet or its position.
- **Colors.** The theme uses a single `color_palette` setting, not color schemes. Settings reference palette keys as `{{ settings.color_palette.colorN }}`. Project keys:

  | Key | Color | Role |
  |---|---|---|
  | `foreground` | `#131311` | Text |
  | `color1` | `#5A5A59` | Secondary text |
  | `color2` | `#DCF2FB` | Borders and dividers |
  | `color3` | `#176BB0` | Brand blue, primary buttons |
  | `color4` | `#60C1E1` | Light brand blue, strong border |
  | `color5` | `#F0FAFE` | Tinted background |
  | `color6` | `#12568D` | Hover |

  Changing a palette value changes every setting that references it, including values inside JSON templates.
- **Typography.** Heading presets read `--font-size--hX` and `--font-hX--line-height`. Horizon only scales sizes ≥ 48px with screen width (`fluid_size_cutoff` in `theme-styles-variables`), so responsive sizes for smaller headings are set by media-query overrides in `custom-design-tokens.liquid`.
- **Page width.**
  - `settings.page_width` → `<body class="page-width-{value}">` (both layouts).
  - Each class sets `--page-content-width`, `--page-width` and `--page-margin`.
  - The `.section` grid in `base.css` caps and centers content; `.section--full-width` spans the whole viewport.
  - The project added a 4th option, `custom_1376` (active), and a fluid gutter of 24px at 390px → 52px at 1480px. Both are defined in `custom-design-tokens.liquid`.
  - `snippets/background-media.liquid`, `util-mega-menu-img-sizes-attr.liquid` and `util-product-media-sizes-attr.liquid` `case` on `page_width` to build image `sizes`. Any new width option needs a branch in all three.
- **Breakpoint convention:** `@media screen and (min-width: 750px)` / `(max-width: 749px)`.

### Project CSS and JS files
- **`assets/main.css`** is the central stylesheet for new Snosha section/component CSS. Don't put section CSS in per-section `{% stylesheet %}` blocks.
  - Give each section one stable top-level scope (e.g. `.snosha-hero`) and write everything inside it with native CSS nesting.
  - Also support the section's merchant `custom_class` setting.
  - Use only Horizon's breakpoints (750px, 990px), or container queries where the layout depends on a component's own width.
  - No `!important`; no hardcoded brand colors (consume the section's color variables or palette tokens).
- **No Liquid in static CSS.** Keep the per-instance variable bridge (a scoped `{% style %}` on `#shopify-section-{{ section.id }}` with values from settings) in the owning `.liquid` section, and consume those variables in `main.css`.
- **`assets/main.js`** is reserved for Snosha-specific JavaScript when it's genuinely needed. It's currently empty and **not loaded**.
  - When behavior is needed, add an isolated, idempotent module and register it once via Horizon's import map / module loading in `snippets/scripts.liquid`.
  - Don't add JS that HTML/CSS or native Horizon components already cover.
- **Global tokens stay where they are:** `custom-font.liquid`, `custom-design-tokens.liquid`, `theme-styles-variables.liquid`, `color-palette.liquid`. `main.css` doesn't redefine them.

### Project customization rules (established with the user)
- Native first. Prefer theme or block settings.
  - Global values Horizon can't express go in `snippets/custom-design-tokens.liquid` as **variable overrides**.
  - Section and component styling goes in `assets/main.css`.
  - No `!important`.
- Don't edit Horizon core files (`assets/base.css`, Horizon JS modules, `theme-styles-variables.liquid`) when an override in the project files can do the job. Small, necessary branches in core snippets (as with `page_width`) are acceptable and must be documented.
- Shopify keeps `number` settings to **one decimal**, so store positions in reference pixels, not fine percentages (see the `spec_chip` settings in `sections/snosha-hero.liquid`).
- Don't modify locale files. Labels for new settings are plain strings.
- After changes, validate on the dev preview at **1480px and 390px**, plus intermediate widths for overflow. Measure with `getBoundingClientRect()` or computed styles rather than reasoning from CSS. Headless Edge (`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`) with `puppeteer-core`, installed in the session scratchpad rather than the repo, has worked. DevTools `CSS.getPlatformFontsForNode` confirms the rendered font.
- Record changes, measurements and anything unverified in `FIGMA_THEME_SETTINGS_REPORT.md`.

### Known gaps in the test store
- The store has **no products**, so product pages, real product cards and badges can't be checked.
- There is **no Arabic locale** (`/ar` returns 404), so RTL has only been tested by injecting `dir="rtl"` markup in the browser.
- The homepage still shows Horizon's placeholder content; Figma sections haven't been built yet.
