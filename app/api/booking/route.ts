import { NextResponse } from "next/server";

import { book, busyBetween, clashes, send, wiring } from "@/lib/booking/google";
import { bookingConfirmation } from "@/lib/mail/templates";
import { BUFFER_MINUTES } from "@/components/book/diary";
import { MEETINGS } from "@/components/book/meetings";

/* ---------------------------------------------------------------------------
   Where a booking actually lands.

   It writes the event onto the calendar with the person invited, so the
   invitation is a real one from a real account rather than a message from us
   saying a meeting exists.

   The slot is checked twice. Once by the browser when it drew the page, and
   again here immediately before the write - because between the two is exactly
   long enough for somebody else to take it, and a booking screen that says
   confirmed when the diary says otherwise is the one thing this must not do.
   When it has gone, that is what comes back, and the flow returns the reader to
   the calendar rather than pretending.

   Validated again rather than trusting the browser. The screen checks the same
   fields before it will send, and that check is for the person filling it in;
   this one is because a route handler is a public endpoint.
--------------------------------------------------------------------------- */

const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** What may be asked for. A length outside this is not a meeting we offer. */
const LENGTHS = new Set([15, 30, 45, 60]);

/** Two clear days, matching the diary the browser was drawn from. */
const LEAD_MS = 2 * 86_400_000;

export async function POST(request: Request) {
  const w = wiring();

  if (!w) {
    return NextResponse.json(
      {
        ok: false,
        problem: "The diary is not connected to this environment yet.",
      },
      { status: 503 },
    );
  }

  let body: {
    meeting?: unknown;
    minutes?: unknown;
    start?: unknown;
    name?: unknown;
    email?: unknown;
    notes?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, problem: "That did not arrive as we expected it to." },
      { status: 400 },
    );
  }

  const meeting = MEETINGS.find((entry) => entry.key === body.meeting);
  const minutes = Number(body.minutes);
  const start = new Date(String(body.start));
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const notes = String(body.notes ?? "").trim();

  if (!meeting || !LENGTHS.has(minutes)) {
    return NextResponse.json(
      { ok: false, problem: "That is not a meeting we offer." },
      { status: 422 },
    );
  }

  if (!name) {
    return NextResponse.json(
      { ok: false, problem: "We need a name to put on the invitation." },
      { status: 422 },
    );
  }

  if (!LOOKS_LIKE_EMAIL.test(email)) {
    return NextResponse.json(
      { ok: false, problem: "That email address does not look right." },
      { status: 422 },
    );
  }

  if (Number.isNaN(start.getTime())) {
    return NextResponse.json(
      { ok: false, problem: "That is not a time we can read." },
      { status: 422 },
    );
  }

  if (start.getTime() < Date.now() + LEAD_MS) {
    return NextResponse.json(
      {
        ok: false,
        problem: "We need two clear days' notice. Pick a later day.",
      },
      { status: 422 },
    );
  }

  const end = new Date(start.getTime() + minutes * 60_000);

  try {
    /* The second check, on the instant of writing. The buffer is included so a
       booking cannot land against the back of an existing meeting. */
    const pad = BUFFER_MINUTES * 60_000;
    const busy = await busyBetween(
      w,
      new Date(start.getTime() - pad),
      new Date(end.getTime() + pad),
    );

    if (clashes(busy, new Date(start.getTime() - pad), new Date(end.getTime() + pad))) {
      return NextResponse.json(
        {
          ok: false,
          taken: true,
          problem:
            "That time has just gone. Nothing has been booked - pick another and it will hold.",
        },
        { status: 409 },
      );
    }

    const booked = await book(w, {
      summary: `${meeting.name} with ${name}`,
      description: [
        `${meeting.name}, ${minutes} minutes.`,
        `Booked from twinloom.com by ${name} <${email}>.`,
        notes ? `\nWhat they said:\n${notes}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      start,
      end,
      attendee: { name, email },
      meet: true,
    });

    /* The invitation comes from the calendar. This is the note beside it,
       because an invitation on its own tells somebody a meeting exists without
       telling them what happens next - and it is the same shell the scoping
       receipt is set in, so two messages from this site look like two messages
       from the same company. */
    /* The time in the office's own zone and in words, rather than an ISO
       stamp. The invitation renders the instant in whatever zone the reader
       keeps; this has to be readable on its own. */
    const when = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(start);

    const confirmation = bookingConfirmation({
      name,
      meeting: meeting.name,
      minutes,
      when,
      zone: "Europe/London",
      meet: booked.meet,
    });

    await send(
      w,
      email,
      confirmation.subject,
      confirmation.text,
      confirmation.html,
    ).catch((wrong) => {
      /* The meeting is booked and the invitation has gone. A failed covering
         note is not a failed booking, and telling somebody it failed makes
         them book a second one. */
      console.error("[booking confirmation email]", wrong);
    });

    await send(
      w,
      w.notify,
      `New booking: ${meeting.name}, ${name}`,
      [
        `${meeting.name}, ${minutes} minutes`,
        `When: ${when}`,
        `Who: ${name} <${email}>`,
        notes ? `\nWhat they said:\n${notes}` : "",
        booked.link ? `\n${booked.link}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    ).catch((wrong) => {
      console.error("[booking notification]", wrong);
    });

    return NextResponse.json({ ok: true, meet: booked.meet });
  } catch (wrong) {
    console.error("[booking]", wrong);
    return NextResponse.json(
      {
        ok: false,
        problem:
          "It did not go through. Nothing has been booked - try once more.",
      },
      { status: 502 },
    );
  }
}
