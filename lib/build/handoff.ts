/* ---------------------------------------------------------------------------
   What the scoping run hands to the booking screen.

   The two were separate journeys that happened to sit on the same site: a
   visitor answered ten questions, asked for a time, and arrived at a booking
   flow that opened by asking what the meeting was about - the one thing it had
   just been told. Then it asked for their name and their email address, both of
   which were already on the desk, and the meeting that came out of it referred
   to nothing.

   This is the join. It carries the answers the booking screen would otherwise
   ask for again, and the reference the submission is known by, so the time that
   gets booked is visibly a time about that submission.

   `sessionStorage` rather than the address bar. A name and an email address in
   a URL end up in browser history and in the referrer of anything the page
   loads afterwards, and nothing here needs to survive being shared or
   bookmarked: it is a handover between two screens in one tab, and it should
   live exactly that long.
--------------------------------------------------------------------------- */

import { isReference } from "./reference";

export interface Handoff {
  /** The submission this booking is about. */
  ref: string;
  /** Which kind of meeting, in the booking flow's own vocabulary. */
  about: string;
  /** How long they asked to hold, if they said. */
  minutes?: number;
  name?: string;
  email?: string;
  company?: string;
}

const KEY = "twinloom.handoff";

/** Put it down on the way out of the run. */
export function carry(handoff: Handoff) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(handoff));
  } catch {
    /* Private browsing, a full quota, a browser that has turned it off. The
       booking screen simply asks the questions itself, which is what it did
       before any of this existed. */
  }
}

/**
 * Pick it up on the way into the booking screen.
 *
 * Read rather than consumed. Reloading a booking screen is an ordinary thing to
 * do, and one that forgot which submission it was against would be worse than
 * one that never knew.
 */
export function collect(): Handoff | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;

    const seen: unknown = JSON.parse(raw);
    if (!seen || typeof seen !== "object") return null;

    const it = seen as Record<string, unknown>;

    /* Checked rather than trusted. It is our own writing, but it is writing in
       a store any script on this origin can reach, and a reference decides what
       a meeting says it is about. */
    if (!isReference(it.ref) || typeof it.about !== "string") return null;

    const minutes = Number(it.minutes);

    return {
      ref: it.ref,
      about: it.about,
      minutes: Number.isFinite(minutes) ? minutes : undefined,
      name: typeof it.name === "string" ? it.name : undefined,
      email: typeof it.email === "string" ? it.email : undefined,
      company: typeof it.company === "string" ? it.company : undefined,
    };
  } catch {
    return null;
  }
}

/** Forget it, once the meeting it was for has been booked. */
export function drop() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* Nothing to do about it, and nothing depends on it. */
  }
}
