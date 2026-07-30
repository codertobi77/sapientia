import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { listGalerie } from "@/lib/data-admin";
import { DataTable, type Column } from "@/components/blocks/admin/data-table";
import { AdminDeleteButton } from "@/components/blocks/admin/admin-delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { AdminGalerieItem } from "@/lib/data-admin";

export const dynamic = "force-dynamic";

export default async function AdminGaleriePage() {
  await requireAdminOrRedirect("/admin/galerie");
  const { data, error } = await listGalerie();
  const rows = data ?? [];

  const columns: Column<AdminGalerieItem>[] = [
    {
      key: "vignette",
      header: "",
      className: "w-16",
      cell: (r) => {
        const src = r.type === "VIDEO" ? r.vignette_url : r.url;
        if (!src) return <span className="text-muted">—</span>;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-10 w-14 rounded object-cover" />
        );
      },
    },
    { key: "ordre", header: "Ordre", className: "w-20", cell: (r) => r.ordre },
    {
      key: "titre",
      header: "Titre",
      cell: (r) => (
        <Link href={`/admin/galerie/${r.id}`} className="font-semibold text-navy hover:underline">
          {r.titre || <span className="text-muted">Sans titre</span>}
        </Link>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (r) => <Badge variant="navyLight">{r.type === "PHOTO" ? "Photo" : "Vidéo"}</Badge>,
    },
    {
      key: "categorie",
      header: "Catégorie",
      cell: (r) => <Badge variant="goldLight">{r.categorie}</Badge>,
    },
    { key: "date", header: "Date", className: "w-32", cell: (r) => <span className="text-muted">{formatDate(r.date)}</span> },
    {
      key: "actions",
      header: "",
      className: "w-28 text-right",
      cell: (r) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/galerie/${r.id}`}>
            <Button type="button" variant="ghost" size="sm" aria-label="Modifier">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <AdminDeleteButton apiPath="/api/admin/galerie" id={r.id} />
        </div>
      ),
    },
  ];

  return (
    <section className="container-site py-10">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Galerie</h1>
          <p className="text-sm text-muted">Photos et vidéos du campus.</p>
        </div>
        <Link href="/admin/galerie/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nouvel élément
          </Button>
        </Link>
      </header>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <DataTable columns={columns} rows={rows} emptyLabel="Aucun élément dans la galerie." />
    </section>
  );
}
