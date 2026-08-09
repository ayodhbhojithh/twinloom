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
  /**
   * The name in its two halves, for the lockup.
   *
   * The mark runs blue into teal and the second half of the name runs with it,
   * so the two are one drawing rather than a picture with a caption. Held here
   * rather than sliced in the header, because a `slice(0, 4)` in a component is
   * a number nobody can read the meaning of, and it would silently colour the
   * wrong letters the day the name changes.
   *
   * These two must always join back into `name`.
   */
  halves: ["Twin", "Loom"] as const,
  /** For the header, where a longer name crowds everything beside it. */
  short: "TwinLoom",
  /**
   * The landing page's header.
   *
   * `lockup` is not on it. It was set above the services line and read as a
   * label on a screen whose whole job is one claim; the footer's legal line
   * already says whose company this is, and says it where somebody looking for
   * that would go. Kept here because it is still the correct form of the name.
   *
   * The services line is held as the two halves it is set in rather than split
   * at a comma in the view. There are three commas in it and only one of them
   * is the one where the tone changes.
   */
  lockup: "TwinLoom, a TwinCoreTech company",
  services: {
    ink: "Websites, brand identity,",
    quiet: "digital consultancy and ongoing services.",
  },
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
  /* Was `/partners`. The page is about what we sell rather than about who
     helps deliver it; the specialists are a section of it now. Old links are
     redirected in `next.config.ts` rather than left to 404. */
  services: "/services",
  contact: "/contact",
  book: "/book",
  faq: "/faqs",
  blog: "/blog",

  /* The way into the other seven, and where the company details are set out. */
  legal: "/legal",
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
 * The header's links: every page the site has.
 *
 * It used to be five, because the rail carried the whole list and the header
 * only needed the pages a visitor reaches for. With the rail gone the header is
 * the navigation, so nothing may be missing from it - a page that is only in
 * the footer is a page nobody finds.
 *
 * Short labels rather than the rail's. "Our partners" and "Blogs and articles"
 * read well down a column and are twice as wide as they need to be across a
 * bar, and eight of them have to fit on one line at every width that shows
 * them.
 *
 * The build page is still not here: it is the call to action, filled in the
 * accent at the right hand end, and the same link twice in one bar reads as a
 * mistake rather than as emphasis.
 */
export const HEADER_NAV: readonly NavLink[] = [
  /* What is being sold first, then what is being said, then who is saying it.

     Home, then the two pages somebody arrives wanting - what can be bought and
     what has been written about it - then the questions, then the way to get
     hold of us. How we work and About come after those, because they are read
     by somebody already interested rather than by somebody deciding; Book a
     meeting sits last, at the end a bar is scanned back from.

     A bar is read from both ends: the name at one, the way to reach somebody at
     the other, and an item in an unexpected place costs a reader a whole pass.
     This is the order asked for, and it holds to that. */
  { label: "Home", href: ROUTES.home },
  { label: "Services", href: ROUTES.services },
  { label: "Articles", href: ROUTES.blog },
  { label: "FAQs", href: ROUTES.faq },
  { label: "Contact", href: ROUTES.contact },
  { label: "How we work", href: ROUTES.how },
  { label: "About", href: ROUTES.about },
  { label: "Book a meeting", href: ROUTES.book },
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
  { label: "Our services", href: ROUTES.services },
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
      { label: "Our services", href: ROUTES.services },
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
  { label: "Legal", href: ROUTES.legal },
  { label: "Privacy", href: ROUTES.privacy },
  { label: "Cookies", href: ROUTES.cookies },
  { label: "Terms of use", href: ROUTES.terms },
  { label: "Terms of business", href: ROUTES.termsOfBusiness },
  { label: "Accessibility", href: ROUTES.accessibility },
  { label: "Complaints", href: ROUTES.complaints },
  { label: "Sub-processors", href: ROUTES.subProcessors },
];

/**
 * The legal line, now that there is one.
 *
 * The placeholders are gone: the company number, the registered office and the
 * VAT number arrived with the policy documents. One wording, read by the footer
 * and by every page of the legal set, because eight pages each saying it
 * slightly differently is eight chances to say it wrong.
 */
export const LEGAL = {
  entity: "TwinCoreTech Ltd",
  number: "15997244",
  vat: "489 0108 74",
  office: "Bromley Old Town Hall, 30 Tweedy Road, Bromley BR1 3FE",
  line: "TwinLoom is a trading name of TwinCoreTech Ltd, registered in England and Wales, company number 15997244. Registered office: Bromley Old Town Hall, 30 Tweedy Road, Bromley BR1 3FE. VAT registration number 489 0108 74.",
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
    "enquiries@twincoretech.com",
    "sales@twincoretech.com",
    "careers@twincoretech.com",
    "privacy@twincoretech.com",
    /* Where a problem using the site itself goes - the accessibility statement
       and the complaints page both send people here. */
    "info@twincoretech.com",
    "hello@twincoretech.com",
  ],
  primaryEmail: "enquiries@twincoretech.com",
  phone: "+44 (0)20 3627 1123",
  phoneHref: "tel:+442036271123",
  address: {
    name: "Bromley Old Town Hall",
    street: "30 Tweedy Road",
    /* Set out as it would be written on an envelope: town, postcode, country,
       each on its own line. One string with commas in it is an address that
       reads as a sentence. */
    town: "Bromley",
    postcode: "BR1 3FE",
    country: "United Kingdom",
    cityLine: "Bromley, BR1 3FE, United Kingdom",
    mapUrl:
      "https://maps.google.com/?q=Bromley+Old+Town+Hall,+30+Tweedy+Road,+BR1+3FE",
    embedUrl:
      "https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Bromley%20Old%20Town%20Hall,%2030%20Tweedy%20Road,%20Bromley,%20BR1%203FE,%20United%20Kingdom+(TwinCoreTech%20Ltd)&t=&z=15&ie=UTF8&iwloc=B&output=embed",
  },
  hours: "Mon - Fri, 9AM - 5PM",
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
