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
  how: "/how-we-work",

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
  { label: "How we work", href: ROUTES.how },
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
  /* Home has no sub pages here any more.

     The six variants are still routes and still build - they are working drafts
     of one screen, reachable by typing the address. What they are not is six
     more places for a visitor to go: they are the same page six times, and a
     navigation that lists them is a table of contents for our own drafts. They
     are already kept out of the index for the same reason. */
  { label: "Home", href: ROUTES.home },
  { label: "Build your website", href: ROUTES.build },
  { label: "About us", href: ROUTES.about },
  { label: "How we work", href: ROUTES.how },
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
      { label: "How we work", href: ROUTES.how },
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
 * How to reach a person, held in one place.
 *
 * The contact page is not the only screen that wants an address: the footer,
 * the booking confirmation and the legal pages all reach for one, and three
 * copies of a postcode is three chances for two of them to be wrong.
 *
 * The postcode is in `cityLine` only. It arrived on both that and `street`,
 * which put "BR1 3FE" on two lines of the same address.
 */
export const CONTACT_INFO = {
  companyName: "TwinCoreTech Ltd",
  emails: [
    "sales@twincoretech.com",
    "careers@twincoretech.com",
    "privacy@twincoretech.com",
    "hello@twincoretech.com",
  ],
  primaryEmail: "hello@twincoretech.com",
  phone: "+44 (0) 753 973 0098",
  phoneHref: "tel:+447539730098",
  address: {
    name: "Bromley Old Town Hall",
    street: "30 Tweedy Road",
    cityLine: "Bromley, BR1 3FE, United Kingdom",
    mapUrl:
      "https://maps.google.com/?q=Bromley+Old+Town+Hall,+30+Tweedy+Road,+BR1+3FE",
    embedUrl:
      "https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Bromley%20Old%20Town%20Hall,%2030%20Tweedy%20Road,%20Bromley,%20BR1%203FE,%20United%20Kingdom+(TwinCoreTech%20Ltd)&t=&z=15&ie=UTF8&iwloc=B&output=embed",
  },
  hours: "Mon - Fri, 9AM - 6PM GMT",
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
