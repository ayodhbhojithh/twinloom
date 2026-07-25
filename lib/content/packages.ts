/**
 * Presentation detail for each package, keyed by the tier ids in
 * lib/scope/packages.ts. The tiers own the thresholds and timelines; this owns
 * the shop window. Keeping them apart means a rate card change never touches
 * the estimator's maths.
 *
 * Figures are the prototype's. Treat them as the current rate card, pending
 * confirmation.
 */
export interface PackageDetail {
  tierId: string;
  fromPrice: number;
  /** `true` renders the price as "from". Used where scope is open ended. */
  open?: boolean;
  pagesLabel: string;
  blurb: string;
  highlights: readonly string[];
}

export const PACKAGE_DETAILS: readonly PackageDetail[] = [
  {
    tierId: "launch-lite",
    fromPrice: 500,
    pagesLabel: "1 to 3 pages",
    blurb: "Get online fast, properly, without pretending it is more than it is.",
    highlights: [
      "Template look, your logo and colours",
      "Contact form straight to your inbox",
      "Titles and meta done properly",
    ],
  },
  {
    tierId: "sme-launch",
    fromPrice: 1950,
    pagesLabel: "4 to 6 pages",
    blurb: "A proper business site. The one most small businesses actually need.",
    highlights: [
      "Customised design, your brand applied",
      "Basic CMS so you can edit content",
      "GA4 and Search Console set up",
    ],
  },
  {
    tierId: "sme-growth",
    fromPrice: 4950,
    pagesLabel: "8 to 15 pages",
    blurb: "Built to grow and convert, with a blog and reusable sections.",
    highlights: [
      "Wireframed key pages, polished design",
      "Blog, categories and reusable sections",
      "Full on page SEO and conversion events",
    ],
  },
  {
    tierId: "sme-operating",
    fromPrice: 9500,
    pagesLabel: "15 to 30 pages",
    blurb: "Your sales and ops engine: landing pages, lead routing, reporting.",
    highlights: [
      "Journey wireframes, bespoke design",
      "CRM integration and follow up workflows",
      "Tracking plus a reporting dashboard",
    ],
  },
  {
    tierId: "bespoke",
    fromPrice: 15000,
    open: true,
    pagesLabel: "custom scope",
    blurb: "A custom platform: portals, dashboards, applications, integrations.",
    highlights: [
      "Full UX flows and a component library",
      "Custom or headless CMS",
      "Technical SEO, schema, custom analytics",
    ],
  },
] as const;

export interface CarePlan {
  name: string;
  price: number;
  /** Set when the price is a range or a starting point. */
  priceHigh?: number;
  open?: boolean;
  body: string;
  featured?: boolean;
}

export const CARE_PLANS: readonly CarePlan[] = [
  {
    name: "Lite Care",
    price: 49,
    priceHigh: 75,
    body: "Hosting, SSL and security checks, monthly backups, minor edits.",
  },
  {
    name: "Care Plan",
    price: 95,
    body: "Uptime monitoring, SEO checks, backups and a monthly slot for edits.",
    featured: true,
  },
  {
    name: "Care and Content",
    price: 295,
    body: "One new page and one blog upload a month, plus plain English reporting.",
  },
  {
    name: "Growth Partner",
    price: 750,
    body: "Conversion work, CRM, monthly advisory and on demand dev fixes.",
  },
] as const;
