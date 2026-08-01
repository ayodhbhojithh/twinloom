/* ---------------------------------------------------------------------------
   The diary, as data.

   No dates are written down here. The next ten working days are counted from
   whenever the page is opened, because a hardcoded week is a week that goes
   stale, and a booking page showing last month's dates is worse than one showing
   none.

   Everything is pure and everything is cached, which is what lets the picker
   read it through `useSyncExternalStore` without re-rendering itself forever.
--------------------------------------------------------------------------- */

export interface Slot {
  /** "09:30", as it reads on the button. */
  time: string;
  /** Half of the day, so the grid can be split without parsing the string. */
  half: "morning" | "afternoon";
}

export interface Day {
  /** "2026-08-04". Stable, and the key everything else is held by. */
  key: string;
  date: Date;
  /** "Tue" */
  weekday: string;
  /** "4" */
  number: string;
  /** "Aug" */
  month: string;
  /** "Tuesday 4 August" */
  full: string;
}

/** Half past nine to noon, then half past one to half past four. */
export const SLOTS: readonly Slot[] = [
  { time: "09:30", half: "morning" },
  { time: "10:00", half: "morning" },
  { time: "10:30", half: "morning" },
  { time: "11:00", half: "morning" },
  { time: "11:30", half: "morning" },
  { time: "13:30", half: "afternoon" },
  { time: "14:00", half: "afternoon" },
  { time: "14:30", half: "afternoon" },
  { time: "15:00", half: "afternoon" },
  { time: "15:30", half: "afternoon" },
  { time: "16:00", half: "afternoon" },
];

const WORKING_DAYS = 10;

const weekdayOf = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
const monthOf = new Intl.DateTimeFormat("en-GB", { month: "short" });
const fullOf = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

/**
 * The next ten working days, starting the day after tomorrow.
 *
 * Two clear days, not one: the site promises a written scope inside two working
 * days, and offering a meeting tomorrow morning would be promising something
 * faster than the thing it is a meeting about.
 */
function build(from: Date): Day[] {
  const days: Day[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 2);

  while (days.length < WORKING_DAYS) {
    const weekday = cursor.getDay();

    if (weekday !== 0 && weekday !== 6) {
      const date = new Date(cursor);
      days.push({
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
        date,
        weekday: weekdayOf.format(date),
        number: String(date.getDate()),
        month: monthOf.format(date),
        full: fullOf.format(date),
      });
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

/**
 * Which slots are already gone.
 *
 * Worked out from the date rather than drawn at random, so a slot that was taken
 * a second ago is still taken now. A picker whose availability reshuffles on
 * every keystroke teaches people not to trust it.
 *
 * This stands in for a diary that is not connected yet, and the page says so.
 */
export function isTaken(day: Day, at: number): boolean {
  const seed = day.date.getDate() * 7 + day.date.getMonth() * 3;
  return (seed + at * 5) % 11 < 3;
}

export function freeCount(day: Day): number {
  return SLOTS.reduce(
    (total, _slot, at) => total + (isTaken(day, at) ? 0 : 1),
    0,
  );
}

/* One list per page load, held here so the store hands back the same reference
   every time it is asked. */
let cached: Day[] | null = null;

export const NO_DAYS: readonly Day[] = [];

/** A store with nothing to subscribe to: the diary does not change while you read it. */
export const subscribeToDiary = () => () => {};

export function getDiary(): readonly Day[] {
  cached ??= build(new Date());
  return cached;
}

/**
 * Nothing, on the server.
 *
 * The days depend on what today is, and the server's today and the browser's
 * today are not reliably the same date. Rendering none and filling them in on
 * hydration is the only version of this that cannot produce a mismatch.
 */
export function getDiaryOnServer(): readonly Day[] {
  return NO_DAYS;
}
