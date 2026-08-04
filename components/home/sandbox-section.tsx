"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  Map,
  Pause,
  Pipette,
  Play,
  PoundSterling,
  Sparkles,
  Waves,
} from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

import { LoomStrings } from "./loom-strings";
import { ParticleWordmark } from "./particle-wordmark";

/* ---------------------------------------------------------------------------
   The sandbox.

   Everything else on this page is a claim about what we can build. This is a
   bench: a shelf of pieces on the left, one of them running on the right, and
   a way to say you want it in yours.

   A grid of tiles was the wrong shape for it. Tiles say "look at these"; a
   bench says "pick one up", which is the difference between a showreel and a
   thing you can actually try - and it gives each widget the whole stage rather
   than a quarter of a screen it immediately overran.

   Two of these run. The rest are named as ideas rather than drawn as though
   they were finished, because a mock-up of something that does not exist is the
   same lie as a logo of a client we do not have.
--------------------------------------------------------------------------- */

const PIECES = [
  {
    key: "particles",
    name: "Particle wordmark",
    note: "A word read into points that turn, drift and follow the pointer. Written for TwinCoreTech.",
    icon: Sparkles,
    live: true,
  },
  {
    key: "loom",
    name: "The loom",
    note: "Threads you can strike. Every note is synthesised rather than loaded, so it weighs nothing.",
    icon: Waves,
    live: true,
  },
  {
    key: "diary",
    name: "Availability, live",
    note: "A diary on the page that holds a slot as it is chosen, rather than sending you somewhere else.",
    icon: CalendarClock,
    live: false,
  },
  {
    key: "estimate",
    name: "What it will cost",
    note: "A figure that moves as the answers do, with the reason for it beside it.",
    icon: PoundSterling,
    live: false,
  },
  {
    key: "sitemap",
    name: "Your sitemap, drawn",
    note: "The pages your answers describe, as a plan you can move things around on.",
    icon: Map,
    live: false,
  },
  {
    key: "colour",
    name: "A colour studio",
    note: "Pull a palette out of a photograph. This one is built - it is inside the scoping run.",
    icon: Pipette,
    live: false,
    at: ROUTES.build,
  },
] as const;

/**
 * A few notes, for the loom's bench.
 *
 * Web Audio rather than a file: six notes of a pentatonic scale weigh nothing,
 * cannot be out of tune and need no network. Nothing sounds until somebody
 * presses play, because audio that arrives uninvited is not a feature.
 */
const SCALE = [261.63, 293.66, 349.23, 392.0, 440.0, 523.25];

function useNotes() {
  const rig = useRef<{ ctx: AudioContext; master: GainNode } | null>(null);
  const timer = useRef<number | null>(null);
  const step = useRef(0);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    if (rig.current) {
      const { ctx, master } = rig.current;
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
    }
    setPlaying(false);
  }, []);

  /* Nothing is left running when this goes away. An interval holding a live
     audio context is the one thing on a page that carries on making itself
     heard after nobody is looking at it. */
  useEffect(() => stop, [stop]);

  const start = useCallback(() => {
    if (!rig.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      rig.current = { ctx, master };
    }

    const { ctx, master } = rig.current;
    void ctx.resume();
    master.gain.setTargetAtTime(0.15, ctx.currentTime, 0.15);

    const pluck = () => {
      const at = ctx.currentTime;
      /* A wandering step rather than a loop, so it does not become a ringtone
         inside twenty seconds. */
      step.current = Math.max(
        0,
        Math.min(
          SCALE.length - 1,
          step.current + (Math.random() < 0.5 ? -1 : 1),
        ),
      );

      const tone = ctx.createOscillator();
      const swell = ctx.createGain();

      tone.type = "sine";
      tone.frequency.value = SCALE[step.current];
      swell.gain.setValueAtTime(0, at);
      swell.gain.linearRampToValueAtTime(1, at + 0.02);
      swell.gain.exponentialRampToValueAtTime(0.0001, at + 2.4);

      tone.connect(swell).connect(master);
      tone.start(at);
      tone.stop(at + 2.5);
    };

    pluck();
    timer.current = window.setInterval(pluck, 1300);
    setPlaying(true);
  }, []);

  return { playing, toggle: () => (playing ? stop() : start()) };
}

export function SandboxSection() {
  const [at, setAt] = useState<string>("particles");
  const { playing, toggle } = useNotes();

  const piece = PIECES.find((entry) => entry.key === at) ?? PIECES[0];

  return (
    <section className="page-frame pt-20 pb-20 lg:pt-32 lg:pb-28">
      <div className="flex flex-col items-center text-center">
        <h2 className="section-head max-w-[26ch] text-ink">
          Things we built.
          <span className="text-quiet"> Running, rather than described.</span>
        </h2>

        <p className="mt-5 max-w-[62ch] text-[15px] leading-[1.6] text-quiet sm:text-[16.5px]">
          A bench rather than a showreel. Pick a piece up, let it run, and ask
          for it in yours - every one of these is a component a site could carry.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-[24px] bg-field lg:mt-12">
        <div className="grid lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* The shelf. Two you can pick up, four we would build. */}
          <div className="border-b border-hair p-3 lg:border-r lg:border-b-0">
            <p className="px-3 pt-2 pb-3 font-mono text-[8.5px] font-bold tracking-[0.16em] text-label uppercase">
              On the bench
            </p>

            <ul
              role="listbox"
              aria-label="Pieces"
              className="flex flex-col gap-0.5"
            >
              {PIECES.map((entry) => {
                const on = entry.key === at;

                return (
                  <li key={entry.key}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={on}
                      onClick={() => setAt(entry.key)}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2.5 text-left transition-colors",
                        on ? "bg-canvas" : "hover:bg-canvas",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "flex size-8 flex-none items-center justify-center rounded-pill transition-colors",
                          on
                            ? "bg-ink text-white"
                            : entry.live
                              ? "bg-canvas text-quiet"
                              : "bg-canvas text-planned",
                        )}
                      >
                        <entry.icon className="size-4" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-[13.5px] font-semibold",
                            on ? "text-ink" : "text-body",
                          )}
                        >
                          {entry.name}
                        </span>
                      </span>

                      <span
                        className={cn(
                          "flex-none font-mono text-[8px] font-bold tracking-[0.12em] uppercase",
                          entry.live ? "text-mark" : "text-idx",
                        )}
                      >
                        {entry.live ? "Live" : "Idea"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* The bench itself. One piece at a time, with the whole stage. */}
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 px-6 pt-6">
              <div className="min-w-0">
                <h3 className="text-[17px] leading-[1.2] font-extrabold tracking-[-0.028em] text-ink">
                  {piece.name}
                </h3>
                <p className="mt-1.5 max-w-[56ch] text-[13.5px] leading-[1.6] text-quiet">
                  {piece.note}
                </p>
              </div>

              {piece.key === "loom" ? (
                <button
                  type="button"
                  onClick={toggle}
                  aria-pressed={playing}
                  className={cn(
                    "flex flex-none cursor-pointer items-center gap-2 rounded-pill px-3.5 py-1.5 font-mono text-[8.5px] font-bold tracking-[0.12em] uppercase transition-colors",
                    playing
                      ? "bg-ink text-white"
                      : "bg-canvas text-quiet hover:text-ink",
                  )}
                >
                  {playing ? (
                    <Pause className="size-3" />
                  ) : (
                    <Play className="size-3" />
                  )}
                  {playing ? "Stop the notes" : "Play the notes"}
                </button>
              ) : null}
            </div>

            {/* Clipped, and given a height of its own. Both of these size
                themselves to whatever box they are in; without one they grow
                until they are over the words above them, which is exactly what
                a grid of small tiles did to them. */}
            <div className="relative mt-4 h-[300px] min-w-0 overflow-hidden px-2 pb-2 sm:h-[340px]">
              {piece.key === "particles" ? (
                <ParticleWordmark word="TwinLoom" className="h-full w-full" />
              ) : null}

              {piece.key === "loom" ? (
                <div className="flex h-full items-center">
                  <LoomStrings word="Play it" className="w-full" />
                </div>
              ) : null}

              {!piece.live ? (
                /* Not built, and said so. The bench shows what it would carry
                   rather than a picture of a thing that does not exist. */
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <span
                    aria-hidden
                    className="flex size-12 items-center justify-center rounded-pill bg-canvas text-idx"
                  >
                    <piece.icon className="size-5" />
                  </span>

                  <p className="mt-4 max-w-[42ch] text-[14px] leading-[1.6] text-quiet">
                    Not built yet. It is a piece we would write into a build
                    rather than a thing we are pretending to have finished.
                  </p>

                  <Link
                    href={"at" in piece && piece.at ? piece.at : ROUTES.build}
                    className="group/ask mt-5 inline-flex items-center gap-2 rounded-pill bg-ink px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
                  >
                    {"at" in piece && piece.at ? "See it working" : "Ask for it"}
                    <ArrowUpRight
                      aria-hidden
                      className="size-3.5 transition-transform group-hover/ask:translate-x-0.5 group-hover/ask:-translate-y-0.5"
                    />
                  </Link>
                </div>
              ) : null}
            </div>

            {/* The foot: what picking one up actually leads to. */}
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-hair px-6 py-4">
              <p className="flex items-center gap-2.5 text-[12.5px] leading-[1.5] text-label">
                <Check
                  aria-hidden
                  className="size-3.5 flex-none text-mark"
                  strokeWidth={3}
                />
                Anything here can be written into a scope as a named piece of
                work.
              </p>

              <Link
                href={ROUTES.build}
                className="group/add inline-flex items-center gap-2 rounded-pill bg-canvas px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-hair"
              >
                Add one to your journey
                <ArrowUpRight
                  aria-hidden
                  className="size-3.5 transition-transform group-hover/add:translate-x-0.5 group-hover/add:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
