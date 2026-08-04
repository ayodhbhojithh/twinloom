"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

import { LoomStrings } from "./loom-strings";
import { ParticleWordmark } from "./particle-wordmark";

/* ---------------------------------------------------------------------------
   The sandbox.

   Everything else on this page is a claim about what we can build. This is the
   part where the claim runs in front of you: two pieces we wrote ourselves,
   working, on the page, rather than described in a case study.

   Both are things that can go into a build. That is the point of putting them
   here - a widget is not a showreel, it is a component somebody's site could
   carry, and the honest way to show one is to let it be used.
--------------------------------------------------------------------------- */

/**
 * A few notes, played on the way past.
 *
 * Web Audio rather than a file: five notes of a pentatonic scale weigh nothing,
 * cannot be out of tune, and need no network. It starts only when somebody
 * presses play, because sound that arrives uninvited is not a feature.
 */
const SCALE = [261.63, 293.66, 349.23, 392.0, 440.0, 523.25];

/** Widgets we would build, named rather than mocked up. */
const IDEAS = [
  {
    name: "Availability, live",
    note: "A diary on the page, holding a slot as it is chosen.",
    plate: "/work-careers.png",
  },
  {
    name: "What it will cost",
    note: "An estimate that moves as the answers do.",
    plate: "/work-trade.png",
  },
  {
    name: "Your sitemap, drawn",
    note: "The pages you have described, as a plan you can move.",
    plate: "/work-shop.png",
  },
  {
    name: "A colour studio",
    note: "Pull a palette out of a photograph. Built - it is in the scoping run.",
    plate: "/work-investor.png",
  },
] as const;

/** How a picture leaves an idea tile: gone by the time the words start. */
const IDEA_FADE =
  "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.7) 34%, rgba(0,0,0,0.3) 58%, transparent 82%)";

function useNotes() {
  const rig = useRef<{ ctx: AudioContext; master: GainNode } | null>(null);
  const timer = useRef<number | null>(null);
  const step = useRef(0);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    rig.current?.master.gain.setTargetAtTime(
      0,
      rig.current.ctx.currentTime,
      0.08,
    );
    setPlaying(false);
  }, []);

  /* Nothing is left running when the section goes away. An interval holding a
     live audio context is the one thing on a page that keeps making itself
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
    master.gain.setTargetAtTime(0.16, ctx.currentTime, 0.15);

    const pluck = () => {
      const at = ctx.currentTime;
      /* A wandering walk rather than a loop, so it does not become a ringtone
         within twenty seconds. */
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
  const { playing, toggle } = useNotes();

  return (
    <section className="page-frame pt-20 pb-20 lg:pt-32 lg:pb-28">
      <div className="flex flex-col items-center text-center">
        <h2 className="max-w-[36ch] text-[clamp(30px,4.2vw,64px)] leading-[1.04] font-extrabold tracking-[-0.045em] text-balance text-ink">
          Things we built.
          <span className="text-quiet"> Running, rather than described.</span>
        </h2>

        <p className="mt-5 max-w-[76ch] text-[16px] leading-[1.6] text-quiet sm:text-[17.5px]">
          Both of these can go into a build. A widget is not a showreel - it is
          a component somebody&rsquo;s site could carry, so the honest way to
          show one is to let you use it.
        </p>
      </div>

      {/* A bento rather than two halves.

          Two widgets at half a page each made every tile the same weight and
          left each one mostly empty. Sized against one another instead, the
          grid says which is the piece worth stopping at, and it has room for
          the ones that are not built yet - named honestly as such rather than
          drawn as though they were finished. */}
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:auto-rows-[164px] lg:grid-cols-4">
        {/* The wordmark as particles, written for TwinCoreTech. The largest
            tile, because it is the one that rewards being looked at. */}
        <article className="flex min-w-0 flex-col overflow-hidden rounded-[20px] bg-field sm:col-span-2 lg:row-span-2">
          <div className="flex items-start justify-between gap-4 px-5 pt-5">
            <div className="min-w-0">
              <span className="font-mono text-[8.5px] font-bold tracking-[0.16em] text-mark uppercase">
                Widget · particles
              </span>
              <h3 className="mt-1.5 max-w-[24ch] text-[15px] leading-[1.2] font-extrabold tracking-[-0.025em] text-ink">
                A wordmark made of points, that follows the pointer
              </h3>
            </div>

            <span className="flex flex-none items-center gap-1.5 rounded-pill bg-canvas px-2.5 py-1 font-mono text-[8.5px] font-bold tracking-[0.12em] text-quiet uppercase">
              <Sparkles className="size-3" />
              Live
            </span>
          </div>

          <div className="min-h-[180px] flex-1 px-1 pb-1">
            <ParticleWordmark word="TwinLoom" className="h-full w-full" />
          </div>
        </article>

        {/* The loom, which is the one that makes a sound. */}
        <article className="flex min-w-0 flex-col overflow-hidden rounded-[20px] bg-field sm:col-span-2">
          <div className="flex items-start justify-between gap-4 px-5 pt-5">
            <div className="min-w-0">
              <span className="font-mono text-[8.5px] font-bold tracking-[0.16em] text-mark uppercase">
                Widget · sound
              </span>
              <h3 className="mt-1.5 text-[15px] leading-[1.2] font-extrabold tracking-[-0.025em] text-ink">
                A loom you can play
              </h3>
            </div>

            <button
              type="button"
              onClick={toggle}
              aria-pressed={playing}
              className={cn(
                "flex flex-none cursor-pointer items-center gap-2 rounded-pill px-3 py-1 font-mono text-[8.5px] font-bold tracking-[0.12em] uppercase transition-colors",
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
              {playing ? "Stop" : "Play"}
            </button>
          </div>

          <div className="flex min-h-[92px] flex-1 items-center px-1 pb-1">
            <LoomStrings word="Play it" className="w-full" />
          </div>
        </article>

        {/* The ones that are not built. Named as ideas rather than drawn as
            though they were finished: a mock-up of a thing that does not exist
            is the same lie as a logo of a client we do not have. */}
        {IDEAS.map((idea) => (
          <article
            key={idea.name}
            className="group/idea relative flex min-h-[164px] min-w-0 flex-col justify-end overflow-hidden rounded-[20px] bg-field p-5"
          >
            <span aria-hidden className="absolute inset-0">
              <Image
                src={idea.plate}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="object-cover opacity-70 transition-transform duration-500 group-hover/idea:scale-[1.05]"
                style={{ maskImage: IDEA_FADE, WebkitMaskImage: IDEA_FADE }}
              />
            </span>

            <span className="relative">
              <span className="font-mono text-[8.5px] font-bold tracking-[0.16em] text-label uppercase">
                Idea
              </span>
              <b className="mt-1 block max-w-[18ch] text-[14.5px] leading-[1.2] font-extrabold tracking-[-0.025em] text-ink">
                {idea.name}
              </b>
              <span className="mt-1 block max-w-[26ch] text-[12px] leading-[1.45] text-quiet">
                {idea.note}
              </span>
            </span>
          </article>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href={ROUTES.build}
          className="group/ask inline-flex items-center gap-2 rounded-pill bg-field px-4.5 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hair"
        >
          Ask for something like this
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform group-hover/ask:translate-x-0.5 group-hover/ask:-translate-y-0.5"
          />
        </Link>
      </div>
    </section>
  );
}
