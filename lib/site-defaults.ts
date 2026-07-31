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
  phone: string;
  address: string;
  whatsapp: string;
};

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
  phone: "+229 0160600376/60600385/95428013/60600372",
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
