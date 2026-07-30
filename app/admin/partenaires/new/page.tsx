import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { PartenairesForm } from "@/components/blocks/admin/forms/partenaires-form";

export const dynamic = "force-dynamic";

export default async function NewPartenairePage() {
  await requireAdminOrRedirect("/admin/partenaires");
  return (
    <section className="container-site py-10">
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Nouveau partenaire</h1>
      <PartenairesForm />
    </section>
  );
}
