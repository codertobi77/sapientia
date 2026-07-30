import { notFound } from "next/navigation";
import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { getFormation } from "@/lib/data-admin";
import { FormationsForm } from "@/components/blocks/admin/forms/formations-form";

export const dynamic = "force-dynamic";

export default async function EditFormationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminOrRedirect("/admin/formations");
  const { id } = await params;
  const { data, error } = await getFormation(id);
  if (error || !data) notFound();

  return (
    <section className="container-site py-10">
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Modifier la formation</h1>
      <FormationsForm initial={data} />
    </section>
  );
}
