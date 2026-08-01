"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  LogOut,
  Mail,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// Libellés lisibles pour le fil d'Ariane à partir du deuxième segment du path.
const BREADCRUMB_LABELS: Record<string, string> = {
  formations: "Formations",
  actualites: "Actualités",
  temoignages: "Témoignages",
  partenaires: "Partenaires",
  campus: "Campus",
  inscriptions: "Inscriptions",
  devis: "Devis",
  messages: "Messages",
  newsletter: "Newsletter",
  utilisateurs: "Utilisateurs",
  parametres: "Paramètres",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Barre supérieure du back-office (sticky, client).
 * - Fil d'Ariane généré depuis usePathname (2 niveaux).
 * - Avatar (initiales) + nom admin.
 * - Badge "messages non lus" → /admin/messages.
 * - "Voir le site" + déconnexion (signOut navigateur puis redirect /connexion).
 *
 * Le nombre de messages non lus est passé en prop par le layout (serveur).
 */
export function AdminTopbar({
  adminName,
  shortName,
  unreadCount = 0,
}: {
  adminName: string;
  shortName: string;
  unreadCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/").filter(Boolean); // ex: ["admin", "messages"]
  const section = segments[1]; // "messages"
  const crumb = section ? BREADCRUMB_LABELS[section] ?? decodeURIComponent(section) : null;

  async function onLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/connexion");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" className="flex min-w-0 items-center gap-1.5 text-sm">
          <span className="font-display text-base font-bold text-navy hidden sm:inline">
            {shortName}
          </span>
          <span className="text-muted hidden sm:inline">·</span>
          <Link
            href="/admin"
            className={cn(
              "rounded-md px-1.5 py-0.5 font-medium transition-colors",
              !crumb ? "text-navy" : "text-muted hover:text-navy",
            )}
          >
            Admin
          </Link>
          {crumb && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-muted shrink-0" />
              <span className="truncate font-semibold text-navy">{crumb}</span>
            </>
          )}
        </nav>

        {/* Actions à droite */}
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {/* Badge messages non lus */}
          <Link
            href="/admin/messages"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-navy transition-colors hover:bg-navy-50"
            aria-label={
              unreadCount > 0
                ? `${unreadCount} message(s) non lu(s)`
                : "Messages"
            }
            title="Messages"
          >
            <Mail className="h-5 w-5" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-navy ring-2 ring-white"
                aria-hidden
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Voir le site */}
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-semibold text-navy transition-colors hover:bg-navy-50"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Voir le site
          </Link>

          {/* Avatar + nom */}
          <div className="hidden items-center gap-2.5 pl-1 md:flex">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
              {initials(adminName) || "AD"}
            </span>
            <span className="text-sm font-semibold text-navy max-w-[10rem] truncate">
              {adminName}
            </span>
          </div>

          {/* Déconnexion */}
          <button
            type="button"
            onClick={onLogout}
            aria-label="Déconnexion"
            title="Déconnexion"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-navy transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
