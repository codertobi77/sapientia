"use client";

import * as React from "react";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

/**
 * DataTable générique (client) pour le back-office.
 *
 * - Colonnes : { key, label, render?, sortable? (défaut true), className? }
 * - Recherche client sur `searchKeys` (chaînes de la row).
 * - Tri asc/desc au clic sur l'en-tête (toggle) ; colonne désactivable via
 *   sortable:false.
 * - Pagination client 10/page (constante PAGE_SIZE).
 * - `getRowId` requis pour les clés React des lignes.
 *
 * Pas de dépendance externe. Réutilise components/ui/table.
 */

const PAGE_SIZE = 10;

export type Column<T> = {
  key: keyof T & string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
};

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  searchKeys,
  getRowId,
  searchPlaceholder = "Rechercher…",
  emptyLabel = "Aucune donnée.",
}: {
  columns: Column<T>[];
  rows: T[];
  searchKeys: (keyof T & string)[];
  getRowId: (row: T) => string;
  searchPlaceholder?: string;
  emptyLabel?: string;
}) {
  const [query, setQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [dir, setDir] = React.useState<"asc" | "desc">("asc");
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      searchKeys.some((k) => {
        const v = r[k];
        return v != null ? String(v).toLowerCase().includes(q) : false;
      }),
    );
  }, [rows, query, searchKeys]);

  const sorted = React.useMemo(() => {
    if (!sortKey) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") {
        return dir === "asc" ? av - bv : bv - av;
      }
      const as = String(av);
      const bs = String(bv);
      return dir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    });
    return copy;
  }, [filtered, sortKey, dir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = sorted.slice(start, start + PAGE_SIZE);

  function toggleSort(key: string, sortable?: boolean) {
    if (sortable === false) return;
    if (sortKey === key) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDir("asc");
    }
    setPage(1);
  }

  return (
    <div className="space-y-3">
      {/* Recherche */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder={searchPlaceholder}
          className="h-10 w-full rounded-xl border border-border bg-white pl-9 pr-4 text-sm text-ink placeholder:text-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
        />
      </div>

      {/* Table */}
      {pageRows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-cream/30 px-6 py-10 text-center text-sm text-muted">
          {emptyLabel}
        </div>
      ) : (
        <Table>
          <THead>
            <TR>
              {columns.map((col) => {
                const isSortable = col.sortable !== false;
                const active = sortKey === col.key;
                return (
                  <TH
                    key={col.key}
                    className={cn(
                      isSortable
                        ? "cursor-pointer select-none hover:bg-navy-50"
                        : "cursor-default",
                      col.className,
                    )}
                    onClick={isSortable ? () => toggleSort(col.key, col.sortable) : undefined}
                    aria-sort={
                      active ? (dir === "asc" ? "ascending" : "descending") : "none"
                    }
                  >
                    <span className={cn("inline-flex items-center gap-1", isSortable && "group")}>
                      {col.label}
                      {active ? (
                        dir === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" aria-hidden />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                        )
                      ) : isSortable ? (
                        <ChevronDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-40" aria-hidden />
                      ) : null}
                    </span>
                  </TH>
                );
              })}
            </TR>
          </THead>
          <TBody>
            {pageRows.map((row, i) => (
              <TR key={getRowId(row)} data-odd={i % 2 === 1}>
                {columns.map((col) => (
                  <TD key={col.key} className={col.className}>
                    {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                  </TD>
                ))}
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-xs text-muted">
          {sorted.length} élément{sorted.length > 1 ? "s" : ""} · page {safePage} / {pageCount}
        </p>
        <div className="flex items-center gap-1">
          <PgBtn onClick={() => setPage(1)} disabled={safePage <= 1} label="Première">
            <ChevronsLeft className="h-4 w-4" />
          </PgBtn>
          <PgBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} label="Précédente">
            <ChevronLeft className="h-4 w-4" />
          </PgBtn>
          <PgBtn
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={safePage >= pageCount}
            label="Suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </PgBtn>
          <PgBtn onClick={() => setPage(pageCount)} disabled={safePage >= pageCount} label="Dernière">
            <ChevronsRight className="h-4 w-4" />
          </PgBtn>
        </div>
      </div>
    </div>
  );
}

function PgBtn({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-navy transition-colors hover:bg-navy-50 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      {children}
    </button>
  );
}
