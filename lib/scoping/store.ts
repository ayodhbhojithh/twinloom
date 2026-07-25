import type { ScopeAnswers } from "./types";

/* ---------------------------------------------------------------------------
   The answers, as one module level store.

   The journey and the Blueprint are two routes, so the answers cannot live in
   component state on one of them. Reading them through `useSyncExternalStore`
   lets React hydrate from an empty server snapshot and then swap in the stored
   one, with no mismatch and no setState inside an effect. Same arrangement as
   `lib/thoughts/store.ts`, for the same reasons.

   Session storage, not local: the spec keeps drafts for three days server side
   and nothing here should outlive the tab it was typed in.
--------------------------------------------------------------------------- */

const STORAGE_KEY = "tct.scope.v1";

export const EMPTY_ANSWERS: ScopeAnswers = {
  single: {},
  multi: {},
  effort: {},
  touched: [],
  assets: {},
  budget: 5000,
  free: "",
};

/** Frozen and stable, so the server snapshot never triggers a re-render. */
const SERVER_SNAPSHOT: ScopeAnswers = EMPTY_ANSWERS;

let snapshot: ScopeAnswers = EMPTY_ANSWERS;
let hydrated = false;

const listeners = new Set<() => void>();

function readStorage(): ScopeAnswers {
  if (typeof window === "undefined") return EMPTY_ANSWERS;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_ANSWERS;

    const parsed = JSON.parse(raw) as Partial<ScopeAnswers>;

    /* Read defensively: a session written by an older build must not be able to
       crash the page it is read on. */
    return {
      single: parsed.single ?? {},
      multi: parsed.multi ?? {},
      effort: parsed.effort ?? {},
      touched: Array.isArray(parsed.touched) ? parsed.touched : [],
      assets: parsed.assets ?? {},
      budget: parsed.budget === null ? null : (parsed.budget ?? 5000),
      free: typeof parsed.free === "string" ? parsed.free : "",
    };
  } catch {
    /* A malformed session is not worth failing over. Start clean. */
    return EMPTY_ANSWERS;
  }
}

function writeStorage(next: ScopeAnswers) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Storage can be full or blocked. The journey still works in memory. */
  }
}

function hydrateOnce() {
  if (hydrated) return;
  hydrated = true;
  snapshot = readStorage();
}

export function subscribe(listener: () => void): () => void {
  hydrateOnce();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): ScopeAnswers {
  hydrateOnce();
  return snapshot;
}

export function getServerSnapshot(): ScopeAnswers {
  return SERVER_SNAPSHOT;
}

export function updateAnswers(
  change: (current: ScopeAnswers) => ScopeAnswers,
): void {
  hydrateOnce();

  const next = change(snapshot);
  if (next === snapshot) return;

  snapshot = next;
  writeStorage(next);
  for (const listener of listeners) listener();
}
