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

   The first is the wave: a horizon of dots with a claim set over it and the two
   ways in underneath.

   The second is water: a raymarched swell that fills the card, with not a word
   on it. The screens either side of it are made of type, which is exactly why
   this one is not - a card that says something on all three of its faces is a
   card nobody turns twice.

   The third is a pit of glass beads that fall, pile up and get shoved around by
   the cursor. Also wordless, and the one screen of the three that answers back:
   the first is read, the second is watched, and this one is played with.
--------------------------------------------------------------------------- */

/**
 * Which screen a slide is.
 *
 * Not which picture it shows - which arrangement it is. The three are meant to
 * be three different things rather than one layout with the contents swapped,
 * so this is the switch the card branches on, and adding the next one is a name
 * here and a case there.
 *
 * `wave` is a claim over the dotted surface with the two ways in beneath it.
 * `waves` is the raymarched water and `balls` is the pit, both with nothing set
 * over them. `blank` is a white card and nothing else - not a placeholder graphic and not a
 * greyed panel, because either of those is a design decision made in advance of
 * the design.
 */
export type SlideView = "wave" | "waves" | "balls" | "blank";

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

  /* The second: the water, and no words on it.

     No `claim` and no `lead`, which is not an omission - the card branches on
     the view and this one sets type nowhere. What it still carries is what a
     `Project` needs, because the panel that opens from the corner disc reads
     those fields and an empty panel is a broken one. */
  {
    id: "hero-2",
    view: "waves",
    name: "The swell",
    kind: "The card",
    year: "2026",
    summary:
      "A surface with nothing written on it. The screen before it makes the offer and the one after it is still being designed; this one is here to be looked at.",
    facts: [
      { term: "Words on it", value: "None" },
      { term: "Drawn", value: "Every frame, on the card" },
    ],
    image: "",
    alt: "",
    tone: "#ffffff",
  },
  /* The third: the pit. No words on this one either. */
  {
    id: "hero-3",
    view: "balls",
    name: "The pit",
    kind: "The card",
    year: "2026",
    summary:
      "A box of glass beads that fall, pile up and get shoved out of the way by the cursor. The one screen of the three that answers back.",
    facts: [
      { term: "Words on it", value: "None" },
      { term: "Answers back", value: "To the cursor" },
    ],
    image: "",
    alt: "",
    tone: "#ffffff",
  },
];
