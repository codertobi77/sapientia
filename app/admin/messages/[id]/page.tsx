import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessage } from "@/lib/data-admin-inbox";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, Field } from "@/components/blocks/admin/ui";
import { EmailForm } from "@/components/blocks/admin/inbox/email-form";
import { ToggleState } from "@/components/blocks/admin/inbox/toggle-state";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const msg = await getMessage(id).catch(() => null);
  if (!msg) notFound();

  return (
    <div>
      <PageHeader
        title={msg.sujet ?? "Message"}
        description={`De ${msg.nom}`}
        actions={
          <Link href="/admin/messages">
            <Button variant="outline" size="sm">
              ← Retour
            </Button>
          </Link>
        }
      />

      <div className="mb-6">
        <ToggleState
          id={msg.id}
          resource="messages"
          field="lu"
          initialValue={msg.lu}
          activeLabel="Marquer comme lu"
          inactiveLabel="Marquer comme non lu"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Message</CardTitle>
            <CardDescription>Reçu le {formatDate(msg.created_at)}.</CardDescription>
          </CardHeader>
          <CardBody>
            <dl className="grid gap-4 sm:grid-cols-2 mb-6">
              <Field label="Auteur">{msg.nom}</Field>
              <Field label="E-mail">{msg.email}</Field>
              <Field label="Sujet">{msg.sujet ?? "—"}</Field>
              <Field label="Statut">{msg.lu ? "Lu" : "Non lu"}</Field>
            </dl>
            <div className="p-4 rounded-xl bg-navy-50 text-sm text-ink whitespace-pre-wrap">
              {msg.message}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répondre par e-mail</CardTitle>
            <CardDescription>Envoi direct à {msg.email}.</CardDescription>
          </CardHeader>
          <CardBody>
            <EmailForm
              id={msg.id}
              kind="messages"
              defaultObjet={msg.sujet ? `Re: ${msg.sujet}` : "Votre message à EFES « SAPIENTIA »"}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
