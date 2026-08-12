import { NextResponse } from "next/server";

import { send, wiring } from "@/lib/booking/google";
import { scopeNotice, scopeReceipt, type Meeting } from "@/lib/mail/templates";
import { isReference, makeReference } from "@/lib/build/reference";
import { attachedFrom } from "@/lib/build/attachments";
import { fetchFiles } from "@/lib/build/fetch-files";
import { mediaFolder } from "@/lib/build/media";
import { absolute } from "@/lib/seo";
import { CONTACT_INFO, ROUTES } from "@/lib/site";

/* ---------------------------------------------------------------------------
   Where a scoping request lands.

   The one place a submitted scope arrives, and the one place to change when
   there is somewhere to forward it to. Everything before this - the run-through,
   the derivations, the document - is settled; this is the seam.

   It validates again rather than trusting the browser. The screen checks the
   same four fields before it will send, and that check is for the person
   filling the form; this one is because a route handler is a public endpoint
   and anything can post to it.
--------------------------------------------------------------------------- */

/** The four the document cannot be addressed without. */
const REQUIRED_FIELDS = ["name", "company", "email"] as const;

/** Enough to catch a typo, not enough to argue with a real address. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Which of the three things is true about talking it through.
 *
 * Read from the answers the browser posted, and read defensively: this is a
 * public endpoint, so everything here is checked rather than assumed. Anything
 * that does not look like a booking falls through to `none`, which is the one
 * of the three that promises the least - the safe direction to be wrong in is
 * telling somebody we will be in touch when a meeting already exists, not
 * telling them a meeting exists when it does not.
 */
function meetingFrom(answers: unknown): Meeting {
  const held = answers as {
    pick?: Record<string, Record<string, boolean>>;
    booked?: { when?: unknown };
  } | null;

  const booked = held?.booked;

  if (booked && typeof booked.when === "string" && booked.when.trim()) {
    return { kind: "booked", when: booked.when.trim() };
  }

  if (held?.pick?.talk?.times) return { kind: "slots" };

  return { kind: "none" };
}

export async function POST(request: Request) {
  let body: {
    desk?: unknown;
    follow?: unknown;
    document?: string;
    ask?: Record<string, string>;
    answers?: {
      refs?: {
        url?: unknown;
        text?: unknown;
        n?: unknown;
        where?: unknown;
      }[];
      text?: unknown;
      like?: unknown;
      /* What was chosen about talking it through, and the meeting where one was
         booked. Read rather than trusted - see `meetingFrom`. */
      pick?: unknown;
      booked?: unknown;
    };
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, problem: "That did not arrive as we expected it to." },
      { status: 400 },
    );
  }

  const ask = body.ask ?? {};
  const missing = REQUIRED_FIELDS.filter((field) => !ask[field]?.trim());

  if (missing.length) {
    return NextResponse.json(
      { ok: false, problem: `Still needed: ${missing.join(", ")}.` },
      { status: 422 },
    );
  }

  if (!LOOKS_LIKE_EMAIL.test(ask.email!.trim())) {
    return NextResponse.json(
      { ok: false, problem: "That email address does not look right." },
      { status: 422 },
    );
  }

  if (!body.document?.trim()) {
    return NextResponse.json(
      { ok: false, problem: "The request arrived empty." },
      { status: 422 },
    );
  }

  /* The browser's reference where it has one.

     Attachments were uploaded into a Cloudinary folder of that name long
     before this request was made, so minting a second reference here would
     hand somebody a number that matches nothing. Only one of the right shape
     is taken - it decides a folder path, and a client that can choose its own
     could point at any of them. */
  const ref = isReference(body.desk) ? body.desk : makeReference();

  /* A second send about the same submission rather than a new one.

     Somebody can send the quick version and then answer the questions, which
     is exactly what the sent screen invites them to do. That arrives here as a
     whole document again under the reference the first one had, and the subject
     line has to distinguish the two - otherwise the inbox holds two identical
     subjects and no way to tell which is the fuller one. */
  const follow = body.follow === true;

  /* The log first, and always.

     It survives whether or not the mail goes, it is timestamped, and on any
     host worth using it is searchable. A scope that arrived and could not be
     forwarded is still a scope that arrived. */
  console.info(
    `[scope ${ref}${follow ? " follow-up" : ""}] from ${ask.name} at ${ask.company} <${ask.email}>
${body.document}`,
  );

  /* Then the inbox. Sent as the same account the diary belongs to, so there is
     one credential for the whole site and no second sending domain to keep
     authenticated.

     It must not throw into the response. A scope that was received and could
     not be forwarded is still received, and telling somebody it failed makes
     them send it twice. */
  const w = wiring();

  if (w) {
    /* What they will recognise sending, counted from what actually arrived.

       A ref with a `url` is a file that reached Cloudinary; a ref without one
       is something typed on the desk. They are one list in the store because
       they are one column on the screen, and they are two lines in the receipt
       because "three attachments" and "two notes" are two different things to
       have forgotten. */
    const refs = Array.isArray(body.answers?.refs) ? body.answers.refs : [];
    const files = refs.filter(
      (entry) => typeof entry?.url === "string" && entry.url,
    ).length;
    const notes = refs.length - files;

    /* Whether they wrote anything in their own words.

       The quick route is a single box of prose and the run-through is a set of
       answers with prose scattered through it, so this asks the one question
       both can answer: is there any free text at all. Written as an unknown and
       narrowed, because it is whatever the browser posted. */
    const written = body.answers?.text;
    const described =
      typeof written === "object" && written !== null
        ? Object.values(written as Record<string, unknown>).some(
            (value) => typeof value === "string" && value.trim().length > 0,
          )
        : false;

    /* Set rather than pasted.

       The document is the record and it goes out unchanged - it is what the log
       holds and what a text client shows. What it also used to be is the whole
       of the HTML, which meant eight sections of labels and lists arriving as
       one unbroken column with no heading weight and no alignment. `scopeNotice`
       reads the same text back and sets it; nothing about what is sent has
       changed except that it can be read. */
    /* The files, brought back so they ride on the message rather than sitting
       behind eleven links. Numbered by the same function the browser numbered
       them with, so `02-logo.png` on the message is provably the second row of
       `FILES ATTACHED` in the document. */
    const wanted = attachedFrom(
      refs as Parameters<typeof attachedFrom>[0],
      (body.answers?.like as Record<number, string>) ?? {},
    );
    const { attachments, skipped } = await fetchFiles(wanted);

    const notice = scopeNotice({
      ref,
      name: ask.name!.trim(),
      company: ask.company!.trim(),
      email: ask.email!.trim(),
      phone: ask.phone?.trim(),
      document: body.document,
      attached: attachments.length,
      skipped,
      folder: files ? mediaFolder(ref) : undefined,
      follow,
    });

    await send(
      w,
      w.notify,
      notice.subject,
      notice.text,
      notice.html,
      attachments,
    ).catch((wrong) => {
      console.error(`[scope ${ref}] could not be forwarded`, wrong);
    });

    /* And the person who sent it.

       Only our own inbox was told. Somebody wrote out what they wanted,
       attached files to it, pressed send and got a reference on a screen they
       were about to close - with nothing in writing anywhere they could find
       it again. The reference is what everything they attached is filed
       under, so it has to reach them somewhere they keep.

       Sent second, and its failure is caught separately. If ours goes and
       theirs does not, the request is still received. */
    const receipt = scopeReceipt({
      name: ask.name!.trim(),
      ref,
      described,
      attachments: files,
      notes,
      /* Which of the three is true, read from the answers.

         It was hard-coded to `none`, on the grounds that nothing in the run
         asked about a meeting. That stopped being true: the last step asks, and
         somebody who books gets a calendar invitation - so the receipt was
         telling them we would be in touch to arrange a call they had already
         confirmed, in the same minute the invitation arrived.

         `booked` where they booked one and `slots` where they gave us times to
         confirm; `none` covers both "neither, for now" and not answering, which
         are the same promise from us either way. */
      meeting: meetingFrom(body.answers),
      /* The request itself, sent back to the person who wrote it.

         The same document our own copy carries, under headings written to them
         rather than about them. It began as a link to somewhere they could read
         it back and there is nowhere - nothing is stored, the email is the
         record - and putting it in the message is the better answer regardless:
         it is then in whatever they use to keep mail, and it is still there the
         day a link would have rotted. */
      document: body.document,
      addTo: absolute(ROUTES.build),
      contactEmail: CONTACT_INFO.primaryEmail,
      phone: CONTACT_INFO.phone,
      privacyUrl: absolute(ROUTES.privacy),
      follow,
    });

    await send(
      w,
      ask.email!.trim(),
      receipt.subject,
      receipt.text,
      receipt.html,
    ).catch((wrong) => {
      console.error(`[scope ${ref}] receipt to sender failed`, wrong);
    });
  } else {
    console.warn(
      `[scope ${ref}] no mail credentials in this environment - log only`,
    );
  }

  return NextResponse.json({ ok: true, ref });
}

/** Anything else, answered plainly rather than with a framework default. */
export function GET() {
  return NextResponse.json(
    { ok: false, problem: "Send a scoping request with POST." },
    { status: 405 },
  );
}
