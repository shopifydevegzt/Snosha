# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Snosha storefront: a **Shopify Horizon v4.4.0** theme (`config/settings_schema.json` → `theme_info`), customized to match a Figma design (file `1fqyznLFgS65tTjGvBYPBm`, desktop frame `190:3767` at 1480px, mobile frame `190:4082` at 390px). The design is Arabic/RTL-first with the **Cairo** font.

Full history of the design-foundation work, with measurements and open issues: `FIGMA_THEME_SETTINGS_REPORT.md` (historical; not updated automatically any more). Existing validation screenshots: `docs/figma-validation/` (archive; no new screenshots unless requested, see "Workflow: speed mode"). Project plan: `SNOSHA_PROJECT_PLAN.md` (one section per task).

## Section and block work: mandatory entry point

**Before** creating a section or theme block, implementing a Figma design, rebuilding an existing section, or choosing between native and custom architecture:

1. **Invoke the skill** `horizon-figma-to-sections-workflow`: use the `Skill` tool, or the user types `/horizon-figma-to-sections-workflow`. It lives at `.claude/skills/horizon-figma-to-sections-workflow/` (`SKILL.md` + `references/native-decision-gate.md`). If it can't be invoked, read both files in full and say in the answer that the skill was loaded by reading. Don't start implementing before the workflow is loaded.
2. **Read `SNOSHA_COMPONENT_REGISTRY.md`.** It lists the stock section presets, the approved native extensions, the project components, worktree/CSS ownership and the gate calibration cases.
3. **Follow the order:** native reuse → native + scoped CSS → minimal opt-in native extension → custom only with a verified reason. Post the **Native Decision Record** (skill §5.3) before any new section/block file, in speed mode too. A file named in a prompt is a candidate, not a waiver.
4. **After implementing,** add the NDR line to the plan entry and update the registry: a new component, a new opt-in extension, or a retired file.

## Commands

No build step, package manager or test suite. Everything goes through Shopify CLI:

```sh
shopify theme info                 # shows the linked store and development theme
shopify theme list                 # roles: [live] / [unpublished] / [development]
shopify theme dev                  # local preview at http://127.0.0.1:9292, syncs to the development theme
shopify theme check --path .       # lint (Liquid, schema, JSON)
shopify theme check --path . --output json   # machine-readable, for per-file filtering
```

- Linked store: `internal-zt-yzyuhhfk.myshopify.com`. The development theme is `#168066810072`; the published (live) theme is "Snosha/main" `#168066318552`, synchronised from GitHub `main`, so **a push to `main` deploys to live**. The store also has unpublished themes "Snosha/dev1", "Snosha/dev2" and the stock "Horizon" (from `shopify theme list`, 2026-11-22). The dev themes are named after the branches; whether they are connected to those GitHub branches wasn't checked. Validate on the development theme. Confirm with `shopify theme info` / `shopify theme list` before validating; the user may switch stores.
- A `theme dev` session is often **already running** on port 9292. Reuse it rather than starting a second one (that fails with `EADDRINUSE`). It hot-syncs local edits, including `config/*.json`.
- **Theme Check baseline: 190 offenses**, measured 2026-11-22 on `main` (`559a549`) with `shopify theme check --path . --output json`:
  - **9 from stock Horizon**, confirmed by running the same command on the untouched first commit `448df6e`:
    - 2 `UnknownFilter` (`applicable_disclosures` in `blocks/disclosures.liquid`, `snippets/cart-disclosure-tooltip.liquid`);
    - 5 `UnusedDocParam` (`snippets/divider.liquid`);
    - 1 `LiquidComplexity` (`snippets/product-media-gallery-content.liquid`);
    - 1 `ExcessiveSettingsCount` (`sections/header.liquid`).
  - **1 known project warning:** `ExcessiveSettingsCount` on `sections/snosha-product-comparison.liquid` (51 settings; reduction needs approval, see the plan).
  - **180 `MatchingTranslations`:** 4 project keys (`content.best_seller`, `content.savings_bundle`, `content.breadcrumb_home`, `products.product.color`) are missing from 45 locale files. They were added from 2026-11-18. Filling them needs the user's approval (locale rule below).
  - Anything beyond these 190 is new.
  - Re-measure with the same command before relying on the number.
- `.shopifyignore` and `.gitignore` exclude editor temp files (`*.tmp.*`). Edit theme files with the editor tools, not `sed -i`: its transient temp file in a watched folder makes `theme dev` show "Failed to Upload Theme Files" until that path is recreated and deleted.
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
6. `assets/main.css` → **project styles owned by the `main` branch** (project file; `layout/theme.liquid` L48, after the tokens and before Shopify's compiled `{% stylesheet %}` bundle)
7. `assets/dev1.css` → project styles owned by the `dev1` branch (collections, featured collection, before/after, blog, why, FAQ, footer, header logo, product S06 / S09 / S10), `layout/theme.liquid` L49, right after `main.css`. No scope is defined in both files; merging it into `main.css` is pending approval.

`layout/password.liquid` links neither file. No `dev2.css` or other `devN.css` exists yet, in any worktree. Branch stylesheet convention: see "Parallel sessions and worktrees".

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
- **Project stylesheets are owned per branch:** `assets/main.css` for `main`, `assets/<branch>.css` for a `devN` branch (see "Parallel sessions and worktrees"). Don't put section CSS in per-section `{% stylesheet %}` blocks.
  - Give each section one stable top-level scope and write everything inside it with native CSS nesting.
    - On a native section, the scope is its `custom_class` value (e.g. `.snosha-why-native`, `.snosha-faq-native`, `.snosha-before-after-native` on `sections/section.liquid`, which renders it on the section element).
    - On a project custom section, it's the section's own class (e.g. `.snosha-hero`).
  - Also support the section's merchant `custom_class` setting.
  - Use only Horizon's breakpoints (750px, 990px), or container queries where the layout depends on a component's own width.
  - No `!important`; no hardcoded brand colors (consume the section's color variables or palette tokens).
- **No Liquid in static CSS.** Keep the per-instance variable bridge (a scoped `{% style %}` on `#shopify-section-{{ section.id }}` with values from settings) in the owning `.liquid` section, and consume those variables in the branch's project stylesheet.
- **`assets/main.js`** is reserved for Snosha-specific JavaScript when it's genuinely needed. It's loaded once as a module from `snippets/scripts.liquid` (`fetchpriority="low"`) and holds `<snosha-care-carousel>` and `<snosha-reels-carousel>` (shared `SnoshaSnapCarousel` base), `<snosha-bundle-hotspot>`, `<snosha-bundle-form>`, and a delegated product-gallery guard that re-aligns the selected slide after Horizon's non-adjacent thumbnail jump. `assets/snosha-tabs.js` (S10) and `assets/snosha-carousel-progress.js` (progress-bar fallback) are loaded by their sections.
  - When behavior is needed, add an isolated, idempotent module there (custom elements re-run on Theme Editor section reloads; clean up in `disconnectedCallback`).
  - Don't add JS that HTML/CSS or native Horizon components already cover.
- **Global tokens stay where they are:** `custom-font.liquid`, `custom-design-tokens.liquid`, `theme-styles-variables.liquid`, `color-palette.liquid`. Project stylesheets don't redefine them.

### Project customization rules (established with the user)
- Native first. Prefer theme or block settings.
  - Global values Horizon can't express go in `snippets/custom-design-tokens.liquid` as **variable overrides**.
  - Section and component styling goes in the branch's project stylesheet (`assets/main.css` on `main`).
  - No `!important`.
- Don't edit Horizon core files (`assets/base.css`, Horizon JS modules, `theme-styles-variables.liquid`) when an override in the project files can do the job. Small, necessary branches in core snippets (as with `page_width`) are acceptable and must be documented.
  - **Native section/block files aren't "core files" in this sense.** Additive opt-in settings with blank/off defaults and identical default output are the preferred tier-3 extension (skill §5.4) and need no extra approval.
  - Approved precedents (full list in `SNOSHA_COMPONENT_REGISTRY.md` §4): `section.liquid` (`custom_class`, `snosha_grid`, `snosha_mobile_padding`), `collection-list` / `product-list` / `featured-blog-posts` (`snosha_style` groups), `comparison-slider` (`snosha_grip_color`, `snosha_shadow_color`), `accordion` (`snosha_style`).
  - Follow the existing pattern (one opt-in toggle or style select, `visible_if`, CSS in the branch's stylesheet under the opt-in class) and add the new extension to the registry.
- **Translations and IDs (Translate & Adapt keys theme content by section/block ID and setting).**
  - When migrating or rebuilding a section, keep section IDs, block IDs and block paths, so keys and digests survive.
  - Check keys and digests against live before and after.
  - Re-register only through a dry run first (`tools/translations/*`). A `custom_class` value can itself carry a registered translation.
- Shopify keeps `number` settings to **one decimal**, so store positions in reference pixels, not fine percentages (see the `spec_chip` settings in `sections/snosha-hero.liquid`).
- Don't modify locale files without the user's approval. Labels for new settings are plain strings.
  - Locale files already differ from stock in 82 files: project UI keys, the 4 keys behind the 180 `MatchingTranslations` above, plus schema labels.
  - Check `git diff --stat 448df6e HEAD -- locales` before assuming a locale is stock.

### Parallel sessions and worktrees
- Worktrees (see `git worktree list`; the registry has the current state):
  - `E:/Work/Snosha/Project` = `main`;
  - `E:/Work/Snosha/dev1` = `dev1`;
  - `E:/Work/Snosha/dev2` = `dev2`.
  - At 2026-11-22 both `dev1` and `dev2` were fully merged into `main` and had no uncommitted changes. Recheck before assuming either is idle.
- Before building a component, check the registry and the other worktrees for an existing one. If it exists only in another worktree or unmerged branch, record the dependency in the plan entry and reuse it after merge, or ask. Don't rebuild it.
- Don't merge, cherry-pick, check out or copy files between worktrees automatically.
- Don't edit files another active session owns without coordination.
- **CSS ownership follows the active branch/worktree:**
  - `main` → `assets/main.css`; `dev1` → `assets/dev1.css`; `dev2` → `assets/dev2.css`; `dev3` → `assets/dev3.css`; `devN` → `assets/devN.css`.
  - A session writes new project CSS only to its own branch's file.
  - Never define the same scope in two files.
  - Always loaded by `layout/theme.liquid`: `main.css` (L48) and `dev1.css` (L49).
  - A new `devN.css` loads only once `layout/theme.liquid` links it, after the existing project stylesheets. That layout edit is shared and needs coordination, because all branches merge into `main`. Until the link is in place, CSS in that file doesn't render.
  - Changes to a **shared native scope** (a stock component's classes or opt-in class styled in another branch's file) need coordination while several worktrees are active.
  - Moving rules between branch files (e.g. merging `dev1.css` into `main.css`) needs approval.
- Preview: each worktree's `theme dev` syncs to the development theme. Confirm which worktree the preview serves before validating (e.g. look for that worktree's stylesheet or markup in the served HTML).

### Workflow: speed mode (standing rule since 2026-11-17)
Prioritise implementation speed and concise answers. Details: skill §0.1.
- Speed mode never skips these:
  - native discovery;
  - naming the native alternatives compared;
  - the **Native Decision Record**;
  - essential function checks;
  - consumer checks for shared extensions;
  - the Theme Editor compatibility review.
- Evidence may be terse, but it must name files, settings and reasons.
- **No automatic screenshots or visual QA.** Don't capture or save screenshots (nothing new in `docs/figma-validation/`), build before/after images, export Figma frames as files, run Figma-vs-browser measurement tables, viewport sweeps or visual regression, or open a browser just for evidence. Do these only when the user explicitly asks for **Visual QA**, **screenshots** or **pixel-perfect verification**. Existing screenshots and reports stay untouched.
- **Figma MCP inspection continues** whenever a task needs design data.
- **Checks:** only essential static checks for the changed files (JSON / schema parse, `node --check`, `git diff --check`, Theme Check against the baseline above for Liquid / schema changes). One short targeted runtime check only if a critical function must be confirmed; otherwise report **Not visually verified**.
- **Docs:** no automatic QA reports, measurement tables or evidence folders. Write docs only on request, for a brief status line in `SNOSHA_PROJECT_PLAN.md`, or to record a critical technical decision — concise, text-only.
- **Answer format:** **Completed** (what changed) · **Files** · **Checks** (only those run) · **Notes** (blockers / manual review).
- When Visual QA *is* requested: measure on the dev preview at **1480px and 390px** (plus intermediate widths for overflow) with `getBoundingClientRect()` / computed styles; headless Edge (`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`) with `puppeteer-core` installed in the session scratchpad works; DevTools `CSS.getPlatformFontsForNode` confirms the rendered font.

### Known gaps in the test store
- The store has **5 products** (`snosha-f1` with 4 colour variants, `snosha-n2`, `snosha-tongue-cleaner`, `فرشاة-الأطفال`, `باندل-snosha`) and 7 collections. Product data doesn't match the Figma naming yet (merchant).
- The storefront renders `<html lang="ar" dir="rtl">` (Arabic is the primary locale; `/ar` returns 404 because it's the default), so RTL is tested on the real storefront. LTR is checked by switching `dir` in the browser.
- All homepage sections are built.
- **Product templates:** `templates/product.json` (default), `templates/product.f1-product.json` (F1 layout; preview with `?view=f1-product`) and `templates/product.bundle-template.json` (bundle layout; preview with `?view=bundle-template`). Which product uses which template is set per product in Admin; that assignment isn't verified here.
- **Reviews: Judge.me is installed and used.**
  - The app block `shopify://apps/judge-me-reviews/…` is placed in all three product templates, hosted by `sections/snosha-judgeme-reviews.liquid`.
  - Star ratings read Judge.me's synced product metafields (`reviews.rating` / `reviews.rating_count`):
    - in the buy box: `sections/product-information.liquid`;
    - in the reviews section: through `snippets/snosha-rating-stars.liquid`.
  - Card styling: `blocks/_snosha-jdgm-cards-style.liquid`. Carousel navigation: `assets/snosha-jdgm-carousel.js`.
  - `blocks/snosha-product-rating.liquid` exists but isn't placed in any template.
  - Don't modify the app's settings (merchant / app scope).
