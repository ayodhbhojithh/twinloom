import { cn } from "@/lib/utils";

const WIDTHS = {
  /** 820px. The narrow reading column the scoping entry page uses. */
  landing: "max-w-landing",
  /** 1000px. Body content on the site pages. */
  page: "max-w-page",
  /** 1280px. Furniture that should not sit in the reading column, like the nav. */
  wide: "max-w-wide",
} as const;

/** The page's horizontal rhythm. Every width on the site comes from here. */
export function Container({
  width = "page",
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
