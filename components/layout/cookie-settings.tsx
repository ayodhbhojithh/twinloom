"use client";

import { reopenConsent } from "@/lib/consent";

/**
 * "Cookie settings", in the footer's legal row.
 *
 * The cookie policy states that a reader can change their answer at any time
 * through a control of this name in the footer, so the control exists and it is
 * called that. A policy describing a button nobody built is the kind of thing
 * these pages are written to avoid.
 *
 * It clears the answer rather than opening a second panel over the top of the
 * first: the notice then comes back exactly as it was, and the choice is made
 * again with the same words in front of it. Two interfaces for one question is
 * two places for the wording to drift.
 *
 * Set as the links beside it are set, because it belongs to that row. A button
 * that has to look like a link is usually a sign it should be one; here it
 * genuinely is not, because it goes nowhere.
 */
export function CookieSettings() {
  return (
    <button
      type="button"
      onClick={reopenConsent}
      className="cursor-pointer py-1.5 text-[12.5px] font-medium text-quiet underline decoration-planned decoration-1 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink max-sm:py-1 max-sm:text-[11.5px]"
    >
      Cookie settings
    </button>
  );
}
