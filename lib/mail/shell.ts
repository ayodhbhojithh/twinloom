/* ---------------------------------------------------------------------------
   The shell every message we send is set in.

   An email is not a web page and pretending otherwise is how mail arrives
   broken. Three constraints decide everything below.

   Tables, not flex or grid. Outlook on Windows renders with Word, which knows
   neither - a `div` layout collapses to a single column of full-width blocks
   the moment it reaches a large part of the business world.

   Inline styles, not a stylesheet. Gmail strips `<style>` in some contexts and
   rewrites class names in others, so anything that has to hold is written on
   the element.

   And no `clip-path`. The site's cut corners - the flared notch, the bite, the
   corner taken out for a control - are drawn with an SVG path, and no mail
   client supports one. So the shapes are not faked with images: what carries
   the house style here is what actually survives, which is the tinted ground
   with white surfaces on it, the pill, the mono kicker, and one asymmetric
   corner. Outlook squares the corners off and the message still reads.

   The palette is the site's own tokens, written out, because `var()` does not
   resolve in mail either.
--------------------------------------------------------------------------- */

const INK = "#111827";
const BODY = "#374151";
const QUIET = "#5b6474";
const LABEL = "#626b7c";
const MARK = "#2563eb";
const CANVAS = "#f2f3f5";
const FIELD = "#ffffff";
const HAIR = "#d1d6df";

/** What a mail client will actually have. No web fonts load here. */
const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO =
  "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

export const palette = { INK, BODY, QUIET, LABEL, MARK, CANVAS, FIELD, HAIR };
export const fonts = { SANS, MONO };

/** Text a mail client is about to render, with the four that break it out. */
export function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * A mono label, in a tinted pill.
 *
 * The site's kicker, and the one piece of its vocabulary that survives every
 * client: a background colour, a radius and letter-spacing are all any of them
 * need to understand.
 */
export function kicker(text: string, tint = MARK) {
  return `<span style="display:inline-block;padding:6px 12px;border-radius:999px;background:${tint}14;color:${tint};font-family:${MONO};font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;line-height:1">${esc(
    text,
  )}</span>`;
}

/** A fact set apart to be copied: a reference, an address, a time. */
export function plate(label: string, value: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 0">
      <tr>
        <td style="padding:16px 20px;background:${CANVAS};border-radius:16px 16px 16px 4px">
          <div style="font-family:${MONO};font-size:9.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${LABEL};line-height:1">${esc(
            label,
          )}</div>
          <div style="margin-top:8px;font-family:${MONO};font-size:17px;font-weight:700;color:${INK};line-height:1.3;word-break:break-all">${esc(
            value,
          )}</div>
        </td>
      </tr>
    </table>`;
}

/** One row of a short list, numbered, the way the site numbers its steps. */
export function step(n: number, title: string, sub: string) {
  return `
    <tr>
      <td width="34" valign="top" style="padding:10px 14px 10px 0">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="26" height="26" align="center" valign="middle" style="width:26px;height:26px;background:${INK};border-radius:999px;font-family:${MONO};font-size:10px;font-weight:700;color:#ffffff;line-height:26px">${n}</td>
          </tr>
        </table>
      </td>
      <td valign="top" style="padding:10px 0">
        <div style="font-family:${SANS};font-size:15px;font-weight:700;color:${INK};line-height:1.35">${esc(
          title,
        )}</div>
        <div style="margin-top:3px;font-family:${SANS};font-size:13.5px;color:${QUIET};line-height:1.55">${esc(
          sub,
        )}</div>
      </td>
    </tr>`;
}

/** The one thing we would like them to do, as a pill. */
export function button(href: string, text: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0">
      <tr>
        <td align="center" style="background:${INK};border-radius:999px">
          <a href="${esc(href)}" style="display:inline-block;padding:13px 26px;font-family:${SANS};font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;line-height:1">${esc(
            text,
          )}</a>
        </td>
      </tr>
    </table>`;
}

/** A hairline, where a break needs to be seen rather than felt. */
export const rule = `<div style="height:1px;background:${HAIR};margin:28px 0"></div>`;

/**
 * The whole message.
 *
 * One column at 560, centred on the tinted ground, with the name above the
 * surface and the legal line below it - the same arrangement as a page of the
 * site, which is the point: a message that looks like the website it came from
 * is a message somebody can place in a second.
 */
export function shell({
  title,
  preview,
  body,
}: {
  /** The `<title>`, and what a reading pane may show as the subject line. */
  title: string;
  /** The first line a client previews. Written, not left to chance. */
  preview: string;
  body: string;
}) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:${CANVAS};-webkit-text-size-adjust:100%">

<!-- The preview line, and enough blank after it that the client does not
     borrow the first sentence of the message to finish the snippet. -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(
    preview,
  )}${"&#847;&zwnj;&nbsp;".repeat(60)}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CANVAS}">
  <tr>
    <td align="center" style="padding:32px 16px 40px">

      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px">

        <!-- The name, on the ground rather than on the surface, exactly as the
             site sets it above a card. -->
        <tr>
          <td style="padding:0 4px 14px">
            <span style="font-family:${SANS};font-size:17px;font-weight:700;letter-spacing:-0.03em;color:${INK}">TwinLoom</span>
          </td>
        </tr>

        <!-- The surface. One corner is drawn tighter than the other three: the
             site cuts a corner out of every working surface, and this is the
             part of that idea a mail client can actually render. -->
        <tr>
          <td style="padding:30px 28px 32px;background:${FIELD};border-radius:26px 26px 6px 26px">
            ${body}
          </td>
        </tr>

        <!-- Who sent it. Company law wants it findable, and a message with no
             entity on it is a message that reads as a mailshot. -->
        <tr>
          <td style="padding:22px 6px 0">
            <div style="font-family:${SANS};font-size:11.5px;line-height:1.7;color:${LABEL}">
              TwinLoom is a trading name of TwinCoreTech Ltd, registered in
              England and Wales, company number 15997244. Registered office:
              Bromley Old Town Hall, 30 Tweedy Road, Bromley BR1 3FE.
            </div>
            <div style="margin-top:10px;font-family:${SANS};font-size:11.5px;line-height:1.7;color:${LABEL}">
              <a href="https://twinloom.com/privacy" style="color:${QUIET};text-decoration:underline">Privacy notice</a>
              &nbsp;·&nbsp;
              <a href="https://twinloom.com/contact" style="color:${QUIET};text-decoration:underline">Contact us</a>
            </div>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>`;
}
