import {
  CARE_TEASER,
  FEATURED_WORK,
  FINAL_CTA,
  HOW_WE_WORK,
  OUTCOMES,
} from "./home";

export interface NavItem {
  label: string;
  href: string;
  /**
   * The mono superscript beside the link, as 2a sets its nav. Derived from the
   * content it points at, so it cannot drift out of step with the page.
   */
  count?: number;
}

export interface CallToAction {
  label: string;
  href: string;
}


export const SITE = {
  name: "TwinCoreTech",
  /** The wordmark is set in three parts so the middle one can take the brand colour. */
  wordmark: { head: "Twin", accent: "Core", tail: "Tech" },
  tagline: "Websites for growing UK businesses",
  description:
    "We build, refresh and look after your website and everything around it, so you can get on with running your business.",
  email: "hello@twincoretech.com",
  phone: "",
  location: "United Kingdom",
  /** Shown beside the primary call to action. */
  reassurance: "Takes about 3 minutes · No sign-up needed to explore",
  ownership: "You own everything. No lock-in.",
} as const;

/**
 * The primary journey and the escape hatch. Every call to action points at one
 * of these two.
 */
/**
 * The journey is the primary door; "Book a call" is the escape hatch that has to
 * stay visible everywhere.
 */
export const PRIMARY_CTA: CallToAction = {
  label: "Scope your website",
  href: "/scope",
};

export const SECONDARY_CTA: CallToAction = {
  label: "Book a call",
  href: "#contact",
};

/** The scoping journey. */
export const SCOPE_ROUTE = "/scope";

export const NEWSLETTER = {
  heading: "Join the newsletter",
  body: "Occasional, practical notes on getting found and getting enquiries. No filler.",
  placeholder: "Email address",
  action: "Sign me up",
} as const;

/* Social accounts are not here yet. When handles arrive they will need inline
   brand SVGs: lucide dropped every brand logo in v1, so there is no icon for
   LinkedIn or Instagram to import. */

/**
 * Top nav. One scrollable page, so these are in page anchors, and every one of
 * them resolves to a section that exists.
 *
 * TCT_Sitemap.md also lists Partners, Insights and Pricing. They are their own
 * pages there, not Home blocks, so they join this list when they are built
 * rather than sitting here as links that go nowhere.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Services", href: "#services", count: OUTCOMES.items.length },
  { label: "How we work", href: "#how-we-work", count: HOW_WE_WORK.steps.length },
  { label: "Work", href: "#work", count: FEATURED_WORK.items.length },
  { label: "About", href: "#about" },
  { label: "Care", href: "#care", count: CARE_TEASER.plans.length },
  { label: "Contact", href: "#contact", count: FINAL_CTA.doors.length },
] as const;

/**
 * Footer columns, from TCT_Sitemap.md's footer spec. Explore and Get started
 * point at sections that exist. The Legal column points at routes that do not:
 * those four are "Required" artefacts and have to be real pages, so they stay
 * listed and will resolve once written.
 */
export const FOOTER_NAV: readonly { title: string; items: NavItem[] }[] = [
  {
    title: "Explore",
    items: [
      { label: "Services", href: "#services" },
      { label: "How we work", href: "#how-we-work" },
      { label: "Work", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Care", href: "#care" },
    ],
  },
  {
    title: "Get started",
    items: [
      { label: "Scope your website", href: "/scope" },
      { label: "Book a call", href: "#contact" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
] as const;
