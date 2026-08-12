/* ---------------------------------------------------------------------------
   The work, as data.

   Three pieces, one per picture. Named for what each build does rather than for
   a client: inventing client names to fill a carousel would put fake credentials
   on a company's own site, which is the one lie a portfolio must not tell. These
   describe kinds of work, which is true of every one of them.

   Three, and each one has artwork of its own. There were five, and the two that
   have gone were pointing at a pair of pictures made for another part of the
   site and borrowed to make the list longer. A portfolio padded with the wrong
   pictures is worse than a short one. The two files went with them - thirteen
   megabytes of PNG that nothing had rendered since.

   The `tone` is the colour a card sits on while its picture is still loading, so
   the shape is there before the image is. It is read from the artwork rather than
   guessed, which is why they differ.

   Every screen that shows the work reads this one list, so a picture swapped here
   appears on the landing page, the deck, the wall and the opened panel at once.
--------------------------------------------------------------------------- */

export interface Project {
  id: string;
  name: string;
  kind: string;
  year: string;
  summary: string;
  facts: readonly { term: string; value: string }[];
  /** In `public`. Named for the project, so the mapping needs no lookup. */
  image: string;
  /** What the picture shows, for anybody who cannot see it. */
  alt: string;
  /** The colour under the picture until it arrives. */
  tone: string;
  /**
   * Opens as the company rather than as a piece of work.
   *
   * Only the landing card's first screen sets it. That screen is not a project
   * - it is the whole offer, and opening it to a picture and three facts about
   * account managers was opening a portfolio entry for a portfolio that does
   * not have one. Set here rather than matched on an id, so what the panel
   * checks is a decision somebody wrote down.
   */
  overview?: boolean;
}

export const PROJECTS: readonly Project[] = [
  {
    id: "clothing",
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
    id: "medical",
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
    id: "delivery",
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
