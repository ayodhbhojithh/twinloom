import {
  Boxes,
  Compass,
  Globe,
  Infinity as Loop,
  LifeBuoy,
  Megaphone,
  Palette,
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
    art: "/assets/services/ongoing-services.png",
    n: "Ongoing services",
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
  /* The seventh, and the only one that is not a discipline.

     Every card above it names a thing that can be bought on its own. This one
     names what happens when they are not bought on their own, which is the
     argument the whole page is making - and it is the reason the picture is the
     mark rather than a drawing of an object. There is no object: the thing being
     described is that there is one supplier and not four.

     Last in the list on purpose. It reads as the sum of what is above it, and a
     sum put first is a claim nobody has been given the parts of yet. */
  {
    icon: Loop,
    art: "/assets/services/one-partner.png",
    n: "One partner, the whole build",
    sub: "The site, the software behind it and everything that runs alongside, from one company. One contract, one invoice, and the same people to ask either way.",
    by: "By us",
    covers: [
      "One proposal covering all of it",
      "One invoice, whoever does the work",
      "Specialists named before the work starts",
      "Nobody to hand you between",
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
