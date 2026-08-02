"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { actualiteTypeLabel, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Actualite } from "@/lib/data";

export function ActualitesList({
  actualites,
  types,
}: {
  actualites: Actualite[];
  types: string[];
}) {
  const [active, setActive] = useState<string>("ALL");

  const filtered =
    active === "ALL" ? actualites : actualites.filter((a) => a.type === active);

  return (
    <>
      {/* Filtres */}
      {types.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <FilterChip active={active === "ALL"} onClick={() => setActive("ALL")}>
            Toutes
          </FilterChip>
          {types.map((t) => (
            <FilterChip key={t} active={active === t} onClick={() => setActive(t)}>
              {actualiteTypeLabel(t)}
            </FilterChip>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-slate text-center py-20">
          Aucune actualité pour le moment. Revenez bientôt.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((a) => (
            <Card key={a.id} className="group overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300 hover:shadow-premium-lg">
              <div className="relative h-44 bg-gradient-to-br from-navy to-navy-700 flex items-center justify-center">
                {a.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image_url} alt={a.titre} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-white/40 text-sm">EFES-SAPIENTIA</span>
                )}
                <Badge variant="gold" className="absolute top-4 left-4">
                  {actualiteTypeLabel(a.type)}
                </Badge>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs text-muted mb-2">{formatDate(a.date)}</p>
                <h2 className="font-display text-lg font-bold text-navy">{a.titre}</h2>
                <p className="mt-2 text-sm text-slate leading-relaxed flex-1">
                  {a.extrait ?? ""}
                </p>
                <Link
                  href={`/actualites/${a.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:gap-2.5 transition-all"
                >
                  Lire l'article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "bg-navy text-white"
          : "bg-navy-50 text-navy hover:bg-navy-100",
      )}
    >
      {children}
    </button>
  );
}
