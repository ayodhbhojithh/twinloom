import Link from "next/link";
import { Fragment } from "react";

import type { Block, Section } from "@/lib/insights";

import { Lede, P, Sect } from "./kit";

/* ---------------------------------------------------------------------------
   Setting what was written.

   The shapes here are the ones the writing actually takes: prose, a run of
   named things, a comparison of two or three columns, a list, and an aside. Not
   a general markdown renderer - a general renderer has to treat every paragraph
   the way it treats all of them, and a comparison set as prose is the reason
   anybody reaches for a table in the first place.

   What earns each shape:

   - A table is set as a table on a screen wide enough to read one across, and
     as a stack of named blocks below that. A two-column table on a phone is a
     column of one-word cells with the thing they describe off the edge.
   - A list whose every item starts with a bolded term is not a list, it is a
     set of named rows, and it is set as one. That pattern is most of this
     writing.
   - Everything else is prose, which is most of what good writing is.
--------------------------------------------------------------------------- */

/** `**bold**`, `[text](href)`, `` `code` `` and `*emphasis*`, and nothing else. */
const MARKS = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`|\*[^*]+\*)/g;

/**
 * A run of text, with its marks set.
 *
 * Split rather than replaced into HTML, because building a string of markup and
 * handing it to `dangerouslySetInnerHTML` would mean every piece of writing on
 * this site is trusted to be safe forever - and the whole point of keeping the
 * source in markdown is that somebody who is not a developer edits it.
 *
 * Internal links go through `Link`; anything else is an anchor that leaves.
 */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(MARKS).map((part, n) => {
        if (!part) return null;

        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <b key={n} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </b>
          );
        }

        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={n}
              className="rounded-[5px] bg-canvas px-[0.35em] py-[0.1em] font-mono text-[0.88em] text-ink"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);

        if (link) {
          const [, label, href] = link;
          const inside = href.startsWith("/");
          const className =
            "font-medium text-mark underline decoration-hair underline-offset-2 transition-colors hover:decoration-mark";

          return inside ? (
            <Link key={n} href={href} className={className}>
              {label}
            </Link>
          ) : (
            <a
              key={n}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={className}
            >
              {label}
            </a>
          );
        }

        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={n}>{part.slice(1, -1)}</em>;
        }

        return <Fragment key={n}>{part}</Fragment>;
      })}
    </>
  );
}

/** Where a named row's term ends and what it says begins. */
const NAMED = /^\*\*([^*]+)\*\*[.:,]?\s+(.+)$/;

/**
 * A set of named things.
 *
 * Every item of these lists opens with a bolded term - a platform, an option, a
 * question - and the rest of the item explains it. Set as bullets, the terms are
 * buried mid-line and the list has to be read through; set as rows, the terms
 * are a column you can run an eye down and stop at the one you were sold last
 * week.
 */
function Named({ items }: { items: { term: string; says: string }[] }) {
  return (
    <dl className="mt-[1.1em] border-t border-hair/70">
      {items.map((item) => (
        <div
          key={item.term}
          className="grid gap-1 border-b border-hair/70 py-3.5 sm:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)] sm:gap-6"
        >
          <dt className="text-[0.94em] leading-[1.45] font-semibold text-ink">
            <Rich text={item.term} />
          </dt>
          <dd className="text-[0.94em] leading-[1.6] text-body">
            <Rich text={item.says} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * A comparison, as a table where there is room and as blocks where there is not.
 *
 * Both are rendered and one is hidden, which is the one thing a table can do
 * that no amount of CSS on a single markup can: a `<table>` that reflows into
 * blocks loses its header, and a header repeated into every cell as a
 * pseudo-element cannot be selected or read out.
 */
function Grid({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="mt-[1.2em]">
      <table className="hidden w-full border-collapse text-left sm:table">
        <thead>
          <tr className="border-b border-hair">
            {head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="pb-2.5 pr-6 font-mono text-[10px] font-bold tracking-[0.14em] text-label uppercase last:pr-0"
              >
                <Rich text={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, n) => (
            <tr key={n} className="border-b border-hair/60 align-top">
              {row.map((cell, at) => (
                <td
                  key={at}
                  className="py-3 pr-6 text-[0.94em] leading-[1.55] text-body first:font-semibold first:text-ink last:pr-0"
                >
                  <Rich text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="border-t border-hair/70 sm:hidden">
        {rows.map((row, n) => (
          <div key={n} className="border-b border-hair/70 py-3.5">
            <dt className="text-[0.94em] leading-[1.45] font-semibold text-ink">
              <Rich text={row[0] ?? ""} />
            </dt>
            {row.slice(1).map((cell, at) => (
              <dd key={at} className="mt-1.5 text-[0.94em] leading-[1.6]">
                <span className="font-mono text-[9.5px] font-bold tracking-[0.14em] text-label uppercase">
                  {head[at + 1]}
                </span>
                <span className="mt-0.5 block text-body">
                  <Rich text={cell} />
                </span>
              </dd>
            ))}
          </div>
        ))}
      </dl>
    </div>
  );
}

function Piece({ block }: { block: Block }) {
  if (block.kind === "p") {
    return (
      <P>
        <Rich text={block.text} />
      </P>
    );
  }

  if (block.kind === "h3") {
    return (
      <h3 className="mt-8 text-[1.06em] leading-[1.35] font-bold tracking-[-0.018em] text-ink">
        <Rich text={block.text} />
      </h3>
    );
  }

  if (block.kind === "quote") {
    return (
      <p className="mt-[1.2em] border-l-2 border-mark/40 pl-4 text-[0.96em] leading-[1.6] text-quiet italic">
        <Rich text={block.text} />
      </p>
    );
  }

  if (block.kind === "table") {
    return <Grid head={block.head} rows={block.rows} />;
  }

  /* A list whose items all name something is a set of rows. All of them, not
     most: one plain item among five named ones and the shape is a list with an
     odd row in it, which is worse than a plain list. */
  const named = block.items.map((item) => NAMED.exec(item));

  if (block.kind === "ul" && named.every(Boolean)) {
    return (
      <Named items={named.map((hit) => ({ term: hit![1], says: hit![2] }))} />
    );
  }

  const Tag = block.kind === "ol" ? "ol" : "ul";

  return (
    <Tag
      className={
        block.kind === "ol"
          ? "mt-[1.1em] list-decimal space-y-2 pl-5 marker:font-mono marker:text-[0.8em] marker:text-label"
          : "mt-[1.1em] list-disc space-y-2 pl-5 marker:text-mark"
      }
    >
      {block.items.map((item, n) => (
        <li key={n} className="pl-1 text-[1em] leading-[inherit] text-body">
          <Rich text={item} />
        </li>
      ))}
    </Tag>
  );
}

/** The whole piece: its opening, then its sections in order. */
export function Written({
  lead,
  sections,
}: {
  lead: string;
  sections: readonly Section[];
}) {
  return (
    <>
      <Lede>
        <Rich text={lead} />
      </Lede>

      {sections.map((section) => (
        <Sect key={section.title} title={section.title}>
          {section.blocks.map((block, n) => (
            <Piece key={n} block={block} />
          ))}
        </Sect>
      ))}
    </>
  );
}
