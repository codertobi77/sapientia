import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_IDENTITY,
  DEFAULT_SOCIALS,
  DEFAULT_STATS,
  DEFAULT_NAV,
  DEFAULT_LOGO,
  type SiteIdentity,
  type SiteSocials,
  type Stat,
  type NavItem,
  type LogoConfig,
} from "@/lib/site-defaults";

// ============================================================================
// DAL admin (service role) pour les paramètres du site.
//
// Lecture (getSettingsAdmin) : retourne une section ou toutes les sections.
//   En l'absence d'une ligne en base, retourne les defaults canoniques.
// Écriture (updateSettingsSection) : upsert d'une section (value JSONB).
//   Le caller valide le payload via Zod avant d'appeler.
//
// L'invalidation du cache public (revalidateTag) se fait dans la route API,
// pas ici (DAL = accès données uniquement).
// ============================================================================

export type SettingsSection = "identity" | "socials" | "stats" | "nav" | "logo";

export type AdminSettings = {
  identity: SiteIdentity;
  socials: SiteSocials;
  stats: Stat[];
  nav: NavItem[];
  logo: LogoConfig;
};

function adminOrThrow() {
  const client = createAdminClient();
  if (!client) {
    throw new Error("Service role non configuré (SUPABASE_SERVICE_ROLE_KEY)");
  }
  return client;
}

export async function getSettingsAdmin(): Promise<AdminSettings> {
  const supabase = adminOrThrow();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");
  if (error) throw error;

  const map: Record<string, unknown> = {};
  for (const row of data ?? []) {
    map[row.key] = row.value;
  }

  return {
    identity: { ...DEFAULT_IDENTITY, ...(map.identity as Partial<SiteIdentity> ?? {}) },
    socials: { ...DEFAULT_SOCIALS, ...(map.socials as Partial<SiteSocials> ?? {}) },
    stats: Array.isArray(map.stats) && (map.stats as Stat[]).length
      ? (map.stats as Stat[])
      : DEFAULT_STATS,
    nav: Array.isArray(map.nav) && (map.nav as NavItem[]).length
      ? (map.nav as NavItem[])
      : DEFAULT_NAV,
    logo: { ...DEFAULT_LOGO, ...(map.logo as Partial<LogoConfig> ?? {}) },
  };
}

export async function updateSettingsSection(
  section: SettingsSection,
  value: unknown,
): Promise<AdminSettings> {
  const supabase = adminOrThrow();
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: section, value, updated_at: now }, { onConflict: "key" });
  if (error) throw error;
  // retourne l'état complet à jour
  return getSettingsAdmin();
}
