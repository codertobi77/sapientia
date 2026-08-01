// ============================================================================
// Valeurs canoniques du site (defaults) — source de vérité pour:
//   1. le seed SQL (supabase/migrations/20260801000000_site_settings.sql)
//   2. le fallback quand la table site_settings est vide (lib/settings.ts)
//
// Ces valeurs reproduisent fidèlement les constantes qui étaient hardcodées
// dans lib/site.ts avant la refonte "paramètres éditables". Toute modif ici
// doit aussi être répercutée dans le seed SQL.
// ============================================================================

export type SiteIdentity = {
  name: string;
  shortName: string;
  subtitle: string;
  email: string;
  phones: string[];
  address: string;
  whatsapp: string;
};

/**
 * Normalise une valeur `phones` potentiellement héritée (ancienne colonne
 * `phone: string` slash-séparée, ou tableau déjà propre) en tableau de
 * numéros non vides. Tolérante pour la migration depuis l'ancien schéma.
 */
export function normalizePhones(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map((p) => String(p).trim()).filter(Boolean);
  }
  if (typeof input === "string" && input.trim()) {
    return input.split(/[\/\n,;]/).map((p) => p.trim()).filter(Boolean);
  }
  return [];
}

export type SocialKey = "facebook" | "instagram" | "linkedin" | "youtube";
export type SocialLink = {
  href: string;
  key: SocialKey;
  label: string;
};
export type SiteSocials = Partial<Record<SocialKey, string>>;

export type Stat = {
  value: string;
  label: string;
  sublabel?: string;
  icon: string;
};

export type NavItem = { label: string; href: string };

export type LogoConfig = {
  imageUrl: string;
  alt: string;
  text: string;
  subtitle: string;
};

// ----------------------------------------------------------------------------
// Defaults
// ----------------------------------------------------------------------------

export const DEFAULT_IDENTITY: SiteIdentity = {
  name: "EFES SAPIENTIA",
  shortName: "SAPIENTIA",
  subtitle: "L'excellence dans la formation des enseignants",
  email: "efesapientia@yahoo.fr",
  phones: [
    "+229 0160600376",
    "+229 06060385",
    "+229 95428013",
    "+229 06060372",
  ],
  address: "Porto-Novo, Bénin",
  whatsapp: "229016000376",
};

export const DEFAULT_SOCIALS: SiteSocials = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  linkedin: "https://linkedin.com",
  youtube: "https://youtube.com",
};

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export const DEFAULT_STATS: Stat[] = [
  { value: "+500", label: "Étudiants formés", icon: "student" },
  { value: "+100", label: "Formateurs qualifiés", icon: "graduation" },
  { value: "20+", label: "Programmes de formation", icon: "book" },
  { value: "2", label: "Sites actuels", sublabel: "(Porto-Novo, Parakou)", icon: "map" },
  { value: "2", label: "Nouveaux sites en cours", sublabel: "(Savè, Calavi)", icon: "pin" },
];

export const DEFAULT_NAV: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
  { label: "Nos formations", href: "/formations" },
  { label: "Formation à distance", href: "/formation-distance" },
  { label: "Formation en présentiel", href: "/formation-presentiel" },
  { label: "Actualités", href: "/actualites" },
  { label: "Galerie", href: "/galerie" },
  { label: "Contact", href: "/contact" },
];

export const DEFAULT_LOGO: LogoConfig = {
  imageUrl: "/logo.jpeg",
  alt: "EFES SAPIENTIA",
  text: "EFES SAPIENTIA",
  subtitle: "Établissement privé de formation des enseignants",
};

// Construit le tableau de liens sociaux à partir d'un objet SiteSocials.
export function buildSocialLinks(socials: SiteSocials): SocialLink[] {
  return (Object.keys(SOCIAL_LABELS) as SocialKey[])
    .filter((key) => socials[key])
    .map((key) => ({
      href: socials[key] as string,
      key,
      label: SOCIAL_LABELS[key],
    }));
}

/**
 * Construit un `href` `tel:` valide (sans espaces) à partir d'un numéro
 * affiché. Utilisé par le header, le footer et la page contact.
 */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[\s\/]/g, "")}`;
}
