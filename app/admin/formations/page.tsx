import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { listFormations } from "@/lib/data-admin";
import { DataTable, type Column } from "@/components/blocks/admin/data-table";
import { AdminDeleteButton } from "@/components/blocks/admin/admin-delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminFormation } from "@/lib/data-admin";

export const dynamic = "force-dynamic";

export default async function AdminFormationsPage() {
  await requireAdminOrRedirect("/admin/formations");
  const { data, error } = await listFormations();
  const rows = data ?? [];

  const columns: Column<AdminFormation>[] = [
    { key: "ordre", header: "Ordre", cell: (r) => r.ordre, className: "w-20" },
    {
      key: "titre",
      header: "Titre",
      cell: (r) => (
        <Link href={`/admin/formations/${r.id}`} className="font-semibold text-navy hover:underline">
          {r.titre}
        </Link>
      ),
    },
    { key: "slug", header: "Slug", cell: (r) => <code className="text-xs text-muted">{r.slug}</code> },
    {
      key: "type",
      header: "Type",
      cell: (r) => <Badge variant="navyLight">{r.type}</Badge>,
    },
    {
      key: "published",
      header: "Statut",
      cell: (r) => <Badge variant={r.published ? "gold" : "neutral"}>{r.published ? "Publié" : "Brouillon"}</Badge>,
    },
    {
      key: "actions",
      header: "",
      className: "w-28 text-right",
      cell: (r) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/formations/${r.id}`}>
            <Button type="button" variant="ghost" size="sm" aria-label="Modifier">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <AdminDeleteButton apiPath="/api/admin/formations" id={r.id} />
        </div>
      ),
    },
  ];

  return (
    <section className="container-site py-10">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Formations</h1>
          <p className="text-sm text-muted">Gérez les filières affichées sur le site.</p>
        </div>
        <Link href="/admin/formations/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nouvelle formation
          </Button>
        </Link>
      </header>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <DataTable columns={columns} rows={rows} emptyLabel="Aucune formation pour le moment." />
    </section>
  );
}
