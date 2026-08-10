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

   The first is the mark, rendered, with the whole offer set beside it: the
   trades, the claim, the line under it, the paragraph and all four ways in. It
   leads because it is the only one that says everything, and the screen somebody
   arrives on cannot assume they will turn it.

   The second is a field of glass beads that drift and get shoved around by the
   cursor, with dark type centred on it. Light ground, so it is set the way the
   first one is; what separates the two is the argument rather than the
   treatment.

   The fourth is a film, edge to edge with nothing set over it.

   The fifth is white and empty, and waiting. It is in the run rather than held
   back until it has something on it, because the arrows are how anybody finds
   out how much there is - a card that grows from four screens to five later is
   a card somebody has already decided the length of.

   Which is the shape of the card. The first is the long version; the two behind
   it each make one argument and open one door, because a card that turns should
   not ask for the same thing three times.
--------------------------------------------------------------------------- */

/**
 * Which screen a slide is.
 *
 * Not which picture it shows - which arrangement it is. The three are meant to
 * be three different things rather than one layout with the contents swapped,
 * so this is the switch the card branches on, and adding the next one is a name
 * here and a case there.
 *
 * `balls` is the pit. `mark` is the logo at
 * the size of the card with the words beside it, and it is the only screen that
 * is not centred - the whole of it is the asymmetry.
 *
 * `film` is footage filling the card, with nothing laid over it.
 *
 * `blank` is a white card and nothing else - no drawing, no words, no way on.
 * Not a placeholder graphic and not a greyed panel, because either of those is a
 * design decision made in advance of the design. One of the five is that, and it
 * is that on purpose: the card turns onto it and there is nothing there yet.
 *
 * `wave` has gone: a claim set over a horizon of dots, making the same argument
 * as a screen two along from it on a drawing that takes a moment to resolve into
 * anything - a moment a card in the middle of a turn does not have. `wave-dots`
 * is still on disk for whatever wants a field of dots next.
 */
export type SlideView = "balls" | "film" | "blank" | "mark";

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
  /**
   * The reel this screen scrubs, for a `film` view.
   *
   * A folder of stills and how many there are, rather than one video file. The
   * frames are scrolled through rather than played - see `film-stage` for why a
   * set of JPEGs beats seeking an MP4 - so what a slide names is where they live
   * and how far the sequence runs.
   *
   * On the slide rather than in the view, for the same reason the claim is: the
   * card branches on what a screen *is*, and which reel it holds is what that
   * screen is made of. A second reel is a second slide, not a second branch.
   */
  reel?: { base: string; frames: number };
}

/*
   All three carry `overview`, which is what the expand control opens.

   Without it a slide opens the panel a piece of work opens: a picture down one
   side, a summary, and three facts. None of these is a piece of work - they are
   three arguments for the same company - so two of them were opening a panel
   with an empty grey half where the photograph would go, and three facts
   restating the line already on the card behind it.

   The company's own panel is the honest answer for all three. The card turns to
   change what it argues; pressing into it asks the one question every argument
   leads to, which is what this company actually does. That does not change with
   the slide, so neither does the panel.
*/
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
    overview: true,
  },

  /* The second: how the work is agreed, over the pit.

     Dark type again, like the screen before it, because the ground is light
     again - a field of glass beads on white. What separates the two is not the
     treatment, it is the argument: the first says what we build, this one says
     what you get before anybody agrees to anything.

     It follows the mark rather than the water because it is the answer to the
     question the mark leaves: a front door that has just said what it does
     should say next how it does it, not change the subject to who we are. */
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
    overview: true,
  },

  /* The fourth: a film, and what it is doing there.

     Nothing is set over the picture - a headline across moving footage is a
     headline read while something else moves - so the words stand beside it and
     the film is the evidence for them.

     What the words are about is the thing that is actually happening. The reel
     is not playing: it is a hundred and twenty stills, and the reader's own
     scroll is what picks which one is on screen. Saying "we also make film" next
     to a video would be a claim; saying "you are not watching this, you are
     scrolling it" next to a reel that stops when the reader stops is a
     demonstration, and it tells them what to do at the same time.

     Verbs in the kicker rather than nouns. "Film, photography, motion" is a list
     of departments; "filmed, cut, built" is a list of things that were done, and
     the last of the three is the one nobody else on that list would have
     done. */
  {
    id: "hero-6",
    view: "film",
    reel: { base: "/assets/film/fashion", frames: 120 },
    name: "A film you scroll",
    kind: "Film",
    year: "2026",
    summary:
      "Shot, cut and graded here, then taken apart frame by frame and built back into the page - so the reel runs at the reader's pace rather than its own.",
    facts: [
      { term: "Filmed", value: "By us" },
      { term: "Built", value: "By us" },
      { term: "Frames", value: "120, scrubbed" },
    ],
    kicker: ["Filmed", "Cut", "Built"],
    claim: ["You are not watching this.", "You are scrolling it."],
    lead: "Every frame is a still, and your scroll is the shutter.",
    note: "We shot it, cut it and graded it - fashion, product, brand. Then took it apart frame by frame and built it back into the page, so it runs at your pace instead of its own. That is the difference between a website with a film on it and a website that moves.",
    image: "",
    alt: "",
    tone: "#ffffff",
    overview: true,
  },
  {
    id: "hero-7",
    view: "blank",
    name: "Waiting for its design",
    kind: "In progress",
    year: "2026",
    summary:
      "A screen on the landing card with nothing on it yet. It turns to like any other and opens the same panel.",
    facts: [
      { term: "Screen", value: "Five of five" },
      { term: "Holds", value: "Nothing yet" },
      { term: "Opens", value: "What we do" },
    ],
    image: "",
    alt: "",
    tone: "#ffffff",
    overview: true,
  },
];
