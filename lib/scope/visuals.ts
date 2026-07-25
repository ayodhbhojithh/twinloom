import type { CSSProperties } from "react";

/* ---------------------------------------------------------------------------
   Portal circle presentation, one entry per scope component.

   The gradients are the prototype's own set (option 2a). Everything here is
   visual: nothing in this file can change a price, which is why it lives apart
   from the catalogue.
--------------------------------------------------------------------------- */

/** lucide-react icon names, resolved by the component that draws the circle. */
export type ComponentIconName =
  | "PanelTop"
  | "PanelBottom"
  | "Sparkles"
  | "Target"
  | "LayoutGrid"
  | "Quote"
  | "MousePointerClick"
  | "Mail"
  | "Users"
  | "Newspaper"
  | "MessagesSquare"
  | "ShieldCheck"
  | "Cookie"
  | "Search"
  | "PenLine"
  | "LineChart"
  | "ServerCog";

export interface ComponentVisual {
  /** Short label. Component names are too long for a mono uppercase caption. */
  label: string;
  icon: ComponentIconName;
  gradient: readonly [string, string];
}

const FALLBACK: ComponentVisual = {
  label: "Component",
  icon: "LayoutGrid",
  gradient: ["#7c3aed", "#a78bfa"],
};

export const COMPONENT_VISUALS: Readonly<Record<string, ComponentVisual>> = {
  header: {
    label: "Header",
    icon: "PanelTop",
    gradient: ["#8b5cf6", "#a78bfa"],
  },
  footer: {
    label: "Footer",
    icon: "PanelBottom",
    gradient: ["#64748b", "#94a3b8"],
  },
  hero: { label: "Hero", icon: "Sparkles", gradient: ["#f59e0b", "#fbbf24"] },
  value: { label: "Value prop", icon: "Target", gradient: ["#14b8a6", "#2dd4bf"] },
  services: {
    label: "Services",
    icon: "LayoutGrid",
    gradient: ["#3b82f6", "#60a5fa"],
  },
  testimonials: {
    label: "Social proof",
    icon: "Quote",
    gradient: ["#10b981", "#34d399"],
  },
  cta: {
    label: "CTA band",
    icon: "MousePointerClick",
    gradient: ["#ec4899", "#f472b6"],
  },
  contact: {
    label: "Contact form",
    icon: "Mail",
    gradient: ["#0ea5e9", "#38bdf8"],
  },
  about: { label: "About", icon: "Users", gradient: ["#d946ef", "#e879f9"] },
  blog: { label: "Blog", icon: "Newspaper", gradient: ["#6366f1", "#818cf8"] },
  faq: {
    label: "FAQ",
    icon: "MessagesSquare",
    gradient: ["#f97316", "#fb923c"],
  },
  privacy: {
    label: "Privacy",
    icon: "ShieldCheck",
    gradient: ["#64748b", "#94a3b8"],
  },
  cookie: { label: "Cookies", icon: "Cookie", gradient: ["#78716c", "#a8a29e"] },
  seo: { label: "SEO", icon: "Search", gradient: ["#14b8a6", "#2dd4bf"] },
  copy: {
    label: "Copywriting",
    icon: "PenLine",
    gradient: ["#3b82f6", "#60a5fa"],
  },
  analytics: {
    label: "Analytics",
    icon: "LineChart",
    gradient: ["#0ea5e9", "#38bdf8"],
  },
  hosting: {
    label: "Hosting",
    icon: "ServerCog",
    gradient: ["#10b981", "#34d399"],
  },
};

export function componentVisual(componentId: string): ComponentVisual {
  return COMPONENT_VISUALS[componentId] ?? FALLBACK;
}

/**
 * Publishes a gradient as CSS variables so a lit circle can carry its own fill
 * and its own glow. The `aa` alpha on the glow is the prototype's value.
 */
export function gradientVars(
  gradient: readonly [string, string],
): CSSProperties {
  return {
    "--grad-from": gradient[0],
    "--grad-to": gradient[1],
    "--grad-glow": `${gradient[0]}aa`,
  } as CSSProperties;
}
