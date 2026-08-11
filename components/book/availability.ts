"use client";

import { useEffect, useState } from "react";

import { addDays, startOfToday, type Busy } from "./diary";

/* ---------------------------------------------------------------------------
   The diary, as the browser sees it.

   One request for the whole window the calendar can show, rather than one per
   day. Ninety days of free/busy is a small payload and a single round trip, and
   asking again every time somebody clicks a different date is how a picker
   comes to flicker.

   It is fetched once per mount and again after a booking, because the only
   thing that changes it in between is somebody else booking - and for that, the
   check the route handler makes at the moment of writing is the one that counts.
--------------------------------------------------------------------------- */

export interface Diary {
  busy: readonly Busy[];
  /** True until the first answer, so nothing claims a day is free too early. */
  loading: boolean;
  /** Set where the diary could not be read at all. */
  problem: string | null;
  /** Read it again. Called after a booking lands. */
  again: () => void;
}

export function useDiary(): Diary {
  const [busy, setBusy] = useState<readonly Busy[]>([]);
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState<string | null>(null);
  const [round, setRound] = useState(0);

  useEffect(() => {
    let live = true;

    /* No window in the request any more.

       This used to send `startOfToday()` and ninety-two days past it, both
       computed from the reader's own clock - so the question asked of Google was
       a different question for every timezone on earth, and the answer to "does
       this work" depended on where the person asking happened to be. It worked
       from London and returned a 400 from Colombo, which is the shape of a bug
       nobody can reproduce at the desk it was written at.

       The window is not the reader's to choose. Free/busy is a fact about our
       diary, and our diary keeps London hours: the same ninety-two days are the
       same ninety-two days whoever is looking at them. The server picks them now
       - see the route - and what comes back is a list of stretches in UTC, which
       this file was already rendering into the reader's own clock.

       What that removes is not one bad timezone but the whole class: there is
       nothing left in this request that varies by visitor. */
    /* No `setLoading(true)` here. It starts true, and a re-read sets it in
       `again` - which is an event handler, where changing state is what one is
       for. Setting it in the effect body is a second render before the request
       has even been made. */
    fetch("/api/booking/availability", { method: "POST" })
      .then(async (sent) => {
        const body = await sent.json().catch(() => null);
        if (!live) return;

        if (!sent.ok || !body?.ok) {
          setProblem(
            typeof body?.problem === "string"
              ? body.problem
              : "We could not read the diary just now.",
          );
          setBusy([]);
          return;
        }

        setProblem(null);
        setBusy(Array.isArray(body.busy) ? body.busy : []);
      })
      .catch(() => {
        if (live) setProblem("We could not reach the diary just now.");
      })
      .finally(() => {
        if (live) setLoading(false);
      });

    return () => {
      live = false;
    };
  }, [round]);

  return {
    busy,
    loading,
    problem,
    again: () => {
      setLoading(true);
      setRound((n) => n + 1);
    },
  };
}
