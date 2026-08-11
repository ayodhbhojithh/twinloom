import { NextResponse } from "next/server";

import { busyBetween, CalendarError, wiring } from "@/lib/booking/google";

/* ---------------------------------------------------------------------------
   When the diary is not free.

   Read on demand rather than cached. A cached answer is a slot that two people
   can both be told is available, and the whole point of connecting a real
   calendar is that this cannot happen.

   It returns busy stretches rather than free slots, so the browser can work out
   what fits for whatever meeting length is chosen without asking again each
   time somebody changes it from fifteen minutes to an hour.

   Nothing here says what a meeting is about. Free/busy carries times and
   nothing else, which is also why it needs no permission to read anybody's
   subject lines.
--------------------------------------------------------------------------- */

/** Ninety-two days. Longer than the diary is open, and a bounded query. */
const MOST_DAYS = 92;

/* The day of slack that used to sit here has gone with the check it was for.

   It existed because the browser counted ninety-two dates on a calendar and this
   file counted ninety-two times a day's worth of milliseconds, and those two
   disagree by an hour twice a year wherever the clocks change - so a request
   that was exactly at the limit went a fraction over it every autumn in the UK.

   There is no browser-sent window to bound any more: the window is the constant
   below, measured here, and a constant cannot exceed itself. */

/* No argument. The request carries nothing this route reads: the window is
   ours, the calendar is ours, and the only thing the browser is asking is
   "when are you busy" - which is the same question however it is phrased. */
export async function POST() {
  const w = wiring();

  if (!w) {
    return NextResponse.json(
      {
        ok: false,
        problem: "The diary is not connected to this environment yet.",
      },
      { status: 503 },
    );
  }

  /* The window, decided here rather than sent from the browser.

     It arrived in the request body until this line was written, computed from
     whatever clock the reader's device was set to - which made the question a
     different question from every timezone, and Google answered one of those
     with a 400. It worked from London and failed from Colombo, and nothing about
     the code said which timezones were safe.

     None of that was ever the reader's decision to make. Free/busy is a fact
     about our diary; the diary is open for the same ninety-two days whoever is
     asking, and the answer comes back as stretches in UTC that the browser
     renders into its own clock. One window, one request, no variables.

     From now rather than from midnight, because a stretch of this morning that
     has already gone is not availability anybody can book. */
  const from = new Date();
  const to = new Date(from.getTime() + MOST_DAYS * 86_400_000);

  try {
    const busy = await busyBetween(w, from, to);
    return NextResponse.json({ ok: true, busy });
  } catch (wrong) {
    /* Logged in full, answered in one sentence and a number.

       What went wrong with an API credential is ours to fix and not something to
       put on a booking page - but "we could not read the diary" covers an
       outage, a refused token, a calendar that is not shared with the mailbox
       and a malformed window, and told apart they need four different fixes.
       Nobody looking at the page, and nobody being asked about it over the
       phone, could say which of the four they were seeing.

       The status Google gave is passed on. It says which door was shut, not
       what is behind it: 401 or 403 is ours to fix and nothing to retry, 400 is
       a request we built wrongly, 5xx is Google and worth trying again. */
    const status = wrong instanceof CalendarError ? wrong.status : 0;

    console.error("[booking availability]", status, wrong);

    return NextResponse.json(
      {
        ok: false,
        problem: status
          ? `We could not read the diary just now (${status}). Try again in a moment.`
          : "We could not reach the diary just now. Try again in a moment.",
        code: status || undefined,
      },
      { status: 502 },
    );
  }
}
