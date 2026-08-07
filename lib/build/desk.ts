import { makeReference } from "./reference";

/* ---------------------------------------------------------------------------
   Which desk this is.

   Everything one person writes and attaches in one sitting belongs together,
   and the thing that says so is a single reference made the first time it is
   asked for. Files uploaded before the name is typed and files uploaded after
   it land in the same folder, because the folder was never named after
   anything that changes.

   Held in the module rather than in storage, which is where the answers
   themselves are held: a desk lasts exactly as long as the answers on it do,
   and a reference that outlived them would file tomorrow's attachments under
   yesterday's submission.
--------------------------------------------------------------------------- */

let desk: string | null = null;

/** The reference for this desk, made on first use. */
export function deskRef(): string {
  if (!desk) desk = makeReference();
  return desk;
}

/** Whether anything has been filed under one yet. */
export function hasDeskRef(): boolean {
  return desk !== null;
}

/**
 * Start a new one.
 *
 * After a successful send, so that somebody who carries straight on into a
 * second submission does not have it filed under the first one's reference.
 */
export function newDesk(): void {
  desk = null;
}
