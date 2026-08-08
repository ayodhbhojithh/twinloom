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

   Three slides, none of which has a picture yet. Every `image` is empty on
   purpose, and where there is no picture the card draws the two threads of the
   mark across itself instead - on white, so `tone` is white: it is the ground
   the drawing tints, and the colour the card shows for the frame before the
   drawing has started.

   Empty rather than borrowed. There are pictures elsewhere in `public` that
   would fill the space, and any of them would make the card look finished when
   it is not.

   To fill one: put a file in `image`, describe it in `alt`, and read `tone` off
   that file - it is the colour the card sits on while the picture loads, so it
   should be the picture's own average rather than white. Nothing outside this
   list has to know.
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
    image: "",
    alt: "",
    tone: "#ffffff",
  },

  /* Two waiting for their artwork.

     `image` is empty rather than pointing at something that will do. A slide
     borrowing a picture from elsewhere on the site looks finished and is not,
     and the one made for this card would then have to be found among four that
     already look like they belong. Empty, the card shows the tone and nothing
     else, and it is obvious at a glance which two are still to come.

     Everything but the picture is real, because the panel that opens from the
     corner reads these fields and an empty panel is a broken one. */
  {
    id: "hero-2",
    name: "The second piece",
    kind: "To come",
    year: "2026",
    summary:
      "This slide is waiting for its artwork. Everything else about it is in place: put a picture in `image`, describe it in `alt`, and read the tone off the file.",
    facts: [
      { term: "Artwork", value: "Awaited" },
      { term: "Copy", value: "Placeholder" },
      { term: "Shows", value: "Its tone only" },
    ],
    image: "",
    alt: "",
    tone: "#ffffff",
  },
  {
    id: "hero-3",
    name: "The third piece",
    kind: "To come",
    year: "2026",
    summary:
      "This slide is waiting for its artwork. Everything else about it is in place: put a picture in `image`, describe it in `alt`, and read the tone off the file.",
    facts: [
      { term: "Artwork", value: "Awaited" },
      { term: "Copy", value: "Placeholder" },
      { term: "Shows", value: "Its tone only" },
    ],
    image: "",
    alt: "",
    tone: "#ffffff",
  },
];
