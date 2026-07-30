import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/api-admin";
import { listInscriptions } from "@/lib/data-admin-inbox";
import { buildCsv } from "@/lib/csv";

export async function GET() {
  const guard = await requireAdminOrResponse();
  if (!guard.ok) return guard.response;

  let inscriptions;
  try {
    inscriptions = await listInscriptions();
  } catch (err) {
    console.error("[admin/inscriptions/export] error", err);
    return NextResponse.json({ error: "Erreur de lecture" }, { status: 500 });
  }

  const headers = [
    "id",
    "created_at",
    "nom",
    "prenom",
    "email",
    "telephone",
    "formation",
    "statut",
    "note_admin",
  ];
  const rows = inscriptions.map((i) => [
    i.id,
    i.created_at,
    i.nom,
    i.prenom,
    i.email,
    i.telephone ?? "",
    i.formation_titre ?? "",
    i.statut,
    i.note_admin ?? "",
  ]);
  const csv = buildCsv(headers, rows);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscriptions.csv"`,
    },
  });
}
