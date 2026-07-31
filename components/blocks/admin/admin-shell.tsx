import * as React from "react";
import { Sidebar } from "@/components/blocks/admin/sidebar";
import { MobileNav } from "@/components/blocks/admin/mobile-nav";
import { AdminTopbar } from "@/components/blocks/admin/admin-topbar";
import { getIdentity } from "@/lib/settings";
import { listMessages } from "@/lib/data-admin-inbox";

/**
 * Shell du back-office (Server Component asynchrone).
 * Layout :
 *   - AdminTopbar (sticky, client) : fil d'Ariane, avatar, badge messages,
 *     « Voir le site », déconnexion. Commune desktop + mobile.
 *   - Sur mobile : MobileNav (menu burger) sous la topbar.
 *   - Sur desktop : sidebar fixe (sticky sous la topbar) à gauche.
 *   - Contenu dans un conteneur large max-w-6xl.
 *
 * Le nombre de messages non lus est calculé côté serveur via le DAL admin
 * (service role). En cas d'erreur (ex. service role non configuré), on
 * retombe à 0 silencieusement pour ne pas casser le shell.
 */
export async function AdminShell({
  admin,
  children,
}: {
  admin: { name: string | null } | null;
  children: React.ReactNode;
}) {
  const name = admin?.name?.trim() || "Administrateur";

  let shortName = "SAPIENTIA";
  let unreadCount = 0;
  try {
    shortName = (await getIdentity()).shortName || shortName;
  } catch {
    /* defaults */
  }
  try {
    unreadCount = (await listMessages({ lu: false })).length;
  } catch {
    unreadCount = 0;
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Topbar (sticky) desktop + mobile */}
      <AdminTopbar
        adminName={name}
        shortName={shortName}
        unreadCount={unreadCount}
      />

      {/* Menu mobile (Sheet) */}
      <MobileNav adminName={name} shortName={shortName} unreadCount={unreadCount} />

      <div className="flex">
        {/* Sidebar desktop (sticky sous la topbar : top-16 = hauteur topbar) */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-border bg-white md:block">
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
