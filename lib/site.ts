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
  email: "contact@efes-sapientia.bj",
  phone: "+229 00 00 00 00",
  address: "Quartier Ouando, Porto-Novo, Bénin",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "22900000000",
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
  { label: "Formations", href: "/formations" },
  { label: "Présentiel", href: "/formation-presentiel" },
  { label: "E-learning", href: "/formation-distance" },
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
export type Stat = { value: string; label: string; icon: string };
export const STATS: Stat[] = [
  { value: "17+", label: "Membres fondateurs", icon: "users" },
  { value: "9", label: "Filières enseignées", icon: "graduation" },
  { value: "4", label: "Campus au Bénin", icon: "map" },
  { value: "1500+", label: "Étudiants formés", icon: "student" },
  { value: "98%", label: "Taux de réussite", icon: "award" },
];
