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

   Five screens, and they are meant to be five different screens rather than
   one screen with its contents swapped. Each carries a `view`, and the card
   branches on it - so an arrow does not change a picture, it changes what the
   card is.

   The second is the wave: a horizon of dots with a claim set over it and the two
   ways in underneath. Dark ink on a white wash where the water is light type on
   a dark one - same layout, opposite polarity, which is what makes them read as
   two screens rather than one screen with the picture swapped.

   The first is water: a raymarched swell filling the card, with its words
   centred on it in white. It leads because it is the one that looks like
   something the moment it arrives - the dotted field takes a second to read as a
   wave, and a front door does not get a second.

   The third is a field of glass beads that drift and get shoved around by the
   cursor, with dark type centred on it - light ground again, so it is set the
   way the first one is.

   The fourth is white and empty behind its words, and that is the design rather
   than the absence of one. Three screens of drawing in a row is a card showing
   off; the last one stops, and what is left is the sentence and the way in. A
   front door that never stops talking is one people stop reading.

   The first is the mark, rendered, with the whole offer set beside it: the
   trades, the claim, the line under it, the paragraph and all four ways in. It
   leads because it is the only one that says everything, and the screen somebody
   arrives on cannot assume they will turn it.

   Which is the shape of the card. The first is the long version; the four behind
   it each make one argument and open one door, because a card that turns should
   not ask for the same thing five times.
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
 * `waves` is the raymarched water and `balls` is the pit. `mark` is the logo at
 * the size of the card with the words beside it, and it is the only screen that
 * is not centred - the whole of it is the asymmetry. `blank` is a white card and nothing else - not a placeholder graphic and not a
 * greyed panel, because either of those is a design decision made in advance of
 * the design.
 */
export type SlideView = "wave" | "waves" | "balls" | "blank" | "mark";

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
  /** The line above the claim, set as a list. Only the mark screen has one. */
  kicker?: readonly string[];
  /** The paragraph under the lead, where a screen has more to say than a line. */
  note?: string;
}

export const HERO_SLIDES: readonly HeroSlide[] = [
  /* The first: the mark staged, with the whole offer written beside it.

     The one screen that says everything at once, and it leads for exactly that
     reason. The four behind it each make a single argument and take a single way
     on, which is right for a card that turns - but the screen somebody arrives
     on cannot assume they will turn it. So the front door is the long version:
     the trades along the top, the claim, the line under it, the paragraph, and
     all four ways in. The rest are what they find if they stay. */
  {
    id: "hero-5",
    view: "mark",
    name: "Your website, your brand",
    kind: "The whole of it",
    year: "2026",
    summary:
      "Nobody hands you to an account manager. The people who scope the work are the people who build it, and they are the people you email a year later.",
    facts: [
      { term: "We build", value: "Sites and the software under them" },
      { term: "Contracts", value: "One" },
      { term: "Account managers", value: "None" },
    ],
    kicker: [
      "Websites",
      "Brand identity",
      "Digital presence",
      "Digital services",
    ],
    claim: ["Your website. Your brand.", "Connected to your systems."],
    lead: "We build digital experiences that move you forward.",
    note: "TwinLoom designs and builds websites, digital presence and brand-led experiences that connect the dots and deliver results. When you need more than a website, our sister company TwinCoreTech builds the custom software around your business, your systems and your future.",
    image: "",
    alt: "",
    tone: "#ffffff",
  },

  /* The first: the water, with its words set on it in white.

     Its own claim rather than the first screen's, because the two are different
     arguments for the same offer - the first says what you get, this says who
     you are getting it from. One way on and not two: the pair of buttons belongs
     to the screen making the offer. */
  {
    id: "hero-2",
    view: "waves",
    name: "Two threads, woven",
    kind: "What we are",
    year: "2026",
    summary:
      "The site people see and the software behind it are one build, not two suppliers who blame each other. One contract, one invoice, and the same people to ask either way.",
    facts: [
      { term: "Threads", value: "Two" },
      { term: "Contracts", value: "One" },
      { term: "People to ask", value: "The same ones" },
    ],
    claim: ["Two threads.", "One piece of work."],
    lead: "The site people see and the software behind it are one build, not two suppliers who blame each other. One contract, one invoice, and the same people to ask either way.",
    image: "",
    alt: "",
    tone: "#ffffff",
  },
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

  /* The third: how the work is agreed, over the pit.

     Dark type again, like the first screen, because the ground is light again -
     a field of glass beads on white. What separates it from the first is not the
     treatment, it is the argument: that one makes the offer, this one says what
     you get before anybody agrees to anything. */
  {
    id: "hero-3",
    view: "balls",
    name: "Written down first",
    kind: "How we work",
    year: "2026",
    summary:
      "You get the scope in your own words, with every assumption named, before anything is agreed. If it is not in there, it is not in the price.",
    facts: [
      { term: "Written first", value: "Always" },
      { term: "Assumptions", value: "Named, not buried" },
      { term: "Not in the scope", value: "Not in the price" },
    ],
    claim: ["Nothing gets built", "until it is written."],
    lead: "You get the scope in your own words, with every assumption named, before anything is agreed. If it is not in there, it is not in the price.",
    image: "",
    alt: "",
    tone: "#ffffff",
  },

  /* The fourth: white, with the ask on it.

     No drawing at all. It is last for the same reason a room goes quiet before
     somebody says the thing they came to say, and the words are the plainest on
     the card: what it costs, how long it takes, and what you are committing to. */
  {
    id: "hero-4",
    view: "blank",
    name: "Two working days",
    kind: "The ask",
    year: "2026",
    summary:
      "Tell us what the site is for and we write the scope in your own words. It costs nothing, commits you to nothing, and you keep it either way.",
    facts: [
      { term: "Comes back", value: "Within two working days" },
      { term: "Costs", value: "Nothing" },
      { term: "Commits you to", value: "Nothing" },
    ],
    claim: ["Two working days.", "Then you decide."],
    lead: "Tell us what the site is for and we write the scope in your own words. It costs nothing, commits you to nothing, and you keep it either way.",
    image: "",
    alt: "",
    tone: "#ffffff",
  },
];
