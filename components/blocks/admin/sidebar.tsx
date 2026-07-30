"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Newspaper,
  Image as ImageIcon,
  Quote,
  Handshake,
  MapPin,
  ClipboardList,
  FileText,
  Mail,
  Users,
  ExternalLink,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** match exact ("/admin") sinon startsWith pour les sous-routes */
  exact?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/formations", label: "Formations", icon: BookOpen },
  { href: "/admin/actualites", label: "Actualités", icon: Newspaper },
  { href: "/admin/galerie", label: "Galerie", icon: ImageIcon },
  { href: "/admin/temoignages", label: "Témoignages", icon: Quote },
  { href: "/admin/partenaires", label: "Partenaires", icon: Handshake },
  { href: "/admin/campus", label: "Campus", icon: MapPin },
  { href: "/admin/inscriptions", label: "Inscriptions", icon: ClipboardList },
  { href: "/admin/devis", label: "Devis", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
];

/**
 * Sidebar admin (client). Actif via usePathname. Bouton déconnexion : signOut
 * côté navigateur (RLS/cookies) puis redirect /connexion.
 *
 * NOTE : la sidebar rend le même markup pour desktop (fixe) et mobile (dans
 * Sheet). Le composant/appelant décide où l'insérer.
 */
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  async function onLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/connexion");
  }

  return (
    <nav
      aria-label="Navigation administration"
      className="flex h-full flex-col gap-1 p-3"
    >
      <ul className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-gold text-navy shadow-premium"
                    : "text-navy/80 hover:bg-navy-50 hover:text-navy",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-2 border-t border-border pt-2">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-navy/80 transition-colors hover:bg-navy-50 hover:text-navy"
        >
          <ExternalLink className="h-5 w-5 shrink-0" aria-hidden />
          <span>Voir le site</span>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-navy/80 transition-colors hover:bg-navy-50 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <LogOut className="h-5 w-5 shrink-0" aria-hidden />
          <span>Déconnexion</span>
        </button>
      </div>
    </nav>
  );
}
