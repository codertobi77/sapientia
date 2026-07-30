"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * STUB — admin-foundations doit fournir la version canonique (foundations
 * fournit les primitives UI). Bascule « on/off » accessible sans dépendance
 * externe (pas de @radix-ui). Utilisé pour le champ `published`.
 */
export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

export function Switch({ checked, onCheckedChange, disabled, id, ...rest }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-60",
        checked ? "bg-gold" : "bg-border",
      )}
      aria-label={rest["aria-label"]}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}
