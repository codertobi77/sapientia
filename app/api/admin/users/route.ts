import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/api-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { listProfiles, createAdminUser, type UserRole } from "@/lib/data-admin-inbox";

const ROLES: UserRole[] = ["ADMIN", "ETUDIANT", "ENSEIGNANT"];

export async function GET() {
  const guard = await requireAdminOrResponse();
  if (!guard.ok) return guard.response;

  try {
    const profiles = await listProfiles();
    return NextResponse.json({ data: profiles });
  } catch (err) {
    console.error("[admin/users] list error", err);
    return NextResponse.json({ error: "Erreur de lecture" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard = await requireAdminOrResponse();
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const b = (body ?? null) as Record<string, unknown> | null;
  const email = typeof b?.email === "string" ? b.email.trim().toLowerCase() : "";
  const password = typeof b?.password === "string" ? b.password : "";
  const name = typeof b?.name === "string" ? b.name.trim() : undefined;
  const role =
    typeof b?.role === "string" && ROLES.includes(b.role as UserRole)
      ? (b.role as UserRole)
      : "ADMIN";

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "E-mail valide requis" }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Mot de passe d'au moins 8 caractères requis" },
      { status: 400 },
    );
  }

  try {
    const created = await createAdminUser({ email, password, name });
    // Applique le rôle demandé (défaut ADMIN déjà mis par createAdminUser).
    // Si rôle != ADMIN, on surcharge dans profil — utile pour créer un ETUDIANT/ENSEIGNANT depuis l'admin.
    if (role !== "ADMIN") {
      const supabase = createAdminClient();
      if (supabase) {
        await supabase.from("profiles").update({ role }).eq("id", created.id);
      }
    }
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur de création";
    console.error("[admin/users] create error", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
