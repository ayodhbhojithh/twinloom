# PlaniSphere (Omadeas ProjectOps) — Design Specification & Requirements
## Handover brief for Claude Design

**Version 1.0 · July 2026 · TwinCoreTech / Omadeas**
**Audience:** Claude Design (visual design + prototyping). Functional truth lives in the spec pack (`specs/spec-00…14`) and the working build (`ProjectOpsPortal v0.2.jsx`, 80 automated behavioural checks green). This brief tells you what to design, what to never change, and what to hand back.

---

## 1 · What we are asking for

Design the visual layer of PlaniSphere — the Omadeas planning module — on top of a working, behaviour-complete build. Specifically:

1. **A refined visual direction** grown from our minimal base (§4) — elevate it without breaking its rules. We do not want decoration; we want clarity with confidence. Two or three directions to compare are welcome.
2. **High-fidelity screen designs** for the 16 screens (§6) at 1440×900, states included.
3. **The ＋ New Plan journey as a designed flow** (§7) — this is the product's heart; it gets the most care.
4. **The two visualization features** (§8): the Plan Wheel (sunburst of a live plan, lens-switched) and Planning Avenues (module wheel as an entry hub). Interactive prototypes preferred.
5. **A component sheet** covering every component in §4.3 with hover/focus/disabled/selected/error states.
6. **Handoff package** back to Claude Code / our developers: tokens as variables, component specs, and per-screen redlines. Our developers will apply designs to the existing JSX — design must map onto the existing component inventory, not invent a parallel one.

**Import first:** ingest `design-language-v1.html` (our design system baseline) and the `planisphere-screens.zip` PNGs (current state of every screen) before generating anything.

---

## 2 · Product context

**Omadeas** is TwinCoreTech's business operating platform — modules (ProjectOps, BeanCounter, SalesOps, Workforce, Academy, Freeflow, Pulse, ModelStudio, Organisation) on one shared foundation (data model, classifiers, AI/LLM "Oma", KPI framework, live reporting, audit, security).

**PlaniSphere** is the ProjectOps module's portal: enterprise planning where **everything is a node** on one tree — from Vision down to Task — with explicit relationships, configurable lifecycles, and a deterministic validation engine. Its differentiating beliefs:

- *The user thinks, the system plans, humans govern.* An engine proposes structurally valid plans; a human gate approves; nobody hand-builds what the engine can propose.
- *One journey, one gate.* Every way of creating a plan (template, AI write-up, file import, in-app) converges on the same visible validation run before anything persists.
- *Determinism over vibes.* The AI (Oma) drafts and proposes; a rule engine alone decides validity, scores and persistence — and the user watches it run, check by check.

**Users:** programme/delivery managers (daily planning), PMO/governance leads (health, coverage, risk), executives (portfolio reading), and engineers/consultants receiving build packs. Data scale is real: our own programme plan is 6,643 nodes, 19 programmes.

---

## 3 · Design principles (these rank above aesthetics)

1. **One hero per screen, maximum.** A screen may have one focal element (the engine run terminal, the Grow skyline, the wheel). Everything else recedes.
2. **Colour is meaning.** Status colours (green/amber/red/blue) are semantic only. Anchor-type colours identify node types. The single accent marks interactivity. If a colour is none of those three things, it does not appear.
3. **Hierarchy from type and space, not chrome.** No gradients-as-decoration, no shadow stacks, no glassmorphism. (We tried; it read as "mashing things together." The minimal base was the correction — respect it.)
4. **Motion is information.** The only sanctioned animation is the engine run's sequential check reveal (it communicates execution order) and functional feedback (hover/focus). Respect `prefers-reduced-motion`.
5. **Data-dense, never cramped.** Users read 40+ row tables and 6,000-node wheels. Design for scanning: strong labels, tabular figures, generous rhythm.
6. **Honest states.** Empty, loading, blocked and error states are first-class designs, not afterthoughts. A blocked import shows a red atomic verdict with a per-row findings table — that moment must feel authoritative, not apologetic.

---

## 4 · The design system baseline (import `design-language-v1.html`)

### 4.1 Tokens
- **Palette:** ink `#111827` (text, primary buttons, active), soft `#6B7280`, line `#E5E7EB` (all borders, 1px), canvas `#FAFAFA`, surface `#FFFFFF`, accent `#2563EB` (interactive only). Status: green `#059669`, amber `#D97706`, red `#DC2626`, active-blue `#2563EB`, neutral `#9CA3AF`/`#D1D5DB`. You may evolve values; you may not add a second decorative accent.
- **Anchor colours** (identity, used as coloured text/marks): Vision `#7C3AED`, Strategic Initiative `#6D28D9`, Programme `#6366F1`, Project `#2563EB`, Deliverable `#059669`, Work Item `#D97706`, Task `#64748B`, Control `#DC2626`, Quality `#DB2777`, Brain `#0EA5E9`, Objective `#0D9488`.
- **Type scale:** screen title 18/700, card title 13/700, section 11.5/700, body 10.5, meta 10 soft, label 9/700/caps/+0.5ls, data in mono with tabular figures. You may re-tune sizes ±; keep the seven-step hierarchy.
- **Geometry:** radius 8, card padding 16, card gap 14, page padding 20. Flat surfaces; hairline dividers.

### 4.2 Component inventory (design every state)
Buttons (primary-ink · ghost · dashed), chips (status pastel pairs, identity, count-filter chips that toggle), underline tabs, KPI tile, progress bar, tables (white header, caps labels, hover row), filter dropdown (multi-select), search input, section card, screen header (title + descriptor chip + subtitle + actions), step-chip progress rail, code/md viewer (light, line numbers), terminal-style engine run list, tree rows (indent + caret + chips), kanban card, gantt bar, detail side panel, dialog, empty states, toasts.

### 4.3 Special semantics to preserve
- **"You edit this" vs "read-only"** — starter templates are editable (green chip), examples are read-only (indigo chip, tinted rows). This teaching distinction is a design requirement.
- **Hatched fill + dashed ghost outline** = "not yet expanded / awaiting a depth pass" — a load-bearing pattern across Grow and the wheels.
- **Locked "(inherited)" chips** — inherited set-up renders locked, never as disabled inputs.

---

## 5 · Information architecture

Nav (icon rail + sidebar, two-level): **Guide** › Module Guide · **Planning** › ＋ New Plan, Dashboard, All Plans, Plan Templates · **Execution** › Plan Tree · **Library** › Python Scripts, Engine Checks, Journeys, Lifecycle Profiles, Planning Skillsets, Classifiers · **Module Definition** › Entity Spine · **Governance** › Anchor & Model Registry. ("Plan Builder" is retired — never reintroduce it.) Breadcrumb topbar: `Omadeas › ProjectOps › {screen}`.

---

## 6 · Screen-by-screen requirements
*(Reference PNGs in `planisphere-screens.zip`; functional detail in the matching spec file.)*

| Screen | PNG | Design focus |
|---|---|---|
| Module Guide | screen-01 | Orientation: principle banner, capability roadmap with status chips, journey launch rows. Calm, editorial. |
| Dashboard | screen-02/03 | Portfolio truth: 6 KPIs, delivery donut, risk bars, clickable milestone timeline; Strategy tab. Every figure clicks through — affordance must read. |
| All Plans | screen-04/05 | **Roots are the list.** View filter (All roots / Delivery·L2 / Strategy·L1 with live counts); plan cards with anchor identity + derived stats; nested-L2 cards (dashed) with "↳ under {root}" breadcrumbs; list mode; selection side panel. |
| Plan Templates | screen-06 | Split view: template list (uses count, rating) + sticky preview: journey shape chips, context-fit switcher, read-only skeleton, company-usage panel (uses · rank · rating), journey-typed build pack, single CTA into the journey. |
| Plan Tree | screen-07 | The workspace: header stats strip, five view tabs (Hierarchy/Board/Table/Gantt/Grow), detail side panel with lifecycle status buttons, Save-snapshot dirty state. Densest screen — earns the most typographic care. |
| Grow view | screen-08 | The breadth×depth loop. Hero: the skyline (solid ink towers = expanded, hatched stubs = awaiting depth). Strength + coverage bars; feature rows with skillset cascade source; requirement rows with ●◐○ states and "propose deliverable"; orphan-work inverse check. |
| Python Scripts | screen-09 | Split: 7 script cards with "used in" lines → source viewer panel (light, line numbers). Placeholder until selection. |
| Engine Checks | screen-10 | The 24 checks in run order, script chips deep-linking to sources; "three homes" panel; atomicity card. |
| Journeys | screen-11 | 14 journey cards: anchor-chain shape chips, entry, linked templates. |
| Lifecycle Profiles | screen-12 | Profiles A–L as status-chain cards with used-by anchor chips. |
| Planning Skillsets | screen-13 | Registry list → md file viewer panel (each skillset IS an md file); cascade explainer. |
| Classifiers | screen-14 | M15 groups with mode/source chips and value chips; the REQUIREMENT load-bearing note. |
| Entity Spine | screen-15 | The five-entity spine with ↓ connectors; relation-type seed rows; Phase-1 API card. A diagrammatic screen — a place to be quietly beautiful. |
| Anchor & Model Registry | screen-16 | Tabbed registry. Anchors⇄lifecycles two-way linking: row unfolds status chain in-line; profile chips jump across; used-by chips jump back. |

---

## 7 · The ＋ New Plan journey (the flow that must sing)
*(PNGs journey-01…13; full functional spec = `spec-01-new-plan-journey.md` — nothing there may be altered by design.)*

Steps and their designed moments:

1. **Root** (journey-01) — "a plan is a root node (L2+) and its lineage." Two mode cards (new root / graft into existing); anchor picker with L3+ visibly struck out (the rule made visible); link-lineage box with relation select + inherit checkbox.
2. **Set up** (journey-02) — context buttons, base-team chips, classifier-group checkboxes; right panel teaches *starter template (you edit this)* vs *examples (read-only, tabbed)*. Inherited mode renders everything as locked chips.
3. **Three doors** (journey-03) — the biggest decision: Browse templates / Start from a write-up (Oma) / I know what I want. Give this step presence without theatrics.
4. **Template & fit** (journey-04) — library list + preview; **fit a sample context** switcher re-renders the skeleton; bound-context guard captions.
5. **Oma** (journey-05) — write-up textarea → derived context + signal chips → three option cards (Best fit N% / Recommend custom / Build base plan with three depth radios). AI proposes; the copy must keep saying the engine decides.
6. **Build method** (journey-06) — in-app / build pack / import.
7. **Build pack** (journey-07) — journey-type selector reshapes five named artefacts; "Download all"; the journey deliberately ends here.
8. **Import** (journey-08) — quiet step; the drama comes next.
9–10. **Engine run** (journey-09/10) — THE hero moment of the product. 24 checks reveal sequentially, grouped under `planpack/parse.py · validate.py · health.py` header bands with one-line explanations; progress `n/24`; on completion the screen **holds** — "all checks passed — the screen holds; move on when ready" — advancing only on click. Design this like a launch sequence: precise, calm, trustworthy.
11. **Review + health** (journey-11) — node preview with classifier/skillset chips; health panel (alignment %, CPM FIT/NOT-FIT with named gaps, spec coverage %, root set-up summary); the honest "NOT FIT **by design** at this depth" note for shallow Oma plans.
12. **Created** (journey-12) — lands in the Plan Tree, focused.
13. **Blocked** (journey-13) — the atomic verdict: red banner "✕ BLOCKED — n hard error(s) · atomic, nothing loads" + per-row findings table + "Fix & retry". Authoritative, specific, never scolding.

**Journey-wide requirements:** step-chip rail shows only the path taken; back-navigation is always per-path; every primary button is the single ink button on screen; disabled states must clearly explain themselves via adjacent captions (already written — reuse the copy verbatim).

---

## 8 · The visualization features

### 8.1 Plan Wheel (`Plan-Wheel-Concept v0.2.html`, `Plan-Wheel-REAL v0.3.html`)
Sunburst of a live plan: centre = current root (metric + breadcrumb), rings = generations, wedge angle = subtree share. Interaction grammar (from our KPI Wheel, keep exactly): filter chips with live counts that **dim, never remove**; click = inspect; double-click = re-root; hub click = zoom out; thin tails aggregate into hatched "+n" wedges.
**Lenses** (design the switcher + legends): Structure (programme hues, thin green done-band), Activity (planned fades to tint; done/active saturated), Progress (blunt status truth), and from v0.2: Health (amber = named gaps), Coverage (chords from work to REQUIREMENT wedges; red-dashed = orphan work), Critical path. Milestone diamonds stud the rim. Must hold up at 6,643 nodes (test data provided).

### 8.2 Planning Avenues (`Planning-Avenues-Concept v0.1.html`)
The Omadeas module wheel as a planning hub: 9 module segments (brand colours allowed here — it is the one screen where module identity is the point), foundations ring, centre core. Selecting an avenue opens its panel (contexts, flagship shapes, templates, skillset packs, foundations used) with one CTA that enters the ＋ New Plan journey with context pre-bound.

---

## 9 · Hard constraints — design may not change these

1. **Flows and step order** of the journey (spec-01). No steps added, merged, or auto-advanced — especially the engine run's hold-for-click.
2. **Terminology** (glossary §11) verbatim: users rejected "Plan exchange", "Existing plan (12 nodes)" style labels after painful iteration. Do not invent synonyms.
3. **Semantics of colour** (§3.2) including hatched = unexpanded, chips' status pairs, anchor colours.
4. **The engine's visibility.** Never compress the 24 checks into a spinner or a percent bar. The check-by-check reveal is the trust mechanism.
5. **One primary action per view**; the primary is ink (or your evolved equivalent), never the accent.
6. **Accessibility:** CVD-safe status pairs (current pastels validated), contrast ≥ 4.5:1 body text, visible focus rings, reduced-motion compliance, no colour-alone encodings (status chips always carry text).
7. **Real data shapes:** design tables for 40+ rows, trees for 6,000+ nodes, names up to 90 chars. No lorem ipsum — sample content is in the PNGs and JSONs provided.

---

## 10 · Assets provided (all in `Omadeas Front End/ProjectOps Portal/`)

| Asset | Use |
|---|---|
| `design-language-v1.html` | The system baseline — ingest as design system |
| `screens/planisphere-screens.zip` | 29 PNGs: all 16 screens + 13 journey steps, current state |
| `ProjectOpsPortal v0.2.jsx` | The working build (component inventory ground truth) |
| `specs/spec-00…14 + README` | Functional specifications per screen |
| `concepts/Planning-Avenues-Concept v0.1.html` | Avenues hub concept, interactive |
| `concepts/Plan-Wheel-Concept v0.1/0.2.html` | Wheel concept + lens grammar, interactive |
| `concepts/Plan-Wheel-REAL v0.3.html` | Wheel with the real 6,643-node programme plan embedded |
| `…/ProjectOps Import Function/samples/sample-plan.md` | Canonical sample plan (the oracle fixture) |

---

## 11 · Glossary (use these words, exactly)

**Anchor** — a node type on the tree (Vision, Strategic Initiative, Programme, Project, Deliverable, Work Item, Task, Milestone, Control Item, Quality Item, Brain, Objective), levelled L1–L6. **Root / lineage** — a plan is a root node (L2 or higher) plus its subtree. **Graft** — creating work inside an existing lineage (inherits its set-up). **Planning context** — the domain binding on a root (Software Development, Construction, Product Development, Custom) that drives rules, templates and skillsets. **Journey** — a shape through the anchor layer (14 registered). **Template** — a journey with defaults attached (12). **Starter template** — the editable scaffold a user fills; **examples** are read-only references (platform → tenant → derived tiers). **Skillset** — a reusable expansion recipe (PS-001…) stored as an md file; expands one feature per **depth pass**. **Breadth × depth** — lay all features out first (breadth), expand each via its skillset progressively (depth). **Requirement** — a Deliverable classified REQUIREMENT; work **satisfies** requirements; coverage = breadth % / depth %; **orphan work** = work tracing to no requirement. **Engine run** — the visible 24-check deterministic validation (parse.py → validate.py → health.py); **atomic** — one hard error and nothing loads. **Health** — context alignment % + CPM fitness + specification coverage; informs, never blocks. **Oma** — the Omadeas internal LLM; proposes, never decides. **Save snapshot** — full-replace persistence of the working tree.

---

## 12 · Deliverables & acceptance

1. Visual direction boards (2–3), applied to: All Plans, the three-doors step, the engine run, Grow.
2. Full screen set (16) + journey flow (13 states) at 1440×900, light theme (dark optional).
3. Interactive prototypes: New Plan journey happy path + blocked path; Plan Wheel with lens switching.
4. Component sheet with all states; tokens exported as variables.
5. Handoff package for Claude Code: per-screen redlines mapped to the existing JSX component names (§4.2), so implementation is a re-skin, not a rebuild.

**A design is acceptable when:** every §9 constraint holds; a delivery manager can find "their project" from All Plans in ≤2 interactions; the engine run reads as trustworthy without reading the docs; the wheel remains legible with the real 6,643-node plan; and nothing in the journey copy changed.

---

*Prepared from the working build and session history, July 2026. Functional questions resolve to the spec pack; design questions to this brief. The deterministic engine, journeys and registries are unaffected by styling — extend surfaces, never the gate.*
