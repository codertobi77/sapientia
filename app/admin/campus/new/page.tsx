import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { CampusForm } from "@/components/blocks/admin/forms/campus-form";

export const dynamic = "force-dynamic";

export default async function NewCampusPage() {
  await requireAdminOrRedirect("/admin/campus");
  return (
    <section className="container-site py-10">
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Nouveau campus</h1>
      <CampusForm />
    </section>
  );
}
