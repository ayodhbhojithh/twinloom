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
export const PRIMARY_CTA: CallToAction = {
  label: "Scope your website",
  href: "#scope",
};

export const SECONDARY_CTA: CallToAction = {
  label: "Book a call",
  href: "#contact",
};

/**
 * Top nav, from TCT_Sitemap.md. One scrollable page, so these are in page
 * anchors rather than routes. Sections are being built one at a time, so some of
 * these targets do not exist yet.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Partners", href: "#partners" },
  { label: "Care", href: "#care" },
  { label: "Insights", href: "#insights" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
] as const;
