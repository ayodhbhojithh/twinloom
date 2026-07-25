"use client";

import { useState } from "react";
import { LayoutPanelLeft, Rows3 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BlueprintLayout, LanesLayout } from "./layouts";
import { ScopeProvider } from "./scope-context";

export type EstimatorLayout = "blueprint" | "lanes";

interface ScopeEstimatorProps {
  defaultLayout?: EstimatorLayout;
  /**
   * Both layouts were signed off as candidates, so the switcher ships until one
   * is chosen. Drop this to false and the estimator renders the default only.
   */
  allowLayoutSwitch?: boolean;
}

/**
 * The estimator. One scope provider wraps both layouts, so switching view keeps
 * every tick, every collapsed group and the running total exactly as they were.
 */
export function ScopeEstimator({
  defaultLayout = "blueprint",
  allowLayoutSwitch = true,
}: ScopeEstimatorProps) {
  const [layout, setLayout] = useState<EstimatorLayout>(defaultLayout);

  if (!allowLayoutSwitch) {
    return (
      <ScopeProvider>
        {defaultLayout === "blueprint" ? <BlueprintLayout /> : <LanesLayout />}
      </ScopeProvider>
    );
  }

  return (
    <ScopeProvider>
      <Tabs
        value={layout}
        onValueChange={(value) => setLayout(value as EstimatorLayout)}
        className="gap-3"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <TabsList className="h-9">
            <TabsTrigger value="blueprint" className="px-3">
              <LayoutPanelLeft data-icon="inline-start" aria-hidden />
              Blueprint
            </TabsTrigger>
            <TabsTrigger value="lanes" className="px-3">
              <Rows3 data-icon="inline-start" aria-hidden />
              Lanes
            </TabsTrigger>
          </TabsList>

          <p className="font-mono text-[10px] tracking-[0.04em] text-ink-5">
            two layouts, one scope. Ticks carry across.
          </p>
        </div>

        <TabsContent value="blueprint">
          <BlueprintLayout />
        </TabsContent>
        <TabsContent value="lanes">
          <LanesLayout />
        </TabsContent>
      </Tabs>
    </ScopeProvider>
  );
}
