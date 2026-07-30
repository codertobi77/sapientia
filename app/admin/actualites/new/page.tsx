import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { ActualitesForm } from "@/components/blocks/admin/forms/actualites-form";

export const dynamic = "force-dynamic";

export default async function NewActualitePage() {
  await requireAdminOrRedirect("/admin/actualites");
  return (
    <section className="container-site py-10">
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Nouvelle actualité</h1>
      <ActualitesForm />
    </section>
  );
}
