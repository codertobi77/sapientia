import { notFound } from "next/navigation";
import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { getGalerieItem } from "@/lib/data-admin";
import { GalerieForm } from "@/components/blocks/admin/forms/galerie-form";

export const dynamic = "force-dynamic";

export default async function EditGalerieItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminOrRedirect("/admin/galerie");
  const { id } = await params;
  const { data, error } = await getGalerieItem(id);
  if (error || !data) notFound();
  return (
    <section className="container-site py-10">
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Modifier l'élément</h1>
      <GalerieForm initial={data} />
    </section>
  );
}
