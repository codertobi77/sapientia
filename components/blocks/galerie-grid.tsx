"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalerieItem } from "@/lib/data";

export function GalerieGrid({
  items,
  categories,
}: {
  items: GalerieItem[];
  categories: string[];
}) {
  const [active, setActive] = useState<string>("ALL");
  const [open, setOpen] = useState<GalerieItem | null>(null);

  const filtered =
    active === "ALL" ? items : items.filter((i) => i.categorie === active);

  return (
    <>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <Chip active={active === "ALL"} onClick={() => setActive("ALL")}>
            Toutes
          </Chip>
          {categories.map((c) => (
            <Chip key={c} active={active === c} onClick={() => setActive(c)}>
              {c}
            </Chip>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => setOpen(item)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-navy-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={item.titre ?? "Voir le média"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.vignette_url ?? item.url}
              alt={item.titre ?? ""}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors flex items-end p-4">
              <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                {item.titre ?? ""}
              </span>
            </div>
            {item.type === "VIDEO" && (
              <span className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold text-navy">
                <Play className="h-4 w-4" />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-navy/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            onClick={() => setOpen(null)}
            aria-label="Fermer"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {open.type === "VIDEO" ? (
              <video src={open.url} controls className="w-full rounded-2xl bg-black" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={open.url} alt={open.titre ?? ""} className="w-full rounded-2xl" />
            )}
            {open.titre && (
              <p className="mt-4 text-center text-white font-display text-lg">{open.titre}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Chip({
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
        active ? "bg-navy text-white" : "bg-navy-50 text-navy hover:bg-navy-100",
      )}
    >
      {children}
    </button>
  );
}
