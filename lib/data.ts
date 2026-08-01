import { createClient } from "@/lib/supabase/server";

export type Formation = {
  id: string;
  slug: string;
  titre: string;
  description: string | null;
  objectifs: string | null;
  debouches: string | null;
  conditions_admission: string | null;
  modalites_inscription: string | null;
  type: "PRESENTIEL" | "DISTANCE" | "LES_DEUX";
  icone: string | null;
  ordre: number;
};

export type Actualite = {
  id: string;
  slug: string;
  titre: string;
  extrait: string | null;
  contenu: string | null;
  image_url: string | null;
  date: string;
  type: string;
};

export type Temoignage = {
  id: string;
  auteur: string;
  role: string | null;
  contenu: string;
  photo_url: string | null;
};

export type Partenaire = {
  id: string;
  nom: string;
  logo_url: string | null;
  url: string | null;
};

export type Campus = {
  id: string;
  ville: string;
  adresse: string | null;
  telephone: string | null;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  image_url: string | null;
  ordre: number;
  actif: boolean;
};

export async function getFormations(): Promise<Formation[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("formations")
    .select("*")
    .eq("published", true)
    .order("ordre", { ascending: true });
  return data ?? [];
}

export async function getFormation(slug: string): Promise<Formation | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("formations")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data;
}

export async function getFormationById(id: string): Promise<Formation | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("formations")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  return data;
}

export async function getActualites(limit = 6): Promise<Actualite[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("actualites")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getActualite(slug: string): Promise<Actualite | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("actualites")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data;
}

export async function getTemoignages(limit = 3): Promise<Temoignage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("temoignages")
    .select("*")
    .eq("published", true)
    .order("ordre", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getPartenaires(): Promise<Partenaire[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("partenaires")
    .select("*")
    .eq("published", true)
    .order("ordre", { ascending: true });
  return data ?? [];
}

export async function getCampus(): Promise<Campus[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("campus")
    .select("*")
    .eq("actif", true)
    .order("ordre", { ascending: true });
  return data ?? [];
}
