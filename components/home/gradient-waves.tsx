"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   GradientWaves, from React Bits.

   A raymarched plasma surface: a full-screen triangle, and a fragment shader
   that walks a ray from the camera until it meets a field made of two sines,
   then colours it by how far away it landed. There is no geometry in it at all -
   the horizon, the swell and the crests are all the same distance function.

   Kept close to the component as published. What has changed is what had to:
   TypeScript, the container's three CSS properties written as Tailwind classes
   rather than a stylesheet of its own, and the loop paused when the card is off
   the screen or the tab is in the background.

   The colours are the mark's. `horizonColor` is white on purpose: alpha falls
   away with distance, so the far water fades into the card rather than onto a
   band of another colour, and the card's own white is the haze.
--------------------------------------------------------------------------- */

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uParallax;
uniform bool uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

const float MAX_DIST = 20000.0;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float dscene = plasma(pos + dist * dir, freq, tc);
    if (abs(dscene) < 0.1) break;
    dist += 0.9 * dscene;
    if (!(abs(dist) < MAX_DIST)) return MAX_DIST;
  }
  return dist;
}

void main() {
  float T = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt); s = sin(uTilt);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  if (uEnableMouse) {
    float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
    float pitch = (uMouse.y - 0.5) * uParallax * 0.4;
    c = cos(yaw); s = sin(yaw);
    dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
    c = cos(pitch); s = sin(pitch);
    dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  }

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;

  float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 col = mix(uHorizonColor, body, t);
  col *= uBrightness;
  col = clamp(col, 0.0, 1.0);

  float alpha = clamp(t, 0.0, 1.0) * uOpacity;
  if (uGrain > 0.5) {
    float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0);
    alpha += (g - 0.5) * uGrainIntensity;
  }
  alpha = clamp(alpha, 0.0, 1.0);
  fragColor = vec4(col * alpha, alpha);
}
`;

/** A hex triple as nought-to-one floats, white if it is anything else. */
function hexToRgb(hex: string): [number, number, number] {
  const found = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!found) return [1, 1, 1];
  return [
    parseInt(found[1], 16) / 255,
    parseInt(found[2], 16) / 255,
    parseInt(found[3], 16) / 255,
  ];
}

/** How many marching steps each quality tier takes. */
const detailToSteps = (detail: Detail) =>
  detail === "low" ? 40 : detail === "high" ? 110 : 70;

type Detail = "low" | "medium" | "high";

export interface GradientWavesProps {
  /** Distant haze the waves fade into. */
  horizonColor?: string;
  /** Mid colour of the rolling wave bodies. */
  waveColor?: string;
  /** Highlight on the nearest crests. */
  crestColor?: string;
  speed?: number;
  amplitude?: number;
  waveScale?: number;
  waveRatio?: number;
  swell?: number;
  turbulence?: number;
  /** Camera pitch toward the horizon, in radians. */
  tilt?: number;
  zoom?: number;
  /** Where the horizon sits. */
  height?: number;
  /** How far the waves take to fade into haze and out of the picture. */
  fogDepth?: number;
  detail?: Detail;
  brightness?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  parallaxStrength?: number;
  grain?: boolean;
  grainIntensity?: number;
  className?: string;
}

export function GradientWaves({
  horizonColor = "#5227FF",
  waveColor = "#FF9FFC",
  crestColor = "#FFFFFF",
  speed = 0.4,
  amplitude = 2.5,
  waveScale = 0.6,
  waveRatio = 0.9,
  swell = 35,
  turbulence = 20,
  tilt = 1.11,
  zoom = 1,
  height = 5.5,
  fogDepth = 15,
  detail = "medium",
  brightness = 1,
  opacity = 1,
  mouseInteraction = true,
  parallaxStrength = 0.5,
  grain = true,
  grainIntensity = 0.05,
  className,
}: GradientWavesProps) {
  const box = useRef<HTMLDivElement>(null);
  const program = useRef<Program | null>(null);
  const wantsMouse = useRef(mouseInteraction);

  /* The context, built once. Every prop below is a uniform, so a change to any
     of them is a number written into the running program rather than a new
     renderer, a new shader and a lost frame. */
  useEffect(() => {
    const wrap = box.current;
    if (!wrap) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      /* One, and this is the single biggest number on the page.

         Every pixel of this is raymarched - seventy steps through a noise field
         for each one - so the cost is the pixel count multiplied by seventy. At
         a device ratio of two on a card the width of a window that is close to
         seven million pixels and half a billion steps a frame, which is what
         made this screen crawl.

         And it buys nothing here. A denser buffer sharpens edges, and this
         picture has none: it is a smooth blue swell with a soft horizon and a
         grain pass over it. There is no line in it whose stair-stepping anybody
         could point at. Capped at one, it is a quarter of the work for a
         picture nobody can tell from the other. */
      dpr: Math.min(window.devicePixelRatio || 1, 1),
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    wrap.appendChild(canvas);

    const shader = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: 0.4 },
        uAmplitude: { value: 2.5 },
        uWaveScale: { value: 0.6 },
        uWaveRatio: { value: 0.9 },
        uSwell: { value: 35 },
        uTurbulence: { value: 20 },
        uTilt: { value: 1.11 },
        uZoom: { value: 1 },
        uHeight: { value: 5.5 },
        uFogDepth: { value: 15 },
        uSteps: { value: 70 },
        uBrightness: { value: 1 },
        uOpacity: { value: 1 },
        uGrain: { value: 1 },
        uGrainIntensity: { value: 0.05 },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uParallax: { value: 0.5 },
        uEnableMouse: { value: true },
        uHorizonColor: { value: new Float32Array([1, 1, 1]) },
        uWaveColor: { value: new Float32Array([1, 1, 1]) },
        uCrestColor: { value: new Float32Array([1, 1, 1]) },
      },
    });

    const scene = new Mesh(gl, { geometry: new Triangle(gl), program: shader });
    program.current = shader;

    const size = () => {
      const rect = wrap.getBoundingClientRect();
      renderer.setSize(
        Math.max(1, Math.floor(rect.width)),
        Math.max(1, Math.floor(rect.height)),
      );
      const res = shader.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
      renderer.render({ scene });
    };

    const bounds = new ResizeObserver(size);
    bounds.observe(wrap);
    size();

    /* The pointer, eased rather than followed. A camera that lands exactly where
       the cursor is reads as the picture being dragged; a camera a fifth of a
       second behind reads as parallax. */
    const held = [0.5, 0.5];
    const want = [0.5, 0.5];

    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      want[0] = (event.clientX - rect.left) / rect.width;
      want[1] = 1 - (event.clientY - rect.top) / rect.height;
    };
    const leave = () => {
      want[0] = 0.5;
      want[1] = 0.5;
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);

    let frame = 0;
    let seen = true;
    let awake = !document.hidden;
    const born = performance.now();

    const tick = (now: number) => {
      shader.uniforms.iTime.value = (now - born) * 0.001;
      const toX = wantsMouse.current ? want[0] : 0.5;
      const toY = wantsMouse.current ? want[1] : 0.5;
      held[0] += 0.05 * (toX - held[0]);
      held[1] += 0.05 * (toY - held[1]);
      const mouse = shader.uniforms.uMouse.value as Float32Array;
      mouse[0] = held[0];
      mouse[1] = held[1];
      renderer.render({ scene });
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (seen && awake && frame === 0) frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    /* Off the screen, or the tab in the background, and it stops. A raymarcher
       is the most expensive thing on this page and the landing card holds three
       screens, only one of which is being looked at. */
    const eye = new IntersectionObserver(
      (entries) => {
        seen = entries[0]?.isIntersecting ?? true;
        if (seen) start();
        else stop();
      },
      { threshold: 0 },
    );
    eye.observe(wrap);

    const woke = () => {
      awake = !document.hidden;
      if (awake) start();
      else stop();
    };
    document.addEventListener("visibilitychange", woke);

    start();

    return () => {
      stop();
      bounds.disconnect();
      eye.disconnect();
      document.removeEventListener("visibilitychange", woke);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      program.current = null;
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  /* And the props, written straight into the uniforms. */
  useEffect(() => {
    const shader = program.current;
    if (!shader) return;
    const u = shader.uniforms;

    wantsMouse.current = mouseInteraction;

    u.uSpeed.value = speed;
    u.uAmplitude.value = amplitude;
    u.uWaveScale.value = waveScale;
    u.uWaveRatio.value = waveRatio;
    u.uSwell.value = swell;
    u.uTurbulence.value = turbulence;
    u.uTilt.value = tilt;
    u.uZoom.value = zoom;
    u.uHeight.value = height;
    u.uFogDepth.value = fogDepth;
    u.uSteps.value = detailToSteps(detail);
    u.uBrightness.value = brightness;
    u.uOpacity.value = opacity;
    u.uGrain.value = grain ? 1 : 0;
    u.uGrainIntensity.value = grainIntensity;
    u.uParallax.value = parallaxStrength;
    u.uEnableMouse.value = mouseInteraction;

    const put = (into: Float32Array, hex: string) => {
      const rgb = hexToRgb(hex);
      into[0] = rgb[0];
      into[1] = rgb[1];
      into[2] = rgb[2];
    };
    put(u.uHorizonColor.value as Float32Array, horizonColor);
    put(u.uWaveColor.value as Float32Array, waveColor);
    put(u.uCrestColor.value as Float32Array, crestColor);
  }, [
    horizonColor,
    waveColor,
    crestColor,
    speed,
    amplitude,
    waveScale,
    waveRatio,
    swell,
    turbulence,
    tilt,
    zoom,
    height,
    fogDepth,
    detail,
    brightness,
    opacity,
    grain,
    grainIntensity,
    mouseInteraction,
    parallaxStrength,
  ]);

  return (
    <div
      ref={box}
      aria-hidden
      className={cn("relative size-full overflow-hidden", className)}
    />
  );
}
