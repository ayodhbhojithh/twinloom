import { makeReference } from "./reference";

/* ---------------------------------------------------------------------------
   Which desk this is.

   Everything one person writes and attaches in one sitting belongs together,
   and the thing that says so is a single reference made the first time it is
   asked for. Files uploaded before the name is typed and files uploaded after
   it land in the same folder, because the folder was never named after
   anything that changes.

   Kept exactly as long as the answers are, and in the same place - which used
   to mean a module variable, because that is where the answers used to live
   too. It is `sessionStorage` now, and it had to move with them.

   What that fixed: the answers began surviving a reload and this did not, so a
   reload minted a new reference against a run that already had one. Files
   uploaded before it went to a folder named after the old reference; the
   submission that followed quoted the new one, and the notification pointed the
   owner at a folder with nothing in it. A meeting booked against the first
   reference belonged to a submission that arrived under the second.

   A reference that outlives the answers is the mirror of that fault - it would
   file tomorrow's attachments under yesterday's submission - so the two share a
   lifetime rather than each having their own.
--------------------------------------------------------------------------- */

const KEY = "twinloom.build.desk";

let desk: string | null = null;
let read = false;

/** The reference for this desk, made on first use and kept for the visit. */
export function deskRef(): string {
  if (!desk && !read && typeof window !== "undefined") {
    read = true;

    try {
      desk = window.sessionStorage.getItem(KEY);
    } catch {
      /* Refused or unavailable. A fresh reference is the safe answer: it files
         this sitting under something rather than nothing. */
      desk = null;
    }
  }

  if (!desk) {
    desk = makeReference();

    try {
      window.sessionStorage.setItem(KEY, desk);
    } catch {
      /* The reference holds for this page either way; only surviving a reload
         is lost, which is where this started. */
    }
  }

  return desk;
}

/**
 * Whether anything has been filed under one yet.
 *
 * Asks storage as well as the module, or a reload would answer "no" about a
 * desk that already has files on it.
 */
export function hasDeskRef(): boolean {
  if (desk) return true;
  if (typeof window === "undefined") return false;

  try {
    return Boolean(window.sessionStorage.getItem(KEY));
  } catch {
    return false;
  }
}

/**
 * Start a new one.
 *
 * After a successful send, so that somebody who carries straight on into a
 * second submission does not have it filed under the first one's reference.
 */
export function newDesk(): void {
  desk = null;
  read = true;

  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* Nothing to do: the module has already forgotten it. */
  }
}
