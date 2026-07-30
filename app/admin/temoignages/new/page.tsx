import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { TemoignagesForm } from "@/components/blocks/admin/forms/temoignages-form";

export const dynamic = "force-dynamic";

export default async function NewTemoignagePage() {
  await requireAdminOrRedirect("/admin/temoignages");
  return (
    <section className="container-site py-10">
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Nouveau témoignage</h1>
      <TemoignagesForm />
    </section>
  );
}
