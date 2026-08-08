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

   Three screens, and they are meant to be three different screens rather than
   one screen with its contents swapped. Each carries a `view`, and the card
   branches on it - so an arrow does not change a picture, it changes what the
   card is.

   One of them exists. It is the wave: the dotted surface with the claim set over
   it and the two ways in underneath. The other two are white cards waiting for
   designs of their own, and they are deliberately empty rather than holding a
   placeholder - a grey panel or a borrowed arrangement is a design decision made
   before the design.
--------------------------------------------------------------------------- */

/**
 * Which screen a slide is.
 *
 * Not which picture it shows - which arrangement it is. The three are meant to
 * be three different things rather than one layout with the contents swapped,
 * so this is the switch the card branches on, and adding the next one is a name
 * here and a case there.
 *
 * `blank` is a white card and nothing else. It is not a placeholder graphic or a
 * greyed panel, because either of those is a design decision made in advance of
 * the design.
 */
export type SlideView = "wave" | "blank";

/**
 * A slide, which is a `Project` and a few more things.
 *
 * It carries everything a `Project` needs, because the panel that opens from the
 * corner disc reads those fields and an empty panel is a broken one. What it
 * adds is what the card itself sets: which screen this is, and the words that
 * screen puts in type.
 *
 * The words are optional because only the first screen has any. A screen waiting
 * for its own design should not be carrying copy written for somebody else's.
 *
 * `claim` is in halves because the card sets the second in the mark's own
 * gradient. Split at the full stop in the view instead, and every claim would
 * have to be one sentence with exactly one stop in it.
 */
export interface HeroSlide extends Project {
  view: SlideView;
  claim?: [string, string];
  lead?: string;
}

export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: "hero-1",
    view: "wave",
    name: "Tell us who your website is for",
    kind: "The offer",
    year: "2026",
    summary:
      "You answer one question. We send back a written scope in your own words, within two working days. It costs nothing and commits you to nothing.",
    facts: [
      { term: "Questions", value: "One, to start" },
      { term: "Comes back", value: "Within two working days" },
      { term: "Costs", value: "Nothing" },
    ],
    claim: ["Tell us who your website is for.", "We write the rest down."],
    lead: "You answer one question. We send back a written scope in your own words, within two working days. It costs nothing and commits you to nothing.",
    image: "",
    alt: "",
    tone: "#ffffff",
  },

  /* Two white cards, waiting for their own screens.

     Empty rather than filled with something that will do. A screen borrowing the
     first one's arrangement looks finished and is not, and the design made for
     it would then have to be found among two that already look like they belong.

     Everything a `Project` needs is still here, because the panel behind the
     card reads those fields whatever the card is showing.

     To build one: give it a `view` of its own, and add the case to the card. */
  {
    id: "hero-2",
    view: "blank",
    name: "The second screen",
    kind: "To come",
    year: "2026",
    summary:
      "This screen is waiting for its own design. It is a white card until it has one.",
    facts: [
      { term: "Design", value: "Awaited" },
      { term: "Shows", value: "A white card" },
      { term: "Needs", value: "A view of its own" },
    ],
    image: "",
    alt: "",
    tone: "#ffffff",
  },
  {
    id: "hero-3",
    view: "blank",
    name: "The third screen",
    kind: "To come",
    year: "2026",
    summary:
      "This screen is waiting for its own design. It is a white card until it has one.",
    facts: [
      { term: "Design", value: "Awaited" },
      { term: "Shows", value: "A white card" },
      { term: "Needs", value: "A view of its own" },
    ],
    image: "",
    alt: "",
    tone: "#ffffff",
  },
];
