import { createAdminClient } from "@/lib/supabase/admin";

/**
 * STUB — admin-foundations doit fournir la version canonique de ce fichier.
 * ---------------------------------------------------------------
 * DAL d'administration : CRUD sur les 6 modules de contenu en utilisant
 * le client privilégié (service role key) — bypass du RLS. À n'appeler
 * QUE côté serveur (Route Handlers / Server Components) et UNIQUEMENT
 * après `requireAdmin()`.
 *
 * Toutes les fonctions renvoient `{ data, error }` pour que les Route
 * Handlers puissent produire une réponse HTTP adaptée.
 *
 * NOTE sur createAdminClient : renvoie null si la service role key n'est
 * pas configurée. On lève alors une erreur explicite `MissingAdminClient`
 * pour ne pas masquer une mauvaise config en production.
 */

export class MissingAdminClient extends Error {
  constructor() {
    super("Client admin indisponible : SUPABASE_SERVICE_ROLE_KEY manquante");
    this.name = "MissingAdminClient";
  }
}

function admin() {
  const client = createAdminClient();
  if (!client) throw new MissingAdminClient();
  return client;
}

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type AdminFormation = {
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
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminActualite = {
  id: string;
  slug: string;
  titre: string;
  extrait: string | null;
  contenu: string | null;
  image_url: string | null;
  date: string;
  type: "EVENEMENT" | "SEMINAIRE" | "CONCOURS" | "PARTENARIAT" | "NOUVELLE_FORMATION" | "COMMUNIQUE";
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminGalerieItem = {
  id: string;
  titre: string | null;
  type: "PHOTO" | "VIDEO";
  url: string;
  vignette_url: string | null;
  categorie: "CAMPUS" | "PEDAGOGIQUE" | "DIPLOMES";
  date: string;
  ordre: number;
  created_at: string;
};

export type AdminTemoignage = {
  id: string;
  auteur: string;
  role: string | null;
  contenu: string;
  photo_url: string | null;
  ordre: number;
  published: boolean;
  created_at: string;
};

export type AdminPartenaire = {
  id: string;
  nom: string;
  logo_url: string | null;
  url: string | null;
  ordre: number;
  published: boolean;
  created_at: string;
};

export type AdminCampus = {
  id: string;
  ville: string;
  adresse: string | null;
  telephone: string | null;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  description: string | null;
  ordre: number;
  created_at: string;
};

/* ------------------------------------------------------------------ */
/* Formations                                                         */
/* ------------------------------------------------------------------ */

export type FormationInput = Partial<Omit<AdminFormation, "id" | "created_at" | "updated_at">>;

export async function listFormations(): Promise<{ data: AdminFormation[] | null; error: string | null }> {
  const { data, error } = await admin().from("formations").select("*").order("ordre", { ascending: true });
  if (error) return { data: null, error: error.message };
  return { data: data as AdminFormation[], error: null };
}

export async function getFormation(id: string): Promise<{ data: AdminFormation | null; error: string | null }> {
  const { data, error } = await admin().from("formations").select("*").eq("id", id).maybeSingle();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminFormation | null, error: null };
}

export async function createFormation(input: FormationInput): Promise<{ data: AdminFormation | null; error: string | null }> {
  const { data, error } = await admin().from("formations").insert(input).select().single();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminFormation, error: null };
}

export async function updateFormation(id: string, input: FormationInput): Promise<{ data: AdminFormation | null; error: string | null }> {
  const { data, error } = await admin().from("formations").update({ ...input, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminFormation, error: null };
}

export async function deleteFormation(id: string): Promise<{ error: string | null }> {
  const { error } = await admin().from("formations").delete().eq("id", id);
  return { error: error?.message ?? null };
}

/* ------------------------------------------------------------------ */
/* Actualités                                                         */
/* ------------------------------------------------------------------ */

export type ActualiteInput = Partial<Omit<AdminActualite, "id" | "created_at" | "updated_at">>;

export async function listActualites(): Promise<{ data: AdminActualite[] | null; error: string | null }> {
  const { data, error } = await admin().from("actualites").select("*").order("date", { ascending: false });
  if (error) return { data: null, error: error.message };
  return { data: data as AdminActualite[], error: null };
}

export async function getActualite(id: string): Promise<{ data: AdminActualite | null; error: string | null }> {
  const { data, error } = await admin().from("actualites").select("*").eq("id", id).maybeSingle();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminActualite | null, error: null };
}

export async function createActualite(input: ActualiteInput): Promise<{ data: AdminActualite | null; error: string | null }> {
  const { data, error } = await admin().from("actualites").insert(input).select().single();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminActualite, error: null };
}

export async function updateActualite(id: string, input: ActualiteInput): Promise<{ data: AdminActualite | null; error: string | null }> {
  const { data, error } = await admin().from("actualites").update({ ...input, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminActualite, error: null };
}

export async function deleteActualite(id: string): Promise<{ error: string | null }> {
  const { error } = await admin().from("actualites").delete().eq("id", id);
  return { error: error?.message ?? null };
}

/* ------------------------------------------------------------------ */
/* Galerie                                                            */
/* ------------------------------------------------------------------ */

export type GalerieItemInput = Partial<Omit<AdminGalerieItem, "id" | "created_at">>;

export async function listGalerie(): Promise<{ data: AdminGalerieItem[] | null; error: string | null }> {
  const { data, error } = await admin().from("galerie_items").select("*").order("ordre", { ascending: true });
  if (error) return { data: null, error: error.message };
  return { data: data as AdminGalerieItem[], error: null };
}

export async function getGalerieItem(id: string): Promise<{ data: AdminGalerieItem | null; error: string | null }> {
  const { data, error } = await admin().from("galerie_items").select("*").eq("id", id).maybeSingle();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminGalerieItem | null, error: null };
}

export async function createGalerieItem(input: GalerieItemInput): Promise<{ data: AdminGalerieItem | null; error: string | null }> {
  const { data, error } = await admin().from("galerie_items").insert(input).select().single();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminGalerieItem, error: null };
}

export async function updateGalerieItem(id: string, input: GalerieItemInput): Promise<{ data: AdminGalerieItem | null; error: string | null }> {
  const { data, error } = await admin().from("galerie_items").update(input).eq("id", id).select().single();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminGalerieItem, error: null };
}

export async function deleteGalerieItem(id: string): Promise<{ error: string | null }> {
  const { error } = await admin().from("galerie_items").delete().eq("id", id);
  return { error: error?.message ?? null };
}

/* ------------------------------------------------------------------ */
/* Témoignages                                                        */
/* ------------------------------------------------------------------ */

export type TemoignageInput = Partial<Omit<AdminTemoignage, "id" | "created_at">>;

export async function listTemoignages(): Promise<{ data: AdminTemoignage[] | null; error: string | null }> {
  const { data, error } = await admin().from("temoignages").select("*").order("ordre", { ascending: true });
  if (error) return { data: null, error: error.message };
  return { data: data as AdminTemoignage[], error: null };
}

export async function getTemoignage(id: string): Promise<{ data: AdminTemoignage | null; error: string | null }> {
  const { data, error } = await admin().from("temoignages").select("*").eq("id", id).maybeSingle();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminTemoignage | null, error: null };
}

export async function createTemoignage(input: TemoignageInput): Promise<{ data: AdminTemoignage | null; error: string | null }> {
  const { data, error } = await admin().from("temoignages").insert(input).select().single();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminTemoignage, error: null };
}

export async function updateTemoignage(id: string, input: TemoignageInput): Promise<{ data: AdminTemoignage | null; error: string | null }> {
  const { data, error } = await admin().from("temoignages").update(input).eq("id", id).select().single();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminTemoignage, error: null };
}

export async function deleteTemoignage(id: string): Promise<{ error: string | null }> {
  const { error } = await admin().from("temoignages").delete().eq("id", id);
  return { error: error?.message ?? null };
}

/* ------------------------------------------------------------------ */
/* Partenaires                                                        */
/* ------------------------------------------------------------------ */

export type PartenaireInput = Partial<Omit<AdminPartenaire, "id" | "created_at">>;

export async function listPartenaires(): Promise<{ data: AdminPartenaire[] | null; error: string | null }> {
  const { data, error } = await admin().from("partenaires").select("*").order("ordre", { ascending: true });
  if (error) return { data: null, error: error.message };
  return { data: data as AdminPartenaire[], error: null };
}

export async function getPartenaire(id: string): Promise<{ data: AdminPartenaire | null; error: string | null }> {
  const { data, error } = await admin().from("partenaires").select("*").eq("id", id).maybeSingle();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminPartenaire | null, error: null };
}

export async function createPartenaire(input: PartenaireInput): Promise<{ data: AdminPartenaire | null; error: string | null }> {
  const { data, error } = await admin().from("partenaires").insert(input).select().single();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminPartenaire, error: null };
}

export async function updatePartenaire(id: string, input: PartenaireInput): Promise<{ data: AdminPartenaire | null; error: string | null }> {
  const { data, error } = await admin().from("partenaires").update(input).eq("id", id).select().single();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminPartenaire, error: null };
}

export async function deletePartenaire(id: string): Promise<{ error: string | null }> {
  const { error } = await admin().from("partenaires").delete().eq("id", id);
  return { error: error?.message ?? null };
}

/* ------------------------------------------------------------------ */
/* Campus                                                             */
/* ------------------------------------------------------------------ */

export type CampusInput = Partial<Omit<AdminCampus, "id" | "created_at">>;

export async function listCampus(): Promise<{ data: AdminCampus[] | null; error: string | null }> {
  const { data, error } = await admin().from("campus").select("*").order("ordre", { ascending: true });
  if (error) return { data: null, error: error.message };
  return { data: data as AdminCampus[], error: null };
}

export async function getCampus(id: string): Promise<{ data: AdminCampus | null; error: string | null }> {
  const { data, error } = await admin().from("campus").select("*").eq("id", id).maybeSingle();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminCampus | null, error: null };
}

export async function createCampus(input: CampusInput): Promise<{ data: AdminCampus | null; error: string | null }> {
  const { data, error } = await admin().from("campus").insert(input).select().single();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminCampus, error: null };
}

export async function updateCampus(id: string, input: CampusInput): Promise<{ data: AdminCampus | null; error: string | null }> {
  const { data, error } = await admin().from("campus").update(input).eq("id", id).select().single();
  if (error) return { data: null, error: error.message };
  return { data: data as AdminCampus, error: null };
}

export async function deleteCampus(id: string): Promise<{ error: string | null }> {
  const { error } = await admin().from("campus").delete().eq("id", id);
  return { error: error?.message ?? null };
}
