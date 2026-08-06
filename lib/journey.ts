import {
  CalendarClock,
  CheckCheck,
  FileSignature,
  FileText,
  Hammer,
  LifeBuoy,
  ListChecks,
  Mail,
  MessagesSquare,
  PenLine,
  Rocket,
  Server,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/* ---------------------------------------------------------------------------
   How a project runs, as thirteen steps in three zones.

   The order is fixed and the same for everybody: a scoping request always lands
   in the same place in the same process, so nothing here reads anybody's
   answers. What changes between projects is what happens inside a step, not
   which steps there are.

   Three zones rather than thirteen equal stops, because the changes of hand are
   the part worth seeing. Zone one is talking, zone two is building, zone three
   is what continues after we have gone - and knowing which of the three you are
   in tells you more than knowing you are on step seven.
--------------------------------------------------------------------------- */

export interface Stop {
  /**
   * The one thing the stop is, drawn.
   *
   * Held with the stop rather than mapped from its name in a view: an icon is
   * part of what a stop is, and a lookup keyed on wording breaks the first time
   * the wording changes.
   */
  icon: LucideIcon;
  /** `01` to `13`, as it is written. */
  ix: string;
  n: string;
  /** What actually happens, in one line. */
  sub: string;
  /** Set on the stops that change hands or state, which are drawn open. */
  mark?: "interchange" | "launch";
  /** How long it takes, where that is knowable. */
  takes?: string;
}

export interface Zone {
  key: string;
  n: string;
  /** What this stretch is for, in the reader's terms. */
  note: string;
  stops: Stop[];
}

export const ZONES: readonly Zone[] = [
  {
    key: "start",
    n: "Initial engagement",
    note: "Talking. Nothing is priced, nothing is committed, and either of us can say this is not a fit.",
    stops: [
      {
        icon: FileText,
        ix: "01",
        n: "Your initial submission",
        sub: "A scoped document from this site, or an email. Either arrives as words rather than as a form.",
        mark: "interchange",
      },
      {
        icon: CalendarClock,
        ix: "02",
        n: "Book a call",
        sub: "From the site, or we arrange a slot once we have read what you sent.",
        takes: "15 to 60 min",
      },
      {
        icon: FileSignature,
        ix: "03",
        n: "Pre-reads and questions",
        sub: "Where there is anything worth reading first, it goes out before the call rather than during it.",
      },
      {
        icon: MessagesSquare,
        ix: "04",
        n: "First requirements call",
        sub: "What the site has to do, who it is for, and what we would need from you.",
        mark: "interchange",
      },
      {
        icon: Mail,
        ix: "05",
        n: "Next steps and milestones",
        sub: "In writing, by email, so nothing rests on what somebody remembers of a call.",
      },
    ],
  },
  {
    key: "build",
    n: "Project delivery",
    note: "Building. Everything here is against a written scope, and you sign each milestone off as it lands.",
    stops: [
      {
        icon: ListChecks,
        ix: "06",
        n: "Requirements gathering",
        sub: "What you need and why, in detail. The part that decides whether the rest goes well.",
        mark: "interchange",
      },
      {
        icon: PenLine,
        ix: "07",
        n: "Scope, price, terms and milestones",
        sub: "Exactly what we will build, for what, and by when. Nothing starts until you accept it.",
      },
      {
        icon: Hammer,
        ix: "08",
        n: "Development and agreed services",
        sub: "The core build and anything agreed alongside it, delivered in milestones you can see.",
        takes: "4 to 6 weeks",
      },
      {
        icon: CheckCheck,
        ix: "09",
        n: "Sign off",
        sub: "Each milestone as it is delivered, rather than all of it at the end.",
      },
      {
        icon: Rocket,
        ix: "10",
        n: "Go live",
        sub: "The site launches, the accounts are in your name, and the checks are written down.",
        mark: "launch",
        takes: "One day",
      },
      {
        icon: LifeBuoy,
        ix: "11",
        n: "Early life support",
        sub: "Two weeks of close attention while real visitors arrive and the site settles.",
        takes: "2 weeks",
      },
    ],
  },
  {
    key: "after",
    n: "Post launch services",
    note: "What continues. Chosen rather than assumed, and priced separately from the build.",
    stops: [
      {
        icon: Server,
        ix: "12",
        n: "Hosting",
        sub: "We normally host, unless it is agreed otherwise. Either way the arrangement is written down.",
        mark: "interchange",
      },
      {
        icon: Sparkles,
        ix: "13",
        n: "Other agreed services",
        sub: "Care, content, search or continued development, at whatever level of cover you choose.",
      },
    ],
  },
];

/** Every stop, flat, for the counts and the index. */
export const STOPS: readonly Stop[] = ZONES.flatMap((zone) => zone.stops);
