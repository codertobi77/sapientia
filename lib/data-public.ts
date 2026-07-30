import { createClient } from "@/lib/supabase/server";
import type { Formation, Actualite } from "@/lib/data";

// Accès au contenu publié utilisable dans des contextes build-time/SSR
// (sitemap). Utilise le client serveur standard (cookies) — aucune
// dépendance à la service role key.

export async function getPublishedFormations(): Promise<Formation[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("formations")
    .select("*")
    .eq("published", true)
    .order("ordre", { ascending: true });
  return (data as Formation[]) ?? [];
}

export async function getPublishedActualites(limit = 100): Promise<Actualite[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("actualites")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false })
    .limit(limit);
  return (data as Actualite[]) ?? [];
}
