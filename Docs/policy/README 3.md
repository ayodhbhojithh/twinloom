# TwinLoom legal pages — developer handover

Eight markdown files, one per page. Each filename matches its URL.

| File | URL | Status |
|---|---|---|
| `privacy.md` | /privacy | Ready, 2 gaps |
| `cookies.md` | /cookies | **Blocked** — needs a production scan |
| `terms.md` | /terms | Ready, 1 gap |
| `terms-of-business.md` | /terms-of-business | Ready, 1 gap, needs legal review |
| `accessibility.md` | /accessibility | **Blocked** — needs an audit |
| `complaints.md` | /complaints | Ready, 2 optional gaps |
| `sub-processors.md` | /sub-processors | **Blocked** — needs the provider list |
| `legal.md` | /legal | Ready, index page linking the other seven |

## How to use these

Every unresolved gap is marked `[[NEEDS: …]]`. Search the folder for `NEEDS` and you have the complete outstanding list. Nothing publishes with one of those still in it.

Three files carry a **"not for publication"** section at the foot, marked as such: `accessibility.md`, `sub-processors.md` and the README you are reading. Delete those sections before the pages go live.

Every page carries the entity line at the foot. Every page needs its last-updated date set to the day it actually publishes, not the day it was drafted.

Set legal links to open in the same tab.

## Footer block for the rest of the site

```markdown
[Privacy](/privacy) · [Cookies](/cookies) · [Terms of use](/terms) ·
[Terms of business](/terms-of-business) · [Accessibility](/accessibility) ·
[Complaints](/complaints) · [Sub-processors](/sub-processors)

TwinLoom is a trading name of TwinCoreTech Ltd, registered in England and Wales,
company number 15997244.
```

## One thing to build, not just to publish

The scoping journey collects a name, company, email, phone, free text, uploaded files and answers about the visitor's business. There must be a link to the privacy notice visible at the point of submission, not only in the footer — on the first screen and on the send step.

```markdown
What happens to your details is set out in our [Privacy notice](/privacy).
```

## The full outstanding list

**Blocking a page:**

1. **Cookie scan.** Run against the production site and fill the table in `cookies.md`. Include local storage, pixels and SDKs, not only items technically named cookies.
2. **Sub-processor list.** Ten providers, each with name, purpose and processing location, plus the transfer safeguard for anything outside the UK. Full list at the foot of `sub-processors.md`.
3. **Accessibility audit** against WCAG 2.2 AA, then choose the conformance status and record any limitations. The nine criteria that 2.2 adds over 2.1 are listed at the foot of `accessibility.md`.

**Blocking publication of terms of business:**

4. **The liability cap**, clause 18. This is a commercial and insurance decision, not a drafting one — it has to match what the professional indemnity policy covers. A cap above the cover leaves the difference exposed; well below it and any client with a procurement function will push back. The usual shapes are fees paid in the preceding 12 months, a fixed sum, or the higher of the two. Worth asking whether data protection, confidentiality and IP claims sit outside the general cap.
5. **Solicitor review.** In order of how much each costs if it is wrong: clause 18 liability, clause 19 indemnities, clause 15 data protection, clause 10 intellectual property.

**Smaller decisions:**

6. **ICO registration number**, or confirmation that TwinCoreTech Ltd is not registered, for `privacy.md`.
7. **Retention period for meeting notes**, for `privacy.md`.
8. **Telephone number** for complaints and accessibility, or a decision not to publish one.
9. **Ombudsman or trade scheme membership**, if any. Nothing is claimed at present, which is correct if there is none.
10. **Publication dates** for all eight pages.

## A gap the terms of business points at

Clause 15 commits you to data-processing terms covering thirteen listed things, including sub-processors. Those terms do not exist yet. You need an actual data processing agreement as a schedule to the proposal, and it should name the sub-processors from `sub-processors.md`. That is the next document after this set.

## Standing caveat

I am not a lawyer and none of this is legal advice. The terms of business in particular, and anything touching data protection, should be reviewed by a solicitor before publication.

Delete this file before deploying, or keep it out of the published site.
