import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Carte de statistique du tableau de bord : icône + valeur + label.
 * `hint` = petit sous-texte optionnel (ex. "en attente").
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white p-5 shadow-premium",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-muted">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-50 text-navy">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <p className="mt-2 text-3xl font-bold text-navy tabular-nums">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
