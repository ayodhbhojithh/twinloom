export interface NavItem {
  label: string;
  href: string;
}

export const SITE = {
  name: "TwinCoreTech",
  tagline: "Website design and build for UK small business",
  description:
    "Price your website before you talk to anyone. Tick the parts you need, watch the layout and the estimate follow, then book a 30 minute scope call.",
  email: "hello@twincoretech.com",
  phone: "+44 20 7946 0958",
  location: "United Kingdom",
  bookingHref: "#book",
} as const;

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "What you get", href: "#what-you-get" },
  { label: "Price it yourself", href: "#estimator" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Packages", href: "#packages" },
  { label: "Questions", href: "#questions" },
] as const;

export const FOOTER_NAV: readonly { title: string; items: NavItem[] }[] = [
  {
    title: "Build",
    items: [
      { label: "Price it yourself", href: "#estimator" },
      { label: "Packages", href: "#packages" },
      { label: "What you get", href: "#what-you-get" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Questions", href: "#questions" },
      { label: "Book a scope call", href: "#book" },
    ],
  },
] as const;
