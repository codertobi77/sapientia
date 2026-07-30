import Link from "next/link";
import { listNewsletter, type NewsletterSubscriber } from "@/lib/data-admin-inbox";
import { PageHeader, EmptyState } from "@/components/blocks/admin/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleState } from "@/components/blocks/admin/inbox/toggle-state";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ desinscrit?: string }>;
}) {
  const { desinscrit: dParam } = await searchParams;
  const filter =
    dParam === "true"
      ? { desinscrit: true }
      : dParam === "false"
        ? { desinscrit: false }
        : undefined;

  let subscribers: NewsletterSubscriber[];
  try {
    subscribers = await listNewsletter(filter);
  } catch {
    subscribers = [];
  }

  return (
    <div>
      <PageHeader
        title="Newsletter"
        description="Abonnés à la newsletter (avec statut d'inscription)."
        actions={
          <a href="/api/admin/newsletter/export">
            <Button variant="outline" size="sm">
              Exporter CSV
            </Button>
          </a>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Link href="/admin/newsletter">
          <Badge variant={!filter ? "navy" : "neutral"} className="cursor-pointer">
            Tous
          </Badge>
        </Link>
        <Link href="/admin/newsletter?desinscrit=false">
          <Badge
            variant={filter?.desinscrit === false ? "navy" : "neutral"}
            className="cursor-pointer"
          >
            Abonnés
          </Badge>
        </Link>
        <Link href="/admin/newsletter?desinscrit=true">
          <Badge
            variant={filter?.desinscrit === true ? "navy" : "neutral"}
            className="cursor-pointer"
          >
            Désinscrits
          </Badge>
        </Link>
      </div>

      {subscribers.length === 0 ? (
        <EmptyState label="Aucun abonné pour ce filtre." />
      ) : (
        <div className="space-y-3">
          {subscribers.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-border bg-white p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-navy">{s.email}</p>
                  <p className="text-xs text-muted">
                    Inscrit le {formatDate(s.created_at)}
                  </p>
                </div>
                <ToggleState
                  id={s.id}
                  resource="newsletter"
                  field="desinscrit"
                  initialValue={s.desinscrit}
                  activeLabel="Désinscrit"
                  inactiveLabel="Abonné"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
