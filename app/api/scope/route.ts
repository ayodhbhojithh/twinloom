import { NextResponse } from "next/server";

import { send, wiring } from "@/lib/booking/google";
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

  /* The log first, and always.

     It survives whether or not the mail goes, it is timestamped, and on any
     host worth using it is searchable. A scope that arrived and could not be
     forwarded is still a scope that arrived. */
  console.info(
    `[scope ${ref}] from ${ask.name} at ${ask.company} <${ask.email}>
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
      `Scoping request ${ref}: ${ask.company}`,
      [
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
    await send(
      w,
      ask.email!.trim(),
      `We have your scoping request - ${ref}`,
      [
        `Hello ${ask.name},`,
        "",
        "Thank you - your scoping request has arrived and a person will read",
        "it. What comes back is a written scope in your own words, within two",
        "working days.",
        "",
        `Your reference is ${ref}. Quote it in any reply, and anything you`,
        "attached is filed under it.",
        "",
        "It is a description of a website rather than a quote. Nothing in it is",
        "priced, and nothing you answered commits you to anything.",
        "",
        "If you would rather talk it through first, you can book a time at",
        "https://twinloom.com/book",
        "",
        "TwinLoom, a TwinCoreTech company",
      ].join("\n"),
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
