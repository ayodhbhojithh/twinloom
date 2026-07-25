/**
 * Home page copy, block by block, in the order set out in TCT_Sitemap.md §1.
 *
 * Wording is taken from twincoretech_site.html (the canonical one-file site) and
 * 1_landing_1.html (the design pass), with em dashes and en dashes rewritten.
 *
 * Every section carries an `accent` word and a line of `micro` copy. That pairing
 * is the signature of turn 2a, The Portal Grid: a bold heading with one word in a
 * different colour, and a quiet mono aside sitting on the same baseline. The
 * accent colour rotates section to section so the page has a pulse without ever
 * needing a coloured background.
 *
 * Figures, quotes and case studies all come from the artifacts, which are the
 * client's own drafts. Confirm or replace them before launch: there is no
 * placeholder wording on the page to signal that they are unconfirmed.
 */

export const HERO = {
  eyebrow: "Websites for growing UK businesses",
  /**
   * Written as lines, not one string. Where the headline breaks is a design
   * decision, and `text-balance` kept choosing a different one. Each line
   * renders as its own block, so it breaks exactly where it is written here.
   *
   * `accent` carries the brand gradient. 2a puts that on one span per screen.
   */
  headline: [
    { text: "A website that helps people find you," },
    { text: "trust you, and ", accent: "get in touch." },
  ],
  sub: "We build, refresh and look after your website and everything around it, so you can get on with running your business.",
  /** The handwritten aside, in the studio's own voice. */
  aside: "this is where your website gets a price, in about ninety seconds...",
  /** The hero says the whole thing; the nav's button says the short version. */
  ctaLabel: "Scope your website, a few simple steps",
} as const;

export const PROOF = {
  stats: [
    { value: "40+", label: "Sites launched" },
    { value: "4.9", label: "Average rating" },
    { value: "12 yrs", label: "Experience" },
    { value: "UK", label: "SME focused" },
  ],
  quote: "They rebuilt our site in three weeks and enquiries doubled.",
  attribution: "A happy client",
} as const;

export interface OutcomeItem {
  icon:
    | "Rocket"
    | "RefreshCw"
    | "Search"
    | "ShoppingBag"
    | "PenLine"
    | "CalendarCheck"
    | "ShieldCheck";
  title: string;
  body: string;
}

export const OUTCOMES = {
  heading: "What we can",
  accent: "do for you",
  micro: "pick the bits you need",
  lead: "Whatever stage you're at, start with the outcome rather than the technology.",
  items: [
    {
      icon: "Rocket",
      title: "A brand-new website",
      body: "Starting from nothing. We scope it, build it, and get you live on your own domain.",
    },
    {
      icon: "RefreshCw",
      title: "A redesign or upgrade",
      body: "A fresh look for a site that has aged: clear, modern and easy for customers to use.",
    },
    {
      icon: "Search",
      title: "Being found",
      body: "Show up on Google, get found locally, and give visitors a reason to stay and explore. SEO and AI visibility.",
    },
    {
      icon: "ShoppingBag",
      title: "Selling online",
      body: "A shop that fits what you actually sell, from a handful of products to a few hundred.",
    },
    {
      icon: "PenLine",
      title: "A blog you run yourself",
      body: "Publish without asking anyone. It is also how you keep earning search traffic.",
    },
    {
      icon: "CalendarCheck",
      title: "Bookings and payments",
      body: "Take an appointment or a payment on the site, with confirmations that go out on their own.",
    },
    {
      icon: "ShieldCheck",
      title: "Someone to keep it running",
      body: "Hosting, updates, fresh content and support. We can look after the lot so you do not have to.",
    },
  ] satisfies readonly OutcomeItem[],
} as const;

/** The mono tag and tile colour for each step of the process ledger. */
export interface WorkStep {
  name: string;
  body: string;
  tag: string;
  tone: "pink" | "violet" | "blue" | "emerald" | "amber";
}

export const HOW_WE_WORK = {
  heading: "From hello",
  accent: "to launch",
  micro: "five steps · no surprises",
  steps: [
    {
      name: "Discover",
      body: "a conversation, then a simple plan built together",
      tag: "SCOPE",
      tone: "pink",
    },
    {
      name: "Design",
      body: "every screen signed off before we build a thing",
      tag: "DESIGN",
      tone: "violet",
    },
    {
      name: "Build",
      body: "in milestones, with a quick update every week",
      tag: "BUILD",
      tone: "blue",
    },
    {
      name: "Launch",
      body: "tested, handed over, with a walkthrough",
      tag: "SHIP",
      tone: "emerald",
    },
    {
      name: "Care",
      body: "we keep it running and improving after launch",
      tag: "CARE",
      tone: "amber",
    },
  ] satisfies readonly WorkStep[],
  reassurances: [
    "You decide how involved you want to be.",
    "We can set up every account for you: domain, hosting, shop, analytics.",
  ],
} as const;

/**
 * Case cards.
 *
 * `preview` picks one of three abstract wireframes rather than a screenshot. 2a
 * makes the same call: a suggestion of a layout reads as work without claiming to
 * be a photograph of it, and it never goes stale or renders badly at card size.
 */
export interface WorkItem {
  client: string;
  sector: string;
  body: string;
  result: string;
  preview: "shop" | "booking" | "dashboard";
  tone: "emerald" | "blue" | "violet";
}

export const FEATURED_WORK = {
  heading: "Things we've",
  accent: "shipped",
  micro: "3 of 40+ · results measured, not vibes",
  items: [
    {
      client: "Bella's Café",
      sector: "hospitality site + table booking",
      body: "Mobile-first redesign and table booking.",
      result: "ENQUIRIES UP",
      preview: "booking",
      tone: "blue",
    },
    {
      client: "Nord Home Goods",
      sector: "retail e-commerce",
      body: "New Shopify-backed store, 200+ products.",
      result: "SELLING ONLINE",
      preview: "shop",
      tone: "emerald",
    },
    {
      client: "Sterling Consulting",
      sector: "professional site + blog",
      body: "Lead generation upgrade and a self-managed blog.",
      result: "MORE ENQUIRIES",
      preview: "dashboard",
      tone: "violet",
    },
  ] satisfies readonly WorkItem[],
} as const;

export const WHO_IS_BEHIND = {
  heading: "Who's",
  accent: "behind it",
  micro: "a UK studio, SME focused",
  lead: "We make sites that help people find you, trust you and get in touch, and we look after them afterwards.",
  story:
    "We started because too many SMEs were sold expensive sites that did not bring in work. We do the opposite: scope honestly, build to a clear plan, and price it plainly.",
  beliefs: [
    "You own everything: the site, the domain, every account. No lock-in.",
    "Plain English over jargon. You always know what you are getting and what it costs.",
    "Proof over promises. We show results, not buzzwords.",
  ],
  techNote: {
    summary: "The technical bit, if you want it",
    body: "SEO and AI visibility, brand design and social media are delivered with named partners, and you talk to them directly rather than through us. Everything is built on your own accounts, so nothing is locked to our studio.",
  },
} as const;

/**
 * Care plans.
 *
 * `body` is the one-line descriptor under the price and `points` are the dotted
 * bullets, each with its own colour. Splitting them that way is what lets the
 * card be read in two seconds or in ten, depending on how much the visitor cares.
 *
 * Contents per plan follow TCT_Sitemap.md §7.
 */
export interface CarePlan {
  name: string;
  price: number;
  body: string;
  points: readonly { label: string; tone: string }[];
  featured?: boolean;
}

export const CARE_TEASER = {
  heading: "We keep it running,",
  accent: "and improving",
  micro: "proactive care · not break-fix",
  plans: [
    {
      name: "Care Lite",
      price: 39,
      body: "The essentials, always on",
      points: [
        { label: "Hosting, SSL and security", tone: "emerald" },
        { label: "Backups and uptime monitoring", tone: "blue" },
        { label: "Small fixes included", tone: "teal" },
      ],
    },
    {
      name: "Care Plus",
      price: 99,
      body: "Care, plus a bit of momentum",
      points: [
        { label: "Everything in Lite", tone: "violet" },
        { label: "Content updates when you need them", tone: "blue" },
        { label: "A monthly report and minor improvements", tone: "teal" },
      ],
      featured: true,
    },
    {
      name: "Care Pro",
      price: 249,
      body: "Growth, actively worked on",
      points: [
        { label: "Everything in Plus", tone: "amber" },
        { label: "SEO and CRO retainer", tone: "pink" },
        { label: "Priority support and a growth roadmap", tone: "violet" },
      ],
    },
  ] satisfies readonly CarePlan[],
  responseTimes:
    "Urgent, site down: same day. Standard changes: 2 to 3 working days. Care Pro: priority queue.",
  note: "Prices illustrative, to be confirmed. You own the site and every account, and you can cancel any time.",
} as const;

/**
 * The questions that come up on every enquiry, answered before they are asked.
 *
 * Wording is the one-file site's own FAQ, which TCT_Sitemap.md §12 groups under
 * process, ownership, hosting, data and payment. Six here, one per group, with
 * the rest living on the FAQ page.
 */
export const FAQ = {
  heading: "Fair",
  accent: "questions",
  micro: "the ones everyone asks",
  items: [
    {
      question: "How long does a website take?",
      answer:
        "Most SME sites launch in 2 to 6 weeks depending on scope. You get a date with your quote, and a live preview link from week one.",
    },
    {
      question: "Do I own the website?",
      answer:
        "Yes. The site, the domain and every account, from day one, care plan or not. No lock-in.",
    },
    {
      question: "Is the estimate binding?",
      answer:
        "It is a guide. After a quick call we confirm a fixed quote in writing, and that one does not move.",
    },
    {
      question: "Do you host it?",
      answer:
        "We can. Hosting, security and backups come with every care plan. Or we hand it to your host and walk them through it.",
    },
    {
      question: "How do payments work?",
      answer:
        "A deposit to start, the balance at launch, and the care plan monthly. Bigger builds can be spread out, just ask.",
    },
    {
      question: "What about my data?",
      answer:
        "Draft scoping submissions are kept for three days and covered by our privacy policy. Please do not upload personal data in the panel.",
    },
  ],
} as const;

export const FINAL_CTA = {
  /** The handwritten nudge above the closing headline, straight from 2a. */
  aside: "go on then,",
  heading: "Let's price",
  accent: "yours.",
  lead: "Three ways to start, whatever suits you.",
  doors: [
    {
      number: "1",
      title: "Just say hello",
      body: "Prefer to talk first? Email us and we are happy to chat it through. No journey required.",
      action: "Email us",
    },
    {
      number: "2",
      title: "Take the guided journey",
      body: "Not sure exactly what you need? Work through our short scoping journey. By the end you will have a clear picture of your website. So will we.",
      action: "Start the journey",
      badge: "Our favourite",
      featured: true,
    },
    {
      number: "3",
      title: "Just send us your thoughts",
      body: "In a hurry, or already know roughly what you want? Send us notes, documents, links and colours. Rough notes are fine.",
      action: "Send your thoughts",
    },
  ],
  next: {
    title: "What happens next",
    body: "We will get back to you as soon as we can. The first step is usually a quick 15 to 30 minute call, to check we have understood you and map out next steps.",
    closing:
      "The more we understand about your business, the better the website we will build you. We only use your details to prepare your plan and follow up.",
  },
} as const;
