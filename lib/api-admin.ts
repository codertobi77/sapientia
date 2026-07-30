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
export async function adminGuard(): Promise<
  | { user: null; response: NextResponse }
  | { user: Awaited<ReturnType<typeof requireAdmin>>; response: null }
> {
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
      response: NextResponse.json(
        { error: "Erreur d'authentification" },
        { status: 500 },
      ),
    };
  }
}

/** Parse un corps JSON, renvoie null + une réponse 400 en cas d'échec. */
export async function parseJson<T = unknown>(
  request: Request,
): Promise<{ data: T | null; response: NextResponse | null }> {
  try {
    const data = (await request.json()) as T;
    return { data, response: null };
  } catch {
    return {
      data: null,
      response: NextResponse.json({ error: "Requête invalide" }, { status: 400 }),
    };
  }
}

/**
 * Variante discrimnée pour les route handlers inbox : exécute `requireAdmin()`
 * et renvoie soit `{ ok: true, admin }`, soit `{ ok: false, response }`.
 * L'appelant interrompt avec `if (!guard.ok) return guard.response;`.
 */
export async function requireAdminOrResponse(): Promise<
  | { ok: true; admin: Awaited<ReturnType<typeof requireAdmin>> }
  | { ok: false; response: NextResponse }
> {
  try {
    const admin = await requireAdmin();
    return { ok: true, admin };
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: err.message },
          { status: err.notAdmin ? 403 : 401 },
        ),
      };
    }
    if (err instanceof MissingAdminClient) {
      return {
        ok: false,
        response: NextResponse.json({ error: err.message }, { status: 503 }),
      };
    }
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Erreur d'authentification" },
        { status: 500 },
      ),
    };
  }
}
