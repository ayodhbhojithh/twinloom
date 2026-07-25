export interface NavItem {
  label: string;
  href: string;
  /**
   * The mono superscript beside the link, as in the prototype's nav. It counts
   * the things in that section, so keep it in step as each section is built.
   */
  count?: number;
}

export const SITE = {
  name: "TwinCoreTech",
  tagline: "Website design and build for UK small business",
  description:
    "Price your website before you talk to anyone. Tick the parts you need, watch the estimate follow, then book a 30 minute scope call.",
  email: "hello@twincoretech.com",
  phone: "+44 20 7946 0958",
  location: "United Kingdom",
  /** The nav's dark button. */
  ctaLabel: "Get estimate",
  ctaHref: "#components",
} as const;

/**
 * The page plan. Sections are being built one at a time, so some of these
 * anchors land nowhere until their section exists.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Components", href: "#components", count: 17 },
  { label: "Process", href: "#process", count: 4 },
  { label: "Pricing", href: "#pricing", count: 5 },
  { label: "Work", href: "#work", count: 3 },
  { label: "FAQ", href: "#faq", count: 8 },
] as const;
