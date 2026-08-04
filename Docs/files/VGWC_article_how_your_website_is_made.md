# The real difference is when your pages get made

*Draft for the Advice section. Companion pieces: "Do you need Shopify?" (selling
online) and "Where should your blog live?" (publishing). Suggested slug:
`advice/how-your-website-is-made`. The back-of-house note at the end comes off
before publication.*

---

**Lead:** Every website a visitor sees is plain HTML — that has been true since
the web began. What separates one website technology from another is a single
question: when does that HTML get made, and by what?

Website conversations fill up with names — WordPress, Astro, React, Node — and
it is rarely explained that these things do different jobs at different
moments. This page puts each one at its moment, so the next time a name comes
up you know which part of your website it actually touches.

## The only thing a browser reads is HTML

When someone visits your site, their browser receives an HTML file and draws
the page from it. Every website on earth works this way. So the real
difference between website technologies is not what the visitor receives — it
is when and how that HTML gets made. There are two broad answers.

**Made at the moment of the visit.** A program runs on the server, and when a
visitor asks for a page, the program builds it there and then. WordPress is
the best-known example. It is flexible — the page can be different for every
visitor — but it means software running on a server that must be updated,
secured, maintained and paid for, whether or not anything on the site has
changed.

**Made once, in advance.** The pages are built ahead of time, as ordinary
files, and the server's only job is to hand them over. Nothing runs when a
visitor arrives; there is nothing on the server to break into or keep patched;
and the page arrives as fast as a file can be sent. This is called a static
website, and it is how we build unless a site has a reason to need otherwise.

The trade is honest in both directions. A static page cannot change by itself
— updating it means rebuilding and re-uploading, which suits pages that change
weekly, not secondly. And anything genuinely dynamic — an account someone
signs into, an order, a saved answer — needs a separate service behind the
site. The point is not that one approach wins; it is that most pages on most
business websites are the same for every visitor, and paying for
made-at-the-moment machinery to serve unchanging pages is buying flexibility
nobody uses.

## The names, at their moments

| The name | What it actually is | When it runs | What it means for you |
|---|---|---|---|
| HTML | The finished page, as every browser reads it | At the visit — it is what arrives | This is the only thing your visitors ever receive |
| A static site generator (ours is Astro) | A program that reads page templates and writes the finished HTML | At build time — before anything is published | Your pages exist as files; nothing generates them per visit |
| An `.astro` file | A template: a recipe for one page, in the site's shared design | Read at build time, never sent to a browser | Editing a page means editing its template and rebuilding |
| Node.js | The program that lets build tools run on an ordinary computer | At build time only, on the building machine | It never runs on your live site; there is nothing of it to maintain there |
| JavaScript in the page | Code that runs in the visitor's browser after the page arrives | After load, on the visitor's device | This is how a static page can still be interactive |
| React | A library for building complex interactive interfaces in the browser | After load, where used — and only where used | Worth it when interactivity gets complex; not a requirement for it |
| A backend, or server | A separate service that receives and stores data | At the visit, but only for the pages that need it | Accounts, orders and saved answers live here — added when needed, not before |

## Where interactivity comes from

A static page is not a frozen page. JavaScript written into the page runs in
the visitor's browser and can do a great deal: calculators, pickers, panels
that respond as you answer. None of that needs a server, and none of it needs
React — plain JavaScript inside the page covers more than most business sites
ever ask of it.

React earns its place when the interactive parts of a site grow complex
enough that plain JavaScript becomes hard to keep correct — many moving parts
that must stay in step with each other. That is a judgement about
maintainability, not a requirement for interactivity, and "built in React" is
not by itself a mark of quality. A site can be excellent with none of it.

## When a server does enter the picture

Three things a folder of files cannot do: remember, receive, and restrict.
The moment a website needs to remember a visitor (accounts, saved progress),
receive something from them beyond an email (orders, uploads, payments), or
restrict who sees what (a members' area), a service running somewhere becomes
part of the picture — a small backend, a booking system, a shop platform or a
payment provider, depending on the job.

The craft is keeping that machinery proportionate: the public pages stay
static and fast, and the running service exists only for the part that needs
it. A brochure site with a booking page does not need to become a WordPress
install; it needs a folder of pages and one connected booking journey.

## Why we build this way

Speed, because a ready-made file beats a page assembled on demand, and speed
is measured in visitors who stay. Security, because a server running no
software offers nothing to attack — the commonest way small-business sites
are compromised is unpatched plugins on made-at-the-moment platforms. Cost,
because hosting files is close to free, and there is no stack of software
licences or update work to pay for monthly. And ownership, because a folder
of HTML is the most portable thing on the web — any host will serve it, and
no supplier can hold it hostage.

The honest limits, stated as plainly: content edits go through a rebuild, so
if your team needs to publish daily without us, we connect a publishing
system — that decision has its own page. And anything transactional needs its
services connected deliberately, which is exactly what our scoping journey
maps.

## Questions people ask us

**Is a static website worse than WordPress?**
It is different, not lesser. WordPress builds pages at the moment of the
visit, which suits sites where many people publish constantly. A static site
serves ready-made pages, which suits sites where speed, security and low
running cost matter more. Most small-business websites are the second kind.

**Can a static website have interactive features?**
Yes. JavaScript runs in the visitor's browser after the page loads, so
calculators, configurators and responsive panels all work on a static site.
What needs more than that — accounts, orders, saved progress — is handled by
a connected service, not by abandoning the static site.

**Do I need React for a modern website?**
No. React is one way of managing complex interactivity, useful when there is
complex interactivity to manage. A site is not more modern for including it,
and page speed usually favours less of it.

**What happens when I want to change a page?**
The page's template is edited, the site is rebuilt — a step that takes
moments — and the fresh pages are published. Under a care plan that is our
job; if your team publishes frequently themselves, we connect a publishing
system so they never wait on us.

**Who owns the website you build?**
You do — and a static site makes that unusually clean: the finished site is a
folder of ordinary files that any host can serve and any competent developer
can pick up. The written handover names everything and where it lives.

**Closing actions:** *See how we work* (/how-we-work/) · *Start scoping your
site* (/start/)

---

## Back of house — comes off before publication

**SEO.** Slug `advice/how-your-website-is-made`. Title tag: "Static website
vs WordPress: how your website is actually made" (queries: "static website vs
WordPress", "what is a static website", "do I need React for my website",
"static site generator explained"). Meta description: "Every website is HTML —
the difference is when it gets made. Static sites, WordPress, React and Node,
each explained at the moment it runs." Article + BreadcrumbList + FAQPage
JSON-LD in the built page, questions verbatim as on-page content. Internal
links: to where-should-your-blog-live (the publishing decision), to
selling-online-your-options (the transactional decision), from
how-we-work and the FAQ where technology questions arise.

**House-rule check.** No promises; WordPress treated fairly (it is the right
answer for constant publishing — and our own blog-location article recommends
it in that role, so the two pages must not contradict: this page criticises
unpatched plugins, not WordPress); "built in React is not a mark of quality"
kept, because clients are sold that line weekly; ownership paragraph ends on
the handover promise, consistent with what-you-receive-in-writing.
