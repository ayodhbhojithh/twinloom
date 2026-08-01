"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Clock, Globe, Video, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Calendar } from "./calendar";
import {
  OFFICE_ZONE,
  SLOTS,
  getReader,
  getReaderOnServer,
  keyToDate,
  officeInstant,
  subscribeToReader,
  takenSlots,
  type Reader,
} from "./diary";

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
 * Three columns, which is the arrangement every booking tool worth using has
 * settled on: what the meeting is, when it could be, and which time. It is
 * settled because it works, and there is nothing to be gained by being novel
 * about a calendar.
 *
 * Everything that depends on the reader waits for hydration. Their zone, their
 * locale, their clock convention and today's date are all the browser's to tell
 * us, and none of them are knowable while this is rendered on a server.
 */
export function SlotPicker() {
  const reader = useSyncExternalStore(
    subscribeToReader,
    getReader,
    getReaderOnServer,
  );

  const [dayKeyChosen, setDayKey] = useState<string | null>(null);
  const [slotAt, setSlotAt] = useState<number | null>(null);
  const [asked, setAsked] = useState(false);
  /* Some people would rather see the office's clock than their own. */
  const [inOfficeZone, setInOfficeZone] = useState(false);

  if (!reader) return <Waiting />;

  const zone = inOfficeZone ? OFFICE_ZONE : reader.zone;
  const day = dayKeyChosen ? keyToDate(dayKeyChosen) : null;
  const taken = day ? takenSlots(day) : [];

  const timeAt = (at: number) => {
    const slot = SLOTS[at];
    const when = officeInstant(
      day!.getFullYear(),
      day!.getMonth(),
      day!.getDate(),
      slot.hour,
      slot.minute,
    );

    return {
      when,
      label: new Intl.DateTimeFormat(reader.locale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: reader.hour12,
        timeZone: zone,
      }).format(when),
    };
  };

  const chosen =
    day && slotAt !== null
      ? new Intl.DateTimeFormat(reader.locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
          hour12: reader.hour12,
          timeZone: zone,
        }).format(timeAt(slotAt).when)
      : "";

  return (
    <div className="grid gap-x-12 gap-y-10 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,13rem)]">
      <aside className="min-w-0">
        <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-label uppercase">
          The meeting
        </p>

        <dl className="mt-4 border-t border-hair">
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

        <ZoneNote
          reader={reader}
          inOfficeZone={inOfficeZone}
          onToggle={() => setInOfficeZone((was) => !was)}
        />
      </aside>

      <div className="min-w-0 xl:border-x xl:border-hair xl:px-12">
        <Calendar
          reader={reader}
          selected={dayKeyChosen}
          onSelect={(key) => {
            setDayKey(key);
            /* The times belong to the day. Keeping one across a change would
               leave the panel showing a slot nobody picked. */
            setSlotAt(null);
            setAsked(false);
          }}
        />
      </div>

      <div className="flex min-w-0 flex-col">
        <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-label uppercase">
          {day
            ? new Intl.DateTimeFormat(reader.locale, {
                weekday: "long",
                day: "numeric",
                month: "short",
              }).format(day)
            : "Times"}
        </p>

        {day ? (
          <>
            <div
              className="quiet-scroll mt-4 flex max-h-[22rem] flex-col gap-2 overflow-y-auto pr-1"
              role="group"
              aria-label="Available times"
            >
              {SLOTS.map((_slot, at) => {
                const gone = taken[at];
                const on = slotAt === at;
                const { label } = timeAt(at);

                return (
                  <button
                    key={at}
                    type="button"
                    disabled={gone}
                    aria-pressed={on}
                    onClick={() => {
                      setSlotAt(at);
                      setAsked(false);
                    }}
                    className={cn(
                      "rounded-field border py-2.5 text-center text-[14.5px] font-semibold tabular-nums transition-colors",
                      gone &&
                        "cursor-not-allowed border-hair bg-well text-label line-through",
                      !gone && on && "border-active bg-active text-white",
                      !gone &&
                        !on &&
                        "cursor-pointer border-border bg-field text-ink hover:border-ink",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Announced rather than only drawn, so somebody not looking at the
                panel still learns what they just picked. */}
            <p aria-live="polite" className="sr-only">
              {chosen ? `Selected ${chosen}` : ""}
            </p>

            <div className="mt-5 border-t border-hair pt-5">
              <p className="text-[14px] leading-[1.45] text-quiet">
                {chosen ? (
                  <span className="font-semibold text-ink">{chosen}</span>
                ) : (
                  "Pick a time and it appears here."
                )}
              </p>

              <button
                type="button"
                disabled={!chosen}
                onClick={() => setAsked(true)}
                className="mt-4 w-full cursor-pointer rounded-field bg-active px-5 py-[12px] text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:bg-planned disabled:text-label"
              >
                Book this time
              </button>

              {/* A booking screen that says "confirmed" when nothing was sent is
                  the one thing this page must not do. */}
              {asked ? (
                <p
                  role="status"
                  className="mt-3 rounded-card border border-amber/30 bg-amber/5 px-3.5 py-3 text-[13px] leading-[1.5] text-body"
                >
                  Nothing has been sent. This calendar is not connected to a real
                  diary yet, so that time is not held for you.
                </p>
              ) : null}
            </div>
          </>
        ) : (
          <p className="mt-4 rounded-card border border-dashed border-border px-4 py-5 text-[14px] leading-[1.5] text-quiet">
            Choose a day and its times appear here. A dot under a date means it
            has room; struck out means somebody already has it.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Whose clock the times are on.
 *
 * Named outright rather than left to be discovered. A time with no zone against
 * it is the most common way a booking goes wrong across borders, and the offset
 * is spelled out because a zone name alone means nothing to most people.
 */
function ZoneNote({
  reader,
  inOfficeZone,
  onToggle,
}: {
  reader: Reader;
  inOfficeZone: boolean;
  onToggle: () => void;
}) {
  const zone = inOfficeZone ? OFFICE_ZONE : reader.zone;

  const offset =
    new Intl.DateTimeFormat(reader.locale, {
      timeZone: zone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(new Date())
      .find((part) => part.type === "timeZoneName")?.value ?? "";

  const sameZone = reader.zone === OFFICE_ZONE;

  return (
    <div className="mt-6">
      <p className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-quiet">
        <Globe aria-hidden className="mt-0.5 size-4 shrink-0 text-label" />
        <span>
          Times shown in{" "}
          <span className="font-semibold text-ink">
            {zone.replace(/_/g, " ")}
          </span>
          {offset ? ` (${offset})` : ""}.
          {sameZone ? " Which is ours too." : " We are in London."}
        </span>
      </p>

      {sameZone ? null : (
        <button
          type="button"
          aria-pressed={inOfficeZone}
          onClick={onToggle}
          className="mt-2.5 cursor-pointer font-mono text-[10px] font-bold tracking-[0.14em] text-active uppercase transition-opacity hover:opacity-75"
        >
          {inOfficeZone ? "Show my own time" : "Show London time"}
        </button>
      )}
    </div>
  );
}

/**
 * Before hydration.
 *
 * The shape of the thing rather than a spinner: the columns are already the
 * right size, so nothing moves when the real calendar replaces this.
 */
function Waiting() {
  return (
    <div
      aria-hidden
      className="grid gap-x-12 gap-y-10 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,13rem)]"
    >
      <div className="space-y-3">
        {[0, 1, 2, 3].map((at) => (
          <div key={at} className="h-12 rounded-field bg-well" />
        ))}
      </div>
      <div className="xl:border-x xl:border-hair xl:px-12">
        <div className="h-6 w-40 rounded-field bg-well" />
        <div className="mt-4 grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }, (_, at) => (
            <div key={at} className="aspect-square rounded-field bg-well" />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {[0, 1, 2, 3, 4].map((at) => (
          <div key={at} className="h-10 rounded-field bg-well" />
        ))}
      </div>
    </div>
  );
}
