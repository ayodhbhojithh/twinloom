/* ---------------------------------------------------------------------------
   What a route accepts before it does anything.

   Three of the four API routes here spend somebody else's money when they are
   called: two send email through our own account and one signs an upload into
   our Cloudinary. Every one of them checked the shape of what arrived and none
   of them checked how much of it there was, or how often.

   That is the difference between a form and an open relay. A script posting a
   valid-looking request in a loop sends mail from our domain until the account
   is suspended or the reputation is gone, and the answer to it is not a better
   validator - the requests are all perfectly well formed.

   Two limits, both blunt on purpose.

   A cap on how much text may arrive, because every field here ends up in an
   email and no honest answer to "what is your company called" is four thousand
   characters. And a cap on how often one address may ask, held in memory.

   In memory is a real limitation and worth being honest about: a serverless
   deployment runs several instances and each keeps its own count, so the true
   allowance is the number here times the number of warm instances. It still
   turns "unlimited" into "a few dozen", which is the whole of the distance
   that matters. A shared counter needs a store this site does not have, and
   adding one for this would be adding a database to hold a number.
--------------------------------------------------------------------------- */

/** How much of anything a person may send in one field. */
export const CAPS = {
  /** A name, a company, an email address, a phone number. */
  field: 200,
  /** The whole scoping document, which is generated rather than typed. */
  document: 200_000,
  /** One free-text answer or note. */
  note: 4_000,
} as const;

/**
 * A string that arrived from a browser, or nothing.
 *
 * Trimmed and cut to length rather than refused. Somebody who pastes an essay
 * into a field meant for a company name has not attacked anything, and losing
 * the request over it is a worse answer than keeping the first two hundred
 * characters of it.
 */
export function text(value: unknown, cap: number = CAPS.field): string {
  return typeof value === "string" ? value.trim().slice(0, cap) : "";
}

/**
 * Who is asking, as well as a request behind a proxy can say.
 *
 * `x-forwarded-for` is written by whatever sits in front of this, and its first
 * entry is the client as that proxy saw it. It can be forged where nothing
 * trustworthy is in front - which is why this is a rate limit and not an access
 * control. Nothing is granted on the strength of it.
 */
export function caller(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/* One bucket per caller: when the window opened, and how many have been let
   through since. Swept on write rather than on a timer, because a timer in a
   module keeps a serverless instance from being reclaimed. */
const SEEN = new Map<string, { from: number; count: number }>();

/** Anything older than the longest window in use is not evidence of anything. */
const FORGET = 60 * 60 * 1000;

export interface Allowance {
  /** How many requests one caller may make inside the window. */
  every: number;
  /** How long the window is, in milliseconds. */
  window: number;
}

/**
 * Whether this caller may have another one.
 *
 * Returns the seconds until they may ask again where they may not, so the
 * route can say something true rather than "too many requests".
 */
export function within(
  request: Request,
  key: string,
  { every, window }: Allowance,
): { ok: true } | { ok: false; after: number } {
  const now = Date.now();
  const id = `${key}:${caller(request)}`;

  if (SEEN.size > 5000) {
    for (const [at, bucket] of SEEN) {
      if (now - bucket.from > FORGET) SEEN.delete(at);
    }
  }

  const bucket = SEEN.get(id);

  if (!bucket || now - bucket.from > window) {
    SEEN.set(id, { from: now, count: 1 });
    return { ok: true };
  }

  if (bucket.count >= every) {
    return { ok: false, after: Math.ceil((bucket.from + window - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true };
}
