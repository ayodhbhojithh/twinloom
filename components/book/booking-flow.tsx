"use client";

import { useState, useSyncExternalStore } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  Globe,
  Mail,
  RotateCcw,
  User,
  Video,
} from "lucide-react";

import { CutPanel } from "@/components/layout/cut-panel";
import { cn } from "@/lib/utils";

import { Calendar } from "./calendar";
import { useDiary } from "./availability";
import {
  OFFICE_ZONE,
  SLOTS,
  getReader,
  getReaderOnServer,
  dayKey,
  firstBookable,
  keyToDate,
  officeInstant,
  subscribeToReader,
  takenSlots,
  type Reader,
} from "./diary";
import {
  LENGTHS,
  MEETINGS,
  STEPS,
  findMeeting,
  looksLikeEmail,
} from "./meetings";
import { BookStage, StepRail } from "./shell";

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
export function BookingFlow({ wanted }: { wanted?: number }) {
  const reader = useSyncExternalStore(
    subscribeToReader,
    getReader,
    getReaderOnServer,
  );

  const [at, setAt] = useState(0);
  const [meetingKey, setMeetingKey] = useState<string | null>(null);
  /* The length is the visitor's to set. It arrives already chosen when they
     came from the scoping run, where the same question was asked. */
  const [minutes, setMinutes] = useState<number>(() =>
    wanted && LENGTHS.includes(wanted) ? wanted : 30,
  );
  /* Opened on the first day that can actually be booked, so the times are
     there to look at rather than behind a click. Not today: today is inside the
     two clear days we ask for, and offering it would be offering something we
     cannot give. */
  const [dayKeyChosen, setDayKey] = useState<string | null>(() =>
    dayKey(firstBookable()),
  );
  const [slotAt, setSlotAt] = useState<number | null>(null);
  const [details, setDetails] = useState<Details>(EMPTY);
  const [showErrors, setShowErrors] = useState(false);
  const [inOfficeZone, setInOfficeZone] = useState(false);
  const [done, setDone] = useState(false);
  /* What went wrong sending it, in words, or null. Cleared on the next go. */
  const [problem, setProblem] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [meet, setMeet] = useState<string | null>(null);

  /* The diary itself. Read once, and again after a booking lands, because the
     only thing that changes it in between is somebody else booking - and for
     that, the check made at the moment of writing is the one that counts. */
  const diary = useDiary();

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

  const when = day && slotAt !== null ? instantOf(slotAt) : null;

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

  /* Short enough to stand in a cut. The long form belongs on the check-over
     screen, where there is a line to put it on. */
  const whenShort = when
    ? format({ weekday: "short", day: "numeric", month: "short" }).format(when)
    : "";

  const nameBad = showErrors && !details.name.trim();
  const emailBad = showErrors && !looksLikeEmail(details.email);

  const canGoOn =
    (at === 0 && Boolean(meeting)) ||
    (at === 1 && Boolean(when)) ||
    (at === 2 && Boolean(details.name.trim()) && looksLikeEmail(details.email));

  /* The furthest step reached, so the rail can offer everything already
     answered and nothing that depends on an answer not yet given. */
  const reached = meeting
    ? when
      ? details.name.trim() && looksLikeEmail(details.email)
        ? 3
        : 2
      : 1
    : 0;

  const back = () => setAt((was) => Math.max(was - 1, 0));

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
    setProblem(null);
    setMeet(null);
  }

  /**
   * Send it.
   *
   * The slot is checked again on the server immediately before the event is
   * written, so a `409` here means somebody took it in the seconds since this
   * page was drawn. That is not a failure to report and leave: it is a reason
   * to send the reader back to the calendar with the diary re-read, which is
   * what happens.
   */
  async function sendIt() {
    if (sending || slotAt === null || !day || !meeting) return;

    setSending(true);
    setProblem(null);

    try {
      const sent = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meeting: meeting.key,
          minutes,
          start: instantOf(slotAt).toISOString(),
          name: details.name.trim(),
          email: details.email.trim(),
          notes: details.notes.trim(),
        }),
      });

      const body = await sent.json().catch(() => null);

      if (!sent.ok || !body?.ok) {
        setProblem(
          typeof body?.problem === "string"
            ? body.problem
            : "It did not go through. Nothing has been booked - try once more.",
        );

        if (body?.taken) {
          /* The time has gone. Re-read the diary, drop the choice, and put
             them back on the calendar rather than leaving them looking at a
             slot that no longer exists. */
          diary.again();
          setSlotAt(null);
          setAt(1);
        }
        return;
      }

      setMeet(typeof body.meet === "string" ? body.meet : null);
      setDone(true);
      diary.again();
    } catch {
      setProblem(
        "It could not reach us just now. Nothing has been booked - try again in a moment.",
      );
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <Finished
        meeting={meeting}
        minutes={minutes}
        whenLong={whenLong}
        whenTime={whenTime}
        zone={zone}
        email={details.email}
        meet={meet}
        onRestart={restart}
      />
    );
  }

  /* What has been settled, in the reader's own terms, so the rail is a record
     of the booking rather than a row of numbers. */
  const said = [
    meeting ? meeting.name : "",
    when ? `${whenShort} · ${whenTime}` : "",
    details.name.trim(),
    "",
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* The head.

          The page had none. It was lost when this screen stopped being a
          framework page and became a tool, and what was left opened on a step
          rail with nothing above it saying what was being stepped through -
          and with no `h1` anywhere in the document, which is the first thing a
          screen reader asks for.

          Centred, because the rail under it is centred and a left aligned
          title over a centred row is two decisions. Compact, because this is a
          tool: the head introduces it and then gets out of the way. */}
      {/* Only the words are outside the surface. Everything you can press is
          on it or standing in a piece cut out of it, which is the rule the
          landing card states and the rest of the site follows. */}
      <div className="page-frame w-full shrink-0 text-center">
        <h1 className="section-head mx-auto max-w-[22ch] text-ink [text-wrap:pretty]">
          Pick a time
          <span className="text-quiet"> that suits you.</span>
        </h1>

        <p className="mx-auto mt-4 max-w-[68ch] text-[15px] leading-[1.6] text-quiet">
          Four questions, nothing to prepare, and real availability - so a time
          you can pick is a time you can have.
        </p>
      </div>

      {/* The surface, filling what the head leaves - the landing page's own
          arrangement, where the card is the page and the words are a band
          above it. */}
      <div className="page-frame mt-7 flex min-h-0 w-full flex-1 flex-col">
        {at === 0 ? (
          <BookStage
            className="h-full"
            rail={
              <StepRail at={at} reached={reached} said={said} onGo={setAt} />
            }
            at={at}
            title="What kind of meeting?"
            note="Three to choose from. None of them commits you to anything."
            canGoOn={canGoOn}
            last={false}
            onBack={back}
            onNext={next}
          >
            <ul className="grid gap-2.5 md:grid-cols-3">
              {MEETINGS.map((entry) => {
                const on = entry.key === meetingKey;

                return (
                  <li key={entry.key}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setMeetingKey(entry.key);
                        if (!wanted) setMinutes(entry.minutes);
                      }}
                      className={cn(
                        "flex h-full w-full cursor-pointer flex-col rounded-[16px] p-4 text-left transition-colors",
                        on ? "bg-ink" : "bg-canvas hover:bg-canvas-firm",
                      )}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span
                          aria-hidden
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-pill transition-colors",
                            on
                              ? "bg-white/15 text-white"
                              : "bg-field text-quiet",
                          )}
                        >
                          <entry.icon className="size-[17px]" strokeWidth={2} />
                        </span>

                        <span
                          aria-hidden
                          className={cn(
                            "mt-0.5 flex size-[20px] shrink-0 items-center justify-center rounded-pill transition-colors",
                            on
                              ? "bg-mark text-white"
                              : "bg-field text-transparent",
                          )}
                        >
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                      </span>

                      <span className="mt-3.5 flex items-baseline gap-2">
                        <span
                          className={cn(
                            "text-[15.5px] font-bold",
                            on ? "text-white" : "text-ink",
                          )}
                        >
                          {entry.name}
                        </span>
                        <span
                          className={cn(
                            "font-mono text-[10px] font-bold tracking-[0.1em] uppercase tabular-nums",
                            on ? "text-white/50" : "text-label",
                          )}
                        >
                          {entry.minutes} min
                        </span>
                      </span>

                      <span
                        className={cn(
                          "mt-1.5 text-[13px] leading-[1.45]",
                          on ? "text-white/70" : "text-quiet",
                        )}
                      >
                        {entry.note}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* How long to hold. A quarter of an hour to an hour, and the kind
              chosen above only suggests it - the person who knows how long this
              needs is the one asking for it. */}
            <div className="mt-7">
              <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
                How long shall we hold
              </p>

              <div
                role="radiogroup"
                aria-label="How long shall we hold"
                className="mt-2.5 flex flex-wrap gap-2"
              >
                {LENGTHS.map((length) => (
                  <button
                    key={length}
                    type="button"
                    role="radio"
                    aria-checked={minutes === length}
                    onClick={() => setMinutes(length)}
                    className={cn(
                      "cursor-pointer rounded-pill px-4 py-2 text-[13.5px] font-semibold tabular-nums transition-colors",
                      minutes === length
                        ? "bg-ink text-white"
                        : "bg-canvas text-body hover:bg-canvas-firm hover:text-ink",
                    )}
                  >
                    {length} min
                  </button>
                ))}
              </div>
            </div>
          </BookStage>
        ) : null}

        {at === 1 ? (
          <BookStage
            className="h-full"
            rail={
              <StepRail at={at} reached={reached} said={said} onGo={setAt} />
            }
            at={at}
            title="When suits you?"
            note="Pick a day, then a time. Every time is shown in your own clock."
            held={
              meeting ? (
                <>
                  <b className="font-mono text-[20px] leading-none font-bold text-ink tabular-nums">
                    {minutes}
                  </b>
                  <span className="mt-1.5 font-mono text-[8px] font-bold tracking-[0.1em] text-label uppercase">
                    Minutes
                  </span>
                </>
              ) : undefined
            }
            canGoOn={canGoOn}
            last={false}
            onBack={back}
            onNext={next}
            foot={
              /* Which clock the times are in, on the very bottom of the surface.
               It applies to the calendar and to the times equally, and the band
               between the two cuts is the one place on this screen that belongs
               to neither column. */
              <div className="flex w-full justify-center text-center">
                <ZoneNote
                  reader={reader}
                  inOfficeZone={inOfficeZone}
                  onToggle={() => setInOfficeZone((was) => !was)}
                />
              </div>
            }
          >
            <div className="grid gap-x-10 gap-y-7 lg:grid-cols-[minmax(0,1fr)_16rem]">
              <div className="min-w-0">
                <Calendar
                  busy={diary.busy}
                  minutes={minutes}
                  reader={reader}
                  selected={dayKeyChosen}
                  onSelect={(key) => {
                    setDayKey(key);
                    /* The times belong to the day. Keeping one across a change
                       would leave a slot selected that nobody picked. */
                    setSlotAt(null);
                  }}
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

                {diary.problem ? (
                  <p
                    role="alert"
                    className="mt-3 rounded-[12px] bg-blocked/[0.08] px-4 py-3 text-[12.5px] leading-[1.6] text-blocked"
                  >
                    {diary.problem} Times below may not be current.
                  </p>
                ) : null}

                {day ? (
                  <div
                    role="group"
                    aria-label="Available times"
                    /* Two abreast, not one long column. Eleven times stacked
                       singly run past the bottom of the calendar beside them
                       and have to be scrolled, while the space next to them
                       sits empty. */
                    className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-2"
                  >
                    {SLOTS.map((_slot, index) => {
                      const gone = takenSlots(day, diary.busy, minutes)[index];
                      const on = slotAt === index;

                      return (
                        <button
                          key={index}
                          type="button"
                          disabled={gone}
                          aria-pressed={on}
                          onClick={() => setSlotAt(index)}
                          className={cn(
                            "rounded-pill py-2 text-center text-[14px] font-semibold tabular-nums transition-colors",
                            gone &&
                              "cursor-not-allowed bg-canvas text-planned line-through",
                            !gone && on && "bg-ink text-white",
                            !gone &&
                              !on &&
                              "cursor-pointer bg-canvas text-ink hover:bg-canvas-firm",
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
                  <p className="mt-3 rounded-[14px] bg-canvas px-3.5 py-4 text-[13px] leading-[1.5] text-quiet">
                    Choose a day and its times appear here. A dot under a date
                    means it has room.
                  </p>
                )}
              </div>
            </div>
          </BookStage>
        ) : null}

        {at === 2 ? (
          <BookStage
            className="h-full"
            rail={
              <StepRail at={at} reached={reached} said={said} onGo={setAt} />
            }
            at={at}
            title="Who are we meeting?"
            note="Two things we need, and one you can leave blank."
            held={
              when ? (
                <>
                  <b className="font-mono text-[15px] leading-none font-bold text-ink tabular-nums">
                    {whenTime}
                  </b>
                  <span className="mt-1.5 font-mono text-[8px] font-bold tracking-[0.1em] text-label uppercase">
                    {whenShort}
                  </span>
                </>
              ) : undefined
            }
            canGoOn={canGoOn}
            last={false}
            onBack={back}
            onNext={next}
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
          </BookStage>
        ) : null}

        {at === 3 ? (
          <BookStage
            className="h-full"
            rail={
              <StepRail at={at} reached={reached} said={said} onGo={setAt} />
            }
            at={at}
            title="Check it over."
            note={
              sending
                ? "Booking it now."
                : "Nothing is booked until you press the tick."
            }
            held={
              <>
                <b className="font-mono text-[15px] leading-none font-bold text-ink tabular-nums">
                  {whenTime}
                </b>
                <span className="mt-1.5 font-mono text-[8px] font-bold tracking-[0.1em] text-label uppercase">
                  {whenShort}
                </span>
              </>
            }
            canGoOn={!sending}
            last
            onBack={back}
            onNext={sendIt}
          >
            <dl className="max-w-[42rem] overflow-hidden rounded-[16px] bg-canvas">
              <Line icon={Clock} term="Meeting">
                {meeting?.name}, {minutes} minutes
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
                <Line icon={Mail} term="Notes">
                  {details.notes}
                </Line>
              ) : null}
            </dl>

            {/* What went wrong, above the control rather than after it is
              pressed a second time. Every message from the route says whether
              anything was booked, because that is the only question somebody
              has when a booking screen shows an error. */}
            {problem ? (
              <p
                role="alert"
                className="mt-6 max-w-[42rem] rounded-[12px] bg-blocked/[0.08] px-4 py-3 text-[13px] leading-[1.6] text-blocked"
              >
                {problem}
              </p>
            ) : null}
          </BookStage>
        ) : null}
      </div>
    </div>
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
    <div className="flex min-h-0 flex-1 flex-col">
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
          bad
            ? "border-blocked focus:border-blocked"
            : "border-border focus:border-mark",
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
  children,
}: {
  icon: typeof Clock;
  term: string;
  children: React.ReactNode;
}) {
  return (
    /* No rule between the rows. The list already sits on a ground of its own,
       and a hairline under every line of a six line list is more drawing than
       the list is worth. */
    <div className="grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)] items-start gap-4 px-4 py-2.5 sm:px-5">
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
 * thing this page must not do. It used to say so out loud, because nothing was
 * sent. Now the event is on the calendar and the invitation has gone before
 * this screen is reached, so it says that instead - and it still says only what
 * actually happened.
 */
function Finished({
  meeting,
  minutes,
  whenLong,
  whenTime,
  zone,
  email,
  meet,
  onRestart,
}: {
  meeting: ReturnType<typeof findMeeting>;
  minutes: number;
  whenLong: string;
  whenTime: string;
  zone: string;
  email: string;
  /** The joining link, where the calendar made one. */
  meet: string | null;
  onRestart: () => void;
}) {
  return (
    <CutPanel
      tone="field"
      className="min-h-[clamp(400px,50vh,540px)] w-full"
      toolbar={
        /* The tick stands in the notch, where the way between steps stood a
           moment ago. It is the same surface, finished. */
        <span className="flex h-10 w-full items-center justify-center gap-2.5">
          <span
            aria-hidden
            className="flex size-6 items-center justify-center rounded-pill bg-mark text-white"
          >
            <Check className="size-3.5" strokeWidth={3} />
          </span>
          <b className="text-[13px] font-bold text-ink">Booked</b>
        </span>
      }
      corner={
        <button
          type="button"
          aria-label="Start again"
          title="Start again"
          onClick={onRestart}
          className="flex size-11 cursor-pointer items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
        >
          <RotateCcw className="size-[18px]" strokeWidth={2.2} />
        </button>
      }
    >
      <h2 className="max-w-[20ch] text-[clamp(26px,3vw,38px)] leading-[1.06] font-extrabold tracking-[-0.038em] text-ink">
        The time is yours.
      </h2>

      <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.6] text-body">
        It is in the diary, and a calendar invitation is on its way to{" "}
        {email || "your email address"}. Accepting it puts the meeting in your
        own calendar; moving or cancelling it there tells us straight away.
        Nothing to prepare and nothing to bring.
      </p>

      <dl className="mt-8 max-w-[42rem] overflow-hidden rounded-[16px] bg-canvas text-left">
        <Line icon={Clock} term="Meeting">
          {meeting?.name}, {minutes} minutes
        </Line>
        <Line icon={CalendarDays} term="Date">
          {whenLong}
        </Line>
        <Line icon={Globe} term="Time">
          {whenTime} in {zone.replace(/_/g, " ")}
        </Line>
        {meet ? (
          <Line icon={Video} term="Joining">
            <a
              href={meet}
              target="_blank"
              rel="noreferrer"
              className="break-all underline decoration-hair underline-offset-2 transition-colors hover:text-mark hover:decoration-mark"
            >
              {meet.replace(/^https?:\/\//, "")}
            </a>
          </Line>
        ) : null}
      </dl>
    </CutPanel>
  );
}

/**
 * Before hydration: the shape of the thing rather than a spinner, so nothing
 * moves when the real flow replaces it.
 */
function Waiting() {
  return (
    <div aria-hidden>
      <div className="flex items-end gap-2.5">
        {[0, 1, 2, 3].map((step) => (
          <span
            key={step}
            className="flex-none rounded-[15px] bg-canvas"
            style={{
              width: step === 0 ? 200 : 168,
              height: step === 0 ? 114 : 96,
            }}
          />
        ))}
      </div>

      <div className="mt-6 min-h-[440px] w-full rounded-[28px] bg-canvas" />
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
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
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
