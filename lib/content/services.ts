export interface ServiceCard {
  /** lucide-react icon name, resolved by the section that renders it. */
  icon:
    | "LayoutTemplate"
    | "PenLine"
    | "Search"
    | "LineChart"
    | "ShieldCheck"
    | "ServerCog";
  title: string;
  body: string;
  /** Scope section this maps to, so the copy and the estimator stay aligned. */
  scopeSectionId: string;
}

export const SERVICES: readonly ServiceCard[] = [
  {
    icon: "LayoutTemplate",
    title: "Structure and pages",
    body: "Header, footer, hero, service sections, contact. The frame every page shares, built to the same standard whether you have three pages or thirty.",
    scopeSectionId: "structure",
  },
  {
    icon: "PenLine",
    title: "Design and copy",
    body: "Your brand applied properly, and words that sell rather than just inform. Bring your own copy and we tidy it, or we write the whole site with you.",
    scopeSectionId: "sections",
  },
  {
    icon: "Search",
    title: "SEO that is actually done",
    body: "Titles, headings, structure and metadata on every page, not a checkbox at the end. Technical setup and rich results when you need to compete.",
    scopeSectionId: "foundation",
  },
  {
    icon: "LineChart",
    title: "Analytics and tracking",
    body: "GA4 and Search Console from day one, conversion events on the things that matter, and a plain English dashboard if you want one.",
    scopeSectionId: "foundation",
  },
  {
    icon: "ShieldCheck",
    title: "Legal and trust",
    body: "A UK privacy policy and a cookie banner that does what the law asks. Required the moment you collect a single visitor detail.",
    scopeSectionId: "legal",
  },
  {
    icon: "ServerCog",
    title: "Hosting, domain and care",
    body: "Live and secure on your own address, then kept that way. Backups, updates, uptime checks and a monthly slot for edits.",
    scopeSectionId: "foundation",
  },
] as const;
