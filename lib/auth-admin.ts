import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * STUB — admin-foundations doit fournir la version canonique de ce fichier.
 * ---------------------------------------------------------------
 * Aide d'authentification pour les routes/pages admin.
 *
 * `requireAdmin()` : résout l'utilisateur courant via les cookies de session
 * (client serveur standard) et vérifie son rôle ADMIN dans la table profiles.
 * Utilise un select direct (RLS public sur profiles + policy admin select)
 * plutôt que la service role key, donc n'a pas besoin de service key.
 *
 * - Dans une Route Handler : en cas d'échec, jette `UnauthorizedError` que
 *   l'appelant convertit en NextResponse 401.
 * - Dans un Server Component : préférer `requireAdminOrRedirect()` qui
 *   redirige vers /connexion si non authentifié, sinon vers /connexion avec
 *   toast si authentifié mais non admin.
 *
 * NOTE : la vérification fine est déjà couverte par RLS côté données, mais
 * on court-circuite tôt pour une meilleure UX et un fail-fast.
 */

export type AdminUser = {
  id: string;
  email: string | undefined;
  name: string | null;
};

export class UnauthorizedError extends Error {
  readonly notAdmin: boolean;
  constructor(message: string, notAdmin = false) {
    super(message);
    this.name = "UnauthorizedError";
    this.notAdmin = notAdmin;
  }
}

/**
 * Vérifie que l'utilisateur courant est authentifié ET admin.
 * Renvoie l'`AdminUser` sinon jette `UnauthorizedError`.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new UnauthorizedError("Authentification requise", false);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name, actif")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "ADMIN" || !profile.actif) {
    throw new UnauthorizedError("Accès réservé aux administrateurs", true);
  }

  return { id: user.id, email: user.email, name: profile.name };
}

/**
 * Variante pour les Server Components : redirige proprement.
 * - non authentifié -> /connexion?next=<pathname>
 * - authentifié non admin -> page d'erreur légère.
 */
export async function requireAdminOrRedirect(pathname = "/admin"): Promise<AdminUser> {
  try {
    return await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError && !e.notAdmin) {
      redirect(`/connexion?next=${encodeURIComponent(pathname)}`);
    }
    throw e;
  }
}
