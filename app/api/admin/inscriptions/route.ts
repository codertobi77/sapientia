import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/api-admin";
import { listInscriptions, type DemandeStatut } from "@/lib/data-admin-inbox";

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
    const inscriptions = await listInscriptions(statut);
    return NextResponse.json({ data: inscriptions });
  } catch (err) {
    console.error("[admin/inscriptions] list error", err);
    return NextResponse.json({ error: "Erreur de lecture" }, { status: 500 });
  }
}
