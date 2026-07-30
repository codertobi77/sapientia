// Helpers CSV pour les exports admin (inscriptions, devis, newsletter).

/** Protège une cellule CSV (RFC 4180) et gère null/undefined. */
export function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let s = typeof value === "string" ? value : String(value);
  if (/[",\n\r]/.test(s)) {
    s = `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** Construit une ligne CSV à partir d'un tableau de valeurs. */
export function csvRow(values: unknown[]): string {
  return values.map(csvCell).join(",");
}

/** Construit un CSV complet (en-tête + lignes). */
export function buildCsv(headers: string[], rows: unknown[][]): string {
  return [csvRow(headers), ...rows.map((r) => csvRow(r))].join("\r\n");
}
