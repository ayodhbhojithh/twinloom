"use client";

import { useCallback, useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   The loom, as a frequency read off a slow wave.

   One row of vertical threads standing on one travelling swell, with a bright
   line drawn along the swell itself. It is a waveform and it is meant to be:
   a loom's warp is a row of parallel threads, and a row of parallel threads
   over a moving line is what this company is named after doing.

   One row, and that is a decision this arrived at twice from the other side.
   It was a mirrored pair for a while, then a full double helix - two
   backbones half a turn apart with rungs between them and the near half drawn
   over the far. Both were built and both came out wrong for the same reason:
   a frequency plot is columns about one axis, and the moment there are two of
   anything the eye starts reading the gap between them instead of the shape
   they make. The shape is the whole picture.

   It plays, the way an earlier version did. That one wove a word out of its
   threads and struck a note for every one a pointer crossed; the word is gone
   but the instrument is not - crossing a thread here still plucks it and still
   sounds a note, on the same synthesised string. What is different is what is
   being played: there, a shape holding still until touched; here, a shape
   already moving, so a pluck is added to a swing rather than started from rest.

   A strike vibrates a thread rather than lighting it. The length flutters at a
   rate that rises with the note the thread carries, the way a shorter string
   flutters faster; the strike spreads outward thread by thread rather than
   arriving everywhere at once, so a pluck is a ripple leaving the point it
   happened at; and while anything is ringing the centre line's glow widens a
   little, the way a room is brighter while something in it is sounding. The
   flutter is drawn from the strike's age each frame rather than accumulated,
   so a dropped frame costs a frame and not the shape of the decay.

   The height is the wave, heard as well as ridden. The envelope deciding how
   tall each column stands is locked to the swell's own primary wave rather
   than free-running: sin² of the same phase puts a lobe on every crest and
   every trough and pinches the field at each crossing, which is what makes
   the picture read as a sound wave rather than as a hedge under a ribbon. A
   smaller free cluster, four per-thread roughnesses and a sparse spike keep
   the lobes from coming out machined.

   The grain matters as much as the envelope. A sum of sines is bounded and
   spends its life near the middle of its range, so roughness alone gives a
   soft edge and never the spikes standing clear of their neighbours that a
   real plot has. Those come from `SPIKE`, which is a sine raised high enough
   that it is nothing almost everywhere and briefly everything.

   And each thread is ink at its tips and lit at its waist. The full length is
   drawn in its ramp colour pulled most of the way to a deep navy, then the
   middle half again on top in the colour itself - so the light hugs the line
   the way it does in a rendered frequency picture, and the reach away from it
   goes dark instead of carrying the same brightness to the tip.

   And there is a ghost layer behind the field, standing taller than it and
   drawn in pale grey-blue, so the band has something to sit in front of. One
   layer of threads is a graph; a backdrop behind it is a picture of one.

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
  { reach: 0.069, turns: 9, phase: -0.75, speed: 0.14 },
  { reach: 0.027, turns: 2.55, phase: 0.6, speed: -0.085 },
] as const;

/* No twist, and nothing that separates a pair.

   There was one, and then a whole helix built on it: two backbones half a
   turn apart with rungs between them and the near half drawn over the far.
   Both are gone for the same reason. A frequency plot is one row of columns
   about one axis - the moment there are two of anything, the eye reads the
   gap between them instead of the shape they make, and the shape is the
   whole picture. */

/**
 * The envelope: a small floor every thread gets, and the lobes over it.
 *
 * `main` is not a wave of its own - it is sin² of the swell's primary wave,
 * same turns, same phase, same speed. Locked together like that, a lobe sits
 * on every crest and every trough and the field pinches to the floor exactly
 * where the line crosses its own centre, which is the shape a sound wave
 * actually has. A free-running envelope put lobes wherever its phase happened
 * to fall, and the picture read as a hedge with a ribbon through it.
 *
 * `cluster` is the one free voice over it, kept small, so the lobes are not
 * machined copies of each other.
 *
 * The floor is what the waists keep, and it was five per cent - near enough
 * to nothing that the field went out between lobes and came back, which is a
 * row of separate tufts rather than one wave that rises and falls. The
 * reference pinches hard and still has short threads all the way through, and
 * that is the difference between a waist and a gap: a waist is the same cloth,
 * narrower.
 */
const FLOOR = 0.115;
const ENV = {
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

/** How much further the ghosts reach than the field in front of them. */
const GHOST = 0.092;
const GHOST_ROUGH = 0.038;

/**
 * How much of the box the ribbon is allowed.
 *
 * Not a number somebody picked. Every vertical figure above is a share of the
 * height, and at their worst they all land at the same place along the width:
 * the swell at its furthest from the middle, and both envelope voices at full.
 * Summed unchecked that came to more than half the box, and the widest part of
 * the sheaf was sliced flat against the top edge.
 *
 * Setting a scale by hand fixes it until the next time one of those tables
 * changes. Adding them up here fixes it for good: `ROOM` is whatever makes the
 * worst case fit inside `SAFE`, and no table above can be edited into clipping
 * the picture again.
 *
 * The pluck's stretch is deliberately outside the sum. Budgeting for it would
 * narrow the resting ribbon by a third to reserve room for a peak that lasts a
 * fraction of a second where somebody is touching it - a struck string
 * overshoots, and a curve brushing the edge of the box mid-ring is the
 * overshoot showing, not the layout failing.
 */
const SAFE = 0.47;
const WORST =
  RIDE.reduce((n, wave) => n + wave.reach, 0) +
  ENV.main +
  ENV.cluster.reach;
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

    /* No `twist` returning a separation any more.

       It gave one number - how far apart the pair is here - which is all a
       mirrored pair needs and not enough for a helix: a ladder also has to
       know which way it is facing. `rail` below takes the same phase and
       reads both off it, `sin` for up the screen and `cos` for how near, and
       the separation falls out as the first of the two. */

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
     * No floor under it either, unlike the column field, which needed one so
     * the waists kept a hair of thread. Here the waists are the point: the
     * envelope reaching nought is what closes the ribbon to a line and lets it
     * open the other way.
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
        (ENV.main * main * main + ENV.cluster.reach * free * free)
      );
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      if (width < 2 || height < 2) return;

      ctx.lineCap = "round";

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

      for (let k = 0; k < RIBBON.lines; k += 1) {
        /* Round a full turn, so the family covers every phase once. Any less
           and the band has a gap in it; any more and lines land on each other
           and the crowding stops meaning anything. */
        const turn = (k / RIBBON.lines) * Math.PI * 2;

        /* Thinner and fainter towards the outside of the sheaf, which is what
           gives it a near face and a far one rather than reading as flat. */
        const across = Math.sin((k / RIBBON.lines) * Math.PI);
        ctx.globalAlpha = RIBBON.alpha * (0.35 + across * 0.65);

        ctx.beginPath();
        for (let n = 0; n <= RIBBON.samples; n += 1) {
          const along = n / RIBBON.samples;
          const x = along * width;

          /* The pluck reaches the ribbon through the same column map the
             notes use, so the bulge lands under the pointer rather than
             somewhere the maths happened to put it. */
          const i = Math.round(along * (COUNT - 1));
          const y =
            ride(along, t) +
            envAt(along, t) *
              ringStretch(i, t, along) *
              Math.sin(
                along * Math.PI * RIBBON.turns +
                  turn +
                  t * RIBBON.speed * speed,
              );

          if (n === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      /* And the one line through the middle of the pair.

         `ride` alone, with no twist added - the swell is what this traces,
         and the swell does not twist, the pair around it does. A spine that
         wobbled at the twist's own frequency would be the fast crossing drawn
         a second time, thicker and brighter, rather than the one slow curve
         the whole field is bent to.

         Four passes, widest and faintest first, and the two soft ones are
         genuinely blurred rather than only wide. A wide translucent stroke has
         an edge, and four of them stacked is four edges - which at a glance is
         a line with rings round it rather than a line that is glowing.
         `shadowBlur` is the canvas's own gaussian: drawn with the stroke
         itself transparent, what lands is the blur and nothing else.

         The blur costs a full-canvas composite per pass, which is why only the
         two soft passes take it and the two sharp ones do not - a crisp core
         gains nothing from being blurred and would lose the crispness that
         makes it the core.

         Pale cyan rather than pure white. Everything it crosses is coloured,
         and a white line over a blue field reads as a gap in the field; the
         palest end of the mark's own teal reads as light on it. */
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
        { wide: 9, tint: "142,241,255", alpha: 0.3, blur: 14 },
        { wide: 5, tint: "216,253,255", alpha: 0.42, blur: 5 },
        { wide: 3.4, tint: "232,255,255", alpha: 0.92, blur: 0 },
        { wide: 1.2, tint: "247,255,255", alpha: 0.95, blur: 0 },
      ]) {
        /* The glow answers the playing; the core does not. While anything is
           ringing the two soft outer passes widen and brighten a little, the
           way a room holds the light of a sound - and the line itself stays
           the same line, because the swell has not changed, only the field
           ringing around it. */
        const halo = pass.blur ? 1 + energy * 0.4 : 1;
        const paint = `rgba(${pass.tint},${Math.min(1, pass.alpha * halo)})`;

        if (pass.blur) {
          /* The stroke is drawn in nothing and its shadow is drawn in the
             colour, offset by nought - so the only thing painted is the
             blur. Stroking in the colour as well would put the hard line
             back underneath the soft one. */
          ctx.shadowBlur = pass.blur * halo;
          ctx.shadowColor = paint;
          ctx.strokeStyle = "rgba(0,0,0,0)";
        } else {
          ctx.shadowBlur = 0;
          ctx.strokeStyle = paint;
        }

        ctx.lineWidth = pass.wide * halo;
        path();
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

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
        /* The crosshair is the one hint that this is an instrument rather
           than a picture - a label saying "play me" would be the wrong kind
           of louder. */
        className="relative w-full cursor-crosshair"
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
