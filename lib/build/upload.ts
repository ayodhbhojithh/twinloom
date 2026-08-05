/* ---------------------------------------------------------------------------
   Attachments, and the one place a real uploader goes.

   Everything that takes a file on this site goes through `sendFile` below. That
   is the whole point of this file: when Cloudinary is wired up, one function
   changes and every drop zone, every step and the notes desk get it at once.
   Written into each control instead, an upload becomes four implementations
   that disagree about size limits by the second one.

   Until then it keeps the file in the tab. A local object URL is a real,
   working preview - the thumbnail is the actual picture, not a placeholder -
   and it is honest about what it is not: it lasts as long as the tab does and
   goes nowhere. Nothing here pretends a file has been sent when it has not.
--------------------------------------------------------------------------- */

/** A file that has been taken in, wherever it is now living. */
export interface Attached {
  name: string;
  /** Bytes, kept raw so it can be shown in whatever unit suits the width. */
  size: number;
  /** The browser's own type string, for telling a picture from a document. */
  type: string;
  /**
   * Where it can be seen.
   *
   * A `blob:` URL while it is only in this tab, and the delivery URL once there
   * is somewhere to send it to. Anything reading this should not care which.
   */
  url: string;
  /** False while it is only in the tab, so nothing claims it has been sent. */
  stored: boolean;
}

/** What we will take, and the ceiling on it. */
export const ACCEPTS =
  "image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.pages,.numbers,.key,.zip";

/** Ten megabytes. Large enough for a brochure, small enough to fail fast. */
export const MAX_BYTES = 10 * 1024 * 1024;

/** A size somebody can read, rather than a number of bytes. */
export function readableSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Whether this is something we can draw a thumbnail of. */
export const isPicture = (type: string) => type.startsWith("image/");

/**
 * Take a file in.
 *
 * The seam. Replace the body with the Cloudinary call and return the delivery
 * URL with `stored: true`; nothing that calls this needs to change, because
 * nothing that calls this knows where the file went.
 *
 * Signed rather than unsigned when that day comes: an unsigned preset is a
 * public write endpoint with your cloud name on it, and the signature belongs
 * on a route handler where the secret can live server side.
 */
export async function sendFile(file: File): Promise<Attached> {
  if (file.size > MAX_BYTES) {
    throw new Error(
      `${file.name} is ${readableSize(file.size)}. The limit is ${readableSize(MAX_BYTES)}.`,
    );
  }

  return {
    name: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(file),
    stored: false,
  };
}

/**
 * Hand back an object URL.
 *
 * Only for the ones made here. A `blob:` URL holds its file in memory until it
 * is revoked or the tab closes, so removing an attachment has to say so or a
 * long session quietly keeps every file anybody ever changed their mind about.
 */
export function releaseFile(attached: Attached) {
  if (!attached.stored && attached.url.startsWith("blob:")) {
    URL.revokeObjectURL(attached.url);
  }
}
