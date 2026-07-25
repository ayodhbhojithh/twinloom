import { cn } from "@/lib/utils";

import { Container } from "./container";
import { Eyebrow } from "./eyebrow";
import { Reveal } from "./reveal";

interface SectionProps {
  id: string;
  eyebrow?: string;
  heading: string;
  lead?: string;
  /** Centred reads better on a marketing page; left suits denser blocks. */
  align?: "center" | "left";
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
 * The page is white throughout with no dividers between sections, so spacing and
 * type hierarchy are the only things separating one block from the next. That
 * makes consistency here load bearing rather than cosmetic.
 *
 * The heading reveals on scroll and the body a beat behind, so a section
 * introduces itself before its contents arrive.
 */
export function Section({
  id,
  eyebrow,
  heading,
  lead,
  align = "center",
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
        <Reveal
          className={cn("max-w-[1200px]", centred && "mx-auto text-center")}
        >
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}

          <h2
            id={`${id}-heading`}
            className={cn(
              "text-[24px] leading-[1.2] font-extrabold tracking-[-0.02em] text-balance sm:text-[28px] lg:text-[32px]",
              eyebrow && "mt-3",
            )}
          >
            {heading}
          </h2>

          {lead ? (
            <p className="mt-3 text-[16px] leading-[1.6] text-body sm:text-[17px]">
              {lead}
            </p>
          ) : null}
        </Reveal>

        {children ? (
          revealBody ? (
            <Reveal delay={0.08} className="mt-8 sm:mt-10">
              {children}
            </Reveal>
          ) : (
            <div className="mt-8 sm:mt-10">{children}</div>
          )
        ) : null}
      </Container>
    </section>
  );
}
