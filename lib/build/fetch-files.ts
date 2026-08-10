import type { Attachment } from "@/lib/booking/google";

import type { Attached } from "./attachments";

/* ---------------------------------------------------------------------------
   Bringing the files back so they can ride on the message.

   They were uploaded straight from the browser to Cloudinary and never touched
   this server, which is the right way round: a route handler that proxies
   uploads is a route handler with a body-size limit and a timeout in the middle
   of somebody attaching a brochure. But a link in an inbox is a link, and the
   thing whoever opens it actually wants is the file.

   So they come back here, once, at the moment the notification is built. It is
   the only place on this site that downloads anything, and everything about it
   is defensive: a budget, a per-file ceiling, a timeout, and a failure that
   costs the message nothing.
--------------------------------------------------------------------------- */

/**
 * How much may ride on one message.
 *
 * Gmail refuses a message over 25MB and the base64 encoding this has to go
 * through adds a third, so the real ceiling is nearer eighteen. Sixteen leaves
 * room for the document, which on a long run-through is not nothing.
 *
 * Whatever does not fit is not lost: every file is listed in the message with
 * its own address whether or not it was attached, so the worst case is a link
 * to click rather than a file that vanished.
 */
const BUDGET = 16 * 1024 * 1024;

/** And no single file may take most of it. The uploader's own cap is 10MB. */
const EACH = 10 * 1024 * 1024;

/**
 * How long to wait on Cloudinary before giving up on one file.
 *
 * The notification is worth more than the attachment. A CDN having a slow
 * minute must not hold up the one message that says somebody is waiting for an
 * answer, so a file that has not arrived in eight seconds is abandoned and the
 * message goes with a link to it instead.
 */
const PATIENCE = 8000;

/** What the file is, taken from the response rather than guessed from a name. */
const typeOf = (response: Response) =>
  (response.headers.get("content-type") ?? "application/octet-stream").split(
    ";",
  )[0];

/**
 * Fetch what fits, in order, and say nothing about the rest.
 *
 * In order rather than all at once, because the budget is a running total and
 * parallel fetches cannot honour one - and because the numbering is what ties a
 * paperclip to a row in the list, so the first files are the ones worth having.
 */
export async function fetchFiles(files: Attached[]): Promise<{
  attachments: Attachment[];
  /** Numbers that did not make it, so the message can say which and why. */
  skipped: number[];
}> {
  const attachments: Attachment[] = [];
  const skipped: number[] = [];
  let spent = 0;

  for (const file of files) {
    if (spent >= BUDGET) {
      skipped.push(file.index);
      continue;
    }

    try {
      const stop = AbortSignal.timeout(PATIENCE);
      const response = await fetch(file.url, { signal: stop });

      if (!response.ok) {
        skipped.push(file.index);
        continue;
      }

      const body = Buffer.from(await response.arrayBuffer());

      /* Checked after the download rather than from the `content-length`
         header. Cloudinary transforms are generated on request and do not
         always declare a length, and a header that may be absent is not a
         check. Eight seconds and ten megabytes is a bounded thing to read
         before deciding not to keep it. */
      if (body.byteLength > EACH || spent + body.byteLength > BUDGET) {
        skipped.push(file.index);
        continue;
      }

      spent += body.byteLength;
      attachments.push({
        filename: file.filename,
        type: typeOf(response),
        body,
      });
    } catch {
      /* Any of: the timeout, a DNS failure, a 404 on a file somebody deleted.
         None of them is a reason not to send the message, and all of them leave
         the link in the document. */
      skipped.push(file.index);
    }
  }

  return { attachments, skipped };
}
