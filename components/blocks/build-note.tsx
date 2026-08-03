import { cn } from "@/lib/utils";

/**
 * The empty marker: a pill saying this screen has nothing on it yet.
 *
 * The framework's `.fw`. Most of its screens are deliberately empty, and saying so
 * out loud is the honest move: without it an empty page reads as broken, and with
 * it the page reads as a place that has been reserved on purpose.
 *
 * Its dot is the `planned` grey, the same colour the rest of the system uses for
 * "not started", so the state means the same thing here as anywhere else.
 */
export function EmptyMark({
  children = "Nothing in here yet",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mb-[18px] inline-flex items-center gap-[7px] rounded-pill bg-well py-[5px] pr-3 pl-2.5 font-mono text-[10.5px] font-bold tracking-[0.1em] text-quiet uppercase",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-planned" />
      {children}
    </p>
  );
}

/**
 * The framework's `.build`: what belongs on this screen, or what is still to
 * decide.
 *
 * A dashed outline, because dashed means unbuilt everywhere else in this system
 * too, and because it has to be obvious that this is a note to ourselves rather
 * than copy for a visitor.
 *
 * It is the only thing on the site that is not addressed to the reader, and it is
 * kept because it is the most useful content on an empty page: it says what the
 * page is for, which is exactly what somebody reviewing the framework needs.
 */
export function BuildNote({
  label = "What belongs on this screen",
  className,
  children,
}: {
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <aside
      className={cn(
        "my-7 max-w-measure rounded-card border border-dashed border-planned px-5 py-4 text-[15px] text-quiet [&_li]:text-quiet [&>p:last-child]:mb-0 [&>ul]:mb-0",
        className,
      )}
    >
      <p className="mb-2.5 font-mono text-[11px] font-bold tracking-[0.18em] text-label uppercase">
        {label}
      </p>

      {children}
    </aside>
  );
}
