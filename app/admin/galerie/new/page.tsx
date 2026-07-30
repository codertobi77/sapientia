import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { GalerieForm } from "@/components/blocks/admin/forms/galerie-form";

export const dynamic = "force-dynamic";

export default async function NewGalerieItemPage() {
  await requireAdminOrRedirect("/admin/galerie");
  return (
    <section className="container-site py-10">
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Nouvel élément de galerie</h1>
      <GalerieForm />
    </section>
  );
}
