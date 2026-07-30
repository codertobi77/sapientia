import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth-admin";
import { MissingAdminClient } from "@/lib/data-admin";

/**
 * Garde d'entrée pour les Route Handlers admin :
 *  - vérifie `requireAdmin()` (cookie session + rôle ADMIN)
 *  - convertit les erreurs en réponses HTTP adaptées.
 * Renvoie l'utilisateur admin ou une `NextResponse` d'erreur.
 * L'appelant doit interrompre en cas de réponse retournée.
 */
export async function adminGuard(): Promise<{ user: null; response: NextResponse } | { user: Awaited<ReturnType<typeof requireAdmin>>; response: null }> {
  try {
    const user = await requireAdmin();
    return { user, response: null };
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return {
        user: null,
        response: NextResponse.json(
          { error: e.message },
          { status: e.notAdmin ? 403 : 401 },
        ),
      };
    }
    if (e instanceof MissingAdminClient) {
      return {
        user: null,
        response: NextResponse.json({ error: e.message }, { status: 503 }),
      };
    }
    return {
      user: null,
      response: NextResponse.json({ error: "Erreur d'authentification" }, { status: 500 }),
    };
  }
}

/** Parse un corps JSON, renvoie null + une réponse 400 en cas d'échec. */
export async function parseJson<T = unknown>(request: Request): Promise<{ data: T | null; response: NextResponse | null }> {
  try {
    const data = (await request.json()) as T;
    return { data, response: null };
  } catch {
    return { data: null, response: NextResponse.json({ error: "Requête invalide" }, { status: 400 }) };
  }
}
