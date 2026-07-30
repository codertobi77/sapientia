"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Tabs léger (pas de @radix-ui). Contrôlé par `value`/`onValueChange`, ou
 * non-contrôlé via `defaultValue`. Accessibilité minimale : role=tablist/tab,
 * aria-selected, navigation par flèches gauche/droite sur le rail.
 */

type TabsCtx = {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
};

const TabsContext = React.createContext<TabsCtx | null>(null);

function useTabsCtx(c: React.ReactNode): TabsCtx {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {
    throw new Error(
      `Tabs primitives doivent être utilisées à l'intérieur de <Tabs> (enfant: ${c}).`,
    );
  }
  return ctx;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const baseId = React.useId();
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const current = value ?? internal;
  const setValue = React.useCallback(
    (v: string) => {
      if (value === undefined) setInternal(v);
      onValueChange?.(v);
    },
    [value, onValueChange],
  );
  const ctx = React.useMemo(
    () => ({ value: current, setValue, baseId }),
    [current, setValue, baseId],
  );
  return (
    <TabsContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-navy-50 p-1",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value">) {
  const ctx = useTabsCtx(children);
  const active = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={active}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      data-state={active ? "active" : "inactive"}
      onClick={() => ctx.setValue(value)}
      className={cn(
        "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
        active
          ? "bg-navy text-white shadow-premium"
          : "text-navy hover:text-navy/70",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = useTabsCtx(children);
  if (ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      className={cn("mt-4", className)}
    >
      {children}
    </div>
  );
}
