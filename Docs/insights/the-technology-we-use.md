# The technology we use

**URL:** /insights/the-technology-we-use
**Last updated:** [[NEEDS: publication date]]

This names the frameworks and hosting we use, and what each one gets you.

## What your website is built with

**Next.js**, the framework, handling both the front end and the server side. **TypeScript** throughout, which catches a class of mistake before the code ever runs. **Node.js**, the program that runs it on the server. **Tailwind CSS** for styling. **PostgreSQL** where a site needs a database of its own, which many do not.

Where a site needs a back end application behind it rather than a database table - a portal, an internal system, something with real business logic - that is built in **.NET** or Node by TwinCoreTech, the software company TwinLoom is part of.

All of it is standard, widely used technology. There is no proprietary builder and nothing that only runs on our infrastructure.

## Pages are rendered on the server

This is the part worth understanding, because it decides what a crawler receives.

A page can be sent to a browser in one of two ways. Either the finished HTML arrives in the first response, or an empty page arrives with a pile of JavaScript that then draws the content. Google can execute JavaScript, but it does so on a second pass, later, and inconsistently. Most AI crawlers do not execute JavaScript at all - they read what comes back first and nothing else.

So we render pages on the server, which means your content is in the first response rather than drawn afterwards by JavaScript. What any crawler then does with it is not ours to promise - [SEO and search](/insights/seo-and-search) sets out what can and cannot be said about that. Next.js is how we render; it is not why it matters.

## How each kind of page renders

| Page type | How it renders | Why |
|---|---|---|
| Marketing, services, about, contact | Built at deploy | Fastest, cacheable, nothing to go wrong |
| Blog and articles | Built when the content changes | Same, and you publish without waiting for a deploy |
| Product or menu listings | Built, then refreshed periodically | Fresh enough, still served from cache |
| Anything personalised or signed in | Rendered per request | Cannot be cached, and should not be indexed |

## Where we host

Your site runs on **Vercel**, the company that makes Next.js. The site runs on the platform it was built for.

That gets you four things.

**Nothing to patch.** Platform security updates are handled by the platform, not billed to you.

**Fast wherever your customers are.** Your pages are held in dozens of places around the world and served from the closest one.

**You see changes before the public does.** Every change produces a private link showing how it will look on the real site. You approve it, then it goes live.

**It goes back if it goes wrong.** Returning to the last working version is one action taken in seconds.

It is not free. It runs on a paid plan, and part of the bill scales with how much traffic you get, so a busy site costs more than a quiet one. That is a line on your quote from the start, with VAT treatment stated, rather than a surprise in month four.

**Your domain is registered in your own account, never through ours.** That is done at setup.

## Where your writing lives

Your blog runs on WordPress. Your website does not.

Writing is the one part of a site you should never have to ask permission to change, so your words do not live inside the website. They live in WordPress, with your own login. You write, you press publish, and the post appears on your site, in your design, at your address, usually inside a minute.

**Your visitors never touch WordPress.** It sits behind your site as the place you write, not as the thing your customers load. That is what makes the security question manageable, and keeping it updated is our job rather than yours.

**Getting your words back out.** WordPress has had a documented export for longer than most of the alternatives have existed, and you can take a copy of the whole thing.

**Anyone can take it over.** Any web developer can work with a WordPress site. A system configured by whoever built it is harder to hand on.

Each client gets their own WordPress with their own content, their own logins and their own database. It costs a second small hosting line and a monthly line for keeping it updated, and both appear in the proposal.

We will suggest something else in two situations: where nobody in your business has used WordPress and nobody wants to learn, a hosted writing system is simpler, though it charges per person so a second and third writer cost more; and where you will write three or four times a year, no system at all and sending us the words is the proportionate answer.

## We do not build WordPress websites

It is a common request, so it is worth stating.

Your **writing** can sit in WordPress, and usually should. Your **website** is built in Next.js. Where your writing lives is a choice we make with you; what the website is built on is a build decision, and we make it the same way every time.

What we will do with an existing WordPress site: connect your writing to a new site so the posts, categories and links you already have keep working, or migrate you off it entirely. If you already have a WordPress site that works, keep it.

## What we do not do

**We do not put a page builder over everything.** We make editable the things that change: your writing, your images and the content the site is for.

**We do not solve build problems with plugins.** Speed, structure and search readability are decisions taken during the build, not things installed at the end.

**We do not build on anything you cannot leave.**

## If you leave

Your domain in your own registrar account. Your Search Console and analytics properties in your name. Your content exportable in a standard format. The source code in a repository, the store the code lives in, that we can hand you.

Hosting is the exception while we work together: your site runs inside our Vercel account as its own separate project. Moving that project to an account of your own is a supported operation that takes seconds and no downtime.

If you leave, you leave with a working website.

---

If you want to talk through what would fit your business, [send us your requirements](#) - in as little or as much detail as you like.

---

## Not for publication

**This is a full rewrite. The previous version was wrong on the two most important facts.** It said the sites are static, built with Astro, because I inferred the stack from the old `vgwc` site source rather than from the stack document. And it presented WordPress as one of three content options for the whole site, when the position is that WordPress holds the writing and never the website.

**Source: `TCT_Build/TCT_Stack_and_Decisions.md`.** Sections A (the confirmed stack), B (the rendering rule table, condensed from five rows to four by dropping the scoping-journey row, which is about our own site rather than a client's), I.1 (Vercel, including the domain-registrar rule), I.2 (a WordPress install per client, not multisite) and I.3 (WordPress as the named default for writing).

**Source: `TCT_Build/TCT_Site_Screens.html`.** The Vercel four-point list, "your blog runs on WordPress, your website doesn't", the export-is-proven line, and the two situations where we suggest something else are all taken from the approved client-facing copy rather than rewritten.

**Added from your message, not in either document:** `.NET` for back end applications. The stack document names only Next.js and Node, so if .NET is standard for TwinCoreTech work it may be worth adding to that document too, or it will keep going missing.

**Copy rules found and applied.** `TCT_Stack_and_Decisions.md` sections J, K, L and M are standing rules for all site copy: no comparatives with other agencies, no self-promotion, no emphatics or cringe, one narrative per page. This rewrite drops the "one question that decides everything else" opening from the previous version, which was the manufactured-doctrine problem you have now pulled me up on twice, and it avoids the banned intensifiers.

**Two things worth checking across the other insight pieces**, which were written before I found those rules. The word "honestly" appears in the selling-online baseline section, which rule L specifically names as a virtue adverb to cut. And several pieces carry lines that read as arguments for us rather than facts about the offering, which is rule K. Say the word and I will sweep all six.

Delete this section before publishing.
