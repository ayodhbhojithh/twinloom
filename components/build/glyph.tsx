/**
 * One of the prototype's icons.
 *
 * The catalogue stores each icon as the inside of an SVG, so this supplies the
 * frame: one 24px grid, one stroke weight, no fill. Every glyph in the tool is
 * drawn to those, which is why they sit together as a set.
 *
 * `dangerouslySetInnerHTML` is safe here in the way it usually is not: the markup
 * is a build time constant generated from the prototype, never a value from a
 * request or from anything a visitor typed.
 */
export function Glyph({
  path,
  className = "size-[22px]",
}: {
  path: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      dangerouslySetInnerHTML={{ __html: path }}
    />
  );
}
