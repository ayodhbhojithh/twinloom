import { PRE_TICKED } from "./data";
import { EMPTY_ANSWERS, type Answers } from "./derive";

/* ---------------------------------------------------------------------------
   The answers, as one module level store.

   The build screen collects them and the site screen reads them, and those are
   two routes, so they cannot live in either one's component state. Reading them
   through `useSyncExternalStore` also lets React hydrate from an empty server
   snapshot and swap in the stored one, with no mismatch and no setState in an
   effect.

   Session storage, not local: this is one sitting's thinking, and it should not
   be waiting in the browser a fortnight later pretending to be current.
--------------------------------------------------------------------------- */

const STORAGE_KEY = "vgwc.build.v1";

/** Three ways of getting in touch start ticked, as the prototype starts them. */
const INITIAL: Answers = {
  groups: [],
  actions: [...PRE_TICKED],
  own: [],
};

/** Frozen and stable, so the server snapshot never triggers a re-render. */
const SERVER_SNAPSHOT: Answers = EMPTY_ANSWERS;

let snapshot: Answers = INITIAL;
let hydrated = false;

const listeners = new Set<() => void>();

function read(): Answers {
  if (typeof window === "undefined") return INITIAL;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;

    const parsed = JSON.parse(raw) as Partial<Answers>;

    /* Read defensively: a session written by an older build must not be able to
       crash the screen it is read into. */
    return {
      groups: Array.isArray(parsed.groups) ? parsed.groups : [],
      actions: Array.isArray(parsed.actions) ? parsed.actions : [],
      own: Array.isArray(parsed.own) ? parsed.own : [],
    };
  } catch {
    return INITIAL;
  }
}

function write(next: Answers) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Storage can be full or blocked. The tool still works in memory. */
  }
}

function hydrateOnce() {
  if (hydrated) return;
  hydrated = true;
  snapshot = read();
}

export function subscribe(listener: () => void): () => void {
  hydrateOnce();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): Answers {
  hydrateOnce();
  return snapshot;
}

export function getServerSnapshot(): Answers {
  return SERVER_SNAPSHOT;
}

export function updateAnswers(change: (current: Answers) => Answers): void {
  hydrateOnce();

  const next = change(snapshot);
  if (next === snapshot) return;

  snapshot = next;
  write(next);
  for (const listener of listeners) listener();
}

export function resetAnswers(): void {
  updateAnswers(() => INITIAL);
}
