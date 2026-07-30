import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { listPartenaires } from "@/lib/data-admin";
import { DataTable, type Column } from "@/components/blocks/admin/data-table";
import { AdminDeleteButton } from "@/components/blocks/admin/admin-delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminPartenaire } from "@/lib/data-admin";

export const dynamic = "force-dynamic";

export default async function AdminPartenairesPage() {
  await requireAdminOrRedirect("/admin/partenaires");
  const { data, error } = await listPartenaires();
  const rows = data ?? [];

  const columns: Column<AdminPartenaire>[] = [
    { key: "ordre", header: "Ordre", className: "w-20", cell: (r) => r.ordre },
    {
      key: "logo",
      header: "",
      className: "w-16",
      cell: (r) =>
        r.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.logo_url} alt="" className="h-8 w-12 rounded object-contain" />
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    {
      key: "nom",
      header: "Nom",
      cell: (r) => (
        <Link href={`/admin/partenaires/${r.id}`} className="font-semibold text-navy hover:underline">
          {r.nom}
        </Link>
      ),
    },
    {
      key: "url",
      header: "Site",
      cell: (r) =>
        r.url ? (
          <a href={r.url} target="_blank" rel="noreferrer" className="text-gold hover:underline truncate">
            {r.url}
          </a>
        ) : (
          <span className="text-muted">—</span>
        ),
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
          <Link href={`/admin/partenaires/${r.id}`}>
            <Button type="button" variant="ghost" size="sm" aria-label="Modifier">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <AdminDeleteButton apiPath="/api/admin/partenaires" id={r.id} />
        </div>
      ),
    },
  ];

  return (
    <section className="container-site py-10">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Partenaires</h1>
          <p className="text-sm text-muted">Logos et liens des partenaires.</p>
        </div>
        <Link href="/admin/partenaires/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nouveau partenaire
          </Button>
        </Link>
      </header>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <DataTable columns={columns} rows={rows} emptyLabel="Aucun partenaire pour le moment." />
    </section>
  );
}
