/* ---------------------------------------------------------------------------
   The live mock-up: a wireframe of the site that reads its state straight off
   the scope. Every entry points at a component id, so a block tints itself,
   prices itself and jumps to its row without knowing anything else.

   `weight` is a relative height. The layouts set a `--mock-unit` length and
   each block resolves to `weight * unit`, which is how one set of numbers
   serves the compact blueprint rail and the full width lanes mock-up.
--------------------------------------------------------------------------- */

export interface MockupBlock {
  componentId: string;
  label: string;
  weight: number;
}

export interface MockupChip {
  componentId: string;
  label: string;
}

/** Home page, top to bottom. */
export const HOME_BLOCKS: readonly MockupBlock[] = [
  { componentId: "header", label: "Header", weight: 22 },
  { componentId: "hero", label: "Hero", weight: 54 },
  { componentId: "value", label: "Value prop", weight: 24 },
  { componentId: "services", label: "Services", weight: 50 },
  { componentId: "testimonials", label: "Social proof", weight: 34 },
  { componentId: "cta", label: "CTA band", weight: 26 },
  { componentId: "contact", label: "Contact form", weight: 44 },
  { componentId: "footer", label: "Footer", weight: 26 },
] as const;

/** Pages other than home. */
export const OTHER_PAGES: readonly MockupChip[] = [
  { componentId: "about", label: "About" },
  { componentId: "blog", label: "Blog and news" },
  { componentId: "faq", label: "FAQ" },
] as const;

/** Work that has no place on the wireframe but is still in the build. */
export const WORK_UNDERNEATH: readonly MockupChip[] = [
  { componentId: "seo", label: "SEO" },
  { componentId: "copy", label: "Copywriting" },
  { componentId: "analytics", label: "Analytics" },
  { componentId: "hosting", label: "Hosting and SSL" },
  { componentId: "privacy", label: "Privacy policy" },
  { componentId: "cookie", label: "Cookie banner" },
] as const;
