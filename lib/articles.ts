/* ---------------------------------------------------------------------------
   The articles.

   Written as drafts for the advice section and kept here as data rather than as
   pages: an article is a title, a lead and a run of sections, and holding that
   shape means the index and the article itself cannot disagree about what an
   article is.

   The structure the authors wrote in is kept. Tables are tables, lists are
   lists and named things keep their names, because all three are set
   differently on the page and flattening them into paragraphs would throw away
   the reason they were written that way.

   The drafting notes have been left behind. Every source carried a back of
   house section addressed to us - what to check before publishing, what the SEO
   pack should contain - and none of that is written for a reader.
--------------------------------------------------------------------------- */

/** A run of words, a list, a named thing, or a table, inside a section. */
export type Block =
  | { k: "p"; t: string }
  | { k: "h"; t: string }
  | { k: "ul"; i: string[] }
  | { k: "table"; h: string[]; r: string[][] };

export interface Section {
  /** Empty on the opening run, which sits under the lead with no heading. */
  h: string;
  b: Block[];
}

export interface Article {
  slug: string;
  /** What it is about, used to group the index. */
  topic: string;
  title: string;
  /** The article in one sentence, in its own words. */
  lead: string;
  /** The article in one line, written for the index. */
  note: string;
  /** Reading time, from the word count at 210 a minute. */
  minutes: number;
  sections: Section[];
}

export const ARTICLES: readonly Article[] = [
  {
    slug: "how-your-website-is-made",
    topic: "How websites are built",
    title: "The real difference is when your pages get made",
    lead: "Every website a visitor sees is plain HTML - that has been true since the web began. What separates one website technology from another is a single question: when does that HTML get made, and by what?",
    note: "WordPress, Astro, React, Node. Which part of your website each one actually touches, and when.",
    minutes: 7,
    sections: [
      {
        h: "",
        b: [
          {
            k: "p",
            t: "Website conversations fill up with names - WordPress, Astro, React, Node - and it is rarely explained that these things do different jobs at different moments. This page puts each one at its moment, so the next time a name comes up you know which part of your website it actually touches.",
          },
        ],
      },
      {
        h: "The only thing a browser reads is HTML",
        b: [
          {
            k: "p",
            t: "When someone visits your site, their browser receives an HTML file and draws the page from it. Every website on earth works this way. So the real difference between website technologies is not what the visitor receives - it is when and how that HTML gets made. There are two broad answers.",
          },
          {
            k: "p",
            t: "**Made at the moment of the visit.** A program runs on the server, and when a visitor asks for a page, the program builds it there and then. WordPress is the best-known example. It is flexible - the page can be different for every visitor - but it means software running on a server that must be updated, secured, maintained and paid for, whether or not anything on the site has changed.",
          },
          {
            k: "p",
            t: "**Made once, in advance.** The pages are built ahead of time, as ordinary files, and the server's only job is to hand them over. Nothing runs when a visitor arrives; there is nothing on the server to break into or keep patched; and the page arrives as fast as a file can be sent. This is called a static website, and it is how we build unless a site has a reason to need otherwise.",
          },
          {
            k: "p",
            t: "The trade is honest in both directions. A static page cannot change by itself - updating it means rebuilding and re-uploading, which suits pages that change weekly, not secondly. And anything genuinely dynamic - an account someone signs into, an order, a saved answer - needs a separate service behind the site. The point is not that one approach wins; it is that most pages on most business websites are the same for every visitor, and paying for made-at-the-moment machinery to serve unchanging pages is buying flexibility nobody uses.",
          },
        ],
      },
      {
        h: "The names, at their moments",
        b: [
          {
            k: "table",
            h: [
              "The name",
              "What it actually is",
              "When it runs",
              "What it means for you",
            ],
            r: [
              [
                "HTML",
                "The finished page, as every browser reads it",
                "At the visit - it is what arrives",
                "This is the only thing your visitors ever receive",
              ],
              [
                "A static site generator (ours is Astro)",
                "A program that reads page templates and writes the finished HTML",
                "At build time - before anything is published",
                "Your pages exist as files; nothing generates them per visit",
              ],
              [
                "An `.astro` file",
                "A template: a recipe for one page, in the site's shared design",
                "Read at build time, never sent to a browser",
                "Editing a page means editing its template and rebuilding",
              ],
              [
                "Node.js",
                "The program that lets build tools run on an ordinary computer",
                "At build time only, on the building machine",
                "It never runs on your live site; there is nothing of it to maintain there",
              ],
              [
                "JavaScript in the page",
                "Code that runs in the visitor's browser after the page arrives",
                "After load, on the visitor's device",
                "This is how a static page can still be interactive",
              ],
              [
                "React",
                "A library for building complex interactive interfaces in the browser",
                "After load, where used - and only where used",
                "Worth it when interactivity gets complex; not a requirement for it",
              ],
              [
                "A backend, or server",
                "A separate service that receives and stores data",
                "At the visit, but only for the pages that need it",
                "Accounts, orders and saved answers live here - added when needed, not before",
              ],
            ],
          },
        ],
      },
      {
        h: "Where interactivity comes from",
        b: [
          {
            k: "p",
            t: "A static page is not a frozen page. JavaScript written into the page runs in the visitor's browser and can do a great deal: calculators, pickers, panels that respond as you answer. None of that needs a server, and none of it needs React - plain JavaScript inside the page covers more than most business sites ever ask of it.",
          },
          {
            k: "p",
            t: 'React earns its place when the interactive parts of a site grow complex enough that plain JavaScript becomes hard to keep correct - many moving parts that must stay in step with each other. That is a judgement about maintainability, not a requirement for interactivity, and "built in React" is not by itself a mark of quality. A site can be excellent with none of it.',
          },
        ],
      },
      {
        h: "When a server does enter the picture",
        b: [
          {
            k: "p",
            t: "Three things a folder of files cannot do: remember, receive, and restrict. The moment a website needs to remember a visitor (accounts, saved progress), receive something from them beyond an email (orders, uploads, payments), or restrict who sees what (a members' area), a service running somewhere becomes part of the picture - a small backend, a booking system, a shop platform or a payment provider, depending on the job.",
          },
          {
            k: "p",
            t: "The craft is keeping that machinery proportionate: the public pages stay static and fast, and the running service exists only for the part that needs it. A brochure site with a booking page does not need to become a WordPress install; it needs a folder of pages and one connected booking journey.",
          },
        ],
      },
      {
        h: "Why we build this way",
        b: [
          {
            k: "p",
            t: "Speed, because a ready-made file beats a page assembled on demand, and speed is measured in visitors who stay. Security, because a server running no software offers nothing to attack - the commonest way small-business sites are compromised is unpatched plugins on made-at-the-moment platforms. Cost, because hosting files is close to free, and there is no stack of software licences or update work to pay for monthly. And ownership, because a folder of HTML is the most portable thing on the web - any host will serve it, and no supplier can hold it hostage.",
          },
          {
            k: "p",
            t: "The honest limits, stated as plainly: content edits go through a rebuild, so if your team needs to publish daily without us, we connect a publishing system - that decision has its own page. And anything transactional needs its services connected deliberately, which is exactly what our scoping journey maps.",
          },
        ],
      },
      {
        h: "Questions people ask us",
        b: [
          {
            k: "p",
            t: "**Is a static website worse than WordPress?** It is different, not lesser. WordPress builds pages at the moment of the visit, which suits sites where many people publish constantly. A static site serves ready-made pages, which suits sites where speed, security and low running cost matter more. Most small-business websites are the second kind.",
          },
          {
            k: "p",
            t: "**Can a static website have interactive features?** Yes. JavaScript runs in the visitor's browser after the page loads, so calculators, configurators and responsive panels all work on a static site. What needs more than that - accounts, orders, saved progress - is handled by a connected service, not by abandoning the static site.",
          },
          {
            k: "p",
            t: "**Do I need React for a modern website?** No. React is one way of managing complex interactivity, useful when there is complex interactivity to manage. A site is not more modern for including it, and page speed usually favours less of it.",
          },
          {
            k: "p",
            t: "**What happens when I want to change a page?** The page's template is edited, the site is rebuilt - a step that takes moments - and the fresh pages are published. Under a care plan that is our job; if your team publishes frequently themselves, we connect a publishing system so they never wait on us.",
          },
          {
            k: "p",
            t: "**Who owns the website you build?** You do - and a static site makes that unusually clean: the finished site is a folder of ordinary files that any host can serve and any competent developer can pick up. The written handover names everything and where it lives.",
          },
          {
            k: "p",
            t: "**Closing actions:** *See how we work* (/how-we-work/) · *Start scoping your site* (/start/)",
          },
          {
            k: "p",
            t: "---",
          },
        ],
      },
    ],
  },
  {
    slug: "why-shopify",
    topic: "Selling online",
    title: "Why we build shops on Shopify, and what else we work with",
    lead: "",
    note: "Our starting position for a shop, the alternatives in plain words, and when we would say something else.",
    minutes: 6,
    sections: [
      {
        h: "The honest answer first",
        b: [
          {
            k: "p",
            t: "When we build you an online shop, our starting position is Shopify. There are two reasons, and the first one is simply about us: we work with Shopify continuously across our projects, which means the time you pay for goes into your shop rather than into us learning a platform. The second is about the platform: for most shops of the size we build, it is the option where the most things work on day one and the fewest things need looking after afterwards.",
          },
          {
            k: "p",
            t: "Neither reason makes Shopify the answer to every shop. Where you already run a shop somewhere else, or a system in your business already owns your stock, your orders or your accounts, we would rather connect to what you have than replace it. The rest of this page explains the choices in plain words, so you can see the same picture we see.",
          },
        ],
      },
      {
        h: "What Shopify gives a shop from day one",
        b: [
          {
            k: "p",
            t: "The checkout, card and wallet payments, VAT handling, delivery settings, order emails, stock counts and the security around all of it come as part of the platform rather than as things to assemble. Shopify hosts the shop, keeps it patched and takes responsibility for it staying up. When you need something beyond the standard - subscriptions, product reviews, a connection to your accounting package - there is usually an established app for it rather than custom work.",
          },
          {
            k: "p",
            t: "The costs are worth understanding before anyone builds anything. You pay Shopify a monthly fee for the platform, and a small percentage of each card payment. At the time of writing the plans most of our clients use are roughly £25 to £65 a month plus VAT, with card fees around 1.7 to 2 per cent plus 25p on the plans at that level. Those figures are indicative and Shopify's own pricing page is the current word. Apps you add carry their own monthly fees, which is one of the things we watch on your behalf - a shop can quietly accumulate app costs that outgrow the platform fee.",
          },
        ],
      },
      {
        h: "The alternatives, in plain words",
        b: [
          {
            k: "p",
            t: "**WooCommerce** turns a WordPress website into a shop. The software itself is free, which is the headline, but you then own the hosting, the security, the updates and the way the pieces fit together - either yourself or by paying someone to. It is the right answer when a business already lives in WordPress, publishes a great deal, and has someone looking after the site anyway. It is the wrong answer when nobody wants to think about updates again.",
          },
          {
            k: "p",
            t: "**BigCommerce** is the closest thing to Shopify in shape: hosted, capable, with strong features for selling to other businesses built in rather than added on. Its plans move up with your sales volume. We would talk about it seriously for a shop that is heavily business-to-business from the start.",
          },
          {
            k: "p",
            t: "**Wix and Squarespace** are website builders with shops attached. For a small catalogue where the website matters more than the shop - a studio selling a dozen pieces, a venue selling vouchers - they can be entirely adequate. The ceiling arrives quickly: delivery rules, tax beyond the basics, connections to other systems and moving your data out are all harder than they should be.",
          },
          {
            k: "p",
            t: "**EKM, ShopWired and Bluepark** are the British platforms, and they deserve to be better known. All three are hosted, priced in pounds plus VAT, and answer the phone in the UK - EKM in particular builds its offer around support, and ShopWired and Bluepark hold strong customer ratings. Their app and theme ecosystems are far smaller than Shopify's, which is the trade: better hand-holding, fewer ready-made pieces. For a shop that values a UK support relationship above an ecosystem, they are a reasonable home, and we are able to work with them.",
          },
          {
            k: "p",
            t: "**Square Online and Ecwid** suit the smallest shops - a till that also sells online, or a shop bolted onto an existing website. Genuinely useful at that size; not where you want to be by the time delivery rules and multiple channels arrive.",
          },
          {
            k: "p",
            t: "**Adobe Commerce, and shops built from parts** sit at the other end: platforms for large retailers with development teams, or shops assembled from a separate checkout, product system and front end. Powerful, and priced accordingly in both money and attention. If your requirements genuinely point there, we will say so - and we will also say what it costs to keep, because that is the part that surprises people.",
          },
        ],
      },
      {
        h: "When we would suggest something other than Shopify",
        b: [
          {
            k: "p",
            t: "Three situations, honestly held:",
          },
          {
            k: "p",
            t: "**A system in your business already owns the numbers.** If your stock, orders or accounts live in a system that runs the rest of the business, the website should read from it rather than argue with it. That can mean keeping your current platform and connecting to it, rather than moving anything.",
          },
          {
            k: "p",
            t: "**You are deeply invested in WordPress.** If your team publishes constantly, your processes live in WordPress and someone already maintains it, WooCommerce keeps everything in one place - and we will build there.",
          },
          {
            k: "p",
            t: "**The shop is a small part of a bigger website.** Where the site is the point and the shop is a corner of it, a builder with a shop attached, or a small shop embedded in the site we build you, can be the proportionate answer.",
          },
          {
            k: "p",
            t: "What we will not do is recommend a platform because it is the one we know. Shopify is our default because familiarity makes us efficient on your behalf - the moment your requirements point elsewhere, the requirements win.",
          },
        ],
      },
      {
        h: "If you already have a shop",
        b: [
          {
            k: "p",
            t: "Moving a shop is a job with its own care: your customers, orders, reviews and the addresses search engines already know all have to come with you or be deliberately retired. Nothing about your current shop is a problem - it is the thing that proves the business works. When you scope a shop with us, one early question is simply whether you are selling already, and everything about a move flows from that conversation rather than from an assumption.",
          },
          {
            k: "p",
            t: "---",
          },
        ],
      },
    ],
  },
  {
    slug: "selling-online-options",
    topic: "Selling online",
    title:
      "The real question is what you are selling, not which software to pick",
    lead: "Selling online is not one thing. A shop, a paid download, a booking with a deposit, a subscription, a donation - each needs different machinery, and most need far less than a full shop. Name what you are selling, and the right machinery follows.",
    note: "Products, bookings, subscriptions, services. What you sell decides the software, not the other way round.",
    minutes: 15,
    sections: [
      {
        h: "",
        b: [
          {
            k: "p",
            t: "People arrive at this decision backwards. They have heard of a platform - usually Shopify - and ask whether they need it. The better first question is what the sale actually is, because the answer sorts most of the decision on its own. This page gives you the words, the options and where we would start for each, so you can come to any conversation - with us or anyone else - knowing what you are looking at.",
          },
        ],
      },
      {
        h: "The words, translated",
        b: [
          {
            k: "p",
            t: "Five terms cover almost everything you will hear. None of them needs to be mysterious.",
          },
          {
            k: "table",
            h: ["The term", "In plain words", "When it matters to you"],
            r: [
              [
                "Hosted shop platform",
                "The supplier runs the software, the security and the checkout; you rent it monthly. Shopify is the best-known example.",
                "You want a shop that is somebody's job to keep running - and that somebody is not you.",
              ],
              [
                "Self-hosted, or open source",
                "The shop software is free; the hosting, updates and security are yours to own or pay someone to own. WooCommerce, which runs on WordPress, is the big one.",
                "Your business already lives in WordPress and somebody already looks after it.",
              ],
              [
                "Payment page, or hosted checkout",
                "A page in your own website's design that takes a card payment for one thing - no catalogue, no basket, no stock.",
                "You are selling a handful of things, a service, or taking donations. Far smaller to build than a shop, and a shop can still be added later.",
              ],
              [
                "Merchant of record",
                "A service that sells on your behalf - it is legally the seller, and it handles card fees, global VAT and invoicing for you, for a cut. Common for software.",
                "You sell software or digital products internationally and would rather not become a VAT expert in nine countries.",
              ],
              [
                "Composable, or headless commerce",
                "The shop assembled from separate parts - checkout, product system, front end - each chosen and connected.",
                "Large retailers with development teams. If you are asking whether you need it, you almost certainly do not.",
              ],
            ],
          },
        ],
      },
      {
        h: "What are you selling?",
        b: [
          {
            k: "p",
            t: "Eight kinds of sale cover nearly every business we meet. Each row says what the sale actually needs, and where we would start.",
          },
          {
            k: "table",
            h: ["What you sell", "What the sale needs", "Where we would start"],
            r: [
              [
                "Physical goods, posted or delivered",
                "A catalogue, a basket, stock counts, delivery rules, VAT at the checkout",
                "A hosted shop platform - Shopify, unless your answers point elsewhere",
              ],
              [
                "Digital downloads - files, courses, patterns",
                "Payment, then a secure download link. Nothing runs out, so no stock",
                "A payment page for a handful of them; a shop with digital delivery once there is a catalogue",
              ],
              [
                "Software, or a product people subscribe to",
                "A pricing page and a sign-up. The product bills itself - the website is the shop window",
                "The website hands over to the product's own billing, or to a merchant of record. Never a shop",
              ],
              [
                "Services at a fixed price",
                "Payment, and a clear what-happens-next",
                "A payment page in the site's own design",
              ],
              [
                "Time - appointments, classes, tables",
                "A diary people book against, with payment or a deposit at booking",
                "A booking system, with the rules for cancelling settled before launch",
              ],
              [
                "Projects, quoted first",
                "A quote form that asks only what prices the work, then a proposal, then an invoice",
                "No online sale at all - a well-built enquiry journey, with a payment link for deposits",
              ],
              [
                "Memberships, and paid content",
                "Recurring payment, and a signed-in area holding what members get",
                "A payment page with recurring billing, plus a members' sign-in",
              ],
              [
                "Donations, and support",
                "One-off and monthly giving, a receipt, and Gift Aid where it applies",
                "A payment page. Never a shop",
              ],
            ],
          },
          {
            k: "p",
            t: "Two things run through that table. First, only one row needs a shop from day one. Second, none of the rows names a platform the visitor has to choose - what you sell decides, and the platform follows.",
          },
        ],
      },
      {
        h: "Ways of selling that change the picture",
        b: [
          {
            k: "p",
            t: "These are not things you sell - they are ways of selling that attach to the rows above and change what the build needs. Worth knowing by name, because each one is a real piece of work.",
          },
          {
            k: "table",
            h: ["The situation", "What it changes"],
            r: [
              [
                "Trade customers, buying on account",
                "Trade prices behind a sign-in, minimum quantities, invoicing terms. The largest single addition to a shop",
              ],
              [
                "Subscriptions and repeat orders",
                "Stored cards, retries when a payment fails, and a portal to pause or cancel. Bigger than it looks",
              ],
              [
                "Selling on marketplaces and social as well",
                "Either links out - cheap - or stock that agrees everywhere, which is not",
              ],
              [
                "Selling in person as well",
                "A till and a website sharing one stock list, so neither sells what the other just sold",
              ],
              [
                "Made to order, or personalised",
                "Options and custom text at the product; customers uploading artwork is the expensive version",
              ],
              [
                "Age-restricted or regulated goods",
                "Which payment services will take you at all - settled before building, not after",
              ],
              [
                "Selling abroad",
                "Currency and regions for goods; for digital things, foreign VAT arrives at the first sale, not at scale",
              ],
            ],
          },
        ],
      },
      {
        h: "The platform landscape, by role",
        b: [
          {
            k: "p",
            t: "You do not need to study this table. It exists so that when a name comes up - from us or anyone else - you can place it in thirty seconds.",
          },
          {
            k: "table",
            h: ["Role", "Names you will hear", "Best when", "Worth knowing"],
            r: [
              [
                "The mainstream hosted platform",
                "Shopify",
                "Most shops of most sizes - the most things working on day one, the fewest to look after",
                "Monthly fee plus a card percentage; app costs can quietly accumulate",
              ],
              [
                "Like-for-like rivals",
                "BigCommerce",
                "Heavily business-to-business shops",
                "Built-in trade features; plans step up with sales volume",
              ],
              [
                "The British platforms",
                "EKM, ShopWired, Bluepark",
                "You value UK phone support above a large app ecosystem",
                "Priced in pounds plus VAT; strong service reputations; smaller ecosystems",
              ],
              [
                "The WordPress route",
                "WooCommerce",
                "The business already lives in WordPress and somebody maintains it",
                "The software is free; the ownership is not",
              ],
              [
                "Site builders with shops",
                "Wix, Squarespace",
                "A dozen products where the website matters more than the shop",
                "The ceiling arrives quickly: delivery rules, integrations, moving your data out",
              ],
              [
                "The smallest tier",
                "Square Online, Ecwid",
                "A till that also sells online, or a small shop bolted onto an existing site",
                "Genuinely useful at that size; outgrown once channels multiply",
              ],
              [
                "The enterprise end",
                "Adobe Commerce, composable builds",
                "Large catalogues, development teams, unusual requirements",
                "Priced accordingly in money and attention - we will say so if your requirements point here",
              ],
              [
                "Payment pages",
                "Stripe-class checkouts",
                "Downloads, services, deposits, donations",
                "The whole payments-without-a-shop tier",
              ],
              [
                "Recurring by direct debit",
                "GoCardless-class services",
                "Memberships and invoicing on repeat",
                "Direct debit costs less than cards for recurring",
              ],
              [
                "Merchant of record",
                "Paddle, Lemon Squeezy",
                "Selling software internationally",
                "They become the seller and carry the global VAT burden",
              ],
              [
                "Donations",
                "Donorbox-class tools",
                "Charities and supporter giving",
                "Gift Aid capture and charity card rates are the details that matter",
              ],
            ],
          },
        ],
      },
      {
        h: "Our baseline, and why",
        b: [
          {
            k: "p",
            t: "Our default position is Shopify, and the first reason is honestly about us: we work in it continuously across our projects, so the time you pay for goes into your shop rather than into us learning a platform. The second reason is about the platform: for most shops of the size we build, it is the option where the most things work on day one and the fewest things need looking after afterwards.",
          },
          {
            k: "p",
            t: "A default is not a rule. Three situations move us off it, and we will say so in the proposal rather than bend your requirements to our habit: where a system in your business already owns the stock, the orders or the accounts, the website should read from it rather than argue with it - which can mean keeping what you have and connecting to it. Where your business already lives in WordPress with someone maintaining it, WooCommerce keeps everything in one place. And where the sale does not need a shop at all - most of the rows in the table above - a payment page, a booking system or a well-built enquiry journey is the proportionate answer, and costs a fraction of a shop.",
          },
          {
            k: "p",
            t: "That is why our scoping journey never asks you to pick a platform. It asks what you would be selling, roughly how many, whether you sell already and whether your product list is ready - and the right route follows from your answers. The platform decision is our work to justify, in writing, in the proposal: the system, who owns the account, what it costs monthly with VAT treatment stated, and how you would leave it if you ever wanted to.",
          },
        ],
      },
      {
        h: "Questions people ask us",
        b: [
          {
            k: "p",
            t: "**Do I need Shopify to sell online?** Only if you need a shop - a catalogue people browse, a basket and stock. A handful of downloads, a donation, a service paid for online or a booking with a deposit can each be done with a payment page or a booking system in your own website's design, at a fraction of the cost, and a full shop can still be added later.",
          },
          {
            k: "p",
            t: "**What is the difference between a shop and a payment page?** A shop holds a catalogue, a basket and stock counts, and needs delivery rules and VAT at the checkout. A payment page takes a card payment for one thing, in your own site's design, with a receipt - no catalogue, no basket, nothing to keep in stock.",
          },
          {
            k: "p",
            t: "**Can I sell online without rebuilding my website?** Usually, yes. A payment page or booking journey can be added to an existing site, and where a system in your business already holds your stock or orders, the website can read from it rather than replace it.",
          },
          {
            k: "p",
            t: "**We sell software - does any of this apply to us?** The shop part does not. Your product takes its own payments through its billing, or through a merchant of record that handles international VAT for you. Your website's job is the pricing page and the sign-up, and that is what we build.",
          },
          {
            k: "p",
            t: "**Which platform will you recommend for us?** The one your answers point at, named in writing in the proposal along with who owns the account, what it costs monthly with VAT treatment stated, and how you would leave it if you ever wanted to. Our default for a full shop is Shopify; the article on why explains the honest reason.",
          },
          {
            k: "p",
            t: "**Closing actions:** *Scope your shop in a few minutes* (the scoping journey) · *Ask us which route fits* (contact)",
          },
          {
            k: "p",
            t: "---",
          },
        ],
      },
    ],
  },
  {
    slug: "systems-behind-selling",
    topic: "Selling online",
    title:
      "Behind every sale online there are three systems - and one of them should be yours",
    lead: "Take any sale on any website - a parcel, a download, a gym membership, a donation - and behind it you will find the same three systems: one that moves the money, one that keeps the records, and the website itself. Most selling advice talks only about the website. The records are where businesses get quietly locked in.",
    note: "The shop window, the money and the record. Which of the three has to be yours, and why.",
    minutes: 6,
    sections: [
      {
        h: "The three systems, in plain words",
        b: [
          {
            k: "p",
            t: "**The money system** is a payment provider: it serves the card fields, holds the card details, runs recurring billing and retries. This is never your website's job and never ours - card details should not touch a small business's own systems, and in our builds they never do.",
          },
          {
            k: "p",
            t: "**The records system** is the one nobody mentions. Somebody has to own the authoritative list: who bought which download and how many times they have fetched it; who is a member, on which plan, paid up or lapsed; who donated, how often, and whether a Gift Aid declaration was captured. The money system knows payments happened; it does not know what they *mean* for your business. That meaning lives in the records system - and whoever runs it holds your business's memory.",
          },
          {
            k: "p",
            t: "**The website** is the part people see: the pages, the join journey, the member's sign-in area. It should read from the records system rather than try to be one.",
          },
        ],
      },
      {
        h: "What each kind of sale needs behind it",
        b: [
          {
            k: "table",
            h: [
              "What you sell",
              "The records behind it",
              "The common answer today",
              "Where we would start",
            ],
            r: [
              [
                "Physical goods - a full shop",
                "Catalogue, stock, orders, deliveries, returns",
                "Shopify, which handles all of it well",
                "Shopify - [our baseline, explained honestly](/advice/why-our-baseline-is-shopify/)",
              ],
              [
                "Digital downloads, tracked",
                "Who owns which file, download limits, secure re-download",
                "Scattered apps and plugins; the records rarely belong to you",
                "Speak to us about Omadeas",
              ],
              [
                "Memberships - gyms, clubs, paid content",
                "The member register: plan, status, what each tier gets, joins and lapses",
                "A patchwork of membership tools, each holding your register their way",
                "Speak to us about Omadeas",
              ],
              [
                "Donations, and friends-of schemes",
                "The supporter register, recurring gifts, Gift Aid declarations and claims",
                "Generic donation widgets; Gift Aid often handled on spreadsheets",
                "Speak to us about Omadeas",
              ],
              [
                "Services paid online",
                "A record of what was paid for, in your books or CRM",
                "A payment page plus your accounting package",
                "A payment page - and the record lands where you already work",
              ],
              [
                "Bookings that take payment",
                "The diary itself - availability is the record",
                "Established booking systems, a crowded and capable market",
                "A booking system connected to your site",
              ],
              [
                "Quoted projects",
                "Enquiry to proposal to invoice",
                "Your CRM and accounting package",
                "A well-built enquiry journey that writes into them",
              ],
              [
                "Software you make",
                "Your product's own billing holds everything",
                "Exactly as it should be",
                "Your website does the shop window; we leave your billing alone",
              ],
            ],
          },
          {
            k: "p",
            t: "Read down the last column and the pattern shows itself: where a strong ready-made system exists, we say so and connect to it. The rows that say *speak to us about Omadeas* are the ones where the ready-made market is weakest - and where the records matter most.",
          },
        ],
      },
      {
        h: "What Omadeas is",
        b: [
          {
            k: "p",
            t: "Omadeas is the business platform we build and run ourselves. It is a set of connected systems for the records a business has to own - members and what their membership entitles them to, buyers and what they can download, supporters and their Gift Aid position, and the accounts behind all of it.",
          },
          {
            k: "p",
            t: "Where your website needs one of those record systems, we can connect the site to Omadeas rather than adding another subscription that holds your records its own way. The website stays fast and simple; the records live in a system built around them; and the division of labour stays clean - the payment provider still moves the money and holds the card details, Omadeas holds the records, and your website reads from both.",
          },
          {
            k: "p",
            t: "Two things we will always say plainly. Where a ready-made platform is the better answer - a full shop on Shopify being the clearest case - we will recommend it, because [our reasons for that baseline are honest ones](/advice/why-our-baseline-is-shopify/). And whatever holds your records, the proposal names it in writing: the system, who owns the account, what it costs monthly with VAT treatment stated, and how you would leave with your records if you ever wanted to. Records you cannot take with you were never really yours.",
          },
        ],
      },
      {
        h: "Questions people ask us",
        b: [
          {
            k: "p",
            t: "**Who holds the card details?** The payment provider, always - never your website, never us, never Omadeas. The card fields your customers type into are served by the provider, so you sit in the lightest compliance category there is.",
          },
          {
            k: "p",
            t: "**What happens to our records if we stop working with you?** You take them. Exit is written into the proposal from day one: what you would export, in what form, and what any replacement provider would need. This applies to Omadeas exactly as it applies to Shopify or anything else.",
          },
          {
            k: "p",
            t: "**Can the website track how many times someone downloads what they bought?** Yes - that is a records question. Each purchase creates an entitlement, each download is delivered by a secure expiring link and logged against it, and buyers get a sign-in area to fetch their files again without emailing you.",
          },
          {
            k: "p",
            t: "**We run a gym - can members sign in and see their membership?** Yes. The payment provider runs the billing; the member register holds who is on which plan and what it entitles them to; and the sign-in area on your site reads from that register. When a payment fails, the register updates and access follows - automatically, with a named person told.",
          },
          {
            k: "p",
            t: "**Is this instead of Shopify?** No - different jobs. A shop full of physical products belongs on a shop platform, and [ours is Shopify by default](/advice/why-our-baseline-is-shopify/). Omadeas enters where the sale is really a record - memberships, tracked downloads, supporters - and the guide to [which kind of sale is which](/advice/selling-online-your-options/) is the place to start.",
          },
          {
            k: "p",
            t: "**Closing actions:** *See which kind of sale yours is* (/advice/selling-online-your-options/) · *Speak to us about Omadeas* (/contact/)",
          },
          {
            k: "p",
            t: "---",
          },
        ],
      },
    ],
  },
];

/**
 * A picture each, so four heads are not one head four times.
 *
 * Held here rather than in a view, because the index shows the same picture for
 * the same article and two lists of these would drift apart the first time one
 * of them was edited.
 */
const PLATES: Record<string, string> = {
  "how-your-website-is-made": "/work-investor.png",
  "why-shopify": "/work-shop.png",
  "selling-online-options": "/work-trade.png",
  "systems-behind-selling": "/work-careers.png",
};

export const plateFor = (slug: string) => PLATES[slug] ?? "/right-image.png";

export const articleBy = (slug: string) =>
  ARTICLES.find((article) => article.slug === slug) ?? null;

/** The topics, in the order they first appear. */
export const TOPICS: readonly string[] = [
  ...new Set(ARTICLES.map((article) => article.topic)),
];
