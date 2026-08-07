/* ---------------------------------------------------------------------------
   The reference a submission is known by.

   One string, used three times: it names the Cloudinary folder the attachments
   go into, it is what comes back on the sent screen, and it is what somebody
   quotes at us in an email a fortnight later. Three different strings for one
   submission is three chances for the folder and the email to be about
   different things.

   It is made in the browser rather than on the server, because the first thing
   that needs it is the first file somebody drops - long before anything is
   sent. The route handler still checks the shape of what arrives: a reference
   that decides a folder path is a reference an attacker would like to choose.
--------------------------------------------------------------------------- */

/** `TL-20260807-K3F9Q`. Date first so a folder of them sorts into order. */
export const REFERENCE = /^TL-\d{8}-[A-Z0-9]{5}$/;

/**
 * A new one.
 *
 * The day, then a short random tail so two on the same day cannot collide.
 * Not a database id, because there is no database, and a reference that means
 * nothing to us is worse than one that at least says when it arrived.
 */
export function makeReference(): string {
  const now = new Date();
  const day = now.toISOString().slice(0, 10).replace(/-/g, "");

  /* From an alphabet without the characters that get misread aloud. Somebody
     reads this down a phone. */
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let tail = "";
  for (let n = 0; n < 5; n += 1) {
    tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return `TL-${day}-${tail}`;
}

export function isReference(value: unknown): value is string {
  return typeof value === "string" && REFERENCE.test(value);
}
