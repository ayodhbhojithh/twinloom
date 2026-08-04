/* ---------------------------------------------------------------------------
   The site, as data.

   Taken from Docs/new-ui/vgwc-website-framework-v4_2026-08-01.html, which
   replaced draft v3. It is a much shorter site: one way in rather than a
   catalogue, no pricing page, no separate services pages, and most screens
   deliberately empty with a note about what belongs on them.

   Kept as data rather than markup so the header, the rail and the footer read one
   list. A nav item that exists in two places is a nav item that will eventually
   say two different things.
--------------------------------------------------------------------------- */

export const SITE = {
  name: "TwinLoom",
  /** For the header, where a longer name crowds everything beside it. */
  short: "TwinLoom",
  tagline: "Tell us who your website is for. We write the rest down for you.",
  description:
    "You answer one question. We send back a written scope in your own words, within two working days. It costs nothing and commits you to nothing.",
  /** The rail's own footnote, and an honest description of where this is. */
  status:
    "A framework, not a website. Every screen here is a place for something, and only the visitor page has anything in it yet.",
} as const;

export const ROUTES = {
  home: "/",
  /* The other home pages, kept beside the landing one so they can be compared. */
  homeV1: "/home-v1",
  homeV2: "/home-v2",
  homeV3: "/home-v3",
  homeV4: "/home-v4",
  homeV5: "/home-v5",
  homeV6: "/home-v6",
  build: "/build",
  site: "/your-site",

  about: "/about",
  partners: "/partners",
  contact: "/contact",
  book: "/book",
  faq: "/faqs",
  blog: "/blog",

  privacy: "/privacy",
  cookies: "/cookies",
  terms: "/terms",
  termsOfBusiness: "/terms-of-business",
  accessibility: "/accessibility",
  complaints: "/complaints",
  subProcessors: "/sub-processors",

  search: "/search",
  notFound: "/404",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

/**
 * The header's links.
 *
 * Five, because v4 took pricing and the services pages off the nav entirely. The
 * build page is the single way in and it is the call to action, so it is not
 * repeated here.
 */
export const HEADER_NAV: readonly NavLink[] = [
  { label: "About", href: ROUTES.about },
  { label: "Partners", href: ROUTES.partners },
  { label: "FAQs", href: ROUTES.faq },
  { label: "Articles", href: ROUTES.blog },
  { label: "Contact", href: ROUTES.contact },
];

/** The one call to action in the chrome, and the site's only way in. */
export const HEADER_CTA: NavLink = {
  label: "Build your website",
  href: ROUTES.build,
};

/**
 * One page in the rail, and anything that sits under it.
 *
 * Pages and sub pages, and no third level. Two is as deep as this site goes and
 * as deep as a left rail should: a nav that needs three indents to reach a page
 * is a nav telling you the site is organised for whoever built it.
 */
export interface RailPage extends NavLink {
  children?: readonly NavLink[];
}

/**
 * The pages the rail carries, in reading order.
 *
 * Flat, with no headings over it. Named groups made the rail look like four
 * small navigations stacked up, and each one needed a control to open and shut
 * it before any page could be read. A handful of links do not need chapters;
 * they need to be short, in a sensible order, and always visible.
 *
 * The legal pages are deliberately not here. They are a set, they belong to the
 * footer, and seven of them at the foot of the rail buried the pages a reader
 * actually came for.
 *
 * The order is the order the site is meant to be read in, which is also what
 * gives every page its previous and next.
 */
export const RAIL_PAGES: readonly RailPage[] = [
  {
    label: "Home",
    href: ROUTES.home,
    children: [
      { label: "Home v1", href: ROUTES.homeV1 },
      { label: "Home v2", href: ROUTES.homeV2 },
      { label: "Home v3", href: ROUTES.homeV3 },
      { label: "Home v4", href: ROUTES.homeV4 },
      { label: "Home v5", href: ROUTES.homeV5 },
      { label: "Home v6", href: ROUTES.homeV6 },
    ],
  },
  { label: "Build your website", href: ROUTES.build },
  { label: "About us", href: ROUTES.about },
  { label: "Our partners", href: ROUTES.partners },
  {
    label: "Contact us",
    href: ROUTES.contact,
    children: [{ label: "Book a meeting", href: ROUTES.book }],
  },
  { label: "FAQs", href: ROUTES.faq },
  { label: "Blogs and articles", href: ROUTES.blog },
];

export const FOOTER_COLUMNS: readonly {
  title: string;
  links: readonly NavLink[];
}[] = [
  {
    title: "Start here",
    links: [
      { label: "Build your website", href: ROUTES.build },
      { label: "The site your answers describe", href: ROUTES.site },
      { label: "Book a meeting", href: ROUTES.book },
    ],
  },
  {
    title: "About us",
    links: [
      { label: "About us", href: ROUTES.about },
      { label: "Our partners", href: ROUTES.partners },
      { label: "Contact us", href: ROUTES.contact },
    ],
  },
  {
    title: "Reading",
    links: [
      { label: "FAQs", href: ROUTES.faq },
      { label: "Blogs and articles", href: ROUTES.blog },
    ],
  },
];

/**
 * The legal links, kept out of the column grid.
 *
 * Seven of them in a fourth column left an orphan row. They are short, they are a
 * set, and every site puts them along the bottom, so they run as one line above
 * the company statement instead.
 */
export const FOOTER_LEGAL: readonly NavLink[] = [
  { label: "Privacy", href: ROUTES.privacy },
  { label: "Cookies", href: ROUTES.cookies },
  { label: "Terms of use", href: ROUTES.terms },
  { label: "Terms of business", href: ROUTES.termsOfBusiness },
  { label: "Accessibility", href: ROUTES.accessibility },
  { label: "Complaints", href: ROUTES.complaints },
  { label: "Sub-processors", href: ROUTES.subProcessors },
];

/**
 * The legal line, with the draft's own placeholders left in.
 *
 * The square brackets are deliberate. A made up company number is worse than a
 * visible gap, and a visible gap is the thing that gets filled before launch.
 */
export const LEGAL = {
  entity: "TwinCoreTech Ltd",
  line: "TwinLoom is a trading name of TwinCoreTech Ltd, a company registered in England and Wales under company number [company number]. Registered office: [registered office]. [VAT registration wording.]",
  rights: "All rights reserved.",
} as const;

/**
 * The rail, flattened into reading order.
 *
 * The rail is the site's table of contents, so its order is the order the pages
 * are meant to be read in. Flattening it gives every page a previous and a next
 * for free, tied to the one list rather than to a second one, and a sub page
 * follows its parent because that is where it sits in the rail.
 */
export const FLAT_PAGES: readonly NavLink[] = RAIL_PAGES.flatMap((page) => [
  { label: page.label, href: page.href },
  ...(page.children ?? []),
]);

/** What comes before and after a page, for the pagination at its foot. */
export function siblingPages(pathname: string) {
  const at = FLAT_PAGES.findIndex((page) => page.href === pathname);
  if (at === -1) return { previous: null, next: null };

  return {
    previous: at > 0 ? FLAT_PAGES[at - 1] : null,
    next: at < FLAT_PAGES.length - 1 ? FLAT_PAGES[at + 1] : null,
  };
}
