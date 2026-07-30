import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * STUB — admin-foundations doit fournir la version canonique (ex: avec tri,
 * pagination, recherche). Ici une version minimaliste présentationnelle
 * utilisée par les pages de liste admin (Server Components) : on lui passe
 * les colonnes (libellé + rendu de cellule) et les données.
 */

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  emptyLabel?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  emptyLabel = "Aucun enregistrement.",
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white p-10 text-center text-sm text-muted">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-premium">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-navy-50 text-navy">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn("px-4 py-3 text-left font-semibold whitespace-nowrap", c.className)}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-cream/50 transition-colors">
              {columns.map((c) => (
                <td key={c.key} className={cn("px-4 py-3 align-middle", c.className)}>
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
