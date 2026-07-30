import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Profil admin (row de la table public.profiles).
 * `role` et `actif` sont lus côté serveur après getUser() — jamais depuis le JWT
 * (raw_user_meta_data est éditable par l'utilisateur, donc non fiable pour l'auto).
 */
export type AdminProfile = {
  id: string;
  role: "ADMIN" | "ETUDIANT" | "ENSEIGNANT";
  name: string | null;
  telephone: string | null;
  actif: boolean;
  created_at: string;
};

export type CurrentAdmin = { user: User; profile: AdminProfile };

/**
 * Retourne l'admin courant ou null (sans rediriger). Utilisé par le layout
 * et tout composant serveur qui veut afficher des infos admin conditionnellement.
 *
 * Utilise supabase.auth.getUser() (vérifie le JWT côté serveur Supabase, plus
 * sûr que getSession) puis lit le profil dans public.profiles.
 */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, name, telephone, actif, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;
  if (profile.role !== "ADMIN" || !profile.actif) return null;

  return { user, profile: profile as AdminProfile };
}

/**
 * Garantit que la requête provient d'un admin actif. À appeler en tête de
 * chaque page/route admin. Redirige vers /connexion si non authentifié, ou si
 * le profil n'existe pas / n'est pas ADMIN / est inactif.
 *
 * @param pathname chemin courant (pour le ?next= de redirection). En Server
 *   Component page on n'a pas accès à usePathname : passer la route manuellement
 *   (ex. "/admin/formations"). Pour un Route Handler, n'importe quel chemin fait
 *   l'affaire. Par défaut "/admin".
 */
export async function requireAdmin(
  pathname: string = "/admin",
): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    const target = pathname && pathname.length > 0 ? pathname : "/admin";
    redirect(`/connexion?next=${encodeURIComponent(target)}`);
  }
  return admin;
}
