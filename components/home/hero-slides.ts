import type { Project } from "./projects";

/* ---------------------------------------------------------------------------
   The landing card's slides, as data.

   Its own list, not the work list. The two were one, and they should not be:
   the sandbox further down the page is a portfolio and grows with what we
   build, while the card at the top of the page is the front door and turns over
   for reasons that have nothing to do with a project shipping. Sharing one list
   meant every change to either was a change to both.

   The shape is `Project` because the card and its opened panel read the same
   fields. Only the list is separate - one type, two lists, and the type is the
   thing that keeps them interchangeable if a slide ever is a project.

   These are the pictures the card carried while it was reading the work list.
   They are here to be replaced: swap a `image`, `video`, `alt` and `tone` and
   nothing outside this file has to know.
--------------------------------------------------------------------------- */

export const HERO_SLIDES: readonly Project[] = [
  {
    id: "hero-1",
    name: "A clothing brand that sells its own way",
    kind: "Retail",
    year: "2026",
    summary:
      "Sizes that admit what they run like, photographs a customer can judge a fit from, and returns explained before the basket rather than after it. The shop reads as the brand rather than as a platform wearing it.",
    facts: [
      { term: "Pages", value: "16" },
      { term: "Built in", value: "6 weeks" },
      { term: "Visitors", value: "Shoppers and stockists" },
    ],
    image: "/projects/clotting.png",
    video: "/videos/1.mp4",
    alt: "A clothing shop page open on a product.",
    tone: "#e9ecf1",
  },
  {
    id: "hero-2",
    name: "A restaurant that fills its tables",
    kind: "Hospitality",
    year: "2026",
    summary:
      "The four things anybody actually opens a restaurant site for - what is on, when it is open, where it is, and a table tonight - answered above the fold and correct on a phone in the street.",
    facts: [
      { term: "Pages", value: "9" },
      { term: "Built in", value: "4 weeks" },
      { term: "Visitors", value: "Diners and groups" },
    ],
    image: "/work-shop.png",
    alt: "A restaurant page showing the menu and a table booking.",
    tone: "#eceef2",
  },
  {
    id: "hero-3",
    name: "A clinic people trust before they call",
    kind: "Healthcare",
    year: "2025",
    summary:
      "Written for somebody worried and reading at eleven at night: what is treated, who by, what it costs and what happens at an appointment - said plainly, with the regulated claims reviewed rather than guessed.",
    facts: [
      { term: "Pages", value: "22" },
      { term: "Built in", value: "8 weeks" },
      { term: "Visitors", value: "Patients and referrers" },
    ],
    image: "/projects/healthcare.png",
    alt: "A clinic page open on a treatment.",
    tone: "#e8ebf0",
  },
  {
    id: "hero-4",
    name: "A delivery and pickup app",
    kind: "Ordering",
    year: "2026",
    summary:
      "One order journey that knows which it is. Delivery asks for an address and a window; pickup asks for a time and a name - and the kitchen sees the same order either way, in the order it has to be made.",
    facts: [
      { term: "Screens", value: "18" },
      { term: "Built in", value: "9 weeks" },
      { term: "Visitors", value: "Customers and kitchen" },
    ],
    image: "/projects/delivery.png",
    alt: "An ordering app on a phone, mid checkout.",
    tone: "#eaedf1",
  },
  {
    id: "hero-5",
    name: "A bookings system that holds the diary",
    kind: "Booking",
    year: "2026",
    summary:
      "Rooms, people and equipment on one calendar that finally agrees with itself. Availability, deposits, reminders and cancellations live in the system; the site only ever presents what it says.",
    facts: [
      { term: "Screens", value: "14" },
      { term: "Built in", value: "7 weeks" },
      { term: "Visitors", value: "Staff and customers" },
    ],
    image: "/work-trade.png",
    alt: "A booking calendar showing the week's availability.",
    tone: "#e7eaef",
  },
];
