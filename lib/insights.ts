import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/* ---------------------------------------------------------------------------
   The insight pieces, read from the files they are written in.

   Four of these used to be JSX. Each one was arranged by hand - a comparison as
   cards, a run of platforms as named rows - and the argument for that was a good
   one: a renderer can only do to every paragraph what it does to all of them,
   which is how considered writing turns into a grey column.

   What changed is who writes them. They arrive as markdown now, they are edited
   as markdown, and a piece whose source is a file and whose published form is a
   thousand lines of hand-set JSX is a piece that will be edited in one place and
   published from the other. The answer is not to give up on the arranging - it
   is to build a renderer with the shapes the writing actually takes, so a table
   comes out as a table and a run of bolded terms comes out as named rows, and
   the markdown stays the only copy.

   `node:fs` is server-only, which is what the Next docs point at for exactly
   this - reading a directory of pieces and pulling their metadata out. Every
   page that reads this is prerendered, so the files are only ever touched at
   build time.
--------------------------------------------------------------------------- */

/** Where the writing lives. The same folder the pieces are drafted in. */
const FOLDER = join(process.cwd(), "Docs", "insights");

/**
 * Everything from this heading down is ours, not the reader's.
 *
 * Each draft ends with a section of notes to ourselves - what is missing, what
 * was assumed, what to check before publishing. It is the most useful part of
 * the file and the one part that must never be served.
 */
const PRIVATE = "## Not for publication";

/** A question left open in the draft, and never shown to anybody. */
const NEEDS = /\[\[NEEDS:[^\]]*\]\]/gi;

/** What the writing is made of, once it has been read. */
export type Block =
  | { kind: "p"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "ul" | "ol"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "table"; head: string[]; rows: string[][] };

export interface Section {
  title: string;
  blocks: Block[];
}

export interface Insight {
  slug: string;
  topic: string;
  title: string;
  /** The opening paragraph, set larger than the rest. */
  lead: string;
  /** The piece in one line, for the index. */
  note: string;
  minutes: number;
  sections: Section[];
}

/**
 * What each piece is about.
 *
 * Written here rather than taken from the file, because a subject is a decision
 * about how the index reads rather than a property of the writing - two pieces
 * belong together when we say they do. Anything unlisted falls back to its own
 * title, which is honest: an ungrouped piece should look ungrouped rather than
 * be filed under something it is not.
 */
const TOPIC: Record<string, string> = {
  "selling-online": "Selling online",
  "picking-the-back-end-for-your-shop": "Selling online",
  "the-technology-we-use": "How websites are built",
  "seo-and-search": "Being found",
  "what-twincoretech-can-build": "Custom software",
};

/** A markdown table row, split on the pipes and trimmed. */
const cells = (line: string) =>
  line
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());

/** The rule under a table's head, which is the only thing that identifies it. */
const isDivider = (line: string) => /^\|?[\s:|-]+\|[\s:|-]*$/.test(line);

/** What a heading may carry after its name: "(4 pages)". */
const COUNT = /\s*\((.*)\)$/;

/**
 * One file, read into sections.
 *
 * A small parser rather than a markdown library, and the reason is the size of
 * the grammar rather than a dislike of dependencies: five files use headings,
 * paragraphs, two kinds of list, tables, one block quote, and bold, links and
 * code inline. A general parser brings a general renderer, and a general
 * renderer is the grey column this is meant to avoid.
 *
 * Inline marks are left as they were written and dealt with where the text is
 * set. Turning `**` into an element here would mean this function returning
 * markup, which is the point at which a data module becomes a view.
 */
function parse(slug: string, source: string): Insight {
  /* Everything below the private heading goes first, before anything else can
     accidentally read it. */
  const cut = source.indexOf(PRIVATE);
  const text = (cut === -1 ? source : source.slice(0, cut)).replace(NEEDS, "");

  const lines = text.split("\n");
  let title = slug;
  const sections: Section[] = [];

  type Run = { kind: "ul" | "ol"; items: string[] };
  type Grid = { head: string[]; rows: string[][] };

  /* The opening, which belongs to no section. Some pieces put it under the
     title and some under their first heading, so it is simply the first
     paragraph found either way. */
  let lead = "";
  let here: Section | null = null;
  let list: Run | null = null;
  let table: Grid | null = null;

  const shut = () => {
    if (list) {
      here?.blocks.push(list);
      list = null;
    }
    if (table) {
      here?.blocks.push({ kind: "table", ...table });
      table = null;
    }
  };

  const put = (block: Block) => {
    shut();
    if (here) here.blocks.push(block);
  };

  for (let n = 0; n < lines.length; n += 1) {
    const line = lines[n].trim();

    if (!line) {
      shut();
      continue;
    }

    if (line.startsWith("# ")) {
      title = line.slice(2).trim();
      continue;
    }

    /* The draft's own front matter: the address it will live at, and the date.
       Both are decided by the route and by git, not by a line in a file. */
    if (/^\*\*(URL|Last updated):\*\*/i.test(line)) continue;

    /* A section, with any count in its heading taken off the name - "(4 pages)"
       is a fact about the section rather than part of what it is called. */
    if (line.startsWith("## ")) {
      shut();
      here = { title: line.slice(3).replace(COUNT, "").trim(), blocks: [] };
      sections.push(here);
      continue;
    }

    if (line.startsWith("### ")) {
      put({ kind: "h3", text: line.slice(4).trim() });
      continue;
    }

    /* A rule between sections, which the headings already draw. */
    if (/^-{3,}$/.test(line)) {
      shut();
      continue;
    }

    if (line.startsWith("|")) {
      if (isDivider(line)) continue;

      if (!table) table = { head: cells(line), rows: [] };
      else table.rows.push(cells(line));
      continue;
    }

    if (line.startsWith("> ")) {
      put({ kind: "quote", text: line.slice(2).trim() });
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    const number = /^\d+\.\s+(.*)$/.exec(line);

    if (bullet || number) {
      const kind: "ul" | "ol" = bullet ? "ul" : "ol";
      const item = (bullet ?? number)![1].trim();
      /* Read out before `shut` can be called, and widened back to what it was
         declared as: `shut` is a closure that sets `list` to null, and the
         checker's control-flow analysis does not follow a call into one. */
      const open = list as Run | null;

      if (open && open.kind === kind) open.items.push(item);
      else {
        shut();
        list = { kind, items: [item] };
      }
      continue;
    }

    if (!lead) {
      lead = line;
      /* The lead is the piece's own opening and is set apart from the section
         it happens to sit in, so it is not pushed as a block. */
      continue;
    }

    put({ kind: "p", text: line });
  }

  shut();

  /* A section that turns out to hold nothing - the private heading cut its
     contents away, or it only ever held a rule - is not a section. */
  const kept = sections.filter((section) => section.blocks.length);

  const words = text.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    topic: TOPIC[slug] ?? "Insight",
    title,
    lead,
    /* One sentence for the index. A lead is written to open a piece and runs
       three or four clauses; a card under a headline has room for one. */
    note: (lead.split(/(?<=\.)\s/)[0] ?? lead).replace(/\*\*/g, ""),
    minutes: Math.max(1, Math.round(words / 210)),
    sections: kept,
  };
}

/**
 * A picture each, named after the piece it belongs to.
 *
 * The file is the slug, so there is no map to keep - a new piece is a markdown
 * file and a PNG of the same name, and nothing has to be wired.
 *
 * No cache-busting stamp on the address, and it is worth saying why, because it
 * was tried. Replacing a drawing under a name that has not changed leaves every
 * cache between the disk and the screen serving what it already has, and the
 * obvious fix is to put the file's modified time in the query. Next 16 will not
 * have it: a local image with a search string has to be declared in
 * `images.localPatterns`, and `search` there is an exact string rather than a
 * pattern - so a query that changes with the file is a query that can never be
 * allowed. A stamp that never changes is not a stamp.
 *
 * Which leaves it where it belongs. In production a deploy is a new build and
 * the pictures arrive with it; in development, a replaced file wants the dev
 * server restarted and the page hard-reloaded, and that is the whole of it.
 */
/* JPEG rather than PNG, and the difference is not subtle.

   These are photographic - a room, a screen, a surface with light falling across
   it - and PNG stores a photograph losslessly, pixel by pixel. Each of the five
   was around two and a quarter megabytes; the same picture at JPEG 88 is around
   three hundred kilobytes, and at the size any of them is ever shown the two are
   indistinguishable.

   What a reader downloads was never the two megabytes: `next/image` re-encodes
   these and serves a webp or avif cut to the width asked for. What the two
   megabytes cost is everything around that - eleven megabytes in the repository
   and in every deploy, and an optimiser reading and decoding a two megabyte PNG
   the first time each size of each picture is asked for.

   JPEG rather than webp for the source, because this address is also the picture
   named in the page's own metadata: it is what a link to an insight unfurls as
   in a message or a post, and the things doing that unfurling are not browsers
   and do not all read webp. */
export const plateFor = (slug: string) => `/assets/insights/${slug}.jpg`;

/**
 * Every piece, in the order the folder gives them.
 *
 * Read once, at module scope, because this runs at build time and the files do
 * not change between two pages of one build.
 */
export const INSIGHTS: readonly Insight[] = readdirSync(FOLDER)
  .filter((name) => name.endsWith(".md"))
  .map((name) =>
    parse(name.replace(/\.md$/, ""), readFileSync(join(FOLDER, name), "utf8")),
  )
  /* Longest first, which is the nearest thing to an order the folder gives.
     The index leads on one piece and lists the rest, and the piece that says
     the most is the better one to lead with. */
  .sort((a, b) => b.minutes - a.minutes);

export const insightBy = (slug: string) =>
  INSIGHTS.find((piece) => piece.slug === slug) ?? null;

/** The subjects, in the order they first appear. */
export const TOPICS: readonly string[] = [
  ...new Set(INSIGHTS.map((piece) => piece.topic)),
];
