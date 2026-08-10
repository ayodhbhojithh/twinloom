import { NextResponse } from "next/server";

import { busyBetween, wiring } from "@/lib/booking/google";

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

/**
 * And a day of slack on top of it, because a day is not always a day.
 *
 * The browser asks for exactly `MOST_DAYS`, counted the way a person counts
 * them - `setDate(+92)`, ninety-two dates on a calendar. The check here counted
 * milliseconds. Those agree everywhere that has no daylight saving and disagree
 * twice a year everywhere that does: crossing into GMT in October there are
 * twenty-five hours in one of those days, so ninety-two dates is an hour longer
 * than ninety-two times a day's worth of milliseconds, and the request that was
 * exactly at the limit went a fraction over it.
 *
 * Which made this a bug nobody could reproduce anywhere but here, and only
 * between August and the end of October: everywhere on UTC it was fine all
 * year, and in the UK it started failing the day the window began to span the
 * clock change.
 *
 * A day of slack rather than a rewrite in dates. The ceiling exists to stop an
 * unbounded query being asked for, and an hour either way is not that - so the
 * cheapest correct thing is to leave room for the calendar to be a calendar.
 */
const SLACK = 86_400_000;

export async function POST(request: Request) {
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

  let body: { from?: unknown; to?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, problem: "That did not arrive as we expected it to." },
      { status: 400 },
    );
  }

  const from = new Date(String(body.from));
  const to = new Date(String(body.to));

  if (
    Number.isNaN(from.getTime()) ||
    Number.isNaN(to.getTime()) ||
    to <= from
  ) {
    return NextResponse.json(
      { ok: false, problem: "That is not a window we can read." },
      { status: 400 },
    );
  }

  /* Bounded, because the window is chosen by the browser and an unbounded one
     is a way to make us do arbitrary work. */
  if (to.getTime() - from.getTime() > MOST_DAYS * 86_400_000 + SLACK) {
    return NextResponse.json(
      { ok: false, problem: "That window is longer than the diary is open." },
      { status: 400 },
    );
  }

  try {
    const busy = await busyBetween(w, from, to);
    return NextResponse.json({ ok: true, busy });
  } catch (wrong) {
    /* Logged in full, answered in one sentence. What went wrong with an API
       credential is ours to fix and not something to put on a booking page. */
    console.error("[booking availability]", wrong);
    return NextResponse.json(
      {
        ok: false,
        problem: "We could not read the diary just now. Try again in a moment.",
      },
      { status: 502 },
    );
  }
}
