import { cn } from "@/lib/utils";

/**
 * One block inside the panel.
 *
 * The panel runs on one spacing scale, and this component owns two steps of it:
 * 16px of card padding, and 12px from the label row down to the content. Every
 * section inherits both, which is what makes four different capture tools read
 * as one set.
 */
export function PanelSection({
  label,
  icon,
  meta,
  className,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-card border border-line bg-card p-4 transition-colors focus-within:border-brand/40",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="flex size-6 shrink-0 items-center justify-center rounded-nav bg-soft text-brand"
        >
          {icon}
        </span>

        {/* Same eyebrow treatment as the site's own faint section labels. */}
        <h3 className="font-mono text-[11px] font-extrabold tracking-[0.08em] text-faint uppercase">
          {label}
        </h3>

        {meta ? <span className="ml-auto shrink-0">{meta}</span> : null}
      </div>

      <div className="mt-3">{children}</div>
    </section>
  );
}
