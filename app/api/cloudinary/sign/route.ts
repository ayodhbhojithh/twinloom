import { NextResponse } from "next/server";

import { within } from "@/lib/api/guard";
import { v2 as cloudinary } from "cloudinary";

import { isReference } from "@/lib/build/reference";

/* ---------------------------------------------------------------------------
   Signing an upload.

   The browser does not get to upload on its own account. It asks here, this
   signs a fixed set of parameters with the API secret, and the browser then
   posts the file straight to Cloudinary carrying the signature.

   Two reasons it is done this way rather than with an unsigned preset.

   An unsigned preset is a public write endpoint with your cloud name on it:
   anybody who reads the page source can fill the account with whatever they
   like. A signature means only a request this route agreed to will be taken.

   And the file never passes through our own server, so a 10MB brochure is not
   bounded by whatever body limit the host puts on a route handler, and the
   upload does not occupy a serverless invocation for its whole duration.

   The folder is decided here, not sent from the browser. A client that can
   choose its own folder can write anywhere in the account, including over
   somebody else's submission - so all it may send is a reference, and only one
   of the right shape.
--------------------------------------------------------------------------- */

/** What the browser may ask to upload as. Anything else is refused. */
const RESOURCE = new Set(["auto", "image", "raw", "video"]);

export async function POST(request: Request) {
  /* One signature per file, so this is the loosest of the three - forty in an
     hour is a heavy but real submission. What it stops is somebody minting
     signatures in a loop to fill the account, which is the only thing a
     signing endpoint can be used for that its owner did not intend. */
  const allowed = within(request, "sign", {
    every: 40,
    window: 60 * 60 * 1000,
  });

  if (!allowed.ok) {
    return NextResponse.json(
      {
        ok: false,
        problem: `That has been sent a few times already. Try again in ${allowed.after > 60 ? `${Math.ceil(allowed.after / 60)} minutes` : `${allowed.after} seconds`}, or email us.`,
      },
      { status: 429, headers: { "retry-after": String(allowed.after) } },
    );
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const root = process.env.CLOUDINARY_FOLDER ?? "twinloom/scoping";

  /* Said plainly rather than as a 500. Without the four variables this is not
     broken, it is not configured, and the two want different answers from
     whoever is reading the logs. */
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        ok: false,
        problem: "Attachments are not switched on for this environment yet.",
      },
      { status: 503 },
    );
  }

  let body: { desk?: unknown; resourceType?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, problem: "That did not arrive as we expected it to." },
      { status: 400 },
    );
  }

  if (!isReference(body.desk)) {
    return NextResponse.json(
      { ok: false, problem: "That is not a reference we issued." },
      { status: 400 },
    );
  }

  const resourceType =
    typeof body.resourceType === "string" && RESOURCE.has(body.resourceType)
      ? body.resourceType
      : "auto";

  /* One folder per desk. Everything one person attached in one sitting is in
     one place, named by the reference they were given, so the folder and the
     email that arrives are about the same submission. */
  const folder = `${root}/${body.desk}`;
  const timestamp = Math.round(Date.now() / 1000);

  /* Exactly the parameters the browser will send, and no others. A signature
     covering less than what is sent is a signature that can be reused with
     different values. `resource_type` is in the URL rather than the body, and
     Cloudinary excludes it from the signature by design. */
  const signed: Record<string, string | number> = {
    folder,
    tags: body.desk,
    timestamp,
    ...(preset ? { upload_preset: preset } : {}),
  };

  const signature = cloudinary.utils.api_sign_request(signed, apiSecret);

  return NextResponse.json({
    ok: true,
    cloudName,
    apiKey,
    resourceType,
    signature,
    ...signed,
  });
}
