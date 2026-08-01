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

/** One layout, written once, so the shell and the real thing cannot disagree. */
const FRAME =
  "grid gap-x-10 gap-y-9 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]";
const PAIR = "grid gap-x-8 gap-y-8 sm:grid-cols-[minmax(0,1fr)_10.5rem]";

/**
 * Pick a time that suits you.
 *
 * What the meeting is, when it could be, and which time: the arrangement every
 * booking tool worth using has settled on. It is settled because it works, and
 * there is nothing to be won by being novel about a calendar.
 *
 * The calendar and the times are one pair inside the layout rather than two
 * siblings of the details column. That is what lets them sit together from the
 * small breakpoint up while the details move beside them only when there is
 * room, instead of the times dropping to the far side of the page in between.
 *
 * Everything that depends on the reader waits for hydration. Their zone, their
 * locale, their clock convention and today's date are all the browser's to tell
 * us, and none of them are knowable while this renders on a server.
 */
export function SlotPicker() {
  const reader = useSyncExternalStore(
    subscribeToReader,
    getReader,
    getReaderOnServer,
  );

  const [chosenDay, setChosenDay] = useState<string | null>(null);
  const [slotAt, setSlotAt] = useState<number | null>(null);
  const [asked, setAsked] = useState(false);
  /* Some people would rather see our clock than their own. */
  const [inOfficeZone, setInOfficeZone] = useState(false);

  if (!reader) return <Waiting />;

  const zone = inOfficeZone ? OFFICE_ZONE : reader.zone;
  const day = chosenDay ? keyToDate(chosenDay) : null;
  const taken = day ? takenSlots(day) : [];

  const instantOf = (at: number) =>
    officeInstant(
      day!.getFullYear(),
      day!.getMonth(),
      day!.getDate(),
      SLOTS[at].hour,
      SLOTS[at].minute,
    );

  const shortTime = new Intl.DateTimeFormat(reader.locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: reader.hour12,
    timeZone: zone,
  });

  const fullWhen = new Intl.DateTimeFormat(reader.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: reader.hour12,
    timeZone: zone,
  });

  const chosen =
    day && slotAt !== null ? fullWhen.format(instantOf(slotAt)) : "";

  return (
    <div className={FRAME}>
      <aside className="min-w-0">
        <Kicker>The meeting</Kicker>

        <dl className="mt-3 border-t border-hair">
          {TERMS.map((entry) => (
            <div
              key={entry.term}
              className="flex items-start gap-2.5 border-b border-hair py-2.5"
            >
              <entry.icon
                aria-hidden
                className="mt-0.5 size-[15px] shrink-0 text-label"
                strokeWidth={2}
              />
              <div className="min-w-0">
                <dt className="text-[14px] leading-[1.3] font-semibold text-ink">
                  {entry.term}
                </dt>
                <dd className="text-[12.5px] leading-[1.4] text-quiet">
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

      <div className={PAIR}>
        <div className="min-w-0">
          <Calendar
            reader={reader}
            selected={chosenDay}
            onSelect={(key) => {
              setChosenDay(key);
              /* The times belong to the day. Keeping one across a change would
                 leave the panel showing a slot nobody picked. */
              setSlotAt(null);
              setAsked(false);
            }}
          />
        </div>

        <div className="flex min-w-0 flex-col">
          <Kicker>
            {day
              ? new Intl.DateTimeFormat(reader.locale, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                }).format(day)
              : "Times"}
          </Kicker>

          {day ? (
            <>
              <div
                role="group"
                aria-label="Available times"
                className="quiet-scroll mt-3 flex max-h-[16.5rem] flex-col gap-1.5 overflow-y-auto pr-0.5"
              >
                {SLOTS.map((_slot, at) => {
                  const gone = taken[at];
                  const on = slotAt === at;

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
                        "rounded-field border py-2 text-center text-[14px] font-semibold tabular-nums transition-colors",
                        gone &&
                          "cursor-not-allowed border-hair bg-well text-label line-through",
                        !gone && on && "border-active bg-active text-white",
                        !gone &&
                          !on &&
                          "cursor-pointer border-border bg-field text-ink hover:border-ink",
                      )}
                    >
                      {shortTime.format(instantOf(at))}
                    </button>
                  );
                })}
              </div>

              <p aria-live="polite" className="sr-only">
                {chosen ? `Selected ${chosen}` : ""}
              </p>

              <div className="mt-4 border-t border-hair pt-4">
                <p className="text-[13px] leading-[1.45] text-quiet">
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
                  className="mt-3 w-full cursor-pointer rounded-field bg-active px-4 py-2.5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:bg-planned disabled:text-label"
                >
                  Book this time
                </button>

                {asked ? (
                  <p
                    role="status"
                    className="mt-3 rounded-card border border-amber/30 bg-amber/5 px-3 py-2.5 text-[12.5px] leading-[1.5] text-body"
                  >
                    Nothing has been sent. This calendar is not connected to a
                    real diary yet, so that time is not held for you.
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <p className="mt-3 rounded-card border border-dashed border-border px-3.5 py-4 text-[13px] leading-[1.5] text-quiet">
              Choose a day and its times appear here. A dot under a date means it
              has room.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[9.5px] font-bold tracking-[0.18em] text-label uppercase">
      {children}
    </p>
  );
}

/**
 * Whose clock the times are on.
 *
 * Named outright rather than left to be worked out. A time with no zone against
 * it is the commonest way a booking goes wrong across borders, and the offset is
 * spelled out because a zone name on its own means nothing to most people.
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
  const sameZone = reader.zone === OFFICE_ZONE;

  const offset =
    new Intl.DateTimeFormat(reader.locale, {
      timeZone: zone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(new Date())
      .find((part) => part.type === "timeZoneName")?.value ?? "";

  return (
    <div className="mt-5">
      <p className="flex items-start gap-2 text-[12.5px] leading-[1.5] text-quiet">
        <Globe aria-hidden className="mt-0.5 size-3.5 shrink-0 text-label" />
        <span>
          Times in{" "}
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
          className="mt-2 cursor-pointer font-mono text-[9.5px] font-bold tracking-[0.14em] text-active uppercase transition-opacity hover:opacity-75"
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
 * The shape of the thing rather than a spinner, and built from the same two
 * layout constants, so nothing moves when the real calendar replaces it.
 */
function Waiting() {
  return (
    <div aria-hidden className={FRAME}>
      <div className="space-y-2.5">
        {[0, 1, 2, 3].map((at) => (
          <div key={at} className="h-11 rounded-field bg-well" />
        ))}
      </div>

      <div className={PAIR}>
        <div>
          <div className="h-5 w-36 rounded-field bg-well" />
          <div className="mt-4 grid grid-cols-7 gap-px">
            {Array.from({ length: 35 }, (_unused, at) => (
              <div key={at} className="h-9 rounded-field bg-well" />
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          {[0, 1, 2, 3, 4, 5].map((at) => (
            <div key={at} className="h-9 rounded-field bg-well" />
          ))}
        </div>
      </div>
    </div>
  );
}
