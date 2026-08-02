/**
 * A home page with nothing in it yet.
 *
 * Deliberately bare. These two exist to hold a design that has not arrived, and
 * anything put here in the meantime would have to be taken out again, so what is
 * here is the frame and an honest label.
 *
 * The frame is the one the real home page uses: `page-frame` for the gutters,
 * `--stage` for the height of the window under the header, and no `PageShell`.
 * So whatever lands here starts on the same edges and the same screenful as the
 * page it is an alternative to, and the comparison is fair from the first line.
 */
export function EmptyHome({ label }: { label: string }) {
  return (
    <section className="page-frame flex min-h-[var(--stage)] flex-col justify-center py-12">
      <div className="max-w-wide">
        <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-label uppercase">
          {label}
        </p>

        <h1 className="mt-6 max-w-[18ch] text-[clamp(30px,3.6vw,48px)] leading-[1.06] font-extrabold tracking-[-0.04em] text-ink">
          Nothing in here yet.
        </h1>

        <p className="mt-5 max-w-[52ch] text-[16.5px] leading-[1.6] text-quiet">
          A place for another home page. It has the same gutters and the same one
          screen as the first, so whatever goes here can be read against it
          without either being at an advantage.
        </p>

        <span className="mt-8 inline-flex items-center gap-2 rounded-pill border border-border bg-well py-1.5 pr-3.5 pl-2.5 font-mono text-[10px] font-bold tracking-[0.14em] text-quiet uppercase">
          <span aria-hidden className="size-1.5 rounded-pill bg-planned" />
          Waiting on a design
        </span>
      </div>
    </section>
  );
}
