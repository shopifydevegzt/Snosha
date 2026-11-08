---
name: horizon-figma-to-sections-workflow
description: Reusable Shopify Horizon v4.4 Figma-to-section engineering standard. For any Horizon 4.4 project, including Snosha: inspect exact desktop/mobile Figma nodes, prioritize pixel-accurate design with the smallest safe native-first change, preserve merchant data and nested theme blocks, use merchant-editable color controls and custom_class, perform limited read-only validation, maintain a mandatory project plan, and stop after one section.
---

# Shopify Horizon v4.4 — Figma → Sections Workflow

This is a **reusable Horizon v4.4 skill**, not an AYUM/Kalles implementation. **Current intended project: Snosha.** Do not embed Snosha design nodes, brand colors, store IDs, repository paths, or integrations as universal defaults. Project-specific facts belong in the mandatory project plan and must be verified in the current workspace. This skill does not authorize Figma edits, theme publication, deployment, or Git mutations.

**Operating principles:** exact Figma design is the design source of truth; reproduce it using the **smallest safe implementation**; investigate native Horizon sections, theme blocks, block groups, and settings before writing new structure; protect existing merchant content; expose meaningful merchant controls; isolate every change; report what was and was not tested.

**Identity and discovery**

- Target family: Shopify **Horizon v4.4.x**, with **v4.4.0** as the requested baseline. Inspect `config/settings_schema.json` → `theme_info` and current files before relying on exact version behavior; never silently update the theme.
- Current project label: **Snosha**. Repository path, Figma URL/file key, page frames, section nodes, locales, and store integrations: **to be provided/discovered**. Never invent them.
- Read `CLAUDE.md` if present; do not modify it unless asked.
- **Mandatory plan:** `SNOSHA_PROJECT_PLAN.md` for Snosha. For another Horizon project use `<PROJECT_SLUG>_PROJECT_PLAN.md` (or its existing canonical project-plan path) consistently. No previous project's plan may be reused as this project's state.
- Shopify platform behavior and exact Horizon source code must be verified; do not assume Kalles `hdt-*`, `spacing-vars`, `btn-ultra`, `col_dk`, `themeHDN`, `ThemeEvents`, or Embla contracts.

---

## 0. Scope, boundaries, and workflow modes

- **One requested section per task, one page at a time.** Stop and report after that section; do **not** start another section or implement the whole page/site.
- **No external orchestrator, section workers, automated task chaining, or orchestrator approval gates.** This skill is self-contained; a future user may request a separate workflow but this skill never implicitly invokes one.
- Do not inspect, redesign, or edit unrelated sections. Reading a shared dependency to understand impact is permitted; changing it requires scope justification.
- In audit/spec/plan/report-only tasks, **do not modify storefront implementation files**. Updating the requested project plan is permitted only if the task explicitly authorizes a plan update.
- Before normal implementation, give a pre-implementation report (§4); if asked to implement immediately, still inspect and state any serious risk, then proceed safely.
- Manual visual/interaction QA belongs to the user; never claim browser or storefront verification without actually performing it under explicit permission.
- **Git:** current working tree only. No automatic branch, worktree, stash, commit, merge, pull, push, or deploy. Preserve uncommitted changes. Read-only Git inspection is allowed.

## 1. Sources of truth and conflicts

Priority for design information:

1. Exact **section-specific** desktop and mobile Figma nodes (both authoritative).
2. Figma MCP structured data: `get_design_context`, `get_metadata`, `get_variable_defs`; screenshots only confirm appearance.
3. Real Figma assets and variables; inspect actual export settings and supported permanent storage.
4. Screenshot/cropped reference for visual comparison only; never measure pixels by eye when real node values exist.
5. Full-page Figma frame for layout/order context only, not a substitute for section nodes.
6. Current verified theme behavior and actual merchant configuration, then explicitly stated engineering assumptions.

For instruction conflicts: latest explicit user request → this skill → `CLAUDE.md` → verified active repository code → mandatory project plan → verified Shopify platform constraints → engineering judgment. Shopify platform syntax/constraints cannot be overridden by design or instructions. Report irresolvable conflicts as **Needs verification** and use the least destructive path; never fabricate measurements.

- Inspect the exact target desktop **and** mobile node for every section (not the full page only). No desktop-to-mobile scaling assumption.
- Record font properties, Auto Layout, gaps, paddings, alignment, fixed/hug/fill rules, min/max, constraints, responsive visibility, colors, gradients, images, corners, borders, shadows, interaction states, and exportable assets.
- Read actual text and visual content; never invent customer reviews, prices, discounts, testimonials, product counts, claims, or policy content.
- A user correction to a specific node or content choice supersedes older design assumptions; record it in the plan.
- If Figma MCP is unavailable, explicitly mark data **unverified**. Do not claim to have inspected nodes from screenshots. Ask for access only if needed to proceed safely.

## 2. Horizon-specific discovery (do not port Kalles assumptions)

### 2.1 Active architecture and block model

- Inspect current `layout/`, `templates/*.json`, `sections/*.liquid`, `sections/*-group.json`, `blocks/*.liquid`, `snippets/`, `assets/`, `config/`, and `locales/` as relevant.
- Determine **which actual section instance and nested block path render the target**, tracing template `sections`, `order`, `blocks`, `block_order`, presets, static IDs, and `content_for` calls; grep for active calls, not just filename similarity.
- Horizon uses **theme blocks** (files in `/blocks`), **section-defined blocks** (within a section schema), and **app blocks**; identify which kind is active. Do **not** assume they are interchangeable.
- Dynamic theme-block area: `{% content_for 'blocks' %}`. Static block area: `{% content_for 'block', type: '...', id: '...' %}`. Verify the actual block file and data path; preserve static IDs and preset relationships. A theme block filename **including a leading underscore** can be the exact type.
- Nested theme blocks are allowed only where supported by their schema. Preserve parent-child hierarchy, permitted types, order, pinned/static blocks, and the Theme Editor's selectability. Never silently flatten a nested block tree.
- Prefer existing **Horizon section + theme blocks + settings** where they can reproduce Figma faithfully. **Do not sacrifice an important design requirement** merely to avoid a new file: document the gap and choose the smallest safe extension/new component.
- Inspect relevant Horizon components for group/layout blocks, media, product gallery, cart, navigation, sliders and forms as needed. Never assume a particular component tag, JavaScript event, slider package, or price formatter without inspecting current code.
- No automatic changes to app-provided blocks, merchant metafields, Shopify-managed prices, checkout, subscription state, or review widgets.

### 2.2 CSS, typography, and color tokens

- Discover the actual Horizon stylesheet loading mechanism, `{% stylesheet %}` / `{% style %}` usage, external CSS assets, theme tokens, CSS variable formats, color scheme structure, and typography settings **in the current version**. Do not assume Kalles `base.css`, `theme.css`, `rgb(var(--color-* ))`, or any token name exists.
- Do not place Liquid in static `.css` assets. For dynamic per-instance values use a scoped Liquid `{% style %}` block or the verified native bridge, with a static stylesheet consuming CSS variables if appropriate.
- Preserve native design tokens and section/block settings; use actual theme font settings and inherited typography rather than importing project-specific fonts. Figma drives desired appearance; merchant settings determine configurable implementation.
- Do not globally modify shared color schemes/settings for one target instance. Never directly hand-edit `config/settings_data.json`.
- Keep all new CSS scoped by a stable implementation class or `#shopify-section-{{ section.id }}`; merchant-entered `custom_class` is an additional editable hook, not the sole internal styling dependency.
- Prefer logical CSS properties and genuine layout constraints, not screenshot-only widths, fragile `nth-child`, unnecessary `!important`, or global overflow masking.

### 2.3 JS / cart / component lifecycle

- Native-first: avoid new JavaScript if HTML/CSS or Horizon's existing components handle the behavior.
- Discover actual component lifecycle, scripts, import paths, slider initialization, cart events, custom elements, and Theme Editor load/unload events **before altering** behavior; do not bring in `hdt-*` / Kalles APIs.
- Preserve event contracts, cart drawer, native add-to-cart, variant selection, pricing, quick-add, filtering, forms, keyboard behavior, and app integration boundaries.
- When JS is genuinely required, use a unique non-colliding component/module following this repository's current pattern. Make initialization idempotent; clean up observers/listeners/timers; handle Theme Editor reload; support progressive enhancement.
- Do not edit generated/minified vendor assets or install a competing slider library without explicit, justified approval.

### 2.4 Responsive breakpoints (strict)

- **Do not transplant Kalles's 768/1150 breakpoints.** First inspect Horizon v4.4's _actual_ layout media queries, custom properties, component/container-query conditions, and any supported native responsive settings in this project.
- Record the **verified native breakpoint map** in the project plan with evidence (file/selectors). Treat Figma artboard sizes as **QA target widths**, never as automatic CSS breakpoints.
- Use **only the verified native Horizon layout breakpoints** in ordinary work; do not create new layout breakpoints just to match a screenshot. If a design requirement genuinely cannot be met, document alternatives and request explicit approval before adding a **section-scoped exception**.
- Check 320, 375, 390, actual supplied Figma desktop/mobile widths, and both sides of each verified breakpoint, plus intermediate tablet/wide desktop. These are testing widths—not universal Horizon breakpoint values.
- Infer undesigned tablet behavior from Figma constraints and verified Horizon native layout. Ensure no horizontal overflow, clipping, unstable card counts, or broken touch targets.
- Where the theme uses **container queries** or section-specific adaptive behavior, preserve it; do not replace with arbitrary viewport breakpoints.

### 2.5 RTL, localization, and typography

- Inspect active storefront locale, theme's actual direction mechanism, Arabic/LTR configurations, typography variables, and localized schema labels. **Snosha project label does not prove storefront locale or global RTL state.**
- If content is Arabic, isolate bidi for text and mixed Arabic/numbers; prefer `dir`/`bdi` and logical properties as appropriate. Direction and `text-align` are separate design decisions; keep centered headings centered.
- Preserve natural LTR geometry where appropriate (e.g. media/phone/email), and do not flip native slider tracks without checking slider direction logic.
- Verify intended RTL appearance **and** supported LTR states as manual QA. Never change site-wide direction for one section.

### 2.6 Project naming

- Reuse Horizon's built-in naming for native files. For genuinely project-specific components, derive a unique prefix from the project plan: for Snosha prefer `snosha-` / `snosha_` if not already occupied.
- Avoid generic names `custom-section`, `section-1`, or overlapping custom-element names. Reuse an existing stable scope when available.

## 3. Direct Figma MCP requirements

- Inspect both exact node IDs via supported Figma MCP tools. If available, create/reuse a session for the project file; follow the Figma connector's required setup (including its design-to-code skill) before `get_design_context`.
- Use `get_metadata` for hierarchy, `get_design_context` for real measurements and structure, `get_variable_defs` for tokens, `get_screenshot` only for visual confirmation.
- If a frame is too large, query target nodes individually rather than repeatedly requesting entire page context.
- Treat Figma temporary asset URLs as ephemeral; **never** commit them in production Liquid/CSS/JS/JSON. Prefer Theme Editor pickers and Shopify product/collection resources, or permanent local assets when truly required.
- Do not edit the Figma file unless separately authorized.

## 4. Required pre-implementation inspection and report

Before coding, inspect: target template + section instance; nested block tree; closest reusable native sections/blocks; relevant styles/scripts/schema; responsive/RTL patterns; saved merchant content; current customizations; shared component consumers; app hooks and accessibility.

The **pre-implementation report** must contain:

1. Files inspected and confirmed active render path.
2. Exact Figma desktop/mobile nodes inspected; unresolved missing data.
3. Existing Horizon section/theme-block/section-block solutions compared, including design gaps.
4. Reuse-ladder choice, explaining why it achieves the design with smallest safe change.
5. Specific proposed files, schema IDs, block types, presets, and any template JSON paths.
6. Proposed `custom_class` / internal scope and exact CSS location.
7. JS changes and justification, if unavoidable.
8. Color/typography mapping, editable settings, fallback/inheritance strategy.
9. Native breakpoint map and RTL strategy.
10. Merchant data/static block impact, regression risk, out-of-scope areas.
11. Plan entry and material blockers/questions not resolvable from files or Figma.

If user requested immediate implementation, this report may be concise, but inspection and scope checks still apply. Ask questions only when required for safe correctness; otherwise proceed using explicitly documented low-risk assumptions.

## 5. Existing-first with design fidelity

**Goal:** match the supplied desktop/mobile design accurately with the **smallest safe modification**, rather than using native components at the expense of design fidelity.

Choose the first option that meets the actual design and preserves native behavior:

1. Configure an existing Horizon section and its theme blocks/section settings **as-is**.
2. Re-compose existing compatible theme blocks/groups (without breaking hierarchy or changing unrelated instances).
3. Add **scoped CSS only** to the correct existing instance.
4. Add an instance-specific `custom_class` and/or safe additive section/block setting.
5. Extend the closest existing theme block, section, snippet, or approved option **additively**, with blank/off defaults on shared behavior.
6. Duplicate the nearest component only where extension risks existing live instances.
7. Create a new block/section **only as a last resort** when existing architecture cannot safely satisfy a meaningful Figma requirement.

Before creating **any** new file, explain why earlier options cannot meet the design safely. No parallel UI frameworks, unnecessary helper scripts/files, broad refactors, or duplicate slider libraries. Prefer isolated new implementation rather than damaging shared instances when a materially different structure is needed.

## 6. Mandatory custom class setting

**Default: every reusable section, including native Horizon sections being modified, must expose an instance-specific merchant-editable `custom_class` text setting**, except where:

- an equivalent editable setting already exists (reuse it),
- an internal/platform component cannot legally have schema,
- adding the setting violates a verified strict framework/schema constraint, or
- a documented technical reason makes the addition unsafe.

Suggested new section-schema setting when allowed:

```json
{ "type": "text", "id": "custom_class", "label": "Custom CSS class" }
```

- Inspect existing schema first; never duplicate an ID or rename an equivalent setting.
- Apply safely to the outermost stable section wrapper **without** replacing native IDs/classes or breaking editor attributes. Guard blank values, escape/sanitize class output; never turn merchant text into an HTML `id`.
- A reusable **theme block** may use a native per-block instance scope (`block.id`, `block.shopify_attributes`) where a section-style `custom_class` control is not meaningful; do not force a setting into every shared child block unless it offers merchant value. The hosting **section** still follows the default requirement.
- Keep internal styling isolated with a stable implementation class or `#shopify-section-{{ section.id }}` even if the merchant clears the custom class.

## 7. Merchant data and schema preservation

- **Never rename/delete** existing setting IDs, block types, filenames used as type identifiers, static block IDs, nested block relationships, block order, preset IDs/values, native sections, or referenced tokens casually.
- Preserve all existing merchant settings, selected products/collections, videos/images, links, custom content, metafields, app blocks, subscription integrations, cart/variant flows, and custom edits.
- In Horizon, verify both **dynamic nested theme-block structure** and **static block slots** before editing the section or the template JSON. A static block's `type` + `id` and its preset data are part of a persisted contract; changing one can make configured content disappear.
- Never rebuild a whole template JSON from a presumed default; modify only the approved paths while keeping other sections, block order, and saved settings intact.
- Never hand-edit `config/settings_data.json`. Shared schemes are merchant state; if changes are necessary, report them as a **separate approval item** with all consumers and possible impacts.
- Do not remove controls simply because Figma doesn't show them. Preserve editor behavior when blocks are added, removed, nested, reordered, or hidden.
- Before extending a shared component, enumerate its existing consumers and prove new default behavior is inert on all of them (blank/false-gated overrides where appropriate).
- Shopify-owned money, discounts, taxes, inventory, shipping, and checkout are authoritative; don't reimplement with parsed formatted text or guessed prices.

## 8. Theme Editor, blocks, and presets

- User-configurable content belongs in appropriate native settings, reusable theme blocks, or section schema: headings, text, CTAs, menu, product/collection picker, images, desktop/mobile media, videos, colors, alignment, visibility, spacing, and responsive layout controls when justified.
- Use compatible `image_picker`, `product`, `collection`, `url`, `video`, `color`, and other **actual Shopify schema types**; never invent unsupported types (`color_picker` is not Shopify's schema type; use `color`).
- Preserve native Theme Editor drag/drop, nested block selection, `block.shopify_attributes` where needed, and static block visibility behavior. Don't copy `block.shopify_attributes` into decorative duplicates.
- Section-defined blocks and theme blocks follow different schema/renderer conventions: check the target before changes. Don't blindly add both modes to the same section.
- Ensure the section has a valid working preset if Shopify requires/adds one; preserve existing native presets. Child block presets/IDs must align with actual `content_for` calls.
- Keep labels reasonable, JSON valid, IDs unique, empty selections safe. Use real resource-derived title/URL rather than duplicate merchant fields for a picked product/collection.
- Merchant-entered text doesn't automatically require locale keys. Use existing translation patterns for theme-owned UI, and synchronize locale paths across supported languages where needed; don't overwrite unrelated locale JSON.
- Missing content: provide meaningful editor placeholders and a safe live-store fallback (usually suppress broken links/cards). Don't fabricate products or reviews.

## 8A. Mandatory editable color architecture

**No new hardcoded brand colors in runtime CSS.** Exact Figma colors are permitted as **schema defaults**, not permanently fixed style rules.

Priority:

1. Existing Horizon theme color scheme/tokens, **if they match and don't change unrelated instances**.
2. New/reused **section-level `color` settings** for independent section-wide foreground/background/accent/border colors.
3. New/reused **block-level `color` settings** for components requiring independent colors, including button hover/focus states, individual badges/cards.
4. Block override → section override → native scheme/tokens, via verified scoped variables/selectors.

- Inspect actual CSS variable formats and winning selectors; do not assume `rgb(var(--token))` or `var(--token)` is valid until checked.
- On shared native components, use an off-by-default toggle (`checkbox` `false`) or equivalent inert gating before applying new custom colors to existing instances; a color picker default alone does **not** imply inherit.
- Use unique `section.id` and `block.id` scopes, and ensure changes affect **only** the intended element. Avoid high-specificity cascade wars and broad `.button` overrides.
- Default contrast must be readable; ensure hover, focus, disabled, and RTL states are covered. No fixed CSS hex/RGB/HSL brand values in runtime declarations.
- If shared scheme changes are desired, **do not** modify `settings_data.json`; separate merchant-approved process is required.

Illustrative pattern; **verify existing Horizon selectors and color token format**:

```liquid
{% style %}
  #shopify-section-{{ section.id }} .snosha-example {
    --section-heading-color: {{ section.settings.heading_color }};
  }
{% endstyle %}
```

```css
.snosha-example .example-heading {
  color: var(--section-heading-color);
}
```

For a block-specific button, generate scoped variables only when its override toggle is enabled; apply the consuming class only to that button. Merchant controls must work independently per block and per section instance.

## 9. CSS placement and safety

- Confirm actual loaded stylesheet and component ownership before editing. If the project designates a central project stylesheet (recorded in `CLAUDE.md` or the project plan), put new section/component CSS there under the section's stable scope instead of in per-section `{% stylesheet %}` blocks. Otherwise prefer an existing section/block stylesheet or the current project's approved scoped asset; create a new one only if earlier options are unsafe.
- For dynamic Liquid-derived variables, use scoped `{% style %}` in Liquid rather than Liquid inside static CSS.
- CSS scope must be tied to a stable wrapper or section/block ID; no broad `.button`, `.slider`, `html`, or `body` layout overrides for one component.
- Use logical properties (`margin-inline`, `padding-inline`, `inset-inline-start`) for RTL. Avoid unnecessary `!important`, CSS collisions, over-specific selector chains, and indexing-based selectors.
- Do not edit generated/minified CSS or JS, or overwrite core files without documented justification and explicit approval if the edit has cross-page impact.
- Don't apply `overflow-x: hidden` globally to conceal local overflow; fix the owning component.

## 10. Section architecture and blank states

- One stable semantic wrapper, native section identity preserved, accessible headings/buttons/links, correct label/alt semantics.
- Responsive images via Shopify filters (`image_url`, `image_tag`, `widths`, `sizes`), width/height/aspect-ratio to limit layout shift; lazy load below the fold where appropriate.
- Separate desktop/mobile image pickers only if design needs them; mobile override falls back to desktop. Meaningful content images need `alt`, not only CSS backgrounds.
- Maintain editor selection, child block nesting/reorder, hidden/deleted/re-added child behavior, and safe missing picker states.
- Prefer native layout/spacing/group settings; don't invent a giant generic settings panel on every section. Only expose controls with real merchant value.
- The Figma design dictates whether the component is a grid, carousel, accordion, tabs, etc. Don't convert between behaviors without explicit design evidence.

## 11. Images and assets

- Prefer Theme Editor image picker, product/collection media, or verified metafield/metaobject source; use permanent theme assets only when needed.
- Never hardcode final merchant imagery in Liquid or embed temporary Figma MCP URLs in production.
- Export genuine assets when required, but use CSS for simple decorative shapes when appropriate. Decorative duplicated visuals are not focusable, aren't selectable editor duplicates, and carry appropriate `aria-hidden`.
- Provide placeholders in edit mode and no broken URLs on storefront. Avoid oversized eager-loading and repeated markup.

## 12. Sliders, carousels, grids

- Trace **current Horizon** slider component, initialization/config, arrow/dot semantics, lifecycle and RTL direction before editing. No Kalles `hdt-slider`, `col_dk`, or `.hdt-slider__slide` assumptions.
- Reuse native slider, preserving touch/drag/swipe, controls, keyboard, reduced motion, resize, Theme Editor reload, and dynamic child blocks.
- A design's partial-next-card/peek must be implemented in the verified native system, without inventing static widths or misplacing RTL padding.
- Don't create a second slider library. Don't change a Figma grid into a slider or vice versa without instruction.
- For **new custom** grid/carousel sections, expose merchant-editable visible-item settings for desktop, tablet and mobile **where the component meaningfully supports these modes**, using verified Horizon naming/conventions—not Kalles field names. If native Horizon already has controls, reuse them. Don't make controls that silently do nothing.
- Check interactive geometry at target Figma widths and verified breakpoint boundaries in manual QA.

## 13. Product card and commerce components

- Inspect existing Horizon card components, snippets, product forms, quick-add, variant controls, wishlist/app hook, badges, rating integrations, image media, prices and sold-out states.
- Compare available card styles and closest reusable structures **before** proposing a new style/block. Reuse native product data and add-to-cart instead of rebuilding weaker markup.
- If a special card is necessary, make it opt-in and isolated; do not invent product-card style numbers, alter a shared dispatcher without confirming all consumers, or change every card globally.
- Never parse formatted prices to compute discounts; use Shopify-provided money/price and variant data. Keep cart updates in existing Horizon handlers.
- If a rating/review widget is not installed or configured, report the dependency rather than inventing review values.

## 14. Video/media

- Inspect native Horizon video and media components, posters, autoplay, pause/play, intersection observers, editor reload, and accessibility behavior.
- No autoplay unless the design/user explicitly requires it. Don't create a decorative dead play button; use current theme media lifecycle rather than a custom player if sufficient.
- Reuse existing product-connected video commerce functionality where present instead of fabricating integrations.

## 15. JavaScript requirements

- Prefer zero new JS when native behavior, HTML, or CSS is sufficient.
- When unavoidable, follow actual Horizon patterns, unique component names, modular load conventions, and proper deferred/module execution.
- No global state/listeners where per-instance scope works. Guard duplicate registrations and reinitialization; dispose observers/listeners/timers; support Theme Editor events and progressive enhancement.
- Preserve native behaviors and keyboard accessibility. No generated asset edits, new libraries, or hidden side effects.

## 16. Accessibility

- Semantic HTML, heading hierarchy, meaningful alt, correct buttons and links, keyboard/tab navigation, clear focus states, ARIA where required, readable contrast, reduced-motion fallbacks.
- Don't use `<div>` as an actionable button, strip screenreader labels, or duplicate selectable blocks for decorative marquee tracks.
- Keep focus management for drawers/dialogs and accessible carousel controls intact.

## 17. Performance

- Favor Horizon's native server-rendered Liquid and its existing assets/components. Prefer responsive images, constrained aspect ratios, deferred nonessential JS, lazy media below fold, lightweight scoped styles, limited DOM duplication, and minimal Liquid loops.
- Do not introduce a framework, duplicate slider dependency, oversized images, or global CSS just to implement one section.
- Correctness and merchant editability take precedence over speculative micro-optimizations.

## 18. Page-specific isolation

- Homepage task: no product/collection-page changes or unrelated homepage sections.
- Product-page task: don't change gallery, variants, quantity, price, main add-to-cart, or other product form behavior unless explicitly targeted.
- Collection-page task: don't change filtering, sorting, pagination, navigation, grid/list controls, or header unless explicitly targeted.
- Header/footer/announcement/cart drawer/global components are cross-page: require explicit scope and cross-page regression notes.

## 19. Manual changes and merchant content

- Treat all project files as potentially manually modified: inspect current diff/state; preserve edits, do not restore vendor defaults or rewrite JSON from a prior snapshot.
- `shopify theme pull` can alter the working copy, but is **not authorized** by this skill. Trust current files while noting drift from plan.
- Refactor only when requested/necessary; explain broader effects and do not erase merchant-selected content.

## 20. Follow-up / bugfix

- Read current project plan entry and active code. Find root cause before patching; avoid symptom-only CSS overrides and whole-section rebuilds.
- Smallest safe scoped diff; fewest files/lines; preserve IDs, presets, block hierarchy, custom class, content, native interactions.
- Check desktop/mobile/RTL, breakpoint boundaries, app/product states, and Theme Editor reload as **manual QA requirements**. No broad refactoring or unapproved extra breakpoints.
- Final bugfix report: root cause, exact fix, files, preserved behavior, actual read-only validation, manual QA steps, remaining limits, and updated plan entry.

## 21. Limited automated validation + manual QA

**Allowed/expected, read-only and scoped to files changed:**

- Parse edited template/section-group JSON; parse all edited `{% schema %}` JSON; check IDs, block type references, and preset/static block consistency where programmatically verifiable.
- Perform **read-only** `git diff --check`, `git diff --stat`, and focused diff review; ensure no unrelated files changed.
- Check Liquid tag balance if available; mark **Not verified** if no reliable Liquid parser exists. Static grep is not a substitute for runtime validation.
- Read-only targeted scans for CSS scope leaks, physical left/right properties needing RTL review, new unauthorized media breakpoints, duplicate/missing block references, Figma ephemeral URLs, secrets, generated files and prohibited edits.
- Report each check with its actual result, including **Not run** or **Not available**.

**Not authorized unless explicitly requested:** `shopify theme check`, theme pull/push/publish, full lint/test suites, auto-fix, automated browser/screenshot visual comparison, deployment, commits or Git writes, or any destructive command.

**Manual QA owned by user (do not claim Passed without evidence):** desktop and mobile Figma match; tablet/intermediate width, RTL/LTR, sliders, product/cart/variants, video, keyboard/a11y, Theme Editor reload/drag/drop, block visibility/reordering, blank states, color editor independence, storefront performance.

Before handoff, review **all** changed Liquid, schema, assets and template wiring; preserve existing data, block structure, static IDs, settings, and unrelated files. Clearly distinguish `Inspected`, `Validated by executed check`, `Requires manual verification`, and `Not available`. Never mark a section `VERIFIED` based on static checks only.

## 22. Final report format

Report in this order:

1. Files inspected and actual active code path.
2. Figma desktop/mobile nodes inspected (or access blockers).
3. Existing Horizon architecture/blocks reused and design-fidelity tradeoffs.
4. Files changed; files intentionally untouched.
5. Liquid/HTML and `content_for` / block-hierarchy changes.
6. Schema settings; new/reused theme/section/app blocks; presets/static IDs affected.
7. CSS scope (`custom_class` + stable internal scope) and exact stylesheet/variables.
8. Colors/typography/editability and defaults/inheritance.
9. JavaScript/interaction changes (or none).
10. Responsive and RTL/LTR review, native breakpoint evidence.
11. Accessibility and performance notes.
12. Merchant-data preservation and regression-risk review.
13. Limited validation **actually executed**, results and unavailable checks.
14. Manual Theme Editor/storefront QA steps and status.
15. Known limitations/blockers.
16. Mandatory project-plan status/log update.

Use status labels: `Passed`, `Failed`, `Not run`, `Not available`, `Requires manual verification`. Never call an unperformed browser test Passed.

## 23. One-section task prompt template

```text
Implement ONE section of this Shopify Horizon v4.4 project.

Project: [Snosha or actual project name]
Repository: [discover from workspace; verify Horizon version]
Mandatory project plan: [SNOSHA_PROJECT_PLAN.md or canonical project plan]
Page/template: [homepage/product/collection + exact template JSON]
Section: [name]
Figma file: [actual provided URL/file key]
Exact desktop node: [ID]
Exact mobile node: [ID]
Dynamic content: [Theme settings / theme blocks / product / collection / metafield / app]
Layout: [grid / slider / media + target desktop/tablet/mobile behavior]
Existing Horizon sections/blocks to inspect: [paths if known; discover otherwise]
Out of scope: [explicit unrelated areas]

Follow horizon-figma-to-sections-workflow SKILL.md completely.
Match Figma with the smallest safe change; inspect native Horizon sections and nested theme blocks first.
Use an editable custom_class on the section, scoped CSS, and editable color settings.
Preserve all merchant data, static block IDs, presets, and current theme behavior.
Use only verified native Horizon breakpoints; request approval for exceptions.
Produce the pre-implementation inspection report before edits.
Run only the permitted limited read-only validations; leave visual/interaction QA for the user.
Read or create the mandatory project plan before implementation; update it after implementation.
No commits, pushes, pulls, deployments, or changes outside this section.
Do not start the next section.
```

For bugfix use the same header plus reported issue, screen/breakpoint, observed/expected behavior. Diagnose root cause; make minimal fix; report real validation, manual QA requirements and plan update. **Do not rebuild the section. Do not start the next section.**

## 24. Mandatory project plan and statuses

- Plan is **required**, not optional. For Snosha: `SNOSHA_PROJECT_PLAN.md` in the repo root unless an existing canonical plan is explicitly designated. For a different project use a project-specific filename, not Snosha's.
- Before implementation/bugfix: read plan and relevant entry. If absent, create a **minimal, honest** plan before implementation: verified project/theme identity, Figma file/node map for scoped work, template/section inventory, statuses, decisions, blockers, implementation log. Do **not** fabricate full-site frame maps.
- Track sections with statuses such as `NOT_STARTED`, `SPEC_READY`, `IN_PROGRESS`, `IMPLEMENTED`, `BLOCKED`, `FIX_REQUESTED`, `VERIFIED` (only after actual manual visual/functional QA confirmation).
- Update the **same** target section entry after implementation/fix: files, decision, node IDs, checks, merchant data guarantees, unresolved QA, user approval or correction; do not duplicate entries.
- Project plan is mutable project **state**; `SKILL.md` remains the reusable **rules**. Do not copy large rules into the plan or store secrets there.

## 25. Explicitly prohibited failure modes

- Whole-site implementation, unrelated-section modifications, or automatic next-section execution.
- Importing Ayum/MEATCLUB/Kalles IDs, `hdt-*` elements, product-card numbers, CSS assumptions, money formatters, breakpoints, or temporary Figma URLs.
- Creating new blocks/sections before checking native Horizon sections, theme blocks, nested groups and settings.
- Sacrificing a material Figma requirement solely to avoid a justified isolated component.
- Editing `config/settings_data.json`, shared color schemes, generated JS/CSS, or global layout settings for one instance.
- Removing/renaming saved schema IDs, block types, static IDs, presets, block hierarchy/order, merchant data or app integrations.
- Editing shared blocks without checking every consumer and proving backward compatibility.
- Replacing native slider, variant/cart, money and media functionality with weaker custom code.
- Hardcoded brand colors in production CSS, unnecessary JS, fixed merchant images, broad CSS selectors, global overflow hacks, undocumented breakpoints.
- Claiming visual, browser, Theme Editor, runtime, accessibility, or functional QA without performing it.
- Auto-running broad validation, Theme Check, Git writes, deployment, or destructive operations without explicit permission.

## 26. Decision guide

| Situation                                               | Action                                                              |
| ------------------------------------------------------- | ------------------------------------------------------------------- |
| Native Horizon section/blocks match Figma with settings | Configure them; preserve existing content                           |
| Design needs a visual change only                       | Isolated CSS using stable section scope and editable custom_class   |
| Shared behavior requires additional option              | Additive setting/override defaulting off; review every consumer     |
| Figma needs a new compositional structure               | Extend existing theme blocks safely before creating a new block     |
| Shared extension would break other instances            | Isolated duplicate/new component with documented justification      |
| Theme block vs section-defined block ambiguity          | Inspect real schema/`content_for` path; preserve correct model      |
| Unsupported breakpoint necessary                        | Document conflict and request approval, no silent addition          |
| Figma source missing / app behavior unknown             | Mark `Needs verification`; do not invent facts or fake integrations |

## 27. Final agent checklist

**Before edits**

- [ ] Correct Horizon theme/version and active page/block tree confirmed in repo.
- [ ] Exact desktop/mobile Figma nodes inspected via MCP; no screenshot estimates treated as data.
- [ ] `SNOSHA_PROJECT_PLAN.md` or current project's canonical plan read/created.
- [ ] Closest native sections/theme blocks/groups and saved merchant state inspected.
- [ ] Smallest-safe-change option chosen with Figma fidelity and reuse justification.
- [ ] Custom class, color settings, safe scopes, actual breakpoints and RTL approach planned.
- [ ] Pre-implementation report delivered; out-of-scope components identified.

**Before reporting done**

- [ ] Native block hierarchy, static IDs/presets, settings and merchant-selected content preserved.
- [ ] No Kalles APIs, guessed theme tokens, fixed brand CSS colors, arbitrary breakpoints, new unneeded files or JS.
- [ ] Verified dynamic colors per block/section where needed; custom_class present or documented technical exception.
- [ ] Scoped read-only automated checks **actually run** and results recorded.
- [ ] Browser/visual/Theme Editor QA reported as manual pending unless truly performed.
- [ ] Mandatory project plan updated with real status and logs.
- [ ] No automated Git mutations, deployment, unrelated edits, or next section.
