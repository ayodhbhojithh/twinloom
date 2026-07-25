import { cn } from "@/lib/utils";

const WIDTHS = {
  /** 820px. The narrow reading column the scoping entry page uses. */
  landing: "max-w-landing",
  /** 1000px. A narrower column, for anything that wants tighter gutters. */
  page: "max-w-page",
  /** 1280px. The site's own width: nav, sections and footer all sit on it. */
  wide: "max-w-wide",
} as const;

/**
 * The page's horizontal rhythm. Every width on the site comes from here.
 *
 * `wide` is the default so the nav, the sections and the footer all sit on one
 * edge. Reading measure is handled inside the sections by capping the text
 * itself, not by narrowing the whole column.
 */
export function Container({
  width = "wide",
  className,
  children,
}: {
  width?: keyof typeof WIDTHS;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("mx-auto w-full px-5 sm:px-[22px]", WIDTHS[width], className)}
    >
      {children}
    </div>
  );
}
