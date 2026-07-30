import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Data Access Layer admin (coté serveur uniquement).
 *
 * Contrairement à lib/data.ts (lecture publique, filtre published=true),
 * cette DAL :
 * - utilise le client service role (createAdminClient), donc passe au-dessus
 *   de la RLS pour les opérations admin ;
 * - n'applique JAMAIS de filtre published : on voit tout (brouillons inclus) ;
 * - expose create/update/delete pour chaque table de contenu et de demandes.
 *
 * Toutes les fonctions sont async et retournent les données brutes. La
 * validation des entrées (Zod) reste à la charge des pages/routes CRUD qui
 * appellent cette DAL.
 */

// ---------------------------------------------------------------------------
// Types admin (colonnes complètes, y compris published + timestamps)
// ---------------------------------------------------------------------------

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
  type:
    | "EVENEMENT"
    | "SEMINAIRE"
    | "CONCOURS"
    | "PARTENARIAT"
    | "NOUVELLE_FORMATION"
    | "COMMUNIQUE";
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

export type AdminDemandeInscription = {
  id: string;
  formation_id: string | null;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  date_naissance: string | null;
  adresse: string | null;
  niveau: string | null;
  documents_paths: string[];
  statut: "EN_ATTENTE" | "TRAITEE" | "REFUSEE";
  note_admin: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminDemandeDevis = {
  id: string;
  formation_id: string | null;
  type_formation: string;
  niveau: string | null;
  duree: string | null;
  nom: string;
  email: string;
  telephone: string | null;
  message: string | null;
  statut: "EN_ATTENTE" | "TRAITEE" | "REFUSEE";
  note_admin: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminContactMessage = {
  id: string;
  nom: string;
  email: string;
  sujet: string | null;
  message: string;
  lu: boolean;
  created_at: string;
};

export type AdminNewsletterSubscriber = {
  id: string;
  email: string;
  desinscrit: boolean;
  created_at: string;
};

export type AdminProfile = {
  id: string;
  role: "ADMIN" | "ETUDIANT" | "ENSEIGNANT";
  name: string | null;
  telephone: string | null;
  actif: boolean;
  created_at: string;
};

// ---------------------------------------------------------------------------
// Résultat d'écriture (insert/update/delete)
// ---------------------------------------------------------------------------

export type AdminWriteResult = {
  ok: boolean;
  /** message d'erreur Supabase brut, vide si ok */
  error: string | null;
};

// ---------------------------------------------------------------------------
// Helper interne : ne pas casser le build si une écriture échoue.
// On renvoie toujours AdminWriteResult ; les fonctions de lecture lèvent en
// revanche (bug / config) car on ne veut pas servir du vide silencieusement.
// ---------------------------------------------------------------------------

function fail(error: string): AdminWriteResult {
  return { ok: false, error };
}

function ok(): AdminWriteResult {
  return { ok: true, error: null };
}

// ---------------------------------------------------------------------------
// Dashboard : compteurs
// ---------------------------------------------------------------------------

export type DashboardCounts = {
  inscriptionsEnAttente: number;
  devisEnAttente: number;
  messagesNonLus: number;
  abonnesActifs: number;
  formationsPubliees: number;
  actualitesPubliees: number;
};

export async function dashboardCounts(): Promise<DashboardCounts> {
  const supabase = createAdminClient();
  const [
    inscriptions,
    devis,
    messages,
    abonnes,
    formations,
    actualites,
  ] = await Promise.all([
    supabase
      .from("demandes_inscription")
      .select("id", { count: "exact", head: true })
      .eq("statut", "EN_ATTENTE"),
    supabase
      .from("demandes_devis")
      .select("id", { count: "exact", head: true })
      .eq("statut", "EN_ATTENTE"),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("lu", false),
    supabase
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .eq("desinscrit", false),
    supabase
      .from("formations")
      .select("id", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("actualites")
      .select("id", { count: "exact", head: true })
      .eq("published", true),
  ]);

  return {
    inscriptionsEnAttente: inscriptions.count ?? 0,
    devisEnAttente: devis.count ?? 0,
    messagesNonLus: messages.count ?? 0,
    abonnesActifs: abonnes.count ?? 0,
    formationsPubliees: formations.count ?? 0,
    actualitesPubliees: actualites.count ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Formations
// ---------------------------------------------------------------------------

export async function listFormations(): Promise<AdminFormation[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("formations")
    .select("*")
    .order("ordre", { ascending: true });
  return (data ?? []) as AdminFormation[];
}

export async function getFormationAdmin(
  id: string,
): Promise<AdminFormation | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("formations")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as AdminFormation) ?? null;
}

export async function createFormation(
  data: Omit<AdminFormation, "id" | "created_at" | "updated_at">,
): Promise<{ id: string | null } & AdminWriteResult> {
  const supabase = createAdminClient();
  const { data: row, error } = await supabase
    .from("formations")
    .insert(data)
    .select("id")
    .single();
  if (error) return { id: null, ...fail(error.message) };
  return { id: row.id, ...ok() };
}

export async function updateFormation(
  id: string,
  data: Partial<
    Omit<AdminFormation, "id" | "created_at" | "updated_at">
  >,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  // bumps updated_at côté DB via trigger éventuel ; sinon on force.
  const payload = { ...data, updated_at: new Date().toISOString() };
  const { error } = await supabase
    .from("formations")
    .update(payload)
    .eq("id", id);
  return error ? fail(error.message) : ok();
}

export async function deleteFormation(id: string): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("formations").delete().eq("id", id);
  return error ? fail(error.message) : ok();
}

// ---------------------------------------------------------------------------
// Actualités
// ---------------------------------------------------------------------------

export async function listActualites(): Promise<AdminActualite[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("actualites")
    .select("*")
    .order("date", { ascending: false });
  return (data ?? []) as AdminActualite[];
}

export async function getActualiteAdmin(
  id: string,
): Promise<AdminActualite | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("actualites")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as AdminActualite) ?? null;
}

export async function createActualite(
  data: Omit<AdminActualite, "id" | "created_at" | "updated_at">,
): Promise<{ id: string | null } & AdminWriteResult> {
  const supabase = createAdminClient();
  const { data: row, error } = await supabase
    .from("actualites")
    .insert(data)
    .select("id")
    .single();
  if (error) return { id: null, ...fail(error.message) };
  return { id: row.id, ...ok() };
}

export async function updateActualite(
  id: string,
  data: Partial<
    Omit<AdminActualite, "id" | "created_at" | "updated_at">
  >,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const payload = { ...data, updated_at: new Date().toISOString() };
  const { error } = await supabase
    .from("actualites")
    .update(payload)
    .eq("id", id);
  return error ? fail(error.message) : ok();
}

export async function deleteActualite(id: string): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("actualites").delete().eq("id", id);
  return error ? fail(error.message) : ok();
}

// ---------------------------------------------------------------------------
// Galerie
// ---------------------------------------------------------------------------

export async function listGalerie(): Promise<AdminGalerieItem[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("galerie_items")
    .select("*")
    .order("ordre", { ascending: true });
  return (data ?? []) as AdminGalerieItem[];
}

export async function getGalerieItem(
  id: string,
): Promise<AdminGalerieItem | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("galerie_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as AdminGalerieItem) ?? null;
}

export async function createGalerieItem(
  data: Omit<AdminGalerieItem, "id" | "created_at">,
): Promise<{ id: string | null } & AdminWriteResult> {
  const supabase = createAdminClient();
  const { data: row, error } = await supabase
    .from("galerie_items")
    .insert(data)
    .select("id")
    .single();
  if (error) return { id: null, ...fail(error.message) };
  return { id: row.id, ...ok() };
}

export async function updateGalerieItem(
  id: string,
  data: Partial<Omit<AdminGalerieItem, "id" | "created_at">>,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("galerie_items")
    .update(data)
    .eq("id", id);
  return error ? fail(error.message) : ok();
}

export async function deleteGalerieItem(
  id: string,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("galerie_items").delete().eq("id", id);
  return error ? fail(error.message) : ok();
}

// ---------------------------------------------------------------------------
// Témoignages
// ---------------------------------------------------------------------------

export async function listTemoignages(): Promise<AdminTemoignage[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("temoignages")
    .select("*")
    .order("ordre", { ascending: true });
  return (data ?? []) as AdminTemoignage[];
}

export async function getTemoignage(
  id: string,
): Promise<AdminTemoignage | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("temoignages")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as AdminTemoignage) ?? null;
}

export async function createTemoignage(
  data: Omit<AdminTemoignage, "id" | "created_at">,
): Promise<{ id: string | null } & AdminWriteResult> {
  const supabase = createAdminClient();
  const { data: row, error } = await supabase
    .from("temoignages")
    .insert(data)
    .select("id")
    .single();
  if (error) return { id: null, ...fail(error.message) };
  return { id: row.id, ...ok() };
}

export async function updateTemoignage(
  id: string,
  data: Partial<Omit<AdminTemoignage, "id" | "created_at">>,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("temoignages")
    .update(data)
    .eq("id", id);
  return error ? fail(error.message) : ok();
}

export async function deleteTemoignage(id: string): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("temoignages").delete().eq("id", id);
  return error ? fail(error.message) : ok();
}

// ---------------------------------------------------------------------------
// Partenaires
// ---------------------------------------------------------------------------

export async function listPartenaires(): Promise<AdminPartenaire[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("partenaires")
    .select("*")
    .order("ordre", { ascending: true });
  return (data ?? []) as AdminPartenaire[];
}

export async function getPartenaire(
  id: string,
): Promise<AdminPartenaire | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("partenaires")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as AdminPartenaire) ?? null;
}

export async function createPartenaire(
  data: Omit<AdminPartenaire, "id" | "created_at">,
): Promise<{ id: string | null } & AdminWriteResult> {
  const supabase = createAdminClient();
  const { data: row, error } = await supabase
    .from("partenaires")
    .insert(data)
    .select("id")
    .single();
  if (error) return { id: null, ...fail(error.message) };
  return { id: row.id, ...ok() };
}

export async function updatePartenaire(
  id: string,
  data: Partial<Omit<AdminPartenaire, "id" | "created_at">>,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("partenaires")
    .update(data)
    .eq("id", id);
  return error ? fail(error.message) : ok();
}

export async function deletePartenaire(id: string): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("partenaires").delete().eq("id", id);
  return error ? fail(error.message) : ok();
}

// ---------------------------------------------------------------------------
// Campus
// ---------------------------------------------------------------------------

export async function listCampus(): Promise<AdminCampus[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("campus")
    .select("*")
    .order("ordre", { ascending: true });
  return (data ?? []) as AdminCampus[];
}

export async function getCampus(id: string): Promise<AdminCampus | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("campus")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as AdminCampus) ?? null;
}

export async function createCampus(
  data: Omit<AdminCampus, "id" | "created_at">,
): Promise<{ id: string | null } & AdminWriteResult> {
  const supabase = createAdminClient();
  const { data: row, error } = await supabase
    .from("campus")
    .insert(data)
    .select("id")
    .single();
  if (error) return { id: null, ...fail(error.message) };
  return { id: row.id, ...ok() };
}

export async function updateCampus(
  id: string,
  data: Partial<Omit<AdminCampus, "id" | "created_at">>,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("campus").update(data).eq("id", id);
  return error ? fail(error.message) : ok();
}

export async function deleteCampus(id: string): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("campus").delete().eq("id", id);
  return error ? fail(error.message) : ok();
}

// ---------------------------------------------------------------------------
// Demandes d'inscription
// ---------------------------------------------------------------------------

export async function listDemandesInscription(
  filter?: { statut?: AdminDemandeInscription["statut"] },
): Promise<AdminDemandeInscription[]> {
  const supabase = createAdminClient();
  let q = supabase
    .from("demandes_inscription")
    .select("*")
    .order("created_at", { ascending: false });
  if (filter?.statut) q = q.eq("statut", filter.statut);
  const { data } = await q;
  return (data ?? []) as AdminDemandeInscription[];
}

export async function getDemandeInscription(
  id: string,
): Promise<AdminDemandeInscription | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("demandes_inscription")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as AdminDemandeInscription) ?? null;
}

export async function updateDemandeInscription(
  id: string,
  data: Partial<
    Pick<AdminDemandeInscription, "statut" | "note_admin">
  >,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const payload = { ...data, updated_at: new Date().toISOString() };
  const { error } = await supabase
    .from("demandes_inscription")
    .update(payload)
    .eq("id", id);
  return error ? fail(error.message) : ok();
}

export async function deleteDemandeInscription(
  id: string,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("demandes_inscription")
    .delete()
    .eq("id", id);
  return error ? fail(error.message) : ok();
}

// ---------------------------------------------------------------------------
// Demandes de devis
// ---------------------------------------------------------------------------

export async function listDemandesDevis(
  filter?: { statut?: AdminDemandeDevis["statut"] },
): Promise<AdminDemandeDevis[]> {
  const supabase = createAdminClient();
  let q = supabase
    .from("demandes_devis")
    .select("*")
    .order("created_at", { ascending: false });
  if (filter?.statut) q = q.eq("statut", filter.statut);
  const { data } = await q;
  return (data ?? []) as AdminDemandeDevis[];
}

export async function getDemandeDevis(
  id: string,
): Promise<AdminDemandeDevis | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("demandes_devis")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as AdminDemandeDevis) ?? null;
}

export async function updateDemandeDevis(
  id: string,
  data: Partial<Pick<AdminDemandeDevis, "statut" | "note_admin">>,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const payload = { ...data, updated_at: new Date().toISOString() };
  const { error } = await supabase
    .from("demandes_devis")
    .update(payload)
    .eq("id", id);
  return error ? fail(error.message) : ok();
}

export async function deleteDemandeDevis(id: string): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("demandes_devis")
    .delete()
    .eq("id", id);
  return error ? fail(error.message) : ok();
}

// ---------------------------------------------------------------------------
// Messages de contact
// ---------------------------------------------------------------------------

export async function listContactMessages(
  filter?: { lu?: boolean },
): Promise<AdminContactMessage[]> {
  const supabase = createAdminClient();
  let q = supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (filter && typeof filter.lu === "boolean") q = q.eq("lu", filter.lu);
  const { data } = await q;
  return (data ?? []) as AdminContactMessage[];
}

export async function getContactMessage(
  id: string,
): Promise<AdminContactMessage | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as AdminContactMessage) ?? null;
}

export async function markContactMessageLu(
  id: string,
  lu: boolean,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ lu })
    .eq("id", id);
  return error ? fail(error.message) : ok();
}

export async function deleteContactMessage(
  id: string,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);
  return error ? fail(error.message) : ok();
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

export async function listNewsletterSubscribers(
  filter?: { desinscrit?: boolean },
): Promise<AdminNewsletterSubscriber[]> {
  const supabase = createAdminClient();
  let q = supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (filter && typeof filter.desinscrit === "boolean") {
    q = q.eq("desinscrit", filter.desinscrit);
  }
  const { data } = await q;
  return (data ?? []) as AdminNewsletterSubscriber[];
}

export async function deleteNewsletterSubscriber(
  id: string,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("id", id);
  return error ? fail(error.message) : ok();
}

export async function setNewsletterDesinscrit(
  id: string,
  desinscrit: boolean,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ desinscrit })
    .eq("id", id);
  return error ? fail(error.message) : ok();
}

// ---------------------------------------------------------------------------
// Profiles (utilisateurs)
// ---------------------------------------------------------------------------

export async function listProfiles(): Promise<AdminProfile[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, role, name, telephone, actif, created_at")
    .order("created_at", { ascending: false });
  return (data ?? []) as AdminProfile[];
}

export async function getProfile(id: string): Promise<AdminProfile | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, role, name, telephone, actif, created_at")
    .eq("id", id)
    .maybeSingle();
  return (data as AdminProfile) ?? null;
}

export async function updateProfile(
  id: string,
  data: Partial<Pick<AdminProfile, "role" | "name" | "telephone" | "actif">>,
): Promise<AdminWriteResult> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", id);
  return error ? fail(error.message) : ok();
}

// ---------------------------------------------------------------------------
// CSV helper (export listes admin)
// ---------------------------------------------------------------------------

export type CsvColumn<T> = {
  key: keyof T & string;
  label: string;
  /** formatage optionnel (ex. formatDate) */
  format?: (row: T) => string;
};

/**
 * Sérialise un tableau de rows en CSV. Les valeurs contenant `,`, `"`, ou un
 * saut de ligne sont échappées selon la RFC 4180 (double-quote doublée).
 * Retourne la chaîne CSV (sans BOM) ; l'appulant détermine le content-type.
 */
export function toCSV<T extends Record<string, unknown>>(
  rows: T[],
  columns: CsvColumn<T>[],
): string {
  const esc = (v: unknown): string => {
    const s = v == null ? "" : String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const header = columns.map((c) => esc(c.label)).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) => esc(c.format ? c.format(row) : row[c.key]))
        .join(","),
    )
    .join("\n");
  return `${header}\n${body}`;
}
