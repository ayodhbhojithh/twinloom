import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The artifacts' two buttons, at the three sizes they appear in.
 *
 *   primary   `.b1` / `.cta`  brand fill, lifts on hover
 *   secondary `.b2`           white on a hairline
 *
 *   sm        nav bar         13px, 8/13, radius 9
 *   default   in page         14px, 10/18, radius 9
 *   lg        hero            16px, 14/30, radius 12
 *
 * Renders a link when given an href, a button otherwise.
 */
type ActionVariant = "primary" | "secondary";
type ActionSize = "sm" | "default" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50";

/* Weight belongs to the variant, not the size: the artifacts set `.b1` at 700
   and `.b2` at 600, and Manrope needs that extra weight to hold its own at
   these sizes. */
const VARIANTS: Record<ActionVariant, string> = {
  primary:
    "bg-brand font-bold text-white shadow-cta hover:-translate-y-px hover:shadow-cta-hover",
  secondary:
    "border border-line bg-card font-semibold text-ink hover:bg-soft hover:border-brand/30",
};

const SIZES: Record<ActionSize, string> = {
  sm: "rounded-btn-sm px-[13px] py-2 text-[13px]",
  default: "rounded-btn-sm px-[18px] py-2.5 text-sm",
  lg: "rounded-btn px-[30px] py-3.5 text-base",
};

interface ActionButtonProps {
  variant?: ActionVariant;
  size?: ActionSize;
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function ActionButton({
  variant = "primary",
  size = "default",
  href,
  className,
  children,
  ...props
}: ActionButtonProps) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  /* In page anchors stay plain anchors: there is no route to prefetch, and the
     browser's own hash handling is what scrolls the page. */
  if (href?.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
