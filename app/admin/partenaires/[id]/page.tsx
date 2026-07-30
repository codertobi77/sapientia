import { notFound } from "next/navigation";
import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { getPartenaire } from "@/lib/data-admin";
import { PartenairesForm } from "@/components/blocks/admin/forms/partenaires-form";

export const dynamic = "force-dynamic";

export default async function EditPartenairePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminOrRedirect("/admin/partenaires");
  const { id } = await params;
  const { data, error } = await getPartenaire(id);
  if (error || !data) notFound();
  return (
    <section className="container-site py-10">
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Modifier le partenaire</h1>
      <PartenairesForm initial={data} />
    </section>
  );
}
