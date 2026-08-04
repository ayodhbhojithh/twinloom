"use client";

import { useState, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Globe,
  Mail,
  RotateCcw,
  User,
} from "lucide-react";

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
import { MEETINGS, STEPS, findMeeting, looksLikeEmail } from "./meetings";
import { Stepper } from "./stepper";

interface Details {
  name: string;
  email: string;
  notes: string;
}

const EMPTY: Details = { name: "", email: "", notes: "" };

/**
 * Book a meeting, in four questions.
 *
 * One question per screen rather than all of them at once. A booking is a short
 * sequence of decisions where each one narrows the next, and asking them
 * together produces a form nobody finishes; asking them in order produces four
 * screens that each take a second.
 *
 * A completed step stays reachable from the stepper, so changing your mind about
 * the meeting type does not mean starting again. Steps ahead are not: they would
 * be asking a question whose answer depends on one not given yet.
 *
 * Everything that depends on the reader waits for hydration. Their zone, their
 * locale, their clock convention and today's date are all the browser's to tell
 * us, and none are knowable while this renders on a server.
 */
export function BookingFlow() {
  const reader = useSyncExternalStore(
    subscribeToReader,
    getReader,
    getReaderOnServer,
  );

  const [at, setAt] = useState(0);
  const [meetingKey, setMeetingKey] = useState<string | null>(null);
  const [dayKeyChosen, setDayKey] = useState<string | null>(null);
  const [slotAt, setSlotAt] = useState<number | null>(null);
  const [details, setDetails] = useState<Details>(EMPTY);
  const [showErrors, setShowErrors] = useState(false);
  const [inOfficeZone, setInOfficeZone] = useState(false);
  const [done, setDone] = useState(false);

  if (!reader) return <Waiting />;

  const meeting = findMeeting(meetingKey);
  const day = dayKeyChosen ? keyToDate(dayKeyChosen) : null;
  const zone = inOfficeZone ? OFFICE_ZONE : reader.zone;

  const instantOf = (slot: number) =>
    officeInstant(
      day!.getFullYear(),
      day!.getMonth(),
      day!.getDate(),
      SLOTS[slot].hour,
      SLOTS[slot].minute,
    );

  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(reader.locale, {
      ...options,
      hour12: reader.hour12,
      timeZone: zone,
    });

  const when =
    day && slotAt !== null ? instantOf(slotAt) : null;

  const whenLong = when
    ? format({
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(when)
    : "";

  const whenTime = when
    ? format({ hour: "2-digit", minute: "2-digit" }).format(when)
    : "";

  const nameBad = showErrors && !details.name.trim();
  const emailBad = showErrors && !looksLikeEmail(details.email);

  const canGoOn =
    (at === 0 && Boolean(meeting)) ||
    (at === 1 && Boolean(when)) ||
    (at === 2 && Boolean(details.name.trim()) && looksLikeEmail(details.email));

  function next() {
    if (at === 2 && !canGoOn) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setAt((was) => Math.min(was + 1, STEPS.length - 1));
  }

  function restart() {
    setAt(0);
    setMeetingKey(null);
    setDayKey(null);
    setSlotAt(null);
    setDetails(EMPTY);
    setShowErrors(false);
    setDone(false);
  }

  if (done) {
    return (
      <Finished
        meeting={meeting}
        whenLong={whenLong}
        whenTime={whenTime}
        zone={zone}
        email={details.email}
        onRestart={restart}
      />
    );
  }

  return (
    <div>
      <div className="border-b border-hair pb-6">
        <Stepper at={at} onGo={setAt} />
      </div>

      <div className="pt-8">
        {at === 0 ? (
          <Panel
            n="01"
            title="What kind of meeting"
            note="Three to choose from. None of them commits you to anything."
          >
            <ul className="grid gap-2.5 md:grid-cols-3">
              {MEETINGS.map((entry) => {
                const on = entry.key === meetingKey;

                return (
                  <li key={entry.key}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setMeetingKey(entry.key)}
                      className={cn(
                        "flex h-full w-full cursor-pointer flex-col rounded-card border p-4 text-left transition-colors",
                        on
                          ? "border-mark bg-mark/[0.04]"
                          : "border-border bg-field hover:border-ink",
                      )}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span
                          aria-hidden
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-pill",
                            entry.tone,
                          )}
                        >
                          <entry.icon className="size-[17px]" strokeWidth={2} />
                        </span>

                        <span
                          aria-hidden
                          className={cn(
                            "mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-pill border transition-colors",
                            on
                              ? "border-mark bg-mark text-white"
                              : "border-border text-transparent",
                          )}
                        >
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                      </span>

                      <span className="mt-3.5 flex items-baseline gap-2">
                        <span className="text-[15.5px] font-bold text-ink">
                          {entry.name}
                        </span>
                        <span className="font-mono text-[10px] font-bold tracking-[0.1em] text-label uppercase tabular-nums">
                          {entry.minutes} min
                        </span>
                      </span>

                      <span className="mt-1.5 text-[13px] leading-[1.45] text-quiet">
                        {entry.note}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Panel>
        ) : null}

        {at === 1 ? (
          <Panel
            n="02"
            title="When suits you"
            note={
              meeting
                ? `${meeting.name}, ${meeting.minutes} minutes.`
                : undefined
            }
          >
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-[minmax(0,1fr)_11rem]">
              <div className="min-w-0">
                <Calendar
                  reader={reader}
                  selected={dayKeyChosen}
                  onSelect={(key) => {
                    setDayKey(key);
                    /* The times belong to the day. Keeping one across a change
                       would leave a slot selected that nobody picked. */
                    setSlotAt(null);
                  }}
                />

                <ZoneNote
                  reader={reader}
                  inOfficeZone={inOfficeZone}
                  onToggle={() => setInOfficeZone((was) => !was)}
                />
              </div>

              <div className="flex min-w-0 flex-col">
                <p className="font-mono text-[9.5px] font-bold tracking-[0.18em] text-label uppercase">
                  {day
                    ? format({
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      }).format(day)
                    : "Times"}
                </p>

                {day ? (
                  <div
                    role="group"
                    aria-label="Available times"
                    className="quiet-scroll mt-3 flex max-h-[17rem] flex-col gap-1.5 overflow-y-auto pr-0.5"
                  >
                    {SLOTS.map((_slot, index) => {
                      const gone = takenSlots(day)[index];
                      const on = slotAt === index;

                      return (
                        <button
                          key={index}
                          type="button"
                          disabled={gone}
                          aria-pressed={on}
                          onClick={() => setSlotAt(index)}
                          className={cn(
                            "rounded-field border py-2 text-center text-[14px] font-semibold tabular-nums transition-colors",
                            gone &&
                              "cursor-not-allowed border-hair bg-well text-label line-through",
                            !gone &&
                              on &&
                              "border-mark bg-mark text-white",
                            !gone &&
                              !on &&
                              "cursor-pointer border-border bg-field text-ink hover:border-ink",
                          )}
                        >
                          {format({
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(instantOf(index))}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-3 rounded-card border border-dashed border-border px-3.5 py-4 text-[13px] leading-[1.5] text-quiet">
                    Choose a day and its times appear here. A dot under a date
                    means it has room.
                  </p>
                )}
              </div>
            </div>
          </Panel>
        ) : null}

        {at === 2 ? (
          <Panel
            n="03"
            title="Who we are meeting"
            note="Two things we need, and one you can leave blank."
          >
            <div className="grid max-w-[46rem] gap-5 sm:grid-cols-2">
              <Field
                id="book-name"
                label="Your name"
                value={details.name}
                autoComplete="name"
                bad={nameBad}
                error="We need a name to put on the invitation."
                onChange={(value) =>
                  setDetails((was) => ({ ...was, name: value }))
                }
              />

              <Field
                id="book-email"
                label="Email address"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={details.email}
                bad={emailBad}
                error="That does not look like an email address."
                onChange={(value) =>
                  setDetails((was) => ({ ...was, email: value }))
                }
              />

              <div className="sm:col-span-2">
                <label
                  htmlFor="book-notes"
                  className="mb-2 block text-[13.5px] font-semibold text-ink"
                >
                  Anything we should read first{" "}
                  <span className="font-normal text-label">optional</span>
                </label>
                <textarea
                  id="book-notes"
                  rows={3}
                  value={details.notes}
                  onChange={(event) =>
                    setDetails((was) => ({ ...was, notes: event.target.value }))
                  }
                  placeholder="A link, a competitor you like, or what you are stuck on."
                  className="w-full resize-y rounded-field border border-border bg-field px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition-colors placeholder:text-label focus:border-mark"
                />
              </div>
            </div>
          </Panel>
        ) : null}

        {at === 3 ? (
          <Panel
            n="04"
            title="Check it over"
            note="Nothing is sent until you say so."
          >
            <dl className="max-w-[40rem] overflow-hidden rounded-card border border-border">
              <Line icon={Clock} term="Meeting">
                {meeting?.name}, {meeting?.minutes} minutes
              </Line>
              <Line icon={CalendarDays} term="Date">
                {whenLong}
              </Line>
              <Line icon={Globe} term="Time">
                {whenTime} in {zone.replace(/_/g, " ")}
              </Line>
              <Line icon={User} term="Name">
                {details.name}
              </Line>
              <Line icon={Mail} term="Email">
                {details.email}
              </Line>
              {details.notes.trim() ? (
                <Line icon={Mail} term="Notes" last>
                  {details.notes}
                </Line>
              ) : null}
            </dl>
          </Panel>
        ) : null}
      </div>

      <div className="mt-9 flex items-center justify-between gap-4 border-t border-hair pt-6">
        <button
          type="button"
          disabled={at === 0}
          onClick={() => setAt((was) => Math.max(was - 1, 0))}
          className="inline-flex cursor-pointer items-center gap-2 rounded-field border border-border px-4 py-2.5 text-[14.5px] font-semibold text-quiet transition-colors hover:border-ink hover:text-ink disabled:cursor-default disabled:border-hair disabled:text-planned"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back
        </button>

        {at === STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setDone(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-field bg-mark px-6 py-2.5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Confirm booking
            <Check aria-hidden className="size-4" strokeWidth={2.5} />
          </button>
        ) : (
          <button
            type="button"
            disabled={at !== 2 && !canGoOn}
            onClick={next}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-field bg-mark px-6 py-2.5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:bg-planned disabled:text-label"
          >
            Next
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </button>
        )}
      </div>
    </div>
  );
}

/** One step's heading and body, so all four are set the same way. */
function Panel({
  n,
  title,
  note,
  children,
}: {
  n: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="flex items-baseline gap-3 text-[20px] leading-[1.2] font-bold tracking-[-0.022em] text-ink sm:text-[24px]">
        <span className="font-mono text-[12px] font-bold text-idx tabular-nums">
          {n}
        </span>
        {title}
      </h2>

      {note ? (
        <p className="mt-2 max-w-[54ch] text-[14.5px] leading-[1.5] text-quiet">
          {note}
        </p>
      ) : null}

      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  bad,
  error,
  type = "text",
  inputMode,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  bad?: boolean;
  error: string;
  type?: string;
  inputMode?: "email" | "text";
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[13.5px] font-semibold text-ink"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        aria-invalid={bad || undefined}
        aria-describedby={bad ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "w-full rounded-field border bg-field px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition-colors placeholder:text-label",
          bad ? "border-blocked focus:border-blocked" : "border-border focus:border-mark",
        )}
      />
      {bad ? (
        <p id={`${id}-error`} className="mt-1.5 text-[12.5px] text-blocked">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Line({
  icon: Icon,
  term,
  last,
  children,
}: {
  icon: typeof Clock;
  term: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)] items-start gap-4 px-4 py-3 sm:px-5",
        !last && "border-b border-hair",
      )}
    >
      <dt className="flex items-center gap-2.5 text-[13.5px] font-semibold text-quiet">
        <Icon aria-hidden className="size-4 shrink-0 text-label" />
        {term}
      </dt>
      <dd className="text-[14.5px] leading-[1.45] text-ink">{children}</dd>
    </div>
  );
}

/**
 * The end of the flow, told truthfully.
 *
 * A booking screen that says "confirmed" when nothing has been sent is the one
 * thing this page must not do. The summary is real, the tick is real, and the
 * sentence under it says exactly what did and did not happen.
 */
function Finished({
  meeting,
  whenLong,
  whenTime,
  zone,
  email,
  onRestart,
}: {
  meeting: ReturnType<typeof findMeeting>;
  whenLong: string;
  whenTime: string;
  zone: string;
  email: string;
  onRestart: () => void;
}) {
  return (
    <div className="mx-auto max-w-[38rem] py-4 text-center">
      <span
        aria-hidden
        className="mx-auto flex size-14 items-center justify-center rounded-pill bg-mark/10 text-mark"
      >
        <Check className="size-7" strokeWidth={2.5} />
      </span>

      <h2 className="mt-6 text-[24px] leading-[1.18] font-extrabold tracking-[-0.028em] text-ink sm:text-[30px]">
        Your request is written down.
      </h2>

      <p className="mx-auto mt-4 max-w-[46ch] text-[15.5px] leading-[1.6] text-body">
        Nothing has been sent. This calendar is not connected to a diary yet, so
        the time below is not held for you. When it is, a confirmation and a
        calendar invitation would arrive at {email || "your email address"}.
      </p>

      <dl className="mt-8 overflow-hidden rounded-card border border-border text-left">
        <Line icon={Clock} term="Meeting">
          {meeting?.name}, {meeting?.minutes} minutes
        </Line>
        <Line icon={CalendarDays} term="Date">
          {whenLong}
        </Line>
        <Line icon={Globe} term="Time" last>
          {whenTime} in {zone.replace(/_/g, " ")}
        </Line>
      </dl>

      <button
        type="button"
        onClick={onRestart}
        className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-field border border-ink bg-field px-5 py-2.5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
      >
        <RotateCcw aria-hidden className="size-4" />
        Start again
      </button>
    </div>
  );
}

/**
 * Before hydration: the shape of the thing rather than a spinner, so nothing
 * moves when the real flow replaces it.
 */
function Waiting() {
  return (
    <div aria-hidden>
      <div className="flex items-center gap-3 border-b border-hair pb-6">
        {[0, 1, 2, 3].map((step) => (
          <div key={step} className="flex flex-1 items-center gap-3">
            <span className="size-7 shrink-0 rounded-pill bg-well" />
            <span className="hidden h-3 w-14 rounded-pill bg-well sm:block" />
            {step < 3 ? <span className="h-px flex-1 bg-border" /> : null}
          </div>
        ))}
      </div>

      <div className="mt-8 h-7 w-64 rounded-field bg-well" />
      <div className="mt-6 grid gap-2.5 md:grid-cols-3">
        {[0, 1, 2].map((card) => (
          <div key={card} className="h-[124px] rounded-card bg-well" />
        ))}
      </div>
    </div>
  );
}

/**
 * Whose clock the times are on.
 *
 * Named outright rather than left to be worked out. A time with no zone against
 * it is the commonest way a booking goes wrong across borders, and the offset is
 * spelled out because a zone name alone means nothing to most people.
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
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hair pt-4">
      <p className="flex items-center gap-2 text-[12.5px] text-quiet">
        <Globe aria-hidden className="size-3.5 shrink-0 text-label" />
        <span>
          Times in{" "}
          <span className="font-semibold text-ink">
            {zone.replace(/_/g, " ")}
          </span>
          {offset ? ` (${offset})` : ""}
          {sameZone ? ", which is ours too." : ". We are in London."}
        </span>
      </p>

      {sameZone ? null : (
        <button
          type="button"
          aria-pressed={inOfficeZone}
          onClick={onToggle}
          className="cursor-pointer font-mono text-[9.5px] font-bold tracking-[0.14em] text-mark uppercase transition-opacity hover:opacity-75"
        >
          {inOfficeZone ? "Show my own time" : "Show London time"}
        </button>
      )}
    </div>
  );
}
