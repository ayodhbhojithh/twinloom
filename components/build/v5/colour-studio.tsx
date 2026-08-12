"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

import { Pipette } from "lucide-react";

import {
  getPalette,
  getServerPalette,
  subscribePalette,
} from "@/lib/build/v5-palette";

import { Kicker } from "./kit";

/* The studio, fetched when somebody asks for it.

   A thousand lines of picker - eyedropper, screen capture, harmonies, the
   contrast maths - behind a button most readers never press, and all of it was
   arriving with the step. It is its own chunk now and the browser goes for it
   on the press.

   No `ssr: false` needed and none given: this only ever renders inside a
   portal to `document.body`, which is client-only ground already. */
const Studio = dynamic(() =>
  import("./colour-studio-desk").then((m) => m.Studio),
);

/* ---------------------------------------------------------------------------
   The colour studio.

   Asking somebody to type a hex code assumes they have one. Most people have a
   photograph of the shop, a sign, a van, a logo they cannot open - the colour
   exists, it is just not written down anywhere. So the studio's first job is to
   get a colour out of a picture, and its second is to let somebody say what
   that colour is for and how much of the site it should be.

   It opens over the page rather than beside it, because picking a colour is one
   task done with both hands and the questions behind it can wait. It is cut the
   way every other surface here is cut: the title stands in the notch, the way
   out stands in the corner, and the count of what has been picked stands in the
   bite.

   Nothing in it is required. A site can be built from the words alone, and the
   palette is something you have if you have it.
--------------------------------------------------------------------------- */

/* ------------------------------------------------------------- the trigger */

export function ColourStudioPanel() {
  const palette = useSyncExternalStore(
    subscribePalette,
    getPalette,
    getServerPalette,
  );
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-8 max-w-[1100px]">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div className="min-w-0">
          <Kicker className="block text-ink">Your colours</Kicker>
          <p className="mt-1 max-w-[54ch] text-[12.5px] leading-[1.5] text-quiet">
            Pull them out of a photograph, a logo or anything on your screen.
            Say what each one is for and how much of the site it should take.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-pill bg-ink px-4.5 py-2 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85"
        >
          <Pipette className="size-4" />
          {palette.length ? "Open the studio" : "Open the colour studio"}
        </button>
      </div>

      {/* What has been picked so far, at a glance and at its real weights. */}
      {palette.length ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3.5 block w-full cursor-pointer text-left"
        >
          <span className="flex h-10 w-full overflow-hidden rounded-[12px]">
            {palette.map((swatch) => (
              <span
                key={swatch.id}
                title={`${swatch.hex} · ${swatch.weight}%`}
                style={{ background: swatch.hex, width: `${swatch.weight}%` }}
              />
            ))}
          </span>
          <span className="mt-2 block font-mono text-[9.5px] font-bold tracking-[0.12em] text-label uppercase">
            {palette.length} colour{palette.length === 1 ? "" : "s"} ·{" "}
            {palette.filter((s) => s.role).length} given a job
          </span>
        </button>
      ) : (
        <p className="mt-3.5 rounded-[12px] bg-canvas px-4 py-3.5 text-[12.5px] leading-[1.5] text-quiet">
          Nothing picked. That is a finished answer - we choose the colours and
          check every pairing before it is used.
        </p>
      )}

      {/* Out to the body, not rendered where it stands.

          The studio opens from inside a step, and a step's content sits on a
          layer of its own so the controls standing in the surface's cuts can be
          reached. That layer is a stacking context, which means a panel
          rendered inside it cannot rise above the step's own toolbar however
          high its z-index goes - the step name floated over the studio. A
          portal takes it out of that layer entirely, which is the only real fix
          for it. */}
      {open
        ? createPortal(<Studio onClose={() => setOpen(false)} />, document.body)
        : null}
    </section>
  );
}
