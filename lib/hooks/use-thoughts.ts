"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { checkFile } from "@/lib/thoughts/files";
import {
  evenWeights,
  MAX_COLOURS,
  moveColour,
  normaliseHex,
  rebalanceWeights,
} from "@/lib/thoughts/palette";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  update,
} from "@/lib/thoughts/store";
import type {
  CapturedFile,
  PaletteColour,
  ReferenceLink,
} from "@/lib/thoughts/types";

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export interface ThoughtsController {
  open: boolean;
  setOpen: (open: boolean) => void;

  /** The Colour Studio. Its modal renders outside the panel, so its open state
   *  has to live here rather than inside the colours section. */
  studioOpen: boolean;
  openStudio: () => void;
  closeStudio: () => void;

  files: CapturedFile[];
  addFiles: (incoming: FileList | File[]) => void;
  explainFile: (id: string, explain: string) => void;
  removeFile: (id: string) => void;
  /** Friendly rejection messages from the last add. */
  errors: string[];
  dismissErrors: () => void;

  colours: PaletteColour[];
  addColour: (hex: string) => void;
  setColourWeight: (id: string, weight: number) => void;
  nudgeColour: (id: string, direction: -1 | 1) => void;
  removeColour: (id: string) => void;
  colourLimit: number;

  links: ReferenceLink[];
  addLink: (url: string, note: string) => void;
  removeLink: (id: string) => void;

  notes: string;
  setNotes: (notes: string) => void;

  /** Total items captured. Drives the launcher badge. */
  count: number;
}

/**
 * The Thoughts and inspiration session.
 *
 * Colours, links and notes come from the session store, so they survive
 * navigation and a reload (TCT_Scope_Spec.md §5.7). Files stay in component
 * state: a File cannot be serialised, and they are uploaded separately anyway.
 */
export function useThoughts(): ThoughtsController {
  const stored = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const [open, setOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [files, setFiles] = useState<CapturedFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  /* Object URLs are the one thing here that leaks if ignored. */
  const previewUrls = useRef(new Set<string>());
  useEffect(
    () => () => {
      for (const url of previewUrls.current) URL.revokeObjectURL(url);
      previewUrls.current.clear();
    },
    [],
  );

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    if (!list.length) return;

    setFiles((current) => {
      let bytes = current.reduce((sum, file) => sum + file.size, 0);
      const accepted: CapturedFile[] = [];
      const rejected: string[] = [];

      for (const file of list) {
        const check = checkFile(file, bytes);

        if (!check.ok) {
          rejected.push(check.reason);
          continue;
        }

        bytes += file.size;

        let previewUrl: string | undefined;
        if (check.kind === "image") {
          previewUrl = URL.createObjectURL(file);
          previewUrls.current.add(previewUrl);
        }

        accepted.push({
          id: newId(),
          name: file.name,
          kind: check.kind,
          size: file.size,
          explain: "",
          previewUrl,
        });
      }

      setErrors(rejected);
      return accepted.length ? [...current, ...accepted] : current;
    });
  }, []);

  const explainFile = useCallback((id: string, explain: string) => {
    setFiles((current) =>
      current.map((file) => (file.id === id ? { ...file, explain } : file)),
    );
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((current) => {
      const target = current.find((file) => file.id === id);

      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
        previewUrls.current.delete(target.previewUrl);
      }

      return current.filter((file) => file.id !== id);
    });
  }, []);

  const dismissErrors = useCallback(() => setErrors([]), []);

  const addColour = useCallback((input: string) => {
    const hex = normaliseHex(input);

    if (!hex) {
      setErrors([`"${input}" is not a colour code. Try something like #2f6fb0.`]);
      return;
    }

    update((current) => {
      if (current.colours.length >= MAX_COLOURS) return current;
      if (current.colours.some((colour) => colour.hex === hex)) return current;

      return {
        ...current,
        colours: evenWeights([
          ...current.colours,
          { id: newId(), hex, weight: 0 },
        ]),
      };
    });
  }, []);

  const setColourWeight = useCallback((id: string, weight: number) => {
    update((current) => ({
      ...current,
      colours: rebalanceWeights(current.colours, id, weight),
    }));
  }, []);

  const nudgeColour = useCallback((id: string, direction: -1 | 1) => {
    update((current) => ({
      ...current,
      colours: moveColour(current.colours, id, direction),
    }));
  }, []);

  const removeColour = useCallback((id: string) => {
    update((current) => ({
      ...current,
      colours: evenWeights(
        current.colours.filter((colour) => colour.id !== id),
      ),
    }));
  }, []);

  const addLink = useCallback((url: string, note: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;

    const withScheme = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    update((current) => ({
      ...current,
      links: [
        ...current.links,
        { id: newId(), url: withScheme, note: note.trim() },
      ],
    }));
  }, []);

  const removeLink = useCallback((id: string) => {
    update((current) => ({
      ...current,
      links: current.links.filter((link) => link.id !== id),
    }));
  }, []);

  const setNotes = useCallback((notes: string) => {
    update((current) => ({ ...current, notes }));
  }, []);

  const count = useMemo(
    () =>
      files.length +
      stored.colours.length +
      stored.links.length +
      (stored.notes.trim() ? 1 : 0),
    [files.length, stored.colours.length, stored.links.length, stored.notes],
  );

  const openStudio = useCallback(() => setStudioOpen(true), []);
  const closeStudio = useCallback(() => setStudioOpen(false), []);

  return {
    open,
    setOpen,
    studioOpen,
    openStudio,
    closeStudio,
    files,
    addFiles,
    explainFile,
    removeFile,
    errors,
    dismissErrors,
    colours: stored.colours,
    addColour,
    setColourWeight,
    nudgeColour,
    removeColour,
    colourLimit: MAX_COLOURS,
    links: stored.links,
    addLink,
    removeLink,
    notes: stored.notes,
    setNotes,
    count,
  };
}
