import type { StoredThoughts } from "./types";

/* ---------------------------------------------------------------------------
   The serialisable half of the session, as one module level store.

   It is a store rather than component state for two reasons. The spec calls for
   a single session that survives navigation, and reading persisted state through
   `useSyncExternalStore` lets React hydrate from an empty server snapshot and
   then swap in the stored one, with no mismatch and no setState inside an effect.
--------------------------------------------------------------------------- */

const STORAGE_KEY = "tct.thoughts.v1";

const EMPTY: StoredThoughts = { colours: [], links: [], notes: "" };

/** Frozen and stable, so the server snapshot never triggers a re-render. */
const SERVER_SNAPSHOT: StoredThoughts = EMPTY;

let snapshot: StoredThoughts = EMPTY;
let hydrated = false;

const listeners = new Set<() => void>();

function readStorage(): StoredThoughts {
  if (typeof window === "undefined") return EMPTY;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;

    const parsed = JSON.parse(raw) as Partial<StoredThoughts>;

    return {
      colours: Array.isArray(parsed.colours) ? parsed.colours : [],
      links: Array.isArray(parsed.links) ? parsed.links : [],
      notes: typeof parsed.notes === "string" ? parsed.notes : "",
    };
  } catch {
    /* A malformed session is not worth failing over. Start clean. */
    return EMPTY;
  }
}

function writeStorage(next: StoredThoughts) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Storage can be full or blocked. The session still works in memory. */
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

export function getSnapshot(): StoredThoughts {
  hydrateOnce();
  return snapshot;
}

export function getServerSnapshot(): StoredThoughts {
  return SERVER_SNAPSHOT;
}

export function update(
  change: (current: StoredThoughts) => StoredThoughts,
): void {
  hydrateOnce();

  const next = change(snapshot);
  if (next === snapshot) return;

  snapshot = next;
  writeStorage(next);
  for (const listener of listeners) listener();
}
