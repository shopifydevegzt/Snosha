# SNOSHA — Skill Root-Cause Audit: why custom sections were created despite REUSE FIRST

Date: 2026-11-22 · Audit and recommendations only. No skill, theme, template, CSS, JS, data or translation file was changed.

**Scope.** Why the SNOSHA workflow built 20 custom sections while `.claude/skills/horizon-figma-to-sections-workflow/SKILL.md` prescribed "reuse first → extend second → create last", and what would stop it from happening again.

**Evidence used**

- The skill as it is now: one file, 457 lines, no supporting files, templates or scripts. Line numbers below refer to it.
- Its two Git versions: `46782b0` (2026-11-08) and `b0c22ba` (2026-11-17, which added only §0.1 "speed mode").
- `CLAUDE.md`, with its history.
- `SNOSHA_PROJECT_PLAN.md`: section map, §D strategy, and the §G implementation log with its recorded "Reuse decision" entries.
- `SNOSHA_NATIVE_HORIZON_AUDIT.md`: R1 similarity table §2.1 and R2 feasibility re-check §12.
- `SNOSHA_NATIVE_MIGRATION_PLAN.md`.
- Git history: 138 commits.
- The 10 local Claude Code transcripts in `~/.claude/projects/e--Work-Snosha-Project/`, analysed read-only for:
  - user prompts;
  - `Skill` tool calls;
  - reads of `SKILL.md`;
  - `Write` calls creating files under `sections/` and `blocks/`;
  - the agent's stated reasoning.

**Evidence limits**

- Transcripts exist for **9 of the 20** custom sections.
- The other 11 were built in sessions whose transcripts aren't on this machine (mostly on the `dev1` worktree). For those, the only evidence is the agent-written plan entries and the commits. Plan entries were written **after** implementation, so they are a recorded rationale, not proof of what was inspected beforehand.
- Anything that can't be shown is marked **UNVERIFIED**.

---

## 1. Executive summary

**Main finding.** The reuse order was written down, and the prompts repeated it in strong terms. But the skill made reuse **expensive** and custom creation **cheap**:

- **Extending** a shared native component required:
  - enumerating its consumers (L191);
  - proving the change inert (L191);
  - scope justification (L26);
  - approval for cross-page impact (L246).
- **Creating** a new file only required a one-sentence explanation (L161), and nothing checked it.
- The skill **also made controls mandatory** that native sections don't have: `custom_class` on every section, "including native Horizon sections being modified" (L165), and section-level color settings (L207–214).

So the native option failed by definition unless the shared section was edited, and the agent avoided editing shared sections. The documented decisions show exactly this pattern:

- **Collections** (plan L315): the wrapper "exists so the shared native section needs no new settings (`custom_class`, colors)".
- **Why** (plan L570): generic `section` + `group` "needs a design mode on a shared section for the grid, mobile padding and scope".
- **Before/After** (plan L419): the same reason. Then "same pattern as #4" (plan L421) and "same pattern as #4 / #8" (plan L571): once the wrapper pattern existed, it was copied.

The successful 2026-11-20 migrations did **exactly what those decisions rejected**. They added opt-in, off-by-default settings to `sections/section.liquid` (`custom_class` L9, `snosha_grid` L11–13, `snosha_mobile_padding` L15) and an opt-in group to `collection-list.liquid`, after listing every consumer.

**Skill design versus agent execution**

| | Share | What happened |
|---|---|---|
| Skill design (missing, weak or conflicting rules) | Primary | Asymmetric burden of proof; mandatory controls that disqualify native sections; no native discovery procedure; no proof-of-concept step for native + CSS; no evidence format; prompts allowed to override the skill. |
| Agent execution (rule present, not followed) | Secondary | Stock `section.liquid` presets ("FAQ section", "Image compare", "Icons with text", "Video section") never inspected. One factual error ("Horizon 4.4 has no video section", plan L800; the preset exists, `sections/section.liquid` L846). One-line ladder decisions ("Steps 1–6 fail"). No native + CSS attempt where CSS was enough (steps numbering, mobile heading size). |
| Prompt/process | Contributing | Some prompts pre-named the custom file (F1 banner) or pre-approved custom sections (bundle contents/value). One cited a wrong skill path. Parallel `dev1`/`main` worktrees blocked reuse of unmerged work. |
| Skill activation | Contributing | The project skill was **never invoked** via the Skill tool in any of the 10 transcripts. It was loaded only when a prompt told the agent to read it (`SKILL.md` was read 28 times across sessions). Whether it was read in the 11 untranscribed sessions is UNVERIFIED. |

**What the successful migrations proved.** Native reuse was technically feasible for 4 sections the original decisions had rejected. The difference was not new Horizon capability. It came from:

- an explicit, approved plan item for a small shared-section extension (migration plan "P", L95–100);
- the stock section presets used as recipes;
- feasibility classes (A/B/C/D) instead of similarity percentages;
- a baseline-versus-native comparison;
- explicit preservation of IDs and translation keys.

---

## 2. What the skill actually says (by workflow area)

| # | Area | Exact instruction (file:line) | Strength |
|---|---|---|---|
| 1 | Skill activation | Frontmatter `description` (SKILL.md L3). `CLAUDE.md` L9: "Section-by-section Figma work follows the project skill". Plan §D step 4 cites "skill §4" (plan L153). **No rule requires invoking the skill**, and nothing detects that it wasn't loaded. | AMBIGUOUS |
| 2 | Figma inspection | L53–66 (exact desktop + mobile nodes, `get_design_context`, no screenshot measurements); §3 L121–125; checklist L442. | MANDATORY BUT NOT VERIFIABLE (self-ticked). Followed in all transcripted cases. |
| 3 | Horizon section discovery | §2.1 L72–73 (trace the render path); L77 "Prefer existing Horizon section + theme blocks + settings…"; L78 "Inspect relevant Horizon components… as needed"; §4 L129. **No list of where to look** (stock section presets, block compositions, presets inside `section.liquid`). | MANDATORY BUT NOT VERIFIABLE; procedure MISSING |
| 4 | Native block discovery | L74–76 (theme / section / app blocks, static blocks, nesting); §12 L267–269 (sliders); §13 L276–277 (cards). | RECOMMENDED / per area |
| 5 | Reuse decision | §5 L151–159 (7-step ladder, "choose the first option that meets the actual design"). §4 report items 3–4 (L135–136). §26 decision table L428–435. | MANDATORY order, NOT VERIFIABLE |
| 6 | Native extension | Ladder steps 4–5 (L156–157: additive, blank/off defaults). L191: "Before extending a shared component, enumerate its existing consumers and prove new default behavior is inert". L217 (off-by-default color toggles). §26 L430. | MANDATORY, but high friction and in tension with #7 and #8 |
| 7 | Custom creation | L159 "only as a last resort"; L161 "Before creating any new file, explain why earlier options cannot meet the design safely"; L414 (prohibited: creating before checking native). **Counter-rules:** L77 "Do not sacrifice an important design requirement merely to avoid a new file"; L161 "Prefer isolated new implementation rather than damaging shared instances"; L415 (prohibited: sacrificing a Figma requirement to avoid an isolated component). | MANDATORY BUT NOT VERIFIABLE; CONFLICTING counterweights |
| 8 | CSS customization | §2.2 L83–88; §9 L242–247; L246 "Do not… overwrite core files without documented justification and explicit approval if the edit has cross-page impact". `CLAUDE.md` L73–78 (`main.css`, one top-level scope "e.g. `.snosha-hero`"), L89 ("Don't edit Horizon core files… when an override in the project files can do the job"). | MANDATORY; CONFLICTING with #6 in practice |
| 9 | Theme Editor settings | §6 L165 (custom_class mandatory on every section, **including native sections being modified**); §8 L196; §8A L207–214 (section- and block-level `color` settings); §10 L255 ("don't invent a giant generic settings panel"); §12 L271 (visible-item counts for new custom carousels). | MANDATORY; CONFLICTING (forces edits to native sections) |
| 10 | Testing and validation | §21 L329–343 (static checks only; visual QA is the user's); §0.1 L32–47 speed mode (no visual QA, "few lines" report, L145); checklist §27 L439–457. | Static checks MANDATORY AND VERIFIABLE. Fidelity of a native + CSS option: MISSING. |

**Conflict-resolution order:** L60 "latest explicit user request → this skill → `CLAUDE.md` → …". A prompt that names a custom file therefore overrides the ladder.

---

## 3. Intended workflow versus the skill

| Intended step | In the skill? | Classification | Gap |
|---|---|---|---|
| 1. Inspect Figma (desktop, mobile, structure, typography, behavior, editor needs) | L53–66, L121–125 | MANDATORY BUT NOT VERIFIABLE | Fine in practice. |
| 2. Inspect existing Horizon components (sections, blocks, presets, snippets, sliders, accordions, settings) | L72–78, L129 | Mandatory in wording, generic in method | **No inventory of stock compositions.** The `section.liquid` presets were never consulted in the original decisions: the plan at `f2d9b30` has 0 mentions of "Icons with text", "Image compare" or "FAQ section". |
| 3. Attempt direct native reuse | Ladder 1–2 (L153–154) | MANDATORY, NOT VERIFIABLE | No evidence format. |
| 4. Attempt native + `custom_class` + scoped CSS; don't reject native because the default look differs | Ladder 3–4 (L155–156); §26 L429 | Present, but no "attempt" requirement | **No proof of concept required.** In speed mode it couldn't be checked even if attempted (L37, L145). |
| 5. Attempt minimal native extension, protect existing behavior | Ladder 5 (L157), L191, L217 | MANDATORY, high friction | No worked procedure or example of a safe opt-in extension, and no statement that such an edit is allowed without extra approval. L246 and `CLAUDE.md` L89 read as "avoid". |
| 6. Create from scratch only when necessary | L159, L161, L414 | MANDATORY BUT NOT VERIFIABLE | Satisfied by one sentence. Offset by L77 / L415. |
| 7. Verify (Figma, responsive, RTL/LTR, functionality, editor) | §21, §27 | Static: verifiable. Visual: user-owned. | Nothing verifies the **reuse decision** itself. |

---

## 4. Root cause matrix

| # | Problem | Evidence | Existing skill rule | Root cause | Proposed fix | Priority |
|---|---|---|---|---|---|---|
| R1 | Extending a shared native section was avoided, and a wrapper section created instead | Plan L315 (collections: wrapper so the native section "needs no new settings"); L419 (before/after: "would need a design-specific mode… on a section shared with the collection and contact templates"); L570 (why: same); L800 (video: "editing that shared block would change every section using it"); collections session report: "I didn't add the required `custom_class` and color settings to the shared native section, because that would have meant editing a Horizon core file" | L191, L246, L26 vs L165, L207–214; `CLAUDE.md` L89 | **Conflicting instructions + asymmetric burden** | Make opt-in, default-off extensions of native sections an explicitly allowed, preferred step, with a fixed safety procedure (§8 G1, G2). Put an equal or higher evidence burden on custom creation. | **Critical** |
| R2 | Mandatory controls disqualified native sections | `custom_class` "including native Horizon sections being modified" (L165); section-level color settings (L212); carousel counts (L271); prompts requesting many controls → the 40-setting limit (plan L695, L753) | L165, L207–214, L271 | **Instruction design**: requirements written for custom sections and applied to native reuse | Satisfy control requirements through native block settings first. A missing control is an *extension* gap, never a *custom* justification (§8 G3). | **Critical** |
| R3 | Native discovery missed stock compositions | Original plan never cites the `section.liquid` presets; video decision says "Horizon 4.4 has no video section" (plan L800) though `sections/section.liquid` L846 defines `t:names.video_section`; FAQ was built as a container around native accordions instead of the stock "FAQ section" preset | L72–78 (generic) | **Missing procedure + insufficient inspection** | A mandatory discovery procedure with concrete greps and a recorded inventory (§8 G4). | **High** |
| R4 | No native + CSS proof of concept | How-to-use rejected because `section` + `text` "can't number steps automatically or give the heading a separate mobile size" (plan L695); R2 class A shows a richtext list + CSS counters and a scoped media query do it | Ladder 3 (L155) | **Missing instruction** (attempt + evidence) | Require a minimal native + CSS spike, or a cited blocker, before step 6/7 (§8 G5). | **High** |
| R5 | Ladder decision unverifiable | Hero: "**Reuse ladder.** Steps 1–6 fail." (transcript `0f56`, 11-08 11:13); collections, long description and bundle contents/value: no decision text before the `Write` | L161, §4 items 3–4, §27 checkboxes | **Weak language** ("explain why") without an evidence format | A fixed Native Decision Record, required before any new section/block file (§7, §8 G6). | **High** |
| R6 | Pixel fidelity outranked reuse | Figma skill (invoked on every section task): "You MUST request a screenshot… the rendered implementation MUST visually match"; skill L77, L415 legitimise custom for "an important design requirement" | L77, L415 + Figma plugin skill | **Conflicting priorities** | Define which requirements may justify custom (function, accessibility, editability, data), and require proof that CSS can't reach a *visual* requirement (§8 G7). | **High** |
| R7 | Prompt overrides | F1 banner prompt names `sections/snosha-f1-banner.liquid` and forbids altering `hero` / `media-with-content`; bundle prompt "Create a dedicated `snosha-bundle` section only when…"; bundle contents/value prompt "creating two dedicated sections is acceptable" | L60 (user request outranks skill) | **Conflicting instruction source** | A pre-named file or pre-approval in a prompt is a *candidate*, not a waiver of the gate (§8 G8). | Medium |
| R8 | Wrapper pattern propagated by precedent | "same pattern as #4" (plan L421), "same pattern as #4 / #8" (plan L571), "as in `snosha-why`" (plan L678) | L117 "Reuse an existing stable scope when available" | **Ambiguous** (a project custom section treated as a reusable "existing" component) | A previous project custom section is never a native alternative. A repeating pattern triggers a native re-check (§8 G9). | Medium |
| R9 | Skill not activated | 0 `Skill` calls for `horizon-figma-to-sections-workflow` in 10 transcripts; loaded via prompt-directed reads only; long-description prompt cites `.claude/skills/figma-to-sections-workflow` (wrong path) | Frontmatter L3; `CLAUDE.md` L9 | **Missing activation rule** | `CLAUDE.md` rule: invoke the skill before any section/block work; the gate output proves activation (§8 S1). | Medium |
| R10 | Speed mode removed the evidence | L145 (pre-implementation report "a few lines"), L37 (no visual comparison); bundle contents/value (11-19, under speed mode): no decision text before `Write` | §0.1 | **Conflicting** (speed vs proof) | Speed mode must never shorten the Native Decision Record (§8 G10). | Medium |
| R11 | Parallel worktrees blocked reuse | Choose Care: "I didn't reuse the shared #4/#5 bar because it's tied to… `dev1`'s files" (transcript `0f56`); collections built in `dev1` while main sessions built others | §0 L30 (current working tree only) | **Process** | Project rule: record cross-branch components in the plan's component registry and reuse them after merge (§9 S3). | Low |
| R12 | Similarity scoring misleads (in the audit too) | Audit R1 put 16 sections in D by default-look similarity; R2 feasibility moved 11 of them to A/B/C (audit §12) | n/a | **Method** | Classify by feasibility classes, not percentages (§7). | Medium |

---

## 5. Section-by-section analysis (all 20)

The skill existed for **all 20** (committed in `46782b0` together with the first section). Columns:

- **Tr** — a local transcript exists.
- **Skill** — what the prompt said about the skill / whether the skill was invoked.
- **Native inspected** — what the agent records having looked at.
- **CSS?** — a native + scoped-CSS route was considered.
- **Ext?** — a minimal native extension was considered.
- **Audit class** — R2 feasibility class (A: native + CSS · B: native + small extension · C: possible, high migration risk · D: native can't preserve essential function). "Migrated" means done on 2026-11-20.

| Section (first commit) | Tr | Skill | Native inspected (recorded reason) | CSS? | Ext? | Genuine blocker | Audit class | Verdict | What would have prevented it |
|---|---|---|---|---|---|---|---|---|---|
| `snosha-hero` (`46782b0`, 11-08) | ✓ | Prompt: "Follow the project workflow skill completely" + ladder; Skill tool not used | `hero`, `media-with-content`: "can't place a product image at a fixed spot… can't pin chips… no rings" | No | Rejected: "Changing the 1,500-line shared `hero` would risk its three presets" | Chips anchored to image coordinates; later per-language slides | D | **Justified** (evidence thin: "Steps 1–6 fail") | Decision Record with per-step evidence; `section` + `group` composition never evaluated |
| `snosha-collections` (`9a1379f`, 11-08, `dev1`) | ✓ | Prompt names native `collection-list` as "the primary candidate" | Native render path fully reused inside a wrapper; wrapper chosen so the native section "needs no new settings (`custom_class`, colors)" | Yes | **Avoided** ("would have meant editing a Horizon core file") | None | B — migrated (`3f9dd62`, opt-in group on `collection-list`) | **Unnecessary** | R1/R2 fixes: opt-in extension allowed and preferred |
| `snosha-f1-banner` (`de61378`, 11-08) | ✓ | Prompt cites the skill but **pre-names `sections/snosha-f1-banner.liquid`** and forbids altering `hero` / `media-with-content` | `media-with-content` / `hero` can't layer the waves (file header; plan log 11-08); no decision text before the `Write` | No | No | Decorative layering is CSS (pseudo-elements / background) | A | **Likely unnecessary** | G5 (CSS spike), G8 (prompt pre-naming doesn't waive the gate), `section` composition in discovery |
| `snosha-before-after` (`f0ea4ca`, 11-08, `dev1`) | — | UNVERIFIED | `media-with-content` (media slot is image/video only); generic `section` "would need a design-specific mode… shared"; `icon` (artwork) — plan L417–420 | Partly | Rejected (shared section) | None | C (91 %) — migrated (`8a55ce8`) | **Unnecessary** | R1 fix; stock "Image compare" preset in the discovery list |
| `snosha-choose-care` (`e5a46c0`, 11-08) | ✓ | Prompt cites the skill + ladder | `product-list` "draws every product with one shared card. It can't give one card the featured layout… without changing the product card used across 6 templates" | No | Rejected (shared card, 6 templates) | Featured-card variant + per-product spec rows: real but extendable | C | **Defensible at the time** | `carousel` → `_card` → `product-card` composition (R2 recipe) should have been in discovery |
| `snosha-bundle` (`5b12375`, 11-09) | ✓ | Prompt: "Follow the project's REUSE FIRST → EXTEND SECOND → CREATE LAST policy" | `product-hotspots`: "one position per hotspot, and on touch it opens quick-add… which your brief rules out" | n/a | No | Hotspots + synced rows + add-to-cart of a different product | D | **Justified** | — |
| `snosha-why` (`f2dbcaa`, 11-09, `dev1`) | — | UNVERIFIED | Generic `section` + `group` "needs a design mode on a shared section for the grid, mobile padding and scope"; image block can't ship SVG defaults; `icon` artwork (plan L570) | Partly | Rejected (shared section) | None | C (88 %) — migrated (`17001c2`) with opt-in `snosha_grid` / mobile padding | **Unnecessary** | R1 fix; stock "Icons with text" preset |
| `snosha-faq` (`cef806f`, 11-09, `dev1`) | — | UNVERIFIED | Native `accordion` + `_accordion-row` reused inside a thin container (plan L606–607) | Yes | No | None | C (91 %) — migrated (`730708e`) | **Unnecessary** | Stock "FAQ section" preset |
| `snosha-reels` (`84b9f21`, 11-09) | ✓ | Prompt: "REUSE FIRST → EXTEND SECOND → CREATE LAST" | Native video / deferred media: "I didn't use the stock `video` snippet because it always mutes the video" | n/a | No | Sound, middle-reel start, mouse drag, per-reel product | C | **Defensible** | — |
| `snosha-product-comparison` (`297f7b9`, 11-12, `dev1`) | — | UNVERIFIED | "no native Horizon section or block renders a comparison table with a raised overlay column" (plan L678) | n/a | No | Semantic `<table>`; row-synchronised columns | D | **Justified** (51 settings → `ExcessiveSettingsCount`) | Settings budget rule |
| `snosha-how-to-use` (`dde42bd`, 11-12, `dev1`) | — | UNVERIFIED | `section` + `group` + `text` "can't number steps automatically or give the heading a separate mobile size", and controls would exceed 40 settings (plan L695) | **No** | No | None: richtext `<ol>` + CSS counters; scoped media query | A | **Unnecessary** | G5 CSS spike; R2 (controls aren't a custom justification) |
| `snosha-storage-care` (`dde42bd`, 11-12, `dev1`) | — | UNVERIFIED | `layered-slideshow` is the only tab UI, not a pill tab bar; `accordion` isn't tabs (plan L710) | n/a | Considered (pattern reused) | Pill tabs vs layered panels | C | **Defensible** | — |
| `snosha-contact` (`afab03c`, 11-15) | — | UNVERIFIED | Native `button` "can't build a link from a phone number…", stacking order, "under 40 settings" (plan L753) | No | No | Weak: a `wa.me/<digits>` URL is an accepted link (audit R2) | B | **Partly unnecessary** | R2, G5 |
| `snosha-reviews-screenshots` (`c78b276`, 11-15) | — | UNVERIFIED | Reuses Horizon `slideshow` snippets inside a custom section (plan L770) | Yes | No | Progress bar + rating pill: opt-in extension of `carousel` | B | **Extension path missed** | R1 fix |
| `snosha-how-to-use-video` (`b530e57`, 11-15) | — | UNVERIFIED | "Horizon 4.4 has no video section… editing that shared block would change every section using it" (plan L800) — **factually wrong** (`section.liquid` L846 "Video section" preset) | No | Rejected (shared block) | Custom/mobile poster, unmuted start: small opt-in on `video` | B | **Unnecessary as a section** | G4 discovery inventory; R1 fix |
| `snosha-long-description` (`07bc0db`, 11-15) | ✓ | Prompt requires a "Native Horizon Reuse Matrix" but cites a **wrong skill path** (`.claude/skills/figma-to-sections-workflow`) | Phase-1 matrix not captured in the transcript's decision text | Partly | No | 7 panels × 3 layouts: editor burden with native blocks | C | **Defensible** | — |
| `snosha-judgeme-reviews` (`dd2c242`, 11-15, `dev1`) | — | UNVERIFIED | Hosts the Judge.me `@app` block + rating summary | n/a | n/a | App integration | C | **Defensible** | — |
| `snosha-collection-header` (`6eca4bb`, 11-16) | — | UNVERIFIED | "Horizon 4.4 has no breadcrumbs or collection header"; no Figma frame, a screenshot was the reference (plan L915) | No | No | Breadcrumbs only (a block, not a section) | B | **Partly unnecessary** | G4: `collection-title` + `text` + `image` + a breadcrumbs *block* |
| `snosha-bundle-contents` (`6186803`, 11-19) | ✓ | Prompt **pre-approves** "creating two dedicated sections"; no skill path given; speed mode active | No decision text before the `Write` | No | No | None | A | **Unnecessary** | G8, G10 |
| `snosha-bundle-value` (`6186803`, 11-19) | ✓ | Same | Price/savings calculation (file header) | No | No | Savings amount: small opt-in on `price` | B | **Mostly unnecessary** | G8, G10 |

**Totals**

| Verdict | Count | Sections |
|---|---|---|
| Justified | 3 | hero, bundle, product comparison |
| Defensible | 5 | choose care, reels, storage care, long description, Judge.me (app host) |
| Unnecessary or partly unnecessary | 12 | collections, F1 banner, before/after, why, FAQ, how to use, contact, reviews screenshots, how-to-use video, collection header, bundle contents, bundle value |

Total: 20. Of the 12 unnecessary or partly unnecessary sections, 4 have already been migrated (collections, before/after, why, FAQ).

---

## 6. Missing or weak instructions (quoted)

**Weak:** "explain" with no evidence, no format and no reviewer.

- L161: "Before creating **any** new file, explain why earlier options cannot meet the design safely."
- L77: "Prefer existing **Horizon section + theme blocks + settings** where they can reproduce Figma faithfully."
- L78: "Inspect relevant Horizon components… as needed."
- §27 L444–445: checkboxes the agent ticks for itself.

**Conflicting**

- L165 (mandatory `custom_class`, "including native Horizon sections being modified") together with L246 ("explicit approval if the edit has cross-page impact") and `CLAUDE.md` L89 ("Don't edit Horizon core files… when an override in the project files can do the job").
  - The cheapest compliant path is a **new project file**.
- L77 / L161 / L415 (don't sacrifice design; prefer isolated new implementation) together with L159 / L414 (create only as last resort).
  - Both directions are "prohibited failure modes", and nothing decides between them.
- L60: a user prompt outranks the skill.
- L145 (speed mode: report "a few lines") against §4 L131–143 (11-item report).

**Missing**

- A concrete discovery procedure: which files to grep and which stock presets to list.
- A proof-of-concept step for native + scoped CSS.
- A permitted, documented recipe for opt-in extension of a shared native section, with consumer enumeration as a mechanical step rather than a deterrent.
- A Native Decision Record as a required, checkable artifact.
- A rule that a missing *control* is an extension gap, not a reason to build custom.
- A rule that previous project custom sections are not native alternatives.
- A skill-activation rule.
- Re-entry: when a pattern repeats, re-check native.

**Present but ignored** (per the evidence)

- §2.1 L72–78 discovery: stock presets not inspected; "no video section" is factually wrong.
- Ladder step 3 (L155, scoped CSS): never attempted for how-to-use, F1 banner or contact.
- L414 ("Creating new blocks/sections before checking native Horizon sections, theme blocks, nested groups and settings"): partly violated where only some alternatives were checked.

---

## 7. Mandatory Native-First Decision Gate

**When it runs:** before any `Write` of a new `sections/*.liquid` or `blocks/*.liquid` file. This includes thin wrappers, and it applies even when a prompt names the file. Speed mode does not shorten it.

**Output:** a **Native Decision Record (NDR)**, posted in the answer and stored as a short entry in the project plan.

### 7.1 Discovery (evidence required)

1. List every stock section and its presets:
   - `grep -n '"name": "t:names' sections/section.liquid`, plus the same for the closest family (e.g. `carousel`, `product-list`, `collection-list`, `media-with-content`, `hero`, `featured-*`, `layered-slideshow`, `product-hotspots`).
   - Record the **2–3 closest candidates**, with file paths and preset names.
2. List the block types each candidate accepts (`"blocks"` in the schema; `@theme`, `@app`, static blocks).
3. For each candidate, map the Figma requirements to the supported features, under three headings:
   - **Layout/visual**;
   - **Content/editability**;
   - **Function/semantics/accessibility/data**.

### 7.2 Feasibility test, in order

For each candidate:

- **A. Reuse as is.** Do settings and presets alone reproduce it?
- **B. Native + scoped CSS.** Do `custom_class` (or the section-ID scope) plus `main.css` close the visual gaps?
  - Required evidence: the CSS mechanism for every visual gap, or a minimal spike. For example: counters on a richtext `ol`; a scoped media query for mobile sizes; pseudo-elements for decorative layers.
- **C. Minimal additive extension.** Can opt-in, default-off settings on the native section or block close the configuration or function gaps?
  - Required evidence:
    - the consumer list (`grep` in `templates/*.json` and `sections/*-group.json`);
    - "blank/off = byte-identical output" for every consumer;
    - an estimate of the extension size.

### 7.3 Decision categories

- **REUSE NATIVE AS IS**
- **REUSE NATIVE + SCOPED CSS**
- **EXTEND NATIVE MINIMALLY**
- **CUSTOM REQUIRED — VERIFIED TECHNICAL REASON**

A **verified technical reason** is one of:

1. A function native can't provide and the extension can't add without rebuilding the component.
2. Semantics or accessibility that native markup can't express (e.g. `<table>`).
3. A data or app contract (e.g. app-driven inputs).
4. Editability that native blocks can't offer, even with an extension.
5. A setting budget or platform limit that only splitting can solve.

Each needs a cited file/line or a failing spike.

**Not valid reasons:**

- the default look differs from Figma;
- native lacks a section-level color, `custom_class` or column-count setting (that's an extension);
- it would be faster;
- an earlier project section uses this pattern;
- the prompt names a file.

Also: don't force native when B or C would mean rebuilding the whole component inside a generic wrapper. Record that as reason 1 or 4.

### 7.4 Similarity percentages

They are optional context only. The decision is driven by feasibility. A 70 % default match can be **REUSE + CSS**; a 95 % match can be **CUSTOM** if a function is lost.

### 7.5 NDR template

```text
NDR — <section name> (<template>, Figma <desktop>/<mobile>)
Candidates: 1) sections/<x>.liquid preset "<p>"  2) …  3) …
Supported: <requirements covered natively>
Gaps: visual: … | config: … | function/semantics/data: …
B (CSS): <mechanism per visual gap | spike result>
C (extension): <settings> | consumers: <list> | blank/off identical: yes/no
Decision: <one of the four> — reason: <verified reason + file:line or failing spike>
Rejected because (if custom): <per candidate, one line each>
```

---

## 8. Proposed skill improvements

### 8.1 Core skill improvements (reusable for any Horizon 4.4 project)

| ID | Existing instruction | Why it failed | Proposed replacement / addition | Where | Evidence the agent must produce | How to test |
|---|---|---|---|---|---|---|
| G1 | L191 "Before extending a shared component, enumerate its existing consumers and prove new default behavior is inert" | Read as a deterrent | "**Opt-in extension of a native section or block is the preferred step 5 and needs no extra approval** when every new setting defaults to blank/off and blank/off output is identical for every consumer. Enumerate consumers with `grep` in `templates/*.json` and `sections/*-group.json`; list them in the NDR." | §5 after L157; §7 L191 | Consumer list + identical-output statement | Gate review: an NDR choosing custom while C was never assessed fails |
| G2 | L246 "explicit approval if the edit has cross-page impact"; `CLAUDE.md` L89 | Applied to native *sections*, which aren't core assets | "Native **section/block** files may receive additive opt-in settings (G1). L246 applies to global assets (`base.css`, core JS, token snippets) and to any change that alters default output." | §9 L246 | — | Wording review |
| G3 | L165 (`custom_class` on native sections being modified); L207–214 (section color settings); L271 (item counts) | Turned mandatory controls into reasons for custom | "Control requirements are met in this order: native block settings → opt-in setting on the native section (G1) → custom. **A missing control is never a CUSTOM reason.** Section-level color settings are needed only where native block colors can't express the design." | §6, §8A, §12 | NDR "config gaps" closed by settings/extension | Grep NDRs for 'custom_class' / 'colors' as a custom reason |
| G4 | L72–78 discovery | Generic; stock presets missed; factual errors | Add the §7.1 procedure: mandatory greps of stock sections **and their presets**; record the 2–3 closest candidates with file paths. "Claims that Horizon lacks a component must cite the grep that shows its absence." | §2.1 new item | Candidate list + grep output summary | A claim like "no video section" without a grep citation fails |
| G5 | Ladder step 3 (L155) | Never attempted | "Before rejecting B, give the CSS mechanism for every visual gap, or run a minimal spike on a scratch instance. Speed mode allows this one targeted check." | §5 step 3; §0.1 | Mechanism per gap | NDR without a B line fails |
| G6 | L161 "explain why earlier options cannot meet the design" | One-line assertions | "Before any new section/block file, produce the **Native Decision Record** (template §7.5). Without an NDR, creating the file is a prohibited failure mode." | §5 end; §25 new bullet; §27 checklist | NDR | Diff review: a new file without a plan NDR entry |
| G7 | L77 / L415 (don't sacrifice design) | Pixel fidelity outranked reuse | "Only function, semantics/accessibility, data/app contracts, editability or platform limits justify CUSTOM. A *visual* requirement justifies custom only if B was attempted and the NDR records why CSS can't reach it." | §2.1 L77; §25 L415 | B attempt | NDR review |
| G8 | L60 (user request outranks skill) | Prompts that named files bypassed the ladder | "A prompt naming a new file or pre-approving custom code is a candidate, not a waiver: run the gate; if the result is native, report it and ask before creating the file." | §1 after L60 | NDR with the prompt's candidate | Prompt with a pre-named file → NDR still present |
| G9 | L117 "Reuse an existing stable scope when available" | Project wrappers reused as precedent | "A previous project custom section is not a native alternative. When a new section would follow an existing project custom pattern, re-run discovery against stock Horizon first." | §2.6 | Discovery list excludes `snosha-*` as "native" | NDR review |
| G10 | L145 (speed mode: report "a few lines") | Removed decision evidence | "Speed mode shortens reports, **never the NDR**." | §0.1 | NDR | Speed-mode task with a new file → NDR present |
| G11 | §27 checkboxes | Self-attested | Replace the "Before edits" reuse boxes with "NDR posted (link/line)". | §27 | — | — |
| G12 | (none) | Similarity scores misled (audit R1) | "Classify by feasibility (A/B/C/D or the four decision categories); similarity percentages are informational only." | §5 | — | — |

### 8.2 SNOSHA-specific project rules (`CLAUDE.md` / project plan, not the reusable skill)

| ID | Rule | Where |
|---|---|---|
| S1 | "Invoke the `horizon-figma-to-sections-workflow` skill (Skill tool) before any Figma-to-section, section-bugfix or block task; every such answer starts with the NDR or states that no new file is created." | `CLAUDE.md` (replace L9 wording) |
| S2 | List the approved native extensions as reusable precedents: `section.liquid` `custom_class` / `snosha_grid` / `snosha_mobile_padding`; `collection-list` `snosha_style`; `comparison-slider` `snosha_grip_color` / `snosha_shadow_color`; `snosha-icon` `tile_shadow_color`; the `product-list` opt-in pattern. | `CLAUDE.md` "Project CSS and JS files" |
| S3 | A component registry in the plan (custom sections, approved extensions, branch), so parallel worktrees reuse each other's work after merge. | `SNOSHA_PROJECT_PLAN.md` |
| S4 | RTL/LTR: test both `dir` values; Arabic primary at `/`, English at `/en`. | `CLAUDE.md` (exists) |
| S5 | CSS governance: `main.css` scope by `custom_class` (native) or `.snosha-*` (custom); change the example from `.snosha-hero` to a native `custom_class` scope, so the convention doesn't imply a custom section. | `CLAUDE.md` L74 |
| S6 | Native migrations: preserve section/block IDs and Translate & Adapt keys/digests; dry-run translation registration. | `CLAUDE.md` / migration plan |
| S7 | Git/deployment: `main` deploys to live; dev theme `168066810072` for validation. | `CLAUDE.md` (exists) |
| S8 | Figma file `1fqyznLFgS65tTjGvBYPBm` and frame map. | Plan (exists) |
| S9 | Prompts must use the exact skill path; the plan template (§D) cites the NDR. | Plan §D |

---

## 9. Compliance checklist (evidence, not ticks)

Each item must be answered with the evidence shown. "Yes" alone doesn't count.

| # | Check | Required evidence |
|---|---|---|
| 1 | Figma inspected | Desktop + mobile node IDs; the `get_design_context` calls made |
| 2 | Skill active | Skill invoked (tool call) or its §-numbers quoted in the NDR |
| 3 | Native alternatives inspected | Grep command(s) + the 2–3 candidate files/presets |
| 4 | Closest native candidate | Named, with supported / gap lists |
| 5 | Native + CSS feasibility | CSS mechanism per visual gap, or spike result |
| 6 | Minimal extension feasibility | Settings list, consumer list, "blank/off identical" |
| 7 | Decision | One of the four categories + verified reason with file:line or failing spike |
| 8 | No unnecessary file | New files listed; each tied to an NDR |
| 9 | Theme Editor preserved | Settings / blocks the merchant can edit; IDs and translation keys unchanged (for migrations) |
| 10 | Responsive | Widths checked (or "Not visually verified" in speed mode) |
| 11 | RTL/LTR | `dir=rtl` and `dir=ltr` checked (or "Not visually verified") |

---

## 10. Prompt and skill conflicts (confirmed)

| Conflict | Evidence | Effect |
|---|---|---|
| User prompt outranks the skill | SKILL L60; F1 banner prompt pre-names the custom file; bundle contents/value prompt pre-approves custom | The ladder was bypassed legitimately under the skill's own priority order |
| Skill referenced, not invoked | 0 Skill-tool calls for the workflow skill in 10 transcripts; prompts said "read `.claude/skills/…/SKILL.md`"; one prompt gave a wrong path | Activation depended on prompt wording |
| Figma skill vs Horizon skill | Figma skill "MUST visually match"; Horizon skill L77/L415 | Fidelity pressure without a CSS-first proof step |
| `CLAUDE.md` vs skill on core edits | `CLAUDE.md` L89 vs SKILL L157 / L191 | Read as "avoid editing native files" |
| Naming implies custom | `CLAUDE.md` L74 example scope `.snosha-hero`; plan §D L168 "Prefix for new project-specific components" | The convention assumes a custom section per design section |
| Plan encourages custom? | Plan §D L148–164 is native-first. **No conflict found.** The status `SPEC_READY` (L178) implies a review step that tasks skipped ("implement immediately"). | Missing approval gate, not a conflict |

**Not attributable to the skill:** factual discovery errors ("no video section") and one-line ladder decisions. The rules existed (L72–78, L161); they were followed too thinly. These are execution failures, made easy by the missing evidence format.

---

## 11. Successful native migrations: what made the difference

| Factor (migrations 2026-11-20) | Evidence | In the original skill? |
|---|---|---|
| Audit first, with feasibility classes A/B/C/D | Audit §12 (R2) | Missing |
| Stock presets used as recipes ("Icons with text", "FAQ section", "Image compare") | Audit §4.1; migration plan M1/M2/M4 | Missing from discovery |
| An approved plan item for a shared-section extension (P: `custom_class` on `section.liquid`, consumer list, "blank means identical output") | Migration plan L95–100 | Only as a deterrent (L191) |
| Following an existing opt-in precedent (`product-list.liquid` pattern) | Migration plan L244–250 | Missing |
| Generic responsive settings added only when needed (`snosha_grid`, `snosha_mobile_padding`) | `sections/section.liquid` L11–16 | Missing |
| Preserving block IDs and Translate & Adapt keys/digests | Migration plan L71–73, L116, L139, L186, L241, L302 | Missing |
| Original-versus-native baseline comparison on the dev theme (explicitly requested Visual QA) | Migration plan per step; session evidence | Disabled by speed mode unless requested |
| Theme Editor flexibility restored after the first attempt (column / mobile padding controls) | Migration plan M1 notes | Partly (§8) |

---

## 12. Remaining uncertainties

- **11 sections without transcripts** (before/after, why, FAQ, product comparison, how to use, storage care, contact, reviews screenshots, how-to-use video, Judge.me, collection header). Whether the skill was read or invoked, and whether alternatives were inspected *before* building, is **UNVERIFIED**. The rationale available is the plan entry written after implementation.
- **Long Description:** the Phase-1 "Native Horizon Reuse Matrix" output wasn't found in the transcript's decision text. Its content is UNVERIFIED.
- **Collections:** the transcript records the reason at report time, which is after the `Write`.
- **Who wrote the task prompts** (the user or another tool) isn't recorded. Prompt content is treated as user instruction.
- **The R2 classes are feasibility estimates.** Only the 4 migrated sections are proven native-feasible. The A/B verdicts for the rest are UNVERIFIED until migrated or spiked.
- **Model and harness behaviour across sessions** (e.g. whether skills were auto-suggested) isn't recorded in the transcripts.

---

## 13. Answers (ranked by impact)

1. **Poorly specified, or not followed?** Mainly **poorly specified for enforcement**. The order was stated, but extending native carried the heavier burden of proof, mandatory controls disqualified native sections, and nothing required proof of the decision. Execution failures (missed presets, one factual error, one-line decisions) were secondary and enabled by those gaps.
2. **Missing instructions:**
   - a discovery procedure with stock presets;
   - a native + CSS proof-of-concept step;
   - a permitted opt-in extension recipe;
   - the Native Decision Record;
   - "a missing control isn't a custom reason";
   - "project custom sections aren't native alternatives";
   - a skill-activation rule;
   - "speed mode never shortens the decision record".
3. **Too weak:** L161 ("explain why…"), L77/L78 ("prefer…", "as needed"), the §27 self-ticked checkboxes, L414 (prohibition without a check).
4. **Present but ignored:**
   - §2.1 discovery (stock presets; "no video section");
   - ladder step 3 (scoped CSS never tried for how-to-use, F1 banner, contact);
   - L414, partly.
5. **Why custom instead of extending Horizon:** extending a shared native section looked like a risky core edit that needed consumer proofs and approval (L191, L246, `CLAUDE.md` L89). The skill also demanded controls native sections lack (L165, L207–214). A new file needed only one sentence (L161). Once the "thin wrapper" existed, it became the precedent (plan L421, L571).
6. **Minimum changes:**
   - G1 + G2 (opt-in extension allowed and preferred, with a mechanical consumer check);
   - G3 (controls are never a custom reason);
   - G6 (NDR required before any new section/block file);
   - S1 (invoke the skill).
7. **Into the reusable skill:** G1–G12 (§8.1).
8. **SNOSHA-only:** S1–S9 (§8.2) — the skill-invocation rule wording, the approved-extension list, the component registry, RTL/LTR specifics, the `main.css` / `custom_class` convention, translation-key preservation, Git/deploy rules and the Figma file map.
