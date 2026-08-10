"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";

/* Two dependencies came off to bring this into the site.

   `next-themes` decided whether to draw the dark palette. There is one palette
   here - the card is white on every screen and always will be - so the light
   set is the set, and the flag it read is a constant.

   `globalAnalyser` was a music player's Web Audio node, and the field pulsed to
   whatever was playing. Nothing on this site plays anything, so the analyser is
   never found and every path that reads it already falls back to a still field.
   The code for it is left where it stands rather than cut out: the day this
   screen has sound, the wiring is a single import. */
const globalAnalyser: AnalyserNode | null = null;

// Constants for performance tuning
const PARTICLE_COUNT = 800;
const PARTICLE_COUNT_MOBILE = 400;
const MOUSE_INTERACTION_RADIUS = 200;
const RETURN_SPEED = 0.02;
const CONNECTION_BASE_DISTANCE = 80;
const CONNECTION_AUDIO_MULTIPLIER = 60;
const MAX_CONNECTIONS_PER_PARTICLE = 2;
const PARTICLE_SKIP_FACTOR = 4;
const CONNECTION_SKIP_FACTOR = 5;
const ANALYSER_CHECK_INTERVAL = 500;
const MOBILE_BREAKPOINT = 768;
const PARTICLE_SIZE_MOBILE_MULTIPLIER = 0.5;

// GPU-optimized styles
const CANVAS_STYLES = {
  willChange: "transform",
  transform: "translateZ(0)",
  backfaceVisibility: "hidden" as const,
  WebkitBackfaceVisibility: "hidden" as const,
} as const;

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  colorIndex: number;
  frequencyBand: 0 | 1 | 2;
}

interface AudioLevels {
  bass: number;
  mid: number;
  treble: number;
  average: number;
}

// Pure function for HSL to Hex conversion
const hslToHex = (h: number, s: number, l: number): string => {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) =>
    light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to255 = (v: number) => Math.round(255 * v);
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(to255(f(0)))}${toHex(to255(f(8)))}${toHex(to255(f(4)))}`;
};

// Parse CSS HSL variable
const parseCssHslVar = (value: string | null): string | null => {
  if (!value) return null;
  const parts = value.trim().split(/\s+/);
  if (parts.length < 3) return null;
  const h = Number(parts[0]);
  const s = Number(parts[1].replace("%", ""));
  const l = Number(parts[2].replace("%", ""));
  if (Number.isNaN(h) || Number.isNaN(s) || Number.isNaN(l)) return null;
  return hslToHex(h, s, l);
};

// Default color palettes
const DARK_MODE_FALLBACK = ["#22d3ee", "#38bdf8", "#60a5fa", "#818cf8"];
const LIGHT_MODE_FALLBACK = ["#1e40af", "#1e3a8a", "#1e293b", "#0f172a"];
const LIGHT_MODE_SECONDARY = ["#059669", "#047857"];

// Get theme colors with memoization support
const getThemeColors = (isDark: boolean): string[] => {
  if (typeof window === "undefined") {
    return isDark ? DARK_MODE_FALLBACK : LIGHT_MODE_FALLBACK;
  }

  const styles = getComputedStyle(document.documentElement);
  const primaryVar = parseCssHslVar(styles.getPropertyValue("--primary"));
  const secondaryVar = parseCssHslVar(styles.getPropertyValue("--secondary"));

  const palette: string[] = [];

  if (isDark) {
    if (primaryVar) palette.push(primaryVar, `${primaryVar}cc`);
    if (secondaryVar) palette.push(secondaryVar, `${secondaryVar}cc`);
  } else {
    if (primaryVar) palette.push("#1e40af", "#1e3a8a");
    if (secondaryVar) palette.push(...LIGHT_MODE_SECONDARY);
  }

  const fallback = isDark ? DARK_MODE_FALLBACK : LIGHT_MODE_FALLBACK;
  while (palette.length < 4) {
    palette.push(...fallback.slice(0, 4 - palette.length));
  }

  return palette.slice(0, 6);
};

// Create particles with pre-computed values
const createParticles = (
  width: number,
  height: number,
  colorCount: number,
  isMobile: boolean,
): Particle[] => {
  const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT;
  const sizeMultiplier = isMobile ? PARTICLE_SIZE_MOBILE_MULTIPLIER : 1;
  const particles: Particle[] = new Array(count);

  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    particles[i] = {
      x,
      y,
      originX: x,
      originY: y,
      size: (0.3 + Math.random() * 1.2) * sizeMultiplier,
      colorIndex: Math.floor(Math.random() * colorCount),
      frequencyBand: (i % 3) as 0 | 1 | 2,
    };
  }

  return particles;
};

// Calculate audio levels from frequency data
const calculateAudioLevels = (
  analyser: AnalyserNode,
  dataArray: Uint8Array<ArrayBuffer>,
): AudioLevels => {
  analyser.getByteFrequencyData(dataArray);

  const length = dataArray.length;
  const bassEnd = Math.floor(length * 0.1);
  const midEnd = Math.floor(length * 0.5);

  let bassSum = 0;
  let midSum = 0;
  let trebleSum = 0;

  for (let i = 0; i < bassEnd; i++) bassSum += dataArray[i];
  for (let i = bassEnd; i < midEnd; i++) midSum += dataArray[i];
  for (let i = midEnd; i < length; i++) trebleSum += dataArray[i];

  const normalize = (sum: number, count: number) =>
    Math.min(Math.pow((sum / count / 255) * 2, 1.5), 1);

  const bass = normalize(bassSum, bassEnd);
  const mid = normalize(midSum, midEnd - bassEnd);
  const treble = normalize(trebleSum, length - midEnd);

  return {
    bass,
    mid,
    treble,
    average: (bass + mid + treble) / 3,
  };
};

// Frequency band motion parameters
const MOTION_PARAMS = [
  { speed: 0.0003, amplitude: 1.5, multiplier: 6 },
  { speed: 0.0005, amplitude: 1.2, multiplier: 5 },
  { speed: 0.0007, amplitude: 0.9, multiplier: 4 },
] as const;

export function ParticleCanvas() {
  /* One palette. See the note at the head of the file. */
  const isDark = false;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const colorsRef = useRef<string[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const audioDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const isMobileRef = useRef(false);

  // Memoize theme colors
  const themeColors = useMemo(() => getThemeColors(isDark), [isDark]);

  // Handle resize with debouncing built into RAF
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { innerWidth, innerHeight } = window;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const wasMobile = isMobileRef.current;
    const isMobile = innerWidth < MOBILE_BREAKPOINT;
    isMobileRef.current = isMobile;

    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    dimensionsRef.current = { width: innerWidth, height: innerHeight };

    // Recreate particles if mobile state changed
    if (wasMobile !== isMobile) {
      particlesRef.current = createParticles(
        innerWidth,
        innerHeight,
        colorsRef.current.length,
        isMobile,
      );
    }
  }, []);

  // Handle mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);

  // Initialize particles and event listeners
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    isMobileRef.current = isMobile;

    colorsRef.current = themeColors;
    particlesRef.current = createParticles(
      window.innerWidth,
      window.innerHeight,
      themeColors.length,
      isMobile,
    );

    handleResize();

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [themeColors, handleResize, handleMouseMove]);

  // Initialize audio analyser connection
  useEffect(() => {
    if (typeof window === "undefined") return;

    const connectAnalyser = () => {
      if (globalAnalyser && !analyserRef.current) {
        analyserRef.current = globalAnalyser;
        audioDataRef.current = new Uint8Array(globalAnalyser.frequencyBinCount);
        return true;
      }
      return false;
    };

    if (connectAnalyser()) return;

    const interval = setInterval(() => {
      if (connectAnalyser()) clearInterval(interval);
    }, ANALYSER_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!ctx) return;

    const colors = colorsRef.current;
    const mouse = mouseRef.current;

    const animate = () => {
      const { width, height } = dimensionsRef.current;
      ctx.clearRect(0, 0, width, height);

      // Get audio levels
      let audioLevels: AudioLevels = { bass: 0, mid: 0, treble: 0, average: 0 };

      if (analyserRef.current && audioDataRef.current) {
        audioLevels = calculateAudioLevels(
          analyserRef.current,
          audioDataRef.current,
        );
      }

      const { bass, mid, treble, average } = audioLevels;
      const frequencyLevels = [bass, mid, treble];
      const now = Date.now();
      const isMobile = isMobileRef.current;

      // Update and draw particles
      const currentParticles = particlesRef.current;
      const particleCount = currentParticles.length;

      for (let i = 0; i < particleCount; i++) {
        const particle = currentParticles[i];
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < MOUSE_INTERACTION_RADIUS * MOUSE_INTERACTION_RADIUS) {
          const dist = Math.sqrt(distSq);
          const force =
            (MOUSE_INTERACTION_RADIUS - dist) / MOUSE_INTERACTION_RADIUS;
          particle.x += dx * force * 0.08;
          particle.y += dy * force * 0.08;
        } else {
          particle.x += (particle.originX - particle.x) * RETURN_SPEED;
          particle.y += (particle.originY - particle.y) * RETURN_SPEED;

          const band = particle.frequencyBand;
          const params = MOTION_PARAMS[band];
          const level = frequencyLevels[band];
          const intensity = 1 + level * params.multiplier;
          const phase = now * params.speed + i;

          particle.x += Math.sin(phase) * params.amplitude * intensity;
          particle.y += Math.cos(phase) * params.amplitude * intensity;
        }

        // Draw particle
        const audioSizeMultiplier = 1 + average * (isMobile ? 0.8 : 1.2);
        const currentSize = particle.size * audioSizeMultiplier;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = colors[particle.colorIndex];
        ctx.globalAlpha = isDark ? 0.5 + average * 0.15 : 0.6 + average * 0.2;
        ctx.fill();
      }

      // Draw connections (optimized with skip factors)
      const connectionDistance =
        CONNECTION_BASE_DISTANCE + average * CONNECTION_AUDIO_MULTIPLIER;
      const connectionDistanceSq = connectionDistance * connectionDistance;
      const baseAlpha = isDark ? 0.3 : 0.4;
      const lineWidth = (isMobile ? 0.3 : 0.5) + average * 0.3;

      ctx.lineWidth = lineWidth;

      for (let i = 0; i < particleCount; i += PARTICLE_SKIP_FACTOR) {
        const particle = currentParticles[i];
        let connectionsDrawn = 0;

        for (
          let j = 0;
          j < particleCount && connectionsDrawn < MAX_CONNECTIONS_PER_PARTICLE;
          j += CONNECTION_SKIP_FACTOR
        ) {
          const p2 = currentParticles[j];
          const dx2 = particle.x - p2.x;
          const dy2 = particle.y - p2.y;
          const distSq2 = dx2 * dx2 + dy2 * dy2;

          if (distSq2 > 0 && distSq2 < connectionDistanceSq) {
            const dist2 = Math.sqrt(distSq2);
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = colors[particle.colorIndex];
            ctx.globalAlpha =
              (baseAlpha + average * 0.2) * (1 - dist2 / connectionDistance);
            ctx.stroke();
            connectionsDrawn++;
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    /* Only while it is on screen.

       This is a field of points redrawn sixty times a second, with a pass over
       the pairs of them for the lines between - and it is one screen of a card
       near the top of a long page. Scrolled past, it was still doing all of
       that: a phone reading the footer was paying for a picture four screenfuls
       above it, which on a weak device is the whole page feeling heavy for no
       reason anybody can see.

       Started and stopped rather than skipped inside the loop. A frame that
       wakes only to decide it has nothing to do is still a frame, still a wake,
       and on a battery still a cost. */
    const start = () => {
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const stop = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
    };

    const eye = new IntersectionObserver(
      ([seen]) => (seen?.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );

    eye.observe(canvas);

    return () => {
      eye.disconnect();
      stop();
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={CANVAS_STYLES}
      aria-hidden="true"
    />
  );
}
