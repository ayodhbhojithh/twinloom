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
  /**
   * A film, where there is one, played in place of the picture.
   *
   * The still stays: it is the poster while the film loads, what a reader gets
   * where motion is not wanted, and the thumbnail in the bite. A project with no
   * film simply leaves this out.
   */
  video?: string;
  /** What the picture shows, for anybody who cannot see it. */
  alt: string;
  /** The colour under the picture until it arrives. */
  tone: string;
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
    video: "/videos/1.mp4",
    alt: "A clothing shop page open on a product.",
    tone: "#e9ecf1",
  },
  {
    id: "restaurant",
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
  {
    id: "bookings",
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
