import { cn } from "@/lib/utils";

/**
 * One block inside the panel.
 *
 * No card, no fill, no rule and no shadow. A mono label, the content under it, and
 * space around it, which is the same grammar the Blueprint uses. Five stacked cards
 * inside a sixth surface was five nested edges for four inputs.
 *
 * The sheet is white and every control inside is a recessed grey fill, so the only
 * shapes on the panel are the things you can type into. That is the whole rule.
 *
 * The label's icon carries the brand colour once the section holds something and
 * stays faint while it is empty. A running tally of what has been captured, read
 * down the left edge without counting anything.
 */
export function PanelSection({
  label,
  icon,
  meta,
  active,
  className,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  meta?: React.ReactNode;
  /** True once the section holds something. */
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={className}>
      <div className="flex items-center gap-1.5">
        <span
          aria-hidden
          className={cn(
            "shrink-0 transition-colors duration-300",
            active ? "text-brand" : "text-faint/60",
          )}
        >
          {icon}
        </span>

        <h3 className="font-mono text-[9.5px] font-bold tracking-[0.14em] text-faint uppercase">
          {label}
        </h3>

        {meta ? <span className="ml-auto shrink-0">{meta}</span> : null}
      </div>

      <div className="mt-3">{children}</div>
    </section>
  );
}
