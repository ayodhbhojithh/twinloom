import { JWT } from "google-auth-library";

/* ---------------------------------------------------------------------------
   The calendar, for real.

   One service account, impersonating the mailbox the meetings belong to. That
   impersonation is the whole reason domain-wide delegation is needed: a service
   account with a calendar merely shared with it can create an event but cannot
   invite anybody, so the person who booked would never receive an invitation.
   Acting as the user, the event is theirs, the invite is genuine, and the
   confirmation comes from an address the recipient recognises.

   The calendar is the store. Nothing here writes a booking anywhere else,
   because two records of one meeting is two records that disagree the first
   time somebody moves it from their own calendar. Free/busy is read at the
   moment it is needed rather than cached, and read again immediately before the
   event is written - between loading a page and pressing a button is exactly
   long enough for a slot to go.

   Everything below returns rather than throws where the caller has to say
   something to a person, because the only place any of this is read is a
   sentence under a button.
--------------------------------------------------------------------------- */

const CALENDAR = "https://www.googleapis.com/calendar/v3";
const GMAIL = "https://gmail.googleapis.com/gmail/v1";

/** The line ending RFC 2822 asks for, named so it is written once. */
const CRLF = String.fromCharCode(13, 10);

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/gmail.send",
];

/** What the environment has to carry before any of this can work. */
export interface Wiring {
  email: string;
  key: string;
  calendarId: string;
  notify: string;
}

/**
 * The four variables, or null.
 *
 * Null rather than a thrown error: without them the site is not broken, it is
 * not configured, and the two want different answers from whoever is reading
 * the logs. The route handlers turn this into a 503 that says so.
 */
export function wiring(): Wiring | null {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!email || !key || !calendarId) return null;

  return {
    email,
    /* `.env` files cannot hold a real newline, so the key arrives with the
       breaks written as two characters. PEM parsing wants them back. */
    key: key.replace(/\\n/g, "\n"),
    calendarId,
    notify: process.env.BOOKING_NOTIFY_EMAIL || calendarId,
  };
}

/** A client acting as the mailbox, not as the service account. */
function client(w: Wiring) {
  return new JWT({
    email: w.email,
    key: w.key,
    scopes: SCOPES,
    /* The impersonation. Without it Google refuses to send invitations. */
    subject: w.calendarId,
  });
}

async function call<T>(
  w: Wiring,
  url: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const auth = client(w);
  const token = await auth.getAccessToken();

  const sent = await fetch(url, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });

  const body = await sent.json().catch(() => null);

  if (!sent.ok) {
    const said = body?.error?.message ?? body?.error ?? sent.statusText;
    throw new Error(typeof said === "string" ? said : "Calendar refused it.");
  }

  return body as T;
}

/** One stretch of time somebody is not free. */
export interface Busy {
  start: string;
  end: string;
}

/**
 * When the calendar is not free, between two instants.
 *
 * Free/busy rather than listing events: it needs no permission to read what a
 * meeting is about, it collapses overlapping events for us, and it counts
 * anything marked busy including entries made from a phone five minutes ago.
 */
export async function busyBetween(
  w: Wiring,
  from: Date,
  to: Date,
): Promise<Busy[]> {
  const answer = await call<{
    calendars?: Record<string, { busy?: Busy[]; errors?: unknown[] }>;
  }>(w, `${CALENDAR}/freeBusy`, {
    method: "POST",
    body: {
      timeMin: from.toISOString(),
      timeMax: to.toISOString(),
      items: [{ id: w.calendarId }],
    },
  });

  return answer.calendars?.[w.calendarId]?.busy ?? [];
}

/** Whether a proposed meeting overlaps anything already in the diary. */
export function clashes(busy: readonly Busy[], start: Date, end: Date) {
  return busy.some((b) => {
    const from = new Date(b.start).getTime();
    const to = new Date(b.end).getTime();
    return start.getTime() < to && end.getTime() > from;
  });
}

export interface Booking {
  summary: string;
  description: string;
  start: Date;
  end: Date;
  attendee: { name: string; email: string };
  /** A Google Meet link, created with the event. */
  meet: boolean;
}

export interface Booked {
  id: string;
  link: string | null;
  meet: string | null;
}

/**
 * Write it in, and invite them.
 *
 * `sendUpdates: "all"` is what actually posts the invitation. Without it the
 * event exists and nobody is told, which is the failure this whole page is
 * trying to avoid.
 */
export async function book(w: Wiring, m: Booking): Promise<Booked> {
  const created = await call<{
    id: string;
    htmlLink?: string;
    hangoutLink?: string;
  }>(
    w,
    `${CALENDAR}/calendars/${encodeURIComponent(w.calendarId)}/events` +
      `?sendUpdates=all${m.meet ? "&conferenceDataVersion=1" : ""}`,
    {
      method: "POST",
      body: {
        summary: m.summary,
        description: m.description,
        start: { dateTime: m.start.toISOString() },
        end: { dateTime: m.end.toISOString() },
        attendees: [
          { email: m.attendee.email, displayName: m.attendee.name },
        ],
        reminders: { useDefault: true },
        ...(m.meet
          ? {
              conferenceData: {
                createRequest: {
                  /* Google wants an id it can deduplicate retries by. Derived
                     from the instant rather than random, so a retry of the same
                     booking cannot create a second conference. */
                  requestId: `twinloom-${m.start.getTime()}`,
                  conferenceSolutionKey: { type: "hangoutsMeet" },
                },
              },
            }
          : {}),
      },
    },
  );

  return {
    id: created.id,
    link: created.htmlLink ?? null,
    meet: created.hangoutLink ?? null,
  };
}

/**
 * Send a message, as the mailbox.
 *
 * Base64url of an RFC 2822 message, which is what the Gmail API takes. No
 * third-party sending service and no new DNS record: it leaves from the
 * account itself, so SPF and DKIM already pass.
 *
 * Where there is HTML it goes as `multipart/alternative` with the text first,
 * which is the order the standard asks for - a client shows the last part it
 * understands, so text first and HTML second means the better one wins. Both
 * parts are always sent: a message with no text alternative scores worse with
 * every spam filter there is, and some people read mail as text on purpose.
 */
export async function send(
  w: Wiring,
  to: string,
  subject: string,
  text: string,
  html?: string,
) {
  /* A boundary that cannot appear in either part. Derived rather than random
     so a retry of the same message is byte-identical. */
  const edge = `twinloom-${Buffer.from(subject).toString("hex").slice(0, 24)}`;

  const head = [
    `To: ${to}`,
    `From: TwinLoom <${w.calendarId}>`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
  ];

  const message = html
    ? [
        ...head,
        `Content-Type: multipart/alternative; boundary="${edge}"`,
        "",
        `--${edge}`,
        'Content-Type: text/plain; charset="UTF-8"',
        "",
        text,
        "",
        `--${edge}`,
        'Content-Type: text/html; charset="UTF-8"',
        "",
        html,
        "",
        `--${edge}--`,
      ].join(CRLF)
    : [...head, 'Content-Type: text/plain; charset="UTF-8"', "", text].join(
        CRLF,
      );

  const raw = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await call(w, `${GMAIL}/users/me/messages/send`, {
    method: "POST",
    body: { raw },
  });
}
