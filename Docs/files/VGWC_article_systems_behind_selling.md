# Behind every sale online there are three systems — and one of them should be yours

*Draft for the Advice section. Third piece in the selling-online set: the
options guide carries the map, the Shopify article carries the platform
detail, this one carries what sits underneath. Suggested slug:
`advice/the-systems-behind-selling-online`. Back-of-house note at the end
comes off before publication.*

---

**Lead:** Take any sale on any website — a parcel, a download, a gym
membership, a donation — and behind it you will find the same three systems:
one that moves the money, one that keeps the records, and the website
itself. Most selling advice talks only about the website. The records are
where businesses get quietly locked in.

## The three systems, in plain words

**The money system** is a payment provider: it serves the card fields,
holds the card details, runs recurring billing and retries. This is never
your website's job and never ours — card details should not touch a small
business's own systems, and in our builds they never do.

**The records system** is the one nobody mentions. Somebody has to own the
authoritative list: who bought which download and how many times they have
fetched it; who is a member, on which plan, paid up or lapsed; who donated,
how often, and whether a Gift Aid declaration was captured. The money system
knows payments happened; it does not know what they *mean* for your
business. That meaning lives in the records system — and whoever runs it
holds your business's memory.

**The website** is the part people see: the pages, the join journey, the
member's sign-in area. It should read from the records system rather than
try to be one.

## What each kind of sale needs behind it

| What you sell | The records behind it | The common answer today | Where we would start |
|---|---|---|---|
| Physical goods — a full shop | Catalogue, stock, orders, deliveries, returns | Shopify, which handles all of it well | Shopify — [our baseline, explained honestly](/advice/why-our-baseline-is-shopify/) |
| Digital downloads, tracked | Who owns which file, download limits, secure re-download | Scattered apps and plugins; the records rarely belong to you | Speak to us about Omadeas |
| Memberships — gyms, clubs, paid content | The member register: plan, status, what each tier gets, joins and lapses | A patchwork of membership tools, each holding your register their way | Speak to us about Omadeas |
| Donations, and friends-of schemes | The supporter register, recurring gifts, Gift Aid declarations and claims | Generic donation widgets; Gift Aid often handled on spreadsheets | Speak to us about Omadeas |
| Services paid online | A record of what was paid for, in your books or CRM | A payment page plus your accounting package | A payment page — and the record lands where you already work |
| Bookings that take payment | The diary itself — availability is the record | Established booking systems, a crowded and capable market | A booking system connected to your site |
| Quoted projects | Enquiry to proposal to invoice | Your CRM and accounting package | A well-built enquiry journey that writes into them |
| Software you make | Your product's own billing holds everything | Exactly as it should be | Your website does the shop window; we leave your billing alone |

Read down the last column and the pattern shows itself: where a strong
ready-made system exists, we say so and connect to it. The rows that say
*speak to us about Omadeas* are the ones where the ready-made market is
weakest — and where the records matter most.

## What Omadeas is

Omadeas is the business platform we build and run ourselves. It is a set of
connected systems for the records a business has to own — members and what
their membership entitles them to, buyers and what they can download,
supporters and their Gift Aid position, and the accounts behind all of it.

Where your website needs one of those record systems, we can connect the
site to Omadeas rather than adding another subscription that holds your
records its own way. The website stays fast and simple; the records live in
a system built around them; and the division of labour stays clean — the
payment provider still moves the money and holds the card details, Omadeas
holds the records, and your website reads from both.

Two things we will always say plainly. Where a ready-made platform is the
better answer — a full shop on Shopify being the clearest case — we will
recommend it, because [our reasons for that baseline are honest ones](/advice/why-our-baseline-is-shopify/).
And whatever holds your records, the proposal names it in writing: the
system, who owns the account, what it costs monthly with VAT treatment
stated, and how you would leave with your records if you ever wanted to.
Records you cannot take with you were never really yours.

## Questions people ask us

**Who holds the card details?**
The payment provider, always — never your website, never us, never Omadeas.
The card fields your customers type into are served by the provider, so you
sit in the lightest compliance category there is.

**What happens to our records if we stop working with you?**
You take them. Exit is written into the proposal from day one: what you
would export, in what form, and what any replacement provider would need.
This applies to Omadeas exactly as it applies to Shopify or anything else.

**Can the website track how many times someone downloads what they bought?**
Yes — that is a records question. Each purchase creates an entitlement, each
download is delivered by a secure expiring link and logged against it, and
buyers get a sign-in area to fetch their files again without emailing you.

**We run a gym — can members sign in and see their membership?**
Yes. The payment provider runs the billing; the member register holds who is
on which plan and what it entitles them to; and the sign-in area on your
site reads from that register. When a payment fails, the register updates
and access follows — automatically, with a named person told.

**Is this instead of Shopify?**
No — different jobs. A shop full of physical products belongs on a shop
platform, and [ours is Shopify by default](/advice/why-our-baseline-is-shopify/).
Omadeas enters where the sale is really a record — memberships, tracked
downloads, supporters — and the guide to [which kind of sale is which](/advice/selling-online-your-options/)
is the place to start.

**Closing actions:** *See which kind of sale yours is* (/advice/selling-online-your-options/) ·
*Speak to us about Omadeas* (/contact/)

---

## Back of house — comes off before publication

**Wording decisions.** "Beachhead" is internal only — this article never
uses it, and the table column reads "Speak to us about Omadeas" per the
decision of 2026-08-01. The Omadeas explanation deliberately leads with
records ownership, not platform ambition; the Shopify-replacement goal is
never stated publicly. The exit-route paragraph is the trust move — it makes
"our own platform" read as confidence rather than lock-in, and it must stay.

**Links.** This article links twice to
`/advice/why-our-baseline-is-shopify/` — **that page does not exist yet**;
the draft is `articles/VGWC_article_why_shopify.md` and needs converting to
an Astro page (suggested slug above) before this article publishes, or the
links 404. The selling-online links target `/advice/selling-online-your-options/`,
which is live in the site source. Reciprocal links to add: from the
selling-online article's "what the sale needs" section and from the
why-Shopify article's "when we would suggest something else" section, both
pointing here.

**SEO pack.** Title tag: "Who should own your members, downloads and
donations? The systems behind selling online". Meta description: "Every
online sale sits on three systems: money, records and the website. Who holds
each one decides how locked in you are. A plain-words guide." Queries this
page is shaped for: "membership website UK who owns the data", "track
digital download purchases website", "Gift Aid donation website records",
"gym membership website system". JSON-LD: Article + BreadcrumbList +
FAQPage from the six on-page questions, same pattern as the two live advice
pages; `ogType="article"` via the patched Base layout.

**Alignment.** Public rendering of spec section 12
(`VGWC_online_shop_scope_and_layers.md`) minus the sequencing and the
module registry references. The internal visual
(`vgwc-omadeas-systems.html`) keeps beachhead language and now carries its
own what-is-Omadeas strip for anyone it is shared with.
