import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { FormationsForm } from "@/components/blocks/admin/forms/formations-form";

export const dynamic = "force-dynamic";

export default async function NewFormationPage() {
  await requireAdminOrRedirect("/admin/formations");
  return (
    <section className="container-site py-10">
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Nouvelle formation</h1>
      <FormationsForm />
    </section>
  );
}
