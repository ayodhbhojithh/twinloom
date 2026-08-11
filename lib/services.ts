import {
  Accessibility,
  Boxes,
  CalendarDays,
  Cloud,
  Compass,
  FileText,
  Gauge,
  Globe,
  LifeBuoy,
  LineChart,
  Lock,
  Mail,
  Megaphone,
  MonitorSmartphone,
  Palette,
  Search,
  Type,
  type LucideIcon,
} from "lucide-react";

/* ---------------------------------------------------------------------------
   What this company sells.

   One list, read by the services page and by the about page. They were two
   copies a scroll apart, which is two lists that disagree the first week one
   of them changes - and of all the things on a website to be inconsistent
   about, what you sell is the worst.

   Two kinds of thing, kept apart because the distinction is the point. What we
   build is the deliverable; what runs alongside it is chosen rather than
   assumed and priced separately from the build.
--------------------------------------------------------------------------- */

export interface Offer {
  icon: LucideIcon;
  kicker: string;
  n: string;
  sub: string;
  /**
   * The card's own picture, in `public/assets/services`.
   *
   * Optional, and the card has a proper answer for its absence: the Lucide icon
   * above, set large on a wash of the mark's two colours. That is not a
   * placeholder waiting to be replaced - it is what the card looks like until
   * this discipline has a picture worth the space, and a card whose picture is
   * missing should look decided rather than broken.
   */
  art?: string;

  /** Who actually builds it, which is not the same company for both. */
  by: string;
  /** What is in it, said as things rather than as a paragraph. */
  covers: readonly string[];
}

export const OFFER: readonly Offer[] = [
  {
    icon: Globe,
    kicker: "What we do",
    art: "/assets/services/websites.png",
    n: "Websites",
    sub: "From a handful of pages through to online shops, booking systems, and sites that connect to the software you already run.",
    by: "Built by TwinLoom",
    covers: [
      "Brochure and marketing sites",
      "Online shops",
      "Booking and appointment systems",
      "Sites that connect to what you already run",
      "Rebuilds of something that no longer holds",
    ],
  },
  {
    icon: Boxes,
    kicker: "What sits behind it",
    art: "/assets/services/custom-software.png",
    n: "Custom software",
    sub: "Managed software built for what your website sits on top of, by TwinCoreTech. Same group, same people to talk to.",
    by: "Built by TwinCoreTech",
    covers: [
      "Internal tools and dashboards",
      "Integrations between systems that do not talk",
      "Anything the website has to read from or write to",
      "Hosting and care for what is built",
    ],
  },
];

export interface Service {
  icon: LucideIcon;
  n: string;
  sub: string;
  /**
   * The card's own picture, in `public/assets/services`.
   *
   * Optional, and the card has a proper answer for its absence: the Lucide icon
   * above, set large on a wash of the mark's two colours. That is not a
   * placeholder waiting to be replaced - it is what the card looks like until
   * this discipline has a picture worth the space, and a card whose picture is
   * missing should look decided rather than broken.
   */
  art?: string;

  /**
   * Ours or a partner's.
   *
   * Taken from the partner disciplines rather than decided here: brand and
   * identity, and search and paid media, are two of the six, and we apply a
   * brand that exists while a partner makes one that does not.
   */
  by: string;
  covers: readonly string[];
}

export const SERVICES: readonly Service[] = [
  {
    icon: Compass,
    art: "/assets/services/digital-consultancy.png",
    n: "Digital consultancy",
    sub: "Working out what the site has to do, who it is for, and what it needs to connect to.",
    by: "By us",
    covers: [
      "Requirements, written down",
      "What to build first, and what can wait",
      "Which platform, and why not the others",
      "What it will cost to run, not only to build",
    ],
  },
  {
    icon: LifeBuoy,
    art: "/assets/services/website-care.png",
    n: "Website Care",
    sub: "Keeping the site current once it is live, and the services that run alongside it.",
    by: "By us",
    covers: [
      "Hosting, backups and monitoring",
      "Updates, fixes and small changes",
      "Domain and business email",
      "Social media set-up and maintenance",
      "Regular content",
    ],
  },
  {
    icon: Palette,
    art: "/assets/services/brand-identity.png",
    n: "Brand identity",
    sub: "Logo, visual identity, photography and imagery, artwork, and the words on the page.",
    by: "Us, or a partner",
    covers: [
      "A mark, its type and its colours",
      "Photography and film of the actual business",
      "Copywriting, where the words have to be written rather than edited",
      "The rules for using any of it afterwards",
    ],
  },
  {
    icon: Megaphone,
    art: "/assets/services/campaign-management.png",
    n: "Digital campaign management",
    sub: "Running and measuring campaigns once the site is live.",
    by: "With a partner",
    covers: [
      "Demand research",
      "Campaign structure and spend",
      "Measurement in accounts you own",
      "The ongoing work of it after launch",
    ],
  },
];

/**
 * What every site gets, whatever it costs.
 *
 * Written as the eleven separate promises they are rather than compressed into
 * four bullets with commas in them. Each one is a thing that either happened or
 * did not, which is the only kind of inclusion worth listing.
 *
 * Here rather than on the about page because two screens read it now - that
 * page and the panel the landing card opens - and a list of eleven promises
 * kept in two places is a list that disagrees with itself the first time one of
 * them is edited.
 *
 * The icon is the line said again in a picture, which is what lets the list be
 * scanned rather than read. Where a line has no obvious object the icon is the
 * nearest honest one: a gauge for loading quickly, a calendar for the fortnight
 * after launch.
 */
/**
 * The order the six are read in, and the one list that decides it.
 *
 * `OFFER` and `SERVICES` are kept apart above because the distinction matters to
 * this file - what we build, then what runs alongside it - and read end to end
 * that puts the two biggest commitments first and second, which makes the four
 * after them look like an appendix.
 *
 * This is the order somebody meets them in: the site, then keeping the site,
 * then working out what it should be, then getting people to it, then how it
 * looks, then the software under it. Roughly the order the work happens in, and
 * it ends on the one built by the other company - which is the right place for
 * it, because it is the thing you arrive at rather than the thing you came for.
 *
 * Here rather than in the view that first needed it. Two surfaces show these six
 * - the services wall on the landing page and the overview panel that opens off
 * the card - and while the order lived in the wall, the panel had no way to read
 * it and showed them in the order the two lists happen to concatenate in. Two
 * orders for one set of six is one of them being wrong, and which one is wrong
 * changes depending on which you saw first.
 */
const ORDER = [
  "Websites",
  "Website Care",
  "Digital consultancy",
  "Digital campaign management",
  "Brand identity",
  "Custom software",
] as const;

/**
 * Sorted by `ORDER` rather than filtered through it, so a discipline added above
 * and forgotten in the list still appears - at the end, which looks wrong, which
 * is how anybody finds out. Filtering would drop it silently.
 */
const at = (name: string) => {
  const n = ORDER.indexOf(name as (typeof ORDER)[number]);
  return n === -1 ? ORDER.length : n;
};

export const ALL_SERVICES = [...OFFER, ...SERVICES].sort(
  (a, b) => at(a.n) - at(b.n),
);

export const INCLUDED: readonly { icon: LucideIcon; say: string }[] = [
  {
    icon: MonitorSmartphone,
    say: "It works on a phone, a tablet and a computer",
  },
  {
    icon: Type,
    say: "Your visual identity, applied to layouts we already have",
  },
  {
    icon: Search,
    say: "Set up so search engines can find and read every page",
  },
  { icon: Lock, say: "Secure, with access managed where it is needed" },
  { icon: Cloud, say: "Hosted, backed up and monitored" },
  { icon: Gauge, say: "Built to load quickly and stay still while it loads" },
  {
    icon: Accessibility,
    say: "Reviewed for accessibility before it goes live",
  },
  { icon: Mail, say: "An enquiry form that reaches the right inbox" },
  { icon: LineChart, say: "Analytics and Search Console, in accounts you own" },
  { icon: CalendarDays, say: "Two weeks of attention after launch" },
  {
    icon: FileText,
    say: "A handover pack, and a session with the people who will use it",
  },
];
