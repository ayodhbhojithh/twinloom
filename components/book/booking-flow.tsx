"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
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
import { collect, drop } from "@/lib/build/handoff";
import { ROUTES } from "@/lib/site";
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

  /* What the scoping run handed over, if this reader came from it.

     Read during render rather than in an effect, and once. It is an opening
     position for four pieces of state, and state that opens on a value has to
     have that value before its first render - set afterwards, the flow would
     draw its first question, then jump.

     Reading `sessionStorage` here is safe for exactly one reason: this
     component renders `Waiting` until the reader's own clock and zone have
     arrived, so nothing that depends on this is in the markup being hydrated
     and there is nothing for it to disagree with. */
  const handoff = useMemo(
    () => (typeof window === "undefined" ? null : collect()),
    [],
  );

  /* Whether the handoff names a meeting we actually offer. Everything that
     follows hangs off it, including whether the first question is worth
     asking. */
  const carried = handoff && findMeeting(handoff.about) ? handoff : null;

  /* Straight to the calendar where the run has already said what this is
     about. The first question is the one thing this reader has answered. */
  const [at, setAt] = useState(() => (carried ? 1 : 0));
  const [meetingKey, setMeetingKey] = useState<string | null>(
    () => carried?.about ?? null,
  );
  /* The length is the visitor's to set. It arrives already chosen when they
     came from the scoping run, where the same question was asked - by the
     handoff where there is one, and by the address otherwise. */
  const [minutes, setMinutes] = useState<number>(() => {
    const want = carried?.minutes ?? wanted;
    return want && LENGTHS.includes(want) ? want : 30;
  });
  const [dayKeyChosen, setDayKey] = useState<string | null>(() =>
    dayKey(firstBookable()),
  );
  const [slotAt, setSlotAt] = useState<number | null>(null);
  /* Their name and their email address, where the run already has them. Asking
     twice for something somebody typed a minute ago is the clearest sign that
     two screens are not talking to each other. */
  const [details, setDetails] = useState<Details>(() =>
    carried
      ? { name: carried.name ?? "", email: carried.email ?? "", notes: "" }
      : EMPTY,
  );
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

  /* Back to the beginning, and the beginning is where this flow opened rather
     than an empty one. Somebody booking a second time about the same scoping
     request should not have to tell us their name again to do it. */
  function restart() {
    setAt(carried ? 1 : 0);
    setMeetingKey(carried?.about ?? null);
    setDayKey(carried ? dayKey(firstBookable()) : null);
    setSlotAt(null);
    setDetails(
      carried
        ? { name: carried.name ?? "", email: carried.email ?? "", notes: "" }
        : EMPTY,
    );
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
          /* What this meeting is about, where there is one. It goes on the
             event and into the confirmation, so the invitation in somebody's
             diary names the submission rather than standing on its own. */
          ref: carried?.ref,
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
      /* The handover is spent. Left behind, the next booking made in this tab
         would attach itself to a submission it has nothing to do with. */
      drop();
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
        /* Where they came from, so the run they are in the middle of is one
           press away. `carried` is read once at mount and the handoff is
           dropped on success - see `drop` - so this is still true after the
           booking has landed, which is exactly when it is needed. */
        back={carried ? ROUTES.build : null}
        onRestart={restart}
      />
    );
  }

  return (
    <div>
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
        {/* The page's own name, and nothing dressed up.

            It read "Pick a time that suits you." over "Four questions, nothing
            to prepare, and real availability - so a time you can pick is a time
            you can have." - a headline and three lines of copy above a tool that
            asks four questions and shows real availability. Everything the copy
            promised was demonstrated by the thing directly under it, and on a
            phone the pair took the whole first screen before the first question
            appeared.

            What is left is the name of the page. The one line that still says
            something the steps do not is the one for somebody arriving from a
            submission, and it is only shown to them. */}
        <h1 className="section-head mx-auto max-w-[22ch] text-ink [text-wrap:pretty] max-sm:text-[24px]">
          Book a<span className="text-quiet"> meeting.</span>
        </h1>

        {carried ? (
          <p className="mx-auto mt-4 max-w-[68ch] text-[15px] leading-[1.6] text-quiet max-sm:mt-2.5 max-sm:text-[13.5px]">
            Set to go through the requirements you have just sent us. Pick a
            time and the rest is already filled in.
          </p>
        ) : null}

        {/* The reference is no longer shown here.

            It read "Against your scoping request TL-20260810-P9MEE", and the
            case for it was that somebody arriving from the scoping run should
            see that the two are the same piece of work. That is true of the
            reference on their receipt and the reference on their invitation -
            both of which they will read side by side later - and not true of a
            code printed at the top of a page they are on because they just
            pressed a button on the previous one.

            What it actually did was put a thing to memorise above a booking
            form. The line under the heading already says this booking is set
            against what they have just sent us, in words. */}
      </div>

      {/* The surface, filling what the head leaves - the landing page's own
          arrangement, where the card is the page and the words are a band
          above it. */}
      <div className="page-frame mt-8 w-full max-sm:mt-4">
        {at === 0 ? (
          <BookStage
            rail={<StepRail at={at} reached={reached} onGo={setAt} />}
            at={at}
            canGoOn={canGoOn}
            last={false}
            onBack={back}
            onNext={next}
          >
            <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
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
                        /* A tall card on a screen, where three of them stand
                           side by side and the height is what makes them read
                           as a set. Stacked on a phone they are three of the
                           same height one under another, and 190 apiece put the
                           third one below the fold with the lengths under that
                           - so on a phone the height is whatever the words in
                           it come to.

                           And on a phone the card turns on its side: the icon
                           in a column of its own at the left, the name and the
                           sentence beside it, the tick out of the flow at the
                           top right. Stacked, the three parts were three rows of
                           a card that is one thought, and the icon had a line to
                           itself with nothing on it. */
                        "flex h-full min-h-[190px] w-full cursor-pointer flex-col justify-between rounded-[18px] p-5 text-left transition-colors max-sm:relative max-sm:grid max-sm:min-h-0 max-sm:grid-cols-[auto_minmax(0,1fr)] max-sm:gap-x-3 max-sm:rounded-[15px] max-sm:p-3.5",
                        on ? "bg-ink" : "bg-canvas hover:bg-canvas-firm",
                      )}
                    >
                      <span className="flex items-start justify-between gap-3 max-sm:row-span-2 max-sm:self-start">
                        <span
                          aria-hidden
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-pill transition-colors max-sm:size-8",
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
                            "mt-0.5 flex size-[20px] shrink-0 items-center justify-center rounded-pill transition-colors max-sm:absolute max-sm:top-3 max-sm:right-3 max-sm:mt-0 max-sm:size-[17px]",
                            on
                              ? "bg-mark text-white"
                              : "bg-field text-transparent",
                          )}
                        >
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                      </span>

                      <span className="mt-6 flex items-baseline gap-2 max-sm:col-start-2 max-sm:mt-0 max-sm:pr-6">
                        <span
                          className={cn(
                            "text-[15.5px] font-bold max-sm:text-[14px]",
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
                          "mt-1.5 text-[13px] leading-[1.45] max-sm:col-start-2 max-sm:mt-0.5 max-sm:text-[12px] max-sm:leading-[1.4]",
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
            <div className="mt-7 max-sm:mt-5">
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
                      "cursor-pointer rounded-pill px-4 py-2 text-[13.5px] font-semibold tabular-nums transition-colors max-sm:px-3.5 max-sm:py-1.5 max-sm:text-[12.5px]",
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
            rail={<StepRail at={at} reached={reached} onGo={setAt} />}
            at={at}
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
            <div className="grid gap-x-10 gap-y-7 max-sm:gap-y-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
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
            rail={<StepRail at={at} reached={reached} onGo={setAt} />}
            at={at}
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
            {/* Centred, like everything else on this run.

                It was the only block on the four steps without `mx-auto`, so a
                form held to 46rem sat against the left of a surface eleven
                hundred wide, under a heading and a step rail that are both
                centred on the card. Three things on one screen, two of them on
                the card's centre line and one of them not.

                The measure stays: a name and an email side by side want about
                that much, and a form running the width of this surface would be
                two fields a foot apart. */}
            <div className="mx-auto grid max-w-[46rem] gap-5 max-sm:gap-3.5 sm:grid-cols-2">
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
                  placeholder="Tell us a little about what you want to discuss."
                  className="w-full resize-y rounded-field border border-border bg-field px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition-colors placeholder:text-label focus:border-mark"
                />
              </div>
            </div>
          </BookStage>
        ) : null}

        {at === 3 ? (
          <BookStage
            rail={<StepRail at={at} reached={reached} onGo={setAt} />}
            at={at}
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
            <dl className="mx-auto w-full max-w-[46rem] overflow-hidden rounded-[18px] bg-canvas py-2">
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
                className="mx-auto mt-6 w-full max-w-[46rem] rounded-[12px] bg-blocked/[0.08] px-4 py-3 text-[13px] leading-[1.6] text-blocked"
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
    /* Label above value on a phone rather than beside it. The label column is
       nine rems, which on a three hundred point screen leaves the value four
       words a line - and a booked time broken over three lines is not a thing
       anybody can check at a glance, which is the only reason this list is
       here. */
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-5 py-3 max-sm:gap-y-0.5 max-sm:px-4 max-sm:py-2.5 sm:px-7">
      <dt className="flex w-[9rem] flex-none items-center gap-2.5 text-[13px] font-semibold text-quiet max-sm:w-full max-sm:text-[12px]">
        <Icon aria-hidden className="size-4 shrink-0 text-label" />
        {term}
      </dt>
      <dd className="min-w-0 flex-1 text-[14.5px] leading-[1.5] text-ink max-sm:text-[13.5px]">
        {children}
      </dd>
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
  back,
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
  /**
   * The run this booking was made from the middle of, where there is one.
   *
   * Somebody who pressed "Choose a time" inside the scoping run has not finished
   * it - the meeting is one answer on step ten and the document still has to be
   * sent. Booked and left on this screen, the only ways out were "start again"
   * and the browser's back button, so a run that was nine steps done ended here
   * with no sign that it was still waiting.
   *
   * The answers are kept for the visit now, so going back lands exactly where
   * they left off - see `lib/build/v5-store`.
   */
  back: string | null;
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
          onClick={onRestart}
          className="flex size-11 cursor-pointer items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
        >
          <RotateCcw className="size-[18px]" strokeWidth={2.2} />
        </button>
      }
    >
      {/* Centred, as the four steps that led here are.

          The headline and the paragraph were left against the edge while the
          list of what was booked - the one thing on this screen anybody came
          back to read - was centred in the middle of it. Three blocks, two
          alignments, on the screen that closes the run.

          Every step before this one is centred on the card, so the last one
          being different reads as a page from somewhere else rather than as the
          end of the same run. */}
      <h2 className="mx-auto max-w-[20ch] text-center text-[clamp(26px,3vw,38px)] leading-[1.06] font-extrabold tracking-[-0.038em] text-ink max-sm:text-[24px]">
        The time is yours.
      </h2>

      <p className="mx-auto mt-4 max-w-[58ch] text-center text-[15px] leading-[1.6] text-body max-sm:mt-3 max-sm:text-[13.5px] max-sm:leading-[1.55]">
        It is in the diary, and a calendar invitation is on its way to{" "}
        {email || "your email address"}. Accepting it puts the meeting in your
        own calendar; moving or cancelling it there tells us straight away.
        Nothing to prepare and nothing to bring.
      </p>

      <dl className="mx-auto mt-8 w-full max-w-[46rem] overflow-hidden rounded-[18px] bg-canvas py-2 text-left">
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

      {/* The way back into the run, where this booking was made from one.

          It is the last thing on the screen and the loudest, because it is the
          thing still outstanding: the meeting is booked and the document it is
          about has not been sent. Somebody who stops here has a slot in the
          diary and nothing to talk about at it. */}
      {back ? (
        <Link
          href={back}
          className="group/back thread-fill mx-auto mt-7 inline-flex items-center justify-center gap-2 rounded-pill px-5 py-3 text-[14px] font-semibold whitespace-nowrap transition-opacity hover:opacity-90 max-sm:mt-5 max-sm:w-full max-sm:px-4 max-sm:py-2.5 max-sm:text-[13px]"
        >
          Back to your requirements
          <ArrowRight
            aria-hidden
            className="size-4 shrink-0 transition-transform group-hover/back:translate-x-0.5"
            strokeWidth={2.4}
          />
        </Link>
      ) : null}
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
