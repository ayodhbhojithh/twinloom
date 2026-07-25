import { cn } from "@/lib/utils";

import { Container } from "./container";
import { Eyebrow } from "./eyebrow";

interface SectionProps {
  id: string;
  eyebrow?: string;
  heading: string;
  lead?: string;
  /** Centred reads better on a marketing page; left suits denser blocks. */
  align?: "center" | "left";
  width?: "page" | "landing" | "wide";
  className?: string;
  children?: React.ReactNode;
}

/**
 * One block of the page, with one rhythm.
 *
 * The page is white throughout with no dividers between sections, so spacing and
 * type hierarchy are the only things separating one block from the next. That
 * makes consistency here load bearing rather than cosmetic.
 */
export function Section({
  id,
  eyebrow,
  heading,
  lead,
  align = "center",
  width = "wide",
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
        <div className={cn("max-w-[880px]", centred && "mx-auto text-center")}>
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
        </div>

        {children ? <div className="mt-8 sm:mt-10">{children}</div> : null}
      </Container>
    </section>
  );
}
