import { createClient } from "@supabase/supabase-js";

/**
 * Client privilégié (service role) à n'utiliser QUE côté serveur
 * dans des routes API ou des Server Components sécurisés (admin).
 * Ne jamais exposer la service role key côté navigateur.
 *
 * Retourne null si la service role key n'est pas configurée, pour ne pas
 * planter le dev/l'app publique tant qu'elle n'est pas fournie.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || key === "YOUR_SERVICE_ROLE_KEY") return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
