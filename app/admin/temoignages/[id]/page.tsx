import { notFound } from "next/navigation";
import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { getTemoignage } from "@/lib/data-admin";
import { TemoignagesForm } from "@/components/blocks/admin/forms/temoignages-form";

export const dynamic = "force-dynamic";

export default async function EditTemoignagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminOrRedirect("/admin/temoignages");
  const { id } = await params;
  const { data, error } = await getTemoignage(id);
  if (error || !data) notFound();
  return (
    <section className="container-site py-10">
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Modifier le témoignage</h1>
      <TemoignagesForm initial={data} />
    </section>
  );
}
