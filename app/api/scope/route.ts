import { NextResponse } from "next/server";

import { send, wiring } from "@/lib/booking/google";
import { scopeReceipt } from "@/lib/mail/templates";
import { isReference, makeReference } from "@/lib/build/reference";
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

export async function POST(request: Request) {
  let body: {
    desk?: unknown;
    follow?: unknown;
    document?: string;
    ask?: Record<string, string>;
    answers?: { refs?: { url?: unknown; text?: unknown }[]; text?: unknown };
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
    await send(
      w,
      w.notify,
      follow
        ? `More detail on ${ref}: ${ask.company}`
        : `Scoping request ${ref}: ${ask.company}`,
      [
        /* Said at the top, before the document. Whoever opens this needs to
           know it supersedes an earlier one before they start reading it, not
           after. */
        follow
          ? "A fuller answer to a request already sent under this reference. This is the version to read."
          : "",
        `From: ${ask.name} at ${ask.company} <${ask.email}>`,
        ask.phone ? `Phone: ${ask.phone}` : "",
        `Reference: ${ref}`,
        "",
        body.document,
      ]
        .filter(Boolean)
        .join("\n"),
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

    const receipt = scopeReceipt({
      name: ask.name!.trim(),
      ref,
      described,
      attachments: files,
      notes,
      /* `none` for now, and it is the honest one of the three.

         The other two - a call already booked, or times offered for us to
         confirm - are real states this message is written to carry, and neither
         can happen yet: nothing in the run-through asks for either, so a
         submission carries no meeting at all. When that step exists it sets
         this, and the wording for all three is already here. */
      meeting: { kind: "none" },
      /* No `archive`. There is nowhere to read a submission back - nothing is
         stored, the email is the record - so the line is left out rather than
         shipped as a link that goes nowhere, which is the one thing in a
         receipt everybody presses. */
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
