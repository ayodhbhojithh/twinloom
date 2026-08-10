import type { Where } from "./v5-store";

/* ---------------------------------------------------------------------------
   Where the desk is being written from.

   Not to be confused with `desk.ts`, which is the desk's reference - the name
   everything written in one sitting is filed under. This is the other half:
   what the desk knows about the page it is currently hanging off.

   The desk itself is site-wide now. It hangs off the edge of every page rather
   than off the edge of the run-through, so somebody who wants to write
   something down does not have to find the tool first. What it holds - the
   notes and the files - was always global, in `v5-store`.

   What was not global is the context. Three things only make sense while the
   run-through is on screen: which step is being stood on, so a note files
   under that answer rather than in a pile at the end; whether there are
   derived pages worth a second tab; and how to open a step when a note is
   clicked. Those are the flow's to know and the dock's to use.

   So the flow publishes them while it is mounted and takes them back on the
   way out, and the dock reads them. Off the build page they are all empty,
   which the panel already handles: it files under General, shows one tab, and
   has nowhere of its own to jump to.

   The same shape as `v5-store` deliberately - a value, a set of listeners, a
   snapshot getter - because it is read the same way, through
   `useSyncExternalStore`.
--------------------------------------------------------------------------- */

/** The two panels, named here as well so this store does not have to
    import from a component to describe its own field. */
export type DeskFace = "site" | "notes";

export interface DeskContext {
  /** The step being stood on, or nothing if the run-through is not open. */
  where: Where | null;
  /** Whether the derived site is worth its own tab. */
  withSite: boolean;
  /** How to open a step, when there is a run-through listening. */
  goStep: ((key: string) => void) | null;
  /**
   * A panel somebody has asked to be opened, and the count of asks.
   *
   * The flow no longer owns which panel is open - the dock does, because
   * the dock is fixed to the window and lays out nothing inside the tool.
   * But the door into the guided run still has to be able to open the site
   * tab as it goes, because that door's whole promise is that the site
   * your answers describe is shown beside them while you answer.
   *
   * The count is what makes it fire twice. A field holding only the name
   * would be unchanged on a second ask for the same panel, and the dock
   * would not hear it - somebody who closed the panel and pressed the door
   * again would get nothing.
   */
  wants: DeskFace | null;
  asked: number;
}

const EMPTY: DeskContext = {
  where: null,
  withSite: false,
  goStep: null,
  wants: null,
  asked: 0,
};

let here: DeskContext = EMPTY;
const listeners = new Set<() => void>();

export function getDeskContext() {
  return here;
}

/**
 * On the server no flow is mounted and nothing is published, so this is always
 * at its defaults - and it has to be the same object every time, or
 * `useSyncExternalStore` sees a new snapshot on every render and loops.
 */
export function getServerDeskContext() {
  return EMPTY;
}

export function subscribeDeskContext(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Publish what the flow knows. Called on mount and whenever the step moves. */
export function setDeskContext(next: Omit<DeskContext, "wants" | "asked">) {
  if (
    next.where?.stepKey === here.where?.stepKey &&
    next.withSite === here.withSite &&
    next.goStep === here.goStep
  ) {
    return;
  }
  /* The request rides along untouched: publishing where the reader is
     standing must not cancel a panel they just asked for. */
  here = { ...next, wants: here.wants, asked: here.asked };
  for (const listener of listeners) listener();
}

/** Ask the dock to open a panel. */
export function askDeskFace(face: DeskFace) {
  here = { ...here, wants: face, asked: here.asked + 1 };
  for (const listener of listeners) listener();
}

/** And take it back, when the flow goes. */
export function clearDeskContext() {
  if (here === EMPTY) return;
  here = EMPTY;
  for (const listener of listeners) listener();
}
