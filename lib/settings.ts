import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  DEFAULT_IDENTITY,
  DEFAULT_SOCIALS,
  DEFAULT_STATS,
  DEFAULT_NAV,
  DEFAULT_LOGO,
  buildSocialLinks,
  normalizePhones,
  normalizeAddresses,
  type SiteIdentity,
  type SiteSocials,
  type Stat,
  type NavItem,
  type LogoConfig,
  type SocialLink,
} from "@/lib/site-defaults";

// ============================================================================
// DAL publique pour les paramètres du site (lecture seule, publique via RLS).
//
// Lecture mise en cache via unstable_cache avec le tag "site-settings".
// L'invalidation se fait côté admin par revalidateTag("site-settings") après
// chaque sauvegarde (cf route /api/admin/settings).
//
// IMPORTANT : unstable_cache n'autorise PAS l'accès à cookies()/headers() dans
// le scope du cache. On utilise donc un client Supabase anonyme (sans cookies)
// — RLS autorise le SELECT public sur site_settings.
// Si la table est vide (ou en erreur / projet non encore migré), on retombe
// sur les defaults canoniques de lib/site-defaults.ts.
// ============================================================================

const SETTINGS_KEYS = ["identity", "socials", "stats", "nav", "logo"] as const;
export type SettingsKey = (typeof SETTINGS_KEYS)[number];

type RawSettings = Partial<{
  identity: SiteIdentity;
  socials: SiteSocials;
  stats: Stat[];
  nav: NavItem[];
  logo: LogoConfig;
}>;

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function fetchSettings(): Promise<RawSettings> {
  const supabase = getAnonClient();
  if (!supabase) return {};
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");
    if (error) return {};
    const out: RawSettings = {};
    for (const row of data ?? []) {
      const key = row.key as SettingsKey;
      if (SETTINGS_KEYS.includes(key)) {
        (out as Record<string, unknown>)[key] = row.value;
      }
    }
    return out;
  } catch {
    return {};
  }
}

const getCachedSettings = unstable_cache(
  async () => fetchSettings(),
  ["site-settings"],
  { tags: ["site-settings"] },
);

export type SiteSettings = {
  identity: SiteIdentity;
  socials: SiteSocials;
  socialLinks: SocialLink[];
  stats: Stat[];
  nav: NavItem[];
  logo: LogoConfig;
};

export async function getSettings(): Promise<SiteSettings> {
  const raw = await getCachedSettings();
  // Fusion tolérante : accepte l'ancien schéma `phone: string` (DB non migrée)
  // et le nouveau `phones: string[]`. `normalizePhones` gère les deux.
  const rawPhones = normalizePhones(
    (raw.identity as Partial<SiteIdentity> & { phone?: string } | undefined)?.phones,
  );
  const fallbackPhones =
    rawPhones.length > 0 ? rawPhones : DEFAULT_IDENTITY.phones;
  const rawAddresses = normalizeAddresses(
    (raw.identity as Partial<SiteIdentity> & { address?: string } | undefined)?.addresses,
  );
  const fallbackAddresses =
    rawAddresses.length > 0 ? rawAddresses : DEFAULT_IDENTITY.addresses;
  const identity: SiteIdentity = {
    ...DEFAULT_IDENTITY,
    ...raw.identity,
    phones: fallbackPhones,
    addresses: fallbackAddresses,
  };
  const socials: SiteSocials = { ...DEFAULT_SOCIALS, ...raw.socials };
  return {
    identity,
    socials,
    socialLinks: buildSocialLinks(socials),
    stats: Array.isArray(raw.stats) && raw.stats.length ? raw.stats : DEFAULT_STATS,
    nav: Array.isArray(raw.nav) && raw.nav.length ? raw.nav : DEFAULT_NAV,
    logo: { ...DEFAULT_LOGO, ...raw.logo },
  };
}

// Helpers spécialisés (plus légers quand on n'a besoin que d'une section)
export async function getIdentity(): Promise<SiteIdentity> {
  return (await getSettings()).identity;
}
export async function getSocials(): Promise<{ socials: SiteSocials; links: SocialLink[] }> {
  const s = await getSettings();
  return { socials: s.socials, links: s.socialLinks };
}
export async function getStats(): Promise<Stat[]> {
  return (await getSettings()).stats;
}
export async function getNav(): Promise<NavItem[]> {
  return (await getSettings()).nav;
}
export async function getLogo(): Promise<LogoConfig> {
  return (await getSettings()).logo;
}
