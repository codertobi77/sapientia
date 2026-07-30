import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin, AdminAuthError } from "@/lib/auth-admin";
import { AdminNav } from "@/components/blocks/admin/admin-nav";
import { Logo } from "@/components/blocks/logo";

// ██ STUB partiel (admin-inbox) ██
// Le chrome (layout/sidebar/header admin) définitif devrait venir de FOUNDATIONS.
// Cette version est autonome pour permettre tsc/build dans ce worktree ; à merge,
// conserver la version de foundations pour le chrome et garder uniquement les
// pages + routes de admin-inbox.

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      const status = err.status;
      if (status === 401) {
        redirect("/connexion?next=/admin");
      }
      // 403 : non admin authentifié
      redirect("/connexion?next=/admin&forbidden=1");
    }
    throw err;
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row">
      <aside className="lg:w-72 lg:min-h-screen bg-white border-b lg:border-b-0 lg:border-r border-border p-6 flex flex-col gap-8">
        <div className="flex items-center justify-between lg:justify-start gap-3">
          <Logo />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
            Back-office
          </p>
          <AdminNav />
        </div>
        <div className="mt-auto text-xs text-muted">
          <Link href="/" className="hover:text-navy">
            ← Retour au site
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
