import { FileSearch, MessageSquare, Phone } from "lucide-react";

/* ---------------------------------------------------------------------------
   What there is to book.

   Three, and each one is a conversation this company actually has. A list of
   meeting types is the first thing a booking flow asks for, and it is only worth
   asking if the answers differ: three ways of saying "a chat" would be a step
   that exists to have a step.
--------------------------------------------------------------------------- */

export interface Meeting {
  key: string;
  name: string;
  minutes: number;
  note: string;
  icon: typeof Phone;
  /** The tint the type carries through the rest of the flow. */
  tone: string;
}

export const MEETINGS: readonly Meeting[] = [
  {
    key: "intro",
    name: "Intro call",
    minutes: 15,
    note: "Tell us what you need. Nothing to prepare and nothing to bring.",
    icon: Phone,
    tone: "bg-active/10 text-active",
  },
  /* What both ways of sending a submission default to.

     It was "Scope review - go through the scope we wrote for you", which is a
     meeting that can only happen after we have written one. Every route that
     lands here from the site arrives the other way round: they have just sent us
     what they want, and the meeting is about that. */
  {
    key: "requirements",
    name: "Your requirements",
    minutes: 30,
    note: "Go through what you have sent us, line by line.",
    icon: FileSearch,
    tone: "bg-amber/10 text-amber",
  },
  {
    key: "other",
    name: "Something else",
    minutes: 30,
    note: "A conversation that does not fit either of the above.",
    icon: MessageSquare,
    tone: "bg-done/10 text-done",
  },
];

/**
 * How long to hold, in minutes.
 *
 * A quarter of an hour is the shortest that is worth anyone's diary, and an
 * hour is the longest we will hold without knowing what it is for. The kind of
 * meeting suggests a length; it does not decide one, because the person who
 * knows how long this needs is the person asking for it.
 */
export const LENGTHS: readonly number[] = [15, 30, 45, 60];

export const findMeeting = (key: string | null) =>
  MEETINGS.find((meeting) => meeting.key === key) ?? null;

/** The four questions, in the order they are asked. */
export const STEPS = ["Meeting", "Time", "Details", "Confirm"] as const;

/** A deliberately forgiving check: enough to catch a typo, not a gatekeeper. */
export const looksLikeEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
