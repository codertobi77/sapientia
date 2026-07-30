import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/api-admin";
import { listDevis, type DemandeStatut } from "@/lib/data-admin-inbox";

const STATUTS: DemandeStatut[] = ["EN_ATTENTE", "TRAITEE", "REFUSEE"];

export async function GET(request: Request) {
  const guard = await requireAdminOrResponse();
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const statutParam = url.searchParams.get("statut");
  const statut =
    statutParam && STATUTS.includes(statutParam as DemandeStatut)
      ? (statutParam as DemandeStatut)
      : undefined;

  try {
    const devis = await listDevis(statut);
    return NextResponse.json({ data: devis });
  } catch (err) {
    console.error("[admin/devis] list error", err);
    return NextResponse.json({ error: "Erreur de lecture" }, { status: 500 });
  }
}
