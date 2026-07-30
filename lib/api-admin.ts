import { NextResponse } from "next/server";
import { requireAdmin, AdminAuthError } from "@/lib/auth-admin";

/**
 * Garde admin pour route handlers : exécute requireAdmin() et renvoie une
 * NextResponse appropriée (401/403) en cas d'échec, sinon retourne l'admin.
 */
export async function requireAdminOrResponse(): Promise<
  { ok: true; admin: { id: string; email: string } } | { ok: false; response: NextResponse }
> {
  try {
    const admin = await requireAdmin();
    return { ok: true, admin };
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return {
        ok: false,
        response: NextResponse.json({ error: err.message }, { status: err.status }),
      };
    }
    return {
      ok: false,
      response: NextResponse.json({ error: "Erreur d'authentification" }, { status: 500 }),
    };
  }
}
