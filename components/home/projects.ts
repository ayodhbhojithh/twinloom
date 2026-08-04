/* ---------------------------------------------------------------------------
   The work, as data.

   Four pieces, one per picture. Named for what each build does rather than for a
   client: inventing client names to fill a carousel would put fake credentials on
   a company's own site, which is the one lie a portfolio must not tell. These
   describe kinds of work, which is true of every one of them.

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
}

export const PROJECTS: readonly Project[] = [
  {
    id: "investor",
    name: "An investor reporting site",
    kind: "Money and oversight",
    year: "2025",
    summary:
      "A quiet corner for people who put money in and the board that watches it. Dated, filed, and never more current than the paperwork behind it.",
    facts: [
      { term: "Pages", value: "9" },
      { term: "Built in", value: "4 weeks" },
      { term: "Visitors", value: "Investors" },
    ],
    image: "/work-investor.png",
    alt: "A reporting dashboard on a large screen.",
    tone: "#eceef1",
  },
  {
    id: "maker",
    name: "A shop for a maker",
    kind: "Selling direct",
    year: "2026",
    summary:
      "Somebody who makes things by hand and sells them to the public. The site had to carry the making as well as the buying, because the making is why anybody pays the price.",
    facts: [
      { term: "Pages", value: "11" },
      { term: "Built in", value: "5 weeks" },
      { term: "Visitors", value: "Customers" },
    ],
    image: "/work-shop.png",
    alt: "A shop laid out across a laptop and a phone.",
    tone: "#e9ebee",
  },
  {
    id: "trade",
    name: "A trade account portal",
    kind: "Selling to business",
    year: "2026",
    summary:
      "Buyers ordering on behalf of an organisation, with somebody above them to answer to. Everything on it exists so a buyer can take a decision back to a person who was never on the site.",
    facts: [
      { term: "Pages", value: "18" },
      { term: "Built in", value: "8 weeks" },
      { term: "Visitors", value: "Business buyers" },
    ],
    image: "/work-trade.png",
    alt: "An account portal open on a laptop.",
    tone: "#e4e7ea",
  },
  {
    id: "careers",
    name: "A careers site that fills roles",
    kind: "Hiring",
    year: "2025",
    summary:
      "Written for the people they wanted rather than the people who applied. What it is actually like to work there, said plainly, and a way to apply that takes four minutes.",
    facts: [
      { term: "Pages", value: "14" },
      { term: "Built in", value: "6 weeks" },
      { term: "Visitors", value: "Staff and candidates" },
    ],
    image: "/work-careers.png",
    alt: "A careers page with a person reading it.",
    tone: "#e7e9ed",
  },
  {
    id: "clinic",
    name: "A clinic that fills its diary",
    kind: "Booking",
    year: "2026",
    summary:
      "Six practitioners, four rooms and one diary that finally agrees with itself. The site presents the availability; the booking system keeps the rules, which is the only arrangement that survives a busy week.",
    facts: [
      { term: "Pages", value: "11" },
      { term: "Built in", value: "5 weeks" },
      { term: "Visitors", value: "Patients and referrers" },
    ],
    image: "/right-image.png",
    alt: "A booking page showing the times available this week.",
    tone: "#e9ecef",
  },
];
