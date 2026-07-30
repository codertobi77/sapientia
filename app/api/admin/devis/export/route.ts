import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/api-admin";
import { listDevis } from "@/lib/data-admin-inbox";
import { buildCsv } from "@/lib/csv";

export async function GET() {
  const guard = await requireAdminOrResponse();
  if (!guard.ok) return guard.response;

  let devis;
  try {
    devis = await listDevis();
  } catch (err) {
    console.error("[admin/devis/export] error", err);
    return NextResponse.json({ error: "Erreur de lecture" }, { status: 500 });
  }

  const headers = [
    "id",
    "created_at",
    "nom",
    "email",
    "telephone",
    "type_formation",
    "niveau",
    "duree",
    "formation",
    "statut",
    "note_admin",
  ];
  const rows = devis.map((d) => [
    d.id,
    d.created_at,
    d.nom,
    d.email,
    d.telephone ?? "",
    d.type_formation,
    d.niveau ?? "",
    d.duree ?? "",
    d.formation_titre ?? "",
    d.statut,
    d.note_admin ?? "",
  ]);
  const csv = buildCsv(headers, rows);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="devis.csv"`,
    },
  });
}
