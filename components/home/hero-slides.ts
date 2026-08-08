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

   Three, and each has artwork of its own. There were five and one of them was a
   film; the film has gone, and so have the two slides that were pointing at
   `/work-shop.png` and `/work-trade.png` - pictures made for another part of the
   site and borrowed to make the run longer. A front door padded with the wrong
   pictures is worse than a short one.

   They are here to be replaced: swap an `image`, `alt` and `tone` and nothing
   outside this file has to know.
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
    alt: "A clothing shop page open on a product.",
    tone: "#e9ecf1",
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
];
