import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/api-admin";
import { markMessageRead } from "@/lib/data-admin-inbox";

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
  if (typeof b?.lu !== "boolean") {
    return NextResponse.json({ error: "Champ 'lu' (booléen) requis" }, { status: 400 });
  }

  try {
    const updated = await markMessageRead(id, b.lu);
    if (!updated) {
      return NextResponse.json({ error: "Message introuvable" }, { status: 404 });
    }
    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("[admin/messages] update error", err);
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }
}
