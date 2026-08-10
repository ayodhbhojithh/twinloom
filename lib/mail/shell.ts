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

   And no `clip-path`. The site's cut corners are drawn with an SVG path and no
   mail client supports one, so they are not faked with images either.

   What is left is a centred column on white with nothing drawn round it. No
   card outline, no tinted ground, no rules between the parts - the only thing
   separating one thing from the next is space, which every client on earth
   renders identically. A border round a message is an edge that has to survive
   Outlook, Gmail, Apple Mail and six webmail clients, and it buys nothing a
   margin does not.

   Centred throughout, because a column with no edge drawn round it has no left
   edge for type to sit against either.
--------------------------------------------------------------------------- */

const INK = "#111827";
const BODY = "#4b5563";
const QUIET = "#6b7280";
const LABEL = "#8a93a3";
const MARK = "#2563eb";
const CANVAS = "#f6f7f9";
const FIELD = "#ffffff";

/** What a mail client will actually have. No web fonts load here. */
const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO =
  "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

export const palette = { INK, BODY, QUIET, LABEL, MARK, CANVAS, FIELD };
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
 * The one mono label at the top.
 *
 * No pill round it. A tinted capsule is another shape to draw on a message
 * whose whole idea is that nothing is drawn: letter-spacing and the accent are
 * enough to say this is a label rather than a sentence.
 */
export function kicker(text: string, tint = MARK) {
  return `<div style="font-family:${MONO};font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${tint};line-height:1">${esc(
    text,
  )}</div>`;
}

/**
 * The one fact worth setting apart: a reference, a time.
 *
 * A very light fill rather than a border, because a fill has no edge to render
 * wrongly. It is the only tinted thing in the message, which is what makes it
 * the thing the eye lands on.
 */
export function plate(label: string, value: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0">
      <tr>
        <td align="center" style="padding:16px 18px;background:${CANVAS};border-radius:14px">
          <div style="font-family:${MONO};font-size:8.5px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${LABEL};line-height:1">${esc(
            label,
          )}</div>
          <div style="margin-top:8px;font-family:${MONO};font-size:15px;font-weight:700;letter-spacing:0.01em;color:${INK};line-height:1.35;word-break:break-word">${esc(
            value,
          )}</div>
        </td>
      </tr>
    </table>`;
}

/**
 * One of a short run of steps.
 *
 * Centred and stacked rather than a number in a left column with words beside
 * it. Two columns need a left edge to hang from and there is not one here -
 * and in a reading pane the words column ends up narrow enough to break every
 * line it holds.
 */
export function step(n: number, title: string, sub: string) {
  return `
    <tr>
      <td align="center" style="padding:18px 0 0">
        <div style="font-family:${MONO};font-size:8.5px;font-weight:700;letter-spacing:0.16em;color:${LABEL};line-height:1">${String(
          n,
        ).padStart(2, "0")}</div>
        <div style="margin-top:7px;font-family:${SANS};font-size:13px;font-weight:700;color:${INK};line-height:1.35">${esc(
          title,
        )}</div>
        <div style="margin:4px auto 0;max-width:340px;font-family:${SANS};font-size:12px;color:${QUIET};line-height:1.6">${esc(
          sub,
        )}</div>
      </td>
    </tr>`;
}

/** The one thing we would like them to do. */
export function button(href: string, text: string) {
  return `
    <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:30px auto 0">
      <tr>
        <td align="center" style="background:${MARK};border-radius:999px">
          <a href="${esc(href)}" style="display:inline-block;padding:11px 22px;font-family:${SANS};font-size:12.5px;font-weight:600;color:#ffffff;text-decoration:none;line-height:1">${esc(
            text,
          )}</a>
        </td>
      </tr>
    </table>`;
}

/** A break, made of space rather than of a line. */
export const rule = `<div style="height:26px;line-height:26px;font-size:0">&nbsp;</div>`;

/**
 * The whole message.
 *
 * One centred column at 460 - narrower than a web measure on purpose, because
 * a reading pane is a third of a screen, and a message that needs the full
 * width of a laptop is a message read in a scrollbar.
 *
 * Both of those are defaults rather than rules, because the two kinds of
 * message this site sends are not the same shape. What goes to somebody outside
 * the company is four sentences and a reference, and it is centred because a
 * short centred message reads as a note. What comes to us is a filled-in
 * document - eight sections of labels and values - and a document is read down
 * a left edge at whatever width it needs. Centring that would rag both sides of
 * every list in it.
 */
export function shell({
  title,
  preview,
  body,
  width = 460,
  align = "center",
}: {
  /** The `<title>`, and what a reading pane may show as the subject line. */
  title: string;
  /** The first line a client previews. Written, not left to chance. */
  preview: string;
  body: string;
  /** How wide the column may get before it stops growing. */
  width?: number;
  /** Which edge the message is read from. */
  align?: "center" | "left";
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
<body style="margin:0;padding:0;background:${FIELD};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">

<!-- The preview line, and enough blank after it that the client does not
     borrow the first sentence of the message to finish the snippet. -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(
    preview,
  )}${"&#847;&zwnj;&nbsp;".repeat(60)}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${FIELD}">
  <tr>
    <!-- Twenty pixels of gutter on a phone, which is the difference between a
         centred column and type jammed against two edges. -->
    <td align="center" style="padding:36px 20px 40px">

      <table role="presentation" width="${width}" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:${width}px">

        <tr>
          <td align="${align}" style="padding:0 0 26px">
            <span style="font-family:${SANS};font-size:14px;font-weight:700;letter-spacing:-0.02em;color:${INK}">TwinLoom</span>
          </td>
        </tr>

        <tr>
          <td align="${align}">${body}</td>
        </tr>

        <!-- Who sent it. Company law wants it findable, and a message with no
             entity on it is a message that reads as a mailshot. -->
        <tr>
          <td align="center" style="padding:36px 0 0">
            <div style="margin:0 auto;max-width:380px;font-family:${SANS};font-size:10.5px;line-height:1.7;color:${LABEL}">
              TwinLoom is a trading name of TwinCoreTech Ltd, registered in
              England and Wales, company number 15997244.
            </div>
            <div style="margin-top:10px;font-family:${SANS};font-size:10.5px;line-height:1.7;color:${LABEL}">
              <a href="https://twinloom.com/privacy" style="color:${QUIET};text-decoration:none">Privacy notice</a>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              <a href="https://twinloom.com/contact" style="color:${QUIET};text-decoration:none">Contact us</a>
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
