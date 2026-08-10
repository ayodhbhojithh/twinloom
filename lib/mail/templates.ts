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

const { INK, BODY, QUIET, LABEL, MARK, CANVAS } = palette;
const { SANS, MONO } = fonts;

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

/* ---------------------------------------------------------------------------
   The one that comes to us.

   `scopeDocument` in `lib/build/submit` writes the request out as plain text,
   and that text is the record: it is what goes in the log, it is what a text
   client shows, and it is built in the browser because only the browser has the
   derivations that turn answers into pages. None of that changes here.

   What changes is that the text was also the whole of the email. Eight sections
   of labels, values and lists arrived as one unbroken column of 13px prose with
   no heading weight, no alignment and no separation - so reading it meant
   finding the capital letters and working out where each section stopped. This
   reads the same text back and sets it.

   Parsed rather than restructured at the source, and that is deliberate. The
   document has one author; giving it a second representation to keep in step
   would mean every new line had to be added twice, and the day they disagree is
   the day the email stops matching the log.
--------------------------------------------------------------------------- */

/** The two sections written as `Label: value`, and the only two. */
const FIELD_SECTIONS = new Set(["WHO IS ASKING", "THE ORGANISATION"]);

/**
 * What the block at the top of the message already says.
 *
 * Dropped from `WHO IS ASKING` rather than left to appear twice. In the plain
 * text there was nothing above the document, so that section was the only place
 * these four had ever been said; here they are the header, set as links, and a
 * section repeating them immediately underneath reads as the message having
 * been assembled by machine. What is left of the section is the part the header
 * does not carry - the part they play in the decision, and when they need it
 * live - which is worth its own heading.
 */
const IN_THE_HEADER = new Set(["Your name", "Company", "Email", "Phone"]);

/** A heading is a line that is already shouting. */
const isHeading = (line: string) =>
  /[A-Z]/.test(line) && line === line.toUpperCase() && !line.startsWith("-");

const linkify = (value: string) =>
  /^https?:\/\//.test(value)
    ? `<a href="${esc(value)}" style="color:${MARK};text-decoration:underline;word-break:break-all">${esc(
        value,
      )}</a>`
    : esc(value);

/**
 * The document, set.
 *
 * One pass down the lines, because the grammar is small enough to read in one:
 * a shouting line opens a section, two spaces make a continuation of whatever
 * was above it, a leading dash makes a bullet, a trailing colon makes a
 * sub-heading, and inside the two sections that use them a colon makes a row.
 * Anything else is a sentence somebody typed.
 *
 * `headings` and `omit` are what let the same document be set twice. It is
 * written for us - "what they told us", "the site their answers describe" - and
 * the person who wrote it gets a copy, where every one of those is about them
 * and reads as being talked about in the third person. Renaming the headings is
 * the whole of the difference; the content underneath is theirs either way, and
 * rewriting that would give the two copies different facts.
 */
function setDocument(
  document: string,
  {
    headings,
    omit,
  }: {
    /** Section name as written, to section name as shown. */
    headings?: Record<string, string>;
    /** Sections to leave out entirely, with everything under them. */
    omit?: Set<string>;
  } = {},
) {
  const out: string[] = [];
  let section = "";
  let open = false;
  let skipping = false;

  /* The heading is held back until something turns up under it.

     A section can come out empty - `WHO IS ASKING` loses four of its lines to
     the header above, and any of them can be empty in the document to begin
     with, since `line()` writes nothing for a field nobody filled in. A rule
     with nothing under it is worse than a missing section: it reads as content
     that failed to load. */
  let pending = "";

  const shut = () => {
    if (open) out.push("</table>");
    open = false;
  };

  const land = () => {
    if (!pending) return;
    out.push(pending);
    pending = "";
  };

  const row = (cells: string) => {
    land();
    if (!open) {
      out.push(
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0">`,
      );
      open = true;
    }
    out.push(`<tr>${cells}</tr>`);
  };

  for (const raw of document.split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    if (skipping && !isHeading(line)) continue;

    if (isHeading(line)) {
      shut();
      section = line.replace(/\s*\(.*\)$/, "");

      /* Dropped with everything under it. `skipping` holds until the next
         heading, because a section is its heading plus whatever follows, and
         nothing in this grammar closes one. */
      skipping = Boolean(omit?.has(section));
      if (skipping) {
        pending = "";
        continue;
      }

      /* The count in the heading - "(4 pages)" - set apart from the heading
         itself. It is a fact about the section rather than part of its name,
         and at the same weight it reads as one long label. */
      const count = line.match(/\((.*)\)$/)?.[1] ?? "";
      pending = `<div style="margin:26px 0 0;padding:0 0 8px;border-bottom:1px solid #e8eaee">
           <span style="font-family:${MONO};font-size:9px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${LABEL};line-height:1">${esc(
             headings?.[section] ?? section,
           )}</span>${
             count
               ? `<span style="font-family:${MONO};font-size:9px;font-weight:700;letter-spacing:0.16em;color:${MARK};line-height:1"> ${esc(
                   count,
                 )}</span>`
               : ""
           }
         </div>`;
      continue;
    }

    /* Indented: a page under its zone, or the address of the reference above
       it. Set in the mono face and pulled in, so a run of them reads as a list
       belonging to the line before rather than as more sentences. */
    if (raw.startsWith("  ")) {
      row(
        `<td style="padding:5px 0 0 16px;font-family:${MONO};font-size:11.5px;line-height:1.6;color:${QUIET}">${linkify(
          line.trim(),
        )}</td>`,
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const text = line.slice(2);
      row(
        `<td width="14" valign="top" style="padding:6px 0 0;font-family:${SANS};font-size:13px;line-height:1.55;color:${MARK}">&bull;</td>
         <td style="padding:6px 0 0;font-family:${SANS};font-size:13px;line-height:1.55;color:${BODY}">${linkify(
           text,
         )}</td>`,
      );
      continue;
    }

    /* A zone name inside the pages: "Always there:" with its pages under it. */
    if (line.endsWith(":") && !line.slice(0, -1).includes(": ")) {
      shut();
      land();
      out.push(
        `<div style="margin:14px 0 0;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:-0.01em;color:${INK};line-height:1.4">${esc(
          line.slice(0, -1),
        )}</div>`,
      );
      continue;
    }

    const at = line.indexOf(": ");

    if (at > 0 && FIELD_SECTIONS.has(section)) {
      if (section === "WHO IS ASKING" && IN_THE_HEADER.has(line.slice(0, at))) {
        continue;
      }

      row(
        `<td width="38%" valign="top" style="padding:7px 12px 0 0;font-family:${SANS};font-size:12px;line-height:1.5;color:${LABEL}">${esc(
          line.slice(0, at),
        )}</td>
         <td valign="top" style="padding:7px 0 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${INK}">${linkify(
           line.slice(at + 2),
         )}</td>`,
      );
      continue;
    }

    /* Whatever they wrote, as they wrote it. */
    shut();
    land();
    out.push(
      `<div style="margin:10px 0 0;font-family:${SANS};font-size:13px;line-height:1.65;color:${BODY};white-space:pre-wrap">${esc(
        line,
      )}</div>`,
    );
  }

  shut();
  return out.join("");
}

/**
 * The notification of a scoping request, for our own inbox.
 *
 * Everything above the document is what somebody needs before they decide to
 * read it: whose it is, how to reach them, and which reference it is filed
 * under. The name and the address are links because the first thing anybody
 * does with this email is answer it, and a mail address you have to select and
 * copy is one nobody answers from their phone.
 */
export function scopeNotice({
  ref,
  name,
  company,
  email,
  phone,
  document,
  follow,
}: {
  ref: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  document: string;
  follow?: boolean;
}): Message {
  const fact = (label: string, value: string) =>
    `<tr>
       <td width="34%" valign="top" style="padding:6px 12px 0 0;font-family:${SANS};font-size:11.5px;line-height:1.5;color:${LABEL}">${esc(
         label,
       )}</td>
       <td valign="top" style="padding:6px 0 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${INK}">${value}</td>
     </tr>`;

  const body = `
    ${kicker(follow ? "More detail" : "Scoping request")}
    <h1 style="margin:12px 0 0;font-family:${SANS};font-size:22px;line-height:1.2;font-weight:700;letter-spacing:-0.022em;color:${INK}">${esc(
      company,
    )}</h1>

    ${
      follow
        ? `<div style="margin:16px 0 0;padding:12px 14px;background:${CANVAS};border-radius:12px;font-family:${SANS};font-size:12.5px;line-height:1.6;color:${BODY}">A fuller answer to a request already sent under this reference. <b style="color:${INK};font-weight:600">This is the version to read.</b></div>`
        : ""
    }

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 0">
      ${fact("From", esc(name))}
      ${fact(
        "Email",
        `<a href="mailto:${esc(email)}" style="color:${MARK};text-decoration:underline">${esc(
          email,
        )}</a>`,
      )}
      ${
        phone
          ? fact(
              "Phone",
              `<a href="tel:${esc(phone.replace(/[^\d+]/g, ""))}" style="color:${MARK};text-decoration:underline">${esc(
                phone,
              )}</a>`,
            )
          : ""
      }
      ${fact(
        "Reference",
        `<span style="font-family:${MONO};font-size:12.5px;font-weight:700">${esc(
          ref,
        )}</span>`,
      )}
    </table>

    ${setDocument(document)}`;

  const text = [
    follow
      ? "A fuller answer to a request already sent under this reference. This is the version to read."
      : "",
    `From: ${name} at ${company} <${email}>`,
    phone ? `Phone: ${phone}` : "",
    `Reference: ${ref}`,
    "",
    document,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: follow
      ? `More detail on ${ref}: ${company}`
      : `Scoping request ${ref}: ${company}`,
    text,
    html: shell({
      title: follow ? `More detail on ${ref}` : `Scoping request ${ref}`,
      preview: `${name} at ${company}. ${ref}.`,
      body,
      /* Wider and read from the left, unlike everything else this file sends.
         See `shell`: a note is centred, a filled-in document is not. */
      width: 620,
      align: "left",
    }),
  };
}
