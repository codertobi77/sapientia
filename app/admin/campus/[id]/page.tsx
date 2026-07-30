import { notFound } from "next/navigation";
import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { getCampus } from "@/lib/data-admin";
import { CampusForm } from "@/components/blocks/admin/forms/campus-form";

export const dynamic = "force-dynamic";

export default async function EditCampusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminOrRedirect("/admin/campus");
  const { id } = await params;
  const { data, error } = await getCampus(id);
  if (error || !data) notFound();
  return (
    <section className="container-site py-10">
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Modifier le campus</h1>
      <CampusForm initial={data} />
    </section>
  );
}
