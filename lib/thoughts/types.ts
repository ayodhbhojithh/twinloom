/**
 * The Thoughts and inspiration session, shaped to the `panel` branch of the data
 * model in TCT_Scope_Spec.md §6.
 */

export type CapturedFileKind = "image" | "pdf" | "doc" | "sheet" | "slides" | "text";

export interface CapturedFile {
  id: string;
  name: string;
  kind: CapturedFileKind;
  size: number;
  /** The client's own words on why they added it. Goes into the plan verbatim. */
  explain: string;
  /** Object URL for images. Held in memory only, revoked on remove. */
  previewUrl?: string;
}

export interface PaletteColour {
  id: string;
  hex: string;
  /** How heavy this colour should be. The palette always sums to 100. */
  weight: number;
}

export interface ReferenceLink {
  id: string;
  url: string;
  note: string;
}

export interface ThoughtsSession {
  files: CapturedFile[];
  colours: PaletteColour[];
  links: ReferenceLink[];
  notes: string;
}

/** Only the serialisable parts. Files are uploaded separately. */
export interface StoredThoughts {
  colours: PaletteColour[];
  links: ReferenceLink[];
  notes: string;
}
