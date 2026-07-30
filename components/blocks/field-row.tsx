import { cn } from "@/lib/utils";

/**
 * A spec field: a mono key and its value, on a hairline row.
 *
 * The draft's `.fld`, and the one place mono earns its keep in running content. It
 * is for the facts a page states rather than argues: an estimated time, a response
 * promise, a reference. The mono key says "this is a value", which is exactly the
 * rule the style guide gives for the typeface.
 *
 * Stacks below 700px. A 168px key beside a value leaves nothing for the value on a
 * phone, and a two word label wrapping three times is worse than a line break.
 */
export function FieldRow({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex max-w-measure flex-col gap-1 border-b border-hair py-2.5 sm:flex-row sm:gap-[18px]",
        className,
      )}
    >
      <dt className="shrink-0 pt-0.5 font-mono text-[11px] font-semibold tracking-[0.1em] text-label uppercase sm:w-[168px]">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 text-[16.5px]">{children}</dd>
    </div>
  );
}

/** A run of them. A definition list, because that is what these rows are. */
export function FieldRows({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <dl className={cn("mb-5", className)}>{children}</dl>;
}

/**
 * A statement: one line, in ink, at a size between body and standfirst.
 *
 * The draft's `.stmt`, for the sentence a section turns on. It is not a heading
 * and it is not an aside, and setting it in plain body would bury it.
 */
export function Statement({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("mb-4 max-w-measure text-[17.5px] text-ink", className)}>
      {children}
    </p>
  );
}

/**
 * A note: quieter than the copy around it, on the well tint.
 *
 * The draft's `.note` and `.well`, which are the same thing under two names. For
 * an aside that matters but is not the argument: a caveat, a reassurance, a piece
 * of small print somebody will want and nobody will read first.
 */
export function Note({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "my-6 max-w-measure rounded-card border border-hair bg-well px-5 py-4 text-[15.5px] leading-[1.6] [&>p:last-child]:mb-0 [&_b]:text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}
