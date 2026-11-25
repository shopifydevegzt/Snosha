# SNOSHA — Component registry

**What this is:** the project-specific inventory for the native decision gate (`.claude/skills/horizon-figma-to-sections-workflow/SKILL.md` §2.1, §5, §19A). Read it during native discovery, and update it when a component or extension is added, retired or moved between worktrees.

Snapshot: 2026-11-22, `main` at `559a549`. Stock baseline = Horizon 4.4.0 First Commit `448df6e`. Theme Check baseline: see `CLAUDE.md` (190, measured the same day).

---

## 1. How to inspect (read-only)

```sh
git worktree list ; git branch -a                          # parallel sessions and their branches
git diff --name-only 448df6e HEAD -- sections blocks snippets   # stock files changed since Horizon 4.4.0
grep -o '"id": *"\(snosha_[a-z0-9_]*\|custom_class\)"' sections/<file>.liquid   # opt-in project settings on a stock file
grep -ln '"type": "<type>"' templates/*.json sections/*-group.json               # consumers of a section/block
grep -n '"name": "t:names' sections/section.liquid                                # stock section presets
grep -rn "customElements.define" assets/                                          # existing custom elements
```

A file is **stock** if it exists in `448df6e`. It is **native-extended** if it's stock and now carries project opt-in settings or branches. It is **project custom** if it doesn't exist in `448df6e`. Project custom components are **not native alternatives** (skill §2.6).

## 2. Worktrees and ownership

| Worktree | Branch | HEAD (snapshot) | Status / rule |
|---|---|---|---|
| `E:/Work/Snosha/Project` | `main` | `559a549` | GitHub `main` syncs to the **published** theme `168066318552` ("Snosha/main"). Pushing deploys to live. |
| `E:/Work/Snosha/dev1` | `dev1` | `6eca4bb` | Built: collections, before/after, blog, why, FAQ, footer, header, product S06/S09/S10 … Fully merged into `main`, no uncommitted changes. |
| `E:/Work/Snosha/dev2` | `dev2` | `1a663f6` | Fully merged into `main`, no uncommitted changes. |

The snapshot was taken 2026-11-22 with `git worktree list`, `git merge-base --is-ancestor <branch> main` and `git -C <worktree> status`. The store also has unpublished themes "Snosha/dev1" and "Snosha/dev2" whose names match the branches; their GitHub connection wasn't verified. Re-check before assuming any worktree is idle.

**Stylesheet ownership (per active branch/worktree)**

| Branch | Stylesheet | Linked by `layout/theme.liquid` | Notes |
|---|---|---|---|
| `main` | `assets/main.css` | Yes (L48) | Native scopes (`.snosha-why-native`, `.snosha-faq-native`, `.snosha-before-after-native`, `.snosha-collections-native` …) and custom-section scopes created on `main` |
| `dev1` | `assets/dev1.css` | Yes (L49, after `main.css`) | Scopes built on `dev1`. Merging into `main.css` is pending approval. |
| `dev2` | `assets/dev2.css` | **No: the file doesn't exist** in any worktree | The `dev2` worktree's layout links only `main.css` |
| `devN` | `assets/devN.css` | Only once linked | Create the file **and** a link in `layout/theme.liquid` after the existing project stylesheets. That shared layout edit needs coordination. |

Rules:

- A session writes CSS only to its own branch's file.
- Never define the same scope in two files.
- `layout/password.liquid` links no project stylesheet.
- Changing a shared native scope (styled in another branch's file) while several worktrees are active needs coordination.

**Coordination and reuse procedure**

1. Before building, run `git worktree list` and `git branch -a`, and read this registry. If the component exists, reuse it.
2. If it exists only in another worktree or unmerged branch, record the dependency in the plan entry, then reuse it after merge or ask. Don't rebuild it.
3. Don't edit files another active session owns, and don't merge, cherry-pick, check out or copy between worktrees automatically.
4. After building, add the component or extension here.

## 3. Stock section presets (`sections/section.liquid`, Horizon 4.4.0)

| Preset | Blocks |
|---|---|
| `custom_section` | (empty) |
| `rich_text_section` | text, button |
| `faq_section` | text, accordion, _accordion-row |
| `video_section` | video, group, text, button |
| `pull_quote` | text, button |
| `contact_form` | text, contact-form, contact-form-submit-button |
| `email_signup` | text, email-signup |
| `icons_with_text` | group, icon, text |
| `split_showcase` | group, spacer, text, button |
| `image_with_text` | image, group, text, button |
| `multicolumn` | group, text |
| `image_compare` | group, text, button, comparison-slider |
| `large_logo` | text, logo |

`section.liquid` accepts `@theme` and `@app` blocks, so any public theme block (including project blocks such as `snosha-icon`) can be composed inside it.

## 4. Approved native extensions (opt-in, default off)

Every entry is a precedent for skill §5.4: blank/off = stock output.

| Stock file | Opt-in project settings / branches | Used by |
|---|---|---|
| `sections/section.liquid` (+ `snippets/section.liquid`) | `custom_class`; `snosha_grid` + `snosha_columns_desktop/tablet/mobile`; `snosha_mobile_padding` + `snosha_padding_top/bottom_mobile` | Why, FAQ, Before/After (native migrations) |
| `sections/collection-list.liquid` | `custom_class`; `snosha_style` group: `snosha_columns_tablet/mobile`, `snosha_mobile_padding_top/bottom`, `snosha_arrow_*`, `snosha_progress_track`, `snosha_gradient_start/end` | Collections (native migration) |
| `sections/product-list.liquid` | `custom_class`; `snosha_style` group (columns, exclude current, mobile padding, colors, progress) | Best sellers, related / also-like lists |
| `sections/featured-blog-posts.liquid` | `custom_class`; `snosha_style` group (mobile padding, colors, image height/position, progress) | Homepage blog |
| `sections/main-blog.liquid` | `snosha_style` group (columns, breadcrumbs, colors) | Blog page |
| `sections/main-collection.liquid` | `snosha_style` group (columns, min card width, colors, shadow, toolbar) | Collection page |
| `sections/product-information.liquid` | `custom_class`; `snosha_buy_box` group (details width, gap, breadcrumbs, colors) | Product buy box |
| `sections/product-recommendations.liquid` | `custom_class`; `snosha_style` (+ gradients) | Product recommendations |
| `sections/media-with-content.liquid` | `custom_class`; `snosha_mobile_media_position`, `snosha_hide_empty_media` | Bundle "why" |
| `sections/hero.liquid` | `custom_class` (optional text; blank = stock class attribute, verified on `page.faq`) — added 2026-11-22 | About Us (`snosha-about*` scopes in `main.css`); FAQ heroes unchanged |
| `snippets/custom-design-tokens.liquid` | tokens `--snosha-palette-color4` (2026-11-22) and `--snosha-palette-color2/3/6` (2026-11-24): palette colors as CSS variables, read only by project scopes | About Us highlighted words; collection SEO content (`.snosha-collection-seo`) |
| `sections/header.liquid` | `custom_class`; `snosha_layout` + many `snosha_*` (nav, icons, drawer) | Header group |
| `sections/footer.liquid`, `sections/footer-utilities.liquid` | `custom_class`; `snosha_layout` + colors / mobile padding | Footer group |
| `blocks/accordion.liquid`, `blocks/_accordion-row.liquid` | `snosha_style` group (row/title/chevron/tile/icon colors); `snosha_icon` | FAQ |
| `blocks/comparison-slider.liquid` | `snosha_grip_color`, `snosha_shadow_color` (+ responsive `widths`) | Before/After |
| `blocks/buy-buttons.liquid` | `snosha_notify_enabled` + `snosha_notify_form_id` / `snosha_notify_label` / `snosha_notify_error` (2026-11-25): "Notify me" for a sold-out variant → Omnisend custom trigger; `<snosha-notify-me>` in `main.js`, `.snosha-notify-me` in `main.css` | Default product template (`product.json`) |
| `blocks/_product-media-gallery.liquid` | `snosha_style` group (stage, thumbs, zoom, badge) | Product gallery |
| `blocks/social-links.liquid`, `blocks/_announcement.liquid` | `snosha_style` (+ border color) | Footer, announcement |
| `blocks/logo.liquid`, `email-signup`, `footer-copyright`, `price`, `review`, `variant-picker`, `_product-list-button`, `_product-card-gallery`, `_featured-blog-posts-card` | Small additive options (see each schema) | Various |
| Snippets: `background-media`, `util-mega-menu-img-sizes-attr`, `util-product-media-sizes-attr` | `page_width: custom_1376` branch | Global (documented in `CLAUDE.md`) |
| Snippets: `image`, `media`, `resource-image`, `meta-tags`, `card-gallery`, `price`, `variant-main-picker`, `product-media-gallery-content`, `product-information-content`, `header-*`, `cart-*`, `search`, `theme-drawer`, `scripts` | Additive branches (loading strategy, SEO fallback, project UI); marked "Snosha (project addition)" in the files | Various |

## 5. Project custom sections

Feasibility class from `SNOSHA_NATIVE_HORIZON_AUDIT.md` §12 R2:

- **A:** native + scoped CSS is enough.
- **B:** native + a small extension is enough.
- **C:** possible, but migration risk is high.
- **D:** native can't keep an essential function.

A/B/C are **estimates** until a migration or spike proves them.

### 5.1 Migrated to native (deployed)

Evidence for "deployed":

- each migration commit is on `origin/main`;
- `templates/*.json` on `main` use the native instances;
- a full pull of the published theme `168066318552` on 2026-11-20 (at `90ba07f`, after these commits) was identical to the repository.

| Former custom section | Native replacement now in templates | Scope class | Commit | Old file |
|---|---|---|---|---|
| `snosha-why` | `section` (index `snosha_why`), `icons_with_text`-style composition + `snosha_grid` / `snosha_mobile_padding` | `snosha-why-native` (custom_class) | `17001c2` | Unused, still in repo (retire after approval) |
| `snosha-faq` | `section` (index + 3 product templates `snosha_faq` / `snosha_faq_raP3iT`), `faq_section`-style composition | `snosha-faq-native` (custom_class) | `730708e` | Unused, still in repo |
| `snosha-collections` | `collection-list` (index `snosha_collections`) with `snosha_style: true` | `snosha-collections-native` (added by the toggle) | `3f9dd62` | Unused, still in repo |
| `snosha-before-after` | `section` (index `snosha_before_after`; product + f1 `snosha_before_after_product`), `image_compare`-style composition | `snosha-before-after-native` / `snosha-before-after--product` (custom_class) | `8a55ce8` | Unused, still in repo |

Known CSS exception: `assets/dev1.css` still references `.snosha-collections-native` in its shared carousel-progress selector (`:is(.snosha-collections, .snosha-collections-native, …)`). All other rules for these scopes are in `main.css`.

### 5.2 Custom sections in use

| Section | Templates | Class | Status |
|---|---|---|---|
| `snosha-hero` | index | D | **Custom required** (chips at merchant coordinates, per-language slides) |
| `snosha-bundle` | index | D | **Custom required** (hotspots + synced rows + bundle add-to-cart) |
| `snosha-product-comparison` | product, f1 | D | **Custom required** (table semantics). Has the known `ExcessiveSettingsCount`. |
| `snosha-choose-care` | index | C | Custom retained (native possible, migration risk high) |
| `snosha-reels` | index, product, f1 | C | Custom retained |
| `snosha-storage-care` | product, f1 | C | Custom retained |
| `snosha-long-description` | product, f1, bundle | C | Custom retained |
| `snosha-judgeme-reviews` | product, f1, bundle | C | Custom retained (Judge.me app host) |
| `snosha-f1-banner` | index | A | Migration candidate; custom file in use |
| `snosha-how-to-use` | product, f1, bundle | A | Migration candidate |
| `snosha-bundle-contents` | bundle | A | Migration candidate |
| `snosha-contact` | product, f1, bundle | B | Migration candidate |
| `snosha-reviews-screenshots` | product, f1 | B | Migration candidate |
| `snosha-how-to-use-video` | product, f1 | B | Migration candidate (`video_section` preset exists) |
| `snosha-collection-header` | collection (hidden since 2026-11-24) | B | **Replaced** by the native `section` (ID `section`, scope `snosha-collection-heading`) + `snosha-breadcrumbs` block; kept hidden for rollback. Opt-in background image (2026-11-24: collection image / picked image + mobile image, overlay; off = identical output); its CSS `.snosha-collection-header-bg` is in `main.css`, the rest of the header in `dev1.css` |
| `snosha-bundle-value` | bundle | B | Migration candidate |

"Custom required" rests on the audit's verified evidence. "Retained" and "migration candidate" are not decisions: any rebuild of these runs the native decision gate first.

## 6. Project blocks, snippets and JS

**Public blocks**

- `snosha-icon` (Figma icon set + tile), `snosha-benefits`, `snosha-capsule`, `snosha-complementary`, `snosha-trust-list`, `snosha-bundle-swatches` (Simple Bundles fields), `snosha-footer-language`, `snosha-product-link`, `snosha-breadcrumbs` (2026-11-24: wraps `snippets/snosha-breadcrumbs`, labels + 3 colors; used in the native collection heading `section` on `collection.json`).
- `snosha-product-rating` is not placed in any template.
- Public blocks can be composed inside native `section` / `group`.

**Private blocks** (parent-specific)

- `_snosha-benefit`, `_snosha-care-card` / `-spec`, `_snosha-comparison-row`, `_snosha-contact-*`, `_snosha-how-to-use-step` / `-note`, `_snosha-jdgm-cards-style`, `_snosha-ld-*`, `_snosha-review-screenshot`, `_snosha-reviews-rating`, `_snosha-storage-*`, `_snosha-trust-item`, `_snosha-video-play`, `_snosha-why-item`.

**Snippets**

- `snosha-icon`, `snosha-breadcrumbs`, `snosha-rating-stars`, `snosha-language-switcher`, `snosha-linked-colors` / `-color-item`, `snosha-header-icon`, `snosha-menu-icon`, `snosha-drawer-title`.
- `schema-article`, `schema-faq`, `schema-organization`.
- `custom-font`, `custom-design-tokens`.

**Custom elements** (`assets/main.js`, `snosha-tabs.js`, `snosha-carousel-progress.js`, `snosha-jdgm-carousel.js`)

- `snosha-care-carousel`, `snosha-reels-carousel`, `snosha-hero-slideshow`, `snosha-bundle-hotspot`, `snosha-bundle-form`, `snosha-bundle-swatches`, `snosha-sticky-quantity`, `snosha-tabs`, `snosha-carousel-progress`, `snosha-jdgm-carousel`.

## 7. Gate calibration cases (2026-11-22)

These are the updated gate applied to repository evidence, without changing code. A future gate run on similar designs should reach the same outcome.

| Case | Closest candidates (discovery) | Tier 2 (CSS) | Tier 3 (extension) | Outcome under the updated gate | Matches history? |
|---|---|---|---|---|---|
| Why | `section.liquid` `icons_with_text` (group, icon, text); `snosha-icon` public block for artwork | Card styling, sparkles, typography: CSS under `custom_class` | Column counts 4/2/1 + mobile padding as opt-in (`snosha_grid`, `snosha_mobile_padding`); consumers: `page.contact`, `collection` (blank = identical) | **EXTEND NATIVE MINIMALLY** | Yes: the 2026-11-20 migration. The original custom choice fails §5.2 (reason "needs a design mode on a shared section" is a tier-3 question). |
| FAQ | `section.liquid` `faq_section` (text, accordion, _accordion-row) | Two columns via row group; row styling via CSS | Accordion colors / icon via opt-in `snosha_style` on `accordion` | **REUSE NATIVE + SCOPED CSS** (+ existing accordion extension) | Yes: migration. The original wrapper fails "previous pattern" and "missing preset discovery". |
| Collections | `collection-list` (carousel) | Arrows, card radius, heading: CSS | Tablet/mobile counts, arrow/progress colors as opt-in `snosha_style` group (follows the `product-list` precedent); consumers: none in templates | **EXTEND NATIVE MINIMALLY** | Yes: migration. The original reason (native section "needs no new settings") is listed as not sufficient in §5.2. |
| Before/After | `section.liquid` `image_compare` (group, text, button, comparison-slider) | Layout, labels, RTL divider: CSS | Grip/shadow colors as opt-in settings on `comparison-slider` | **EXTEND NATIVE MINIMALLY** | Yes: migration. |
| Hero | `hero`, `slideshow`, `media-with-content`, `section` + `group` + `image` | Rings / decoration: CSS possible | Chips pinned at merchant x/y on the product image, overlapping trust card, per-language slide images: no native block takes coordinates on an image; adding them to `hero` would rebuild its media/content model behind a flag | **CUSTOM REQUIRED** (§5.2 reasons 1, 2) | Yes: custom kept. The updated gate also records the `section` + `group` candidate the original decision skipped. |
| Bundle | `product-hotspots` (`_hotspot-product`: product, x, y), `featured-product`, `product-information` | n/a | Hotspots lack bundle rows and totals; add-to-cart of a different (bundle) product with a synced selection isn't in any native form | **CUSTOM REQUIRED** (§5.2 reasons 1, 5) | Yes: custom kept. It reuses `product-form-component` / `add-to-cart-button` inside. |

**Bias check:** the gate pushes the 4 migrated cases to tiers 2–3 because their only recorded blockers were missing controls or avoiding a shared edit, which §5.2 rejects. It keeps Hero and Bundle custom because their blockers are functional (coordinates, cross-product cart, synced rows), which §5.2 accepts.
