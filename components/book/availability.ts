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

    const from = startOfToday();
    const to = addDays(from, 92);

    /* No `setLoading(true)` here. It starts true, and a re-read sets it in
       `again` - which is an event handler, where changing state is what one is
       for. Setting it in the effect body is a second render before the request
       has even been made. */
    fetch("/api/booking/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: from.toISOString(), to: to.toISOString() }),
    })
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
