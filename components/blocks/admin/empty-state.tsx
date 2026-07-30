import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * État vide pour les listes admin : icône + titre + description + action
 * optionnelle (ex. bouton "Créer").
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-cream/30 px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <p className="mt-4 text-base font-semibold text-navy">{title}</p>
      {description ? (
        <p className="mt-1 max-w-md text-sm text-muted leading-relaxed">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
