/* ---------------------------------------------------------------------------
   The diary, as data.

   Slots are held as wall clock times in the office's own zone and converted to
   the reader's before they are shown. That is the only arrangement that works
   across borders: "half past nine" means half past nine in London whoever is
   reading it, and somebody in Colombo needs to be told what that is for them,
   not left to work it out.

   Nothing here formats anything. Formatting needs the reader's locale, which is
   not knowable on the server, so it lives with the component that has already
   waited for hydration.
--------------------------------------------------------------------------- */

/** Where the meetings actually happen. Slots below are wall clock times here. */
export const OFFICE_ZONE = "Europe/London";

/** Half past nine to noon, then half past one to half past four. */
export const SLOTS: readonly { hour: number; minute: number }[] = [
  { hour: 9, minute: 30 },
  { hour: 10, minute: 0 },
  { hour: 10, minute: 30 },
  { hour: 11, minute: 0 },
  { hour: 11, minute: 30 },
  { hour: 13, minute: 30 },
  { hour: 14, minute: 0 },
  { hour: 14, minute: 30 },
  { hour: 15, minute: 0 },
  { hour: 15, minute: 30 },
  { hour: 16, minute: 0 },
];

/** Two clear days before the first bookable one. */
export const LEAD_DAYS = 2;

/**
 * The same lead, as an amount of time rather than a number of dates - and the
 * one the browser and the route both measure against.
 *
 * They measured it differently, which is the whole of the bug this fixes. The
 * picker offered every slot that had not already started; the route refuses
 * anything less than forty-eight hours away. Those agree on a day three dates
 * out and disagree on the first bookable one: at two in the afternoon, the day
 * after tomorrow's half past nine is forty-three and a half hours away, so the
 * picker showed it, somebody chose it, filled in their name and their email,
 * and the last screen told them to pick a later day.
 *
 * A rule enforced in one place and not shown in the other is a rule people meet
 * as a refusal. One number, read by both - see `takenSlots` and the booking
 * route.
 */
export const LEAD_MS = LEAD_DAYS * 86_400_000;

/**
 * How far a zone is from UTC at a given instant.
 *
 * Formatting the instant in the target zone and reading the fields back is the
 * only way to get this right without a library, and it is the only way that
 * survives daylight saving: an offset is a property of a moment, not of a place.
 */
function zoneOffset(zone: string, at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);

  const read = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  /* `hour` comes back as 24 at midnight under `hour12: false` in some engines. */
  const hour = read("hour") % 24;

  const asIfUtc = Date.UTC(
    read("year"),
    read("month") - 1,
    read("day"),
    hour,
    read("minute"),
    read("second"),
  );

  return asIfUtc - at.getTime();
}

/**
 * The instant at which the office clock reads this date and time.
 *
 * Guess that the wall clock is UTC, ask what the office's offset was at that
 * guess, and correct. Twice, because a guess that lands on the far side of a
 * clock change gets the wrong offset the first time, and the second pass always
 * settles it for the hours a business keeps.
 */
export function officeInstant(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  let stamp = Date.UTC(year, month, day, hour, minute);

  for (let pass = 0; pass < 2; pass += 1) {
    stamp =
      Date.UTC(year, month, day, hour, minute) -
      zoneOffset(OFFICE_ZONE, new Date(stamp));
  }

  return new Date(stamp);
}

/** "2026-08-04": stable, sortable, and what every day is keyed by. */
export const dayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const keyToDate = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/** Midnight today, in the reader's own zone. */
export function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const isWeekend = (date: Date) =>
  date.getDay() === 0 || date.getDay() === 6;

/**
 * The first day anybody can book.
 *
 * Counted in dates once - today plus two, then forward past any weekend - and
 * that left a day the calendar offered with nothing on it. The notice period is
 * a stretch of time, so on the first date past it the morning is still inside
 * the window: at two in the afternoon on Monday, every slot on Wednesday before
 * half past one is under forty-eight hours away. The day was selectable, its
 * eleven times were all greyed out, and the picker's answer to "why" was
 * nothing at all.
 *
 * So the test is whether the day has anything left rather than how many dates
 * away it is: the last slot of the day has to clear the notice period. A day
 * that cannot be booked is not the first bookable day.
 *
 * Bounded, because a loop looking for a day that qualifies has to be able to
 * stop. Sixty days is far past any notice period this could sensibly be set to,
 * and reaching it means something is wrong with the numbers rather than with
 * the calendar.
 */
export function firstBookable(): Date {
  const last = SLOTS[SLOTS.length - 1];
  const earliest = Date.now() + LEAD_MS;

  let day = startOfToday();

  for (let tries = 0; tries < 60; tries += 1) {
    if (!isWeekend(day) && slotInstant(day, last).getTime() >= earliest) {
      return day;
    }

    day = addDays(day, 1);
  }

  return day;
}

/** How far ahead the diary is open. Beyond this there is nothing to show. */
export function lastBookable(): Date {
  return addDays(startOfToday(), 90);
}

export function isBookable(date: Date): boolean {
  if (isWeekend(date)) return false;
  return date >= firstBookable() && date <= lastBookable();
}

/**
 * Air either side of a meeting.
 *
 * Nobody walks out of one conversation and into the next on the same minute,
 * and a diary that lets them do it produces a day that cannot actually be
 * worked. Change this one number to change the gap everywhere.
 */
export const BUFFER_MINUTES = 15;

/** One stretch of time the calendar is not free. */
export interface Busy {
  start: string;
  end: string;
}

/** The instant a slot begins, whatever zone the reader is in. */
export function slotInstant(date: Date, slot: (typeof SLOTS)[number]): Date {
  return officeInstant(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    slot.hour,
    slot.minute,
  );
}

/**
 * Which of a day's slots are already gone.
 *
 * Read from the calendar rather than invented. It used to be a hash of the
 * date, which was a stand-in for a diary that did not exist and made the page
 * lie in a way that looked exactly like the truth.
 *
 * A slot is gone if a meeting of the chosen length starting there would touch
 * anything already in the diary, plus the buffer at each end. The length
 * matters: half past three is free for fifteen minutes and not for an hour.
 */
export function takenSlots(
  date: Date,
  busy: readonly Busy[],
  minutes: number,
): boolean[] {
  const pad = BUFFER_MINUTES * 60_000;

  return SLOTS.map((slot) => {
    const from = slotInstant(date, slot).getTime();
    const to = from + minutes * 60_000;

    /* Anything inside the notice period is gone, however free the calendar
       looks - which includes anything already begun. The route makes the same
       comparison at the moment of writing; making it here as well is what stops
       it ever being made in front of somebody who has finished filling the form
       in. */
    if (from < Date.now() + LEAD_MS) return true;

    return busy.some((entry) => {
      const start = new Date(entry.start).getTime() - pad;
      const end = new Date(entry.end).getTime() + pad;
      return from < end && to > start;
    });
  });
}

export function freeCount(
  date: Date,
  busy: readonly Busy[],
  minutes: number,
): number {
  if (!isBookable(date)) return 0;
  return takenSlots(date, busy, minutes).filter((taken) => !taken).length;
}

/**
 * The weeks of a month, padded to whole rows.
 *
 * Which day a week starts on is a local convention, so it is read from the
 * reader's locale rather than assumed to be Monday. Days outside the month are
 * still returned: a calendar with holes in its first and last rows is harder to
 * read than one with quiet days in them.
 */
export function monthGrid(year: number, month: number, weekStart: number) {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() - weekStart + 7) % 7;
  const start = addDays(first, -lead);

  const weeks: Date[][] = [];

  for (let week = 0; week < 6; week += 1) {
    const row = Array.from({ length: 7 }, (_unused, day) =>
      addDays(start, week * 7 + day),
    );

    /* A trailing row entirely in the next month is a row of nothing. */
    if (weeks.length >= 4 && row.every((date) => date.getMonth() !== month)) {
      break;
    }

    weeks.push(row);
  }

  return weeks;
}

/* -------------------------------------------------------- reader's settings */

export interface Reader {
  /** Their zone, from the browser. */
  zone: string;
  /** Their locale, for names, order and clock convention. */
  locale: string;
  /** Whether their locale writes times on a twelve hour clock. */
  hour12: boolean;
  /** The first day of their week: 0 is Sunday. */
  weekStart: number;
}

/**
 * Nothing, on the server.
 *
 * Zone, locale and clock convention are all the browser's to tell us, and today
 * is not reliably the same date on both sides. Rendering a placeholder and
 * filling it in on hydration is the only version of this that cannot mismatch.
 */
export const NO_READER: Reader | null = null;

export const subscribeToReader = () => () => {};

let reader: Reader | null = null;

export function getReader(): Reader | null {
  if (reader) return reader;
  if (typeof window === "undefined") return null;

  const resolved = new Intl.DateTimeFormat().resolvedOptions();
  const locale = resolved.locale || "en-GB";

  reader = {
    zone: resolved.timeZone || OFFICE_ZONE,
    locale,
    hour12: Boolean(
      new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions()
        .hour12,
    ),
    weekStart: readWeekStart(locale),
  };

  return reader;
}

export function getReaderOnServer(): Reader | null {
  return NO_READER;
}

/**
 * Which day the reader's week starts on.
 *
 * `getWeekInfo` is the right answer and is not everywhere yet, so a miss falls
 * back to Monday, which is what most of the world and this company use.
 */
function readWeekStart(locale: string): number {
  try {
    const info = new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const firstDay = info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay;
    /* CLDR counts Monday as 1 and Sunday as 7; `Date` counts Sunday as 0. */
    if (firstDay) return firstDay % 7;
  } catch {
    /* Older engines throw on an unknown locale. Monday is the safe answer. */
  }
  return 1;
}
