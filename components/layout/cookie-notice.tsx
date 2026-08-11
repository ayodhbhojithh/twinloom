"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Cookie } from "lucide-react";

import { OPTIONAL, setConsent, useConsent } from "@/lib/consent";
import { ROUTES } from "@/lib/site";

/** Nothing to subscribe to: the answer to "are we in a browser" never changes
 *  within a page's life. */
const stay = () => () => {};

/**
 * What this website stores, and the reader's answer about it.
 *
 * A panel at the foot of the window rather than a sheet over the middle of it.
 * Nothing here is being consented to that stops the page working, so the page
 * stays readable and the notice sits under it - a bar somebody can answer when
 * they are ready rather than a wall they have to get past. A modal would be
 * asking for attention this deserves and does not need.
 *
 * The two answers carry the same weight, which is the one thing a notice like
 * this can get wrong on purpose. "Accept" filled and "Reject" set as a grey
 * link is a design that has already decided; both of these are pills, both are
 * the same size, and the one that grants nothing is on the left where the eye
 * arrives first.
 *
 * What it says is what is true. It does not claim to use cookies, because this
 * site sets none - it names the storage it does use, says who it is for, and
 * asks the question anyway, because the answer is what an analytics script would
 * have to check before it could ever load. See `lib/consent`.
 */
export function CookieNotice() {
  const choice = useConsent();

  /* Portalled, and only once the browser has it.
   *
   * `document` does not exist while this renders on the server, and the choice
   * is in `localStorage`, which the server cannot read either. Rendering nothing
   * until both are available is what stops a notice appearing for a second in
   * front of somebody who answered a month ago.
   *
   * A store with no store rather than state set from an effect: the snapshot is
   * `false` on the server and during hydration and `true` after it, which is the
   * question being asked, and it asks it without a second render scheduled from
   * inside the first. */
  const here = useSyncExternalStore(
    stay,
    () => true,
    () => false,
  );

  if (!here || choice !== null) return null;

  return createPortal(
    <div
      role="region"
      aria-label="Cookies and storage"
      /* Above the desk and the header, below nothing. It is the only thing on
         screen asking a question. */
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
    >
      <div className="page-frame">
        <div className="mx-auto flex max-w-[860px] flex-col gap-3.5 rounded-[20px] bg-field p-4 shadow-[0_18px_50px_rgba(12,20,36,0.18)] sm:flex-row sm:items-center sm:gap-5 sm:rounded-pill sm:py-3.5 sm:pr-3.5 sm:pl-6">
          <span
            aria-hidden
            className="flex size-9 flex-none items-center justify-center rounded-pill bg-canvas text-ink max-sm:size-8"
          >
            <Cookie className="size-4.5 max-sm:size-4" strokeWidth={1.9} />
          </span>

          <p className="min-w-0 flex-1 text-[12.5px] leading-[1.5] text-quiet max-sm:text-[12px]">
            {/* Said plainly, and said accurately. Every clause here is something
                the scan in `lib/consent` actually found. */}
            This site keeps what you type - a brief, a booking - on your own
            device so you can come back to it. It sets no cookies and nothing
            here follows you.{" "}
            <Link
              href={ROUTES.cookies}
              className="font-semibold text-ink underline decoration-hair underline-offset-2 transition-colors hover:text-mark hover:decoration-mark"
            >
              How we use storage
            </Link>
            .
          </p>

          <span className="flex flex-none gap-2 max-sm:w-full">
            {/* The one that grants nothing, first. */}
            <button
              type="button"
              onClick={() => setConsent("essential")}
              className="flex-1 cursor-pointer rounded-pill bg-canvas px-4 py-2 text-[12.5px] font-semibold whitespace-nowrap text-ink transition-colors hover:bg-hair sm:flex-none"
            >
              Only what is needed
            </button>

            <button
              type="button"
              onClick={() => setConsent("all")}
              className="flex-1 cursor-pointer rounded-pill bg-ink px-4 py-2 text-[12.5px] font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-85 sm:flex-none"
            >
              {/* "That is fine" rather than "Accept all", because there is
                  nothing optional to accept yet - see `OPTIONAL`. The day there
                  is, this reads as the list and the label changes with it. */}
              {OPTIONAL.length ? "Accept all" : "That is fine"}
            </button>
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
