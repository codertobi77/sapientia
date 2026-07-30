import Link from "next/link";
import { listInscriptions, type DemandeStatut, type InscriptionWithFormation } from "@/lib/data-admin-inbox";
import { PageHeader, StatutBadge, EmptyState } from "@/components/blocks/admin/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

const STATUTS: { value: DemandeStatut; label: string }[] = [
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "TRAITEE", label: "Traîtées" },
  { value: "REFUSEE", label: "Refusées" },
];

export const dynamic = "force-dynamic";

export default async function InscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const { statut: statutParam } = await searchParams;
  const statut =
    statutParam &&
    (["EN_ATTENTE", "TRAITEE", "REFUSEE"] as const).includes(
      statutParam as DemandeStatut,
    )
      ? (statutParam as DemandeStatut)
      : undefined;

  let inscriptions: InscriptionWithFormation[];
  try {
    inscriptions = await listInscriptions(statut);
  } catch {
    inscriptions = [];
  }

  return (
    <div>
      <PageHeader
        title="Inscriptions"
        description="Demandes d'inscription soumises depuis le site public."
        actions={
          <a href="/api/admin/inscriptions/export">
            <Button variant="outline" size="sm">
              Exporter CSV
            </Button>
          </a>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Link href="/admin/inscriptions">
          <Badge
            variant={statut ? "neutral" : "navy"}
            className="cursor-pointer"
          >
            Tous
          </Badge>
        </Link>
        {STATUTS.map((s) => {
          const active = statut === s.value;
          return (
            <Link
              key={s.value}
              href={`/admin/inscriptions?statut=${s.value}`}
            >
              <Badge
                variant={active ? "navy" : "neutral"}
                className="cursor-pointer"
              >
                {s.label}
              </Badge>
            </Link>
          );
        })}
      </div>

      {inscriptions.length === 0 ? (
        <EmptyState label="Aucune demande pour ce filtre." />
      ) : (
        <div className="space-y-3">
          {inscriptions.map((i) => (
            <Link
              key={i.id}
              href={`/admin/inscriptions/${i.id}`}
              className="block rounded-2xl border border-border bg-white p-5 hover:border-navy/30 transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-navy">
                    {i.prenom} {i.nom}
                  </p>
                  <p className="text-sm text-muted">{i.email}</p>
                  {i.telephone && (
                    <p className="text-sm text-muted">{i.telephone}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {i.formation_titre && (
                    <Badge variant="goldLight">{i.formation_titre}</Badge>
                  )}
                  <StatutBadge statut={i.statut} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border text-xs text-muted">
                Reçue le {formatDate(i.created_at)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
