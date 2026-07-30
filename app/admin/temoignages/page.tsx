import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { listTemoignages } from "@/lib/data-admin";
import { DataTable, type Column } from "@/components/blocks/admin/data-table";
import { AdminDeleteButton } from "@/components/blocks/admin/admin-delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminTemoignage } from "@/lib/data-admin";

export const dynamic = "force-dynamic";

export default async function AdminTemoignagesPage() {
  await requireAdminOrRedirect("/admin/temoignages");
  const { data, error } = await listTemoignages();
  const rows = data ?? [];

  const columns: Column<AdminTemoignage>[] = [
    { key: "ordre", header: "Ordre", className: "w-20", cell: (r) => r.ordre },
    {
      key: "auteur",
      header: "Auteur",
      cell: (r) => (
        <Link href={`/admin/temoignages/${r.id}`} className="font-semibold text-navy hover:underline">
          {r.auteur}
        </Link>
      ),
    },
    { key: "role", header: "Rôle", cell: (r) => <span className="text-muted">{r.role ?? "—"}</span> },
    {
      key: "contenu",
      header: "Extrait",
      cell: (r) => <span className="text-muted line-clamp-2 max-w-md">{r.contenu}</span>,
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
          <Link href={`/admin/temoignages/${r.id}`}>
            <Button type="button" variant="ghost" size="sm" aria-label="Modifier">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <AdminDeleteButton apiPath="/api/admin/temoignages" id={r.id} />
        </div>
      ),
    },
  ];

  return (
    <section className="container-site py-10">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Témoignages</h1>
          <p className="text-sm text-muted">Témoignages d'étudiants et enseignants.</p>
        </div>
        <Link href="/admin/temoignages/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nouveau témoignage
          </Button>
        </Link>
      </header>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <DataTable columns={columns} rows={rows} emptyLabel="Aucun témoignage pour le moment." />
    </section>
  );
}
