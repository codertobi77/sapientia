const ACTUALITE_LABELS: Record<string, string> = {
  EVENEMENT: "Événement",
  SEMINAIRE: "Séminaire",
  CONCOURS: "Concours",
  PARTENARIAT: "Partenariat",
  NOUVELLE_FORMATION: "Nouvelle formation",
  COMMUNIQUE: "Communiqué",
};

export function actualiteTypeLabel(type: string): string {
  return ACTUALITE_LABELS[type] ?? type;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
