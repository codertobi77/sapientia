import { createClient } from "@/lib/supabase/server";

// ██ STUB (admin-inbox) ██
// Ce fichier est un STUB minimal pour permettre tsc/build dans le worktree
// admin-inbox. La version définitive est fournie par le module FOUNDATIONS
// (phase2/admin-foundations). À MERGE, garder la version de foundations et
// supprimer celle-ci si elle duplique. L'API publique visée :
//
//   export async function requireAdmin(): Promise<{ id: string; email: string }>
//     - lève une erreur `AdminAuthError` si non authentifié ou non admin
//     - retourne l'utilisateur admin courant { id, email } sinon
//
// Voici l'implémentation de référence (cohérente avec proxy.ts + RLS is_admin) :

export class AdminAuthError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "AdminAuthError";
  }
}

type AdminUser = { id: string; email: string };

/**
 * Garde d'authentification admin côté serveur (API + Server Components).
 *
 * - Vérifie la session via le client cookies (RLS-aware).
 * - Vérifie que profiles.role === 'ADMIN' (via la table publique).
 * - Lève AdminAuthError(401) si non authentifié, (403) si non admin.
 *
 * Pour les route handlers, utilisez `requireAdminOrResponse` qui renvoie
 * une NextResponse appropriée en cas d'erreur.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AdminAuthError("Authentification requise", 401);
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || profile.role !== "ADMIN") {
    throw new AdminAuthError("Accès réservé aux administrateurs", 403);
  }

  return { id: user.id, email: user.email ?? "" };
}
