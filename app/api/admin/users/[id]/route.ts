import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/api-admin";
import { updateProfile, type UserRole } from "@/lib/data-admin-inbox";

const ROLES: UserRole[] = ["ADMIN", "ETUDIANT", "ENSEIGNANT"];

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
  const patch: {
    role?: UserRole;
    actif?: boolean;
    name?: string | null;
    telephone?: string | null;
  } = {};

  if (typeof b?.role === "string" && ROLES.includes(b.role as UserRole)) {
    patch.role = b.role as UserRole;
  }
  if (typeof b?.actif === "boolean") {
    patch.actif = b.actif;
  }
  if (typeof b?.name === "string") {
    patch.name = b.name.trim() || null;
  }
  if (typeof b?.telephone === "string") {
    patch.telephone = b.telephone.trim() || null;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Aucune modification valide" }, { status: 400 });
  }

  try {
    const updated = await updateProfile(id, patch);
    if (!updated) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }
    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("[admin/users] update error", err);
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }
}
