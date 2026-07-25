import { cn } from "@/lib/utils";

/**
 * The handwritten margin note. Used sparingly, the way the prototype does: an
 * aside in the designer's voice, never load bearing information.
 */
export function ScriptNote({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "font-script text-[19px] leading-tight text-ink-4 sm:text-[22px]",
        className,
      )}
    >
      {children}
    </p>
  );
}
