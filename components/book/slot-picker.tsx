"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Clock, Video, X } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  SLOTS,
  freeCount,
  getDiary,
  getDiaryOnServer,
  isTaken,
  subscribeToDiary,
  type Day,
} from "./slots";

/** What the meeting is, which is the second thing the framework asks this page for. */
const TERMS = [
  { icon: Clock, term: "Fifteen minutes", note: "Longer only if you want it." },
  { icon: Video, term: "Video or phone", note: "Whichever suits you better." },
  { icon: Check, term: "Nothing to prepare", note: "No brief, no budget." },
  { icon: X, term: "Move it or cancel", note: "Any time, no explanation." },
];

/**
 * Pick a time that suits you.
 *
 * Two questions, the same shape as the rest of the site: which day, then which
 * time. The day decides what times exist, so the second question is written by
 * the first, and the panel beside them writes the answer as it goes.
 *
 * The days are read through `useSyncExternalStore` rather than computed in
 * render. They depend on what today is, and the server's today and the browser's
 * today are not reliably the same date: the server snapshot is empty and the
 * real one arrives on hydration, so there is nothing for React to find a
 * mismatch in.
 */
export function SlotPicker() {
  const days = useSyncExternalStore(
    subscribeToDiary,
    getDiary,
    getDiaryOnServer,
  );

  const [dayKey, setDayKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [asked, setAsked] = useState(false);

  const day = days.find((entry) => entry.key === dayKey) ?? null;
  const picked = day && time ? `${day.full} at ${time}` : "";

  function chooseDay(next: Day) {
    setDayKey(next.key);
    /* The times belong to the day. Keeping one selected across a change would
       leave the panel showing a slot nobody picked on a day nobody looked at. */
    setTime(null);
    setAsked(false);
  }

  return (
    <div className="grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0">
        <Question n="01" title="Which day" note={`${days.length} to choose from`} />

        {/* Scrolls sideways rather than wrapping. Ten days in two ragged rows
            read as a calendar with something missing; one line reads as a run of
            days, which is what it is. */}
        <div className="quiet-scroll -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
          {days.length
            ? days.map((entry) => {
                const on = entry.key === dayKey;
                const free = freeCount(entry);

                return (
                  <button
                    key={entry.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => chooseDay(entry)}
                    className={cn(
                      "flex w-[74px] shrink-0 cursor-pointer flex-col items-center gap-0.5 rounded-card border py-3 transition-colors",
                      on
                        ? "border-ink bg-ink text-white"
                        : "border-border bg-field hover:border-ink",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-[10px] font-bold tracking-[0.12em] uppercase",
                        on ? "text-white/60" : "text-label",
                      )}
                    >
                      {entry.weekday}
                    </span>
                    <span
                      className={cn(
                        "text-[21px] leading-none font-bold tabular-nums",
                        on ? "text-white" : "text-ink",
                      )}
                    >
                      {entry.number}
                    </span>
                    <span
                      className={cn(
                        "text-[11.5px]",
                        on ? "text-white/60" : "text-quiet",
                      )}
                    >
                      {entry.month}
                    </span>
                    <span
                      className={cn(
                        "mt-1 font-mono text-[9px] font-bold tracking-[0.1em] uppercase tabular-nums",
                        on
                          ? "text-white/55"
                          : free
                            ? "text-done"
                            : "text-label",
                      )}
                    >
                      {free ? `${free} free` : "full"}
                    </span>
                  </button>
                );
              })
            : /* Before hydration. Placeholders rather than an empty box, so the
                 row does not jump to its full height a moment later. */
              [0, 1, 2, 3, 4, 5].map((at) => (
                <span
                  key={at}
                  aria-hidden
                  className="h-[104px] w-[74px] shrink-0 rounded-card border border-hair bg-well"
                />
              ))}
        </div>

        <div className="mt-10">
          <Question
            n="02"
            title="Which time"
            note={day ? day.full : "Pick a day first"}
          />

          {day ? (
            <div className="mt-4 space-y-6">
              {(["morning", "afternoon"] as const).map((half) => (
                <div key={half}>
                  <p className="mb-2.5 font-mono text-[9.5px] font-bold tracking-[0.16em] text-label uppercase">
                    {half}
                  </p>

                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
                    {SLOTS.map((slot, at) => {
                      if (slot.half !== half) return null;

                      const taken = isTaken(day, at);
                      const on = slot.time === time;

                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={taken}
                          aria-pressed={on}
                          onClick={() => {
                            setTime(slot.time);
                            setAsked(false);
                          }}
                          className={cn(
                            "rounded-field border py-2.5 text-[14.5px] font-semibold tabular-nums transition-colors",
                            taken &&
                              "cursor-not-allowed border-hair bg-well text-label line-through",
                            !taken &&
                              on &&
                              "border-active bg-active text-white",
                            !taken &&
                              !on &&
                              "cursor-pointer border-border bg-field text-ink hover:border-ink",
                          )}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-card border border-dashed border-border px-5 py-6 text-[15px] text-quiet">
              Choose a day above and its times appear here. Struck out means
              somebody already has it.
            </p>
          )}
        </div>
      </div>

      {/* The answer, written as it is picked. The same behaviour as the scope on
          the build screen, because it is the same promise: you say something and
          we put it in writing where you can see it. */}
      <aside className="min-w-0 lg:sticky lg:top-[calc(var(--nav-height)+28px)] lg:self-start">
        <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-label uppercase">
          Your meeting
        </p>

        <p className="mt-4 text-[21px] leading-[1.3] font-bold tracking-[-0.02em] text-ink">
          {picked ? (
            <span className="text-active">{picked}</span>
          ) : (
            <>
              <span className="text-quiet">A time you have not picked yet</span>
              <span
                aria-hidden
                className="blank-caret ml-1 inline-block align-baseline"
              />
            </>
          )}
        </p>

        <dl className="mt-7 border-t border-hair">
          {TERMS.map((entry) => (
            <div
              key={entry.term}
              className="flex items-start gap-3 border-b border-hair py-3"
            >
              <entry.icon
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-label"
                strokeWidth={2}
              />
              <div className="min-w-0">
                <dt className="text-[14.5px] leading-[1.3] font-semibold text-ink">
                  {entry.term}
                </dt>
                <dd className="text-[13px] leading-[1.4] text-quiet">
                  {entry.note}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        <button
          type="button"
          disabled={!picked}
          onClick={() => setAsked(true)}
          className="mt-6 w-full cursor-pointer rounded-field bg-active px-6 py-[13px] text-[15.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:bg-planned disabled:text-label"
        >
          Book this time
        </button>

        {/* Honest about what just happened. A booking screen that says
            "confirmed" when nothing has been sent is the one thing this page
            must not do. */}
        {asked ? (
          <p className="mt-4 rounded-card border border-amber/30 bg-amber/5 px-4 py-3 text-[13.5px] leading-[1.5] text-body">
            Nothing has been sent. This calendar is not connected to a real diary
            yet, so {picked} is not held for you.
          </p>
        ) : (
          <p className="mt-4 text-[13px] leading-[1.5] text-label">
            Times are shown in your own time zone.
          </p>
        )}
      </aside>
    </div>
  );
}

/** A numbered question, the same furniture the build screen uses. */
function Question({
  n,
  title,
  note,
}: {
  n: string;
  title: string;
  note: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-ink pb-2.5">
      <h2 className="flex items-baseline gap-3 text-[17px] leading-[1.2] font-bold tracking-[-0.018em] text-ink">
        <span className="font-mono text-[11px] font-bold text-idx tabular-nums">
          {n}
        </span>
        {title}
      </h2>
      <span className="font-mono text-[10px] font-semibold tracking-[0.12em] text-label uppercase">
        {note}
      </span>
    </div>
  );
}
