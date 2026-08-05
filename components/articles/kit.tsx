/* ---------------------------------------------------------------------------
   What an article is made of.

   Not a markdown renderer. A renderer can only do to every paragraph what it
   does to all of them, which is how four considered pieces turn into one long
   grey column with six tables in it.

   These are the shapes the writing actually takes: a run of prose, a set of
   named things, a comparison, a figure worth pulling out, and a question
   somebody asks. Each article is written with them, so the page can be set as
   what it says rather than as what it was typed in.
--------------------------------------------------------------------------- */

/** The opening paragraph, at the one size that is larger than the rest. */
export function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[clamp(17px,1.4vw,19.5px)] leading-[1.6] font-medium text-ink">
      {children}
    </p>
  );
}

/** A section, numbered in the margin so the run of them is countable. */
export function Sect({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={sectId(title)}
      className="mt-16 scroll-mt-[calc(var(--nav-height)+24px)] first:mt-12"
    >
      {/* The heading, and nothing hanging off it.

          There was a mono number set in the margin beside every one. It was
          there to agree with the contents index down the right; with the index
          gone it numbers a sequence nobody is following, and it held the
          headings a centimetre in from the left edge every other line on the
          page starts at. */}
      <h2 className="text-[clamp(22px,1.9vw,29px)] leading-[1.16] font-extrabold tracking-[-0.032em] text-ink">
        {title}
      </h2>

      <div className="mt-5">{children}</div>
    </section>
  );
}

export const sectId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** A paragraph, at the article's one reading size. */
export function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-[1.1em] text-[1em] leading-[inherit] text-body first:mt-0">
      {children}
    </p>
  );
}

