import {
  ASK_LABELS,
  ASK_PARTS,
  ORG_KINDS,
  REQUIRED,
  SECTORS,
  SYS_LINKS,
} from "./v5";
import { deskRef, hasDeskRef, newDesk } from "./desk";
import { assumed, askDone, pagesFrom, told, zonesFrom } from "./v5-derive";
import { chipsIn, type Answers } from "./v5-store";

/* ---------------------------------------------------------------------------
   Sending the scoping request.

   Two halves, deliberately apart. This file turns the answers into the document
   that gets sent and says whether it may be sent at all; the route handler it
   posts to decides where the document goes. Neither knows the other's job.

   The document is built here rather than on the server because the server would
   have to reimplement every derivation to do it - which pages the answers
   describe, what was told to us, what we are taking as read - and two
   implementations of that would disagree by the second edit. The server gets
   prose it can forward without understanding.
--------------------------------------------------------------------------- */

/** What we could not send, and why. Empty means it can go. */
export function whatIsMissing(answers: Answers): string[] {
  return REQUIRED.filter((field) => !askDone(answers, field)).map(
    (field) => ASK_LABELS[field] ?? field,
  );
}

/** A line of the document, or nothing when there is nothing to say. */
const line = (label: string, value: string) =>
  value.trim() ? `${label}: ${value.trim()}` : "";

/**
 * The scoping request, as the text somebody will actually read.
 *
 * Written out rather than posted as the raw answer object. The object is keys
 * and booleans - `pick.do.buy: true` - and whoever opens this needs the
 * sentence, not the key. The raw answers ride along underneath for anything
 * that wants to machine-read them later.
 */
export function scopeDocument(answers: Answers) {
  const pages = pagesFrom(answers);
  const zones = zonesFrom(pages);
  const said = told(answers);
  const takenAsRead = assumed(answers);

  const org = chipsIn(answers, "orgkind")
    .map((k) => ORG_KINDS[k])
    .filter(Boolean);
  const sectors = Object.keys(answers.pick.sector ?? {})
    .filter((k) => answers.pick.sector?.[k])
    .map((k) => SECTORS[k])
    .filter(Boolean);
  const links = chipsIn(answers, "syslink")
    .map((k) => SYS_LINKS[k])
    .filter(Boolean);

  const parts = [
    "WHO IS ASKING",
    ...REQUIRED.concat(["phone", "when"]).map((field) =>
      line(ASK_LABELS[field] ?? field, answers.ask[field] ?? ""),
    ),
    line(
      "What part they play",
      chipsIn(answers, "ask.part")
        .map((v) => ASK_PARTS.find((part) => part.v === v)?.label ?? v)
        .join(", "),
    ),
    "",
    "THE ORGANISATION",
    line("Kind", org.join(", ")),
    line("Industry", sectors.join(", ")),
    "",
    "WHAT THEY TOLD US",
    ...said.map((entry) => `- ${entry.line}`),
    "",
    "WHAT WE ARE TAKING AS READ",
    ...takenAsRead.map((entry) => `- ${entry}`),
    "",
    `THE SITE THEIR ANSWERS DESCRIBE (${pages.length} pages)`,
    ...zones.flatMap((zone) => [
      `${zone.title}:`,
      ...zone.pages.map((page) => `  ${page.index}. ${page.name}`),
    ]),
    "",
    "SYSTEMS TO JOIN TO",
    links.length ? links.map((entry) => `- ${entry}`).join("\n") : "- None named",
    "",
    "IN THEIR OWN WORDS",
    answers.text["quick.words"]?.trim() || "- Nothing written",
    "",
    "REFERENCES",
    answers.refs.length
      ? answers.refs
          .map(
            (ref) =>
              `- [${ref.kind}] ${ref.text}${
                answers.like[ref.n] ? ` - ${answers.like[ref.n]}` : ""
              }${ref.url ? `\n  ${ref.url}` : ""}`,
          )
          .join("\n")
      : "- None added",
    /* Where the attachments are, said once rather than left to be worked out
       from a column of URLs. Everything from one desk is in one Cloudinary
       folder, named after the reference this submission comes back with. */
    ...(hasDeskRef() ? ["", "ATTACHMENTS", `- Folder: ${deskRef()}`] : []),
  ];

  return parts.filter((part) => part !== "").join("\n");
}

/** What comes back. `ref` is what somebody can quote at us. */
export type SendResult =
  | { ok: true; ref: string }
  | { ok: false; problem: string };

/**
 * Send it.
 *
 * The one call the screen makes. Anything that goes wrong comes back as a
 * sentence rather than as an exception, because the screen has to say something
 * to a person either way and a stack trace is not it.
 */
export async function sendScope(answers: Answers): Promise<SendResult> {
  const missing = whatIsMissing(answers);
  if (missing.length) {
    return {
      ok: false,
      problem: `We still need ${missing.join(", ").toLowerCase()} before this can go.`,
    };
  }

  try {
    const response = await fetch("/api/scope", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        /* The reference the attachments were filed under, so what comes back
           on the sent screen and the folder they are in are one string. It is
           only sent where a file was actually taken; otherwise the route makes
           its own. */
        desk: hasDeskRef() ? deskRef() : undefined,
        document: scopeDocument(answers),
        ask: answers.ask,
        /* The raw answers, for anything that wants to read them by machine
           later. The document above is what a person reads. */
        answers,
      }),
    });

    const body = (await response.json()) as SendResult;
    if (!response.ok || !body.ok) {
      return {
        ok: false,
        problem:
          ("problem" in body && body.problem) ||
          "It did not send. Nothing has been lost - try once more.",
      };
    }

    /* A new desk from here on. Somebody who carries straight into a second
       submission gets a folder of their own rather than adding to the one that
       has already been sent and read. */
    newDesk();

    return body;
  } catch {
    /* A network that is not there is the likeliest failure and the one worth
       naming: it is almost always temporary, and the answers are still here. */
    return {
      ok: false,
      problem:
        "It could not reach us just now. Your answers are still here - try again in a moment.",
    };
  }
}
