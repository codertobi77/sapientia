"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {}

/**
 * Toggle on/off accessible (input type=checkbox role=switch) stylisé. Pas de
 * dépendance externe. Utiliser `checked` + `onChange` pour le contrôle, ou
 * `defaultChecked` pour non-contrôlé.
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => (
    <span className="relative inline-flex h-6 w-11 align-middle">
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className={cn(
          "peer h-6 w-11 cursor-pointer appearance-none rounded-full bg-slate-200 transition-colors",
          "checked:bg-gold",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          className,
        )}
        {...props}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-0.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
      />
    </span>
  ),
);
Switch.displayName = "Switch";
