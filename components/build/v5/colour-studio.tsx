"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

import {
  ArrowDown,
  ArrowUp,
  Check,
  ImagePlus,
  Monitor,
  Pipette,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import {
  addColour,
  clamp,
  clearPalette,
  contrast,
  dropColour,
  getPalette,
  getServerPalette,
  harmonies,
  hexToRgb,
  hsvToRgb,
  inkOn,
  MAX_COLOURS,
  moveColour,
  previewRoles,
  reading,
  rgbToHex,
  rgbToHsv,
  ROLES,
  setNote,
  setRole,
  setWeight,
  subscribePalette,
  type Swatch,
} from "@/lib/build/v5-palette";
import { cn } from "@/lib/utils";

import { Kicker } from "./kit";
import { Disc, Plate, Stage } from "./stage";

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

/** Not in the TypeScript DOM library yet, and only present in some browsers. */
interface EyeDropperLike {
  open(): Promise<{ sRGBHex: string }>;
}
declare global {
  interface Window {
    EyeDropper?: new () => EyeDropperLike;
  }
}

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

/* -------------------------------------------------------------- the studio */

function Studio({ onClose }: { onClose: () => void }) {
  const palette = useSyncExternalStore(
    subscribePalette,
    getPalette,
    getServerPalette,
  );

  const [hsv, setHsv] = useState({ h: 14, s: 0.74, v: 0.74 });
  const [shots, setShots] = useState<{ url: string; name: string }[]>([]);
  const [at, setAt] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [found, setFound] = useState<string[]>([]);
  const [said, setSaid] = useState("");

  const stage = useRef<HTMLCanvasElement>(null);
  const source = useRef<HTMLCanvasElement | null>(null);
  const image = useRef<HTMLImageElement | null>(null);
  const view = useRef({ scale: 1, fit: 1, x: 0, y: 0 });
  const loupe = useRef<HTMLDivElement>(null);
  const loupeCv = useRef<HTMLCanvasElement>(null);
  const came = useRef<HTMLElement | null>(null);

  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  /* ------------------------------------------------------- opening and out */

  useEffect(() => {
    came.current = document.activeElement as HTMLElement | null;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const locked = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = locked;
      came.current?.focus?.();
    };
  }, [onClose]);

  /* --------------------------------------------------------- getting a picture */

  const takeImage = useCallback((url: string, name: string) => {
    const img = new Image();
    img.onload = () => {
      setShots((was) => {
        setAt(was.length);
        return [...was, { url, name }];
      });
    };
    img.onerror = () => setSaid("That image would not load. Try a PNG or JPG.");
    img.src = url;
  }, []);

  const takeFiles = useCallback(
    (list: FileList | File[] | null) => {
      const files = Array.from(list ?? []).filter((f) =>
        f.type.startsWith("image/"),
      );

      if (!files.length) {
        setSaid("The studio takes pictures. Other files go on the notes desk.");
        return;
      }

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) =>
          takeImage(String(event.target?.result ?? ""), file.name);
        reader.readAsDataURL(file);
      });
    },
    [takeImage],
  );

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const items = Array.from(event.clipboardData?.items ?? []);
      const shot = items
        .filter((item) => item.type.startsWith("image/"))
        .map((item) => item.getAsFile())
        .filter(Boolean) as File[];

      if (shot.length) {
        event.preventDefault();
        takeFiles(shot);
        setSaid("Pasted. Hover to magnify, click to take that pixel.");
      }
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [takeFiles]);

  /* ------------------------------------------- the picture, on its own canvas */

  const draw = useCallback(() => {
    const canvas = stage.current;
    const img = image.current;
    if (!canvas || !img) return;

    const paint = canvas.getContext("2d");
    if (!paint) return;

    paint.clearRect(0, 0, canvas.width, canvas.height);
    paint.imageSmoothingEnabled = false;
    paint.drawImage(
      img,
      view.current.x,
      view.current.y,
      img.naturalWidth * view.current.scale,
      img.naturalHeight * view.current.scale,
    );
  }, []);

  const fit = useCallback(() => {
    const canvas = stage.current;
    const img = image.current;
    if (!canvas || !img) return;

    const scale = Math.min(
      canvas.width / img.naturalWidth,
      canvas.height / img.naturalHeight,
    );

    view.current = {
      scale,
      fit: scale,
      x: (canvas.width - img.naturalWidth * scale) / 2,
      y: (canvas.height - img.naturalHeight * scale) / 2,
    };

    setZoom(1);
    draw();
  }, [draw]);

  useEffect(() => {
    const shot = shots[at];
    if (!shot) {
      image.current = null;
      source.current = null;
      return;
    }

    const img = new Image();
    img.onload = () => {
      image.current = img;

      /* A second canvas at the picture's own size. Sampling has to read the
         original pixel, not the one the screen happens to be showing. */
      const off = document.createElement("canvas");
      off.width = img.naturalWidth;
      off.height = img.naturalHeight;
      off.getContext("2d", { willReadFrequently: true })?.drawImage(img, 0, 0);
      source.current = off;

      setFound([]);
      fit();
    };
    img.src = shot.url;
  }, [shots, at, fit]);

  /* ------------------------------------------------------ sampling and panning */

  const sampleAt = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = stage.current;
    const off = source.current;
    if (!canvas || !off) return null;

    const box = canvas.getBoundingClientRect();
    const x = (event.clientX - box.left) * (canvas.width / box.width);
    const y = (event.clientY - box.top) * (canvas.height / box.height);

    const px = clamp(
      Math.floor((x - view.current.x) / view.current.scale),
      0,
      off.width - 1,
    );
    const py = clamp(
      Math.floor((y - view.current.y) / view.current.scale),
      0,
      off.height - 1,
    );

    const data = off
      .getContext("2d", { willReadFrequently: true })
      ?.getImageData(px, py, 1, 1).data;

    if (!data) return null;
    return { r: data[0], g: data[1], b: data[2], px, py };
  };

  const drag = useRef({ down: false, moved: false, x: 0, y: 0, ox: 0, oy: 0 });

  const showLoupe = (
    event: React.PointerEvent<HTMLCanvasElement>,
    spot: { px: number; py: number },
  ) => {
    const off = source.current;
    const box = loupe.current;
    const glass = loupeCv.current;
    if (!off || !box || !glass) return;

    const n = 6;
    const side = 2 * n + 1;
    const paint = glass.getContext("2d");
    if (!paint) return;

    glass.width = side;
    glass.height = side;
    paint.imageSmoothingEnabled = false;
    paint.clearRect(0, 0, side, side);
    paint.drawImage(
      off,
      spot.px - n,
      spot.py - n,
      side,
      side,
      0,
      0,
      side,
      side,
    );
    paint.strokeStyle = "#fff";
    paint.lineWidth = 0.16;
    paint.strokeRect(n + 0.08, n + 0.08, 0.84, 0.84);

    box.style.left = `${event.clientX}px`;
    box.style.top = `${event.clientY}px`;
    box.style.display = "block";
  };

  /* ---------------------------------------------- reading a picture back out */

  const extract = () => {
    const img = image.current;
    if (!img) {
      setSaid("Add a picture first - this reads the picture.");
      return;
    }

    const side = 48;
    const off = document.createElement("canvas");
    off.width = side;
    off.height = side;

    const paint = off.getContext("2d", { willReadFrequently: true });
    if (!paint) return;

    paint.drawImage(img, 0, 0, side, side);

    let data: Uint8ClampedArray;
    try {
      data = paint.getImageData(0, 0, side, side).data;
    } catch {
      setSaid("That picture cannot be read pixel by pixel. Pick by hand.");
      return;
    }

    /* Buckets of 32 per channel. Fine enough to keep two greens apart, coarse
       enough that one photograph does not produce four hundred answers. */
    const bins = new Map<
      string,
      { r: number; g: number; b: number; n: number }
    >();

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 125) continue;

      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);

      /* Paper and shadow are in every photograph and are nobody's brand. */
      if (max > 245 && min > 245) continue;
      if (max < 12) continue;

      const key = `${r >> 5},${g >> 5},${b >> 5}`;
      const bin = bins.get(key) ?? { r: 0, g: 0, b: 0, n: 0 };
      bin.r += r;
      bin.g += g;
      bin.b += b;
      bin.n += 1;
      bins.set(key, bin);
    }

    const out = [...bins.values()]
      .sort((a, b) => b.n - a.n)
      .slice(0, 8)
      .map((bin) =>
        rgbToHex(
          Math.round(bin.r / bin.n),
          Math.round(bin.g / bin.n),
          Math.round(bin.b / bin.n),
        ),
      );

    setFound(out);
    setSaid(
      out.length
        ? `${out.length} colours read out of the picture. Keep the ones you want.`
        : "Nothing to pull out of that one. Pick by hand instead.",
    );
  };

  const pickAnywhere = () => {
    if (!window.EyeDropper) {
      setSaid(
        "Picking from anywhere on screen needs Chrome or Edge. Picking from a picture works everywhere.",
      );
      return;
    }

    new window.EyeDropper()
      .open()
      .then((result) => {
        setFromHex(result.sRGBHex);
        setSaid(`${result.sRGBHex.toUpperCase()} taken off the screen.`);
      })
      .catch(() => undefined);
  };

  const snapScreen = () => {
    const media = navigator.mediaDevices;
    if (!media?.getDisplayMedia) {
      setSaid(
        "Snapshots need Chrome or Edge. Dropping a screenshot always works.",
      );
      return;
    }

    media
      .getDisplayMedia({ video: true, audio: false })
      .then(async (stream) => {
        const video = document.createElement("video");
        video.srcObject = stream;
        await video.play();
        await new Promise((done) => setTimeout(done, 220));

        const shot = document.createElement("canvas");
        shot.width = video.videoWidth;
        shot.height = video.videoHeight;
        shot.getContext("2d")?.drawImage(video, 0, 0);
        stream.getTracks().forEach((track) => track.stop());

        takeImage(shot.toDataURL("image/png"), "Screen");
      })
      .catch(() => setSaid("The snapshot was cancelled."));
  };

  /* ------------------------------------------------------------ fine tuning */

  const setFromRgb = (r: number, g: number, b: number) =>
    setHsv(rgbToHsv(clamp(r, 0, 255), clamp(g, 0, 255), clamp(b, 0, 255)));

  const setFromHex = (value: string) => {
    const c = hexToRgb(value);
    if (c) setFromRgb(c.r, c.g, c.b);
  };

  const keep = (value: string, source: string) => {
    const result = addColour(value, source);
    setSaid(result.said);
  };

  const preview = previewRoles(palette);
  const ratio = contrast(preview.field, preview.text);
  const grade = reading(ratio);
  const heaviest = [...palette].sort((a, b) => b.weight - a.weight)[0];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain"
      /* Out through a portal, so it is outside the tool it belongs to and
         inherits nothing from it. The accent is set again here for that
         reason. */
      style={{ ["--color-mark" as string]: "var(--color-done)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Colour studio"
    >
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 bg-ink/65 backdrop-blur-[6px]"
      />

      {/* Centred on the window, and it scrolls when it cannot be. `min-h-full`
          on a flex box inside the scroller is what makes both true at once:
          centring alone clips the top of anything taller than the screen, and
          scrolling alone leaves a short panel stranded against the top edge. */}
      <div className="relative flex min-h-full items-center justify-center p-3 sm:p-5">
        <div className="w-full max-w-[1500px]">
          <Stage
            tone="field"
            className="w-full"
            toolbar={
              <Plate>
                <span className="flex items-center gap-2.5 px-3">
                  <Pipette className="size-4 flex-none text-mark" />
                  <b className="text-[13.5px] leading-none font-bold text-ink">
                    Colour studio
                  </b>
                </span>
              </Plate>
            }
            aside={
              /* White, not ink. On the run-through this cut has the page
                 behind it; here it has the scrim, so the number is standing on
                 the dark and has to be lit rather than drawn. */
              <div className="flex size-full flex-col items-center justify-center">
                <b className="font-mono text-[24px] leading-none font-bold text-white tabular-nums">
                  {palette.length}
                </b>
                <span className="mt-1.5 font-mono text-[8.5px] font-bold tracking-[0.12em] text-white/60 uppercase">
                  Kept
                </span>
              </div>
            }
            corner={
              <Disc label="Close the studio" tone="ink" onClick={onClose}>
                <X className="size-[18px]" strokeWidth={2.2} />
              </Disc>
            }
          >
            {/* What the studio has just done. One line, never a dialog on top of
              a dialog: everything in here is reversible. */}
            <p
              role="status"
              aria-live="polite"
              className="min-h-[18px] text-[12.5px] leading-[1.4] font-semibold text-mark"
            >
              {said}
            </p>

            <div className="mt-3 grid gap-6 lg:gap-7 md:grid-cols-[minmax(0,1fr)_290px] lg:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
              {/* ------------------------------------------- one: get a colour */}
              <div className="min-w-0">
                <Kicker className="block text-ink">1 · Find the colour</Kicker>

                <div className="mt-2.5 flex flex-wrap gap-2">
                  <Tool
                    icon={<ImagePlus className="size-3.5" />}
                    label="Add a picture"
                    onClick={() => document.getElementById("cs-file")?.click()}
                  />
                  <Tool
                    icon={<Monitor className="size-3.5" />}
                    label="Snapshot a screen"
                    onClick={snapScreen}
                  />
                  <Tool
                    icon={<Pipette className="size-3.5" />}
                    label="Pick anywhere"
                    onClick={pickAnywhere}
                  />
                  {shots.length ? (
                    <Tool
                      icon={<Sparkles className="size-3.5" />}
                      label="Read the picture"
                      onClick={extract}
                    />
                  ) : null}
                </div>

                <input
                  id="cs-file"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    takeFiles(event.target.files);
                    event.target.value = "";
                  }}
                />

                {shots.length ? (
                  <>
                    <canvas
                      ref={stage}
                      width={1040}
                      height={560}
                      className="mt-3 block max-h-[52svh] w-full cursor-crosshair rounded-[16px] bg-well object-contain touch-none"
                      onPointerDown={(event) => {
                        drag.current = {
                          down: true,
                          moved: false,
                          x: event.clientX,
                          y: event.clientY,
                          ox: view.current.x,
                          oy: view.current.y,
                        };
                        event.currentTarget.setPointerCapture(event.pointerId);
                      }}
                      onPointerMove={(event) => {
                        const canvas = stage.current;
                        if (!canvas) return;

                        if (drag.current.down) {
                          const dx = event.clientX - drag.current.x;
                          const dy = event.clientY - drag.current.y;

                          if (Math.abs(dx) + Math.abs(dy) > 4) {
                            const box = canvas.getBoundingClientRect();
                            drag.current.moved = true;
                            view.current.x =
                              drag.current.ox + dx * (canvas.width / box.width);
                            view.current.y =
                              drag.current.oy +
                              dy * (canvas.height / box.height);
                            draw();
                            if (loupe.current)
                              loupe.current.style.display = "none";
                            return;
                          }
                        }

                        const spot = sampleAt(event);
                        if (spot) showLoupe(event, spot);
                      }}
                      onPointerUp={(event) => {
                        if (drag.current.down && !drag.current.moved) {
                          const spot = sampleAt(event);
                          if (spot) {
                            setFromRgb(spot.r, spot.g, spot.b);
                            setSaid(
                              `${rgbToHex(spot.r, spot.g, spot.b)} taken. Keep it when it is right.`,
                            );
                          }
                        }
                        drag.current.down = false;
                      }}
                      onPointerLeave={() => {
                        if (loupe.current) loupe.current.style.display = "none";
                      }}
                    />

                    <div className="mt-2.5 flex items-center gap-3">
                      <Kicker className="flex-none">Zoom</Kicker>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        step={0.1}
                        value={zoom}
                        aria-label="Zoom"
                        onChange={(event) => {
                          const canvas = stage.current;
                          if (!canvas) return;

                          const next = Number(event.target.value);
                          const cx =
                            (canvas.width / 2 - view.current.x) /
                            view.current.scale;
                          const cy =
                            (canvas.height / 2 - view.current.y) /
                            view.current.scale;

                          view.current.scale = view.current.fit * next;
                          view.current.x =
                            canvas.width / 2 - cx * view.current.scale;
                          view.current.y =
                            canvas.height / 2 - cy * view.current.scale;

                          setZoom(next);
                          draw();
                        }}
                        className="h-1 min-w-0 flex-1 accent-ink"
                      />
                      <button
                        type="button"
                        onClick={fit}
                        className="flex-none cursor-pointer font-mono text-[9px] font-bold tracking-[0.12em] text-quiet uppercase transition-colors hover:text-ink"
                      >
                        Reset
                      </button>
                    </div>

                    <p className="mt-1.5 text-[11.5px] leading-[1.45] text-label">
                      Hover to magnify, click to take that exact pixel, drag to
                      move once you have zoomed in.
                    </p>

                    {shots.length > 1 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {shots.map((shot, n) => (
                          <button
                            key={shot.url.slice(-24) + n}
                            type="button"
                            onClick={() => setAt(n)}
                            className={cn(
                              "size-12 cursor-pointer overflow-hidden rounded-[10px] bg-well transition-all",
                              n === at
                                ? "ring-2 ring-ink"
                                : "opacity-70 hover:opacity-100",
                            )}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={shot.url}
                              alt={shot.name}
                              className="size-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => document.getElementById("cs-file")?.click()}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      takeFiles(event.dataTransfer.files);
                    }}
                    className="mt-3 flex h-[180px] w-full cursor-pointer sm:h-[240px] lg:h-[300px] flex-col items-center justify-center rounded-[16px] bg-well px-6 text-center transition-colors hover:bg-hair"
                  >
                    <ImagePlus className="size-6 text-idx" />
                    <b className="mt-3 text-[14px] font-bold text-ink">
                      Drop a picture here
                    </b>
                    <span className="mt-1 max-w-[38ch] text-[12.5px] leading-[1.45] text-quiet">
                      A photograph of the shop, the van, a sign, your logo, or a
                      screenshot of a site you like. Paste works too.
                    </span>
                  </button>
                )}

                {found.length ? (
                  <div className="mt-4">
                    <Kicker className="block">Read out of the picture</Kicker>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {found.map((value) => {
                        const kept = palette.some((s) => s.hex === value);
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              setFromHex(value);
                              if (!kept) keep(value, "read from a picture");
                            }}
                            className="flex w-[76px] cursor-pointer flex-col items-center gap-1.5 rounded-[12px] bg-well p-2 transition-colors hover:bg-hair"
                          >
                            <span
                              className="flex h-8 w-full items-center justify-center rounded-[8px]"
                              style={{ background: value }}
                            >
                              {kept ? (
                                <Check
                                  className="size-3.5"
                                  strokeWidth={3}
                                  style={{ color: inkOn(value) }}
                                />
                              ) : null}
                            </span>
                            <span className="font-mono text-[9px] font-bold text-quiet">
                              {kept ? "KEPT" : value}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* ------------------------------------------------ two: tune it */}
              <div className="min-w-0">
                <Kicker className="block text-ink">2 · Get it exact</Kicker>

                <div
                  role="slider"
                  aria-label="Saturation and brightness"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(hsv.s * 100)}
                  aria-valuetext={`${hex}, ${Math.round(hsv.s * 100)}% colour, ${Math.round(hsv.v * 100)}% light`}
                  tabIndex={0}
                  className="relative mt-2.5 h-[150px] w-full cursor-crosshair sm:h-[190px] touch-none rounded-[12px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top,#000,rgba(0,0,0,0)),linear-gradient(to right,#fff,hsl(" +
                      hsv.h +
                      ",100%,50%))",
                  }}
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    const box = event.currentTarget.getBoundingClientRect();
                    setHsv((was) => ({
                      ...was,
                      s: clamp((event.clientX - box.left) / box.width, 0, 1),
                      v:
                        1 - clamp((event.clientY - box.top) / box.height, 0, 1),
                    }));
                  }}
                  onPointerMove={(event) => {
                    if (event.buttons !== 1) return;
                    const box = event.currentTarget.getBoundingClientRect();
                    setHsv((was) => ({
                      ...was,
                      s: clamp((event.clientX - box.left) / box.width, 0, 1),
                      v:
                        1 - clamp((event.clientY - box.top) / box.height, 0, 1),
                    }));
                  }}
                  onKeyDown={(event) => {
                    const step = event.shiftKey ? 0.1 : 0.02;
                    const moves: Record<string, () => void> = {
                      ArrowLeft: () =>
                        setHsv((w) => ({ ...w, s: clamp(w.s - step, 0, 1) })),
                      ArrowRight: () =>
                        setHsv((w) => ({ ...w, s: clamp(w.s + step, 0, 1) })),
                      ArrowUp: () =>
                        setHsv((w) => ({ ...w, v: clamp(w.v + step, 0, 1) })),
                      ArrowDown: () =>
                        setHsv((w) => ({ ...w, v: clamp(w.v - step, 0, 1) })),
                    };
                    if (moves[event.key]) {
                      event.preventDefault();
                      moves[event.key]();
                    }
                  }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-pill border-2 border-white"
                    style={{
                      left: `${hsv.s * 100}%`,
                      top: `${(1 - hsv.v) * 100}%`,
                      boxShadow: "0 0 0 1px rgba(17,24,39,.45)",
                    }}
                  />
                </div>

                <div
                  role="slider"
                  aria-label="Hue"
                  aria-valuemin={0}
                  aria-valuemax={360}
                  aria-valuenow={Math.round(hsv.h)}
                  tabIndex={0}
                  className="relative mt-3 h-4 w-full cursor-pointer touch-none rounded-pill"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)",
                  }}
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    const box = event.currentTarget.getBoundingClientRect();
                    setHsv((w) => ({
                      ...w,
                      h:
                        clamp((event.clientX - box.left) / box.width, 0, 1) *
                        360,
                    }));
                  }}
                  onPointerMove={(event) => {
                    if (event.buttons !== 1) return;
                    const box = event.currentTarget.getBoundingClientRect();
                    setHsv((w) => ({
                      ...w,
                      h:
                        clamp((event.clientX - box.left) / box.width, 0, 1) *
                        360,
                    }));
                  }}
                  onKeyDown={(event) => {
                    const step = event.shiftKey ? 12 : 3;
                    if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      setHsv((w) => ({ ...w, h: (w.h - step + 360) % 360 }));
                    }
                    if (event.key === "ArrowRight") {
                      event.preventDefault();
                      setHsv((w) => ({ ...w, h: (w.h + step) % 360 }));
                    }
                  }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-pill border-2 border-white"
                    style={{
                      left: `${(hsv.h / 360) * 100}%`,
                      boxShadow: "0 0 0 1px rgba(17,24,39,.45)",
                    }}
                  />
                </div>

                <div className="mt-3.5 flex items-start gap-3">
                  <span
                    aria-hidden
                    className="size-[52px] flex-none rounded-[12px]"
                    style={{ background: hex }}
                  />
                  <div className="grid min-w-0 flex-1 grid-cols-3 gap-1.5">
                    {(
                      [
                        ["R", Math.round(rgb.r)],
                        ["G", Math.round(rgb.g)],
                        ["B", Math.round(rgb.b)],
                      ] as const
                    ).map(([name, value], n) => (
                      <label key={name} className="min-w-0">
                        <span className="block font-mono text-[8.5px] font-bold tracking-[0.12em] text-label uppercase">
                          {name}
                        </span>
                        <input
                          inputMode="numeric"
                          value={value}
                          onChange={(event) => {
                            const parts = [
                              Math.round(rgb.r),
                              Math.round(rgb.g),
                              Math.round(rgb.b),
                            ];
                            parts[n] = Number(event.target.value) || 0;
                            setFromRgb(parts[0], parts[1], parts[2]);
                          }}
                          className="mt-0.5 h-8 w-full rounded-field bg-well px-2 font-mono text-[12px] text-ink outline-none focus:ring-2 focus:ring-ink"
                        />
                      </label>
                    ))}

                    <label className="col-span-3 min-w-0">
                      <span className="block font-mono text-[8.5px] font-bold tracking-[0.12em] text-label uppercase">
                        Hex
                      </span>
                      <input
                        defaultValue={hex}
                        key={hex}
                        onChange={(event) => setFromHex(event.target.value)}
                        className="mt-0.5 h-8 w-full rounded-field bg-well px-2 font-mono text-[12px] text-ink outline-none focus:ring-2 focus:ring-ink"
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => keep(hex, "chosen by hand")}
                  disabled={palette.length >= MAX_COLOURS}
                  className={cn(
                    "mt-3.5 flex w-full items-center justify-center gap-2 rounded-pill py-2.5 text-[13.5px] font-semibold transition-opacity",
                    palette.length >= MAX_COLOURS
                      ? "cursor-default bg-well text-label"
                      : "cursor-pointer bg-ink text-white hover:opacity-85",
                  )}
                >
                  <Check className="size-4" strokeWidth={3} />
                  Keep {hex}
                </button>

                {/* Colours that stand in a known relation to this one. Not a
                  scheme - a set of starting points that are hard to arrive at
                  by dragging, and easy to reject. */}
                <div className="mt-4">
                  <Kicker className="block">Goes with it</Kicker>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {harmonies(hex).map((mate, n) => (
                      <button
                        key={mate.hex + n}
                        type="button"
                        title={`${mate.n} · ${mate.hex}`}
                        onClick={() => setFromHex(mate.hex)}
                        className="size-8 cursor-pointer rounded-[9px] transition-transform hover:-translate-y-0.5"
                        style={{ background: mate.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* --------------------------------------------- three: the palette */}
            <div className="mt-8 border-t border-hair pt-6">
              <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
                <div>
                  <Kicker className="block text-ink">
                    3 · Say what each one is for
                  </Kicker>
                  <p className="mt-1 max-w-[62ch] text-[12.5px] leading-[1.5] text-quiet">
                    The role and the share are the useful part. A hex code on
                    its own tells us the colour exists; this tells us where it
                    goes.
                  </p>
                </div>

                {palette.length ? (
                  <button
                    type="button"
                    onClick={() => {
                      clearPalette();
                      setSaid("Palette cleared.");
                    }}
                    className="cursor-pointer font-mono text-[9px] font-bold tracking-[0.12em] text-label uppercase transition-colors hover:text-ink"
                  >
                    Clear all
                  </button>
                ) : null}
              </div>

              {palette.length ? (
                <>
                  <span className="mt-3.5 flex h-3.5 w-full overflow-hidden rounded-pill">
                    {palette.map((swatch) => (
                      <span
                        key={swatch.id}
                        style={{
                          background: swatch.hex,
                          width: `${swatch.weight}%`,
                        }}
                      />
                    ))}
                  </span>

                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3">
                    {palette.map((swatch, n) => (
                      <Row
                        key={swatch.id}
                        swatch={swatch}
                        first={n === 0}
                        last={n === palette.length - 1}
                        onTune={() => setFromHex(swatch.hex)}
                      />
                    ))}
                  </div>

                  {/* What the palette actually does on a page, and whether the
                    pair somebody has landed on can be read. */}
                  <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_240px] lg:grid-cols-[minmax(0,1fr)_260px]">
                    <div
                      className="min-w-0 rounded-[16px] p-4 sm:p-5"
                      style={{ background: preview.field, color: preview.text }}
                    >
                      <b className="block text-[17px] leading-[1.15] font-extrabold sm:text-[19px] tracking-[-0.02em]">
                        A heading in your colours
                      </b>
                      <p className="mt-1.5 max-w-[56ch] text-[13px] leading-[1.55]">
                        A paragraph of ordinary text, so you can see whether it
                        is readable at the weights you have set. This is not a
                        design. It is proof that the roles and the shares mean
                        something.
                      </p>
                      <span
                        className="mt-3.5 inline-block rounded-pill px-4 py-2 text-[13px] font-semibold"
                        style={{
                          background: preview.primary,
                          color: inkOn(preview.primary),
                        }}
                      >
                        The main action
                      </span>
                    </div>

                    <div className="min-w-0 rounded-[16px] bg-well p-4">
                      <Kicker className="block">Can it be read</Kicker>
                      <b className="mt-2 block font-mono text-[26px] leading-none font-bold text-ink tabular-nums">
                        {ratio.toFixed(1)}
                        <span className="text-[13px] text-label"> : 1</span>
                      </b>
                      <span
                        className={cn(
                          "mt-2 inline-block rounded-pill px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.12em] uppercase",
                          ratio >= 4.5
                            ? "bg-ink text-white"
                            : "bg-mark text-white",
                        )}
                      >
                        {grade.grade}
                      </span>
                      <p className="mt-2 text-[12px] leading-[1.5] text-quiet">
                        {grade.note}. Measured between the background and the
                        text above.
                      </p>
                      <p className="mt-2.5 border-t border-border pt-2.5 text-[11.5px] leading-[1.5] text-label">
                        {preview.set === 3
                          ? "Drawn from the roles you set."
                          : preview.set === 0
                            ? "Guessing: lightest is the field, darkest is the text, the first is the action. Set the roles and it stops guessing."
                            : "Part yours, part guessed. Where a role is set we use it."}
                        {heaviest
                          ? ` Heaviest is ${heaviest.hex} at ${heaviest.weight}%.`
                          : ""}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="mt-3.5 rounded-[14px] bg-well p-4 text-[12.5px] leading-[1.55] text-quiet">
                  Nothing kept yet. Take one out of a picture on the left, or
                  choose one by hand on the right.
                </p>
              )}
            </div>
          </Stage>
        </div>
      </div>

      {/* The magnifier. Fixed to the pointer, outside every scrolling box. */}
      <div
        ref={loupe}
        aria-hidden
        className="pointer-events-none fixed z-[60] hidden -translate-x-1/2 -translate-y-[118%]"
      >
        <canvas
          ref={loupeCv}
          className="block size-[104px] rounded-pill border-[3px] border-white bg-ink [image-rendering:pixelated]"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ pieces */

function Tool({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-none cursor-pointer items-center gap-2 rounded-pill bg-well px-3 py-2 text-[12px] font-semibold text-body transition-colors hover:bg-hair hover:text-ink sm:px-3.5 sm:text-[12.5px]"
    >
      {icon}
      {label}
    </button>
  );
}

/** One colour: what it is, what it is for, and how much of the site it takes. */
function Row({
  swatch,
  first,
  last,
  onTune,
}: {
  swatch: Swatch;
  first: boolean;
  last: boolean;
  onTune: () => void;
}) {
  return (
    <div className="min-w-0 rounded-[14px] bg-well p-3.5">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onTune}
          title="Load this one back into the picker"
          className="size-8 flex-none cursor-pointer rounded-[9px]"
          style={{ background: swatch.hex }}
        />

        <span className="min-w-0 flex-1 font-mono text-[12.5px] font-bold text-ink">
          {swatch.hex}
        </span>

        <span className="flex flex-none items-center gap-0.5">
          <button
            type="button"
            aria-label="Move up"
            disabled={first}
            onClick={() => moveColour(swatch.id, -1)}
            className={cn(
              "flex size-6 items-center justify-center rounded-pill transition-colors",
              first
                ? "cursor-default text-planned"
                : "cursor-pointer text-quiet hover:bg-field hover:text-ink",
            )}
          >
            <ArrowUp className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="Move down"
            disabled={last}
            onClick={() => moveColour(swatch.id, 1)}
            className={cn(
              "flex size-6 items-center justify-center rounded-pill transition-colors",
              last
                ? "cursor-default text-planned"
                : "cursor-pointer text-quiet hover:bg-field hover:text-ink",
            )}
          >
            <ArrowDown className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label={`Remove ${swatch.hex}`}
            onClick={() => dropColour(swatch.id)}
            className="flex size-6 cursor-pointer items-center justify-center rounded-pill text-quiet transition-colors hover:bg-field hover:text-mark"
          >
            <Trash2 className="size-3.5" />
          </button>
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <Kicker className="w-[34px] flex-none">Role</Kicker>
        <select
          value={swatch.role}
          aria-label={`What is ${swatch.hex} for?`}
          onChange={(event) => setRole(swatch.id, event.target.value)}
          className={cn(
            "h-8 min-w-0 flex-1 cursor-pointer rounded-field bg-field px-2 text-[12.5px] outline-none focus:ring-2 focus:ring-ink",
            swatch.role ? "font-semibold text-ink" : "text-quiet",
          )}
        >
          {ROLES.map((role) => (
            <option key={role.k} value={role.k}>
              {role.n}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Kicker className="w-[34px] flex-none">Share</Kicker>
        <input
          type="range"
          min={0}
          max={100}
          value={swatch.weight}
          aria-label={`How much of the design is ${swatch.hex}`}
          onChange={(event) => setWeight(swatch.id, Number(event.target.value))}
          className="h-1 min-w-0 flex-1 cursor-pointer accent-ink"
        />
        <span className="w-[38px] flex-none text-right font-mono text-[12px] font-bold text-ink tabular-nums">
          {swatch.weight}%
        </span>
      </div>

      <input
        value={swatch.note}
        placeholder="Where it came from, or where it must not go"
        onChange={(event) => setNote(swatch.id, event.target.value)}
        aria-label={`Note about ${swatch.hex}`}
        className="mt-2.5 h-8 w-full rounded-field bg-field px-2.5 text-[12px] text-ink outline-none placeholder:text-label focus:ring-2 focus:ring-ink"
      />
    </div>
  );
}
