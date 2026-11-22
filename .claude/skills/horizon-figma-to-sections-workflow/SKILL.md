---
name: horizon-figma-to-sections-workflow
description: Reusable Shopify Horizon v4.4 Figma-to-section engineering standard. Use BEFORE creating or rebuilding any section or theme block, implementing a Figma design, or choosing between native and custom architecture. Enforces native reuse → native + scoped CSS → minimal opt-in native extension → custom only with a verified reason, through mandatory native discovery and a written Native Decision Record; inspects exact desktop/mobile Figma nodes, preserves merchant data, nested blocks and Theme Editor flexibility, performs limited validation, maintains the project plan, and stops after one section.
---

# Shopify Horizon v4.4 — Figma → Sections Workflow

This is a **reusable Horizon v4.4 skill**, not an AYUM/Kalles implementation. **Current intended project: Snosha.** Do not embed Snosha design nodes, brand colors, store IDs, repository paths, or integrations as universal defaults. Project-specific facts belong in the mandatory project plan and must be verified in the current workspace. This skill does not authorize Figma edits, theme publication, deployment, or Git mutations.

**Operating principles:** exact Figma design is the design source of truth; reproduce it using the **smallest safe implementation**; investigate native Horizon sections, theme blocks, block groups, and settings before writing new structure; protect existing merchant content; expose meaningful merchant controls; isolate every change; report what was and was not tested.

**Architecture order (mandatory, §5):** **NATIVE REUSE → NATIVE + SCOPED CSS → MINIMAL NATIVE EXTENSION → CUSTOM ONLY WHEN JUSTIFIED.** No new section or theme-block file is created without a **Native Decision Record** (§5.3). Native extensions and custom files are judged on the same evidence standard; neither is the default. Detailed procedure, extension recipe and examples: `references/native-decision-gate.md` (read it before writing the NDR).

**Identity and discovery**

- Target family: Shopify **Horizon v4.4.x**, with **v4.4.0** as the requested baseline. Inspect `config/settings_schema.json` → `theme_info` and current files before relying on exact version behavior; never silently update the theme.
- Current project label: **Snosha**. Repository path, Figma URL/file key, page frames, section nodes, locales, and store integrations: **to be provided/discovered**. Never invent them.
- Read `CLAUDE.md` if present; do not modify it unless asked.
- **Activation:** this skill must be active before creating or rebuilding a section or theme block, implementing a Figma design, or choosing native vs custom architecture. Invoke it through the environment's skill mechanism (in Claude Code: the `Skill` tool with `horizon-figma-to-sections-workflow`, or the `/horizon-figma-to-sections-workflow` command). If invocation isn't available, read this file and `references/native-decision-gate.md` in full, and state in the report that the skill was loaded by reading. Don't start implementation before these instructions are loaded.
- **Mandatory plan:** `SNOSHA_PROJECT_PLAN.md` for Snosha. For another Horizon project use `<PROJECT_SLUG>_PROJECT_PLAN.md` (or its existing canonical project-plan path) consistently. No previous project's plan may be reused as this project's state.
- Shopify platform behavior and exact Horizon source code must be verified; do not assume Kalles `hdt-*`, `spacing-vars`, `btn-ultra`, `col_dk`, `themeHDN`, `ThemeEvents`, or Embla contracts.

---

## 0. Scope, boundaries, and workflow modes

- **One requested section per task, one page at a time.** Stop and report after that section; do **not** start another section or implement the whole page/site.
- **No external orchestrator, section workers, automated task chaining, or orchestrator approval gates.** This skill is self-contained; a future user may request a separate workflow but this skill never implicitly invokes one.
- Do not inspect, redesign, or edit unrelated sections. Reading a shared dependency to understand impact is permitted; changing it requires scope justification. For an opt-in tier-3 extension, the NDR's consumer list and "off = identical output" line is that justification (§5.4).
- In audit/spec/plan/report-only tasks, **do not modify storefront implementation files**. Updating the requested project plan is permitted only if the task explicitly authorizes a plan update.
- Before normal implementation, give a pre-implementation report (§4); if asked to implement immediately, still inspect and state any serious risk, then proceed safely.
- Manual visual/interaction QA belongs to the user; never claim browser or storefront verification without actually performing it under explicit permission.
- **Git:** current working tree only. No automatic branch, worktree, stash, commit, merge, pull, push, or deploy. Preserve uncommitted changes. Read-only Git inspection is allowed.

### 0.1 Speed mode: no automatic screenshots, visual QA or reports (standing user rule, 2026-11-17)

Prioritise implementation speed and concise answers. Unless the user explicitly asks for **Visual QA**, **screenshots**, or **pixel-perfect verification** in the current task:

- **No screenshots or image evidence:** do not capture screenshots, save images (e.g. to `docs/figma-validation/`), build before/after images or galleries, export Figma frames as image files for reports, or attach screenshots to answers. Existing screenshots stay untouched.
- **No visual QA:** no pixel-by-pixel or Figma-vs-browser comparisons, measurement tables, screenshot-based responsive audits, repeated viewport sweeps or automated visual regression. Do not open a browser just to produce visual evidence.
- **Figma MCP inspection stays on:** still read the exact nodes (`get_metadata`, `get_design_context`, `get_variable_defs`) whenever the implementation needs design data. `get_screenshot` / the screenshot in `get_design_context` may be viewed for understanding, never saved as evidence.
- **Checks stay lightweight:** only the essential static / syntax checks for the files changed (e.g. schema / JSON parse, `node --check`, `git diff --check`, and Theme Check against the baseline in `CLAUDE.md` when the change touches Liquid / schema). If a critical function needs confirmation, one short targeted check is allowed. Anything needing browser interaction otherwise is reported as **Not visually verified**.
- **Never shortened by speed mode:** native discovery (§2.1, §5.1), the comparison of named native alternatives, the **Native Decision Record** (§5.3), essential functionality checks (cart, variants, forms, carousels, app hooks touched by the change), consumer verification for shared extensions (§5.4), and the Theme Editor compatibility review (§8). Evidence may be terse (a few words per NDR line) but must name the files, settings and reasons. "Native alternatives failed" without naming them and the technical reason is an unsupported claim. A native + CSS spike needed to decide the architecture counts as the one allowed targeted check.
- **No automatic documentation:** no QA report `.md` files, screenshot docs, before/after tables, evidence folders or long implementation reports. Write documentation only when the user asks, when the project plan needs a brief status line, or to record a critical technical decision — concise and text-only. Never delete existing documentation.
- **Answer format** (replaces the long report formats in §4, §20 and §22 unless the user asks for them):
  1. **Completed:** what changed.
  2. **Files:** files modified.
  3. **Checks:** only checks actually performed.
  4. **Notes:** blockers or items needing the user's manual review.

All other rules of this skill (architecture order and decision gate, native Horizon first, RTL, Figma as source of truth, Theme Editor control, scoped CSS / worktree ownership, no hard-coded tokens, no unauthorised Git or publishing, no unnecessary Shopify CLI restarts) are unchanged.

## 1. Sources of truth and conflicts

Priority for design information:

1. Exact **section-specific** desktop and mobile Figma nodes (both authoritative).
2. Figma MCP structured data: `get_design_context`, `get_metadata`, `get_variable_defs`; screenshots only confirm appearance.
3. Real Figma assets and variables; inspect actual export settings and supported permanent storage.
4. Screenshot/cropped reference for visual comparison only; never measure pixels by eye when real node values exist.
5. Full-page Figma frame for layout/order context only, not a substitute for section nodes.
6. Current verified theme behavior and actual merchant configuration, then explicitly stated engineering assumptions.

For instruction conflicts: latest explicit user request → this skill → `CLAUDE.md` → verified active repository code → mandatory project plan → verified Shopify platform constraints → engineering judgment. Shopify platform syntax/constraints cannot be overridden by design or instructions. Report irresolvable conflicts as **Needs verification** and use the least destructive path; never fabricate measurements.

- **A prompt that names a new file or says a custom section is acceptable is a candidate, not a waiver of the decision gate.** Still produce the NDR (§5.3). If the gate points to native reuse or an extension, say so and ask before creating the named file. Only an explicit user instruction to skip the gate for this task (e.g. "build it as a custom section regardless") overrides it, and the NDR then records that instruction.

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
- Prefer existing **Horizon section + theme blocks + settings** where they can reproduce Figma faithfully. **Do not sacrifice an important design requirement** merely to avoid a new file — but only function, semantics/accessibility, data/app contracts, editability or platform limits can justify custom code. A *visual* requirement justifies custom only after native + scoped CSS was assessed and the NDR records why CSS can't reach it (§5).
- **Mandatory native discovery (before any new section/block, rebuild, or native-vs-custom choice)** — inspect actual code, not filenames: (1) stock sections **and their presets**, starting with the generic `sections/section.liquid` (its presets are ready-made compositions, e.g. FAQ, image compare, icons with text, video) and the families closest to the design; (2) the block types each candidate accepts and its static `content_for` blocks; (3) stock blocks for each part of the design; (4) behavior already implemented (custom elements, slideshow/carousel, video, accordion, product form snippets); (5) the project's approved native extensions (stock files that already carry opt-in project settings); (6) the project's own custom components and other worktrees/branches (§19A). Record the 2–3 closest candidates with file paths. **A claim that Horizon lacks a component must cite the search that shows its absence.** Commands and checklist: `references/native-decision-gate.md` §2.
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
- **A previous project custom section/block is not a native alternative.** It may be reused as a project component, but when a new section would follow an existing project custom pattern (e.g. "a thin wrapper like the last one"), re-run native discovery against stock Horizon first. A prefix such as `snosha-` names project files; it does not imply that a design section needs its own custom file.

## 3. Direct Figma MCP requirements

- Inspect both exact node IDs via supported Figma MCP tools. If available, create/reuse a session for the project file; follow the Figma connector's required setup (including its design-to-code skill) before `get_design_context`.
- Use `get_metadata` for hierarchy, `get_design_context` for real measurements and structure, `get_variable_defs` for tokens, `get_screenshot` only for visual confirmation.
- If a frame is too large, query target nodes individually rather than repeatedly requesting entire page context.
- Treat Figma temporary asset URLs as ephemeral; **never** commit them in production Liquid/CSS/JS/JSON. Prefer Theme Editor pickers and Shopify product/collection resources, or permanent local assets when truly required.
- Do not edit the Figma file unless separately authorized.

## 4. Required pre-implementation inspection and report

**Figma-to-native workflow (mandatory order; never go straight from Figma inspection to a new Liquid file):**

1. Inspect the exact desktop and mobile Figma nodes (§1, §3).
2. Write the design and interaction inventory (structure, visual, behavior, data, editability, semantics, RTL).
3. Native component discovery (§2.1).
4. Native feasibility: reuse as is (§5 tier 1).
5. Scoped CSS feasibility (§5 tier 2).
6. Minimal extension assessment (§5 tier 3, recipe §5.4).
7. Native Decision Record (§5.3).
8. Implementation.
9. Validation: static checks, consumer checks for shared changes, essential functions; visual checks as permitted (§21).
10. Evidence-based final report (§0.1 / §22), including the NDR decision line.

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

In speed mode (§0.1) this report is a few lines (path, reuse choice, files, risks) unless the user asks for the full version — **plus the complete NDR whenever a section/block file would be created or rebuilt** (each NDR line may be terse). If user requested immediate implementation, this report may be concise, but inspection, the NDR and scope checks still apply. Ask questions only when required for safe correctness; otherwise proceed using explicitly documented low-risk assumptions.

## 5. Native-first architecture with design fidelity

**Goal:** match the supplied desktop/mobile design accurately with the **smallest safe modification**. Fidelity and reuse are both requirements: don't sacrifice a material design requirement, and don't create a file a native composition + CSS + small extension could cover.

### 5.1 The four tiers (choose the first tier that meets the design and preserves native behavior)

| Tier | Decision | Former ladder steps |
|---|---|---|
| 1 | **REUSE NATIVE AS IS**: configure an existing section (or one of its presets) and its blocks/settings; re-compose compatible theme blocks/groups without breaking hierarchy or other instances | 1, 2 |
| 2 | **REUSE NATIVE + SCOPED CSS**: add `custom_class` (or the section-ID scope) and scoped CSS in the project stylesheet | 3, 4 (class) |
| 3 | **EXTEND NATIVE MINIMALLY**: add opt-in, default-off settings or a small additive branch to the closest section/block/snippet, following §5.4 | 4 (setting), 5 |
| 4 | **CUSTOM REQUIRED — VERIFIED TECHNICAL REASON**: a new block/section (or an isolated duplicate where extension would change shared default output) | 6, 7 |

- Run tiers 1–3 against **each** of the 2–3 closest candidates from discovery (§2.1). A candidate's **default appearance** differing from Figma is not a tier failure; only a gap that settings, CSS and a small extension can't close is.
- **Missing Theme Editor controls** (including `custom_class`, colors, responsive item counts) are a tier-3 question, never a tier-4 reason by themselves.
- **Tier 2 evidence:** name the CSS mechanism for every visual gap (or run one minimal spike). Skipping tier 2 without that is not allowed.
- **Similarity percentages** are informational only and never decide the tier.
- **Don't force native** where tiers 2–3 would recreate substantial component logic inside a generic wrapper or introduce unacceptable shared-component risk — that is a valid tier-4 outcome when recorded.

### 5.2 Custom creation policy

A new custom section or theme block requires a **verified reason**, cited with file:line or a failing spike:

1. Essential behavior can't be preserved with native components, even with a tier-3 extension.
2. The extension would effectively rebuild the component (most markup/logic duplicated behind a flag).
3. Native reuse would cause unacceptable shared-component regressions (default output of existing consumers changes, or shared JS must be forked).
4. Required semantics or accessibility can't be achieved safely.
5. A data or app contract the native component can't honor.
6. A platform limit only splitting can solve (e.g. schema setting budget), after per-item controls were moved into blocks and duplicated section-level controls removed (§8).

**Not sufficient:** faster/easier; avoiding a small safe native change; default look differs; a missing control; an earlier project component uses the pattern; the prompt names a file or pre-approves custom; a similarity score.

No parallel UI frameworks, unnecessary helper scripts/files, broad refactors, or duplicate slider libraries.

### 5.3 Native Decision Record (NDR) — required before any new section/block file

Produced in the pre-implementation report (also in speed mode) and summarised in one line in the project plan entry. Template (details: `references/native-decision-gate.md` §6):

```text
NATIVE DECISION RECORD — <section/block> (<template>; Figma desktop <id>, mobile <id>)
1. Design/behavior inventory
2. Candidates inspected (file + preset) and the discovery commands
3. Native already covers
4. Gaps: visual | configuration | function/semantics/data
5. Scoped CSS (tier 2): mechanism per visual gap / spike result
6. Existing settings that close configuration gaps
7. Minimal extension (tier 3): settings · consumers · off = identical? · size
8. Accessibility / function impact
9. Decision: <tier> — <verified reason #, file:line or spike> (tier 4 only)
10. Rejected candidates (one line each) and trade-offs
```

Creating a section/block file without an NDR is a prohibited failure mode (§25). Rebuilding an existing section, or replacing a native one with custom code, also needs an NDR.

### 5.4 Safe native extension (tier 3) — no extra approval when all conditions hold

Opt-in extension of a stock or previously extended section, block or snippet is a normal, preferred step. It needs **no separate approval** when: every new setting defaults to blank/off; default output is identical for every consumer; CSS is scoped to the opt-in class or `custom_class`; native IDs, presets, static blocks, JS hooks and accessibility are unchanged; and no global asset (base CSS, token snippets, core JS modules) changes. Procedure (full recipe in `references/native-decision-gate.md` §4):

1. Enumerate every consumer (grep templates and section groups; list them in the NDR).
2. Add optional, backward-compatible settings (grouped behind one toggle or style option; `visible_if`; mind the schema setting budget).
3. Guard every new branch so disabled settings produce identical output.
4. Scope CSS to the opt-in class / `custom_class`; no global selectors or `!important`.
5. Keep native behavior and accessibility intact; don't fork the component's JS.
6. Verify existing consumers after the change (static checks; one targeted render check in speed mode).
7. Show how the target instance reaches the design; mark what is **Not visually verified**.
8. Keep merchant flexibility (§8); don't hardcode values to match the screenshot.
9. Document the extension in the project's approved-extension list / registry.

Escalate (ask) only when the extension would change default output for existing consumers, fork shared JS, or touch a global asset — and record why a safer architecture (a project block inside the native section, an opt-in snippet branch, or tier 4) was or wasn't chosen.

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

- **On native sections, a missing `custom_class` is a tier-3 extension (§5.4), not a reason for a wrapper or custom section.** Reuse an existing project-added `custom_class` first; otherwise add it as an optional text setting (blank = identical output) following §5.4.
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
- Before extending a shared component, enumerate its existing consumers and prove new default behavior is inert on all of them (blank/false-gated overrides where appropriate). This is the routine §5.4 procedure, not a deterrent: an opt-in extension that passes it is preferred over a new file.
- Shopify-owned money, discounts, taxes, inventory, shipping, and checkout are authoritative; don't reimplement with parsed formatted text or guessed prices.

## 8. Theme Editor, blocks, and presets

- User-configurable content belongs in appropriate native settings, reusable theme blocks, or section schema: headings, text, CTAs, menu, product/collection picker, images, desktop/mobile media, videos, colors, alignment, visibility, spacing, and responsive layout controls when justified.
- **Theme Editor flexibility (every implementation):** map each merchant-meaningful Figma value to an existing control first (block settings, presets, section settings). Where a control is missing, assess a tier-3 extension (§5.4) before anything else. Don't hardcode values just to reproduce the current screenshot, and don't add section-level settings that duplicate controls native blocks already provide (e.g. a section "heading color" when the `text` block has a color). Record intentional trade-offs (a value fixed in CSS, a control moved to a block) in the NDR.
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

1. Existing Horizon theme color scheme/tokens, **if they match and don't change unrelated instances**; and the **color settings of the native blocks** used (e.g. `text`, `group`, `button`), which already give per-instance control.
2. New/reused **section-level `color` settings** for independent section-wide foreground/background/accent/border colors that native block settings can't express. On a native section these are an opt-in tier-3 extension (§5.4); a native section lacking them is never on its own a reason for a custom section.
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

- Confirm actual loaded stylesheet and component ownership before editing. If the project designates a project stylesheet — globally or **per branch / worktree** (recorded in `CLAUDE.md` or the project plan) — put new section/component CSS in the stylesheet assigned to the **current** branch/worktree, under the section's stable scope, instead of in per-section `{% stylesheet %}` blocks. Verify that stylesheet is actually linked by the layout before relying on it. Never define the same scope in two project stylesheets. Changes to shared native CSS scopes, or to the layout's stylesheet links, need coordination when several worktrees are active (§19A). Otherwise prefer an existing section/block stylesheet or the current project's approved scoped asset; create a new one only if earlier options are unsafe.
- For dynamic Liquid-derived variables, use scoped `{% style %}` in Liquid rather than Liquid inside static CSS.
- CSS scope must be tied to a stable wrapper or section/block ID; no broad `.button`, `.slider`, `html`, or `body` layout overrides for one component.
- Use logical properties (`margin-inline`, `padding-inline`, `inset-inline-start`) for RTL. Avoid unnecessary `!important`, CSS collisions, over-specific selector chains, and indexing-based selectors.
- Do not edit generated/minified CSS or JS, or overwrite core files without documented justification and explicit approval if the edit has cross-page impact. "Core files" here means global assets (base CSS, token/variable snippets, core JS modules) and any edit that changes default output. **Additive opt-in settings on native section/block files that keep default output identical are tier-3 extensions (§5.4), not core overwrites.**
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
- For **new custom** grid/carousel sections, expose merchant-editable visible-item settings for desktop, tablet and mobile **where the component meaningfully supports these modes**, using verified Horizon naming/conventions—not Kalles field names. If native Horizon already has controls, reuse them. Don't make controls that silently do nothing. When reusing a **native** grid/carousel that lacks tablet/mobile counts, add them as an opt-in tier-3 extension (§5.4); the missing counts don't justify a custom section.
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

## 19A. Multi-session and multi-worktree component reuse

Parallel sessions must not independently recreate components that already exist elsewhere.

- Before creating a component, check: `git worktree list`, `git branch -a` (read-only), the project's component registry / approved-extension list (if the project keeps one), completed native extensions, and reusable snippets, blocks and custom elements in the current tree.
- If a reusable component exists in another worktree or unmerged branch, **document the dependency** in the NDR and the project plan, and follow the project's coordination rule (reuse after merge, or ask). Don't rebuild it, and don't merge, cherry-pick, check out or copy files from another branch automatically.
- Don't edit files another session owns (per the registry / plan / stylesheet ownership) without coordination. Shared stock files touched by two sessions need an agreed owner for the change. Each session writes CSS only to the stylesheet assigned to its own branch/worktree (§9).
- After implementing a new component or extension, add it to the registry / plan so the next session finds it.

## 20. Follow-up / bugfix

- Read current project plan entry and active code. Find root cause before patching; avoid symptom-only CSS overrides and whole-section rebuilds.
- Smallest safe scoped diff; fewest files/lines; preserve IDs, presets, block hierarchy, custom class, content, native interactions.
- Check desktop/mobile/RTL, breakpoint boundaries, app/product states, and Theme Editor reload as **manual QA requirements**. No broad refactoring or unapproved extra breakpoints.
- Final bugfix answer: the §0.1 format (root cause in one line under **Completed**); the long report (root cause, exact fix, files, preserved behavior, validation, manual QA steps, limits, plan entry) only when the user asks for it.

## 21. Limited automated validation + manual QA

Speed mode (§0.1) applies: run only the checks relevant to the changed files, report them in one line each, and mark anything needing a browser as **Not visually verified**. Browser / screenshot work only on an explicit request for Visual QA, screenshots or pixel-perfect verification.

**Allowed/expected, read-only and scoped to files changed:**

- Parse edited template/section-group JSON; parse all edited `{% schema %}` JSON; check IDs, block type references, and preset/static block consistency where programmatically verifiable.
- Perform **read-only** `git diff --check`, `git diff --stat`, and focused diff review; ensure no unrelated files changed.
- Check Liquid tag balance if available; mark **Not verified** if no reliable Liquid parser exists. Static grep is not a substitute for runtime validation.
- Read-only targeted scans for CSS scope leaks, physical left/right properties needing RTL review, new unauthorized media breakpoints, duplicate/missing block references, Figma ephemeral URLs, secrets, generated files and prohibited edits.
- For tier-3 extensions: confirm every consumer listed in the NDR still renders with the extension off (schema parse + one targeted render check of at least one existing consumer when markup changed).
- Report each check with its actual result, including **Not run** or **Not available**.

**Allowed when the project's `CLAUDE.md` defines a baseline:** `shopify theme check` for Liquid / schema changes, compared against that baseline (§0.1).

**Not authorized unless explicitly requested:** theme pull/push/publish, full lint/test suites, auto-fix, automated browser/screenshot visual comparison, deployment, commits or Git writes, or any destructive command.

**Manual QA owned by user (do not claim Passed without evidence):** desktop and mobile Figma match; tablet/intermediate width, RTL/LTR, sliders, product/cart/variants, video, keyboard/a11y, Theme Editor reload/drag/drop, block visibility/reordering, blank states, color editor independence, storefront performance.

Before handoff, review **all** changed Liquid, schema, assets and template wiring; preserve existing data, block structure, static IDs, settings, and unrelated files. Clearly distinguish `Inspected`, `Validated by executed check`, `Requires manual verification`, and `Not available`. Never mark a section `VERIFIED` based on static checks only.

## 22. Final report format

**Default:** the concise §0.1 answer (Completed / Files / Checks / Notes). Use the long format below only when the user asks for a full report.

Report in this order:

1. Files inspected and actual active code path.
2. Figma desktop/mobile nodes inspected (or access blockers).
3. Native Decision Record (tier chosen, candidates, reason); existing Horizon architecture/blocks reused and design-fidelity tradeoffs.
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

Follow horizon-figma-to-sections-workflow SKILL.md completely (invoke the skill; read references/native-decision-gate.md).
Match Figma with the smallest safe change; run native discovery (stock sections + presets, blocks, approved extensions, other worktrees) first.
Produce the Native Decision Record before creating or rebuilding any section/block file; a file named in this prompt is a candidate, not a waiver.
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
- Update the **same** target section entry after implementation/fix: files, decision, node IDs, checks, merchant data guarantees, unresolved QA, user approval or correction; do not duplicate entries. The decision line states the NDR outcome: `NDR: <tier> — candidates <files/presets> — reason <…>`.
- Project plan is mutable project **state**; `SKILL.md` remains the reusable **rules**. Do not copy large rules into the plan or store secrets there.

## 25. Explicitly prohibited failure modes

- Whole-site implementation, unrelated-section modifications, or automatic next-section execution.
- Importing Ayum/MEATCLUB/Kalles IDs, `hdt-*` elements, product-card numbers, CSS assumptions, money formatters, breakpoints, or temporary Figma URLs.
- Creating new blocks/sections before checking native Horizon sections, theme blocks, nested groups and settings.
- Creating, rebuilding or replacing a section/block **without a Native Decision Record** (§5.3), or with one whose rejections don't name the candidates and technical reasons.
- Choosing custom because a native control is missing, because it is faster, because a prompt named a file, or because an earlier project component used the pattern (§5.2).
- Claiming Horizon lacks a component without citing the search that shows it (§2.1).
- Rebuilding a component that exists in another worktree/branch instead of documenting the dependency (§19A).
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
| Native Horizon section/blocks (or a stock preset) match Figma with settings | Tier 1: configure them; preserve existing content |
| Design needs a visual change only                       | Tier 2: isolated CSS using stable section scope and editable custom_class |
| Native section lacks `custom_class`, colors or item counts | Tier 3: opt-in settings (§5.4) — never a custom reason on its own |
| Shared behavior requires additional option              | Tier 3: additive setting/override defaulting off; review every consumer |
| Figma needs a new compositional structure               | Re-compose native blocks / extend existing theme blocks safely before creating a new block |
| Shared extension would change default output or fork shared JS | Tier 4: isolated duplicate/new component with NDR reason 3 |
| Native would need its logic rebuilt inside a wrapper    | Tier 4: custom component with NDR reason 2 |
| Prompt names a new file / pre-approves custom           | Run the gate anyway; report the result before creating the file |
| Component exists in another worktree/branch             | Document the dependency (§19A); don't rebuild or auto-merge |
| Theme block vs section-defined block ambiguity          | Inspect real schema/`content_for` path; preserve correct model      |
| Unsupported breakpoint necessary                        | Document conflict and request approval, no silent addition          |
| Figma source missing / app behavior unknown             | Mark `Needs verification`; do not invent facts or fake integrations |

## 27. Final agent checklist

**Before edits**

- [ ] Correct Horizon theme/version and active page/block tree confirmed in repo.
- [ ] Exact desktop/mobile Figma nodes inspected via MCP; no screenshot estimates treated as data.
- [ ] `SNOSHA_PROJECT_PLAN.md` or current project's canonical plan read/created.
- [ ] Skill invoked (or its instructions explicitly loaded, with the limitation reported).
- [ ] Closest native sections/theme blocks/groups and saved merchant state inspected — **evidence:** the discovery commands and the 2–3 candidate files/presets named in the NDR.
- [ ] Other worktrees / registry checked for an existing component — **evidence:** a one-line result in the NDR.
- [ ] Tier chosen through §5 — **evidence:** NDR lines 5–7 (CSS mechanism, settings, extension + consumers) and line 9 (tier + verified reason for tier 4).
- [ ] Smallest-safe-change option chosen with Figma fidelity and reuse justification.
- [ ] Custom class, color settings, safe scopes, actual breakpoints and RTL approach planned.
- [ ] Pre-implementation report delivered; out-of-scope components identified.

**Before reporting done**

- [ ] Native block hierarchy, static IDs/presets, settings and merchant-selected content preserved.
- [ ] Tier-3 extensions: every listed consumer checked with the extension off; extension recorded in the project's approved-extension list / registry.
- [ ] Theme Editor flexibility kept: merchant-meaningful values are settings; no duplicated section-level controls; trade-offs recorded.
- [ ] No Kalles APIs, guessed theme tokens, fixed brand CSS colors, arbitrary breakpoints, new unneeded files or JS.
- [ ] Verified dynamic colors per block/section where needed; custom_class present or documented technical exception.
- [ ] Scoped read-only automated checks **actually run** and results recorded.
- [ ] Browser/visual/Theme Editor QA reported as manual pending / **Not visually verified** unless truly performed (no automatic screenshots or visual sweeps — §0.1).
- [ ] Mandatory project plan updated with a brief, text-only status line (no screenshots, measurement tables or separate QA reports unless requested).
- [ ] No automated Git mutations, deployment, unrelated edits, or next section.
