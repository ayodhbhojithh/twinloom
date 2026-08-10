import {
  button,
  esc,
  fonts,
  kicker,
  palette,
  plate,
  rule,
  shell,
} from "./shell";

/* ---------------------------------------------------------------------------
   The messages this site sends.

   Two of them go to somebody outside the company - the receipt for a scoping
   request and the confirmation of a booking - and both are written here rather
   than in the route handlers that send them. A route decides that a thing
   happened; what a person then reads about it is a piece of writing, and it
   belongs with the other pieces of writing.

   Each returns a plain-text part as well as the HTML. That is not a courtesy:
   a message with no text alternative scores worse with every spam filter there
   is, and some people read mail as text on purpose.
--------------------------------------------------------------------------- */

const { INK, BODY, LABEL, MARK } = palette;
const { SANS } = fonts;

export interface Message {
  subject: string;
  text: string;
  html: string;
}

const h1 = (text: string) =>
  `<h1 style="margin:14px auto 0;max-width:16ch;font-family:${SANS};font-size:20px;line-height:1.25;font-weight:700;letter-spacing:-0.022em;color:${INK}">${esc(
    text,
  )}</h1>`;

/**
 * A paragraph, centred and held to a short measure.
 *
 * `max-width` in a `div` rather than on the `p`, because Outlook ignores a
 * max-width on a paragraph and would run the line the full width of the
 * column. 380 is about sixty characters at this size, which is where a centred
 * line stops being comfortable.
 */
const p = (text: string, size = 13) =>
  `<div style="margin:12px auto 0;max-width:380px;font-family:${SANS};font-size:${size}px;line-height:1.65;color:${BODY}">${text}</div>`;

export interface Meeting {
  /**
   * Which of the three things is true about talking it through.
   *
   * Three states rather than a nullable date, because "we will confirm one of
   * your times" and "we will be in touch to arrange one" are different promises
   * and a reader can tell which one they were given. A single optional date
   * collapses them into "no date", which reads as the first message about a
   * meeting having gone missing.
   */
  kind: "booked" | "slots" | "none";
  /** When, written out, for `booked`. Formatted by the caller: this file has no
      business deciding whether a date is British or American. */
  when?: string;
}

/**
 * The receipt for a scoping request.
 *
 * The thing it exists to carry is the reference. Everything somebody attached
 * is filed under it, and until this message arrived the only place it had ever
 * appeared was a screen they were about to close.
 *
 * What it does not do any more is describe a process that does not happen. It
 * promised a written scope back within two working days, in three numbered
 * steps, with a button to book a call - which is a commitment made by an email
 * template on behalf of whoever opens the inbox. What follows a submission is a
 * conversation, so that is what it says.
 */
export function scopeReceipt({
  name,
  ref,
  described,
  attachments,
  notes,
  meeting = { kind: "none" },
  archive,
  addTo,
  contactEmail,
  phone,
  privacyUrl,
  follow,
}: {
  name: string;
  ref: string;
  /** Whether they wrote anything in their own words, which most do and some do
      not - a request can be four fields and three files. */
  described?: boolean;
  /** How many files came with it, so the message can say where they went. */
  attachments: number;
  /** How many things were put on the desk that were not files. */
  notes: number;
  meeting?: Meeting;
  /**
   * Where the whole submission can be read back.
   *
   * Optional, and left out until there is somewhere for it to point. A link in
   * a receipt that goes nowhere is worse than no link: it is the one thing in
   * the message somebody will try.
   */
  archive?: string;
  /** Where to go to add to the request. The build tool, which files under the
      same reference. */
  addTo?: string;
  contactEmail: string;
  phone?: string;
  privacyUrl: string;
  /**
   * A fuller answer to a request already sent, rather than a new one.
   *
   * Somebody can send the quick version and then answer the questions, which is
   * what the sent screen invites them to do. Both arrive here under one
   * reference, so this message has to say which of the two it is confirming or
   * it reads as the same email twice.
   */
  follow?: boolean;
}): Message {
  /* What they sent, as the things they will recognise sending.

     Counted rather than listed. Naming three files back at somebody is a
     manifest, and a manifest invites the reader to audit it - which is the one
     thing this message must not make them do, because there is nothing here
     they can act on if a count is wrong. What a count does is let them notice
     that something they meant to attach is not in it. */
  const sent = [
    described ? "Your description, in your own words" : "",
    attachments > 0
      ? `${attachments} ${attachments === 1 ? "attachment" : "attachments"}`
      : "",
    notes > 0 ? `${notes} ${notes === 1 ? "note" : "notes"}` : "",
  ].filter(Boolean);

  /* Never an empty list. A request with no description, no file and no note is
     four contact fields and a set of answers, which is still a request - and a
     heading over nothing reads as a message that failed to load. */
  if (!sent.length) sent.push("Your answers to the questions");

  const talk =
    meeting.kind === "booked" && meeting.when
      ? `You booked a call for ${meeting.when}.`
      : meeting.kind === "slots"
        ? "You gave us some times that suit you. We will confirm one of them."
        : "We will be in touch to arrange a time.";

  const item = (text: string) =>
    `<div style="margin:6px auto 0;max-width:380px;font-family:${SANS};font-size:13px;line-height:1.6;color:${BODY}">${text}</div>`;

  const heading = (text: string) =>
    `<div style="font-family:${SANS};font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${LABEL};line-height:1">${esc(
      text,
    )}</div>`;

  const link = (href: string, text: string) =>
    `<a href="${esc(href)}" style="color:${MARK};text-decoration:underline">${esc(
      text,
    )}</a>`;

  const body = `
    ${kicker(follow ? "More received" : "Received")}
    ${h1(follow ? "We have the rest of it." : "We have your scoping request.")}
    ${p(
      follow
        ? `Thank you, ${esc(
            name,
          )}. This is the fuller answer to the request you sent earlier, under the same reference - it is the version we will read.`
        : `Hello ${esc(name)}.`,
    )}

    ${plate("Your reference", ref)}

    ${p(
      "Quote it in any reply, and anything you add later is filed under it rather than arriving as a second request.",
      12,
    )}

    ${rule}

    ${heading("What you sent")}
    ${sent.map((line) => item(esc(line))).join("")}
    ${archive ? item(link(archive, "Everything you sent")) : ""}

    ${rule}

    ${heading("What happens next")}
    ${p(
      "We read it in full. Then we talk it through with you properly - your requirements in more depth, how we work, and what the next steps look like.",
    )}
    ${p("Nothing you have sent commits you to anything, and nothing in it is priced.")}
    ${p(`<b style="color:${INK};font-weight:600">${esc(talk)}</b>`)}

    ${rule}

    ${heading("Forgotten something?")}
    ${p(
      addTo
        ? `Reply to this message, or ${link(
            addTo,
            "add to your request",
          )} - it goes under the same reference.`
        : "Reply to this message and it goes under the same reference.",
    )}
    ${p(
      phone
        ? `Anything else, email ${link(
            `mailto:${contactEmail}`,
            contactEmail,
          )} or call ${esc(phone)}.`
        : `Anything else, email ${link(`mailto:${contactEmail}`, contactEmail)}.`,
      12,
    )}`;

  const text = [
    `Hello ${name},`,
    "",
    ...(follow
      ? [
          "We have the rest of it. This is the fuller answer to the request you",
          "sent earlier, under the same reference, and it is the version we will",
          "read.",
        ]
      : ["We have your scoping request."]),
    "",
    `Your reference is ${ref}. Quote it in any reply, and anything you`,
    "add later is filed under it rather than arriving as a second request.",
    "",
    "WHAT YOU SENT",
    ...sent.map((line) => `  ${line}`),
    ...(archive ? [`  Everything you sent: ${archive}`] : []),
    "",
    "WHAT HAPPENS NEXT",
    "  We read it in full. Then we talk it through with you properly - your",
    "  requirements in more depth, how we work, and what the next steps look",
    "  like.",
    "",
    "  Nothing you have sent commits you to anything, and nothing in it is",
    "  priced.",
    "",
    `  ${talk}`,
    "",
    "FORGOTTEN SOMETHING?",
    /* The address on its own line rather than inside the sentence. A URL set
       mid-clause is a URL that wraps mid-clause, and the half of it on the
       second line stops being a link in every plain-text reader there is. */
    addTo
      ? "Reply to this message, or add to your request - it goes under the"
      : "Reply to this message and it goes under the same reference.",
    ...(addTo ? ["same reference:", `  ${addTo}`] : []),
    "",
    phone
      ? `Anything else, email ${contactEmail} or call ${phone}.`
      : `Anything else, email ${contactEmail}.`,
    "",
    "TwinLoom is a trading name of TwinCoreTech Ltd, registered in England and",
    "Wales, company number 15997244.",
    `What we do with your details: ${privacyUrl}`,
  ].join("\n");

  return {
    /* Two receipts with one subject line would sit on top of each other in a
       thread and read as the same message sent twice. A follow-up says so. */
    subject: follow
      ? `More detail on your scoping request - ${ref}`
      : `Your scoping request - ${ref}`,
    text,
    html: shell({
      title: follow
        ? "We have the rest of your scoping request"
        : "We have your scoping request",
      preview: follow
        ? `The rest of ${ref}. We read it in full, then we talk it through.`
        : `Your reference is ${ref}. We read it in full, then we talk it through.`,
      body,
    }),
  };
}

/**
 * The confirmation of a booked meeting.
 *
 * The calendar invitation carries the time; this carries what the invitation
 * cannot - that there is nothing to prepare, and what happens if the time
 * stops working.
 */
export function bookingConfirmation({
  name,
  meeting,
  minutes,
  when,
  zone,
  meet,
  ref,
}: {
  name: string;
  meeting: string;
  minutes: number;
  /** Already formatted for the reader, in their own zone. */
  when: string;
  zone: string;
  meet: string | null;
  /**
   * The scoping request this meeting is about, where it came from one.
   *
   * The same string the receipt for that request quoted, so the two messages
   * are visibly about one piece of work rather than two things that happen to
   * have arrived from the same company.
   */
  ref?: string | null;
}): Message {
  const body = `
    ${kicker("Booked")}
    ${h1("The time is yours.")}
    ${p(
      `Thank you, ${esc(
        name,
      )}. It is in the diary and a calendar invitation is on its way to this address - accepting it puts the meeting in your own calendar, and moving or cancelling it there tells us straight away.`,
    )}

    ${plate(meeting, `${when} · ${zone}`)}

    ${p(`${minutes} minutes. Nothing to prepare and nothing to bring.`, 12)}

    ${
      ref
        ? p(
            `This is about your scoping request <b style="color:${INK};font-weight:600">${esc(
              ref,
            )}</b>. We will have read it before we speak.`,
            12,
          )
        : ""
    }

    ${
      meet
        ? `${rule}
    <div style="font-family:${SANS};font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${LABEL};line-height:1">Joining</div>
    ${p(
      `<a href="${esc(
        meet,
      )}" style="color:${INK};font-weight:600;word-break:break-all">${esc(
        meet.replace(/^https?:\/\//, ""),
      )}</a>`,
      12.5,
    )}`
        : ""
    }

    ${button("https://twinloom.com/build", "Write down what you want first")}

    ${p(
      "You do not have to. Come with it done or come with nothing - both are a conversation we can have.",
      12,
    )}`;

  const text = [
    `Hello ${name},`,
    "",
    `Your ${meeting.toLowerCase()} is booked.`,
    "",
    `${when} (${zone})`,
    `${minutes} minutes. Nothing to prepare and nothing to bring.`,
    meet ? `\nJoining link: ${meet}` : "",
    "",
    "A calendar invitation is on its way to this address. Accepting it puts the",
    "meeting in your own calendar, and moving or cancelling it there tells us",
    "straight away.",
    "",
    "If you would like to write down what you want first: https://twinloom.com/build",
    "You do not have to - come with it done or come with nothing.",
    "",
    "TwinLoom is a trading name of TwinCoreTech Ltd, registered in England and",
    "Wales, company number 15997244.",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return {
    subject: `Booked: ${meeting} with TwinLoom`,
    text,
    html: shell({
      title: "Your meeting is booked",
      preview: `${when} in ${zone}. Nothing to prepare and nothing to bring.`,
      body,
    }),
  };
}
