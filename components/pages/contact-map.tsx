"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { outline, type Cuts } from "@/components/home/notched-card";
import { CONTACT_INFO } from "@/lib/site";

/* ---------------------------------------------------------------------------
   Where we are, drawn rather than described.

   The map is cut to the site's own outline instead of being dropped in as a
   rectangle, because a square of Google inside a page built entirely out of
   flared cuts is the one object wearing somebody else's shape.

   It does not scroll and it does not zoom. An embedded map that takes the
   wheel off a page is a trap somebody has to escape, and nobody came to this
   page to pan around Bromley - they came to find out roughly where it is and
   then open the real thing. So the picture is inert and the whole surface is
   the link.
--------------------------------------------------------------------------- */

export function ContactMap({ className }: { className?: string }) {
  const box = useRef<HTMLAnchorElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const node = box.current;
    if (!node) return;

    const measure = () =>
      setSize({ w: node.clientWidth, h: node.clientHeight });
    const watcher = new ResizeObserver(measure);
    watcher.observe(node);
    measure();

    return () => watcher.disconnect();
  }, []);

  /* One cut, at the bottom right, the size the panels use. Everything else is
     the surface's own corners. */
  const w = Math.max(size.w, 1);
  const h = Math.max(size.h, 1);
  const radius = Math.max(18, Math.min(w * 0.02 + 12, 30));
  const flare = Math.max(18, Math.min(h * 0.06, 26));
  const nook = Math.max(flare * 2 + 18, Math.min(w * 0.16, 88));

  const cut: Cuts = {
    radius,
    barWidth: 0.01,
    barDepth: 0.01,
    barRadius: 0.01,
    barFlare: 0.01,
    biteWidth: 0.01,
    biteHeight: 0.01,
    biteRadius: 0.01,
    biteFlare: 0.01,
    dropWidth: nook,
    dropHeight: nook,
    dropRadius: flare,
    dropFlare: flare,
  };

  const path = size.w > 40 ? outline(w, h, cut) : "";

  return (
    <a
      ref={box}
      href={CONTACT_INFO.address.mapUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${CONTACT_INFO.address.name} in Google Maps`}
      className={className}
    >
      <span
        aria-hidden
        className="absolute inset-0 block overflow-hidden bg-canvas"
        style={{ clipPath: path ? `path("${path}")` : undefined }}
      >
        {/* Grey, then washed blue. The map arrives in its own greens and tans,
            which is a second palette on a page that has one. */}
        <iframe
          src={CONTACT_INFO.address.embedUrl}
          title={CONTACT_INFO.address.name}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="pointer-events-none absolute inset-0 size-full border-0"
          style={{ filter: "grayscale(1) contrast(0.9) brightness(1.06)" }}
        />

        <span className="pointer-events-none absolute inset-0 block bg-mark/[0.09]" />
      </span>

      {/* The way to the real map, standing in the cut. */}
      <span
        aria-hidden
        className="absolute right-0 bottom-0 flex items-center justify-center"
        style={{ width: nook, height: nook }}
      >
        <span className="flex size-11 items-center justify-center rounded-pill bg-ink text-white transition-opacity group-hover/map:opacity-85">
          <ArrowUpRight className="size-[18px]" strokeWidth={2.2} />
        </span>
      </span>
    </a>
  );
}
