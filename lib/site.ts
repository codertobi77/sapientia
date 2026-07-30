import {
  BookOpen,
  Sigma,
  Code2,
  Atom,
  FlaskConical,
  Cpu,
  Landmark,
  Globe,
  Leaf,
  type LucideIcon,
} from "lucide-react";

export const SITE = {
  name: "EFES « SAPIENTIA »",
  shortName: "SAPIENTIA",
  subtitle: "Université privée de formation des enseignants",
  email: "info@sapientia-efes.bj",
  phone: "+229 01 97 45 32 10",
  address: "Porto-Novo, Bénin",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "22901974532",
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
} as const;

export type SocialLink = { href: string; key: "facebook" | "instagram" | "linkedin" | "youtube"; label: string };

export const SOCIAL_LINKS: SocialLink[] = [
  { href: SITE.socials.facebook, key: "facebook", label: "Facebook" },
  { href: SITE.socials.instagram, key: "instagram", label: "Instagram" },
  { href: SITE.socials.linkedin, key: "linkedin", label: "LinkedIn" },
  { href: SITE.socials.youtube, key: "youtube", label: "YouTube" },
];

export type NavItem = { label: string; href: string };

export const NAV: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
  { label: "Nos formations", href: "/formations" },
  { label: "Formation à distance", href: "/formation-distance" },
  { label: "Formation en présentiel", href: "/formation-presentiel" },
  { label: "Actualités", href: "/actualites" },
  { label: "Galerie", href: "/galerie" },
  { label: "Contact", href: "/contact" },
];

export const FORMATION_ICONS: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  sigma: Sigma,
  code: Code2,
  atom: Atom,
  "flask-conical": FlaskConical,
  cpu: Cpu,
  landmark: Landmark,
  globe: Globe,
  leaf: Leaf,
};

// Chiffres clés (affichés dans la bande flottante + page Qui sommes-nous)
export type Stat = { value: string; label: string; sublabel?: string; icon: string };
export const STATS: Stat[] = [
  { value: "+500", label: "Étudiants formés", icon: "student" },
  { value: "+100", label: "Formateurs qualifiés", icon: "graduation" },
  { value: "20+", label: "Programmes de formation", icon: "book" },
  { value: "2", label: "Sites actuels", sublabel: "(Porto-Novo, Parakou)", icon: "map" },
  { value: "2", label: "Nouveaux sites en cours", sublabel: "(Savè, Calavi)", icon: "pin" },
];
