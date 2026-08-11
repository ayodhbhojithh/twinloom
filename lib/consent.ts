"use client";

import { useSyncExternalStore } from "react";

/* ---------------------------------------------------------------------------
   What this website is allowed to store, and what the reader said about it.

   The scan of this site, done rather than assumed:

     sessionStorage  the booking flow, the scoping run and the handoff between
                     them - each one holds what the reader is in the middle of
                     typing, and each one is emptied when the tab closes
     localStorage    whether the side rail was left open, and the answer below
     cookies         none, on any page, set by this site
     third parties   none loaded on arrival; the uploader and the diary are
                     reached from the browser only once somebody has asked for
                     them, and neither sets anything on this domain

   Every one of those is storage the reader has asked for by using the thing it
   belongs to, which is the definition of strictly necessary in PECR - and
   strictly necessary storage does not need consent. What needs consent is
   anything measuring, remembering or following somebody for our benefit rather
   than theirs, and there is none of it here yet.

   So why this module exists at all. Two reasons, and neither is decoration:

   The first is that the cookie policy already promises a banner and a "Cookie
   settings" control in the footer. A published statement about what a website
   does, describing behaviour the website does not have, is worse than no
   statement - so either the promise comes off the page or the thing gets built.
   It is the right promise; the thing gets built.

   The second is order of work. Analytics are added in an afternoon and a
   consent gate is not, so a site that adds the script first is a site that
   measured people who never agreed to it, for as long as it takes somebody to
   notice. With this here first, the script cannot load until `allowed` is true,
   because that is the only way it can be reached.
--------------------------------------------------------------------------- */

/** What a reader has said, or that they have not been asked yet. */
export type Choice = "all" | "essential" | null;

/**
 * Where the answer is kept.
 *
 * `localStorage` rather than a cookie, deliberately: a cookie is sent to the
 * server on every request, and the answer to "may we store things on your
 * device" is nobody's business but this browser's. It is also the one item in
 * `localStorage` this site would defend as strictly necessary in its own right -
 * remembering that somebody said no is the only way not to ask them again.
 */
const KEY = "twinloom.consent";

/**
 * The optional things this website would use consent for.
 *
 * Empty, and that is the honest answer today: nothing here measures, advertises
 * or follows anybody. It is a list rather than a boolean so that adding the
 * first one is a line in this array and a read of `allowed` at the point of
 * use - not a new mechanism invented under time pressure.
 */
export const OPTIONAL: readonly { key: string; name: string; why: string }[] =
  [];

let choice: Choice = null;
let read = false;

const listeners = new Set<() => void>();

const tell = () => {
  for (const listener of listeners) listener();
};

/** Read once, lazily: this module is imported on the server as well. */
const load = (): Choice => {
  if (read || typeof window === "undefined") return choice;
  read = true;

  try {
    const said = window.localStorage.getItem(KEY);
    choice = said === "all" || said === "essential" ? said : null;
  } catch {
    /* Private mode, or storage refused. Treated as not asked, which means the
       notice shows again next time - the wrong way round would be treating a
       failure to read as consent. */
    choice = null;
  }

  return choice;
};

export const consentOf = (): Choice => load();

export function setConsent(said: Exclude<Choice, null>) {
  choice = said;
  read = true;

  try {
    window.localStorage.setItem(KEY, said);
  } catch {
    /* Nothing to do. The choice holds for this visit and is asked again next
       time, which is the safe direction to fail in. */
  }

  tell();
}

/**
 * Ask again - what the footer's "Cookie settings" does.
 *
 * It clears the answer rather than opening a panel over the top of one, so the
 * notice comes back in the state it was in the first time and the reader is
 * making the same choice with the same words in front of them.
 */
export function reopenConsent() {
  choice = null;
  read = true;

  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* As above. */
  }

  tell();
}

/**
 * Whether an optional category may run.
 *
 * The one function anything optional has to call before it loads. It is `false`
 * until somebody has actively said yes - an unanswered notice is not consent,
 * and neither is a dismissed one.
 */
export const allowed = (): boolean => load() === "all";

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * The choice, for the components that draw it.
 *
 * The server snapshot is `null` - not asked - which is what the server knows and
 * all it knows. The notice renders nothing on the server either way, so there is
 * no flash of a banner for somebody who answered months ago.
 */
export function useConsent(): Choice {
  return useSyncExternalStore(subscribe, consentOf, () => null);
}
