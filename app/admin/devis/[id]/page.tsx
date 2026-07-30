import Link from "next/link";
import { notFound } from "next/navigation";
import { getDevis } from "@/lib/data-admin-inbox";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, StatutBadge, Field } from "@/components/blocks/admin/ui";
import { StatutForm } from "@/components/blocks/admin/inbox/statut-form";
import { EmailForm } from "@/components/blocks/admin/inbox/email-form";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DevisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const devis = await getDevis(id).catch(() => null);
  if (!devis) notFound();

  return (
    <div>
      <PageHeader
        title={devis.nom}
        description="Détail de la demande de devis."
        actions={
          <Link href="/admin/devis">
            <Button variant="outline" size="sm">
              ← Retour
            </Button>
          </Link>
        }
      />

      <div className="flex items-center gap-3 mb-6">
        <StatutBadge statut={devis.statut} />
        {devis.formation_titre && (
          <Badge variant="goldLight">{devis.formation_titre}</Badge>
        )}
        {devis.formation_slug && (
          <Link
            href={`/formations/${devis.formation_slug}`}
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
            <CardTitle>Demandeur</CardTitle>
            <CardDescription>Informations fournies pour le devis.</CardDescription>
          </CardHeader>
          <CardBody>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom">{devis.nom}</Field>
              <Field label="E-mail">{devis.email}</Field>
              <Field label="Téléphone">{devis.telephone ?? "—"}</Field>
              <Field label="Type de formation">{devis.type_formation}</Field>
              <Field label="Niveau">{devis.niveau ?? "—"}</Field>
              <Field label="Durée souhaitée">{devis.duree ?? "—"}</Field>
              <Field label="Reçue le">{formatDate(devis.created_at)}</Field>
            </dl>
            {devis.message && (
              <div className="mt-6 p-4 rounded-xl bg-navy-50 text-sm text-ink whitespace-pre-wrap">
                {devis.message}
              </div>
            )}
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traitement</CardTitle>
            </CardHeader>
            <CardBody>
              <StatutForm
                id={devis.id}
                kind="devis"
                initialStatut={devis.statut}
                initialNote={devis.note_admin}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répondre par e-mail</CardTitle>
              <CardDescription>Envoi direct au demandeur ({devis.email}).</CardDescription>
            </CardHeader>
            <CardBody>
              <EmailForm
                id={devis.id}
                kind="devis"
                defaultObjet={`Suite à votre demande de devis${
                  devis.formation_titre ? ` — ${devis.formation_titre}` : ""
                }`}
                defaultMessage={
                  devis.duree
                    ? `Bonjour,\n\nSuite à votre demande concernant une formation (${devis.type_formation}${devis.niveau ? `, niveau ${devis.niveau}` : ""}, durée ${devis.duree}), voici les informations…\n\nCordialement.`
                    : undefined
                }
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
