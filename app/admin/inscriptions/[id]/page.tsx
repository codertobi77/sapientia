import Link from "next/link";
import { notFound } from "next/navigation";
import { getInscription } from "@/lib/data-admin-inbox";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, StatutBadge, Field } from "@/components/blocks/admin/ui";
import { StatutForm } from "@/components/blocks/admin/inbox/statut-form";
import { EmailForm } from "@/components/blocks/admin/inbox/email-form";
import { DocumentList } from "@/components/blocks/admin/inbox/document-list";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function InscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inscription = await getInscription(id).catch(() => null);
  if (!inscription) notFound();

  return (
    <div>
      <PageHeader
        title={`${inscription.prenom} ${inscription.nom}`}
        description="Détail de la demande d'inscription."
        actions={
          <>
            <a
              href={`/api/admin/inscriptions/export`}
              title="Exporter toutes les inscriptions en CSV"
            >
              <Button variant="ghost" size="sm">
                Export CSV (toutes)
              </Button>
            </a>
            <Link href="/admin/inscriptions">
              <Button variant="outline" size="sm">
                ← Retour
              </Button>
            </Link>
          </>
        }
      />

      <div className="flex items-center gap-3 mb-6">
        <StatutBadge statut={inscription.statut} />
        {inscription.formation_titre && (
          <Badge variant="goldLight">{inscription.formation_titre}</Badge>
        )}
        {inscription.type_formation && (
          <Badge variant="navyLight">
            {inscription.type_formation === "PRESENTIEL"
              ? "En présentiel"
              : inscription.type_formation === "DISTANCE"
                ? "À distance (e-learning)"
                : inscription.type_formation}
          </Badge>
        )}
        {inscription.formation_slug && (
          <Link
            href={`/formations/${inscription.formation_slug}`}
            className="text-xs text-muted hover:text-navy"
            target="_blank"
          >
            Voir la formation ↗
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Candidat</CardTitle>
            <CardDescription>Informations fournies lors de l'inscription.</CardDescription>
          </CardHeader>
          <CardBody>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom complet">
                {inscription.prenom} {inscription.nom}
              </Field>
              <Field label="E-mail">{inscription.email}</Field>
              <Field label="Téléphone">{inscription.telephone ?? "—"}</Field>
              <Field label="Date de naissance">
                {inscription.date_naissance ? formatDate(inscription.date_naissance) : "—"}
              </Field>
              <Field label="Adresse">{inscription.adresse ?? "—"}</Field>
              <Field label="Type de formation">
                {inscription.type_formation === "PRESENTIEL"
                  ? "En présentiel"
                  : inscription.type_formation === "DISTANCE"
                    ? "À distance (e-learning)"
                    : (inscription.type_formation ?? "—")}
              </Field>
              <Field label="Niveau">{inscription.niveau ?? "—"}</Field>
              <Field label="Reçue le">{formatDate(inscription.created_at)}</Field>
            </dl>

            <div className="mt-8">
              <CardTitle className="text-base mb-3">Pièces jointes</CardTitle>
              <DocumentList paths={inscription.documents_paths} />
            </div>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traitement</CardTitle>
            </CardHeader>
            <CardBody>
              <StatutForm
                id={inscription.id}
                kind="inscriptions"
                initialStatut={inscription.statut}
                initialNote={inscription.note_admin}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répondre par e-mail</CardTitle>
              <CardDescription>
                Envoi direct au candidat ({inscription.email}).
              </CardDescription>
            </CardHeader>
            <CardBody>
              <EmailForm
                id={inscription.id}
                kind="inscriptions"
                defaultObjet={`Suite à votre demande d'inscription${
                  inscription.formation_titre ? ` — ${inscription.formation_titre}` : ""
                }`}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
