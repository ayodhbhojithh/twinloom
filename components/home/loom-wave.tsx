"use client";

import { useCallback, useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   The loom, as a sheaf of threads under one slow wave.

   Sixty smooth curves, every one the same wave at a different phase, spread
   evenly round a full turn and drawn over a travelling swell. Nothing here is
   an outline: where the curves are turning they crowd together and where they
   are steepest they spread apart, so the family draws its own bright edges and
   leaves the middle open. The band is a caustic - the same reason a glass of
   water throws a bright rim - and it gathers and thins on its own as the
   envelope moves under it.

   A sheaf rather than columns, and that is the third answer this arrived at.
   It was a field of vertical bars for a long time, ragged with per-thread
   grain and sparse tall spikes; before that a mirrored pair, and before that a
   full double helix with rungs. The bars are the closest relative of this and
   the furthest from it in one respect that decides everything: grain. Bars
   want it, because a bar is its own object and a neighbour that jumps reads as
   texture. Curves cannot have it at all - consecutive samples along one curve
   land on unrelated parts of any per-index noise, and a curve that jumps is
   not textured, it is a zigzag. Smoothness here is not a setting; it is the
   absence of anything varying faster than the eye follows.

   It plays, the way an earlier version did. That one wove a word out of its
   threads and struck a note for every one a pointer crossed; the word is gone
   but the instrument is not - crossing the field still plucks it and still
   sounds a note, on the same synthesised string. What is different is what is
   being played: there, a shape holding still until touched; here, a shape
   already moving, so a pluck is added to a swing rather than started from rest.

   A strike widens the sheaf rather than lighting it. The width swings at a
   rate that rises with the note, the way a shorter string flutters faster; the
   strike spreads outward thread by thread rather than arriving everywhere at
   once, so a pluck is a ripple leaving the point it happened at; and while
   anything is ringing the centre line's glow widens a little, the way a room
   is brighter while something in it is sounding. The swing runs on the drawing
   clock rather than on the strike's age, so re-striking a live column changes
   how far it swings and never where in the swing it is.

   The envelope is locked to the swell's own primary wave: sin² of the same
   phase, so the ribbon opens over every crest and every trough and draws in
   between them. One smaller free voice over it keeps the lobes from coming out
   machined - and a floor under both keeps the narrowest part a waist rather
   than a knot. Both voices are squared and so both reach nought, and where
   they coincide the family would have nothing to multiply: every curve on one
   y, the ribbon shut to a point with a cusp either side. `ENV.floor` is what
   makes that impossible.
--------------------------------------------------------------------------- */

/** How finely the pluck is resolved across the width.

    Not a count of anything drawn any more - the sheaf has its own `lines`
    and `samples`. This is the grid a pointer is snapped to and notes are
    picked from, so it is still the resolution of the instrument. */
const COUNT = 315;

/** Where the middle of the sheaf sits, as a share of the height. */
const CENTRE = 0.5;

/** The swell: one fast wave and one slow, both as shares of the height. */
const RIDE = [
  { reach: 0.069, turns: 9, phase: -0.75, speed: 0.14 },
  { reach: 0.027, turns: 2.55, phase: 0.6, speed: -0.085 },
] as const;

/**
 * The envelope: how wide the sheaf opens, along the width.
 *
 * `main` is not a wave of its own - it is sin² of the swell's primary wave,
 * same turns, same phase, same speed. Locked together like that the ribbon
 * opens over every crest and every trough and draws in between them, which
 * is a wave breathing. A free-running envelope put its lobes wherever its
 * own phase happened to fall, and the band wandered off the line it is
 * supposed to belong to.
 *
 * `cluster` is the one free voice over it, kept small, so the lobes are not
 * machined copies of each other.
 */
const ENV = {
  /* The width the ribbon keeps at its narrowest, and it must never be nought.
     Without it the two envelope voices can both land on zero at the same
     place, every curve in the family meets, and the ribbon collapses to a
     single point - a hard node with a cusp either side of it, which is the one
     thing a smooth wave cannot have. It is also the one place the whole
     picture is a line rather than a band. A waist is the ribbon seen edge on;
     a point is the ribbon gone. */
  floor: 0.085,
  main: 0.29,
  cluster: { reach: 0.07, turns: 12.4, phase: 1.5, speed: -0.07 },
} as const;

/**
 * How a struck thread rings.
 *
 * `spread` is seconds per thread: a strike reaches its neighbours late, so a
 * pluck is a ripple leaving a point rather than a patch lighting up at once.
 * `fade` is how fast the ring dies; `flutter` and `flutterRise` are the
 * visible vibration in cycles a second, rising left to right the way pitch
 * does - a thread flutters at a rate that agrees with the note it plays.
 */
const PLUCK = {
  spread: 0.018,
  fade: 2.1,
  /* Slow enough to read as a swing rather than a shudder.
     It was 3.2 rising to 6.6, which is six and a half full cycles a second on
     a column a couple of hundred pixels tall - past the rate an eye follows a
     shape and into the rate it reads as noise. Halved, a strike is one clear
     swing out and back per note instead of a blur. */
  flutter: 1.5,
  flutterRise: 1.3,
} as const;

/* No roughness and no spikes.

   Both were `sin(i * rate)` - a value per thread. That is grain while the
   picture is three hundred separate columns, and it cannot survive the picture
   becoming sixty continuous curves: consecutive samples along one curve would
   land on unrelated parts of those sines and the curve would come out as a
   zigzag. What made the column field look real is exactly what would stop
   these being smooth. */

/**
 * The sheaf: how many curves, how finely each is drawn, and how it turns.
 *
 * `lines` is the density of the caustic - too few and the crowding at the
 * edges reads as separate strokes, too many and the whole band fills in and
 * there is nothing left to see through. `turns` is how many times the family
 * winds across the width, which is what makes the ribbon appear to twist.
 *
 * `samples` is per curve, so the cost here is `lines * samples` line segments
 * a frame. Sixty by a hundred and sixty is under ten thousand, which a canvas
 * does without noticing - and it is the reason the ramp is one gradient built
 * once a frame rather than a colour per segment.
 */
const RIBBON = {
  lines: 60,
  samples: 160,
  turns: 5.5,
  speed: 0.32,
  weight: 0.85,
  alpha: 0.3,
} as const;

/**
 * The bar field's own numbers, which the sheaf has no use for.
 *
 * `ROUGH` and `SPIKE` are indexed by column rather than by position, and that
 * is exactly why they belong to one version and not the other. Per-column
 * noise is grain when every column is its own object, and a zigzag the moment
 * the picture is continuous curves - so the two versions are not one drawing
 * with a flag, they are two drawings that happen to ride the same wave.
 *
 * `SPIKE` is the tail the roughness cannot give: a sum of sines is bounded and
 * spends its life near the middle of its range, so it makes a fuzzy edge and
 * never a few threads standing well clear of the rest. A sine raised high
 * enough is nothing almost everywhere and briefly everything, which is what a
 * spike is. Even, so it can only ever add - a spike that could subtract would
 * dig a hole in the field.
 */
const BAR = {
  /* The height every column keeps, and it has to beat the roughness.
     The roughness is signed - it takes away as readily as it adds - so the
     shortest a column can be is this less the sum of it. At 0.115 against a
     roughness summing to 0.149 that number was negative: the floor was
     cancelled outright and the clamp below caught the bar at a pixel, which
     is the field going out where the wave is quiet. Comfortably over the sum
     now, so the shortest column is short rather than gone. */
  floor: 0.185,
  rough: [
    { reach: 0.04, rate: 0.7 },
    { reach: 0.03, rate: 1.87 },
    { reach: 0.022, rate: 4.31 },
    { reach: 0.016, rate: 9.13 },
  ],
  /* And a backstop under all of it, as a share of the height rather than the
     one pixel it was. `floor` beating `rough` is an arithmetic relationship
     between two tables, and tables get edited; this is the guarantee that
     survives someone adding a fifth voice without checking the sum. */
  min: 0.05,
  spike: { reach: 0.2, rate: 2.9, sharpness: 14 },
  /** The pale taller field drawn behind, so the band has something to stand
      in front of. One layer of threads is a graph; two is a picture of one. */
  ghost: 0.092,
  ghostRough: 0.038,
} as const;

/**
 * How much of the box each version is allowed.
 *
 * Not a number somebody picked. Every vertical figure above is a share of the
 * height, and at their worst they all land at the same place along the width.
 * Summed unchecked that comes to more than half the box, and the widest part
 * of the drawing is sliced flat against the top edge.
 *
 * Setting a scale by hand fixes it until the next time one of those tables
 * changes. Adding them up fixes it for good: each `ROOM` is whatever makes its
 * own worst case fit inside `SAFE`, and no table above can be edited into
 * clipping the picture again.
 *
 * Two of them, because the two versions have genuinely different worst cases -
 * the bars carry roughness, a spike and a ghost layer on top of the same
 * envelope. One shared number would have to budget for the bars and would
 * leave the sheaf drawn at two thirds the size it could be.
 *
 * The pluck's stretch is deliberately outside both. Budgeting for it would
 * narrow everything by a third to reserve room for a peak that lasts a
 * fraction of a second where somebody is touching it - a struck string
 * overshoots, and a curve brushing the edge of the box mid-ring is the
 * overshoot showing, not the layout failing.
 */
const SAFE = 0.47;
const SWELL = RIDE.reduce((n, wave) => n + wave.reach, 0);
const LOBES = ENV.main + ENV.cluster.reach;

const ROOM_SHEAF = SAFE / (SWELL + ENV.floor + LOBES);
const ROOM_BARS =
  SAFE /
  (SWELL +
    BAR.floor +
    LOBES +
    BAR.rough.reduce((n, grain) => n + grain.reach, 0) +
    BAR.spike.reach +
    BAR.ghost +
    BAR.ghostRough);

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

/** The pale field standing behind the bars. */
const GHOST_RAMP = [
  [0, "#a8b8ff"],
  [0.28, "#879bd7"],
  [0.5, "#96e5ff"],
  [0.75, "#8ab0da"],
  [1, "#9fe5d2"],
] as const;

/* The colour arithmetic below belongs to the bar version alone.

   The sheaf has none of it: a family of curves shares one horizontal gradient
   built straight from `RAMP` once a frame, so the canvas reads the ramp rather
   than us, and a strike changes how far a curve swings rather than what colour
   it is. Six hundred columns cannot do that - a polyline takes one stroke
   colour, and a column is one stroke - so the bars read their own colour per
   column and need the ramp as numbers to do it. */

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

/**
 * The ramp again, pulled most of the way to a deep navy - the tips.
 *
 * Precomputed as a second ramp rather than mixed per stroke: six hundred
 * strokes a frame each doing three multiplies for a colour that never changes
 * is arithmetic thrown away sixty times a second.
 */
const INK_DEEP: Rgb = [10, 18, 46];
const DIM_RGB = RAMP_RGB.map(
  ([at, c]) =>
    [
      at,
      [
        c[0] + (INK_DEEP[0] - c[0]) * 0.62,
        c[1] + (INK_DEEP[1] - c[1]) * 0.62,
        c[2] + (INK_DEEP[2] - c[2]) * 0.62,
      ] as const,
    ] as const,
);

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

/**
 * Which drawing rides the wave.
 *
 * `sheaf` is sixty smooth curves whose crowding draws its own edges; `bars` is
 * a field of separate columns with per-column grain and a pale layer behind.
 * They share the swell, the envelope, the instrument and the fade, and differ
 * in the one place that cannot be shared - what a column may do and a curve may
 * not, which is jump.
 */
export type WaveVariant = "sheaf" | "bars";

export function LoomWave({
  className,
  speed = 1,
  variant = "sheaf",
}: {
  className?: string;
  speed?: number;
  variant?: WaveVariant;
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
    /* Where the box starts across the window, cached by `size` rather than
       measured on every pointer move - see there for why. */
    let atLeft = 0;
    /* The last moment a note actually sounded, in milliseconds. A fast sweep
       crosses several threads inside one frame, and every one of them starting
       an oscillator pair is a burst of clicks rather than a run of notes - the
       visual strike still lands on all of them, only the sound is thinned. */
    let lastNote = 0;
    /* How much of the field is ringing at all, for the centre line's glow.
       Lifted by every strike, dying on its own clock in `tick`. */
    let energy = 0;

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

    /** How much a thread is ringing right now, from nought to one. Nought as
        well before its strike has arrived - `spread` sets each neighbour's
        `struck` a little into the future, and a ripple is exactly a strike
        that has not reached everywhere yet. */
    const ringing = (at: number, t: number) => {
      const age = t - struck[at];
      return age < 0 ? 0 : force[at] * Math.exp(-age * PLUCK.fade);
    };

    /**
     * What a strike does to a column's height, as a multiplier.
     *
     * A struck thread swings wider and narrower rather than simply growing.
     * The envelope decides how much and a cosine decides which way this frame,
     * at a rate that rises with the note the column carries. The colour takes
     * the envelope alone - brightness dying smoothly while the height
     * oscillates is one event with two faces, where a colour flickering on the
     * same clock would read as the thread blinking.
     *
     * The cosine runs on the drawing clock, not on the strike's age, and that
     * is the whole of why this stopped flickering. Measured from the strike,
     * the phase jumped every time a column was re-struck - and a pointer
     * crossing the field re-strikes forty columns several times a second, so
     * the wobble was being restarted from a new place faster than one cycle
     * could finish. On the clock it simply keeps turning: a strike changes how
     * far a column swings, never where in the swing it is.
     *
     * The per-column offset is what stops the whole field breathing in
     * lockstep, which is what a single global phase would give.
     */
    const ringStretch = (at: number, t: number, along: number) => {
      const rung = ringing(at, t);
      if (rung <= 0.02) return 1;
      const wobble = Math.cos(
        t * Math.PI * 2 * (PLUCK.flutter + along * PLUCK.flutterRise) +
          at * 0.7,
      );
      return 1 + rung * (0.34 + 0.3 * wobble);
    };

    /**
     * Pluck a thread, and the spread either side of it a little less and a
     * little later.
     *
     * Later is what makes it a ripple: each neighbour's strike is stamped
     * `spread` seconds further into the future per thread of distance, so the
     * disturbance visibly leaves the point it happened at instead of a patch
     * of field lighting up as one block.
     *
     * Visual and audible, and only the one that was actually crossed sounds a
     * note - its neighbours ring because cloth is connected, not because they
     * were each struck in turn, which is what a chord sweeping across the
     * field would sound like instead of a single line being drawn along it.
     */
    const pluck = (at: number, amount: number) => {
      for (let off = -20; off <= 20; off += 1) {
        const near = at + off;
        if (near < 0 || near >= COUNT) continue;
        const share = amount * (1 - Math.abs(off) / 21) ** 1.7;
        if (share <= 0.01) continue;

        /* What this column is doing right now, which is the only thing the new
           strike may be compared against.

           It was compared against `force`, and `force` is the value a column
           was struck at rather than the value it has reached - by the time a
           neighbour is re-struck the ring has decayed well below it. So the
           `max` was picking a number that could sit under what was on screen,
           and the column stepped down. A ring that drops when it is struck is
           the flinch that read as flicker. */
        const cur = ringing(near, clock);

        if (cur <= 0.02) {
          /* Quiet, so it takes the delay and rings from nothing. The delay is
             the ripple: each thread out from the middle starts a little later,
             so the disturbance leaves the point it happened at. */
          struck[near] = clock + Math.abs(off) * PLUCK.spread;
          force[near] = share;
        } else if (share > cur) {
          /* Already ringing, so it is topped up where it stands and never
             delayed. Pushing a live column's strike into the future would make
             `ringing` read it as not yet arrived and drop it to nothing until
             the new one landed - a hole in the middle of a note, which is the
             other half of the flicker. */
          struck[near] = clock;
          force[near] = share;
        }
      }

      energy = Math.min(1, energy + 0.3);

      const kit = audio.current;
      if (!kit || kit.ctx.state !== "running") return;

      const nowMs = performance.now();
      if (nowMs - lastNote < 28) return;
      lastNote = nowMs;

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

    /* Whichever version's scale this is. Both are bounded against `SAFE`;
       picking here means everything below reads one number. */
    const ROOM = variant === "bars" ? ROOM_BARS : ROOM_SHEAF;

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

    /**
     * How wide the ribbon opens here: the floor, the lobe locked to the
     * swell's primary wave, and the one free cluster over it.
     *
     * Nothing indexed by column any more. The roughness and the spike were
     * `sin(i * rate)` - a value per thread, which is grain when the picture is
     * three hundred separate columns and nonsense when it is sixty continuous
     * curves: neighbouring samples on one curve would jump, and a curve that
     * jumps is not smooth, it is a zigzag. Smoothness here is not a setting,
     * it is the absence of anything that varies faster than the eye follows.
     *
     * `ENV.floor` is under all of it and is not optional. Both voices are
     * squared, so both are nought at their own crossings, and where those
     * coincide the sum is nought as well - the family has nothing to multiply,
     * every curve lands on the same y, and the ribbon shuts to a point. The
     * floor is what keeps the narrowest part a waist rather than a knot.
     */
    const envAt = (along: number, t: number) => {
      const main = Math.sin(
        along * Math.PI * RIDE[0].turns +
          RIDE[0].phase +
          t * RIDE[0].speed * speed,
      );
      const free = Math.sin(
        along * Math.PI * ENV.cluster.turns +
          ENV.cluster.phase +
          t * ENV.cluster.speed * speed,
      );

      return (
        height *
        ROOM *
        (ENV.floor + ENV.main * main * main + ENV.cluster.reach * free * free)
      );
    };

    /**
     * How tall one column stands: the same envelope, plus everything a column
     * may have and a curve may not.
     *
     * The lobes are shared with the sheaf on purpose - both versions are the
     * same wave breathing, and only the way it is drawn changes. What is added
     * here is all indexed by column: four roughnesses so the tips are ragged
     * rather than swept, and the spike so a few stand right out.
     */
    const barAt = (along: number, i: number, t: number) => {
      const main = Math.sin(
        along * Math.PI * RIDE[0].turns +
          RIDE[0].phase +
          t * RIDE[0].speed * speed,
      );
      const free = Math.sin(
        along * Math.PI * ENV.cluster.turns +
          ENV.cluster.phase +
          t * ENV.cluster.speed * speed,
      );

      let reach =
        height *
        ROOM *
        (BAR.floor + ENV.main * main * main + ENV.cluster.reach * free * free);

      for (const grain of BAR.rough) {
        reach += height * ROOM * grain.reach * Math.sin(i * grain.rate);
      }

      reach +=
        height *
        ROOM *
        BAR.spike.reach *
        Math.sin(i * BAR.spike.rate) ** BAR.spike.sharpness;

      /* Never shorter than `BAR.min`. The waists are pinched, not cut: a
         column that vanished would leave a hole in the field, and a row of
         columns with holes in it is not a wave, it is a gap with bars either
         side. */
      return Math.max(reach, height * ROOM * BAR.min);
    };

    /**
     * How many of the three hundred threads are actually drawn.
     *
     * The count is fixed because the grain is indexed by it - a field that
     * changed its count with the window would change its texture every time
     * somebody dragged an edge. But three hundred columns across a phone is
     * a column every pixel and a quarter, which is not a field of threads,
     * it is a wash. Drawing every second or third one keeps the texture the
     * same and gives it room: the threads that are drawn stand where they
     * always stood, with the ones between them left out.
     *
     * Six pixels a thread is about where a stroke and its gap both read.
     */
    const everyNth = () => Math.max(1, Math.round(COUNT / (width / 6)));

    /** The bar field: one column per thread, standing on the line. */
    const drawBars = (t: number) => {
      const step = everyNth();

      /* The pale layer first, taller and thinner, so the field in front has
         something to stand against rather than sitting on the page. */
      for (let i = 0; i < COUNT; i += step) {
        const along = i / (COUNT - 1);
        const x = along * width;
        const middle = ride(along, t);
        const reach =
          barAt(along, i, t) +
          height * ROOM * (BAR.ghost + BAR.ghostRough * Math.sin(i * 0.41));

        const edge = Math.sin(Math.PI * along);
        ctx.strokeStyle = css(sample(GHOST_RGB, along), 0.16 + edge * 0.24);
        ctx.lineWidth = i % 4 === 0 ? 0.9 : 0.6;
        ctx.beginPath();
        ctx.moveTo(x, middle - reach);
        ctx.lineTo(x, middle + reach);
        ctx.stroke();
      }

      /* Then the field. Each column is drawn twice: its whole length in the
         ramp pulled most of the way to navy, then its middle half again in the
         ramp itself - so the light hugs the line and the reach away from it
         goes dark, which is one column doing what a gradient per column would
         cost six hundred gradients a frame to do. */
      for (let i = 0; i < COUNT; i += step) {
        const along = i / (COUNT - 1);
        const x = along * width;
        const middle = ride(along, t);
        const reach = barAt(along, i, t) * ringStretch(i, t, along);

        /* Thinned at both ends. An arch rather than a ramp, because the field
           has two ends and both of them should run out. */
        const edge = Math.sin(Math.PI * along);
        const rung = ringing(i, t);
        const weight = i % 7 === 0 ? 2.1 : i % 3 === 0 ? 1.3 : 0.85;
        const alpha = (0.34 + edge * 0.64) * 0.85;

        ctx.lineWidth = weight * (1 + rung * 0.7);

        ctx.strokeStyle = glow(sample(DIM_RGB, along), alpha * 0.9, rung);
        ctx.beginPath();
        ctx.moveTo(x, middle - reach);
        ctx.lineTo(x, middle + reach);
        ctx.stroke();

        ctx.strokeStyle = glow(
          sample(RAMP_RGB, along),
          Math.min(1, alpha * 1.2),
          rung,
        );
        ctx.beginPath();
        ctx.moveTo(x, middle - reach * 0.52);
        ctx.lineTo(x, middle + reach * 0.52);
        ctx.stroke();

        /* A dot on some of the tips. It is the one thing here that is not a
           thread, and it is what stops the tallest reading as scratches. */
        if (i % 5 === 0 || i % 11 === 0) {
          const dot = (i % 11 === 0 ? 1.35 : 0.92) * (1 + rung * 0.6);
          ctx.fillStyle = css(sample(DIM_RGB, along), 0.4 + edge * 0.5);
          ctx.beginPath();
          ctx.arc(x, middle - reach, dot, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, middle + reach, dot * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    /* The per-column scratch, allocated once and written over every frame.

       Sized to the most samples the sheaf can ever ask for, so a resize never
       reallocates - and a frame that only needs the first eighty of them just
       reads the first eighty. Five arrays of a hundred and sixty floats is
       nothing to hold; five arrays a frame is work for the collector. */
    const atX = new Float32Array(RIBBON.samples + 1);
    const atY = new Float32Array(RIBBON.samples + 1);
    const atAmp = new Float32Array(RIBBON.samples + 1);
    const atSin = new Float32Array(RIBBON.samples + 1);
    const atCos = new Float32Array(RIBBON.samples + 1);

    /* And the centre line's own, walked once a frame and stroked six times. */
    const spineX = new Float32Array(201);
    const spineY = new Float32Array(201);

    /** The sheaf: sixty smooth curves whose crowding is the picture. */
    const drawSheaf = (t: number) => {
      /* The ribbon: one family of curves, not a row of columns.

         Every line is the same wave at a different phase, spread evenly round
         a full turn. Where the sines are turning they crowd together and where
         they are steepest they spread apart, so the family draws its own dense
         edges and leaves the middle open - and that is the whole picture. The
         bunching is a caustic, the same reason a glass of water throws a bright
         rim: it is the density of curves, not a line anybody drew.

         It is why this is a family and not one thick stroke. A band with a
         drawn edge is a shape; a band whose edge is where the curves happen to
         pile up is a wave, and it thins and gathers on its own as the envelope
         moves under it.

         Where the envelope pinches, every curve in the family meets - the
         sines all have nothing to multiply - so the ribbon closes to a point
         and opens again with its phases running the other way. That is the
         twist in the reference, and nothing draws it: it falls out of an
         envelope that reaches nought.

         One gradient for all of them, built once a frame across the width. A
         polyline takes a single stroke colour, so the alternative to this is
         either a flat ribbon or a stroke per segment - and a stroke per
         segment is sixty times a hundred and sixty of them. */
      const paint = ctx.createLinearGradient(0, 0, width, 0);
      for (const [at, hex] of RAMP) paint.addColorStop(at, hex);

      ctx.strokeStyle = paint;
      ctx.lineWidth = RIBBON.weight;

      /* Fewer curves and fewer points on a narrow box.

         The caustic is the crowding, and crowding needs somewhere to
         crowd: sixty curves in a band a couple of hundred pixels tall is
         a solid, and a solid has no bright edge because every part of it
         is the edge. Thinning the family keeps the same shape and lets the
         light back into it.

         The samples come down with them because a curve drawn across four
         hundred pixels cannot show a hundred and sixty of anything - that
         is two points a pixel, and every one of them is a line segment a
         frame. */
      const lines = Math.max(
        24,
        Math.round(RIBBON.lines * Math.min(1, width / 900)),
      );
      const samples = Math.max(
        72,
        Math.round(Math.min(RIBBON.samples, width / 5)),
      );

      /* The column, worked out once for the whole family.

         Every curve is sampled at the same places along the width, and the
         swell, the envelope and the ring depend on the place and the moment -
         not on which curve. Inside the loop they were being recomputed for
         each of sixty curves: the same answer, sixty times, about sixty
         thousand sines a frame. That is what made this stutter, and it is why
         the notes arrived late as well - the two share a thread, and a frame
         that overruns delays whatever the pointer was about to do next.

         The phase is split rather than stored whole, because
         `sin(p + turn)` opens into `sin p cos turn + cos p sin turn`. Both
         halves of the phase are per-column and both parts of the turn are
         per-curve, so with all four precomputed the inner loop has no
         trigonometry in it at all - a multiply and an add. */
      const spin = t * RIBBON.speed * speed;

      for (let n = 0; n <= samples; n += 1) {
        const along = n / samples;
        /* The pluck reaches the ribbon through the same column map the notes
           use, so the bulge lands under the pointer rather than somewhere the
           maths happened to put it. */
        const i = Math.round(along * (COUNT - 1));
        const phase = along * Math.PI * RIBBON.turns + spin;

        atX[n] = along * width;
        atY[n] = ride(along, t);
        atAmp[n] = envAt(along, t) * ringStretch(i, t, along);
        atSin[n] = Math.sin(phase);
        atCos[n] = Math.cos(phase);
      }

      for (let k = 0; k < lines; k += 1) {
        /* Round a full turn, so the family covers every phase once. Any less
           and the band has a gap in it; any more and lines land on each other
           and the crowding stops meaning anything. */
        const turn = (k / lines) * Math.PI * 2;
        const turnSin = Math.sin(turn);
        const turnCos = Math.cos(turn);

        /* Thinner and fainter towards the outside of the sheaf, which is what
           gives it a near face and a far one rather than reading as flat. */
        const across = Math.sin((k / lines) * Math.PI);
        ctx.globalAlpha = RIBBON.alpha * (0.35 + across * 0.65);

        ctx.beginPath();
        for (let n = 0; n <= samples; n += 1) {
          const y =
            atY[n] + atAmp[n] * (atSin[n] * turnCos + atCos[n] * turnSin);
          if (n === 0) ctx.moveTo(atX[n], y);
          else ctx.lineTo(atX[n], y);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      if (width < 2 || height < 2) return;

      ctx.lineCap = "round";

      if (variant === "bars") drawBars(t);
      else drawSheaf(t);

      /* And the one line through the middle of the pair.

         `ride` alone, with no twist added - the swell is what this traces,
         and the swell does not twist, the pair around it does. A spine that
         wobbled at the twist's own frequency would be the fast crossing drawn
         a second time, thicker and brighter, rather than the one slow curve
         the whole field is bent to.

         Six passes, widest and faintest first, and none of them blurred.

         Two of them were, using `shadowBlur` for a real gaussian, and it is
         the reason this stuttered. A canvas shadow is not a local effect: it
         composites the whole backing store once per stroke, and at two strokes
         a frame on a canvas the width of a window that is most of the frame
         budget on its own - which is felt as the animation dragging and as
         notes arriving late, because the drawing and the pointer share a
         thread.

         Stacked strokes are the cheap way and the objection to them was real:
         a wide translucent stroke has an edge, and four of them read as a line
         with rings round it. Six with the widths close together and the alpha
         falling smoothly do not - the steps land inside each other and what is
         left is a gradient. It is a fake gaussian, and at this width nobody
         can tell it from the real one.

         The path is sampled once and reused for all six, rather than walked
         six times. `ride` is two sines a point and this was calling it just
         under two thousand times a frame to draw the same line repeatedly.

         Pale cyan rather than pure white. Everything it crosses is coloured,
         and a white line over a blue field reads as a gap in the field; the
         palest end of the mark's own teal reads as light on it. */
      const SPINE = 200;
      for (let n = 0; n <= SPINE; n += 1) {
        const along = n / SPINE;
        spineX[n] = along * width;
        spineY[n] = ride(along, t);
      }

      const path = () => {
        ctx.beginPath();
        ctx.moveTo(spineX[0], spineY[0]);
        for (let n = 1; n <= SPINE; n += 1) ctx.lineTo(spineX[n], spineY[n]);
      };

      for (const pass of [
        { wide: 15, tint: "142,241,255", alpha: 0.05, soft: true },
        { wide: 11, tint: "160,244,255", alpha: 0.07, soft: true },
        { wide: 7.5, tint: "196,250,255", alpha: 0.1, soft: true },
        { wide: 4.6, tint: "224,253,255", alpha: 0.18, soft: true },
        { wide: 2.6, tint: "236,255,255", alpha: 0.75, soft: false },
        { wide: 1.1, tint: "247,255,255", alpha: 0.95, soft: false },
      ]) {
        /* The glow answers the playing; the core does not. While anything is
           ringing the soft outer passes widen and brighten a little, the way a
           room holds the light of a sound - and the line itself stays the same
           line, because the swell has not changed, only the field ringing
           around it. */
        const halo = pass.soft ? 1 + energy * 0.4 : 1;
        ctx.strokeStyle = `rgba(${pass.tint},${Math.min(1, pass.alpha * halo)})`;
        ctx.lineWidth = pass.wide * halo;
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
      /* Slower than the threads' own fade, so the halo lingers a moment after
         the last thread has settled - an echo, not a light switch. */
      energy *= Math.exp(-gap * 1.6);
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
      /* Kept for the pointer, which used to ask for this itself on every
         move. Reading a rect forces the browser to settle layout before it
         can answer, and a pointer reports far more often than a frame is
         drawn - so a sweep across the field was demanding a reflow a hundred
         times a second, on the same thread as the drawing and the notes.

         Only the left edge and the width matter, and neither changes without
         a resize - which is precisely when this runs. Scrolling moves the top
         and nothing here reads it. */
      atLeft = rect.left;
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
      if (width < 2) return;
      const along = (event.clientX - atLeft) / width;
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
    /* `variant` is in here and has to be: the draw closes over it, and the
       whole loop is built once when this effect runs. Left out, switching
       version would leave the old drawing running until something else
       happened to tear the effect down. */
  }, [speed, variant]);

  return (
    <div className={className}>
      <div
        ref={box}
        aria-hidden
        /* The crosshair is the one hint that this is an instrument rather
           than a picture - a label saying "play me" would be the wrong kind
           of louder. */
        className="relative w-full cursor-crosshair"
        /* Height off the width rather than the window's.

           The threads are placed across the width and their heights are a share
           of the box, so a box measured against the window changed the cloth's
           proportions every time somebody resized: tall and empty on a short
           wide screen, cramped on a tall narrow one.

           The floor is what a phone actually gets, because 23vw is under a
           hundred there and the clamp pins it. At 190 the wave was half as
           tall again as it needed to be against a 335 wide field; 140 keeps
           the same proportion it has on a desk. */
        style={{ height: "clamp(140px, 23vw, 320px)" }}
      >
        <canvas ref={sheet} className="block h-full w-full" />
      </div>
    </div>
  );
}
