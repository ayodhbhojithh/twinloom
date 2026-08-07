/* ---------------------------------------------------------------------------
   Reading an address out of what somebody typed.

   The desk keeps a website the same way it keeps a note: as a line of text. It
   has to - the two are stored in one list and come back in one order - but a
   website that is only text is a website nobody can open, and that is what the
   "Website" chip was producing. Everything it took was filed under a label
   saying Website and then treated exactly like a sentence.

   So the address is read here, once, at the moment it is added. What is stored
   is a real absolute URL; what is shown is the readable part of it.

   Nobody types a scheme. `twinloom.com` is what people write and it is what
   they mean, so a missing scheme is filled in rather than refused - `https`,
   because a site that only answers on `http` will redirect and a site that
   does not exist was never going to work either way.
--------------------------------------------------------------------------- */

/** A scheme, at the front: `https://`, `mailto:`, anything of that shape. */
const SCHEMED = /^[a-z][a-z0-9+.-]*:/i;

/**
 * A host worth believing.
 *
 * At least one dot and a letters-only ending, so `hello world` and `notes` are
 * not quietly turned into websites. `.co.uk` and punycode both satisfy it,
 * since `URL` has already normalised the host by the time it is tested.
 */
const HOST = /^[^\s.]+(\.[^\s.]+)*\.[a-z]{2,}$/i;

export interface Link {
  /** Absolute, with a scheme. What gets stored and what `href` gets. */
  href: string;
  /** Without the scheme or a leading `www.`. What a reader is shown. */
  label: string;
}

/**
 * What was typed, as an address - or `null` where it is not one.
 *
 * Returning `null` rather than guessing is the point: the caller can then say
 * so, instead of filing a sentence under Website and letting somebody find out
 * on the call.
 */
export function asLink(raw: string): Link | null {
  /* Trailing punctuation comes from pasting out of a sentence, and a trailing
     full stop is part of no address. */
  const said = raw.trim().replace(/[),.;:!?]+$/, "");
  if (!said) return null;

  let url: URL;
  try {
    url = new URL(SCHEMED.test(said) ? said : `https://${said}`);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (!HOST.test(url.hostname)) return null;

  const host = url.hostname.replace(/^www\./i, "");
  const rest = (url.pathname === "/" ? "" : url.pathname) + url.search;

  return { href: url.href, label: host + rest };
}

/**
 * Whether a stored line is one of the addresses this file made.
 *
 * Tested on the scheme rather than by re-reading it, so a note that happens to
 * mention `example.com` stays a note. Only what went in through the website
 * chip carries a scheme, because that is the only path that writes one.
 */
export function isLink(text: string): boolean {
  return /^https?:\/\//i.test(text.trim()) && asLink(text) !== null;
}
