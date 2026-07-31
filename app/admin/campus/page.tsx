import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { listCampus } from "@/lib/data-admin";
import { DataTable, type Column } from "@/components/blocks/admin/data-table";
import { AdminDeleteButton } from "@/components/blocks/admin/admin-delete-button";
import { Button } from "@/components/ui/button";
import type { AdminCampus } from "@/lib/data-admin";

export const dynamic = "force-dynamic";

export default async function AdminCampusPage() {
  await requireAdminOrRedirect("/admin/campus");
  const { data, error } = await listCampus();
  const rows = data ?? [];

  const columns: Column<AdminCampus>[] = [
    { key: "ordre", header: "Ordre", className: "w-20", cell: (r) => r.ordre },
    {
      key: "ville",
      header: "Ville",
      cell: (r) => (
        <Link href={`/admin/campus/${r.id}`} className="font-semibold text-navy hover:underline">
          {r.ville}
        </Link>
      ),
    },
    { key: "adresse", header: "Adresse", cell: (r) => <span className="text-muted">{r.adresse ?? "—"}</span> },
    { key: "telephone", header: "Téléphone", className: "w-36", cell: (r) => <span className="text-muted">{r.telephone ?? "—"}</span> },
    { key: "email", header: "E-mail", className: "w-48", cell: (r) => <span className="text-muted">{r.email ?? "—"}</span> },
    {
      key: "actions",
      header: "",
      className: "w-28 text-right",
      cell: (r) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/campus/${r.id}`}>
            <Button type="button" variant="ghost" size="sm" aria-label="Modifier">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <AdminDeleteButton apiPath="/api/admin/campus" id={r.id} />
        </div>
      ),
    },
  ];

  return (
    <section className="container-site py-10">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Campus</h1>
          <p className="text-sm text-muted">Les sites et campus de l'établissement.</p>
        </div>
        <Link href="/admin/campus/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nouveau campus
          </Button>
        </Link>
      </header>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <DataTable columns={columns} rows={rows} emptyLabel="Aucun campus pour le moment." />
    </section>
  );
}
