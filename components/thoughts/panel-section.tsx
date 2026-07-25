import { cn } from "@/lib/utils";

/**
 * One block inside the panel.
 *
 * A white card on the panel's tinted surface. The fill is the only thing
 * separating one capture tool from the next: no outline and no shadow, because a
 * white card on grey is already a card and either one would draw the same edge
 * twice.
 *
 * The panel runs on one spacing scale and this component owns two steps of it:
 * 14px of card padding, and 10px from the label row down to the content. Every
 * section inherits both, which is what makes four different tools read as one set.
 *
 * The label's icon carries the brand colour once the section holds something and
 * stays faint while it is empty. That is a running tally of what has been captured,
 * read down the left edge without counting anything.
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
    <section
      className={cn(
        "rounded-card bg-card p-3.5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className={cn(
            "flex size-[22px] shrink-0 items-center justify-center rounded-nav transition-colors duration-300",
            active ? "bg-soft text-brand" : "bg-panel-bg text-faint",
          )}
        >
          {icon}
        </span>

        {/* Same eyebrow treatment as the site's own faint section labels. */}
        <h3 className="font-mono text-[10.5px] font-bold tracking-[0.1em] text-faint uppercase">
          {label}
        </h3>

        {meta ? <span className="ml-auto shrink-0">{meta}</span> : null}
      </div>

      <div className="mt-2.5">{children}</div>
    </section>
  );
}
