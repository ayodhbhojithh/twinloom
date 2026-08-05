/**
 * Structured data, on the page.
 *
 * A plain `script` rather than `next/script`, which is built for loading and
 * running JavaScript. This is not code - it is a block of JSON that has to be in
 * the markup when a crawler reads it, and deferring it would be deferring the
 * only thing here that has to arrive on time.
 *
 * `<` is escaped on the way out. `JSON.stringify` will happily put a closing
 * script tag inside a string if one is in the data, which ends the block early
 * and turns whatever follows into markup the browser runs. Nothing on this site
 * takes user input into structured data today, but the day something does is not
 * the day to remember this.
 */
export function JsonLd({ data }: { data: object | readonly object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
