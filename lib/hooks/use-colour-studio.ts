"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { hsvToHex, hsvToRgb, rgbToHsv, type Hsv, type Rgb } from "@/lib/colour/convert";

export interface TrayImage {
  id: string;
  /** Data URL, so a snapshot and a dropped file behave identically. */
  url: string;
  name: string;
  image: HTMLImageElement;
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export interface StudioController {
  /** Images held for picking. Several at once, switch between them freely. */
  tray: TrayImage[];
  activeId: string | null;
  active: TrayImage | null;
  addImageFromFile: (file: File) => void;
  addImageFromUrl: (url: string, name: string) => void;
  selectImage: (id: string) => void;
  removeImage: (id: string) => void;

  /** The colour being tuned. */
  hsv: Hsv;
  rgb: Rgb;
  hex: string;
  setHsv: (hsv: Hsv) => void;
  setFromRgb: (rgb: Rgb) => void;
  setFromHex: (hex: string) => boolean;

  /** A one line explanation when a browser only feature is unavailable. */
  note: string | null;
  setNote: (note: string | null) => void;
}

/**
 * Everything the Colour Studio holds while it is open.
 *
 * Images are decoded once into an HTMLImageElement so the canvas, the loupe and
 * auto-pick all read the same decoded bitmap rather than decoding three times.
 */
export function useColourStudio(): StudioController {
  const [tray, setTray] = useState<TrayImage[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hsv, setHsv] = useState<Hsv>({ h: 210, s: 0.6, v: 0.7 });
  const [note, setNote] = useState<string | null>(null);

  const noteTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (noteTimer.current) window.clearTimeout(noteTimer.current);
    },
    [],
  );

  const showNote = useCallback((next: string | null) => {
    setNote(next);

    if (noteTimer.current) window.clearTimeout(noteTimer.current);
    if (next) {
      noteTimer.current = window.setTimeout(() => setNote(null), 8000);
    }
  }, []);

  const addImageFromUrl = useCallback(
    (url: string, name: string) => {
      const image = new Image();

      image.onload = () => {
        const entry: TrayImage = { id: newId(), url, name, image };
        setTray((current) => [...current, entry]);
        setActiveId(entry.id);
      };

      image.onerror = () => showNote("That image could not be read.");
      image.src = url;
    },
    [showNote],
  );

  const addImageFromFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result;
        if (typeof url === "string") addImageFromUrl(url, file.name);
      };
      reader.onerror = () => showNote(`${file.name} could not be read.`);
      reader.readAsDataURL(file);
    },
    [addImageFromUrl, showNote],
  );

  const selectImage = useCallback((id: string) => setActiveId(id), []);

  const removeImage = useCallback((id: string) => {
    setTray((current) => {
      const index = current.findIndex((entry) => entry.id === id);
      if (index === -1) return current;

      const next = current.filter((entry) => entry.id !== id);

      setActiveId((currentActive) => {
        if (currentActive !== id) return currentActive;
        if (!next.length) return null;
        return next[Math.min(index, next.length - 1)].id;
      });

      return next;
    });
  }, []);

  const setFromRgb = useCallback((rgb: Rgb) => setHsv(rgbToHsv(rgb)), []);

  const setFromHex = useCallback(
    (value: string) => {
      const trimmed = value.trim().replace(/^#/, "");
      const expanded = /^[0-9a-f]{3}$/i.test(trimmed)
        ? trimmed
            .split("")
            .map((character) => character + character)
            .join("")
        : trimmed;

      if (!/^[0-9a-f]{6}$/i.test(expanded)) return false;

      setFromRgb({
        r: parseInt(expanded.slice(0, 2), 16),
        g: parseInt(expanded.slice(2, 4), 16),
        b: parseInt(expanded.slice(4, 6), 16),
      });

      return true;
    },
    [setFromRgb],
  );

  const active = tray.find((entry) => entry.id === activeId) ?? null;

  return {
    tray,
    activeId,
    active,
    addImageFromFile,
    addImageFromUrl,
    selectImage,
    removeImage,
    hsv,
    rgb: hsvToRgb(hsv),
    hex: hsvToHex(hsv),
    setHsv,
    setFromRgb,
    setFromHex,
    note,
    setNote: showNote,
  };
}
