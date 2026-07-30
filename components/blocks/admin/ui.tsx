import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DemandeStatut } from "@/lib/data-admin-inbox";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        {description && <p className="text-muted mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

const STATUT_VARIANT: Record<
  DemandeStatut,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  EN_ATTENTE: { label: "En attente", variant: "goldLight" },
  TRAITEE: { label: "Traitée", variant: "navyLight" },
  REFUSEE: { label: "Refusée", variant: "neutral" },
};

export function StatutBadge({ statut }: { statut: DemandeStatut }) {
  const v = STATUT_VARIANT[statut] ?? STATUT_VARIANT.EN_ATTENTE;
  return <Badge variant={v.variant}>{v.label}</Badge>;
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-white/60 p-10 text-center text-muted">
      {label}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1")}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="text-sm text-ink">{children}</dd>
    </div>
  );
}
