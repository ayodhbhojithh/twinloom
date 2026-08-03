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
};

let answers: Answers = EMPTY;
const listeners = new Set<() => void>();

/**
 * One counter for everything anybody writes down, wherever they write it.
 *
 * The desk shows things back in the order they were put there rather than in
 * the order the code happens to hold them, and only a single sequence across
 * every list can do that.
 */
let seq = 0;

export function nextSeq() {
  seq += 1;
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

export function setSent(sent: boolean) {
  updateAnswers((current) => ({ ...current, sent }));
}
