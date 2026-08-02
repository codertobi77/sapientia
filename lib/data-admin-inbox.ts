import { createAdminClient } from "@/lib/supabase/admin";

// ============================================================================
// DAL admin-inbox — opérations privilégiées (service role) sur les tables
// de demandes entrantes + utilisateurs. Fichier DÉDIÉ (lib/data-admin-inbox.ts)
// pour éviter tout conflit avec lib/data-admin.ts géré par foundations/content-crud.
// Toutes les écritures passent par createAdminClient() (service role, serveur).
// ============================================================================

export type DemandeStatut = "EN_ATTENTE" | "TRAITEE" | "REFUSEE";
export type UserRole = "ADMIN" | "ETUDIANT" | "ENSEIGNANT";

function adminOrThrow() {
  const client = createAdminClient();
  if (!client) {
    throw new Error("Service role non configuré (SUPABASE_SERVICE_ROLE_KEY)");
  }
  return client;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Inscription = {
  id: string;
  formation_id: string | null;
  type_formation: string | null;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  date_naissance: string | null;
  adresse: string | null;
  niveau: string | null;
  documents_paths: string[] | null;
  statut: DemandeStatut;
  note_admin: string | null;
  created_at: string;
  updated_at: string;
};

export type InscriptionWithFormation = Inscription & {
  formation_titre: string | null;
  formation_slug: string | null;
};

export type Devis = {
  id: string;
  formation_id: string | null;
  type_formation: string;
  niveau: string | null;
  duree: string | null;
  nom: string;
  email: string;
  telephone: string | null;
  message: string | null;
  statut: DemandeStatut;
  note_admin: string | null;
  created_at: string;
  updated_at: string;
};

export type DevisWithFormation = Devis & {
  formation_titre: string | null;
  formation_slug: string | null;
};

export type ContactMessage = {
  id: string;
  nom: string;
  email: string;
  sujet: string | null;
  message: string;
  lu: boolean;
  created_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  desinscrit: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  role: UserRole;
  name: string | null;
  telephone: string | null;
  actif: boolean;
  created_at: string;
  email?: string | null;
};

// ---------------------------------------------------------------------------
// Inscriptions
// ---------------------------------------------------------------------------

export async function listInscriptions(
  statut?: DemandeStatut,
): Promise<InscriptionWithFormation[]> {
  const supabase = adminOrThrow();
  let query = supabase
    .from("demandes_inscription")
    .select(
      "id, formation_id, type_formation, nom, prenom, email, telephone, date_naissance, adresse, niveau, documents_paths, statut, note_admin, created_at, updated_at, formations!left(titre, slug)",
    )
    .order("created_at", { ascending: false });
  if (statut) query = query.eq("statut", statut);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => normalizeInscription(row));
}

export async function getInscription(
  id: string,
): Promise<InscriptionWithFormation | null> {
  const supabase = adminOrThrow();
  const { data, error } = await supabase
    .from("demandes_inscription")
    .select(
      "id, formation_id, type_formation, nom, prenom, email, telephone, date_naissance, adresse, niveau, documents_paths, statut, note_admin, created_at, updated_at, formations!left(titre, slug)",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? normalizeInscription(data) : null;
}

export async function updateInscription(
  id: string,
  patch: { statut?: DemandeStatut; note_admin?: string | null },
): Promise<Inscription | null> {
  const supabase = adminOrThrow();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.statut) update.statut = patch.statut;
  if (patch.note_admin !== undefined) update.note_admin = patch.note_admin;
  const { data, error } = await supabase
    .from("demandes_inscription")
    .update(update)
    .eq("id", id)
    .select(
      "id, formation_id, type_formation, nom, prenom, email, telephone, date_naissance, adresse, niveau, documents_paths, statut, note_admin, created_at, updated_at",
    )
    .maybeSingle();
  if (error) throw error;
  return (data as Inscription) ?? null;
}

// ---------------------------------------------------------------------------
// Devis
// ---------------------------------------------------------------------------

export async function listDevis(statut?: DemandeStatut): Promise<DevisWithFormation[]> {
  const supabase = adminOrThrow();
  let query = supabase
    .from("demandes_devis")
    .select(
      "id, formation_id, type_formation, niveau, duree, nom, email, telephone, message, statut, note_admin, created_at, updated_at, formations!left(titre, slug)",
    )
    .order("created_at", { ascending: false });
  if (statut) query = query.eq("statut", statut);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => normalizeDevis(row));
}

export async function getDevis(id: string): Promise<DevisWithFormation | null> {
  const supabase = adminOrThrow();
  const { data, error } = await supabase
    .from("demandes_devis")
    .select(
      "id, formation_id, type_formation, niveau, duree, nom, email, telephone, message, statut, note_admin, created_at, updated_at, formations!left(titre, slug)",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? normalizeDevis(data) : null;
}

export async function updateDevis(
  id: string,
  patch: { statut?: DemandeStatut; note_admin?: string | null },
): Promise<Devis | null> {
  const supabase = adminOrThrow();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.statut) update.statut = patch.statut;
  if (patch.note_admin !== undefined) update.note_admin = patch.note_admin;
  const { data, error } = await supabase
    .from("demandes_devis")
    .update(update)
    .eq("id", id)
    .select(
      "id, formation_id, type_formation, niveau, duree, nom, email, telephone, message, statut, note_admin, created_at, updated_at",
    )
    .maybeSingle();
  if (error) throw error;
  return (data as Devis) ?? null;
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export async function listMessages(filter?: { lu?: boolean }): Promise<ContactMessage[]> {
  const supabase = adminOrThrow();
  let query = supabase
    .from("contact_messages")
    .select("id, nom, email, sujet, message, lu, created_at")
    .order("created_at", { ascending: false });
  if (filter?.lu !== undefined) query = query.eq("lu", filter.lu);
  const { data, error } = await query;
  if (error) throw error;
  return (data as ContactMessage[]) ?? [];
}

export async function getMessage(id: string): Promise<ContactMessage | null> {
  const supabase = adminOrThrow();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, nom, email, sujet, message, lu, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as ContactMessage) ?? null;
}

export async function markMessageRead(id: string, lu: boolean): Promise<ContactMessage | null> {
  const supabase = adminOrThrow();
  const { data, error } = await supabase
    .from("contact_messages")
    .update({ lu })
    .eq("id", id)
    .select("id, nom, email, sujet, message, lu, created_at")
    .maybeSingle();
  if (error) throw error;
  return (data as ContactMessage) ?? null;
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

export async function listNewsletter(filter?: { desinscrit?: boolean }): Promise<NewsletterSubscriber[]> {
  const supabase = adminOrThrow();
  let query = supabase
    .from("newsletter_subscribers")
    .select("id, email, desinscrit, created_at")
    .order("created_at", { ascending: false });
  if (filter?.desinscrit !== undefined) query = query.eq("desinscrit", filter.desinscrit);
  const { data, error } = await query;
  if (error) throw error;
  return (data as NewsletterSubscriber[]) ?? [];
}

export async function toggleDesinscription(
  id: string,
  desinscrit: boolean,
): Promise<NewsletterSubscriber | null> {
  const supabase = adminOrThrow();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ desinscrit })
    .eq("id", id)
    .select("id, email, desinscrit, created_at")
    .maybeSingle();
  if (error) throw error;
  return (data as NewsletterSubscriber) ?? null;
}

// ---------------------------------------------------------------------------
// Profiles / Users
// ---------------------------------------------------------------------------

export async function listProfiles(): Promise<Profile[]> {
  const supabase = adminOrThrow();
  // profiles n'a pas de colonne email ; on joint via auth.users côté admin client.
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, name, telephone, actif, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const profiles = (data ?? []) as Omit<Profile, "email">[];

  // Compléter l'email depuis auth.users (admin API).
  let emailsById: Record<string, string> = {};
  try {
    const {
      data: { users },
    } = await supabase.auth.admin.listUsers();
    emailsById = Object.fromEntries(users.map((u) => [u.id, u.email ?? ""]));
  } catch {
    // ignore (en dev sans service role complet)
  }
  return profiles.map((p) => ({ ...p, email: emailsById[p.id] ?? "" }));
}

export async function getProfile(id: string): Promise<Profile | null> {
  const supabase = adminOrThrow();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, name, telephone, actif, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  let email = "";
  try {
    const {
      data: { user },
    } = await supabase.auth.admin.getUserById(id);
    email = user?.email ?? "";
  } catch {
    /* ignore */
  }
  return { ...(data as Omit<Profile, "email">), email };
}

export async function updateProfile(
  id: string,
  patch: { role?: UserRole; actif?: boolean; name?: string | null; telephone?: string | null },
): Promise<Profile | null> {
  const supabase = adminOrThrow();
  const update: Record<string, unknown> = {};
  if (patch.role) update.role = patch.role;
  if (patch.actif !== undefined) update.actif = patch.actif;
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.telephone !== undefined) update.telephone = patch.telephone;
  const { data, error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", id)
    .select("id, role, name, telephone, actif, created_at")
    .maybeSingle();
  if (error) throw error;
  return (data as Omit<Profile, "email">) ?? null;
}

export type CreateAdminResult = {
  id: string;
  email: string;
};

export async function createAdminUser(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<CreateAdminResult> {
  const supabase = adminOrThrow();
  const {
    data: { user },
    error,
  } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: input.name ? { name: input.name } : undefined,
  });
  if (error) throw error;
  if (!user) throw new Error("Utilisateur non créé");
  // Forcer le rôle ADMIN sur le profil (créé par le trigger handle_new_user).
  const { error: pErr } = await supabase
    .from("profiles")
    .update({ role: "ADMIN", actif: true })
    .eq("id", user.id);
  if (pErr) throw pErr;
  return { id: user.id, email: user.email ?? input.email };
}

// ---------------------------------------------------------------------------
// Helpers de normalisation (handle du join formations!left → objet)
// ---------------------------------------------------------------------------

type RawInscription = Omit<Inscription, never> & {
  formations?: { titre: string; slug: string } | { titre: string; slug: string }[] | null;
};

function normalizeInscription(row: RawInscription): InscriptionWithFormation {
  const f = Array.isArray(row.formations) ? row.formations[0] : row.formations;
  return {
    id: row.id,
    formation_id: row.formation_id,
    type_formation: row.type_formation,
    nom: row.nom,
    prenom: row.prenom,
    email: row.email,
    telephone: row.telephone,
    date_naissance: row.date_naissance,
    adresse: row.adresse,
    niveau: row.niveau,
    documents_paths: row.documents_paths,
    statut: row.statut,
    note_admin: row.note_admin,
    created_at: row.created_at,
    updated_at: row.updated_at,
    formation_titre: f?.titre ?? null,
    formation_slug: f?.slug ?? null,
  };
}

type RawDevis = Omit<Devis, never> & {
  formations?: { titre: string; slug: string } | { titre: string; slug: string }[] | null;
};

function normalizeDevis(row: RawDevis): DevisWithFormation {
  const f = Array.isArray(row.formations) ? row.formations[0] : row.formations;
  return {
    id: row.id,
    formation_id: row.formation_id,
    type_formation: row.type_formation,
    niveau: row.niveau,
    duree: row.duree,
    nom: row.nom,
    email: row.email,
    telephone: row.telephone,
    message: row.message,
    statut: row.statut,
    note_admin: row.note_admin,
    created_at: row.created_at,
    updated_at: row.updated_at,
    formation_titre: f?.titre ?? null,
    formation_slug: f?.slug ?? null,
  };
}
