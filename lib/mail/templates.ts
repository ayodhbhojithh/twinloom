import {
  button,
  esc,
  fonts,
  kicker,
  palette,
  plate,
  rule,
  shell,
  step,
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

const { INK, BODY, LABEL } = palette;
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

/**
 * The receipt for a scoping request.
 *
 * The thing it exists to carry is the reference. Everything somebody attached
 * is filed under it, and until this message arrived the only place it had ever
 * appeared was a screen they were about to close.
 */
export function scopeReceipt({
  name,
  ref,
  attachments,
  follow,
}: {
  name: string;
  ref: string;
  /** How many files came with it, so the message can say where they went. */
  attachments: number;
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
  const body = `
    ${kicker(follow ? "More received" : "Received")}
    ${h1(
      follow
        ? "We have the rest of it."
        : "We have your scoping request.",
    )}
    ${p(
      follow
        ? `Thank you, ${esc(
            name,
          )}. This is the fuller answer to the request you sent earlier, under the same reference - it is the version we will read.`
        : `Thank you, ${esc(
            name,
          )}. A person reads every one of these - what comes back is a written scope in your own words, within two working days.`,
    )}

    ${plate("Your reference", ref)}

    ${p(
      attachments > 0
        ? `Quote it in any reply. The ${attachments} ${
            attachments === 1 ? "file" : "files"
          } you attached are filed under it.`
        : "Quote it in any reply, and anything you add later is filed under it.",
      12,
    )}

    ${rule}

    <div style="font-family:${SANS};font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${LABEL};line-height:1">What happens next</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:2px 0 0">
      ${step(1, "We read it", "In full, and we work out what is missing rather than guessing at it.")}
      ${step(2, "A written scope comes back", "Your answers turned into a description of a website, with anything we assumed marked as an assumption.")}
      ${step(3, "You tell us what is wrong with it", "Nothing is priced until that document is right. It is a description, not a quote.")}
    </table>

    ${button("https://twinloom.com/book", "Book a time to talk it through")}

    ${p(
      `Nothing here commits you to anything, and you can reply to this message with anything you forgot.`,
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
      : [
          "We have your scoping request. A person reads every one of these - what",
          "comes back is a written scope in your own words, within two working days.",
        ]),
    "",
    `Your reference is ${ref}.`,
    attachments > 0
      ? `Quote it in any reply. The ${attachments} ${
          attachments === 1 ? "file" : "files"
        } you attached are filed under it.`
      : "Quote it in any reply, and anything you add later is filed under it.",
    "",
    "WHAT HAPPENS NEXT",
    "1. We read it, in full, and work out what is missing rather than guessing.",
    "2. A written scope comes back, with anything we assumed marked as an assumption.",
    "3. You tell us what is wrong with it. Nothing is priced until it is right.",
    "",
    "If you would rather talk it through first: https://twinloom.com/book",
    "",
    "Nothing here commits you to anything, and you can reply to this message",
    "with anything you forgot.",
    "",
    "TwinLoom is a trading name of TwinCoreTech Ltd, registered in England and",
    "Wales, company number 15997244.",
  ].join("\n");

  return {
    /* Two receipts with one subject line would sit on top of each other in a
       thread and read as the same message sent twice. A follow-up says so. */
    subject: follow
      ? `We have the rest of your scoping request - ${ref}`
      : `We have your scoping request - ${ref}`,
    text,
    html: shell({
      title: follow
        ? "We have the rest of your scoping request"
        : "We have your scoping request",
      preview: follow
        ? `The rest of ${ref}. A written scope comes back within two working days.`
        : `Your reference is ${ref}. A written scope comes back within two working days.`,
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
