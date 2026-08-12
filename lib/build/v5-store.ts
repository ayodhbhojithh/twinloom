/* ---------------------------------------------------------------------------
   Everything anybody has said, in one place.

   A module store rather than React state, for the same reason the older tool
   used one: the run-through, the panel beside it and the read-back at the end
   are three views of one answer, and passing it down through twelve steps would
   make every one of them a prop drilling exercise.

   `useSyncExternalStore` reads it. The server snapshot is a frozen empty
   answer, because none of this exists until a browser does and rendering a
   guess would hand hydration a mismatch.
--------------------------------------------------------------------------- */

/** Something put on the desk: a note, a file to send, a link. */
export interface Ref {
  /** The kind, as its label rather than its key, since that is what is shown. */
  kind: string;
  text: string;
  /** Where it was written, so it files under the answer rather than in a pile. */
  where: Where | null;
  /** One counter across the whole desk, so things come back in the order written. */
  n: number;
  /** Set when the ref stands for an attachment promised by a specific control. */
  tie?: string;
  /**
   * Where an attached file is, once it has been uploaded.
   *
   * On the ref rather than only in the control that took the file, because the
   * refs are what get submitted. Held in component state alone, every link
   * died with the tab and the scope that arrived listed file names nobody
   * could open.
   */
  url?: string;
  /** What Cloudinary calls it, for finding it in the media library. */
  publicId?: string;
}

/** Where in the run-through something was written down. */
export interface Where {
  stepKey?: string;
  step?: string;
  cardId?: string;
  card?: string;
  qid?: string;
  q?: string;
}

export interface Answers {
  /** scope -> key -> ticked. Ticks and option rows. */
  pick: Record<string, Record<string, boolean>>;
  /** question -> value -> chosen. Chips inside a question. */
  chip: Record<string, Record<string, boolean>>;
  /** question -> what was written. */
  text: Record<string, string>;
  /** list id -> the words put in it, in the order they were written. */
  own: Record<string, string[]>;
  /** field -> value, for the four things we have to ask. */
  ask: Record<string, string>;
  refs: Ref[];
  /** Keys from "what they can do", in the order they should be met. */
  order: string[];
  /** ref number -> what you like about it. */
  like: Record<number, string>;
  /** The short way round, taken on purpose. */
  short: boolean;
  /** step -> touched. Touching a question is what makes a step answered. */
  touched: Record<string, boolean>;
  /** Yes, no, or not asked yet. */
  keep: boolean | null;
  sent: boolean;
  /** True while the request is in the air, so the button cannot be pressed twice. */
  sending: boolean;
  /** What went wrong, in words, or null. Cleared on the next attempt. */
  problem: string | null;
  /** The reference that came back, so the sent screen can quote it. */
  ref: string | null;
  /**
   * A print of the answers as they were when they were last sent.
   *
   * What it is for: telling an edit from a re-read. Somebody who sends, presses
   * "Edit your submission" and then changes nothing has nothing to send - and
   * pressing send anyway puts a second identical document in the inbox under
   * the same reference, which is a duplicate whichever way it is read.
   *
   * A print rather than a flag, because "changed" is not a thing that can be
   * observed at the moment of change: an answer ticked and unticked again is
   * two changes and no difference. Comparing what is there now against what
   * went is the only test that gets that right.
   */
  stamp: string | null;
  /**
   * The meeting, once one has been booked from inside this run.
   *
   * Written by the booking page and read back here, which is the only way round
   * that works: the two are separate routes, and by the time the run is on
   * screen again the booking page has gone. It travels in the answers because
   * the answers are what survive the trip - see the keeping below.
   *
   * Formatted rather than an instant. What this is for is being read back on the
   * submit step, and the page that booked it has the reader's own locale, clock
   * and zone in front of it; this one would have to work all three out again to
   * say the same sentence.
   */
  booked: {
    /** The meeting's name, as its own screen said it. */
    what: string;
    minutes: number;
    /** The date and time, already written for the reader who booked it. */
    when: string;
    /**
     * The submission this meeting was booked against.
     *
     * The same reference the receipt and the invitation both carry, so the three
     * can be put side by side. It comes from the handover rather than from the
     * desk, because the handover is what the meeting was actually booked
     * against - if the two ever differed, the one the calendar knows about is
     * the true one.
     */
    ref: string;
  } | null;
}

const EMPTY: Answers = {
  pick: {},
  chip: {},
  text: {},
  own: {},
  ask: {},
  refs: [],
  order: [],
  like: {},
  short: false,
  touched: {},
  keep: null,
  sent: false,
  sending: false,
  problem: null,
  ref: null,
  stamp: null,
  booked: null,
};

/* ------------------------------------------------------------------ keeping

   Everything above is held for the life of a tab rather than the life of a
   render, and until now that meant the life of a *page*: a reload, a back
   button, or a trip to the booking page and back emptied ten steps of work with
   no warning and no way to recover it. Somebody who answered eight questions and
   pressed refresh started again from nothing.

   `sessionStorage` rather than `localStorage`, deliberately. This holds a name,
   an email address, a phone number and a description of somebody's business, and
   the right lifetime for that is the visit it was typed in: it survives reloads
   and navigation, and it is gone when the tab is closed. A run left on a shared
   machine should not be readable a week later.

   Written on every change rather than on a timer. The object is a few kilobytes
   of plain data and `JSON.stringify` on it is measured in microseconds, so there
   is nothing to schedule - and a debounce is a window in which a refresh loses
   the last thing somebody typed, which is the one moment this exists for.

   Two things are deliberately not kept: `sending`, because a request cannot
   still be in flight in a page that has been reloaded, and `problem`, because a
   failure from before the reload is not a failure of anything now on screen.
   Everything else, `sent` and `ref` included, so a confirmation survives a
   reload as well as the answers do.
--------------------------------------------------------------------------- */

const KEY = "twinloom.build";

/** The counter travels with the answers, or two refs written either side of a
 *  reload would both be number one. */
interface Kept {
  answers: Answers;
  seq: number;
}

function load(): Kept | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;

    const held = JSON.parse(raw) as Partial<Kept>;
    if (!held?.answers) return null;

    return {
      /* Spread over `EMPTY` rather than trusted whole: what was written may have
         been written by an older version of this file, and a missing key is a
         crash at the first read rather than a mildly stale answer. */
      answers: {
        ...EMPTY,
        ...held.answers,
        sending: false,
        problem: null,
      },
      seq: typeof held.seq === "number" ? held.seq : 0,
    };
  } catch {
    /* Unreadable, from a half-written record or a browser refusing storage.
       Treated as nothing kept, which is where everybody started anyway. */
    return null;
  }
}

const kept = load();

let answers: Answers = kept?.answers ?? EMPTY;
const listeners = new Set<() => void>();

function keep() {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({
        answers: { ...answers, sending: false, problem: null },
        seq,
      }),
    );
  } catch {
    /* Full, or refused. The run carries on in memory exactly as it did before
       any of this was written - the only thing lost is surviving a reload, and
       there is nothing useful to say about that at this moment. */
  }
}

import { newDesk } from "./desk";

/* --------------------------------------------------------------- the place

   Which of the two routes is open, and which step is on screen.

   Kept for the same reason the answers are, and it was the half that was
   missing: with the answers restored and the place forgotten, a reload put
   somebody back at the two doors with eight steps of work behind a screen they
   had to find their way to again. Restoring what was typed and losing where they
   were is arguably worse than losing both, because the run looks untouched.

   Held here rather than in the components that read it - the tab lives in
   `flow`, the route in `quick`, and the step in `flow` again - because it is one
   fact about one visit, and three pieces of component state cannot be written to
   one record without something owning it.

   A separate key from the answers. They change at different rates: a step
   changes on every press of an arrow and the answers do not, and one record
   rewritten for both means the larger of the two is serialised every time
   somebody moves.
--------------------------------------------------------------------------- */

/** Which route is open, and how far along it. */
export interface Place {
  tab: "quick" | "full";
  /** Whether the quick pane is showing the two doors or the writing box. */
  route: "choose" | "quick";
  step: number;
}

const PLACE: Place = { tab: "quick", route: "choose", step: 0 };
const PLACE_KEY = "twinloom.build.place";

function loadPlace(): Place {
  if (typeof window === "undefined") return PLACE;

  try {
    const raw = window.sessionStorage.getItem(PLACE_KEY);
    if (!raw) return PLACE;

    const held = JSON.parse(raw) as Partial<Place>;

    return {
      tab: held.tab === "full" ? "full" : "quick",
      route: held.route === "quick" ? "quick" : "choose",
      step: typeof held.step === "number" && held.step >= 0 ? held.step : 0,
    };
  } catch {
    return PLACE;
  }
}

let place: Place = loadPlace();
const placeListeners = new Set<() => void>();

export const getPlace = () => place;
export const getServerPlace = () => PLACE;

export function subscribePlace(listener: () => void) {
  placeListeners.add(listener);
  return () => {
    placeListeners.delete(listener);
  };
}

export function setPlace(change: Partial<Place>) {
  const next = { ...place, ...change };

  if (
    next.tab === place.tab &&
    next.route === place.route &&
    next.step === place.step
  ) {
    return;
  }

  place = next;

  try {
    window.sessionStorage.setItem(PLACE_KEY, JSON.stringify(place));
  } catch {
    /* As with the answers: the visit carries on, only the reload is lost. */
  }

  for (const listener of placeListeners) listener();
}

/**
 * A meeting was booked against this run.
 *
 * Called from the booking page, which is a different route in the same tab -
 * the store is a module, so it is the same store, and what it writes is kept
 * for the visit like everything else.
 */
export function setBooked(booked: Answers["booked"]) {
  updateAnswers((current) => ({ ...current, booked }));
}

/** Empty the kept run. Called once a submission has landed - see `submit`. */
export function forgetAnswers() {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(KEY);
    window.sessionStorage.removeItem(PLACE_KEY);
    /* And the reference the answers were filed under. It is kept in its own
       module because uploads need it before there are any answers, but it has
       the same lifetime as they do - see `lib/build/desk`. */
    window.sessionStorage.removeItem("twinloom.build.desk");
  } catch {
    /* Nothing to do, and nothing depends on it: what is in memory is what the
       page is showing. */
  }
}

/**
 * One counter for everything anybody writes down, wherever they write it.
 *
 * The desk shows things back in the order they were put there rather than in
 * the order the code happens to hold them, and only a single sequence across
 * every list can do that.
 */
let seq = kept?.seq ?? 0;

export function nextSeq() {
  seq += 1;
  keep();
  return seq;
}

export function getAnswers() {
  return answers;
}

export function getServerAnswers() {
  return EMPTY;
}

export function subscribeAnswers(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function updateAnswers(change: (current: Answers) => Answers) {
  const next = change(answers);
  if (next === answers) return;
  answers = next;
  keep();
  for (const listener of listeners) listener();
}

/* ------------------------------------------------------------------ reads */

export function isOn(a: Answers, scope: string, key: string) {
  return Boolean(a.pick[scope]?.[key]);
}

/** Everything ticked in a scope, in no particular order. */
export function picked(a: Answers, scope: string) {
  const held = a.pick[scope];
  if (!held) return [] as string[];
  return Object.keys(held).filter((key) => held[key]);
}

export function chipOn(a: Answers, question: string, value: string) {
  return Boolean(a.chip[question]?.[value]);
}

export function chipsIn(a: Answers, question: string) {
  const held = a.chip[question];
  if (!held) return [] as string[];
  return Object.keys(held).filter((value) => held[value]);
}

/* ----------------------------------------------------------------- writes */

/**
 * Touching a question is what makes a step answered.
 *
 * Not arriving at it, and not filling it in either. A step somebody worked
 * through and deliberately left empty has been answered "none of these", which
 * is a real answer; a step they never opened has not.
 */
export function touchStep(step: string | undefined) {
  if (!step) return;
  updateAnswers((current) =>
    current.touched[step]
      ? current
      : { ...current, touched: { ...current.touched, [step]: true } },
  );
}

export function setPick(
  scope: string,
  key: string,
  value: boolean,
  /** One answer only: choosing clears the rest of the scope. */
  one?: boolean,
) {
  updateAnswers((current) => ({
    ...current,
    pick: {
      ...current.pick,
      [scope]: one
        ? { [key]: value }
        : { ...(current.pick[scope] ?? {}), [key]: value },
    },
  }));
}

export function togglePick(scope: string, key: string, step?: string) {
  setPick(scope, key, !isOn(answers, scope, key));
  touchStep(step);
}

export function setChip(
  question: string,
  value: string,
  next: boolean,
  one?: boolean,
) {
  updateAnswers((current) => ({
    ...current,
    chip: {
      ...current.chip,
      [question]: one
        ? { [value]: next }
        : { ...(current.chip[question] ?? {}), [value]: next },
    },
  }));
}

export function toggleChip(
  question: string,
  value: string,
  one?: boolean,
  step?: string,
) {
  setChip(question, value, one ? true : !chipOn(answers, question, value), one);
  touchStep(step);
}

export function setText(question: string, value: string, step?: string) {
  updateAnswers((current) => ({
    ...current,
    text: { ...current.text, [question]: value },
  }));
  touchStep(step);
}

export function setAsk(field: string, value: string) {
  updateAnswers((current) => ({
    ...current,
    ask: { ...current.ask, [field]: value.trim() },
  }));
}

export function addOwn(listId: string, words: string, step?: string) {
  const said = words.replace(/\s+/g, " ").trim();
  if (!said) return;

  updateAnswers((current) => ({
    ...current,
    own: { ...current.own, [listId]: [...(current.own[listId] ?? []), said] },
  }));
  touchStep(step);
}

export function dropOwn(listId: string, at: number) {
  updateAnswers((current) => ({
    ...current,
    own: {
      ...current.own,
      [listId]: (current.own[listId] ?? []).filter((_, i) => i !== at),
    },
  }));
}

export function addRef(ref: Omit<Ref, "n">, step?: string) {
  updateAnswers((current) => ({
    ...current,
    refs: [...current.refs, { ...ref, n: nextSeq() }],
  }));
  touchStep(step);
}

export function dropRef(n: number) {
  updateAnswers((current) => ({
    ...current,
    refs: current.refs.filter((ref) => ref.n !== n),
    like: { ...current.like, [n]: "" },
  }));
}

/** Drop whatever ref a given control put on the desk, when it is untoggled. */
export function dropRefTied(tie: string) {
  updateAnswers((current) => ({
    ...current,
    refs: current.refs.filter((ref) => ref.tie !== tie),
  }));
}

export function setLike(n: number, words: string) {
  updateAnswers((current) => ({
    ...current,
    like: { ...current.like, [n]: words },
  }));
}

export function setOrder(order: string[]) {
  updateAnswers((current) => ({ ...current, order }));
}

export function setShort(short: boolean) {
  updateAnswers((current) => ({ ...current, short }));
}

export function setKeep(keep: boolean) {
  updateAnswers((current) => ({ ...current, keep }));
}

/**
 * A reference from somewhere other than a send.
 *
 * Set when somebody opens the link in their receipt: it puts the run into the
 * state it would be in after a send - `ref` set, `stamp` null - so the submit
 * step reads as a second version of something rather than a first submission,
 * and what goes out is marked as a follow-up. See `adoptDesk`, which is the
 * other half: this is what the reader sees, that is what the payload carries.
 */
export function adoptRef(ref: string) {
  updateAnswers((current) => ({ ...current, ref, sent: false, stamp: null }));
}

export function setSent(sent: boolean) {
  updateAnswers((current) => ({ ...current, sent }));
}

/** In the air. Clears whatever went wrong last time, since this is a new try. */
export function setSending(sending: boolean) {
  updateAnswers((current) => ({
    ...current,
    sending,
    problem: sending ? null : current.problem,
  }));
}

export function setProblem(problem: string | null) {
  updateAnswers((current) => ({ ...current, problem, sending: false }));
}

/** It went. The reference is what somebody can quote back at us. */
export function setDelivered(ref: string) {
  updateAnswers((current) => ({
    ...current,
    ref,
    sent: true,
    sending: false,
    problem: null,
    /* Taken from the answers as they are at this instant, which is what was
       sent. Anything that happens after this makes the print stale, and stale is
       exactly what "there is something new to send" means. */
    stamp: printOf(current),
  }));
}

/**
 * The answers, as one string, for comparing one moment against another.
 *
 * Only the parts somebody can change. `sent`, `sending`, `problem`, `ref` and
 * the print itself are all facts about sending rather than about the answers,
 * and including any of them would make every send look like a change.
 *
 * Keys are sorted at every level. Object key order in JavaScript is insertion
 * order, so two identical sets of answers reached by different routes -
 * ticking A then B, or B then A - serialise differently and would read as an
 * edit. Sorting makes the string a function of the content and nothing else.
 */
function printOf(a: Answers): string {
  const stable = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(stable);

    if (value && typeof value === "object") {
      const held = value as Record<string, unknown>;
      return Object.fromEntries(
        Object.keys(held)
          .sort()
          .map((key) => [key, stable(held[key])]),
      );
    }

    return value;
  };

  return JSON.stringify(
    stable({
      pick: a.pick,
      chip: a.chip,
      text: a.text,
      own: a.own,
      ask: a.ask,
      refs: a.refs,
      order: a.order,
      like: a.like,
      short: a.short,
      keep: a.keep,
      booked: a.booked,
    }),
  );
}

/**
 * Whether there is anything to send that has not been sent.
 *
 * True where nothing has gone yet - a first submission is always worth
 * sending - and after that only where the answers differ from the print taken
 * when they last went.
 */
export function unsent(a: Answers): boolean {
  if (!a.ref || !a.stamp) return true;
  return printOf(a) !== a.stamp;
}

/**
 * Put everything back, and start a new piece of work.
 *
 * Not a reset of the form: a new reference as well, because the reference is
 * what says one desk is one submission. Carrying the old one into a fresh set
 * of answers would file a second piece of work under the first one's number,
 * which is the fault this is the opposite of.
 */
export function startOver() {
  seq = 0;
  answers = EMPTY;

  newDesk();
  setPlace({ tab: "quick", route: "choose", step: 0 });

  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* The memory is already empty, which is what the page is drawing from. */
  }

  for (const listener of listeners) listener();
}
