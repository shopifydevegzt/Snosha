# SNOSHA — Native Horizon Audit

> Audit date: 2026-11-20 · Branch `main` @ `0bda5fb` · Theme: Horizon **4.4.0**.
> **Audit only.** Nothing was implemented, deleted, committed, pushed or published.
> Companion plan: `SNOSHA_NATIVE_MIGRATION_PLAN.md`.
>
> **Revision 2 (2026-11-20, same day).** Gaps closed:
> - per-template inventory, `gift_card.liquid`, and the Judge.me app component (§9–§10);
> - read-only comparison with the published theme `#168066318552` (§11);
> - re-check of the 16 sections not recommended for replacement (§12);
> - Figma design-data check of the 4 candidates (§13).
>
> §1–§8 are kept as written. Where revision 2 corrects them, the text is marked **[R2]**.

## 0. Method and evidence

| Evidence | How it was used |
|---|---|
| **Stock Horizon 4.4.0 baseline** | Commit `448df6e` ("First Commit") is unmodified Horizon 4.4.0 (`config/settings_schema.json` → `theme_info.theme_version: "4.4.0"`). Every file was classified by diffing against it (`git diff 448df6e HEAD`). Every native alternative named below is a real file in that commit. No newer Horizon version was consulted. |
| **Template usage** | A script parsed all 14 `templates/*.json` and both `sections/*-group.json` files (comment headers stripped) and walked every nested block tree. It also collected every `content_for 'block', type: …` static call in `sections/`, `blocks/` and `snippets/`. |
| **Schemas** | Every custom schema and every candidate native schema was parsed for setting IDs, select options, allowed child blocks and presets. |
| **Historical reasons** | `SNOSHA_PROJECT_PLAN.md` (§C, §C2, §G log), the header comment in each custom file, and `git log`. A reason is marked **Verified** only when one of these states it. |
| **Figma** | File `1fqyznLFgS65tTjGvBYPBm`. Structure (`get_metadata`) re-checked today for FAQ `217:14604`, Why `190:4024`, Before/After `190:3903` and Collections `190:3830`. The other node IDs come from the plan, where they were inspected with `get_design_context` at implementation time. Speed mode applies: no screenshots and no pixel measurement were done in this audit. |

**What the scores mean.** Similarity percentages are **engineering estimates**, not measurements. Weights: Layout 30 · Function 25 · Editor controls 20 · Responsive RTL/LTR 15 · Data 10. A high score does not make a component eligible for replacement. The category (A–E) and the recommendation are decided separately.

**Categories.** A Direct native · B Native + scoped CSS · C Native extension (scoped Liquid/schema) · D Custom required · E Unused / duplicate.

---

## 1. Executive summary

| Metric | Count |
|---|---:|
| Section files audited (`sections/*.liquid`) | **60** |
| Section groups audited (`header-group.json`, `footer-group.json`, both modified) | 2 |
| Block files audited (`blocks/*.liquid`) | **129** |
| Native sections, unmodified | 29 |
| Native sections, modified or extended | **11** |
| Custom sections (`snosha-*`) | **20** |
| Native blocks, unmodified | 79 |
| Native blocks, modified or extended | **16** |
| Custom blocks | **34** (9 public `snosha-*` + 25 private `_snosha-*`) |
| Custom section-local block types (inside section schemas, not files) | 8 (`slide`, `spec_chip`, `trust_item`, `spec`, `reel`, `component`, `item`, `row`) |
| **Unused / duplicate custom components (E)** | **2** (`blocks/snosha-product-rating.liquid`, `blocks/snosha-product-link.liquid`) |
| **Recommended native replacements (C)** | **4** (`snosha-faq`, `snosha-why` + `_snosha-why-item`, `snosha-before-after`, `snosha-collections`) |
| Technically feasible but **not recommended** (C, deferred) | 4 (`snosha-bundle-contents`, `snosha-benefits`, `snosha-trust-list`, `snosha-capsule`) |
| **Custom genuinely required (D)** | **19 components** (15 sections + 4 public blocks) and their 22 private child blocks |
| Category A or B replacements | **0**. Every native alternative needs at least a `custom_class` hook that native `section.liquid` / `collection-list.liquid` don't have. |

**Bottom line.**
- **Most custom code is justified.** The 9 large sections (Hero, F1 banner, Reels, Choose Care, Bundle, Comparison, Long Description, Storage & Care, Bundle Value) implement layouts, data rules or JavaScript behaviour that no Horizon 4.4.0 section provides. Several of them already reuse native internals: `<deferred-media>`, `slideshow`, `product-form-component`, `resource-list`, the localization form.
- **The real opportunity is small and specific:**
  - Three homepage sections are thin wrappers (≈20 lines of markup) around native blocks, and Horizon ships the same block trees as presets of the generic `section` ("FAQ section", "Icons with text", "Image compare").
  - One section duplicates `collection-list`'s render path.
  - Two blocks are unused, and one of them duplicates the already-extended native `review` block.
- **Housekeeping (not a component):** 14 editor temp files (`assets/*.tmp.*`) are tracked in git, although `.gitignore` / `.shopifyignore` exclude that pattern for new files (§6).

**[R2] Revised classification of all 20 custom sections** (§12, §13). The A–D scale of revision 2 differs from the A–E scale in §2: A = native + scoped CSS, B = native + small extension, C = possible but high risk, D = native can't preserve essential function.

| Revision 2 class | Count | Sections |
|---|---:|---|
| A — Native + scoped CSS (needs the shared `custom_class` prerequisite P on `section.liquid`) | **6** | `snosha-faq`, `snosha-why`, `snosha-before-after`, `snosha-how-to-use`, `snosha-bundle-contents`, `snosha-f1-banner` |
| B — Native + small extension | **6** | `snosha-collections`, `snosha-how-to-use-video`, `snosha-contact`, `snosha-collection-header`, `snosha-reviews-screenshots`, `snosha-bundle-value` |
| C — Technically possible, high risk | **5** | `snosha-reels`, `snosha-choose-care`, `snosha-long-description`, `snosha-storage-care`, `snosha-judgeme-reviews` |
| D — Native can't preserve essential function without a rebuild | **3** | `snosha-hero`, `snosha-bundle`, `snosha-product-comparison` |

The live theme matches the repository (0 differing files, §11).

---

## 2. Custom component comparison

Each similarity is a weighted estimate (breakdown in §4). "Templates" lists active placements; `[off]` = present but `disabled: true`.

### 2.1 Custom sections

| Custom component | Page / template | Closest native Horizon 4.4.0 alternative | Similarity | Category | Risk |
|---|---|---|---:|:-:|:-:|
| `sections/snosha-faq.liquid` | index, product, product.f1-product, product.bundle-template | `sections/section.liquid` preset **"FAQ section"** (`text` + `accordion` → `_accordion-row` → `text`) | **91%** | C | Low–Med |
| `sections/snosha-before-after.liquid` | index; product + f1 (`snosha-before-after--product`) | `sections/section.liquid` preset **"Image compare"** (`group` [text, text, buttons] + `comparison-slider`) | **91%** | C | Medium |
| `sections/snosha-collections.liquid` | index | `sections/collection-list.liquid` (layout `carousel`) | **90%** | C | Low–Med |
| `sections/snosha-why.liquid` (+ `_snosha-why-item`) | index | `sections/section.liquid` preset **"Icons with text"** (`group` → `icon` + `text`) | **88%** | C | Low |
| `sections/snosha-bundle-contents.liquid` | product.bundle-template | `sections/section.liquid` + `group` + `snosha-icon` + `text` | 80% | C (deferred) | Medium |
| `sections/snosha-how-to-use.liquid` | product, f1, bundle (×2) | `sections/section.liquid` + `group` + `text` | 72% | D | — |
| `sections/snosha-collection-header.liquid` | collection | `sections/section.liquid` + `collection-title` + `text` (+ no native breadcrumbs) | 70% | D | — |
| `sections/snosha-contact.liquid` | product, f1, bundle (×2, one `snosha-gift`) | `sections/section.liquid` + `group` + `image` + `text` + `button` | 70% | D | — |
| `sections/snosha-reviews-screenshots.liquid` | f1 (product `[off]`) | `sections/carousel.liquid` (`_carousel-content` → `_card`) | 67% | D | — |
| `sections/snosha-how-to-use-video.liquid` | product, f1 | `sections/section.liquid` preset **"Video section"** + `blocks/video.liquid` | 65% | D | — |
| `sections/snosha-judgeme-reviews.liquid` | product, f1, bundle | `sections/section.liquid` (`@app`) + `text` + `review` | 65% | D | — |
| `sections/snosha-f1-banner.liquid` | index | `sections/media-with-content.liquid` / `sections/hero.liquid` | 62% | D | — |
| `sections/snosha-reels.liquid` | index, product (f1 `[off]`) | `sections/carousel.liquid` + `blocks/video.liquid` | 57% | D | — |
| `sections/snosha-long-description.liquid` | product, f1, bundle | `sections/section.liquid` / `media-with-content.liquid` per panel | 56% | D | — |
| `sections/snosha-choose-care.liquid` | index | `sections/product-list.liquid` | 54% | D | — |
| `sections/snosha-bundle.liquid` | index | `sections/product-hotspots.liquid` + `sections/featured-product.liquid` | 54% | D | — |
| `sections/snosha-hero.liquid` | index | `sections/hero.liquid` | 52% | D | — |
| `sections/snosha-bundle-value.liquid` | product.bundle-template | `sections/section.liquid` + `text` | 51% | D | — |
| `sections/snosha-storage-care.liquid` | product, f1 | `blocks/accordion.liquid` / `sections/layered-slideshow.liquid` | 46% | D | — |
| `sections/snosha-product-comparison.liquid` | product (f1 `[off]`) | `sections/section.liquid` + `group` | 38% | D | — |

### 2.2 Custom public blocks

| Custom component | Used in | Closest native alternative | Similarity | Category | Risk |
|---|---|---|---:|:-:|:-:|
| `blocks/snosha-product-rating.liquid` | **Not placed in any template** | `blocks/review.liquid` (already extended with `show_rating_value`, `label`, and placed in the Buy Box) | 84% | **E** | Low |
| `blocks/snosha-product-link.liquid` | **Not placed in any template** | `blocks/button.liquid` (`button-unstyled`, `link` → product) | 84% | **E** | Low |
| `blocks/snosha-benefits.liquid` (+ `_snosha-benefit`) | Buy Box (product, f1, bundle) | `blocks/group.liquid` + `snosha-icon` + `text` | 82% | C (deferred) | Medium |
| `blocks/snosha-capsule.liquid` | Buy Box (product, f1 `[off]`) | `blocks/group.liquid` (`link`, border, radius) + `snosha-icon` + `text` | 82% | C (deferred) | Medium |
| `blocks/snosha-trust-list.liquid` (+ `_snosha-trust-item`) | Buy Box (product, f1, bundle) | `blocks/group.liquid` + `snosha-icon` + `text` | 75% | C (deferred) | Medium |
| `blocks/snosha-footer-language.liquid` | footer-utilities (every page) | No native footer language block. `sections/header.liquid` `show_language` is the nearest. | 74% | D | — |
| `blocks/snosha-icon.liquid` | snosha-why, snosha-before-after (static in `_snosha-why-item`) | `blocks/icon.liquid` | 71% | D | — |
| `blocks/snosha-complementary.liquid` | Buy Box (product, f1) | `blocks/product-recommendations.liquid` (`recommendation_type: complementary`) | 66% | D | — |
| `blocks/snosha-bundle-swatches.liquid` | Buy Box (bundle) | `blocks/variant-picker.liquid` (swatches) | 54% | D | — |

**Private `_snosha-*` blocks (25)** share their parent's verdict. They can only be nested in their parent, so they are not compared separately. Parents: hero/f1/reels/bundle use section-local blocks, not files. `_snosha-care-card`, `_snosha-care-spec` → choose-care · `_snosha-comparison-row` → comparison · `_snosha-contact-*` (4) → contact · `_snosha-how-to-use-*` (2) → how-to-use · `_snosha-jdgm-cards-style` → judgeme · `_snosha-ld-*` (6) → long-description · `_snosha-review-screenshot`, `_snosha-reviews-rating` → reviews-screenshots · `_snosha-storage-*` (3) → storage-care · `_snosha-video-play` → how-to-use-video · `_snosha-why-item` → why · `_snosha-benefit` → benefits · `_snosha-trust-item` → trust-list.

---

## 3. Native components that were modified (keep)

These are native files with **additive, opt-in** extensions. That is the project's native-first pattern, already applied. None of them is a replacement candidate. They are listed because shared-component risk applies to them, and because the migration plan reuses their pattern.

| Native file | Change vs stock (lines +/−) | What it adds | Consumers |
|---|---|---|---|
| `sections/header.liquid` | +469 / −17 | "Snosha layout", icons, mobile drawer, language switcher, Organization JSON-LD (81 settings) | header-group (all pages) |
| `sections/featured-blog-posts.liquid` | +304 / −1 | `snosha_style`, `custom_class`, colours, progress bar, "Snosha blog" preset | index |
| `sections/product-list.liquid` | +252 / −1 | `snosha_style`, `custom_class`, tablet/mobile columns, `snosha_exclude_current`, colours, progress | index ×2, product, f1 |
| `sections/product-information.liquid` | +208 / −13 | `snosha_buy_box`, column widths, breadcrumbs, colours, `custom_class` | product, f1, bundle |
| `sections/main-collection.liquid` | +137 / −1 | `snosha_style` collection grid, column cap, colours | collection |
| `sections/main-blog.liquid` | +98 | `snosha_style`, breadcrumbs, colours | blog |
| `sections/footer.liquid` / `footer-utilities.liquid` | +72 / +57 | `snosha_layout`, `custom_class`, mobile paddings; language block slot | footer-group |
| `sections/product-recommendations.liquid` | +66 | `snosha_style`, `custom_class`, gradient colours | product, f1 |
| `sections/media-with-content.liquid` | +44 | mobile media position, hide empty media, `custom_class` | bundle (`snosha-why-bundle`) |
| `sections/main-blog-post.liquid` | +2 / −3 | Article JSON-LD render | article |
| Blocks: `_product-media-gallery` (+160), `_product-card-gallery` (+98), `accordion` (+82), `_accordion-row` (+57), `_featured-blog-posts-card` (+57), `social-links` (+26), `review` (+22), `price` (+18), `footer-copyright` (+18), `email-signup` (+13), `logo` (+13), `_announcement` (+12), `_product-list-button` (+8), `variant-picker` (+8), `comparison-slider` (+7 / −2), `contact-form` (−2) | | Opt-in style toggles and settings, inert when off | see inventory |

Modified core snippets and JS (documented in `CLAUDE.md` / plan): `background-media`, `card-gallery`, `cart-drawer`, `cart-summary`, `header-actions`, `header-drawer`, `media`, `meta-tags`, `price`, `product-information-content`, `product-media-gallery-content`, `scripts`, `search`, `theme-drawer`, `util-*-sizes-attr`, `variant-main-picker`, `variant-picker-styles`, `checkbox-styles`; `assets/product-form.js`, `slideshow.js`, `theme-drawer.js`, `view-event-elements.js`.

---

## 4. Detailed findings

Score format: **L**ayout / **F**unction / **E**ditor / **R**esponsive / **D**ata → weighted overall.

### 4.1 Recommended replacements (category C)

#### `sections/snosha-faq.liquid` → `sections/section.liquid` "FAQ section" preset — **91%** (L 90 / F 100 / E 85 / R 80 / D 100)
- **Why it was created (Verified, plan §C #14 and file header):** a "thin container for native Horizon blocks". The heading and subtitle are static native `text` blocks, and the two columns are native `accordion` blocks with `_accordion-row` → `text`. It was kept separate so the shared generic `section` would not need a design-specific mode.
- **What it adds** (`sections/snosha-faq.liquid`): about 20 lines of markup (`.snosha-faq__heading`, `.snosha-faq__columns`), 14 settings (9 colours, 4 paddings, `custom_class`) and a colour bridge. The CSS is a single nested `.snosha-faq` rule (`assets/dev1.css`) that targets native `.accordion` and `.text-block` classes.
- **What Horizon provides:** the stock "FAQ section" preset has the identical block tree (`text` + `accordion` → `_accordion-row` → `text`). `section.liquid` has `content_direction: row` + `vertical_on_mobile` (two columns on desktop, stacked on mobile), gap, background and padding. Row and chevron colours already exist natively on the extended `blocks/accordion.liquid` (`snosha_style` + 9 colour settings).
- **Figma check (`217:14604`):** heading `217:14605` + "FAQ Columns" with two 656-px columns of FAQ Items, which is the same structure as preset `row` → `[group: text] [accordion] [accordion]`.
- **What's missing:** `section.liquid` has no `custom_class` (needs an additive setting), no separate mobile paddings (CSS under the class), and no section-level heading colour (the `text` block has its own colour).
- **Other dependencies:** FAQ JSON-LD (`snippets/schema-faq.liquid`) parses page content and is independent of this section. **Verdict:** feasible with a one-setting core extension.

#### `sections/snosha-before-after.liquid` → `sections/section.liquid` "Image compare" preset — **91%** (L 90 / F 100 / E 85 / R 80 / D 100)
- **Why (Verified, plan §C #8, file header):** a "thin container for native theme blocks". The generic `section` "can't express this two-column geometry, mobile-only padding and a stable scope without adding a design-specific mode to a shared section". Plan log: `media-with-content` was rejected because its media slot only takes image or video.
- **What it adds:** **8 lines of markup** (one wrapper `div` plus `content_for 'blocks'`), 8 settings (4 paddings, label text / grip / shadow colours, `custom_class`). All content is already native blocks (`comparison-slider`, `group`, `text`, `button`) plus `snosha-icon`.
- **What Horizon provides:** the "Image compare" preset is `row` → `group(text, text, buttons)` + `comparison-slider`, which is the same composition. The two-column geometry is native `content_direction: row`. The Figma split `190:3903` (774-px slider + 557-px content column) maps to the native row with CSS track sizes.
- **What's missing:** `custom_class`, mobile paddings (CSS), and the 3 slider colours (move to CSS variables under the class, or to an opt-in setting on `comparison-slider`, which is already modified). There are **3 instances**: the product-page variant uses `custom_class: snosha-before-after--product` in `templates/product.json` and `product.f1-product.json`. **Verdict:** feasible. Risk is Medium because three templates share the CSS.

#### `sections/snosha-collections.liquid` → `sections/collection-list.liquid` (carousel) — **90%** (L 90 / F 95 / E 80 / R 85 / D 100)
- **Why (Verified, file header):** "Thin wrapper around Horizon's native collection list … same render path … **Kept separate so the shared native section doesn't need new settings (custom_class, colors).**"
- **This rationale contradicts later project practice.** `product-list.liquid`, `featured-blog-posts.liquid`, `main-collection.liquid` and `product-recommendations.liquid` all received exactly that kind of opt-in `snosha_style` + `custom_class` extension. `collection-list.liquid` is **not placed in any template**, so an opt-in extension is inert everywhere.
- **What it adds:** 304 lines, including a copied `resource-list` render path (`sections/snosha-collections.liquid:37–61`), 14 settings (`cards_desktop` / `cards_tablet` / `cards_mobile`, arrow and progress colours, `custom_class`). The CSS targets native `.resource-list__*` / `.slideshow-control` classes.
- **What Horizon provides:** `collection_list`, `layout_type: carousel`, `columns`, `mobile_card_size`, `icons_style` / `icons_shape`, gaps and paddings, and the same static `_collection-card`. **Figma `190:3830`:** full-bleed carousel of 292-px cards with peeking edge cards and 44-px arrows. Native carousel plus the existing CSS covers this.
- **What's missing:** a tablet card count, arrow and progress colours, and the shared progress bar flag. Add them as an opt-in `snosha_style` group, following the `product-list.liquid` pattern. **Verdict:** feasible. It removes a duplicated render path.

#### `sections/snosha-why.liquid` (+ `blocks/_snosha-why-item.liquid`) → `sections/section.liquid` "Icons with text" preset — **88%** (L 85 / F 100 / E 80 / R 75 / D 100)
- **Why (Verified, plan §C #13, file header):** a thin container. The generic `section` "can't express the 4-column / 2 × 2 grid, mobile-only padding and a stable scope".
- **What it adds:** heading markup with optional sparkle images, a grid wrapper, and 15 settings (column counts desktop/tablet/mobile, 6 colours, sparkles toggle, paddings, `custom_class`). **`_snosha-why-item` has 0 settings.** It is only a wrapper around static `snosha-icon` + `text` blocks, which is exactly a native `group` (column) with `snosha-icon` + `text` children.
- **What Horizon provides:** the "Icons with text" preset is `row` → 3 × `group(column)` → `icon` + `group(text, text)`. Native `icon` can't show the Figma illustrations (§4.3), so the existing `snosha-icon` block stays as the child. **Figma `190:4024`:** heading + 4 × 310-px items in a grid.
- **What's missing:** the 2 × 2 mobile grid and the 4-column desktop grid need CSS grid under the custom class (native row is flex). Column-count settings would become CSS values. Sparkles become a CSS pseudo-element or a static `image`. **Editor loss:** the column-count ranges. Keep them by passing them to CSS variables from an opt-in setting only if the merchant needs them. **Verdict:** feasible. Lowest risk (homepage only).

### 4.2 Feasible but not recommended now (category C, deferred)

| Component | Why technically feasible | Why not now |
|---|---|---|
| `sections/snosha-bundle-contents.liquid` (80%) | `section` + `group` cards + `snosha-icon` + `text`. Its 4-setting local `item` blocks map to nested theme blocks. | The bundle template was finalised and QA'd on 2026-11-19 (commits `03931e6` → `3e924b3`) with **Arabic and English content** (`bundle-en after claude`). Section-local `item` blocks can't be converted in place: content and translations must be re-entered, and each card becomes 3–4 nested blocks. Origin not in the plan. **Original reason not verified** beyond the file header ("Content, icons and colours are Theme Editor settings"). |
| `blocks/snosha-benefits.liquid`, `snosha-trust-list.liquid`, `snosha-capsule.liquid` (75–82%) | `group` (row/column, border, radius, `link`) + `snosha-icon` + `text` reproduces the visuals. | Native `blocks/group.liquid` has **no `custom_class`**, and adding one touches a block used across the header, footer, before/after and product pages. Each benefit or pill would become 3 nested blocks instead of 1 (worse editing). The dashed capsule border and the trust-pill hover need CSS that can't be scoped safely without that class. Little code is saved (81 + 131 + 172 lines). **Why (Verified, plan log 2026-11-12 Buy Box):** created alongside native reuse of title, price, review, variant-picker, buy-buttons and accordion. |

### 4.3 Custom required (category D), with evidence

| Component | Decisive gap in Horizon 4.4.0 (evidence) | Reason status |
|---|---|---|
| `snosha-hero` | Native `hero` can't anchor spec chips to a positioned product image, draw the rings or overlap the trust card (`sections/snosha-hero.liquid` header; plan §C #3). | Verified |
| `snosha-f1-banner` | `media-with-content` / `hero` can't layer the waves between the arc and the product, or position the decorative stage (file header; plan log 2026-11-08). | Verified |
| `snosha-reels` | `snippets/video.liquid` stock always mutes (`muted: true`, lines 71/113/117 at `448df6e`) and draws Horizon's own play icon. Each reel also needs a product, a middle-reel start and mouse drag. The section reuses `<deferred-media>`. | Verified |
| `snosha-how-to-use-video` | Native `video` block: no custom or mobile poster for uploaded video, always muted, no overlay or play-button settings (file header; same `video.liquid` evidence). Reuses `<deferred-media>`, no Snosha JS. **[R2] Refined:**<br>• uploaded video: the poster is the video's own `preview_image` (`blocks/video.liquid:18`), and `cover_image` applies only to the URL source (`:29`);<br>• it plays muted, but **with controls** (`snippets/video.liquid:94–98, 117`), so the viewer can unmute;<br>• YouTube / Vimeo with a cover image and no autoplay play **unmuted** (`:47–48, 66–67`).<br>Becomes class B in §12. | Verified; refined |
| `snosha-choose-care` | `product-list` renders every product with one shared card. It can't give one card a featured layout or per-product spec rows (file header). | Verified |
| `snosha-bundle` | `product-hotspots` (`_hotspot-product`: product + x/y only) has hotspots but no bundle product, rows, totals or add to cart. The section reuses `product-form-component` + `add-to-cart-button`. | Verified |
| `snosha-product-comparison` | No native comparison table. `comparison-slider` is an image slider, and `section` + `group` can't keep 3 columns row-synchronised (plan log 2026-11-12). Has the known `ExcessiveSettingsCount` (51). | Verified |
| `snosha-long-description` | 7 panels with 3 layouts, indicator lights and per-panel media. No native multi-layout panel stack. | Verified (plan §C2) |
| `snosha-storage-care` | Horizon's only tab UI is `layered-slideshow` (layered slides with drag). `accordion` isn't tabs, and Figma shows a pill tab bar (plan log 2026-11-12). **[R2]** `layered-slideshow` does output a real ARIA `role="tablist"` / `role="tab"` / `aria-selected` (`sections/layered-slideshow.liquid:42–54`), so native tabs exist. Their layout (layered horizontal panels, `--inactive-tabs-width`) differs from the design, so this becomes class C in §12. | Verified; refined |
| `snosha-how-to-use` (72%) | `section` + `group` + `text` render `div`s: the ordered-list semantics (`<ol>` / `<li>`, CSS counter) would be lost, an accessibility regression (plan log 2026-11-12: "can't number steps"). **[R2] Corrected:** one native `text` block (`richtext`) can hold the steps as a numbered list, and Horizon styles `.rte ol` (`assets/base.css:1317–1323`). Semantics are kept, so this becomes class A in §12. | Verified (original reason); superseded |
| `snosha-contact` (70%) | The native `button` takes a URL. It can't build `wa.me/<digits>` from a phone number, and it can't hide a button until the number or email is valid (plan log 2026-11-15). Whether the `url` setting accepts `mailto:` is **not verified**. Three instances, including the bundle `snosha-gift` variant with a CTA block. | Verified |
| `snosha-collection-header` (70%) | Horizon 4.4 has no breadcrumbs or collection header (plan log 2026-11-16). `collection-title` + `text` (dynamic `collection.description`) + `image` cover the title, description and image, but breadcrumbs + BreadcrumbList JSON-LD (`snippets/snosha-breadcrumbs.liquid`, also used by `product-information` and `main-blog`) would still need a custom block. Net custom code would barely change. | Verified |
| `snosha-reviews-screenshots` (67%) | Already uses native `slideshow` internally. The manual rating pill and the interactive progress have no native equivalent. Active only on `product.f1-product`. | Verified |
| `snosha-judgeme-reviews` (65%) | Hosts the Judge.me `@app` Cards Carousel, a metafield rating summary and the static card-style block. `assets/snosha-jdgm-carousel.js` fixes the app carousel's navigation. Out of scope to touch (Judge.me). | Verified |
| `snosha-bundle-value` (51%) | Calculates the price, compare-at total and savings from product data (`sections/snosha-bundle-value.liquid` header). No native equivalent. | File header only |
| `snosha-icon` (block, 71%) | Native `icon` offers a fixed icon list (stock list in `blocks/icon.liquid`, no tooth / sparkle / sonic / illustrations) plus image upload. No gradient tile. | Verified (file header) |
| `snosha-complementary` (66%) | Native `product-recommendations` block (complementary) has no manual `product_list` fallback. Snosha uses manual products first, then Search & Discovery through the native `<product-recommendations>` element. | Verified (plan log) |
| `snosha-footer-language` (74%) | Stock `footer-utilities` allows only `footer-copyright`, `footer-policy-list` and `social-links`, so there is no footer language selector. The block reuses the native localization form and `<dropdown-localization-component>` through `snippets/snosha-language-switcher.liquid`. | File header + commit `e1a9f0f` |
| `snosha-bundle-swatches` (54%) | Drives **Simple Bundles** app `<select name="properties[…]">` fields, not Shopify variants, so `variant-picker` doesn't apply. Must not change (app integration). | File header |

### 4.4 Unused / duplicate (category E)

- **`blocks/snosha-product-rating.liquid`** (223 lines): not placed in any template or group. **Why it exists (Verified, plan §C2 08b):** a Buy Box rating ("Not Horizon's `review.liquid`: in 5-star mode it can't show the number, its star differs from Figma and it rounds to half stars"). **However:** the Buy Box now uses native `review` (plan log 2026-11-12, "`review` `show_rating_value`"). The plan itself records "Buy Box rating block not placed yet". So the custom block duplicates a native block that was extended for the same purpose. Its snippet `snosha-rating-stars.liquid` is still used by `snosha-judgeme-reviews` and `_snosha-reviews-rating`, so the snippet must stay.
- **`blocks/snosha-product-link.liquid`** (49 lines): not placed anywhere, and not mentioned in the plan. **Original reason not verified** beyond its header ("e.g. inside an FAQ accordion row"). The native `button` (`button-unstyled`, `link` → a product) covers it, except that the label doesn't default to the product title.

---

## 5. Theme Editor and functional impact of the recommended set

| Requirement | snosha-faq → section | snosha-before-after → section | snosha-collections → collection-list | snosha-why → section |
|---|---|---|---|---|
| Editable heading / text | ✅ native `text` (static → dynamic block) | ✅ already native blocks | ✅ native heading blocks | ✅ native `text` |
| Images / pickers | n/a | ✅ `comparison-slider` pickers unchanged | ✅ `collection_list` picker | ✅ `snosha-icon` image override |
| Links / buttons | ✅ | ✅ native `button` | ✅ native card links | n/a |
| Desktop/mobile layout | ✅ `content_direction` + `vertical_on_mobile` | ✅ same | ✅ columns + `mobile_card_size`; tablet count via opt-in | ⚠️ the column-count settings become CSS unless an opt-in is added |
| Spacing / alignment | ✅ native gap, padding, alignment | ✅ | ✅ | ✅ |
| Colours via tokens | ✅ `accordion` `snosha_style` colours (exists) | ⚠️ 3 slider colours need a home | ✅ via opt-in settings | ⚠️ 6 colours → `text` block colours + CSS tokens |
| `custom_class` | ➕ add to `section.liquid` (inert when blank) | ➕ same | ➕ add to `collection-list.liquid` | ➕ same as FAQ |
| Translations | ⚠️ **re-enter**: block IDs change when moving between section types | ⚠️ same | ⚠️ same (heading only) | ⚠️ same |
| Functional behaviour | Identical (same `accordion-custom` JS) | Identical (same `comparison-slider`) | Identical (same `resource-list` / `slideshow`) | Static |

Note: Shopify stores storefront translations of theme content by section and block ID. Moving content to a new section instance creates new IDs, so the Arabic/English values entered through Translate & Adapt must be copied manually. This applies to **every** migration. See the plan.

---

## 6. Other findings (not components)

1. **Tracked temp files:** 14 `assets/*.tmp.*` files are committed. **[R2]** The same 14 files are also present on the live theme (§11). Because they're ignored, they don't upload to Shopify, but they clutter git. Among them: 9 × `dev1.css.tmp.*`, 3 × `snosha-jdgm-carousel.js.tmp.*`, 1 × `snosha-carousel-progress.js.tmp.*`, and `snosha-scroll-progress.js.tmp.*` (a leftover from the removed S08 script). Cleanup: `git rm --cached` after approval.
2. **`assets/dev1.css` (5,645 lines) and `assets/main.css` (6,908 lines)** are still split. The merge is pending approval (`CLAUDE.md`). Migrated scopes should land in `main.css`.
3. **Unplaced stock sections** (`carousel`, `collection-list`, `collection-links`, `hero`, `slideshow`, `layered-slideshow`, `marquee`, `product-hotspots`, `featured-product`, `custom-liquid`, `divider`, `logo`, `quick-order-list`) are normal Horizon offerings, available in the editor. They aren't counted as unused. `cart-drawer-section`, `predictive-search*`, `section-rendering-product-card`, `featured-product-information`, `password-footer` and `_blocks` render internally or through the Section Rendering API.
4. **Custom snippets:** all 14 `snosha-*` / `schema-*` snippets are referenced; none is unused.

## 7. Figma references and unverifiable items

- Structure re-checked today: FAQ `217:14604`, Why `190:4024`, Before/After `190:3903`, Collections `190:3830`.
- Not re-inspected today; node IDs are recorded in the plan, where they were inspected at build time: every product-page node (`190:10461`, `190:10527`, `190:10750`, `190:10753`, `190:10779`, `190:10390`, `190:10844`, `190:10510`, Buy Box `190:10229`).
- **No Figma frame recorded:** the bundle template sections (`snosha-bundle-contents`, `snosha-bundle-value`, `snosha-bundle-swatches`), the collection header (built from a user screenshot, plan log 2026-11-16), the footer language block, and `snosha-product-link`.
- **[R2]** For the 4 candidates, the desktop design data (`get_design_context`) and the mobile geometry (`get_metadata`) were inspected; see §13. Rendering is still **NOT VISUALLY VERIFIED**.
- **Visual fidelity of the proposed replacements is not verified.** No rendering or pixel comparison was done in this audit (speed mode). Each migration step in the plan includes the comparison as a gate.
- **Not verified:** whether the Shopify `url` setting accepts `mailto:` (it affects `snosha-contact`), and real Theme Editor behaviour (no admin session).

---

## 8. Full inventory

Columns: **Origin**: Native = identical to stock 4.4.0 (`448df6e`); Native — modified = stock file changed; Custom = added by the project. **Templates** = template JSON / section-group files where the type appears in saved data. "—" = not placed in saved data; the component may still render statically or through the Section Rendering API, or be available in the editor. For blocks, **Parents** = the section types they sit under, plus files that render them as static blocks.

### 8.1 Sections (60 files)

| Section | Origin | Templates / groups |
|---|---|---|
| `_blocks` | Native | — |
| `carousel` | Native | — |
| `cart-drawer-section` | Native | — |
| `collection-links` | Native | — |
| `collection-list` | Native | — |
| `custom-liquid` | Native | — |
| `divider` | Native | — |
| `featured-blog-posts` | Native — modified | index |
| `featured-product-information` | Native | — |
| `featured-product` | Native | — |
| `footer-utilities` | Native — modified | footer-group |
| `footer` | Native — modified | footer-group |
| `header-announcements` | Native | header-group |
| `header` | Native — modified | header-group |
| `hero` | Native | — |
| `layered-slideshow` | Native | — |
| `logo` | Native | — |
| `main-404` | Native | 404 |
| `main-blog-post` | Native — modified | article |
| `main-blog` | Native — modified | blog |
| `main-cart` | Native | cart |
| `main-collection-list` | Native | list-collections |
| `main-collection` | Native — modified | collection |
| `main-page` | Native | page.contact, page |
| `marquee` | Native | — |
| `media-with-content` | Native — modified | product.bundle-template |
| `password-footer` | Native | — |
| `password` | Native | password |
| `predictive-search-empty` | Native | — |
| `predictive-search` | Native | — |
| `product-hotspots` | Native | — |
| `product-information` | Native — modified | product.bundle-template, product.f1-product, product |
| `product-list` | Native — modified | index, product.f1-product, product |
| `product-recommendations` | Native — modified | product.f1-product, product |
| `quick-order-list` | Native | — |
| `search-header` | Native | search |
| `search-results` | Native | search(disabled) |
| `section-rendering-product-card` | Native | — |
| `section` | Native | collection(disabled), page.contact |
| `slideshow` | Native | — |
| `snosha-before-after` | Custom | index, product.f1-product, product |
| `snosha-bundle-contents` | Custom | product.bundle-template |
| `snosha-bundle-value` | Custom | product.bundle-template |
| `snosha-bundle` | Custom | index |
| `snosha-choose-care` | Custom | index |
| `snosha-collection-header` | Custom | collection |
| `snosha-collections` | Custom | index |
| `snosha-contact` | Custom | product.bundle-template, product.f1-product, product |
| `snosha-f1-banner` | Custom | index |
| `snosha-faq` | Custom | index, product.bundle-template, product.f1-product, product |
| `snosha-hero` | Custom | index |
| `snosha-how-to-use-video` | Custom | product.f1-product, product |
| `snosha-how-to-use` | Custom | product.bundle-template, product.f1-product, product |
| `snosha-judgeme-reviews` | Custom | product.bundle-template, product.f1-product, product |
| `snosha-long-description` | Custom | product.bundle-template, product.f1-product, product |
| `snosha-product-comparison` | Custom | product.f1-product(disabled), product |
| `snosha-reels` | Custom | index, product.f1-product(disabled), product |
| `snosha-reviews-screenshots` | Custom | product.f1-product, product(disabled) |
| `snosha-storage-care` | Custom | product.f1-product, product |
| `snosha-why` | Custom | index |

Section-group files: `sections/header-group.json`, `sections/footer-group.json` (both Native — modified: Snosha settings and blocks configured).

### 8.2 Blocks (129 files)

| Block | Origin | Templates / groups | Parents / static callers |
|---|---|---|---|
| `_accordion-row` | Native — modified | index, product.bundle-template, product.f1-product, product | snosha-faq, product-information |
| `_announcement` | Native — modified | header-group | header-announcements |
| `_blog-post-card` | Native | blog | main-blog |
| `_blog-post-content` | Native | article | main-blog-post |
| `_blog-post-description` | Native | blog, index | main-blog, featured-blog-posts |
| `_blog-post-featured-image` | Native | — | — |
| `_blog-post-image` | Native | blog | main-blog |
| `_blog-post-info-text` | Native | article, blog, index | main-blog-post, main-blog, featured-blog-posts |
| `_blog-post-title` | Native | — | — |
| `_card` | Native | — | — |
| `_carousel-content` | Native |  | static in carousel |
| `_cart-products` | Native | cart | main-cart |
| `_cart-summary` | Native | cart | main-cart |
| `_cart-title` | Native | cart | main-cart |
| `_collection-card-image` | Native | index, list-collections | snosha-collections, main-collection-list; static in collection-card, _collection-card-image, _collection-card |
| `_collection-card` | Native | index, list-collections | snosha-collections, main-collection-list; static in collection-list, main-collection-list, snosha-collections |
| `_collection-image` | Native | — | — |
| `_collection-info` | Native | — | — |
| `_collection-link` | Native |  | static in collection-links |
| `_content-without-appearance` | Native | product.bundle-template | media-with-content; static in media-with-content |
| `_content` | Native | — | — |
| `_divider` | Native | — | — |
| `_featured-blog-posts-card` | Native — modified | blog, index | main-blog, featured-blog-posts |
| `_featured-blog-posts-image` | Native | blog, index | main-blog, featured-blog-posts |
| `_featured-blog-posts-title` | Native | index | featured-blog-posts; static in _featured-blog-posts-title |
| `_featured-product-gallery` | Native |  | static in _featured-product |
| `_featured-product-information-carousel` | Native |  | static in featured-product-information |
| `_featured-product-price` | Native |  | static in _featured-product |
| `_featured-product` | Native |  | static in featured-product |
| `_footer-social-icons` | Native | — | — |
| `_header-logo` | Native | header-group | header; static in header |
| `_header-menu` | Native | header-group | header; static in header |
| `_heading` | Native | blog, index, search | main-blog, featured-blog-posts, search-header |
| `_hotspot-product` | Native | — | — |
| `_image` | Native |  | static in _collection-link |
| `_inline-collection-title` | Native |  | static in _collection-link |
| `_inline-text` | Native | — | — |
| `_layered-slide` | Native | — | — |
| `_marquee` | Native | — | — |
| `_media-without-appearance` | Native | product.bundle-template | media-with-content; static in featured-product, media-with-content |
| `_product-card-gallery` | Native — modified | collection, index, product.f1-product, product, search | main-collection, product-list, product-recommendations, search-results |
| `_product-card-group` | Native | — | — |
| `_product-card` | Native | collection, index, product.f1-product, product, search | main-collection, product-list, product-recommendations, search-results; static in main-collection, product-list, product-recommendations, search-results, product-recommendations |
| `_product-details` | Native | product.bundle-template, product.f1-product, product | product-information; static in featured-product-information, product-information, product-information-content |
| `_product-list-button` | Native — modified | index | product-list |
| `_product-list-content` | Native | index, product.f1-product, product | product-list; static in product-list |
| `_product-list-text` | Native | index, product.f1-product, product | product-list |
| `_product-media-gallery` | Native — modified | product.bundle-template, product.f1-product, product | product-information; static in product-information, product-information-content |
| `_search-input` | Native | search | search-header |
| `_slide` | Native | — | — |
| `_snosha-benefit` | Custom | product.bundle-template, product.f1-product, product | product-information |
| `_snosha-care-card` | Custom | index | snosha-choose-care |
| `_snosha-care-spec` | Custom | index | snosha-choose-care |
| `_snosha-comparison-row` | Custom | product.f1-product, product | snosha-product-comparison |
| `_snosha-contact-content` | Custom | product.bundle-template, product.f1-product, product | snosha-contact; static in snosha-contact |
| `_snosha-contact-cta` | Custom | product.bundle-template | snosha-contact; static in snosha-contact |
| `_snosha-contact-email` | Custom | product.bundle-template, product.f1-product, product | snosha-contact; static in snosha-contact |
| `_snosha-contact-whatsapp` | Custom | product.bundle-template, product.f1-product, product | snosha-contact; static in snosha-contact |
| `_snosha-how-to-use-note` | Custom | product.bundle-template, product.f1-product, product | snosha-how-to-use; static in snosha-how-to-use |
| `_snosha-how-to-use-step` | Custom | product.bundle-template, product.f1-product, product | snosha-how-to-use |
| `_snosha-jdgm-cards-style` | Custom | product.bundle-template, product.f1-product, product | snosha-judgeme-reviews; static in snosha-judgeme-reviews |
| `_snosha-ld-cta` | Custom | product.bundle-template | snosha-long-description |
| `_snosha-ld-indicator` | Custom | product.f1-product, product | snosha-long-description |
| `_snosha-ld-item` | Custom | product.bundle-template, product.f1-product, product | snosha-long-description |
| `_snosha-ld-media` | Custom | product.bundle-template, product.f1-product, product | snosha-long-description; static in _snosha-ld-panel |
| `_snosha-ld-panel` | Custom | product.bundle-template, product.f1-product, product | snosha-long-description |
| `_snosha-ld-typography` | Custom | product.bundle-template, product.f1-product, product | snosha-long-description; static in snosha-long-description |
| `_snosha-review-screenshot` | Custom | product.f1-product, product | snosha-reviews-screenshots |
| `_snosha-reviews-rating` | Custom | product.f1-product, product | snosha-reviews-screenshots; static in snosha-reviews-screenshots |
| `_snosha-storage-item` | Custom | product.f1-product, product | snosha-storage-care |
| `_snosha-storage-tab-style` | Custom | product.f1-product, product | snosha-storage-care; static in snosha-storage-care |
| `_snosha-storage-tab` | Custom | product.f1-product, product | snosha-storage-care |
| `_snosha-trust-item` | Custom | product.bundle-template, product.f1-product, product | product-information |
| `_snosha-video-play` | Custom | product.f1-product, product | snosha-how-to-use-video; static in snosha-how-to-use-video |
| `_snosha-why-item` | Custom | index | snosha-why |
| `_social-link` | Native | — | — |
| `accelerated-checkout` | Native | product.bundle-template, product.f1-product, product | product-information; static in accelerated-checkout, buy-buttons |
| `accordion` | Native — modified | index, product.bundle-template, product.f1-product, product | snosha-faq, product-information |
| `add-to-cart` | Native | product.bundle-template, product.f1-product, product | product-information; static in buy-buttons |
| `button` | Native | 404, index | main-404, snosha-before-after |
| `buy-buttons` | Native | product.bundle-template, product.f1-product, product | product-information |
| `collection-card` | Native | — | — |
| `collection-title` | Native | index, list-collections | snosha-collections, main-collection-list |
| `comparison-slider` | Native — modified | index, product.f1-product, product | snosha-before-after |
| `contact-form-submit-button` | Native | page.contact | section; static in contact-form |
| `contact-form` | Native — modified | page.contact | section |
| `custom-liquid` | Native | collection, index, product.f1-product, product | main-collection, product-list, product-recommendations |
| `disclosures` | Native | — | — |
| `email-signup` | Native — modified | password, footer-group | password, footer |
| `featured-collection` | Native | — | — |
| `filters` | Native | collection, search | main-collection, search-results; static in main-collection, search-results |
| `follow-on-shop` | Native | — | — |
| `footer-copyright` | Native — modified | footer-group | footer-utilities |
| `footer-policy-list` | Native | footer-group | footer-utilities |
| `group` | Native | index, list-collections, product.bundle-template, product.f1-product, product, footer-group | snosha-before-after, main-collection-list, product-information, footer; static in carousel |
| `icon` | Native | — | — |
| `image` | Native | article | main-blog-post |
| `jumbo-text` | Native | — | — |
| `logo` | Native — modified | password, footer-group | password, footer |
| `menu` | Native | footer-group | footer |
| `page-content` | Native | page | main-page |
| `page` | Native | — | — |
| `payment-icons` | Native | — | — |
| `popup-link` | Native | — | — |
| `price` | Native — modified | collection, index, product.bundle-template, product.f1-product, product, search | main-collection, product-list, product-information, product-recommendations, search-results |
| `product-card` | Native | — | — |
| `product-custom-property` | Native | — | — |
| `product-description` | Native | — | — |
| `product-inventory` | Native | — | — |
| `product-recommendations` | Native | — | — |
| `product-title` | Native | collection, index, product.f1-product, product, search | main-collection, product-list, product-recommendations, search-results; static in _featured-product |
| `quantity` | Native | product.bundle-template, product.f1-product, product | product-information; static in buy-buttons |
| `review` | Native — modified | collection, index, product.bundle-template, product.f1-product, product | main-collection, product-list, product-information, product-recommendations |
| `sku` | Native | — | — |
| `snosha-benefits` | Custom | product.bundle-template, product.f1-product, product | product-information |
| `snosha-bundle-swatches` | Custom | product.bundle-template | product-information |
| `snosha-capsule` | Custom | product.f1-product, product | product-information |
| `snosha-complementary` | Custom | product.f1-product, product | product-information |
| `snosha-footer-language` | Custom | footer-group | footer-utilities |
| `snosha-icon` | Custom | index | snosha-before-after, snosha-why; static in _snosha-why-item |
| `snosha-product-link` | Custom | — | — |
| `snosha-product-rating` | Custom | — | — |
| `snosha-trust-list` | Custom | product.bundle-template, product.f1-product, product | product-information |
| `social-links` | Native — modified | footer-group | footer |
| `spacer` | Native | — | — |
| `swatches` | Native |  | static in _featured-product |
| `text` | Native | 404, article, blog, collection, index, list-collections, page.contact, page, password, product.bundle-template, product.f1-product, product, footer-group | main-404, main-blog-post, main-blog, section, snosha-collections, snosha-before-after, snosha-why, snosha-faq, main-collection-list, main-page, password, product-information, media-with-content, snosha-product-comparison, product-recommendations, footer; static in product-hotspots, snosha-faq, snosha-product-comparison, snosha-why, _snosha-why-item |
| `variant-picker` | Native — modified | product.bundle-template, product.f1-product, product | product-information |
| `video` | Native | — | — |

Section-local block types (defined inside section schemas, not files): `snosha-hero` → `slide`, `spec_chip`, `trust_item`; `snosha-f1-banner` → `spec`; `snosha-reels` → `reel`; `snosha-bundle` → `component`; `snosha-bundle-contents` → `item`; `snosha-bundle-value` → `row`. App block: Judge.me `cards_carousel` in `snosha-judgeme-reviews`.

### 8.3 [R2] Items missing from the original inventory

| Item | Origin | Templates | Notes |
|---|---|---|---|
| `templates/gift_card.liquid` | Native, unmodified (byte-equal to `448df6e`; also equal on the live theme) | — (Liquid template, no sections) | Renders only the stock snippets `stylesheets`, `theme-styles-variables` and `color-palette`. No Snosha code, no section, not a migration subject. |
| `shopify://apps/judge-me-reviews/blocks/cards_carousel/61ccd3b1-a9f2-4160-9fe9-4fec8413e5d8` | **External app block** (Judge.me) | product, product.f1-product, product.bundle-template | Inside `snosha-judgeme-reviews` (`@app` slot). See §10. |

---

## 9. [R2] Per-template inventory

"Instances" = section entries in the file's `sections` object (including disabled ones). "Types" = unique section types. Native sections are split into **stock** (identical to `448df6e`) and **extended** (stock file with additive Snosha settings, §3). "Block instances" = every nested block entry, counted recursively.

| File | Instances (disabled) | Unique types | Custom | Native: extended | Native: stock | Block instances | All types analyzed |
|---|---:|---:|---|---|---|---:|:-:|
| `templates/index.json` | 12 (0) | 11 | 9: hero, collections, f1-banner, before-after, reels, choose-care, bundle, why, faq | 3: `product-list` ×2, `featured-blog-posts` | 0 | 132 | ✅ |
| `templates/product.json` | 15 (1) | 14 | 12: comparison, reels ×2, how-to-use-video, before-after, judgeme-reviews, long-description, faq, how-to-use, storage-care, reviews-screenshots `[off]`, contact | 3: `product-information`, `product-recommendations`, `product-list` | 0 | 172 | ✅ |
| `templates/product.f1-product.json` | 14 (2) | 14 | 11: comparison `[off]`, how-to-use-video, before-after, judgeme-reviews, long-description, reels `[off]`, faq, how-to-use, storage-care, reviews-screenshots, contact | 3: same as product | 0 | 200 | ✅ |
| `templates/product.bundle-template.json` | 11 (0) | 9 | 9: bundle-contents, bundle-value, how-to-use ×2, long-description, contact ×2, judgeme-reviews, faq | 2: `product-information`, `media-with-content` | 0 | 121 | ✅ |
| `templates/collection.json` | 3 (1) | 3 | 1: collection-header | 1: `main-collection` | 1: `section` `[off]` | 10 | ✅ |
| `templates/search.json` | 2 (1) | 2 | 0 | 0 | 2: `search-header`, `search-results` `[off]` | 7 | ✅ |
| `templates/page.contact.json` | 2 (0) | 2 | 0 | 0 | 2: `main-page`, `section` | 4 | ✅ |
| `templates/page.json` | 1 (0) | 1 | 0 | 0 | 1: `main-page` | 2 | ✅ |
| `templates/blog.json` | 1 (0) | 1 | 0 | 1: `main-blog` | 0 | 11 | ✅ |
| `templates/article.json` | 1 (0) | 1 | 0 | 1: `main-blog-post` | 0 | 4 | ✅ |
| `templates/cart.json` | 1 (0) | 1 | 0 | 0 | 1: `main-cart` | 3 | ✅ |
| `templates/list-collections.json` | 1 (0) | 1 | 0 | 0 | 1: `main-collection-list` | 5 | ✅ |
| `templates/404.json` | 1 (0) | 1 | 0 | 0 | 1: `main-404` | 3 | ✅ |
| `templates/password.json` | 1 (0) | 1 | 0 | 0 | 1: `password` | 4 | ✅ |
| `templates/gift_card.liquid` | n/a | n/a | 0 | 0 | n/a (Liquid) | n/a | ✅ (R2) |
| `sections/header-group.json` | 2 (0) | 2 | 0 | 1: `header` | 1: `header-announcements` (its `_announcement` block is extended) | 3 | ✅ |
| `sections/footer-group.json` | 2 (0) | 2 | 0 | 2: `footer`, `footer-utilities` | 0 | 15 | ✅ |
| **Total** | **70 (5)** | — | **42 instances** | **17 instances** | **11 instances** | **696** | |

**Figma coverage per template:**
- **index:** design data for 4 sections (§13).
- **product / f1 / bundle:** frames recorded in the plan only. The bundle template has no frame.
- **collection:** no frame (built from a screenshot).
- **All other templates:** no Figma frame exists.
- No template was visually verified (rendered).

## 10. [R2] External app component: Judge.me (excluded from migration)

- **What:** Judge.me "Cards Carousel" app block (type above), configured with "Reviews selection: Current product" (plan log 2026-11-15). It is hosted in `snosha-judgeme-reviews` on 3 product templates.
- **Status:** external and app-owned. The app block itself is **excluded from any native migration**. Its rendering, data, card markup and movement belong to Judge.me.
- **Theme-side code that depends on it:**
  - `snosha-judgeme-reviews` (host section and rating summary);
  - `_snosha-jdgm-cards-style` (CSS variables for Judge.me cards);
  - `assets/snosha-jdgm-carousel.js` (navigation fixes, 333 lines);
  - `snippets/snosha-rating-stars.liquid`.
- **Rule:** moving the host section to a native section (§12, class C) would require reconfiguring the app block's settings in the new instance. That touches Judge.me configuration, which is out of scope without explicit approval.

## 11. [R2] Published-theme comparison (read-only)

- **Theme:** `#168066318552` **"Snosha/main" [live]** (`shopify theme list`, 2026-11-20). `CLAUDE.md` names "Horizon" as the live theme. That is out of date: "Horizon" `#168065859800` is now `[unpublished]`.
- **Method:** `shopify theme pull --theme 168066318552` into the **session scratchpad**, not the working tree (619 files). The pulled copy was compared with the repository file by file (assets, blocks, config, layout, locales, sections, snippets, templates). JSON was compared after removing the editor comment header and parsing. Other text files were compared after normalising CRLF/LF.

| Result | Count | Details |
|---|---:|---|
| Byte-identical | 55 | including `config/settings_data.json`, `templates/index.json`, `product.json`, `product.bundle-template.json`, `sections/footer-group.json` |
| Equal after line-ending / header normalisation | 550 | the local checkout uses CRLF and Shopify stores LF. Example: `sections/header-group.json` differs **only** in line endings. |
| **Different content** | **0** | — |
| Only in the repository | 0 | (the 14 `*.tmp.*` files are on both sides) |
| Only on the live theme | 0 | — |

- **Theme Editor settings vs local JSON:** none differ. All 14 JSON templates, both section groups and `settings_data.json` match local `HEAD` (`0bda5fb`).
- **Migration candidates affected:** none by content drift. The settings and content mappings in the plan are valid for the live theme as of today.
- **Process risk:**
  - **Evidence:** the live theme is named "Snosha/main" and carries the same git-tracked `*.tmp.*` files that `.shopifyignore` keeps the CLI from uploading. Its content equals the `main` branch.
  - **Inference, not verified in Admin:** that is consistent with the live theme being connected to the GitHub `main` branch.
  - **Consequence:** if so, **merging or pushing to `main` publishes to the live store.** The migration plan accounts for this (plan §3).
- **Not compared:** development theme `#168066810072` (out of scope). Compare it before each migration step, because the Theme Editor writes there.

## 12. [R2] Re-check of the 16 sections not recommended in revision 1

Classes:
- **A:** native + scoped CSS is enough.
- **B:** native + a small additive extension is enough.
- **C:** technically possible, but migration risk is high.
- **D:** native can't preserve essential function without effectively rebuilding the component.

Every A option assumes the shared prerequisite **P**: an additive `custom_class` on `sections/section.liquid`. Without it there's no stable CSS scope. P is counted once, not per section.

Native toolkit used for this check, all from Horizon 4.4.0 (`448df6e`):
- `section.liquid`: flex row/column, `vertical_on_mobile`, background image/video, overlay, height, border, radius, padding; blocks `@theme`, `@app`.
- `group.liquid`: the same, plus width/height and `link`.
- `text.liquid` (`text: richtext`, presets, colour, background, radius).
- `image.liquid` (picker, dynamic sources, ratio, radius).
- `video.liquid` + `snippets/video.liquid`.
- `button.liquid` (`link: url`).
- `product-card.liquid`: a public block with a `product` picker and nested `text`, `image`, `price`, `review`, `_product-card-gallery`, `product-title`.
- `carousel.liquid` → `_carousel-content` → `_card` (with `text`, `image`, `video`, `product-card`, `@theme`).
- `layered-slideshow.liquid` (ARIA tabs).
- `product-hotspots.liquid` (`_hotspot-product`: product, x, y).
- `featured-product.liquid` (product, layout only).
- `price.liquid`, `review.liquid` (extended), `collection-title.liquid`.

| Section | Class | Native recipe | Exact gap / reason | Horizon evidence | Risk |
|---|:-:|---|---|---|:-:|
| `snosha-how-to-use` | **A** | `section` → `text` (H2) + `group` panel (border, radius, padding) → `text` with the steps as a richtext **numbered list** + `group` note (`snosha-icon` + `text`) | Step numbering becomes CSS counters on `.rte ol li`. The 8 step blocks become one rich-text field (drag-reorder lost; the list is edited in the RTE). | `blocks/text.liquid` (`text: richtext`); `assets/base.css:1317–1323` styles `.rte ol`. Whether the Theme Editor RTE emits `<ol>` needs a one-time check. | Medium (4 instances incl. 2 on bundle; translations re-entered) |
| `snosha-bundle-contents` | **A** | `section` → `text` ×2 + `group` grid → per item `group` (border, radius, background) → `snosha-icon` (tile) + `text` (title) + `text` with `background` + `corner_radius` (quantity badge) | The 3 / 2 / compact-row layouts become CSS grid. The 4-setting local `item` blocks become nested blocks. | `group.liquid`, `text.liquid` (`background`, `background_color`, `corner_radius`) | Medium (template finalised 2026-11-19, ar/en translations) |
| `snosha-f1-banner` | **A** | `section` (row, background colour) → `group` copy (`text` tag, H2 with `<strong>` highlight, `text`, `button` → product URL) + `image` (product) + `group` specs → `snosha-icon` + `text` | Waves, arc and watermark become CSS pseudo-elements with the existing `assets/snosha-f1-*` files and `z-index` layering under the class. Mobile image: a second `image` block hidden ≥ 750 (CSS). 22 colour settings become CSS tokens (editor loss). | `section.liquid`, `image.liquid` (no mobile picker), `text.liquid` richtext | Medium (1 instance; complex CSS; decorative layering must be re-measured) |
| `snosha-collections` | **B** | `collection-list` (carousel) + opt-in `snosha_style` group | Tablet / mobile card counts, arrow and progress colours, progress flag and script. The `product-list.liquid` pattern. | `sections/collection-list.liquid` schema; same `resource-list` call as `snosha-collections.liquid:37–61` | Low–Med |
| `snosha-how-to-use-video` | **B** | `section` "Video section" preset → `text` + `video` | Uploaded video: no custom or mobile poster, starts muted (with controls). Small opt-in on `video.liquid`: `cover_image` for uploaded source + "play with sound". The overlay and play button become CSS. YouTube / Vimeo already play unmuted with a cover. | `blocks/video.liquid:13–29, 90–129`; `snippets/video.liquid:47–117`. `video` block isn't placed anywhere today, so the opt-in is inert. | Medium (2 templates) |
| `snosha-contact` | **B** | `section` → `group` card (background, radius, padding) → `image` (logo) + `text` ×2 + `group` row → `button` ×2 | WhatsApp: `button.link` = `https://wa.me/<digits>` (external URL, accepted). Email `mailto:` and the CTA in-page anchor in a `url` setting: **not verified**; if rejected, a small `link` text-setting opt-in is needed. Lost: "hide buttons until valid". Rings and dots become CSS. | `blocks/button.liquid` (`link: url`); Shopify docs: `url` accepts "external URLs and relative paths" (no statement on `mailto:`) | Medium (3 instances incl. `snosha-gift` variant) |
| `snosha-collection-header` | **B** | `section` → `collection-title` + `text` (dynamic `collection.description`) + `image` (dynamic `collection.image`) + **small breadcrumbs block** wrapping the existing `snippets/snosha-breadcrumbs.liquid` | Horizon has no breadcrumbs. Line clamp and the mobile-image toggle become CSS. | `blocks/collection-title.liquid`; no breadcrumbs file in `448df6e` | Low (1 instance) |
| `snosha-reviews-screenshots` | **B** | `carousel` → static `group` header + `_carousel-content` → `_card` → `image` per screenshot | Progress bar: opt-in on `carousel.liquid` (the `product-list` pattern). Rating pill: replace the **manual** rating with native `review` (`show_rating_value`, synced metafields). That is a data-source change and needs approval. | `sections/carousel.liquid:27–29`; `blocks/_card.liquid` allowed blocks; `blocks/review.liquid` | Low–Med (only f1 active) |
| `snosha-bundle-value` | **B** | `section` → `text` ×2 + `group` breakdown (rows = `group` → `text` + `text`) + `group` panel → `price` (product price + compare-at) | Savings amount (compare-at − price) isn't output by `price`; needs a small opt-in "show savings amount". "Manual" mode = text blocks. | `blocks/price.liquid` (extended; no savings-amount setting) | Medium (bundle translations) |
| `snosha-reels` | **C** | `carousel` → `_card` → `video` + `product-card` | Uploaded video: muted start (unmutable via controls) and `preview_image` poster only. Middle-reel start, mouse drag and the overflow flag (`<snosha-reels-carousel>`) have no confirmed native equivalent. 38 settings collapse. | `blocks/_card.liquid`, `snippets/video.liquid:117`, `assets/main.js` (SnoshaSnapCarousel) | High (2 instances, behaviour loss) |
| `snosha-choose-care` | **C** | `section` / `carousel` → `product-card` ×3 (product picker; nested `text`, `image`, `price`) | Featured-card variant, per-card overrides, a static row ≥ 990 that becomes a carousel opening on the featured card (JS), and spec rows with icons: `product-card` doesn't accept `snosha-icon` (`@app` only beyond its list). Per-card styling has no class hook. | `blocks/product-card.liquid` allowed blocks | High |
| `snosha-long-description` | **C** | 7 × (`group` per panel: row/column → `text`, `image`, `group` rows → `snosha-icon` + `text`) in one or several `section`s | Doable with CSS. But the shared instance holds 7 panels / 21 rows / 31–50 blocks on 3 templates (bundle with ar/en), and the indicator lights and typography block become CSS. | `group.liquid`, `text.liquid`, `image.liquid` | High (volume, 3 templates, translations) |
| `snosha-storage-care` | **C** | `layered-slideshow` → `_layered-slide` (`text` richtext lists) | Native ARIA tabs exist, but in a layered horizontal-panel layout (`--inactive-tabs-width`, `--active-panel-width`) with its own JS. Restyling it into a pill bar + single card overrides the component's core layout. The empty-tab message and "hide empty tabs" are lost. | `sections/layered-slideshow.liquid:39–112` | High |
| `snosha-judgeme-reviews` | **C** | `section` → `text` + `review` (`show_rating_value`) + `@app` Judge.me block | The card-style block becomes CSS. `snosha-jdgm-carousel.js` needs a loader (extension). **The Judge.me block must be re-configured in the new instance** (§10). | `section.liquid` allows `@app`; `blocks/review.liquid` | High (third-party app) |
| `snosha-hero` | **D** | (`hero` + `slideshow`) | Spec chips placed by merchant-editable x/y reference pixels on the product image (no native block has position settings). **Per-language slide images** (`image_*_ar` / `image_*_en`). A fixed hero copy over an optional slideshow. A trust card overlapping the next band. Reproducing these needs new positioned and localized-media blocks, which is a rebuild. | `sections/hero.liquid` schema (2 media + mobile media, `@theme` blocks, no positioning); `blocks/group.liquid` (no x/y) | — |
| `snosha-bundle` | **D** | (`product-hotspots` + `featured-product`) | One section must combine hotspots over an image, synced component rows, and **add to cart of a different (bundle) product** with its total and compare-at. `_hotspot-product` = product + x + y only. `featured-product` = product + layout, no composition. Two stacked sections can't keep the layout. | `sections/product-hotspots.liquid`, `blocks/_hotspot-product.liquid`, `sections/featured-product.liquid` schemas | — |
| `snosha-product-comparison` | **D** | (`section` + `group` rows) | Groups render `div`s, so the semantic `<table>` / `th scope` structure (accessibility) would be lost. Per-cell **mobile alternate copy** would need duplicate blocks per breakpoint (double content and translations). | `blocks/group.liquid` markup; no native table | — |

**Re-check result for the 16 sections:** **3 A** (how-to-use, bundle-contents, f1-banner) · **5 B** (how-to-use-video, contact, collection-header, reviews-screenshots, bundle-value) · **5 C** (reels, choose-care, long-description, storage-care, judgeme-reviews) · **3 D** (hero, bundle, product-comparison).

**All 20 custom sections**, adding the 4 revision-1 candidates (`snosha-faq`, `snosha-why`, `snosha-before-after` = A; `snosha-collections` = B): **6 A · 6 B · 5 C · 3 D**. (`snosha-collections` sits in the table above only to show its recipe next to the others.)

## 13. [R2] Figma fidelity check: the 4 candidates

**Sources inspected today:**
- desktop: `get_design_context` with screenshot, for Why `190:4024`, FAQ `217:14604`, Before/After `190:3903`, Collections `190:3830`;
- mobile: `get_metadata` (geometry only) for `190:4361`, `217:14813`, `190:4222`, `190:4133`.

Mobile typography was not re-read. No screenshot was saved (speed mode).

**Rendered status:** **NOT VISUALLY VERIFIED.** The native versions don't exist yet, and the current implementations were not rendered in this audit. The scores below compare the **Figma specification** with what each native recipe can express; they don't measure a render.

| Aspect | `snosha-why` | `snosha-faq` | `snosha-before-after` | `snosha-collections` |
|---|---|---|---|---|
| **Figma layout (desktop)** | bg `#F0FAFE`, padding 60. Heading column gap 6. 4 equal columns, gap 32, item gap 14, centered. | padding 60. Heading → columns gap 61. 2 columns 656, gap 24. Rows gap 12. | Row gap 27. Slider 774 × 535, r18. Content column 557, gap 20. 4 benefit rows (gap 14, tile on the inline start in RTL). Secondary CTA. | padding 50 / 101. Heading → track 40. Cards 292 × 368 (1:1 image r12, gap 18, title 24/40). Track gap 24, end padding 72, peek on one side. Arrows 44 × 44, 50 px from the edges. |
| **Figma layout (mobile 390)** | Gutter 24. 2 × 2 grid of 165 × 190, gaps 12. | Inset 20 (not the global 24). One list of 6, gap 12, order = left column then right column. | Gutter 24. Slider 342 × 248 on top, then content (gap 20). Benefit rows 77 tall. CTA 194 × 52 at the inline end. | Cards 97 × 152, gap 10, peek. Progress bar 350 × 4 (fill 140) 20 px inset. |
| **Native fit: layout** | Native row + fill columns = 4 equal columns ✅. 2 × 2 mobile needs CSS grid (native `vertical_on_mobile` gives 1 column). | Native row + `vertical_on_mobile` ✅. RTL column order (left column first in DOM) needs CSS `row-reverse` on desktop, as the current CSS does. 20 px mobile inset needs CSS. | Native row (Image compare preset) ✅. RTL slider-left / mobile slider-top order needs CSS, as now. | Same `resource-list` carousel ✅. 4.6-card peek, end padding and 97-px mobile cards need CSS (native `mobile_card_size` is only 60 or 44 cqw), as now. |
| **Typography** | H2 32/52 SemiBold, body 18/32: native `text` presets + tokens ✅. Item title 18/30 = `font_size 1.125rem` ✅. Description **13/22: not a native font-size option** → CSS. | H2 / body as Why ✅. Question 16/27 SemiBold and answer 16/28: accordion / text presets + CSS line heights. | H2 32/52 ✅. Body 18/32 ✅. Benefit title 16/27 ✅. Description 14/24 = `0.875rem` ✅ + CSS line height. Chip 13/18 → CSS. | H2 ✅. Card title 24/40 (H3 preset) ✅. |
| **Images and icons** | 96-px gradient tile (border `color2`, inset highlight, drop shadow) + 64-px illustrations: existing `snosha-icon` "large" ✅. Sparkles 25 / 12 → CSS with `assets/snosha-sparkle-*.svg`. | Chevron 18 px: the extended `accordion` `snosha_style` icon ✅. | Slider image (merchant) ✅. Handle 34 × 58 with 3 grips, labels → CSS on native `comparison-slider` ✅. 40-px tile icons → `snosha-icon` ✅. | Collection images from the picker ✅. Arrow chevron 22 → native `icons_style: chevron` + CSS. |
| **Responsive / RTL-LTR** | Breakpoints 750 / 990 only ✅. Logical properties ✅. | Order handled in CSS for RTL; LTR order follows DOM ✅. | As FAQ ✅. | Native slideshow RTL ✅ (already in use). |
| **Theme Editor** | − 3 column-count ranges, 6 colours → text-block colours / tokens; + native layout controls. | Colours move to `accordion` (exists) ✅. − mobile padding settings → CSS. | − 3 slider colours → CSS tokens. | Same controls after the opt-in extension ✅. |
| **Function** | Static ✅ | Same `accordion-custom` ✅ | Same `comparison-slider` ✅ | Same `slideshow` + progress module ✅ |
| **Similarity (L/F/E/R/D → overall)** | 90 / 100 / 80 / 80 / 100 → **90%** (rev. 1: 88%) | 90 / 100 / 85 / 85 / 100 → **92%** (rev. 1: 91%) | 90 / 100 / 80 / 85 / 100 → **91%** (rev. 1: 91%) | 95 / 95 / 85 / 90 / 100 → **93%** with the opt-in extension (rev. 1: 90%) |
| **Verdict** | Figma data supports the native recipe. **NOT VISUALLY VERIFIED.** | Same. **NOT VISUALLY VERIFIED.** | Same. **NOT VISUALLY VERIFIED.** | Same. **NOT VISUALLY VERIFIED.** |

Why the scores moved: the estimates now rest on inspected Figma values (gaps, sizes, type scale, mobile grid) instead of structure alone. The only remaining deductions are verified needs for CSS or lost editor controls. None of the four needs new markup beyond native blocks.
