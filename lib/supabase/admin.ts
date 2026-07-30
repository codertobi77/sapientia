import { createClient } from "@supabase/supabase-js";

/**
 * Client privilégié (service role) à n'utiliser QUE côté serveur
 * dans des routes API ou des Server Components sécurisés (admin).
 *
 * IMPORTANT : ne jamais importer ce module côté client (il contiendrait
 * la service role key côté navigateur). Tout usage admin qui écrit dans la
 * base DOIT passer par ce client, côté serveur uniquement. Le front public
 * reste sur RLS + cookies (lib/supabase/server & client).
 *
 * Lève explictement si la service role key n'est pas configurée : il vaut
 * mieux échouer bruyamment côté admin que d'écrire sans autorisation via
 * RLS. L'app publique n'importe jamais ce module donc n'est pas impactée.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL n'est pas configuré (client admin).",
    );
  }
  if (!key || key === "YOUR_SERVICE_ROLE_KEY") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY n'est pas configuré (client admin). " +
        "Définissez-la côté serveur ; ne l'exposez jamais dans le navigateur.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
