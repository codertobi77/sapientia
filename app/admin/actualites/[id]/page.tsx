import { notFound } from "next/navigation";
import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { getActualite } from "@/lib/data-admin";
import { ActualitesForm } from "@/components/blocks/admin/forms/actualites-form";

export const dynamic = "force-dynamic";

export default async function EditActualitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminOrRedirect("/admin/actualites");
  const { id } = await params;
  const { data, error } = await getActualite(id);
  if (error || !data) notFound();
  return (
    <section className="container-site py-10">
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Modifier l'actualité</h1>
      <ActualitesForm initial={data} />
    </section>
  );
}
