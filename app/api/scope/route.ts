import { NextResponse } from "next/server";

import { isReference, makeReference } from "@/lib/build/reference";

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
    document?: string;
    ask?: Record<string, string>;
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

  /* ---------------------------------------------------------------------
     The seam.

     Replace this with the send - an email to the inbox, a row in a table, a
     webhook - and everything upstream stays exactly as it is. Until then it
     is written to the server log, which is a real place: it survives the
     request, it is timestamped, and on any host worth using it is searchable.
     What it is not is a promise, so nothing here or on the screen claims the
     request has been filed anywhere it has not.

     Whatever replaces it must not throw into the response. A scope that was
     received and could not be forwarded is still received, and telling
     somebody it failed makes them send it twice.
  --------------------------------------------------------------------- */
  console.info(
    `[scope ${ref}] from ${ask.name} at ${ask.company} <${ask.email}>\n${body.document}`,
  );

  return NextResponse.json({ ok: true, ref });
}

/** Anything else, answered plainly rather than with a framework default. */
export function GET() {
  return NextResponse.json(
    { ok: false, problem: "Send a scoping request with POST." },
    { status: 405 },
  );
}
