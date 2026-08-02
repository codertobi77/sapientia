import type { Metadata } from "next";
import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { AdminShell } from "@/components/blocks/admin/admin-shell";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Administration · EFES-SAPIENTIA",
  description: "Back-office de gestion du contenu et des demandes.",
  robots: { index: false, follow: false },
};

/**
 * Layout admin (Server Component). Garantit un admin authentifié ; sinon
 * redirige vers /connexion?next=/admin avant tout rendu. Le `redirect()` de
 * next/navigation lève une erreur NEXT_REDIRECT interrompant le rendu.
 *
 * Le shell (sidebar+topbar) est rendu ici pour toutes les pages /admin/*.
 */
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const admin = await requireAdminOrRedirect("/admin");

  return (
    <ToastProvider>
      <AdminShell admin={admin}>{children}</AdminShell>
    </ToastProvider>
  );
}
