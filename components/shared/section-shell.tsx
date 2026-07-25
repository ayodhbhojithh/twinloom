import { cn } from "@/lib/utils";

import { Container } from "./container";
import { MonoLabel } from "./mono-label";
import { ScriptNote } from "./script-note";

interface SectionShellProps {
  id: string;
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** Handwritten aside under the lead. */
  note?: string;
  /** Sits opposite the heading on wide screens. */
  aside?: React.ReactNode;
  tone?: "canvas" | "surface";
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

/**
 * One section, one rhythm. Every marketing section on the page goes through this
 * so the vertical spacing, heading scale and hairline dividers stay identical.
 */
export function SectionShell({
  id,
  eyebrow,
  title,
  lead,
  note,
  aside,
  tone = "canvas",
  className,
  containerClassName,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        "scroll-mt-20 border-t border-hairline py-14 sm:py-18 lg:py-22",
        tone === "surface" ? "bg-surface" : "bg-canvas",
        className,
      )}
    >
      <Container className={containerClassName}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-[720px]">
            {eyebrow ? <MonoLabel>{eyebrow}</MonoLabel> : null}
            <h2
              id={`${id}-title`}
              className={cn(
                "text-[26px] font-extrabold tracking-[-0.025em] text-balance sm:text-[32px] lg:text-[38px]",
                eyebrow && "mt-2",
              )}
            >
              {title}
            </h2>
            {lead ? (
              <p className="mt-3 text-[15px] leading-[1.6] text-ink-3 sm:text-base">
                {lead}
              </p>
            ) : null}
            {note ? <ScriptNote className="mt-2">{note}</ScriptNote> : null}
          </div>

          {aside ? <div className="lg:shrink-0">{aside}</div> : null}
        </div>

        <div className="mt-8 sm:mt-10">{children}</div>
      </Container>
    </section>
  );
}
