import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/api-admin";
import { toggleDesinscription } from "@/lib/data-admin-inbox";

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

  const b = (body ?? null) as Record<string, unknown> | null;
  if (typeof b?.desinscrit !== "boolean") {
    return NextResponse.json(
      { error: "Champ 'desinscrit' (booléen) requis" },
      { status: 400 },
    );
  }

  try {
    const updated = await toggleDesinscription(id, b.desinscrit);
    if (!updated) {
      return NextResponse.json({ error: "Abonné introuvable" }, { status: 404 });
    }
    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("[admin/newsletter] update error", err);
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }
}
