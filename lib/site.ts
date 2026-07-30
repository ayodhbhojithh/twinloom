/* ---------------------------------------------------------------------------
   The site, as data.

   Routes are the draft's own, taken from the `.url` line each screen carries.
   Nav labels are its own too. Nothing here is invented: if a link exists in
   Docs/new-ui/TCT_Website_Draft_v3 1.html it is here, and if it does not, it is
   not.

   Kept as data rather than markup so the header, the footer and any breadcrumb
   are reading one list. A nav item that exists in two places is a nav item that
   will eventually say two different things.
--------------------------------------------------------------------------- */

export const SITE = {
  /** The trading name, and the whole public identity. */
  name: "Very Good Website Company",
  /** Short form, for tight spaces. */
  short: "VGWC",
  tagline: "Websites, online shops and your digital presence.",
  description:
    "We design, build and look after websites for businesses and organisations.",
} as const;

export const ROUTES = {
  home: "/",
  services: "/products-and-services",
  seo: "/products-and-services/search-and-ai-visibility",
  care: "/products-and-services/website-care",
  custom: "/products-and-services/custom-software",

  how: "/how-we-work",
  howWeBuild: "/how-we-work/how-we-build",
  inWriting: "/how-we-work/what-you-receive-in-writing",
  roles: "/how-we-work/roles-and-responsibilities",
  pricing: "/pricing",

  start: "/start",
  freeflow: "/start/freeflow",
  guided: "/start/guided",
  /* The draft calls this `/start/guided/[step]/`. One concrete step stands for
     the set until the journey is built. */
  guidedStep: "/start/guided/1",
  summary: "/start/summary",
  plan: "/start/plan",
  sent: "/start/sent",
  resume: "/resume",
  expired: "/start/expired",
  fileRejected: "/start/freeflow/file-not-accepted",

  /* A drafting screen, not a page on the website: the emails we send. It still
     needs somewhere to be read. */
  emails: "/emails",

  signIn: "/account/sign-in",
  account: "/account",
  accountBrief: "/account/brief",

  work: "/our-work",
  caseStudy: "/our-work/case-study",
  ourResults: "/our-work/our-own-website-results",

  advice: "/advice",
  blogWhere: "/advice/where-should-your-blog-live",
  afterLaunch: "/advice/what-happens-after-launch",
  aiVisibility: "/advice/ai-visibility",
  faq: "/frequently-asked-questions",

  about: "/about",
  contact: "/contact",
  book: "/contact/book",

  privacy: "/privacy",
  cookies: "/cookies",
  subProcessors: "/sub-processors",
  terms: "/terms",
  termsOfBusiness: "/terms-of-business",
  accessibility: "/accessibility",
  complaints: "/complaints",

  search: "/search",
  thankYou: "/thank-you",
  unsubscribe: "/unsubscribe",
  maintenance: "/maintenance",
  notFound: "/404",
  serverError: "/500",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

/**
 * The header's seven, in the draft's order.
 *
 * Short labels, because the header has to hold the name, seven links, a search
 * field and a call to action on one line that never wraps. "Our products and
 * services" is 175px of a 1100px bar on its own; "Services" says the same thing in
 * a third of it. The rail and the footer keep the full wording, so the long form
 * is never lost, only moved to where there is room for it.
 */
export const HEADER_NAV: readonly NavLink[] = [
  { label: "Services", href: ROUTES.services },
  { label: "How we work", href: ROUTES.how },
  { label: "Pricing", href: ROUTES.pricing },
  { label: "Our work", href: ROUTES.work },
  { label: "Advice", href: ROUTES.advice },
  { label: "FAQ", href: ROUTES.faq },
  { label: "About", href: ROUTES.about },
];

/** The one call to action in the chrome. */
export const HEADER_CTA: NavLink = {
  label: "Start your project",
  href: ROUTES.start,
};

export const FOOTER_COLUMNS: readonly {
  title: string;
  links: readonly NavLink[];
}[] = [
  {
    title: "Our products and services",
    links: [
      { label: "Our products and services", href: ROUTES.services },
      { label: "Search and AI visibility", href: ROUTES.seo },
      { label: "Website care and ongoing services", href: ROUTES.care },
      { label: "Custom software", href: ROUTES.custom },
    ],
  },
  {
    title: "How we work",
    links: [
      { label: "How a project runs", href: ROUTES.how },
      { label: "How we build", href: ROUTES.howWeBuild },
      { label: "What you receive in writing", href: ROUTES.inWriting },
      { label: "Roles and responsibilities", href: ROUTES.roles },
      { label: "Pricing", href: ROUTES.pricing },
    ],
  },
  {
    title: "Working with us",
    links: [
      { label: "Start your project", href: ROUTES.start },
      { label: "Our work", href: ROUTES.work },
      { label: "About us", href: ROUTES.about },
      { label: "Contact us", href: ROUTES.contact },
      { label: "Sign in", href: ROUTES.signIn },
    ],
  },
  {
    title: "Advice and articles",
    links: [
      { label: "Advice and articles", href: ROUTES.advice },
      { label: "Where should your blog live?", href: ROUTES.blogWhere },
      { label: "What happens after launch", href: ROUTES.afterLaunch },
      {
        label: "AI visibility: what can actually be done",
        href: ROUTES.aiVisibility,
      },
      { label: "Frequently asked questions", href: ROUTES.faq },
    ],
  },
];

/**
 * The legal links, kept out of the column grid.
 *
 * Seven of them in a fifth column left an orphan row with four columns of empty
 * space beside it. They are short, they are a set, and every site puts them along
 * the bottom, so they run as one line above the company statement instead.
 */
export const FOOTER_LEGAL: readonly NavLink[] = [
  { label: "Privacy", href: ROUTES.privacy },
  { label: "Cookies", href: ROUTES.cookies },
  { label: "Sub-processors", href: ROUTES.subProcessors },
  { label: "Terms of use", href: ROUTES.terms },
  { label: "Terms of business", href: ROUTES.termsOfBusiness },
  { label: "Accessibility statement", href: ROUTES.accessibility },
  { label: "Complaints", href: ROUTES.complaints },
];

/**
 * The legal line, verbatim from the draft including its placeholders.
 *
 * The square brackets are the draft's own and are left in deliberately. A made up
 * company number is worse than a visible gap, and a visible gap is the thing that
 * gets filled before launch.
 */
export const LEGAL = {
  entity: "TwinCoreTech Ltd",
  line: "Very Good Website Company is a trading name of TwinCoreTech Ltd, a company registered in England and Wales under company number [company number]. Registered office: [registered office]. [VAT registration wording.]",
  rights: "All rights reserved.",
} as const;

/* ---------------------------------------------------------------------------
   The rail.

   Every screen in the draft, grouped and indented exactly as its own left rail
   groups and indents them. Three levels: a section, its pages, and the one page
   that sits under a page. `sub` is the draft's `.sgrp`, a label inside a group
   that is not itself a link.

   This is the site's real navigation, so the header, the footer and the mobile
   menu all read from it rather than keeping lists of their own.
--------------------------------------------------------------------------- */

export interface RailItem extends NavLink {
  /** 1 is a section's own page, 2 a page under it, 3 a page under that. */
  level?: 2 | 3;
  /** A label above this item, for a run of screens that need explaining. */
  sub?: string;
}

export interface RailGroup {
  title: string;
  /** Marks the group the site most wants people in. */
  highlight?: boolean;
  items: readonly RailItem[];
}

export const RAIL_GROUPS: readonly RailGroup[] = [
  {
    title: "Home",
    items: [{ label: "Home", href: ROUTES.home }],
  },
  {
    title: "Our products and services",
    items: [
      { label: "Our products and services", href: ROUTES.services },
      { label: "Search and AI visibility", href: ROUTES.seo, level: 2 },
      {
        label: "Website care and ongoing services",
        href: ROUTES.care,
        level: 2,
      },
      { label: "Custom software", href: ROUTES.custom, level: 2 },
    ],
  },
  {
    title: "How we work",
    items: [
      { label: "How a project runs", href: ROUTES.how },
      { label: "How we build", href: ROUTES.howWeBuild, level: 2 },
      {
        label: "What you receive in writing",
        href: ROUTES.inWriting,
        level: 2,
      },
      {
        label: "Roles and responsibilities",
        href: ROUTES.roles,
        level: 2,
      },
      { label: "Pricing", href: ROUTES.pricing },
    ],
  },
  {
    title: "Start your project",
    highlight: true,
    items: [
      { label: "Start your project", href: ROUTES.start },
      {
        label: "Route 1, send us a specification",
        href: ROUTES.freeflow,
        level: 2,
      },
      {
        label: "Route 2, build the brief with us",
        href: ROUTES.guided,
        level: 2,
      },
      { label: "Inside the guided brief", href: ROUTES.guidedStep, level: 3 },
      { label: "What we understood", href: ROUTES.summary, level: 2 },
      { label: "Your initial plan", href: ROUTES.plan, level: 2 },
      { label: "Sent", href: ROUTES.sent, level: 2 },
      {
        label: "The emails we send",
        href: ROUTES.emails,
        sub: "Not pages, drafting screens",
      },
      { label: "Your briefs", href: ROUTES.account },
      { label: "Sign in", href: ROUTES.signIn, level: 2 },
      { label: "A single brief", href: ROUTES.accountBrief, level: 2 },
    ],
  },
  {
    title: "Our work",
    items: [
      { label: "Our work", href: ROUTES.work },
      { label: "A case study", href: ROUTES.caseStudy, level: 2 },
      {
        label: "Our own website results",
        href: ROUTES.ourResults,
        level: 2,
      },
    ],
  },
  {
    title: "Advice and articles",
    items: [
      { label: "Advice and articles", href: ROUTES.advice },
      {
        label: "Where should your blog live?",
        href: ROUTES.blogWhere,
        level: 2,
      },
      {
        label: "What happens after launch",
        href: ROUTES.afterLaunch,
        level: 2,
      },
      {
        label: "AI visibility: what can actually be done",
        href: ROUTES.aiVisibility,
        level: 2,
      },
    ],
  },
  {
    title: "Frequently asked questions",
    items: [{ label: "Frequently asked questions", href: ROUTES.faq }],
  },
  {
    title: "About",
    items: [
      { label: "About us", href: ROUTES.about },
      { label: "Contact us", href: ROUTES.contact },
      { label: "Booking a meeting", href: ROUTES.book, level: 2 },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: ROUTES.privacy },
      { label: "Cookies", href: ROUTES.cookies },
      { label: "Sub-processors", href: ROUTES.subProcessors },
      { label: "Terms of use", href: ROUTES.terms },
      { label: "Terms of business", href: ROUTES.termsOfBusiness },
      { label: "Accessibility statement", href: ROUTES.accessibility },
      { label: "Complaints", href: ROUTES.complaints },
    ],
  },
  {
    title: "Returning, errors and utilities",
    items: [
      { label: "Resume a brief", href: ROUTES.resume },
      { label: "Link expired", href: ROUTES.expired },
      { label: "File not accepted", href: ROUTES.fileRejected },
      { label: "404", href: ROUTES.notFound },
      { label: "500", href: ROUTES.serverError },
      { label: "Search", href: ROUTES.search },
      { label: "Thank you", href: ROUTES.thankYou },
      { label: "Unsubscribe", href: ROUTES.unsubscribe },
      { label: "Maintenance", href: ROUTES.maintenance },
    ],
  },
];

/**
 * The rail, flattened into reading order.
 *
 * The rail is the site's table of contents, so the order it puts its pages in is
 * the order they are meant to be read in. Flattening it gives every page a
 * previous and a next for free, and keeps that sequence tied to the one list
 * rather than to a second one somebody has to remember to update.
 */
export const FLAT_PAGES: readonly (NavLink & { group: string })[] =
  RAIL_GROUPS.flatMap((group) =>
    group.items.map((item) => ({
      label: item.label,
      href: item.href,
      group: group.title,
    })),
  );

/** What comes before and after a page, for the pagination at its foot. */
export function siblingPages(pathname: string) {
  const at = FLAT_PAGES.findIndex((page) => page.href === pathname);
  if (at === -1) return { previous: null, next: null };

  return {
    previous: at > 0 ? FLAT_PAGES[at - 1] : null,
    next: at < FLAT_PAGES.length - 1 ? FLAT_PAGES[at + 1] : null,
  };
}
