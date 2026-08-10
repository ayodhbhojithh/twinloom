import { ArrowUpRight } from "lucide-react";

import { SISTER } from "@/lib/site";

/* ---------------------------------------------------------------------------
   The other company's name, wherever a sentence says it.

   One of the six things we sell is built by the sister company, and the sentence
   that says so is set on the services wall, in the panel the landing card opens,
   and on the about page. It was plain grey type in all three - a name somebody is
   expected to recognise, in the same colour as the words either side of it. It is
   the one word on any of those cards that anybody would want to press.

   Here rather than in each of them, because three copies of a split-and-link is
   three places for the colour, the arrow and the destination to drift apart.
--------------------------------------------------------------------------- */

/**
 * A sentence, with the sister company's name made a way out of it.
 *
 * Split on the name in the markup rather than kept as three fields in
 * `lib/services`. The sentence is a sentence; cutting it into pieces in the data
 * so the middle one can be blue is a sentence that can no longer be rewritten
 * without editing a component.
 *
 * Which means every card runs through here and only one of them finds anything,
 * and that is the point - the day a second sentence names the company, it is
 * already linked.
 *
 * It goes to the company's own site, which is off this one - so a plain anchor
 * with `target` rather than a `Link`. `Link` is for routes this application
 * owns, and prefetching an address on somebody else's domain is a request we
 * have no business making. `noreferrer` covers `noopener` as well, and covers
 * it in the browsers where `noopener` alone does not.
 */
export function SisterSentence({ say }: { say: string }) {
  const parts = say.split(SISTER.name);
  if (parts.length === 1) return <>{say}</>;

  return (
    <>
      {parts.map((part, n) => (
        <span key={n}>
          {n > 0 ? (
            /* The arrow is inside the link and sized in `em`, so it comes down
               with the card's own type - ten and a half pixels on a phone,
               thirteen and a half on a desk - and it underlines and presses as
               part of the name rather than sitting beside it. */
            <a
              href={SISTER.href}
              target="_blank"
              rel="noreferrer"
              className="font-semibold whitespace-nowrap text-mark underline decoration-hair underline-offset-2 transition-colors hover:decoration-mark"
            >
              {SISTER.name}
              <ArrowUpRight
                aria-hidden
                className="ml-0.5 inline size-[0.85em] shrink-0 align-[-0.09em]"
                strokeWidth={2.4}
              />
            </a>
          ) : null}
          {part}
        </span>
      ))}
    </>
  );
}
