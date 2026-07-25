# TwinCoreTech — Artefact List (pages & things we need to cover)

Canonical list of everything the offering needs. Priority = recommended build order.
Status reflects what exists today in the one-file site.

| # | Artefact | Purpose | Priority | Status |
|---|----------|---------|----------|--------|
| 1 | Home | Reassure + launch the journey | Core | Built |
| 2 | Scoping | Capture requirements (the dial) | Core | Built |
| 3 | Blueprint | Resolved, priced, editable scope | Core | Stub — full build later |
| 4 | Your website plan | Deterministic proposal to convert | Core | Stub — needs Python engine (example in separate file) |
| 5 | About us | Who's behind it, why trust us, team & ethos | High | Home section only — needs own page |
| 6 | Partners | SEO/AI, brand design, social — the extended team | High | New |
| 7 | Care & Support | Aftercare, care plans, SLAs, what "looking after it" means | High | New |
| 8 | Work / Case studies | Proof — real projects, results, testimonials | High | New |
| 9 | Insights / Blog | SEO engine + demonstrate expertise; dogfoods the blog we sell | Medium | New |
| 10 | Pricing / Packages | Optional plain-English tiers for people who won't do the wizard | Medium | Optional |
| 11 | Contact / Book a call | The always-available escape hatch | High | New |
| 12 | FAQ | Deflect objections; GDPR, ownership, hosting, process | Medium | New |
| 13 | Privacy Policy | GDPR / ICO requirement (we store submissions) | Required | New |
| 14 | Terms of Service | Engagement terms, IP, payment | Required | New |
| 15 | Cookie Policy + banner | Consent for analytics | Required | New |
| 16 | Accessibility statement | WCAG posture; good practice for a web agency | Medium | New |
| 17 | Plan link + Thank-you | Tokenised 3-day proposal view; post-submit confirmation | High | Server-rendered (Python) |

## Cross-cutting components (not pages, but must be scoped)

| Component | Where it lives | Status |
|-----------|----------------|--------|
| Thoughts & inspiration panel | Every page (slide-out) | Built — full spec in scope doc |
| Session data model | Scoping → Blueprint → Plan | Defined — not yet wired |
| Pricing / effort engine | Blueprint + Plan (Python) | Defined — needs real numbers |
| Component catalogue | catalogue.json | To build |
| Global nav + footer | All pages | Needs footer with legal links |
| CTA system (Book a call / Message us) | Every page header + escape hatch | Partial |

## Recommended build order

1. Contact / Book a call (every CTA points here)
2. About us + Partners + Care & Support (the trust trio)
3. Blueprint (full) + Plan (Python engine) + data hand-off
4. Work / Case studies (proof)
5. Legal pack (Privacy, Terms, Cookie, Accessibility) — required before real submissions
6. FAQ, Insights/Blog, Pricing page
