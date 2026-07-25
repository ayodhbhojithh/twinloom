import type { CapturedFileKind } from "./types";

/** Caps from TCT_Scope_Spec.md §5.2. */
export const MAX_FILE_BYTES = 20 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 100 * 1024 * 1024;

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

const KINDS: { kind: CapturedFileKind; types: string[]; extensions: string[] }[] =
  [
    { kind: "image", types: IMAGE_TYPES, extensions: [".png", ".jpg", ".jpeg", ".webp", ".svg"] },
    { kind: "pdf", types: ["application/pdf"], extensions: [".pdf"] },
    {
      kind: "doc",
      types: [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      extensions: [".doc", ".docx"],
    },
    {
      kind: "sheet",
      types: [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
      extensions: [".xls", ".xlsx"],
    },
    {
      kind: "slides",
      types: [
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ],
      extensions: [".ppt", ".pptx"],
    },
    { kind: "text", types: ["text/plain"], extensions: [".txt"] },
  ];

/** The accept attribute for the file input, built from the same source of truth. */
export const ACCEPT_ATTRIBUTE = KINDS.flatMap((entry) => [
  ...entry.types,
  ...entry.extensions,
]).join(",");

function kindOf(file: File): CapturedFileKind | null {
  const name = file.name.toLowerCase();

  for (const entry of KINDS) {
    if (entry.types.includes(file.type)) return entry.kind;
    if (entry.extensions.some((extension) => name.endsWith(extension)))
      return entry.kind;
  }

  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export type FileCheck =
  | { ok: true; kind: CapturedFileKind }
  | { ok: false; reason: string };

/** Friendly errors on reject, as the spec asks for. */
export function checkFile(file: File, bytesAlready: number): FileCheck {
  const kind = kindOf(file);

  if (!kind) {
    return {
      ok: false,
      reason: `${file.name} is not a type we can read. Images, PDF, Word, Excel, PowerPoint and text files are fine.`,
    };
  }

  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      reason: `${file.name} is ${formatBytes(file.size)}. The limit per file is ${formatBytes(MAX_FILE_BYTES)}.`,
    };
  }

  if (bytesAlready + file.size > MAX_TOTAL_BYTES) {
    return {
      ok: false,
      reason: `${file.name} would take you over the ${formatBytes(MAX_TOTAL_BYTES)} total. Remove something first.`,
    };
  }

  return { ok: true, kind };
}
