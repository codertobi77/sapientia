import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/api-admin";
import { getDevis, updateDevis, type DemandeStatut } from "@/lib/data-admin-inbox";

const STATUTS: DemandeStatut[] = ["EN_ATTENTE", "TRAITEE", "REFUSEE"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminOrResponse();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  try {
    const devis = await getDevis(id);
    if (!devis) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }
    return NextResponse.json({ data: devis });
  } catch (err) {
    console.error("[admin/devis] detail error", err);
    return NextResponse.json({ error: "Erreur de lecture" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminOrResponse();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const patch: { statut?: DemandeStatut; note_admin?: string | null } = {};
  if (typeof body === "object" && body !== null) {
    const b = body as Record<string, unknown>;
    if (typeof b.statut === "string" && STATUTS.includes(b.statut as DemandeStatut)) {
      patch.statut = b.statut as DemandeStatut;
    }
    if (typeof b.note_admin === "string") {
      patch.note_admin = b.note_admin.trim() || null;
    } else if (b.note_admin === null) {
      patch.note_admin = null;
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Aucune modification valide" }, { status: 400 });
  }

  try {
    const updated = await updateDevis(id, patch);
    if (!updated) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }
    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("[admin/devis] update error", err);
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }
}
