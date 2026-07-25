"use client";

import {
  Cookie,
  LayoutGrid,
  LineChart,
  Mail,
  MessagesSquare,
  MousePointerClick,
  Newspaper,
  PanelBottom,
  PanelTop,
  PenLine,
  Quote,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

import {
  componentVisual,
  gradientVars,
  money,
  type ComponentIconName,
  type ScopeComponent,
} from "@/lib/scope";
import { cn } from "@/lib/utils";

import { useScope } from "../scope-context";

const ICONS: Record<ComponentIconName, LucideIcon> = {
  PanelTop,
  PanelBottom,
  Sparkles,
  Target,
  LayoutGrid,
  Quote,
  MousePointerClick,
  Mail,
  Users,
  Newspaper,
  MessagesSquare,
  ShieldCheck,
  Cookie,
  Search,
  PenLine,
  LineChart,
  ServerCog,
};

/**
 * One portal circle. Unlit it is a grey disc with a "from" price; lit it fills
 * with its gradient and glows, and shows what it is actually contributing.
 *
 * A tap adds or removes the whole component. The detail table underneath is
 * where a specific mix of options gets chosen, and the two stay in sync because
 * they read and write the same scope.
 */
export function PortalCircle({ component }: { component: ScopeComponent }) {
  const {
    totals,
    isComponentIncluded,
    toggleComponentInclusion,
    focusedComponentId,
  } = useScope();

  const visual = componentVisual(component.id);
  const Icon = ICONS[visual.icon];

  const subtotal = totals.componentTotals[component.id] ?? 0;
  const included = isComponentIncluded(component.id);
  const focused = focusedComponentId === component.id;
  const fromPrice = Math.min(...component.options.map((option) => option.price));

  return (
    <button
      type="button"
      role="switch"
      aria-checked={included}
      aria-label={`${component.name}, ${
        included ? `${money(subtotal)} included` : "not included"
      }`}
      onClick={() => toggleComponentInclusion(component.id)}
      style={gradientVars(visual.gradient)}
      className={cn(
        "group flex flex-col items-center gap-2.5 rounded-2xl px-2 pt-5 pb-4 text-center transition-colors",
        focused ? "bg-sunken" : "hover:bg-sunken",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-[66px] items-center justify-center rounded-full transition-all duration-[250ms] sm:size-[78px]",
          included
            ? "bg-[linear-gradient(135deg,var(--grad-from),var(--grad-to))] text-white shadow-[0_16px_30px_-12px_var(--grad-glow)]"
            : "bg-portal text-ink-5 group-hover:text-ink-4",
        )}
      >
        <Icon className="size-6 sm:size-7" strokeWidth={1.8} />
      </span>

      <span className="font-mono text-[11px] font-semibold tracking-[0.1em] uppercase sm:text-[11.5px] sm:tracking-[0.12em]">
        {visual.label}
      </span>

      <span className="font-mono text-[11px] tabular-nums text-mono">
        {included ? money(subtotal) : `from ${money(fromPrice)}`}
      </span>

      <span
        className={cn(
          "font-mono text-[10px] font-semibold tracking-[0.1em] uppercase",
          included ? "text-live" : "text-ink-5",
        )}
      >
        {included ? "● added" : "+ add"}
      </span>
    </button>
  );
}
