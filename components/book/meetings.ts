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
  {
    key: "scope",
    name: "Scope review",
    minutes: 30,
    note: "Go through the scope we wrote for you, line by line.",
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

export const findMeeting = (key: string | null) =>
  MEETINGS.find((meeting) => meeting.key === key) ?? null;

/** The four questions, in the order they are asked. */
export const STEPS = ["Meeting", "Time", "Details", "Confirm"] as const;

/** A deliberately forgiving check: enough to catch a typo, not a gatekeeper. */
export const looksLikeEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
