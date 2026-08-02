// ============================================================================
// lib/site.ts — limité aux valeurs NON éditables depuis le back-office :
// les icônes de formation (enum fermé lié aux enregistrements de la table
// `formations`).
//
// La configuration éditable (identité, réseaux, chiffres clés, menu, logo)
// vit dans :
//   - lib/site-defaults.ts (valeurs canoniques / defaults)
//   - lib/settings.ts        (lecture publique mise en cache, unstable_cache)
//   - lib/data-admin-settings.ts (écriture admin, service role)
// Les types (Stat, NavItem, SocialLink...) sont éditables et exportés depuis
// lib/site-defaults.ts.
// ============================================================================

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
  Dumbbell,
  type LucideIcon,
} from "lucide-react";

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
  dumbbell: Dumbbell,
};

// Ré-export des types pour la compatibilité descendante d'import.
export type {
  Stat,
  NavItem,
  SocialLink,
  SiteIdentity,
  SiteSocials,
  LogoConfig,
} from "@/lib/site-defaults";
