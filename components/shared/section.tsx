import { cn } from "@/lib/utils";

import { Container } from "./container";
import { Eyebrow } from "./eyebrow";
import { Reveal } from "./reveal";

/**
 * The accent word takes one colour per section, rotating down the page. Every
 * value is a token from the 2a palette, so the page stays colourful without any
 * section ever needing a coloured background.
 */
export type AccentTone =
  | "brand"
  | "amber"
  | "pink"
  | "violet"
  | "emerald"
  | "blue"
  | "gradient";

const ACCENT: Record<AccentTone, string> = {
  brand: "text-brand",
  amber: "text-accent-amber",
  pink: "text-accent-pink",
  violet: "text-accent-violet",
  emerald: "text-accent-emerald",
  blue: "text-accent-blue",
  gradient: "text-brand-gradient",
};

interface SectionProps {
  id: string;
  eyebrow?: string;
  /** The handwritten nudge above the heading. Used once, on the closing block. */
  aside?: string;
  heading: string;
  /** The one word in a different colour. Rendered after `heading`. */
  accent?: string;
  accentTone?: AccentTone;
  /** The quiet mono line sitting on the heading's baseline. */
  micro?: string;
  lead?: string;
  /** Left is the 2a treatment. Centre suits a closing block. */
  align?: "center" | "left";
  /** The closing block gets a display-sized heading; everything else matches. */
  size?: "default" | "large";
  width?: "page" | "landing" | "wide";
  /**
   * Set false when the section reveals its own children, so their spring is not
   * played inside a second one on the wrapper.
   */
  revealBody?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * One block of the page, with one rhythm.
 *
 * The heading is the 2a pattern: bold, tight, one accent word, and a line of mono
 * microcopy on the same baseline. The microcopy is doing real work, not
 * decoration. It answers the question the heading provokes ("how many?", "how
 * long?", "is this everything?") in the space a subheading would otherwise take.
 *
 * The page is white throughout with no dividers between sections, so spacing and
 * type hierarchy are the only things separating one block from the next. That
 * makes consistency here load bearing rather than cosmetic.
 */
export function Section({
  id,
  eyebrow,
  aside,
  heading,
  accent,
  accentTone = "brand",
  micro,
  lead,
  align = "left",
  size = "default",
  width = "wide",
  revealBody = true,
  className,
  children,
}: SectionProps) {
  const centred = align === "center";

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("py-12 sm:py-16 lg:py-20", className)}
    >
      <Container width={width}>
        <Reveal className={cn(centred && "text-center")}>
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}

          {aside ? (
            <p className="font-script text-[21px] leading-tight text-faint sm:text-[23px]">
              {aside}
            </p>
          ) : null}

          {/* Baseline aligned from sm up, stacked below it. The microcopy is
              never allowed to squeeze the heading onto a second line. */}
          <div
            className={cn(
              "flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3.5 sm:gap-y-1",
              centred && "sm:justify-center",
              (eyebrow || aside) && "mt-2",
            )}
          >
            <h2
              id={`${id}-heading`}
              className={cn(
                "leading-[1.2] font-extrabold tracking-[-0.02em]",
                size === "large"
                  ? "text-[30px] tracking-[-0.03em] sm:text-[38px] lg:text-[44px]"
                  : "text-[23px] sm:text-[26px] lg:text-[29px]",
              )}
            >
              {heading}
              {accent ? (
                <>
                  {" "}
                  <span className={ACCENT[accentTone]}>{accent}</span>
                </>
              ) : null}
            </h2>

            {micro ? (
              <span className="font-mono text-[11.5px] leading-[1.5] text-faint sm:text-[12px]">
                {micro}
              </span>
            ) : null}
          </div>

          {lead ? (
            <p
              className={cn(
                "mt-3 max-w-[720px] text-[15px] leading-[1.6] text-body sm:text-[15.5px]",
                centred && "mx-auto",
              )}
            >
              {lead}
            </p>
          ) : null}
        </Reveal>

        {children ? (
          revealBody ? (
            <Reveal delay={0.08} className="mt-6 sm:mt-7">
              {children}
            </Reveal>
          ) : (
            <div className="mt-6 sm:mt-7">{children}</div>
          )
        ) : null}
      </Container>
    </section>
  );
}
