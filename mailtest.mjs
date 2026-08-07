import fs from "node:fs";
import { JWT } from "google-auth-library";
import { scopeReceipt } from "./.mailtest/templates.js";

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const k = l.slice(0, l.indexOf("=")).trim();
      let v = l.slice(l.indexOf("=") + 1).trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      return [k, v];
    }),
);

const subject = env.GOOGLE_CALENDAR_ID;
const to = env.BOOKING_NOTIFY_EMAIL || subject;

const auth = new JWT({
  email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/gmail.send"],
  subject,
});

const msg = scopeReceipt({
  name: "Ayodh",
  ref: "TL-20260807-QUGGU",
  attachments: 3,
});

fs.writeFileSync(".mailtest/preview.html", msg.html);
console.log("html written to .mailtest/preview.html");

const CRLF = String.fromCharCode(13, 10);
const edge = "twinloom-preview";

const raw = Buffer.from(
  [
    `To: ${to}`,
    `From: TwinLoom <${subject}>`,
    `Subject: [preview] ${msg.subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${edge}"`,
    "",
    `--${edge}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    msg.text,
    "",
    `--${edge}`,
    'Content-Type: text/html; charset="UTF-8"',
    "",
    msg.html,
    "",
    `--${edge}--`,
  ].join(CRLF),
)
  .toString("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/, "");

const { token } = await auth.getAccessToken();

const res = await fetch(
  "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  },
);

const out = await res.json();
console.log(
  res.ok ? "SENT   to " + to + "  id " + out.id : "FAILED " + JSON.stringify(out.error),
);
