export interface NavItem {
  label: string;
  href: string;
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
 * Both point at the three doors for now. The guided journey lives at /scope in
 * the artifacts (2_scoping.html) and is the next thing to build; until it
 * exists, sending people to the section that offers all three ways to start
 * beats a link that does nothing.
 */
export const PRIMARY_CTA: CallToAction = {
  label: "Scope your website",
  href: "#contact",
};

export const SECONDARY_CTA: CallToAction = {
  label: "Book a call",
  href: "#contact",
};

/** The scoping journey. Not built yet. */
export const SCOPE_ROUTE = "/scope";

/**
 * Top nav. One scrollable page, so these are in page anchors, and every one of
 * them resolves to a section that exists.
 *
 * TCT_Sitemap.md also lists Partners, Insights and Pricing. They are their own
 * pages there, not Home blocks, so they join this list when they are built
 * rather than sitting here as links that go nowhere.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Services", href: "#services" },
  { label: "How we work", href: "#how-we-work" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Care", href: "#care" },
  { label: "Contact", href: "#contact" },
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
      { label: "Scope your website", href: "#contact" },
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
