"use client";

import { useCallback, useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   The loom, as two threads twisted round one wave.

   A field of vertical threads riding a slow swell, split into a pair that
   spirals tightly around it and crosses many times along the field's length -
   a braid, not a bend. `Twin` and `Loom` are two things woven into one word,
   and one thread would only ever draw the second half of that.

   It plays, the way an earlier version did. That one wove a word out of its
   threads and struck a note for every one a pointer crossed; the word is gone
   but the instrument is not - crossing a thread here still plucks it and still
   sounds a note, on the same synthesised string. What is different is what is
   being played: there, a shape holding still until touched; here, a shape
   already moving, so a pluck is added to a swing rather than started from rest.

   The twist is not the swell. It was, the first time this was tried: the pair
   mirrored around the swell's own centre, so it crossed wherever the swell
   crossed - three or four times along the whole field, which reads as a lens
   opening and closing rather than as anything twisted. A rope's pitch has
   nothing to do with how the rope is laid out; `TWIST` is its own frequency,
   several times `RIDE`'s, and the pair rides the swell together while
   spiralling around it at that faster rate.

   Which strand is in front swaps at every crossing, decided the same way the
   crossing is: by which side `TWIST` put that strand on. Nothing is layered by
   strand as a whole - it is decided column by column, the same way the ghosts
   are kept behind the field by drawing all of one pass before any of the
   other.

   Two ramps rather than two colours. Strand two reads the strand one ramp
   backwards, so the piece is telling one continuous colour story rather than
   assigning each thread a fixed hue - which is what actually sells two threads
   rather than one doubled.

   The height is a sum, not a shape. Two squared sines at different rates make
   the broad clusters and two more, indexed by thread rather than by position,
   roughen every thread inside them. Squared because a sine spends half its life
   below zero and what is wanted is a swell that never inverts: `sin²` is a row
   of humps.

   And there is a ghost layer behind both strands, standing taller than either
   and drawn in pale grey-blue, so the pair has something to sit in front of.
   One layer of threads is a graph; a backdrop behind it is a picture of one.

   The count is fixed rather than taken from the width, because the roughness is
   indexed by thread - a field that changed its count with the window would
   change its texture every time somebody dragged an edge.
--------------------------------------------------------------------------- */

/** How many threads, whatever the box is. */
const COUNT = 315;

/** Where the middle of the field sits, as a share of the height. */
const CENTRE = 0.5;

/** The swell: one fast wave and one slow, both as shares of the height. */
const RIDE = [
  { reach: 0.069, turns: 9, phase: -0.75, speed: 0.1 },
  { reach: 0.027, turns: 2.55, phase: 0.6, speed: -0.06 },
] as const;

/**
 * The twist itself, separate from the swell.
 *
 * `RIDE` decided how the pair crossed the first time this was tried, and it
 * was wrong for it: a wave built to bend slowly across the whole field crosses
 * its own centre three or four times along the width, which reads as a lens
 * opening and closing, not a rope. A twist wants many crossings in the space a
 * bend takes one, so it needs a frequency of its own - `turns` here is roughly
 * four times `RIDE`'s, which is what actually looks braided rather than bowed.
 *
 * The swell is untouched by this. Both strands still ride it together, and
 * what the twist adds is the fast, small separation between them - the line
 * itself does not twist, the pair around it does. */
const TWIST = { reach: 0.05, turns: 34, speed: 0.16 } as const;

/** A floor every thread gets, and the clusters that lift it in places. */
const FLOOR = 0.215;
const SWELL = [
  { reach: 0.131, turns: 4.9, phase: 0.15, speed: 0.07 },
  { reach: 0.065, turns: 10.1, phase: 1.5, speed: -0.05 },
] as const;

/** And the roughness, by thread, so the band's edge is ragged rather than drawn. */
const ROUGH = [
  { reach: 0.031, rate: 0.7 },
  { reach: 0.019, rate: 1.87 },
] as const;

/** How much further the ghosts reach than the field in front of them. */
const GHOST = 0.092;
const GHOST_ROUGH = 0.038;

/**
 * How much of the box the field is allowed.
 *
 * Not a number somebody picked. Every vertical figure above is a share of the
 * height and at their worst they all land on one thread: the swell at its
 * furthest from the middle, both clusters at full, both roughnesses at plus one,
 * and the ghosts' extra reach on top. Summed, that came to more than half the
 * box - so the tallest threads were sliced flat against the top edge, which is
 * exactly what it looked like.
 *
 * Setting a scale by hand fixes it until the next time one of those tables
 * changes. Adding them up here fixes it for good: `ROOM` is whatever makes the
 * worst case fit inside `SAFE`, and no table above can be edited into clipping
 * the picture again.
 */
const SAFE = 0.47;
const WORST =
  RIDE.reduce((n, wave) => n + wave.reach, 0) +
  TWIST.reach +
  FLOOR +
  SWELL.reduce((n, wave) => n + wave.reach, 0) +
  ROUGH.reduce((n, grain) => n + grain.reach, 0) +
  GHOST +
  GHOST_ROUGH;
const ROOM = SAFE / WORST;

/* The ramp, and the one behind it.

   Nine stops rather than two colours mixed. The middle of this list is where the
   field is brightest and the quarter points are where it is nearly black, which
   is a decision about composition - not something a blend between two brand
   colours arrives at on its own. */
const RAMP = [
  [0, "#2a56ff"],
  [0.16, "#1f47d8"],
  [0.28, "#0b1c59"],
  [0.4, "#16347a"],
  [0.5, "#1cc6ff"],
  [0.61, "#0d90dc"],
  [0.72, "#0d215d"],
  [0.84, "#21afbf"],
  [1, "#3bd8c1"],
] as const;

const GHOST_RAMP = [
  [0, "#a8b8ff"],
  [0.28, "#879bd7"],
  [0.5, "#96e5ff"],
  [0.75, "#8ab0da"],
  [1, "#9fe5d2"],
] as const;

type Rgb = readonly [number, number, number];

const ink = (hex: string): Rgb => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

/** A ramp read into numbers once, so a frame is arithmetic rather than parsing. */
const read = (ramp: readonly (readonly [number, string])[]) =>
  ramp.map(([at, hex]) => [at, ink(hex)] as const);

const RAMP_RGB = read(RAMP);
const GHOST_RGB = read(GHOST_RAMP);

/** The colour at a point along a ramp. */
function sample(ramp: readonly (readonly [number, Rgb])[], along: number) {
  const u = along <= 0 ? 0 : along >= 1 ? 1 : along;
  let n = 0;
  while (n < ramp.length - 2 && ramp[n + 1][0] < u) n += 1;
  const [fromAt, from] = ramp[n];
  const [toAt, to] = ramp[n + 1];
  const step = toAt === fromAt ? 0 : (u - fromAt) / (toAt - fromAt);
  return [
    from[0] + (to[0] - from[0]) * step,
    from[1] + (to[1] - from[1]) * step,
    from[2] + (to[2] - from[2]) * step,
  ] as const;
}

const css = (c: Rgb, a: number) =>
  `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;

/** A colour, mixed toward white and alpha carried up to one - a struck
    thread reads as lit rather than merely more opaque. */
const glow = (c: Rgb, a: number, amount: number) => {
  const lit: Rgb = [
    c[0] + (255 - c[0]) * amount,
    c[1] + (255 - c[1]) * amount,
    c[2] + (255 - c[2]) * amount,
  ];
  return css(lit, Math.min(1, a + amount * (1 - a)));
};

/**
 * A minor pentatonic, low to high, left to right.
 *
 * Pentatonic because every note in it agrees with every other one. Somebody
 * dragging a cursor across three hundred threads is not composing, so the
 * scale has to guarantee that whatever they do sounds deliberate.
 */
const SCALE = [0, 3, 5, 7, 10];
const ROOT = 174.61;

/** Many threads, few notes: neighbours share a pitch so a sweep is a run,
    not a siren. Wider than the word version's, because there are three
    times the threads and the same five octaves would have run out. */
const PER_NOTE = 18;

function pitchOf(thread: number) {
  const note = Math.floor(thread / PER_NOTE);
  const step =
    SCALE[note % SCALE.length] + 12 * Math.floor(note / SCALE.length);
  return ROOT * 2 ** (step / 12);
}

export function LoomWave({
  className,
  speed = 1,
}: {
  className?: string;
  speed?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLCanvasElement>(null);

  const audio = useRef<{ ctx: AudioContext; master: GainNode } | null>(null);

  const ensure = useCallback(() => {
    if (!audio.current) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return;

      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = 0.15;

      /* A short delay with a little feedback, which is the cheapest convincing
         room there is. Without it the notes sound struck inside a cupboard. */
      const echo = ctx.createDelay(1);
      echo.delayTime.value = 0.3;
      const back = ctx.createGain();
      back.gain.value = 0.28;
      const wet = ctx.createGain();
      wet.gain.value = 0.42;

      master.connect(ctx.destination);
      master.connect(echo);
      echo.connect(back);
      back.connect(echo);
      echo.connect(wet);
      wet.connect(ctx.destination);

      audio.current = { ctx, master };
    }

    void audio.current.ctx.resume();
  }, []);

  /* The first real gesture anywhere is what a browser counts as permission, so
     that is what opens the audio. Resuming an already running context is free,
     which is why this does not bother unhooking itself. */
  useEffect(() => {
    const unlock = () => ensure();
    const kinds = ["pointerdown", "touchstart", "keydown", "click"] as const;
    for (const kind of kinds) {
      window.addEventListener(kind, unlock, { passive: true });
    }
    return () => {
      for (const kind of kinds) window.removeEventListener(kind, unlock);
    };
  }, [ensure]);

  useEffect(
    () => () => {
      void audio.current?.ctx.close();
      audio.current = null;
    },
    [],
  );

  useEffect(() => {
    const wrap = box.current;
    const canvas = sheet.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let seen = true;
    let clock = 0;
    let last = 0;
    let dpr = 1;
    let lastAt = -1;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* When each thread was last plucked, on the drawing clock, and how hard -
       not an amplitude that decays every frame, but the one moment it happened.
       `draw` reads the age off it fresh each time, which is exact regardless of
       how long a frame took, rather than a recurrence that would drift if a
       frame was dropped. `-Infinity` is a thread that has never rung: any real
       clock reading is younger than it, so its age is always past the point
       the envelope below has finished decaying. */
    const struck = new Float32Array(COUNT).fill(-Infinity);
    const force = new Float32Array(COUNT);

    /** How much a thread is ringing right now, from nought to one. */
    const ringing = (at: number, t: number) => {
      const age = t - struck[at];
      return age < 0 ? 0 : force[at] * Math.exp(-age * 2.4);
    };

    /**
     * Pluck a thread, and the dozen either side of it a little less.
     *
     * Visual and audible, and only the one that was actually crossed sounds a
     * note - its neighbours ring because cloth is connected, not because they
     * were each struck in turn, which is what a chord sweeping across the
     * field would sound like instead of a single line being drawn along it.
     */
    const pluck = (at: number, amount: number) => {
      for (let off = -14; off <= 14; off += 1) {
        const near = at + off;
        if (near < 0 || near >= COUNT) continue;
        const share = amount * (1 - Math.abs(off) / 15) ** 2;
        if (share <= 0) continue;
        struck[near] = clock;
        force[near] = share;
      }

      const kit = audio.current;
      if (!kit || kit.ctx.state !== "running") return;

      const t = kit.ctx.currentTime;
      const freq = pitchOf(at);

      const tone = kit.ctx.createOscillator();
      tone.type = "triangle";
      tone.frequency.value = freq;

      /* A second voice a few cents off. Two almost identical notes beat against
         each other, which is most of what makes a string sound like a string
         rather than a test tone. */
      const twin = kit.ctx.createOscillator();
      twin.type = "sine";
      twin.frequency.value = freq * 1.003;

      /* The brightness of a plucked string falls away faster than its volume. */
      const colour = kit.ctx.createBiquadFilter();
      colour.type = "lowpass";
      colour.frequency.setValueAtTime(Math.min(freq * 7, 7000), t);
      colour.frequency.exponentialRampToValueAtTime(
        Math.max(freq * 1.4, 220),
        t + 0.9,
      );

      const level = kit.ctx.createGain();
      const peak = 0.26 * (0.55 + amount * 0.45);
      level.gain.setValueAtTime(0.0001, t);
      level.gain.exponentialRampToValueAtTime(peak, t + 0.008);
      level.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);

      tone.connect(colour);
      twin.connect(colour);
      colour.connect(level);
      level.connect(kit.master);

      tone.start(t);
      twin.start(t);
      tone.stop(t + 2.3);
      twin.stop(t + 2.3);
    };

    /** Where the swell is, at this point across the field, at this moment. */
    const ride = (along: number, t: number) => {
      let y = height * CENTRE;
      for (const wave of RIDE) {
        y +=
          height *
          ROOM *
          wave.reach *
          Math.sin(
            along * Math.PI * wave.turns + wave.phase + t * wave.speed * speed,
          );
      }
      return y;
    };

    /** How far apart the pair is, at this point, at this moment - the one
        number `RIDE` no longer has any part in. */
    const twist = (along: number, t: number) =>
      height *
      ROOM *
      TWIST.reach *
      Math.sin(along * Math.PI * TWIST.turns + t * TWIST.speed * speed);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      if (width < 2 || height < 2) return;

      ctx.lineCap = "round";

      /* The ghosts, on the one wave rather than the pair - a backdrop does not
         need its own twist, only something for the twist to stand in front of. */
      for (let i = 0; i < COUNT; i += 1) {
        const along = i / (COUNT - 1);
        const x = along * width;
        const middle = ride(along, t);

        let reach =
          height * ROOM * (FLOOR + GHOST + GHOST_ROUGH * Math.sin(i * 0.41));
        for (const wave of SWELL) {
          reach +=
            height *
            ROOM *
            wave.reach *
            Math.sin(
              along * Math.PI * wave.turns +
                wave.phase +
                t * wave.speed * speed,
            ) **
              2;
        }
        for (const grain of ROUGH) {
          reach += height * ROOM * grain.reach * Math.sin(i * grain.rate);
        }

        const edge = Math.sin(Math.PI * along);
        ctx.strokeStyle = css(sample(GHOST_RGB, along), 0.16 + edge * 0.24);
        ctx.lineWidth = i % 4 === 0 ? 0.9 : 0.6;
        ctx.beginPath();
        ctx.moveTo(x, middle - reach);
        ctx.lineTo(x, middle + reach);
        ctx.stroke();
      }

      /* The pair, one column at a time.

         Both strands are drawn for every thread rather than split between
         them - a twist seen from the side still shows both strands at every
         point along it, one nearer than the other, never one or the other. */
      for (let i = 0; i < COUNT; i += 1) {
        const along = i / (COUNT - 1);
        const x = along * width;
        const middle = ride(along, t);
        const apart = twist(along, t);

        let reach = height * ROOM * FLOOR;
        for (const wave of SWELL) {
          reach +=
            height *
            ROOM *
            wave.reach *
            Math.sin(
              along * Math.PI * wave.turns +
                wave.phase +
                t * wave.speed * speed,
            ) **
              2;
        }
        for (const grain of ROUGH) {
          reach += height * ROOM * grain.reach * Math.sin(i * grain.rate);
        }

        /* Thinned at both ends. An arch rather than a ramp, because the field
           has two ends and both of them should run out. */
        const edge = Math.sin(Math.PI * along);
        const weight = i % 7 === 0 ? 2.1 : i % 3 === 0 ? 1.3 : 0.85;
        const alpha = (0.34 + edge * 0.64) * 0.85;

        /* A struck thread reaches further and burns nearer to white, on the
           same curve rather than as a separate flash - a note that changed
           colour and length on different clocks would read as two things
           happening at once instead of one thread ringing. */
        const rung = ringing(i, t);

        /** One strand: its own centre, its own colour, its own dot. */
        const strand = (centre: number, at: number) => {
          ctx.strokeStyle = glow(sample(RAMP_RGB, at), alpha, rung);
          ctx.lineWidth = weight * (1 + rung * 0.7);
          ctx.beginPath();
          ctx.moveTo(x, centre - reach * (1 + rung * 0.85));
          ctx.lineTo(x, centre + reach * (1 + rung * 0.85));
          ctx.stroke();

          /* A dot on some of the tips. It is the one thing here that is not a
             thread, and it is what stops the tallest reading as scratches. */
          if (i % 5 === 0 || i % 11 === 0) {
            const dot = (i % 11 === 0 ? 1.35 : 0.92) * (1 + rung * 0.6);
            const tip = reach * (1 + rung * 0.85);
            ctx.fillStyle = css(sample(RAMP_RGB, at), 0.35 + edge * 0.55);
            ctx.beginPath();
            ctx.arc(x, centre - tip, dot, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, centre + tip, dot * 0.9, 0, Math.PI * 2);
            ctx.fill();
          }
        };

        const centreA = middle + apart;
        const centreB = middle - apart;

        /* Whichever strand `apart` put on the far side is the one drawn
           second, in front - and that swaps every time `apart` crosses
           nought, which with `TWIST`'s own frequency is many times along the
           field rather than the three or four the swell alone crossed at.
           Column by column rather than strand by strand, or one of the two
           would sit in front of the other along the whole field instead of
           only half it. */
        if (apart >= 0) {
          strand(centreB, 1 - along);
          strand(centreA, along);
        } else {
          strand(centreA, along);
          strand(centreB, 1 - along);
        }
      }

      /* And the one line through the middle of the pair.

         `ride` alone, with no twist added - the swell is what this traces,
         and the swell does not twist, the pair around it does. A spine that
         wobbled at the twist's own frequency would be the fast crossing drawn
         a second time, thicker and brighter, rather than the one slow curve
         the whole field is bent to.

         Four passes, widest and faintest first, which is a glow without a
         blur filter - at this width four strokes is cheaper than asking the
         canvas for one. Near-white rather than coloured, because everything
         it crosses is coloured and a light line is the only mark that reads
         at every point along it. */
      const path = () => {
        ctx.beginPath();
        for (let n = 0; n <= 320; n += 1) {
          const along = n / 320;
          const x = along * width;
          const y = ride(along, t);
          if (n === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      };

      for (const pass of [
        { wide: 14, tint: "142,241,255", alpha: 0.13 },
        { wide: 7, tint: "216,253,255", alpha: 0.3 },
        { wide: 3.7, tint: "255,255,255", alpha: 0.9 },
        { wide: 1.2, tint: "247,255,255", alpha: 0.95 },
      ]) {
        ctx.strokeStyle = `rgba(${pass.tint},${pass.alpha})`;
        ctx.lineWidth = pass.wide;
        path();
        ctx.stroke();
      }

      /* The ends given away, by erasing rather than by painting.

         It used to fill the two ends with the page's own grey, which meant this
         drawing had to know what colour the page behind it was - and it had the
         wrong one, so both ends came out as pale rectangles laid over a slightly
         darker ground. `destination-out` takes the alpha away instead: the
         threads simply stop existing towards the edges and whatever is behind
         shows through, on any page and any colour. */
      ctx.globalCompositeOperation = "destination-out";
      const fade = ctx.createLinearGradient(0, 0, width, 0);
      fade.addColorStop(0, "rgba(0,0,0,1)");
      fade.addColorStop(0.05, "rgba(0,0,0,0.72)");
      fade.addColorStop(0.12, "rgba(0,0,0,0)");
      fade.addColorStop(0.88, "rgba(0,0,0,0)");
      fade.addColorStop(0.95, "rgba(0,0,0,0.72)");
      fade.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = (now: number) => {
      const gap = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      clock += gap;
      draw(clock);
      frame = requestAnimationFrame(tick);
    };

    const run = () => {
      cancelAnimationFrame(frame);
      if (still.matches || !seen) {
        draw(clock);
        return;
      }
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const size = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(clock);
    };

    const bounds = new ResizeObserver(size);
    bounds.observe(wrap);

    /* Off the screen, it stops. */
    const eye = new IntersectionObserver(
      (entries) => {
        seen = entries[0]?.isIntersecting ?? true;
        run();
      },
      { threshold: 0 },
    );
    eye.observe(wrap);

    /* One column at a time, the same map `draw` itself uses - `along` from the
       pointer's own position rather than from a separate count of somewhere
       else, or the thread struck would drift from the thread under the
       cursor the day either number changes.

       Only on crossing into a new one, so resting on a thread does not pluck
       it every pointer event a browser happens to send while it sits still. */
    const onPointer = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const along = (event.clientX - rect.left) / rect.width;
      const at = Math.round(along * (COUNT - 1));
      if (at < 0 || at >= COUNT || at === lastAt) return;
      lastAt = at;
      pluck(at, 0.85);
    };

    const onLeave = () => {
      lastAt = -1;
    };

    wrap.addEventListener("pointermove", onPointer);
    wrap.addEventListener("pointerleave", onLeave);

    still.addEventListener("change", run);
    size();
    run();

    return () => {
      cancelAnimationFrame(frame);
      bounds.disconnect();
      eye.disconnect();
      wrap.removeEventListener("pointermove", onPointer);
      wrap.removeEventListener("pointerleave", onLeave);
      still.removeEventListener("change", run);
    };
  }, [speed]);

  return (
    <div className={className}>
      <div
        ref={box}
        aria-hidden
        className="relative w-full"
        /* Height off the width rather than the window's.

           The threads are placed across the width and their heights are a share
           of the box, so a box measured against the window changed the cloth's
           proportions every time somebody resized: tall and empty on a short
           wide screen, cramped on a tall narrow one. */
        style={{ height: "clamp(190px, 23vw, 320px)" }}
      >
        <canvas ref={sheet} className="block h-full w-full" />
      </div>
    </div>
  );
}
