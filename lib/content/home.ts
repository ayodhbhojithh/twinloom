/**
 * Home page copy, block by block, in the order set out in TCT_Sitemap.md §1.
 *
 * Wording is taken from twincoretech_site.html (the canonical one-file site) and
 * 1_landing_1.html (the design pass), with em dashes and en dashes rewritten.
 *
 * Figures, quotes and case studies all come from the artifacts, which are the
 * client's own drafts. Confirm or replace them before launch: there is no
 * placeholder wording on the page to signal that they are unconfirmed.
 */

export const HERO = {
  eyebrow: "Websites for growing UK businesses",
  /**
   * Split so the closing phrase can carry the brand gradient. 2a puts the
   * gradient on exactly one span per screen, and this is that span.
   */
  headline: {
    lead: "A website that helps people find you, trust you, and ",
    accent: "get in touch.",
  },
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
  heading: "What we can do for you",
  lead: "Whatever stage you're at, pick the bits you need.",
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

export const HOW_WE_WORK = {
  heading: "How we work, five simple steps",
  lead: "Milestone based, with a quick update every week, so you always know where it is up to.",
  steps: [
    {
      name: "Discover",
      body: "A conversation, and a simple plan built together.",
    },
    {
      name: "Design",
      body: "Strategy, storyboard, your brand, the look and feel.",
    },
    { name: "Build", body: "In milestones, with a quick update every week." },
    { name: "Launch", body: "Tested, handed over, with a walkthrough." },
    { name: "Care", body: "We keep it running and improving after launch." },
  ],
  reassurances: [
    "You decide how involved you want to be.",
    "We can set up every account for you: domain, hosting, shop, analytics.",
  ],
} as const;

export const FEATURED_WORK = {
  heading: "Featured work",
  lead: "A few recent builds, and what changed for the business afterwards.",
  items: [
    {
      sector: "Hospitality",
      client: "Bella's Café",
      body: "Mobile-first redesign and table booking.",
      result: "Enquiries up",
    },
    {
      sector: "Retail",
      client: "Nord Home Goods",
      body: "New Shopify-backed store, 200+ products.",
      result: "Selling online",
    },
    {
      sector: "Professional",
      client: "Sterling Consulting",
      body: "Lead generation upgrade and a self-managed blog.",
      result: "More enquiries",
    },
  ],
} as const;

export const WHO_IS_BEHIND = {
  heading: "Who's behind it",
  lead: "TwinCoreTech is a UK studio focused on small and growing businesses. We make sites that help people find you, trust you and get in touch, and we look after them afterwards.",
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

export const CARE_TEASER = {
  heading: "We keep it running, and improving",
  lead: "Proactive care, not break-fix. Hosting, security and backups as standard, plus ongoing improvements so your site keeps working for you.",
  plans: [
    {
      name: "Care Lite",
      price: 39,
      body: "Hosting, SSL, security, backups, uptime monitoring and small fixes.",
    },
    {
      name: "Care Plus",
      price: 99,
      body: "Everything in Lite, plus content updates, a monthly report and minor improvements.",
      featured: true,
    },
    {
      name: "Care Pro",
      price: 249,
      body: "Everything in Plus, plus an SEO and CRO retainer, priority support and a growth roadmap.",
    },
  ],
  responseTimes:
    "Urgent, site down: same day. Standard changes: 2 to 3 working days. Care Pro: priority queue.",
  note: "Prices illustrative, to be confirmed. You own the site and every account, and you can cancel any time.",
} as const;

export const FINAL_CTA = {
  heading: "Ready when you are.",
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
