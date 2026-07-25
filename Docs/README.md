# Website Development Service Selector — Developer Handoff

## What's in this folder

| File | Purpose |
|---|---|
| `Web Studio Page (standalone).html` | **Start here.** Fully self-contained. Double-click to open in any browser — no server, no build, no network. All fonts, styles and logic inlined. This is the visual source of truth. |
| `source/Web Studio Page.dc.html` | Editable source for the page. Markup + logic class in one file. |
| `source/Web Dev Services Page.dc.html` | Earlier services page (kept for reference). |
| `source/support.js` | Runtime that renders the source files. Must sit alongside them. |
| `source/image-slot.js` | Image placeholder web component used by the mock-ups. |

To run the **source** version locally, serve the `source/` folder over HTTP (e.g. `npx serve source`) and open the `.dc.html` file. Opening it via `file://` will not load the runtime.

## Structure of the page

The page is a design canvas: each numbered `<section>` is one exploration turn, newest at the top. Every option carries a visible id badge (`1a`, `1b`, `2a`…) so it can be referenced in conversation. The two live options for build are:

- **9a — Blueprint layout.** Page/service map presented as an architectural blueprint. Clicking a component block in the mock-up jumps the scope table to that component's row.
- **9b — Lanes layout.** Same data and same mechanics, laid out as horizontal service lanes instead of a blueprint grid.

Both share the identical scope table underneath. **Pick one layout; the table is common to both.**

## The scope table (the part that matters)

This is the pre-estimator. Behaviour to reproduce:

1. **À-la-carte sums.** Each row is a selectable scope item with its own contribution. Selected rows sum to a running total.
2. **£-range output.** The total is shown as a range, not a single figure — this is a pre-estimator, it must not read as a quote.
3. **Package + timeline thresholds.** As the total crosses defined thresholds, the recommended package tier and the indicative timeline both step up. Thresholds are data, not hardcoded branches — keep them in one config object.
4. **Collapsible rows.** Groups expand/collapse; collapsed state must not clear selections.
5. **Row anchoring.** Clicking a component in the mock-up sets the table's `scrollTop` to that row's offset — an instant jump, deliberately not smooth-scrolled (smooth scrolling was tried and rejected as too slow/janky inside the panel).

Default selections land at approximately **£3,125**.

## Known follow-up (not yet built)

The full service catalogue — proofing, starter blogs, CRM integration and the rest — is designed to drop into the same three pricing levels with **no structural change** to the table. Adding a service is adding a row plus its level assignment.

## Notes for implementation

- No pricing is exposed as a fixed figure anywhere. Ranges only.
- All styling is inline on the elements. There is no stylesheet to port; if you're rebuilding in a framework, lift the inline style objects directly.
- Colour, type and spacing all come from the bound design system — match those values rather than re-deriving them.
- Keep the two-way link between mock-up and table. It's the core interaction and the reason the component engages prospects.
