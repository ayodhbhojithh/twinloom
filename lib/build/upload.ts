import { deskRef } from "./desk";

/* ---------------------------------------------------------------------------
   Attachments, and the one place the uploader lives.

   Everything that takes a file on this site goes through `sendFile` below.
   That is the whole point of this file: the drop zones, the steps and the
   notes desk all upload the same way, with one set of limits and one set of
   failures. Written into each control instead, an upload becomes four
   implementations that disagree about size limits by the second one.

   Cloudinary, signed. The browser asks `/api/cloudinary/sign` for a signature,
   then posts the file straight to Cloudinary - so the file never passes
   through our own server, and nothing but a request this site agreed to can
   write into the account. The folder is decided by that route, one per desk.

   What comes back is a delivery URL and `stored: true`. Nothing here pretends
   a file has been sent when it has not: a failure throws, with the reason in
   words, and the drop zone names the file that did not make it.
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
  /**
   * What Cloudinary calls it.
   *
   * Kept so the submission can name the assets rather than only link to them -
   * a public id is what the media library is searched by, and a URL is not.
   */
  publicId?: string;
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

/** What Cloudinary should file this as, from what the browser says it is. */
function resourceFor(type: string) {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  /* Everything else - a PDF, a spreadsheet, a zip - is `raw`. `auto` would
     also work, but naming it means a mislabelled file is stored rather than
     rejected by a format check meant for pictures. */
  return "raw";
}

interface Signed {
  cloudName: string;
  apiKey: string;
  resourceType: string;
  signature: string;
  timestamp: number;
  folder: string;
  tags: string;
  upload_preset?: string;
}

/**
 * Take a file in.
 *
 * Two requests: one to this site for a signature, one to Cloudinary carrying
 * the file. The second is the slow one and it goes nowhere near our server.
 *
 * Everything that can go wrong throws with a sentence rather than a status
 * code, because the only place any of this is read is a line under a drop zone
 * that somebody has to act on.
 */
export async function sendFile(file: File): Promise<Attached> {
  if (file.size > MAX_BYTES) {
    throw new Error(
      `${file.name} is ${readableSize(file.size)}. The limit is ${readableSize(MAX_BYTES)}.`,
    );
  }

  const resourceType = resourceFor(file.type);

  let signed: Signed;
  try {
    const asked = await fetch("/api/cloudinary/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ desk: deskRef(), resourceType }),
    });

    const body = await asked.json();
    if (!asked.ok || !body?.ok) {
      throw new Error(
        typeof body?.problem === "string"
          ? body.problem
          : "We could not start the upload.",
      );
    }
    signed = body as Signed;
  } catch (wrong) {
    throw new Error(
      wrong instanceof Error && wrong.message
        ? wrong.message
        : "We could not start the upload.",
    );
  }

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signed.apiKey);
  form.append("timestamp", String(signed.timestamp));
  form.append("signature", signed.signature);
  form.append("folder", signed.folder);
  form.append("tags", signed.tags);
  if (signed.upload_preset) form.append("upload_preset", signed.upload_preset);

  let sent: Response;
  try {
    sent = await fetch(
      `https://api.cloudinary.com/v1_1/${signed.cloudName}/${signed.resourceType}/upload`,
      { method: "POST", body: form },
    );
  } catch {
    throw new Error(
      `${file.name} did not send. Check the connection and try it again.`,
    );
  }

  const result = await sent.json().catch(() => null);

  if (!sent.ok || !result?.secure_url) {
    /* Cloudinary puts the reason in `error.message`, and it is usually the
       useful thing: a format the preset will not take, or a size ceiling on
       the plan. Passed straight through rather than replaced with ours. */
    const said = result?.error?.message;
    throw new Error(
      typeof said === "string" && said
        ? `${file.name}: ${said}`
        : `${file.name} did not upload.`,
    );
  }

  return {
    name: file.name,
    size: typeof result.bytes === "number" ? result.bytes : file.size,
    type: file.type,
    url: result.secure_url as string,
    stored: true,
    publicId: result.public_id as string,
  };
}

/**
 * Hand back an object URL.
 *
 * Nothing here makes one any more, but a file taken in before the account was
 * configured still can be, and revoking one that was never made is free. A
 * `blob:` URL holds its file in memory until it is revoked or the tab closes.
 */
export function releaseFile(attached: Attached) {
  if (!attached.stored && attached.url.startsWith("blob:")) {
    URL.revokeObjectURL(attached.url);
  }
}
