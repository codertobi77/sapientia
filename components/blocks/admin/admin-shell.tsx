import * as React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Sidebar } from "@/components/blocks/admin/sidebar";
import { MobileNav } from "@/components/blocks/admin/mobile-nav";
import { SITE } from "@/lib/site";
import type { AdminProfile } from "@/lib/auth-admin";

/**
 * Shell du back-office. Server Component simple : sidebar fixe desktop (navy),
 * topbar desktop (nom admin + "Voir le site"), barre mobile (MobileNav client),
 * et le contenu de la page dans un conteneur large.
 */
export function AdminShell({
  admin,
  children,
}: {
  admin: { profile: AdminProfile } | null;
  children: React.ReactNode;
}) {
  const name = admin?.profile.name?.trim() || "Administrateur";

  return (
    <div className="min-h-screen bg-cream">
      <MobileNav adminName={name} />

      {/* Topbar desktop */}
      <header className="hidden border-b border-border bg-navy text-white md:block">
        <div className="flex items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-bold">
              {SITE.shortName} · Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-white/70">
              {name}
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-white/90 transition-colors hover:bg-navy-700"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Voir le site
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar desktop fixe (sticky) */}
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-border bg-white md:block">
          <Sidebar />
        </aside>

        {/* Contenu */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
