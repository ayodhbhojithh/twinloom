import type { Ref, Where } from "./v5-store";

/* ---------------------------------------------------------------------------
   The files, numbered once.

   Two things have to agree about attachments and they run on different
   machines: the browser writes the list into the document, and the route
   handler fetches the files and hangs them off the message. If either numbered
   them its own way, the paperclip called `02` would be the third thing in the
   list and there would be no way to tell which note a file belonged to - which
   is the whole reason for numbering them.

   So neither of them decides. Both call this, both pass the refs in the order
   the desk holds them, and both get the same numbers and the same filenames.
--------------------------------------------------------------------------- */

export interface Attached {
  /** 1-based, and the number the message's own filename carries. */
  index: number;
  /** What the file was called when it was picked. */
  name: string;
  url: string;
  /**
   * Where on the run-through it was attached, said as a person would.
   *
   * The question if it was attached to one, the card if not, the step if not
   * that, and General for anything put on the desk with no step behind it. A
   * file with no context is a file whoever opens the inbox has to guess about.
   */
  where: string;
  /** What they said about it, where they said anything. */
  note: string;
  /**
   * The name it arrives under.
   *
   * Numbered, because a mail client sorts paperclips however it likes and two
   * people both attaching `logo.png` is not unusual. The number is the only
   * thing tying a row in the list to a file on the message.
   */
  filename: string;
}

/** The one place that decides how a file's origin is said. */
export function whereOf(at: Where | null | undefined): string {
  if (!at) return "General";
  return at.q || at.card || at.step || "General";
}

/**
 * Strip a name down to something every mail client and filesystem will take.
 *
 * Quotes and semicolons end a MIME header parameter early, so a file called
 * `our "old" logo.png` truncates the header and the attachment arrives
 * unnamed. The rest is the usual set that Windows refuses outright.
 */
const safe = (name: string) =>
  name
    .replace(/[\\/:*?"<>|;\r\n]+/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80) || "file";

export function attachedFrom(
  refs: readonly Pick<Ref, "text" | "url" | "where" | "n">[],
  like: Record<number, string> = {},
): Attached[] {
  return refs
    .filter((ref): ref is typeof ref & { url: string } => Boolean(ref.url))
    .map((ref, at) => {
      const index = at + 1;
      const name = safe(ref.text || `file-${index}`);

      return {
        index,
        name,
        url: ref.url,
        where: whereOf(ref.where),
        note: (like[ref.n] ?? "").trim(),
        filename: `${String(index).padStart(2, "0")}-${name}`,
      };
    });
}
