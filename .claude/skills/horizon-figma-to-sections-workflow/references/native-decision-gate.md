# Native-first decision gate: procedure, recipe and examples

Supporting document for `SKILL.md` §5. It is generic: it works for any Horizon v4.4.x project. Project facts (approved extensions, component registry, branch names) belong in the project's own docs (`CLAUDE.md` / project plan / component registry).

**When to read this file:** before writing the Native Decision Record (NDR) for any task that might create, rebuild or replace a section or theme block, or that chooses between native and custom architecture.

---

## 1. Design and interaction inventory (input to the gate)

From the exact desktop and mobile Figma nodes, list:

| Group | What to record |
|---|---|
| Structure | Containers, rows/columns, nesting, repeated items, desktop → mobile reflow, order changes |
| Visual | Typography presets, colors, borders, radii, shadows, decorative layers (shapes, waves, sparkles), image treatment |
| Behavior | Carousel / slider / tabs / accordion / video / drag / hover / sticky / animation; what happens on touch, keyboard, end of list |
| Data | Product / collection / blog / metafield / app data; prices and money; dynamic vs merchant-typed text |
| Editability | What the merchant must change in the Theme Editor (text, images, links, counts, colors, visibility) |
| Semantics / a11y | Headings, lists, tables, buttons vs links, labels, ARIA patterns (tabs, accordion, carousel) |
| Locale / direction | RTL/LTR geometry, mixed-direction text, per-language assets |

Keep it short: one line per item. This inventory is what each native candidate is measured against.

## 2. Native discovery procedure (inspect code, not filenames)

Run these (or equivalent) and record what you found. A claim that Horizon "has no X" must cite the search that shows it.

1. **Stock section presets.** The generic section ships ready-made compositions:
   ```sh
   grep -n '"name": "t:names' sections/section.liquid       # preset and block names
   grep -n '"presets"' -A3 sections/*.liquid | grep '"name"' # presets of every section
   ```
   Also check the families closest to the design, e.g. `carousel`, `product-list`, `collection-list`, `featured-blog-posts`, `media-with-content`, `hero`, `slideshow`, `layered-slideshow`, `product-hotspots`, `featured-product`, `product-recommendations`, `main-*`.
2. **Blocks a candidate accepts:** read its `{% schema %}` `"blocks"` (`@theme`, `@app`, named types) and its `content_for` calls (static blocks with `id`).
3. **Stock blocks for the parts:** `ls blocks/`; read the schema of the matching ones (`group`, `text`, `image`, `video`, `button`, `icon`, `accordion`, `_accordion-row`, `comparison-slider`, `product-card`, `price`, `review`, `_card`, `_carousel-content`…).
4. **Behavior already implemented:** `grep -rn "customElements.define" assets/` and the snippets the candidate renders (`slideshow`, `resource-list-carousel`, `video`, `accordion-custom`, `product-form-component`…).
5. **Project-approved native extensions:** read the project's registry / `CLAUDE.md` list. A stock file that already has opt-in project settings is a native candidate, and its existing settings may close the gap.
6. **Project custom components:** list them separately. **They are not native alternatives.** Reusing one is a separate option ("reuse project component"), and repeating a custom pattern means re-running steps 1–4 first.
7. **Other worktrees / branches:** `git worktree list`, `git branch -a`, and the project registry. A component built elsewhere and not merged is a dependency to document, not something to rebuild.

Record the 2–3 closest candidates with file paths (and preset names).

## 3. Feasibility tests (in order, per candidate)

| Test | Question | Evidence required |
|---|---|---|
| A. As is | Do existing settings, presets and block composition reproduce the inventory? | Settings / blocks used per requirement |
| B. + scoped CSS | Do the section's `custom_class` (or the section-ID scope) and the project stylesheet close every **visual** gap? | For each visual gap: the CSS mechanism (e.g. CSS counters on a richtext `<ol>`, a scoped media query for a mobile size, pseudo-elements / background layers for decoration, `order` / `flex-direction` for reflow). When unsure, one minimal spike on a scratch instance. |
| C. + minimal extension | Do a few opt-in, default-off settings (or a small additive snippet branch) close the remaining **configuration / function** gaps? | §4 recipe: settings list, consumer list, "off = identical output", size estimate |
| D. Custom | Does a verified reason (§5) remain after A–C? | Cited file:line or a failing spike |

Stop at the first test that passes. A candidate failing the **default look** is not a failure of A–C; only a gap that CSS, settings and a small extension can't close counts.

## 4. Safe native extension recipe

Use it for any change to a stock (or already-extended) section, block or snippet.

1. **Consumers.** Find every user of the component:
   ```sh
   grep -ln '"type": "<section-or-block-type>"' templates/*.json sections/*-group.json
   grep -rn "render '<snippet>'\|content_for 'block', type: '<block>'" sections blocks snippets
   ```
   List them in the NDR (template + section/block ID).
2. **Opt-in settings.** Add optional settings with blank / `false` defaults. Group them behind one checkbox or a "style" select when they belong together (follow the project's existing extension pattern if one is registered). Use `visible_if` to keep the editor tidy. Respect the schema budget (Shopify `ExcessiveSettingsCount` warns above ~40 settings in one schema); move per-item controls into blocks.
3. **Identical output when off.** Every new branch is guarded: with the defaults, the rendered HTML/CSS of every consumer is byte-identical. Watch whitespace in `class`/`style` attributes (compare rendered output before/after for at least one consumer when the markup changes).
4. **Scoping.** New CSS lives in the project stylesheet assigned to the current branch/worktree, under the opt-in class (or `custom_class`), never on the stock class alone. No global selectors, no `!important`. If another active worktree styles the same native component, coordinate before changing that scope.
5. **Native behavior and a11y.** Keep IDs, `block.shopify_attributes`, static block IDs, presets, JS hooks (`ref`, `on:` attributes), focus and ARIA unchanged. Don't fork the component's JS.
6. **Verify consumers.** After the change: schema parses, Theme Check against the project baseline, each consumer still renders (one targeted check is allowed in speed mode), Theme Editor settings still save.
7. **Fidelity.** Show how the target instance reaches the design (settings + CSS); report what was measured and what is **Not visually verified**.
8. **Editor flexibility.** Merchant-meaningful values become settings (or reuse block settings); nothing is hardcoded just to match the screenshot.
9. **Document.** One line in the project docs: file, settings added, default-off guarantee. Add it to the project's approved-extension list / registry.

**When extension is genuinely high-risk** (the change would alter default output for existing consumers, needs to fork the component's JS, or would touch a global asset such as base CSS, token snippets or core modules): record why, and consider the safer alternatives (a project block inside the native section, a project snippet rendered by an opt-in branch, or a custom component).

Native extensions are evaluated on the same footing as new files. "It would mean editing a stock file" is not a risk by itself; changing default output is.

## 5. Custom creation: valid and invalid reasons

**Valid** (cite file:line or a failing spike):
1. Essential behavior can't be preserved with existing native components, even with an opt-in extension.
2. The extension would effectively rebuild the component (most of its markup / logic duplicated behind a flag).
3. Native reuse would cause unacceptable shared-component regressions (default output of existing consumers would change, or the shared JS would need forking).
4. Required semantics or accessibility can't be achieved safely (e.g. a data table, an ARIA tab pattern the native markup can't express).
5. A data / app contract the native component can't honor (e.g. app-driven form fields).
6. A platform limit only splitting can solve (schema setting budget, block nesting limits).

**Not valid on their own:**
- The default appearance differs from Figma.
- A Theme Editor control is missing (that's a test C question).
- The native section lacks `custom_class`, section-level colors or responsive item counts (test C).
- It is faster or easier.
- A previous project component uses this pattern.
- The prompt names a new file or says custom is acceptable (a candidate, not a waiver).
- A similarity percentage.

Don't force native either: if B or C would recreate substantial component logic inside a generic wrapper, or the shared-component risk is unacceptable, CUSTOM is the correct, documented outcome.

## 6. NDR template

```text
NATIVE DECISION RECORD — <section/block> (<template>; Figma desktop <id>, mobile <id>)
1. Design/behavior inventory: <structure | visual | behavior | data | editability | a11y | RTL>
2. Candidates inspected: <file + preset> · <file + preset> · <file>   (discovery: <grep/command>)
3. Native already covers: <requirements>
4. Gaps: visual: <…> | configuration: <…> | function/semantics/data: <…>
5. Scoped CSS (B): <mechanism per visual gap | spike result | n/a>
6. Existing settings (A/C): <settings that close config gaps | missing>
7. Minimal extension (C): <settings> · consumers: <list> · off = identical: <yes/no> · size: <~lines>
8. A11y / function impact: <kept / risks>
9. Decision: REUSE NATIVE AS IS | REUSE NATIVE + SCOPED CSS | EXTEND NATIVE MINIMALLY | CUSTOM REQUIRED — <valid reason #, file:line or spike>
10. Rejected (one line per candidate) and trade-offs: <…>
```

In speed mode each line may be a few words, but every line is present and names concrete files, settings or reasons. "Native alternatives failed" without names and reasons is not an NDR.

## 7. Calibration examples (generic patterns)

| Design | Likely outcome | Why |
|---|---|---|
| Heading + grid of icon/text items with custom card styling | REUSE NATIVE + SCOPED CSS, or EXTEND (responsive column counts) | Generic section preset with group/icon/text blocks; columns via an opt-in grid setting |
| FAQ in two columns with styled rows | REUSE NATIVE + SCOPED CSS | Generic section preset with accordion blocks; layout via a row group |
| Collection carousel with custom arrows and progress bar | EXTEND NATIVE MINIMALLY | Native collection list carousel; colors / progress as an opt-in group |
| Before/after slider beside a text column | REUSE + CSS / EXTEND (slider colors) | Generic section preset with the comparison-slider block |
| Product image with chips pinned at merchant-set coordinates, decorative rings, overlapping card, per-language slides | CUSTOM REQUIRED (reasons 1–2) | No native block takes coordinates on an image; an extension would rebuild the hero |
| Hotspots over an image, synced component rows and add-to-cart of a different (bundle) product | CUSTOM REQUIRED (reasons 1, 5) | Native hotspots lack bundle rows/totals; native product form is per product |
| Comparison table with row-synchronised columns | CUSTOM REQUIRED (reason 4) | Group blocks render `div`s; table semantics lost |
