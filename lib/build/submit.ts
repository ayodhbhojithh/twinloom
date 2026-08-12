import {
  ASK_LABELS,
  ASK_PARTS,
  ORG_KINDS,
  REQUIRED,
  SECTORS,
  SYS_LINKS,
} from "./v5";
import { attachedFrom, whereOf } from "./attachments";
import { deskRef } from "./desk";
import { getPalette, ROLES } from "./v5-palette";
import { assumed, askDone, pagesFrom, told, zonesFrom } from "./v5-derive";
import { OPTION_LISTS } from "./v5-options";
import { chipsIn, isOn, type Answers } from "./v5-store";

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

/**
 * The palette, if anything was chosen.
 *
 * Read from the colour studio's own store rather than from `Answers`, exactly
 * as the attachment folder is read from the desk's. The studio keeps a working
 * document with its own order, weights and roles, and that was the argument for
 * not folding it into the answers - but it was never an argument for leaving it
 * out of the request. Somebody picking twelve colours and a role for each, and
 * then getting a scope with no colours in it, has lost the work.
 *
 * Weight and role travel with the hex, because a list of six colours says far
 * less than a list of six colours where one is the background at sixty per cent
 * and one is an accent at three.
 */
/**
 * Which of the three ways of talking it through was chosen, in the run's own
 * words.
 *
 * Read from the same list the step renders, so the document quotes the option
 * rather than a key, and a rewording of the question rewords this too.
 */
function talkChoice(answers: Answers): string {
  const rows = OPTION_LISTS.submit?.[0]?.rows ?? [];
  const chosen = rows.find((row) => isOn(answers, row.scope, row.k));

  return chosen?.n ?? "Not answered";
}

function colours(): string[] {
  const palette = getPalette().filter((swatch) => swatch.hex);
  if (!palette.length) return [];

  const roleName = (key: string) =>
    ROLES.find((role) => role.k === key)?.n ?? "No role yet";

  return [
    `COLOURS (${palette.length})`,
    ...palette.map((swatch) =>
      [
        `- ${swatch.hex.toUpperCase()} - ${roleName(swatch.role)}, ${Math.round(
          swatch.weight,
        )}% of the design`,
        swatch.note.trim() ? `  Note: ${swatch.note.trim()}` : "",
        swatch.source ? `  From: ${swatch.source}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    ),
  ];
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
  const files = attachedFrom(answers.refs, answers.like);
  const notes = answers.refs.filter((ref) => !ref.url);
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
    /* What was said about talking it through, and what came of it.

       None of this reached the document before. The run asks a question with
       three answers - book a time, send us your times, or neither - and the
       scope that arrived said nothing about which was chosen. Where somebody had
       booked, the meeting turned up as a calendar invitation with no connection
       to the document it was about; where they had asked us to come back with
       times, that was a note in a list of notes; and where they had said not yet,
       nobody reading the scope could tell whether they had answered at all.

       The booked line is written from the answers rather than from the calendar
       because it is the reader's own words for it - their date, their clock,
       their zone, as the screen that booked it showed them. */
    "THE CONVERSATION",
    /* "Asked for" rather than "They asked for", because this document is sent
       twice: once to us and once, under headings rewritten to the second person,
       to the person who wrote it. A neutral label reads correctly in both. */
    line("Asked for", talkChoice(answers)),
    ...(answers.booked
      ? [
          line(
            "Booked",
            `${answers.booked.what}, ${answers.booked.minutes} minutes`,
          ),
          line("When", answers.booked.when),
          line("Against", answers.booked.ref),
        ]
      : []),
    "",
    "SYSTEMS TO JOIN TO",
    links.length
      ? links.map((entry) => `- ${entry}`).join("\n")
      : "- None named",
    "",
    "IN THEIR OWN WORDS",
    answers.text["quick.words"]?.trim() || "- Nothing written",
    "",
    ...colours(),
    "",
    /* What was put on the desk that is not a file: notes, links, things typed
       into a box. Files have a section of their own below, because a file is
       something to open and a note is something to read, and one list holding
       both is a list where the paperclips are buried. */
    "NOTES AND LINKS",
    notes.length
      ? notes
          .map(
            (ref) =>
              `- [${ref.kind}] ${ref.text}${
                answers.like[ref.n] ? ` - ${answers.like[ref.n]}` : ""
              }\n  Written at: ${whereOf(ref.where)}`,
          )
          .join("\n")
      : "- None added",
    "",
    /* The files, numbered, and each one said with what it was attached to.

       The number is not decoration: it is the same number the file carries on
       the message, so a paperclip called `02-logo.png` and the second row here
       are provably the same thing. Without it, three files and three notes on
       one request is a puzzle. */
    files.length ? `FILES ATTACHED (${files.length})` : "FILES ATTACHED",
    files.length
      ? files
          .map((file) =>
            [
              `- ${String(file.index).padStart(2, "0")} - ${file.name}`,
              `  Attached at: ${file.where}`,
              file.note ? `  Said about it: ${file.note}` : "",
              `  ${file.url}`,
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n")
      : "- None attached",
    /* Where the attachments are, said once rather than left to be worked out
       from a column of URLs. Everything from one desk is in one Cloudinary
       folder, named after the reference this submission comes back with.

       On whether a file was actually taken, not on whether a reference exists.
       The two used to be the same thing, because nothing but an upload ever
       asked for one - and then the submit screen began showing the reference to
       anybody booking a meeting against it, which minted one and made this
       promise a folder with nothing in it. */
    ...(files.length ? ["", "ATTACHMENTS", `- Folder: ${deskRef()}`] : []),
  ];

  return parts.filter((part) => part !== "").join("\n");
}

/** What comes back. `ref` is what somebody can quote at us. */
export type SendResult =
  { ok: true; ref: string } | { ok: false; problem: string };

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
        /* Always this desk's reference, never a fresh one.

           It used to be sent only where a file had been taken, on the grounds
           that the folder was the only thing that needed it. But a quick
           submission can be followed by the full run-through - that is what the
           sent screen offers - and the second one has to arrive under the same
           reference as the first, or one piece of work turns up in the inbox
           twice under two numbers with nothing joining them. */
        desk: deskRef(),
        /* Whether this desk has already been sent once. The follow-up is a
           second email about the same submission rather than a second
           submission, and the subject line has to say which. */
        follow: Boolean(answers.ref),
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

    /* The desk is kept, not reset.

       It used to be cleared here, so that anybody carrying straight on into a
       second submission got a folder of their own. That was the wrong reading of
       what carrying on means: the sent screen offers the questions as a way to
       add to what has just gone, so the second send is a fuller answer to the
       same request and has to arrive under the same reference. Cleared, it would
       turn one piece of work into two numbers with nothing joining them, and the
       reference we had just printed on the screen would be stale.

       A genuinely new submission is a new visit. The desk and the answers are
       both held in module state, so loading the page again is what starts one. */

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
