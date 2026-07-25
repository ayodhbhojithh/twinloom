# TwinCoreTech — Scope Specification (v1.1)

Working baseline. Mono, no styling. Covers every artefact in the list, with the deepest detail on Scoping and the Thoughts & inspiration panel.

Companion files:
- `TCT_Artefact_List.md` — the page/component inventory
- `TCT_Example_Website_Plan.md` — a worked example of the generated plan

---

## 0. The core principle (read first)

**Ask only what is genuinely the client's intent. Derive everything we can work out ourselves.**

A visitor should never be asked something an expert would simply know from their other answers. This keeps the journey short and makes us look competent.

| We ASK (client intent — we can't know it) | We DERIVE (we work it out) |
|---|---|
| Build type: new / redesign / upgrade | Number of pages |
| Business stage & industry | Site size band |
| Their one main goal | The specific page list (sitemap) |
| What they already have (assets/gaps) | Package tier |
| What the site must DO (types/outcomes) | Price band |
| Selling detail (only if selling) | Technical components / stack |
| Which growth services they want | Deliverable level per component |
| Look & feel direction + colours/refs | Timeline estimate |
| How soon; who provides content; budget comfort | Readiness score |
| Effort/ambition per component (slider) | Care-plan recommendation |

The derived items are all shown in the **Blueprint** for the client to confirm or nudge — they are proposed, not demanded.

---

## 1. Home

Job: reassure in seconds, make the journey the hero, keep "Book a call / Message us" always visible.

Blocks: Hero (promise + primary CTA + secondary) · What we can do (outcome menu) · How we work (Discover/Design/Build/Launch/Care) · Who's behind it (+ link to Partners) · **Proof strip (ADD: logos, one result stat, a testimonial)** · Final CTA.

Gap to fill: no social proof today. For an SME agency this is the highest-impact addition.

---

## 2. Scoping (the deep one)

Eight sections, one at a time. Multi-ring effort dial on top; the reacting focus panel on the right. Dial colour = **effort per component (0–10, adjustable, derived default)**; grey = incomplete. Options render on one line (label — explanation).

### Section 1 — About you & your goal
Purpose: quick context so everything after is tailored; the one goal that matters.

- **What are we building?** (single) — Brand new · Redesign · Upgrade
  - Redesign expands on the right: drivers (looks dated / poor on mobile / too slow / not ranking / too few sales / hard to update) + area effort sliders (look, performance, SEO, conversion, mobile).
- **Where's your business right now?** (single) — Just starting up · Established · Growing rapidly
- **What kind of business are you in?** (single) — industry tiles (trades, professional, health, hospitality, retail, property, creative, education, other). *Cannot be derived; tailors copy & imagery.*
- **Your one main goal** (single) — More enquiries · Sell online · Look credible · Save admin time · Reach new areas

### Section 2 — What you've got already (asset & gap audit)
Purpose: what exists vs what we provide. Every "No"/"Not sure" adds the matching service.
Each item: **Yes, I have it · No — help me · Not sure**
- Domain name · Hosting · Brand (logo, colours, fonts) · Photography/imagery · Written copy · An existing website (→ share the link) · Social media accounts

*Note: "a clear idea of your pages" is removed as a question — the sitemap is something we derive and confirm in the Blueprint.*

### Section 3 — What your website needs to do
Purpose: the client's intent for the site. **This is what we derive pages & size from — we do NOT ask page count or size.**

- **What type(s) fit?** (multi) — each opens on the right with its effort slider + plain explanation:
  - Simple presence / brochure · Lead generation · Online shop · Bookings · Blog / content · Membership / login · Portfolio / showcase
- **What should visitors be able to do?** (multi, short) — find & understand you · enquire · book · buy · read your blog · log in
- **What should you be able to do?** (multi, short) — edit content · see stats · get enquiry alerts · manage bookings/orders · send newsletters

*Removed: "Which pages?" and "Roughly how big?" — derived from type + outcomes + services, shown in the Blueprint.*

### Section 4 — Selling online (conditional — only if an online shop is chosen)
- **How many products?** (band) — 1–10 · 10–50 · 50–250 · 250+ · Not sure
- **What are you selling?** (multi) — physical · digital downloads · services · subscriptions
- **Payments & delivery** (multi) — card/Apple Pay · PayPal · UK shipping · international · click & collect

### Section 5 — Getting found & growing (services)
Purpose: the digital-services wrap — where the partner value and recurring revenue live.
- Services (multi, each opens with effort slider): SEO · AI visibility · Blog · Email marketing · Social media · Paid ads · Local SEO · Reporting
- Delivered with named partners (see Partners). Feeds the care-plan recommendation.

### Section 6 — Look & feel
- **Style** (multi) — clean & minimal · bold & modern · warm & friendly · classic · premium · playful
- **Tone of voice** (single) — professional · friendly · straight-talking · authoritative
- **Colours & reference sites** — set in the Thoughts & inspiration panel (not typed here).

### Section 7 — Timeline & practicalities
- **How soon do you want it live?** (single) — ASAP · within a month · 1–3 months · 3–6 months · no rush
- **Who provides words & images?** (single) — you · us · a mix
- **After launch, who looks after it?** (single) — you · us (a care plan) · not sure  → feeds care recommendation
- **Budget comfort** (single, optional, skippable) — soft band + "rather not say"

### Section 8 — Anything else
- Free text for specials (calculators, integrations, member areas) + a reminder that the ✨ panel saves with everything.

### Effort model
- Every selectable component carries a **0–10 effort slider** on the right, with a one-line explanation of what more effort means for it. Default is derived; the client can tune it.
- Effort → colour (RAG) on the dial and → deliverable level & price downstream.

### What the dial shows
- Inner ring: the 8 sections. Middle ring: each answered question. Outer ring: each selected component (its own segment). Colour = effort; grey = incomplete. Hub = % complete + overall effort. Readout lists the focused section's answers.

---

## 3. Blueprint (stub for now — target spec)

The resolved, priced, editable output of scoping. Nine blocks:
1. Package match banner (tier + why + shift control)
2. Readiness score (0–100 from the gap audit + what we'll provide)
3. **Derived sitemap** — the page list we worked out from type/outcomes, for the client to confirm/edit (this is where "which pages" is answered, by us)
4. Component scope (nested: section → component → deliverable level, editable)
5. Deliverable ladder per component (items unlock as effort rises)
6. Web-page mock-up (live wireframe of the derived pages)
7. Price band (recomputes live)
8. Timeline estimate
9. Services & care recommendation → CTA "See my full plan"

---

## 4. Your website plan (example provided separately)

The proposal the client keeps and shares. Generated deterministically by Python (no LLM at runtime) — instant, consistent, auditable. See `TCT_Example_Website_Plan.md` for a full worked example.

Structure: cover/context · what we're building & why · what you have → where we help · derived sitemap · scope & deliverables · getting found & growing (with partners) · timeline & milestones · investment (build band + care monthly) · your inspiration (panel contents) · assumptions/exclusions/next steps + three finishes.

### How it's generated (Python)
- `catalogue.json` — components → deliverable ladders, effort thresholds, price points.
- `engine.py` — pure logic: compute_effort, match_package, resolve_components, price, readiness, timeline, derive_sitemap.
- `render.py` — deterministic HTML via keyed phrase banks + conditional inclusion + computed-value slotting.
- `generate_report.py` — CLI: `python generate_report.py session.json plan.html`.
- `server.py` — stdlib server: receive session, store (sqlite), tokenised 3-day link, serve plan.

Contextual narrative without an LLM: phrase banks keyed by stage/goal/build; paragraphs included only when relevant; real numbers slotted into fixed sentences. The LLM writes the banks once at authoring time — never at runtime.

---

## 5. Thoughts & inspiration — FULL functionality spec

A persistent capture panel present on **every** page. It is how a visitor shows rather than tells, and everything in it is saved to the one session and referenced in the final plan.

### 5.1 Shell & behaviour
- Slide-out panel docked right; **coexists** with the page (page shifts left by the panel width, no overlay).
- Vertical launcher tab on the right edge with a **count badge** (total items captured).
- Open/close; state persists across page navigation within the session.
- On any page: Home, Scoping, Blueprint, Plan.
- Mobile: panel becomes full-width; tab moves to a bottom launcher.

### 5.2 Files & screenshots
- **Add by:** drag & drop from a folder · click to browse · **paste a screenshot** from the clipboard.
- Multiple files; each file gets its own **row**: thumbnail (image preview or file icon) + filename + an **"explain this file" note field** + remove.
- Accepted: images (png/jpg/webp/svg), PDF, docx/pptx/xlsx, txt. Per-file size cap (e.g. 20 MB) and total cap; friendly errors on reject.
- Images are previewed; other types show a type icon.

### 5.3 Colours + Colour Studio
The palette:
- Ordered list of colours with **roles** — Primary, Secondary, Tertiary, then Colour 4…10 (max 10).
- Add by: native colour picker · hex/code input · or from the Colour Studio.
- **Per-colour weight %** that **auto-rebalances to 100%** as you drag (indicates how heavy each colour should be).
- Reorder (order sets the role), remove, tick-to-keep from extracted candidates.

The Colour Studio (modal):
- **Image tray** — hold several images at once; select one to work on; add more anytime.
- Bring an image in by: drag/drop · paste · or **snapshot a screen/second monitor** (`getDisplayMedia`).
- **Eyedropper anywhere on screen** (`EyeDropper` API) — pick a colour from outside the app window.
- **Magnifier loupe** — hover to magnify to the pixel; click to pick the exact pixel; zoom & pan when zoomed.
- **Auto-extract** — pull a palette of N candidate colours from an image; tick the ones to keep.
- **HSV fine-tune** — SV square + hue strip + R/G/B/Hex fields to nudge the picked colour.
- "Add to palette" pushes the colour into the weighted palette behind the modal.
- Graceful fallback: snapshot & screen-eyedropper require Chrome/Edge over https/localhost; show a note and fall back to image-based picking otherwise.

### 5.4 Websites you like
- URL field + "what do you like about it?" note; Add → list.
- Each entry: link + note + remove. (Optional later: fetch favicon/title.)

### 5.5 Notes
- Large free-text: "anything else about your business, customers and taste."

### 5.6 Capture reflection (so the user knows it's saved)
- Every addition echoes as a **"✨ CAPTURED"** chip near the dial (files N · colours N · links N · notes) and increments the tab's count badge.
- Nothing is silently lost; the panel is the visible memory of the session.

### 5.7 Persistence & backend
- All items saved into the **single session** (see data model), survive navigation, and are posted to the server.
- Files uploaded via multipart; stored server-side; referenced by the plan (thumbnails + names + the client's explanations).
- Colours (with roles & weights), links (with notes) and notes are serialised into the session JSON.
- The **plan** renders the panel contents in full — colours with roles/weights, reference sites with the client's reasons, files with their explanations, and the notes.

### 5.8 GDPR
- A one-line "please don't upload personal data" note on the panel.
- Draft submissions retained 3 days; covered by the Privacy Policy; ICO Tier-1 registration before real submissions.

---

## 6. Data model (single session)

```
{
  "meta": { "id", "created", "expires" },
  "scoping": {
    "build", "stage", "industry", "goal",
    "have": { "domain","hosting","brand","photos","copy","existing","socials" },   // yes|no|na
    "type": [ ... ], "does_visitor": [ ... ], "does_owner": [ ... ],
    "sell": { "count","selling":[],"pay":[] } | null,
    "services": [ ... ], "style": [ ... ], "tone",
    "speed", "content", "aftercare", "budget"
  },
  "effort": { "o:type:shop": 8, "d:look": 6, ... },     // 0-10 per component
  "panel": {
    "files": [ {name, kind, explain} ],
    "colours": [ {hex, role, weight} ],
    "links": [ {url, note} ],
    "notes": "..."
  },
  "derived": { }   // filled by engine.py: sitemap, size, package, price, readiness, timeline
}
```

---

## 7. Other artefacts (scoped briefly)

- **About us** — story, ethos, team, "you own everything", how we work; links to Partners & Case studies.
- **Partners** — SEO/AI, brand design, social. Each maps to a scoping service and a plan deliverable. See below.
- **Care & Support** — the three care plans, what each covers, response times/SLAs, hosting & security posture, "we keep it running and improving" (proactive, not break-fix).
- **Work / Case studies** — real projects, results, testimonials. The biggest SME trust lever; feeds the Home proof strip.
- **Insights / Blog** — self-managed CMS; SEO engine; dogfoods the blog we sell.
- **Pricing / Packages** — optional static tiers for people who won't do the wizard; the journey is the hero.
- **Contact / Book a call** — calendar embed + form; the escape hatch every CTA points to.
- **FAQ** — GDPR, ownership, hosting, process, timelines.
- **Legal** — Privacy Policy, Terms, Cookie Policy + banner, Accessibility statement.
- **Plan link + Thank-you** — tokenised 3-day proposal view; post-submit confirmation.

### Partners (detail)
| Area | On the page | In the journey | In the plan |
|---|---|---|---|
| SEO & AI visibility | approach, results, who you'll talk to | Section 5 services | named partner + care retainer |
| Brand design | logo/identity/guidelines; the "brand: No" path | Section 2 gap + Section 6 | brand deliverable + effort |
| Social media | setup vs management | Section 5 social | one-off setup or monthly |

### Aftercare — appears in four places
1. Home "Care" step (link to Care page).
2. Care & Support page (the three plans + SLAs).
3. Scoping Section 7 "who looks after it?".
4. Plan · Investment (care monthly beside the build price).

---

## 8. Pricing model (illustrative — confirm the numbers)

Build points per component = base_points × (1 + effort/10). Sum → tier + band.

| Tier | Points | Build (GBP) |
|---|---|---|
| Launch Lite | < 20 | £750–£1,500 |
| SME Launch | 20–45 | £1,500–£3,500 |
| SME Growth | 45–85 | £3,500–£7,500 |
| SME Operating | 85–140 | £7,500–£12,500 |
| Bespoke | > 140 | £12,500+ |

Care (monthly): Care Lite £39 · Care Plus £99 · Care Pro £249.

**These are placeholders — confirm real numbers and I'll bake them into the engine.**

---

## 9. Open decisions

1. Confirm the sharpened scoping structure above (esp. removing page-count/size; deriving the sitemap).
2. Confirm real pricing (points, bands, care prices).
3. Approve the Thoughts & inspiration functionality spec (§5) for build.
4. Build order for supporting pages (recommend Contact → About/Partners/Care → Blueprint+Plan+wiring → Case studies → Legal).
5. Keep baselines mono; you own the design pass.
