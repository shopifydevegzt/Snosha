# SNOSHA — Native Horizon Migration Plan

> Date: 2026-11-20 · Based on `SNOSHA_NATIVE_HORIZON_AUDIT.md` (same date, `main` @ `0bda5fb`).
> **Plan only. Nothing here has been implemented.** Each step needs separate approval and runs on an isolated branch or worktree. No push, publish or live-theme change. No changes to prices, inventory, Simple Bundles, Judge.me, product data or existing translations.
>
> **Revision 2 (2026-11-20).** Added:
> - the per-candidate cards with all decision fields (§11);
> - a second wave of candidates from the re-check (audit §12);
> - the updated similarities from the Figma data check (audit §13);
> - a **live-theme / `main` branch safety rule** (§3, rule 0) after the published-theme comparison (audit §11).
>
> §1–§10 are kept. Where revision 2 changes them, the text is marked **[R2]**.

## 1. Scope

| In scope (recommended) | Category | Similarity |
|---|:-:|---:|
| M0. Retire the 2 unused blocks `snosha-product-rating`, `snosha-product-link` (after confirming with the merchant that they are unused) | E | 84% |
| M1. `snosha-why` (+ `_snosha-why-item`) → native `section` ("Icons with text" composition) | C (R2: A) | 88% → **[R2] 90%** |
| M2. `snosha-faq` → native `section` ("FAQ section" composition) | C (R2: A) | 91% → **[R2] 92%** |
| M3. `snosha-collections` → native `collection-list` (carousel) | C (R2: B) | 90% → **[R2] 93%** |
| M4. `snosha-before-after` → native `section` ("Image compare" composition) | C (R2: A) | 91% → **[R2] 91%** |
| H. Housekeeping: untrack the 14 `assets/*.tmp.*` files | — | — |

**[R2] Second wave (from the re-check, audit §12):** see §11.2. In priority order:
1. `snosha-collection-header` (B, Low)
2. `snosha-reviews-screenshots` (B, Low–Med)
3. `snosha-how-to-use` (A, Medium)
4. `snosha-how-to-use-video` (B, Medium)
5. `snosha-contact` (B, Medium)
6. `snosha-f1-banner` (A, Medium)
7. `snosha-bundle-contents` (A, Medium)
8. `snosha-bundle-value` (B, Medium)

None of them starts before wave 1 (M1–M4) has been approved.

**[R2] Do not migrate:** class C (`snosha-reels`, `snosha-choose-care`, `snosha-long-description`, `snosha-storage-care`, `snosha-judgeme-reviews`: possible, but high risk) and class D (`snosha-hero`, `snosha-bundle`, `snosha-product-comparison`). The "must remain custom" list below is superseded by this split.

**Deferred (feasible, not recommended now):** `snosha-bundle-contents`, `snosha-benefits`, `snosha-trust-list`, `snosha-capsule`. Revisit only if the merchant asks for it or if a `custom_class` on `blocks/group.liquid` is approved for other reasons (audit §4.2).

**Must remain custom (do not migrate):**
- Sections: `snosha-hero`, `snosha-f1-banner`, `snosha-reels`, `snosha-choose-care`, `snosha-bundle`, `snosha-product-comparison`, `snosha-long-description`, `snosha-storage-care`, `snosha-how-to-use`, `snosha-how-to-use-video`, `snosha-contact`, `snosha-collection-header`, `snosha-reviews-screenshots`, `snosha-judgeme-reviews`, `snosha-bundle-value`.
- Blocks: `snosha-icon`, `snosha-complementary`, `snosha-footer-language`, `snosha-bundle-swatches`, plus all private children of these sections.
- Reasons are in audit §4.3.

## 2. Recommended order and rationale

| Order | Step | Why this position | Risk | Complexity |
|---|---|---|:-:|:-:|
| 1 | **H** housekeeping | No runtime effect (the files are ignored by Shopify) | Low | XS |
| 2 | **M0** unused blocks | No template references them. Deleting the files changes nothing that renders. | Low | XS |
| 3 | **P** prerequisite: additive `custom_class` on `sections/section.liquid` | Unblocks M1, M2 and M4. Inert when blank. | Low | S |
| 4 | **M1** Why | Homepage only, 1 instance, static content, no JS | Low | S |
| 5 | **M2** FAQ | Same composition as the stock preset. It has 4 instances: the homepage, plus the instance ID `snosha_faq_raP3iT` repeated in 3 product templates (diff their content first; it may differ per template). | Low–Med | S |
| 6 | **M3** Collections | Homepage only. Needs an opt-in settings group on `collection-list` (the `product-list` pattern). | Low–Med | M |
| 7 | **M4** Before / After | 3 instances (homepage, plus product and f1 with the `--product` variant). Slider colours need a home. | Medium | M |

One component per branch or commit, with a full check before the next one starts. Stop after each step for the user's review.

## 3. Common rules for every step

0. **[R2] Live theme and `main`.** The live theme `#168066318552` is "Snosha/main", and its content equals the `main` branch (audit §11). It is probably GitHub-connected; confirm this in Admin → Online Store → Themes before any step. Until that is ruled out:
   - **never merge or push a migration branch into `main`**, because that may publish it;
   - test only on the development theme `#168066810072`;
   - compare that dev theme's JSON with the repo before each step, because the Theme Editor writes there.
1. **Branch / worktree:** `migrate/<step>` from `main` (for example `git worktree add ../snosha-migrate-why -b migrate/why`). Only after approval.
2. **Keep the old section file** until the new instance is verified and approved. Disable the old instance with `"disabled": true`; don't delete it. Its data stays as the rollback.
3. **Template JSON edits:** targeted text replacement only. Keep the `/* … */` header. Don't re-serialise. Theme Editor saves on the dev theme can overwrite local files, so pull or compare before editing (the plan log records this, 2026-11-16).
4. **CSS:** move the migrated scope from `assets/dev1.css` into `assets/main.css` under a stable class. Use native CSS nesting, no `!important`, no hard-coded brand colours (palette tokens or setting variables only), breakpoints 750 / 990 only.
5. **Stable scope:** the merchant `custom_class` value is the scope for these sections, set in the template as `snosha-why`, `snosha-faq` and so on. Because the merchant can clear it, the step also adds a fixed fallback in the template data only. No hard-coded selector on `section.liquid`'s shared wrapper.
6. **Translations:** moving content to a new section instance creates new section and block IDs, and Translate & Adapt keys theme content by those IDs. Before switching:
   - export the current English and other values for the old instance;
   - after switching, re-register them for the new keys. Adapt `tools/translations/snosha-bundle/register-en.mjs` (it maps by Arabic source value; run it as a dry run first, and with `--apply` only with approval and only against the **development theme**);
   - never run it against the live theme without explicit approval.
7. **Checks per step (speed mode):** JSON and schema parse; Theme Check against the 10-offense baseline; `git diff --check`; `node --check` if JS changes. Visual comparison happens only when the user asks for Visual QA. If it isn't requested, the step is reported as **Not visually verified** and can't be marked done.

## 4. Steps in detail

### H — Untrack temp files
- **Change:** `git rm --cached assets/*.tmp.*` (14 files listed in audit §6). Files on disk can be deleted afterwards.
- **Verify:** `git status`; the `.gitignore` rule `*.tmp.*` keeps them out from then on.
- **Rollback:** revert the commit.

### M0 — Remove unused blocks
| Item | `blocks/snosha-product-rating.liquid` | `blocks/snosha-product-link.liquid` |
|---|---|---|
| References | None in templates or groups. Only comments in `snosha-judgeme-reviews.liquid:10` and `snosha-rating-stars.liquid:8`. | None |
| Native equivalent | `blocks/review.liquid` (`show_rating_value`, `show_number`, `label`), already in the Buy Box | `blocks/button.liquid` (`button-unstyled`, product link) |
| Missing | Proportional (non-half) stars and the Figma star shape | The label doesn't default to the product title |
| Keep | `snippets/snosha-rating-stars.liquid` (used by 2 other components) | — |
| Pre-check | Confirm on the **dev and live** theme in the Theme Editor that neither block was added after the last pull (`shopify theme pull --only templates/*.json` into a scratch folder, read-only, or ask the merchant) | Same |
| Change | Delete the file. Update the two comments. Remove `.snosha-rating` CSS only if no other user remains (`grep`). | Delete the file. Remove `.snosha-product-link` CSS. |
| Rollback | Restore the file from git | Same |

### P — `custom_class` on `sections/section.liquid` (prerequisite for M1, M2, M4)
- **Schema:** append `{ "type": "text", "id": "custom_class", "label": "Custom CSS class" }`. No locale edit (plain-string label, project rule).
- **Liquid:** add `{{ section.settings.custom_class | strip | escape }}` to the existing wrapper's class list, guarded for blank. Keep `section-wrapper` and every native attribute. Only one place changes.
- **Consumers to re-check:** `page.contact` (`form`) and `collection` (`section`, disabled). Blank means identical output.
- **Document:** a short note in `CLAUDE.md` / the project plan ("core branch: custom_class on section.liquid").
- **Optional, decide during M1:** an opt-in `snosha_mobile_padding_top/bottom` pair. Otherwise the mobile paddings stay in CSS under the custom class, which is the recommended option because it avoids more core settings.

### M1 — `snosha-why` → native `section`

> **Status 2026-11-20: proof of concept built and measured, not switched.**
> - **Built:** native composition in `templates/page.snosha-dev-why-native.json` (dev-only).
> - **Measured:** identical to the original at 5 widths in RTL and LTR.
> - **Implementation differences from the plan below:**
>   - flat structure (`heading`, `subtitle` and `benefit_*` groups are direct section children, so the old block IDs and translation key paths are kept);
>   - CSS class `snosha-why-native`;
>   - shadow colour through the new optional `snosha-icon` `tile_shadow_color` setting.
> - **Pending:** the switch in `index.json`, the dev-theme translation check, and Theme Editor checks.
>
> **Status 2026-11-20 (later): switched on the development theme only.**
> - **Switch:** `templates/index.json → snosha_why` is now the native `section`, with the same ID and position, via a targeted text replacement. It was synced by `theme dev` to `#168066810072`; the live theme is untouched.
> - **Measured:** dev homepage = original, 0 of 10 runs differ (RTL + LTR, 1480 / 990 / 768 / 390 / 320).
> - **Translations:** all 10 keys and digests are identical to live, so the live English translations stay attached. The only proposed change is the subtitle wording ("skincare" → "oral care"), in `tools/translations/snosha-why/why-en.json`; not registered.
> - **Still open:** Theme Editor UI check (no admin session).
> - **Rollback:** restore `templates/index.json` from git `HEAD`.
>
> **Status 2026-11-20 (editor flexibility).** Two generic, off-by-default extensions on the native `section`:
> - "Arrange blocks in a grid" with columns for desktop / tablet / mobile (`.section--snosha-grid`);
> - "Custom mobile padding" with top / bottom (`.section--snosha-mobile-padding`).
>
> The `snosha_why` instance uses 4 / 4 / 2 and 60 / 48. The hard-coded columns and mobile padding were removed from `.snosha-why-native`.
>
> Verified:
> - homepage = original in 10 / 10 runs;
> - with 3 / 2 / 1 columns and 30 / 20 padding on both the original and the native section: identical in 10 / 10 runs;
> - other native `section` instances: unchanged markup.
>
> Theme Editor UI: **UNVERIFIED** (no admin session).
>
> **Status 2026-11-20 (final pre-push validation).**
> - **Gap:** the native Gap setting now drives the gap between benefits from 750px (gap scale pinned to 1 inside `.snosha-why-native` only; section value 32). Mobile stays the design's 12px.
> - **Cleanup:** `templates/page.snosha-dev-why-native.json` deleted (not used by any published page) and removed from the dev theme.
> - **Dev theme:** equals local (0 differences).
> - **Final homepage:** = original geometry, 10 / 10 runs.
> - **Behaviour test:** gap 20, 5 benefits and reversed order behave correctly.
> - **Translations:** 10 / 10 keys and digests identical to live.
> - **Checks:** Theme Check 190 = HEAD; `git diff --check` clean.
> - **Not committed.**
- **Native reuse:** `sections/section.liquid` with a block tree equal to the stock "Icons with text" preset, using the existing project `snosha-icon` instead of `icon`:
  ```
  section (content_direction: column, custom_class: "snosha-why")
  ├─ group "heading" (column, center)
  │   ├─ text (heading, H2)   ← content of static block id "heading"
  │   └─ text (subtitle)      ← content of static block id "subtitle"
  └─ group "grid" (row, vertical_on_mobile: false)
      └─ 4 × group (column)   ← one per _snosha-why-item
          ├─ snosha-icon (size: large, same icon option)
          ├─ text (title)
          └─ text (description)
  ```
- **Content migration:** copy every setting value of `templates/index.json → snosha_why` (static `heading` / `subtitle` text blocks, the 4 items with their nested `snosha-icon` and `text` blocks) into the new tree. Same text and same icon options. The new instance goes right after `snosha_blog` in `order`. Disable the old one.
- **CSS (main.css, `.snosha-why`):** move the existing `.snosha-why` rules. Retarget `__heading` and `__grid` to `> .section-content-wrapper > .group-block:first-child / :last-child`, or to the group `custom`-free structure (confirm the real wrapper classes in `section.liquid` / `group.liquid` while implementing). Grid: 4 columns ≥ 990, 2 × 2 below (Figma `190:4361`). Sparkles: `::before` / `::after` with the existing `assets/snosha-sparkle-*.svg`, `aria-hidden` by nature.
- **Editor change:** the column-count ranges (`columns_desktop` / `tablet` / `mobile`) are replaced by fixed CSS. Accept this, or add them as opt-in section settings in P. Colours: text colours on the `text` blocks; the shadow colour becomes a CSS token.
- **Retire after approval:** `sections/snosha-why.liquid`, `blocks/_snosha-why-item.liquid`.
- **Risk:** Low (homepage only, static).

### M2 — `snosha-faq` → native `section`

> **Status 2026-11-20: migrated on the development theme only (local, not committed).**
>
> **Instances (4, all migrated, same IDs and positions):**
> - `index.json → snosha_faq` (12 / 12);
> - `product.json → snosha_faq_raP3iT` (9 / 15);
> - `product.f1-product.json → snosha_faq_raP3iT` (8 / 14);
> - `product.bundle-template.json → snosha_faq_raP3iT` (10 / 11).
>
> **Composition:** native `section`, with `heading` / `subtitle` text blocks and the existing two `accordion` → `_accordion-row` → `text` blocks as direct children. All IDs, rows, answers and "open by default" flags are unchanged.
>
> **Reused, no new settings:**
> - generic grid opt-in (columns 2 / 2 / 1);
> - mobile padding opt-in (old mobile values);
> - native background, padding and Gap (24 = the column gap);
> - each accordion's existing "Snosha card style" carries the old section colours (row, open row, border, question, chevron, answer);
> - heading and subtitle colours live on the text blocks.
>
> **CSS:** `.snosha-faq-native` in `assets/main.css`, holding only the differences from the card style plus the section rhythm, and the product-page 14px mobile rule. No JavaScript (native `accordion-custom`).
>
> **QA (dev theme, real pages):**
> - Original vs native: 0 / 40 runs differ (4 pages, RTL + LTR, 1480 / 990 / 768 / 390 / 320), covering initial, click-toggle and keyboard-toggle states, the focus ring, the Buy Box accordion control, overflow and JS errors.
> - Editor-equivalent setting tests passed and were restored byte-for-byte.
> - Fixed during QA: the subtitle grid row collapsed at ≥ 750 because its negative margin exceeded its height (+23px).
>
> **Translations:** 87 / 87 keys and digests identical. The dev bundle FAQ's 25 English strings survived the swap (0 outdated), so no registration is needed.
>
> **Pre-existing, unrelated to the migration:** 5 live homepage answers are outdated and all hold the warranty answer. The correction is prepared in `tools/translations/snosha-faq/faq-en.json` (dry run: 5 updates; not registered). The F1 FAQ has no English (38 keys); 1 bundle answer has no English.
>
> **Theme Editor UI:** UNVERIFIED (no admin session).
>
> **Pre-push preparation (2026-11-20).**
> - **M1 Why gap fix:** rows keep the design rhythm (32 / 12); Gap drives the horizontal benefit gap only. The heading and subtitle spacing moved to their bottom margins, so no grid row collapses at any Gap (0–100). Before the fix the subtitle row collapsed above Gap 32.
>   - Verified: Gap 20 / 32 / 40 / 48 in RTL + LTR at 1480 / 768 / 390, and the original geometry at Gap 32 (10 / 10).
> - **M2 FAQ:** static integrity check 4 / 4 instances; visual smoke 16 / 16 match the original.
> - **Translations:** FAQ correction dry run = 5 updates on live (not registered). Free-shipping answer on hold: policy conflict.
> - **Dev theme:** equals local.
- **Native reuse:** stock "FAQ section" composition: `section` (column) → `group` [heading `text`, subtitle `text`] + `group` (row, `vertical_on_mobile: true`) → 2 × `accordion` (`snosha_style: true`, same 9 colour settings already on the block) → `_accordion-row` → `text`.
- **Content migration:** the existing `accordion` and `_accordion-row` blocks are copied with **their settings unchanged** (questions, answers, `open_by_default` on the warranty row, `snosha_icon`, `hide_when_empty`). The section colours map as follows:

  | `snosha-faq` setting | New home |
  |---|---|
  | `heading_color`, `subtitle_color` | `text` block colour |
  | `question_color`, `chevron_color`, `item_background_color`, `item_open_background_color`, `border_color`, `answer_color` | `accordion` `snosha_*` colours (already exist) |
  | `background_color` | section `background_color` |
  | paddings | native padding (desktop) + CSS (mobile) |
- **Instances:** `index → snosha_faq` and `snosha_faq_raP3iT` on `product`, `product.f1-product` and `product.bundle-template`. Migrate the homepage first, then the product templates in one commit, because they share one instance ID and content.
- **CSS:** `.snosha-faq` moves to `main.css`. Its inner selectors already target `.accordion` / `.text-block` (audit §4.1). Replace `__columns` with the row group.
- **SEO:** FAQ JSON-LD is unaffected (`snippets/schema-faq.liquid` reads page content).
- **Retire after approval:** `sections/snosha-faq.liquid`.
- **Risk:** Low–Medium (4 templates; translations of up to 14 question/answer strings must be re-registered).

### M3 — `snosha-collections` → native `collection-list`

> **Status 2026-11-20: migrated on the development theme only (local, not committed).**
>
> **Instance (1):** `index.json → snosha_collections`, position 2 / 12, same ID. Collections, heading block and static `_collection-card` (image + title) are unchanged.
>
> **Native:** `sections/collection-list.liquid`, using the same render path as before (resource-list → carousel → slideshow).
>
> **New opt-in** (off by default; with it off a plain collection-list renders no Snosha class, attribute, variable or script — checked on a temporary template, since removed). "Snosha collections style" adds:
> - the `.snosha-collections-native` scope;
> - the shared mobile progress bar (`data-snosha-carousel-progress` + fallback script);
> - arrows that hide when every card fits (`data-carousel-arrows="auto"`);
> - settings: tablet / mobile cards per row, mobile padding, 4 arrow colours and 3 progress colours (13 settings in all, with `custom_class`; the section now has 30).
>
> **Native settings now driving the design:**
> - Columns (desktop cards per row, 4);
> - Horizontal gap (desktop, 24);
> - Gap (heading → carousel, 40);
> - Top / Bottom (50 / 100, plus a 1px CSS constant because the setting stops at 100);
> - Arrows (chevron).
>
> **CSS:** `.snosha-collections-native` in `assets/main.css`; `dev1.css` shared progress selector + `.snosha-collections-native`. Old `.snosha-collections` CSS is kept for rollback. No new JS.
>
> **QA:**
> - Original vs native: 0 / 10 runs differ (RTL + LTR, 1480 / 990 / 768 / 390 / 320), covering geometry, cards, links, images, arrows, Next click, keyboard Enter, focus ring, progress track and fill, scroll direction, overflow and JS errors.
> - Fixed during QA: the 1px for Figma's 101px bottom first sat inside the carousel box; it now sits below the list.
> - Editor-equivalent tests passed and were restored: columns 3 / 2 / 2 give whole cards + peek; gaps, padding, arrow colour, collection reorder, arrows off, 3 collections (adaptive, no peek).
>
> **Translations:** 1 key (heading), same key / digest / Arabic; the live English "SNOSHA Collections" stays attached. Collection titles come from collection data.
>
> **Theme Editor UI:** UNVERIFIED (no admin session).
- **Native extension (follow `sections/product-list.liquid` exactly):** add to `sections/collection-list.liquid` an opt-in group, default off:
  - `custom_class`;
  - `snosha_style` (adds the `snosha-collections` scope and the `data-snosha-carousel-progress` flag, and loads `snosha-carousel-progress.js` like `product-list.liquid:181`);
  - `snosha_columns_tablet`;
  - arrow colours (background, border, icon, shadow) and progress colours (track, start, end), defaulting to palette keys.

  Consumers of `collection-list`: **none in templates** (audit inventory), so the extension is inert.
- **Settings mapping:**

  | `snosha-collections` | `collection-list` |
  |---|---|
  | `collection_list` | `collection_list` |
  | `layout_type` | `layout_type: carousel` |
  | `cards_desktop` | `columns` |
  | `cards_mobile` | `mobile_card_size` / CSS |
  | `cards_tablet` | `snosha_columns_tablet` |
  | `icons_style` | `icons_style` |
  | colours, `custom_class` | the new opt-in settings |
- **Content migration:** the heading `text` / `group` blocks and the static `_collection-card` (id `static-collection-card`) settings are copied into the new instance. The collection selection is copied too (currently placeholders unless the merchant has picked collections; pull before editing).
- **CSS:** `.snosha-collections` already targets `.resource-list__carousel` / `.resource-list__item` / `.slideshow-control`. Move it to `main.css`. Check the full-bleed peek (Figma `190:3830`: cards at x −148 … 1408) with `section_width: full-width`.
- **Retire after approval:** `sections/snosha-collections.liquid`.
- **Risk:** Low–Medium. Merchant-visible editor change: settings move to the native "Collection list" panel.

### M4 — `snosha-before-after` → native `section`

> **Status 2026-11-20: migrated on the development theme only (local, not committed).**
>
> **Instances (3, same IDs and positions):**
> - `index.json → snosha_before_after` (6 / 12);
> - `product.json → snosha_before_after_product` (5 / 15);
> - `product.f1-product.json → snosha_before_after_product` (4 / 14).
>
> All blocks are unchanged (homepage `comparison` + `content` group with 4 benefits + CTA; product `heading` + `body` + `comparison`).
>
> **Native:** `sections/section.liquid` (existing `custom_class` + mobile-padding opt-ins; native padding and Gap 20 homepage / 24 product) + the existing native blocks. The slider is Horizon's `comparison-slider` (range input; pointer, touch, keyboard, intro animation). No new section, block or JS.
>
> **Extension:** `blocks/comparison-slider.liquid` gains 2 opt-in colours, blank = no output: "Handle grip lines" `--snosha-cs-grip` and "Handle and label shadow" `--snosha-cs-shadow`. When either is set, the block's Text color is also exposed as `--snosha-cs-label` for the focus ring.
>
> **Old → new settings:**
> - section `label_text_color` → the block's native Text color;
> - `grip_color` / `shadow_color` → the 2 new block settings;
> - desktop padding → native Top / Bottom;
> - mobile padding → the mobile-padding opt-in;
> - `custom_class` → native `custom_class`.
>
> **Translation safety:** the product pages keep `custom_class` **"snosha-before-after--product" unchanged**, because that value has a registered English "translation" on live and a changed value would leave `/en` with the old class. The homepage uses "snosha-before-after-native". CSS scope: `:is(.snosha-before-after-native, .snosha-before-after--product):not(.snosha-before-after)`, so the legacy section, still in the theme for rollback, is never double-styled.
>
> **CSS:** `assets/main.css` (re-scoped original rules); legacy rules in `dev1.css` / `main.css` kept for rollback.
>
> **QA (dev theme, real pages, RTL + LTR, 1480 / 990 / 768 / 390 / 320):**
> - Original vs native: 0 / 30 runs differ (geometry, typography, images / cover, chips, divider, handle, grip, shadow, clip-paths, initial value 50, keyboard ArrowRight ×5 = 55 with focus ring, overflow, JS errors).
> - Dedicated drag test (slider kept in view): mouse → 23–25 at 25 % of the width, touch → 75–77 at 75 %; page never scrolls; 30 / 30.
> - Fixed during QA:
>   - the 0.7 spacing scale at 750–989 (the variable has to sit on the `.spacing-style` wrapper);
>   - the content column 0.8px narrower at ≥ 990 (Horizon's `width: 100%`);
>   - label offset (see Figma note).
> - Editor-equivalent tests passed and were restored: three slider colours, focus ring follows the label colour, padding, mobile padding, Gap, block reorder, product heading edit, cleared grip / shadow fall back to foreground / none.
>
> **Translations:** 30 / 30 keys, digests and Arabic sources unchanged (including the product `custom_class` key); 1 new key (homepage `custom_class`, untranslated by design).
>
> **Figma note:** the live homepage (and product mobile) chips sit 11.2px from the slider top, Horizon's native `--padding-sm`, because the legacy 16 / 12px rules never won the cascade. Figma says 16 desktop / 12 mobile. The migration keeps the live 11.2px; aligning to Figma is a separate design decision. Product desktop keeps Figma's 26px.
>
> **Theme Editor UI:** UNVERIFIED (no admin session).
- **Native reuse:** stock "Image compare" composition: `section` (row, `vertical_on_mobile: true`, `custom_class: snosha-before-after`) → `comparison-slider` + `group` [H2 `text`, body `text`, benefits `group` (4 × `group` → `snosha-icon` + `text`), `button`]. These child blocks **already exist in the current instance**, so the nested tree is copied as it is.
- **Slider colours** (`label_text_color`, `grip_color`, `shadow_color`): add an opt-in group to `blocks/comparison-slider.liquid` (already modified; it is used only inside `snosha-before-after` today) **or** turn them into CSS tokens under the class. The second option is recommended: no further core change.
- **Instances:**
  - `index → snosha_before_after`;
  - `product` / `product.f1-product → snosha_before_after_product`. These keep `custom_class: "snosha-before-after snosha-before-after--product"`, so the product variant CSS in `main.css` still applies. Migrating it means changing the selector to the two-class form.
- **DOM order and RTL:** Figma desktop has the slider on the left and the content on the right in RTL. Keep the current block order and verify with `content_direction: row` (RTL flips the visual order, as in the current CSS).
- **Retire after approval:** `sections/snosha-before-after.liquid`.
- **Risk:** Medium (3 instances, product-variant CSS, slider RTL fix in `comparison-slider`).

## 5. Theme Editor migration strategy
- **Build the new instance next to the old one.** Add the new section after the old one, copy the content, then disable the old one, so both remain in the JSON during review.
- **Labels:** the native section shows under its own name ("Section" / "Collection list"). Set the instance `name` in the template JSON (for example "Snosha · Why") so the merchant can recognise it.
- **Presets:** optionally add a "Snosha why" / "Snosha FAQ" preset to the native section schema so new instances start from the design (the precedent is the "Snosha blog" preset in `featured-blog-posts.liquid`).
- **Merchant briefing:** one line per migrated section describing where each former setting now lives (the mapping tables above).

## 6. Functional verification checklist (each step)
- [ ] Section renders on every template that had the old one; section order unchanged.
- [ ] Every text, image, link, collection and product selection is identical to the old instance.
- [ ] FAQ: open and close by click, Enter and Space; the warranty row opens by default; `hide_when_empty` rows are hidden.
- [ ] Collections: arrows enable and disable at the ends; swipe, drag and keyboard work; the progress bar moves; RTL direction is correct; placeholders show in the editor only.
- [ ] Before/After: drag, touch and keyboard on the slider; intro animation; labels; CTA link.
- [ ] Theme Editor: select, reorder, hide and add blocks; the old instance is disabled and not deleted.
- [ ] Arabic (default) and English (`/en`) both render the translated strings.
- [ ] Theme Check is still at the baseline (10). JSON headers are kept. `git diff --check` is clean.

## 7. Responsive QA checklist (only when Visual QA is requested)
- Widths: 320, 375, **390**, 749 / 750, 989 / 990, 1024, 1376, **1480**, 1920.
- Compare against the Figma nodes: Why `190:4024` / `190:4361`; FAQ `217:14604` / `217:14813`; Collections `190:3830` / `190:4133`; Before/After `190:3903` / `190:4222`; product Before/After `190:10376` / `190:11087`.
- RTL (default storefront) and LTR (`/en`, or `dir` switched): no horizontal overflow; the peek and gutters are symmetric; arrows sit on the correct sides.
- **Acceptance:** the new version must not be visually worse than the current one at 1480 and 390.

## 8. Rollback strategy
1. Each step is its own branch and commit. Revert the commit to undo the code.
2. The template rollback is in the data: the old instance stays with `"disabled": true`. Re-enable it and disable the new one, either in the Theme Editor or with a one-line JSON edit.
3. Old section files are deleted only in a **separate, later** commit, after the migrated instance has been approved on the dev theme for the agreed period.
4. Translations: keep the exported old values (step-3 rule 6), so they can be re-applied to the old keys if needed.
5. Nothing is pushed or published as part of a migration. Promotion to the live theme is a separate, explicitly approved action.

## 9. Components removable only after successful replacement

| File | Removable after |
|---|---|
| `blocks/snosha-product-rating.liquid`, `blocks/snosha-product-link.liquid` | M0 pre-check confirms they are unused on the dev and live themes |
| `sections/snosha-why.liquid`, `blocks/_snosha-why-item.liquid` | M1 approved |
| `sections/snosha-faq.liquid` | M2 approved on all 4 templates |
| `sections/snosha-collections.liquid` | M3 approved |
| `sections/snosha-before-after.liquid` | M4 approved on all 3 instances |
| Their CSS scopes in `assets/dev1.css` | The same step (after the scope has moved to `main.css`) |

## 10. Expected outcome
- About 1,100 lines of custom Liquid retired: why 260 + why-item, faq 299, collections 304, before-after 165, product-rating 223, product-link 49.
- One duplicated render path (`resource-list` in `snosha-collections`) removed.
- Two core extensions, both additive and inert when unset: `custom_class` on `section.liquid`, and an opt-in group on `collection-list.liquid`.
- Behaviour, data sources and section order unchanged. The merchant sees native panels with the same content.

---

## 11. [R2] Candidate cards

Similarity = weighted estimate (Layout 30 · Function 25 · Editor 20 · Responsive 15 · Data 10). For wave 1 it is grounded in today's Figma design data (audit §13). Rendering is **NOT VISUALLY VERIFIED** for every candidate; Visual QA at 1480 / 390 is the acceptance gate of each step. "P" = the shared prerequisite: additive `custom_class` on `sections/section.liquid`.

### 11.1 Wave 1 (recommended, in this order)

| Field | M1 `snosha-why` | M2 `snosha-faq` | M3 `snosha-collections` | M4 `snosha-before-after` |
|---|---|---|---|---|
| Original component | `sections/snosha-why.liquid` + `blocks/_snosha-why-item.liquid` | `sections/snosha-faq.liquid` | `sections/snosha-collections.liquid` | `sections/snosha-before-after.liquid` |
| Native alternative | `sections/section.liquid` ("Icons with text" composition): `group` → `snosha-icon` + `text` ×2 | `sections/section.liquid` ("FAQ section" composition): `text` + 2 × `accordion` → `_accordion-row` → `text` | `sections/collection-list.liquid`, `layout_type: carousel`, static `_collection-card` | `sections/section.liquid` ("Image compare" composition): `comparison-slider` + `group` (text, benefits, `button`) |
| Similarity | **90%** | **92%** | **93%** (with extension) | **91%** |
| Class | A | A | B | A |
| Required CSS (move to `main.css`) | `.snosha-why`: 2 × 2 grid < 750, 4 columns ≥ 750; item description 13/22; sparkles as pseudo-elements using `assets/snosha-sparkle-*.svg` | `.snosha-faq`: desktop `row-reverse` (RTL column order), 20 px mobile inset, row card styles (existing rules on `.accordion`) | `.snosha-collections`: existing rules (peek, 97 px mobile cards, arrows, progress) unchanged, re-scoped to the new section | `.snosha-before-after` (+ `--product`): existing rules; slider colours as CSS tokens; RTL order |
| Native extensions | P only | P only | Opt-in group on `collection-list.liquid`: `custom_class`, `snosha_style` (scope class + `data-snosha-carousel-progress` + module script), `snosha_columns_tablet`, arrow and progress colours (palette defaults) | P only (`comparison-slider` unchanged) |
| Content migration | `index.json → snosha_why`: static `heading` / `subtitle` text and 4 items (icon option + 2 texts) → new dynamic blocks | `index.json → snosha_faq` and `snosha_faq_raP3iT` on product / f1 / bundle (diff these first); accordion and row settings copied unchanged | heading blocks + `_collection-card` settings + `collection_list` | nested blocks copied as they are, on 3 instances (index; product + f1 `snosha_before_after_product`) |
| Translation migration | New block IDs: about 10 strings to re-register (dev theme first) | up to 14 Q/A strings per instance (×4) | 1 heading | about 12 strings per instance (×3) |
| Shared dependencies | P touches `section.liquid` (page.contact `form`, collection `section` [off]); `snosha-icon` block | P; `accordion` / `_accordion-row` (also Buy Box on 3 product templates; their settings are not changed); FAQ JSON-LD independent | `collection-list` not placed anywhere (inert); `snosha-carousel-progress.js` (also used by product-list, blog, recommendations; unchanged) | P; `comparison-slider` (used only here); `snosha-icon` |
| Risk | **Low** | **Low–Med** | **Low–Med** | **Medium** |
| Recommendation | **Replace** (first) | **Replace** (second; homepage first, then the 3 product templates in one step) | **Replace** (third) | **Replace** (fourth, after M1–M3 have proven the pattern) |

### 11.2 Wave 2 (feasible; start only after wave 1 is approved)

| Field | `snosha-collection-header` | `snosha-reviews-screenshots` | `snosha-how-to-use` | `snosha-how-to-use-video` |
|---|---|---|---|---|
| Native alternative | `section` → `collection-title` + `text` (dynamic `collection.description`) + `image` (dynamic `collection.image`) + breadcrumbs block | `carousel` → `_carousel-content` → `_card` → `image`; `review` for the rating | `section` → `text` + `group` → `text` (richtext numbered list) + `group` note | `section` ("Video section") → `text` + `video` |
| Similarity (Figma not re-inspected in R2) | ≈ 75% | ≈ 72% | ≈ 80% | ≈ 72% |
| Class | B | B | A | B |
| Required CSS | line clamp, image placement, alignment | card size, arrows, rating pill | step counters on `.rte ol li`, panel, note | overlay, play button, radius |
| Native extensions | new small block wrapping `snippets/snosha-breadcrumbs.liquid` (+ P) | opt-in progress group on `carousel.liquid` | P | opt-in on `video.liquid`: cover image for uploaded video + play with sound |
| Content / translations | almost none (labels) | screenshots re-picked; **rating moves from manual to synced metafields (approval needed)** | 8 steps → 1 rich-text value ×4 instances; ar/en re-registered | video and poster re-picked; 2 instances |
| Shared dependencies | breadcrumbs snippet (also product, blog) | `review` block (Buy Box) | — | `video` block not placed anywhere (inert) |
| Risk | Low | Low–Med | Medium | Medium |
| Recommendation | **Replace** | **Replace, after the data-source decision** | **Replace, after checking that the editor's RTE emits `<ol>`** | **Replace** |

| Field | `snosha-contact` | `snosha-f1-banner` | `snosha-bundle-contents` | `snosha-bundle-value` |
|---|---|---|---|---|
| Native alternative | `section` → `group` card → `image` + `text` + `button` ×2 | `section` → `group` copy + `image` + `group` specs (`snosha-icon` + `text`) | `section` → `group` cards → `snosha-icon` + `text` (+ text badge) | `section` → `group` rows (`text`) + `price` |
| Similarity (Figma not re-inspected in R2) | ≈ 75% | ≈ 80% | ≈ 80% | ≈ 65% |
| Class | B | A | A | B |
| Required CSS | gradient card, rings and dots, button order | waves, arc, watermark layering; mobile image swap | 3 / 2 / compact grid, badge | breakdown card, highlighted panel, strike-through |
| Native extensions | only if `url` rejects `mailto:` / `#anchor`: a text-setting link opt-in on `button` | P | P | opt-in "show savings amount" on `price.liquid` |
| Content / translations | 3 instances (incl. `snosha-gift` + CTA) | 1 instance; 22 colour settings → tokens | ar/en bundle content re-registered (`tools/translations/snosha-bundle/register-en.mjs` pattern) | ar/en bundle content |
| Shared dependencies | `button` block (everywhere; opt-in must be inert) | `snosha-icon`, f1 assets | bundle template (finalised 2026-11-19) | `price` block (all product templates and cards) |
| Risk | Medium | Medium | Medium | Medium |
| Recommendation | **Replace, after the `mailto:` test** | **Replace, after Visual QA of the decoration layering** | **Defer** until bundle translations are stable | **Defer** (same) |

### 11.3 Not to migrate
- **Class C (possible, high risk), keep:** `snosha-reels`, `snosha-choose-care`, `snosha-long-description`, `snosha-storage-care`, `snosha-judgeme-reviews`. The last one would require re-configuring the Judge.me app block, which is out of scope.
- **Class D (native can't preserve essential function), keep:** `snosha-hero` (positioned chips, per-language slides), `snosha-bundle` (hotspots + rows + add to cart of a bundle product), `snosha-product-comparison` (table semantics, per-cell mobile copy).

Reasons and source evidence: audit §12.
