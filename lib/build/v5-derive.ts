/* ---------------------------------------------------------------------------
   Answers, turned into a website.

   Every rule here is the prototype's, kept in one file so the running panel,
   the read-back and the submit screen cannot disagree about what has been said.
   None of it is stored: a derived answer that is also written down is two
   answers waiting to drift apart.
--------------------------------------------------------------------------- */

import {
  ACTIONS,
  ALWAYS_PAGES,
  ASSUMPTIONS,
  FEELS,
  GROUPS,
  LAYOUTS,
  PAY_WAYS,
  REQUIRED,
  SELL_KINDS,
  STEPS,
  ZONES,
  type Action,
  type Group,
  type SellKind,
} from "./v5";
import { chipsIn, isOn, picked, type Answers } from "./v5-store";

export const ACTION_BY: Record<string, Action> = Object.fromEntries(
  ACTIONS.map((action) => [action.k, action]),
);
export const GROUP_BY: Record<string, Group> = Object.fromEntries(
  GROUPS.map((group) => [group.k, group]),
);
export const SELL_BY: Record<string, SellKind> = Object.fromEntries(
  SELL_KINDS.map((kind) => [kind.k, kind]),
);
export const PAY_BY: Record<string, SellKind> = Object.fromEntries(
  PAY_WAYS.map((way) => [way.k, way]),
);

export const STEP_ORDER: readonly string[] = STEPS.map((step) => step.k);

/** One page of the described site. */
export interface Page {
  /** Which zone it belongs to. */
  area: string;
  name: string;
  /** Who asked for it, where a group or an answer did. */
  forWhom: string;
  /** Set on the pages that are there whatever anybody answers. */
  always: boolean;
  /** Its place in the site, as `01`. */
  index: string;
}

/**
 * The site the answers describe.
 *
 * Named pages, de-duplicated, in the order they were asked for. A page asked
 * for twice keeps its first home rather than turning up in two zones, which is
 * why the shop does not appear again under what you sell.
 */
export function pagesFrom(a: Answers): Page[] {
  const out: Page[] = [];
  const seen = new Set<string>();

  const add = (area: string, name: string, forWhom = "", always = false) => {
    if (!name || seen.has(name)) return;
    seen.add(name);
    out.push({ area, name, forWhom, always, index: "" });
  };

  for (const name of ALWAYS_PAGES) add("always", name, "", true);

  /* One group named needs no way in of its own: the whole site is for them.
     Two or more, and each gets a door. */
  const groups = picked(a, "who").filter((key) => GROUP_BY[key]);
  if (groups.length > 1) {
    for (const key of groups) {
      for (const page of GROUP_BY[key].pages) add("who", page, GROUP_BY[key].n);
    }
  }

  for (const action of ACTIONS) {
    if (!isOn(a, "do", action.k)) continue;
    for (const page of action.pages) add("do", page, action.n);
  }

  for (const kind of SELL_KINDS) {
    if (!isOn(a, "sell", kind.k)) continue;
    for (const page of kind.pages) add("sell", page, kind.n);
  }

  for (const way of PAY_WAYS) {
    if (!isOn(a, "pay", way.k)) continue;
    for (const page of way.pages) add("sell", page, way.n);
  }

  return out.map((page, at) => ({
    ...page,
    index: String(at + 1).padStart(2, "0"),
  }));
}

export interface Zone {
  key: string;
  title: string;
  note: string;
  pages: Page[];
}

/** The same pages, grouped by what put each one there. Empty zones are dropped. */
export function zonesFrom(pages: Page[]): Zone[] {
  return ZONES.map(([key, title, note]) => ({
    key,
    title,
    note,
    pages: pages.filter((page) => page.area === key),
  })).filter((zone) => zone.pages.length > 0);
}

/**
 * Whether one of the four things we actually need has been given.
 *
 * The email is checked for shape rather than length, because a name with no
 * `@` in it is not a short email address, it is not an email address.
 */
export function askDone(a: Answers, field: string) {
  if (field === "part") return chipsIn(a, "ask.part").length > 0;

  const value = a.ask[field] ?? "";
  if (field === "email") return /.+@.+\..+/.test(value);
  return value.length > 1;
}

export type Met = boolean | "na";

export interface Readiness {
  met: { who: Met; do: Met; sell: Met; you: Met };
  state: "ready" | "near" | "thin";
}

/**
 * How much of an answer this is.
 *
 * Three values per line, not two. A thing can be answered, still missing, or
 * not yours to answer at all, and a shop question when there is no shop is the
 * third of those. Showing it as answered would be claiming somebody said
 * something they never said, so `na` counts toward the state without ever
 * being written down as a claim.
 */
export function readiness(a: Answers): Readiness {
  const met = {
    who: a.short || picked(a, "who").length > 0,
    do:
      a.short ||
      picked(a, "do").some((key) => {
        const action = ACTION_BY[key];
        return action && action.pre !== "fix" && action.pre !== "tick";
      }),
    sell: !isOn(a, "do", "buy")
      ? ("na" as Met)
      : picked(a, "sell").length > 0,
    you: REQUIRED.every((field) => askDone(a, field)),
  };

  const n = Object.values(met).filter(Boolean).length;
  return { met, state: n === 4 ? "ready" : n === 3 ? "near" : "thin" };
}

/** What has actually been said, as lines. `true` marks a ticked one. */
export function told(a: Answers): { tick: boolean; line: string }[] {
  const out: { tick: boolean; line: string }[] = [];

  const groups = picked(a, "who").map((key) => GROUP_BY[key]?.n ?? key);
  if (groups.length) out.push({ tick: true, line: `For ${groups.join(", ")}` });

  const doing = picked(a, "do").filter((key) => ACTION_BY[key]);
  if (doing.length) {
    out.push({
      tick: true,
      line: doing.map((key) => ACTION_BY[key].n).join("; "),
    });
  }

  const selling = picked(a, "sell").map((key) => SELL_BY[key]?.n ?? key);
  if (selling.length) {
    out.push({ tick: true, line: `You sell: ${selling.join(", ")}` });
  }

  const layout = picked(a, "layout");
  if (layout.length) {
    out.push({
      tick: true,
      line: `Layout: ${LAYOUTS[layout[0]] ?? layout[0]}`,
    });
  }

  const feel = picked(a, "feel");
  if (feel.length) {
    out.push({
      tick: true,
      line: `It should feel: ${feel.map((key) => FEELS[key] ?? key).join(", ")}`,
    });
  }

  const order = a.order.filter((key) => ACTION_BY[key]);
  if (order.length) {
    out.push({
      tick: true,
      line: `The home page leads with ${ACTION_BY[order[0]].n.toLowerCase()}`,
    });
  }

  for (const listId of Object.keys(a.own)) {
    for (const said of a.own[listId]) {
      out.push({ tick: false, line: `${said} - in your words` });
    }
  }

  /* The freeflow box is counted, not summarised. A write-up in somebody's own
     words is the one answer here that should not be turned into a phrase by
     us: the panel says it is there and how long it is, and the document
     carries it whole. */
  const words = (a.text["quick.words"] ?? "").trim();
  if (words) {
    out.push({
      tick: true,
      line: `You wrote it in your own words - ${words.split(/\s+/).length} words, kept as you typed them`,
    });
  }

  if (a.short) {
    out.push({ tick: true, line: "You sent it as a quick submission, on purpose." });
  }

  return out;
}

/**
 * What we will take as read.
 *
 * A step walked past is not a hole. It becomes a sentence, written in the
 * reader's own terms, so a run-through with half of it skipped still describes
 * a website rather than listing what is absent.
 */
export function assumed(a: Answers): string[] {
  return STEPS.filter((step) => ASSUMPTIONS[step.k] && !a.touched[step.k]).map(
    (step) => ASSUMPTIONS[step.k],
  );
}

/** The actions ticked, in the order they will be met. */
export function orderedActions(a: Answers) {
  const chosen = picked(a, "do").filter((key) => ACTION_BY[key]);
  const kept = a.order.filter((key) => chosen.includes(key));
  const rest = chosen.filter((key) => !kept.includes(key));
  return [...kept, ...rest];
}
