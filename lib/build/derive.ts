import {
  ACTIONS,
  ALWAYS_PAGES,
  BANDS,
  GROUPS,
  STANDARD_COUNT,
  type VisitorAction,
  type VisitorGroup,
} from "./data";

/* ---------------------------------------------------------------------------
   What the answers add up to.

   Pure functions over a selection. Nothing here touches state or the DOM, so the
   build screen and the site screen can both ask the same questions and get the
   same answers, and the whole lot is testable without rendering anything.
--------------------------------------------------------------------------- */

/** Something the client wrote themselves, when the list did not have it. */
export interface OwnAction {
  key: string;
  name: string;
}

export interface Answers {
  /** Group keys, in the order they were named. */
  groups: readonly string[];
  /** Action keys, standard ones included. */
  actions: readonly string[];
  own: readonly OwnAction[];
}

export const EMPTY_ANSWERS: Answers = { groups: [], actions: [], own: [] };

export const findGroup = (key: string): VisitorGroup | undefined =>
  GROUPS.find((group) => group.key === key);

export const findAction = (key: string): VisitorAction | undefined =>
  ACTIONS.find((action) => action.key === key);

/**
 * What is on offer, given who has been named.
 *
 * Standard actions and conversations are always on offer. The catch-all arrives
 * as soon as anybody is named, and everything else waits for its group.
 */
export function offeredActions(groups: readonly string[]): VisitorAction[] {
  return ACTIONS.filter((action) => {
    if (action.need === "" || action.need === "talk") return true;
    if (action.need === "any") return groups.length > 0;
    return groups.includes(action.need);
  });
}

/**
 * Drops anything picked that nobody is left on the site to do.
 *
 * Taking a group away has to take its actions with it, or the site described back
 * would contain a page for a visitor the client has just said does not exist.
 */
export function pruneActions(
  groups: readonly string[],
  actions: readonly string[],
): string[] {
  const offered = new Set(offeredActions(groups).map((action) => action.key));
  return actions.filter((key) => offered.has(key));
}

export interface ActionBand {
  name: string;
  sub: string;
  items: VisitorAction[];
}

/**
 * The offered actions, grouped into bands in the prototype's order: the standard
 * set, then one band per named group, then the catch-all, then conversations.
 *
 * A band with nothing in it is not rendered. An empty heading is a promise that
 * something is coming, and here nothing is.
 */
export function actionBands(groups: readonly string[]): ActionBand[] {
  const offered = offeredActions(groups);
  const of = (need: string) =>
    offered.filter((action) => action.need === need);

  const bands: ActionBand[] = [];
  const push = (name: string, sub: string, items: VisitorAction[]) => {
    if (items.length) bands.push({ name, sub, items });
  };

  push(BANDS[""].name, BANDS[""].sub, of(""));

  for (const group of GROUPS) {
    if (groups.includes(group.key)) push(group.name, group.cta, of(group.key));
  }

  push(BANDS.any.name, BANDS.any.sub, of("any"));
  push(BANDS.talk.name, BANDS.talk.sub, of("talk"));

  return bands;
}

/** One page in the derived site. */
export interface DerivedPage {
  /** Its place in the whole site, "01" upwards, not in its zone. */
  index: string;
  name: string;
  /** The group that asked for it, named the way it reads in a sentence. */
  who?: string;
  /** Set on pages that are not scoped yet, which is the ones written in. */
  flag?: string;
}

export interface PageZone {
  key: string;
  title: string;
  sub: string;
  pages: DerivedPage[];
}

const ZONES: readonly { key: string; title: string; sub: string }[] = [
  { key: "always", title: "Always there", sub: "In every site we build." },
  {
    key: "who",
    title: "Who it is for",
    sub: "You named more than one group, so each gets a way in.",
  },
  {
    key: "do",
    title: "What they can do",
    sub: "Each action you picked needs somewhere to happen.",
  },
];

/**
 * The site the answers describe, as one numbered list split into zones.
 *
 * The numbering runs across the whole site rather than restarting in each zone,
 * because the number is the page's place in what is being built, and a client
 * counting pages is counting all of them.
 *
 * "Who it is for" only appears once more than one group is named: a site for one
 * audience does not need a way in per audience, it is the whole site.
 */
export function derivedPages(answers: Answers): PageZone[] {
  const flat: (DerivedPage & { zone: string })[] = [];
  const add = (zone: string, page: Omit<DerivedPage, "index">) =>
    flat.push({ ...page, zone, index: String(flat.length + 1).padStart(2, "0") });

  for (const name of ALWAYS_PAGES) add("always", { name });

  const named = answers.groups
    .map(findGroup)
    .filter((group): group is VisitorGroup => Boolean(group));

  if (named.length > 1) {
    for (const group of named) add("who", { name: group.short });
  }

  /* A picked thing needs somewhere to happen, and the page says who asked for
     it. Reading the offer rather than the answers means a page cannot survive
     the visitor it was for. */
  for (const action of offeredActions(answers.groups)) {
    if (!action.page || !answers.actions.includes(action.key)) continue;

    const owner =
      action.need && action.need !== "any" && action.need !== "talk"
        ? findGroup(action.need)?.attr
        : action.need === "any"
          ? "everybody"
          : undefined;

    add("do", { name: action.page, who: owner });
  }

  for (const entry of answers.own) {
    add("do", { name: entry.name, flag: "one to talk about" });
  }

  return ZONES.map((zone) => ({
    ...zone,
    pages: flat.filter((page) => page.zone === zone.key),
  })).filter((zone) => zone.pages.length > 0);
}

/** How many pages the answers have produced, across every zone. */
export function pageCount(answers: Answers): number {
  return derivedPages(answers).reduce(
    (total, zone) => total + zone.pages.length,
    0,
  );
}

export interface Tally {
  groups: number;
  things: number;
  pages: number;
  needs: number;
}

/**
 * The four numbers along the top of both screens.
 *
 * `things` counts what a visitor can do, including the standard set and anything
 * written in. `needs` is what we will have to ask the client for, which starts at
 * the six that are in every site and grows with each page their answers create.
 */
export function tally(answers: Answers): Tally {
  const pages = pageCount(answers);

  return {
    groups: answers.groups.length,
    things: answers.actions.length + answers.own.length,
    pages,
    needs: STANDARD_COUNT + Math.max(0, pages - ALWAYS_PAGES.length),
  };
}

/** "customers and business buyers", for reading a selection back as a sentence. */
export function namedGroups(answers: Answers): string {
  const names = answers.groups
    .map((key) => findGroup(key)?.attr)
    .filter((attr): attr is string => Boolean(attr));

  if (!names.length) return "nobody yet";
  if (names.length === 1) return names[0];

  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}
