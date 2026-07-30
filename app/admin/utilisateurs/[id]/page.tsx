import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/data-admin-inbox";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, Field } from "@/components/blocks/admin/ui";
import { RoleBadge } from "@/components/blocks/admin/role-badge";
import { ProfileForm } from "@/components/blocks/admin/inbox/profile-form";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfile(id).catch(() => null);
  if (!profile) notFound();

  return (
    <div>
      <PageHeader
        title={profile.name || "Sans nom"}
        description={profile.email || "Compte utilisateur"}
        actions={
          <Link href="/admin/utilisateurs">
            <Button variant="outline" size="sm">
              ← Retour
            </Button>
          </Link>
        }
      />

      <div className="flex items-center gap-3 mb-6">
        <RoleBadge role={profile.role} />
        <span className="text-sm text-muted">
          {profile.actif ? "Compte actif" : "Compte désactivé"}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
          </CardHeader>
          <CardBody>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom affiché">{profile.name || "—"}</Field>
              <Field label="E-mail">{profile.email || "—"}</Field>
              <Field label="Téléphone">{profile.telephone ?? "—"}</Field>
              <Field label="Créé le">{formatDate(profile.created_at)}</Field>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Édition</CardTitle>
            <CardDescription>Modifier le rôle, le statut et les infos.</CardDescription>
          </CardHeader>
          <CardBody>
            <ProfileForm
              id={profile.id}
              initialRole={profile.role}
              initialActif={profile.actif}
              initialName={profile.name}
              initialTelephone={profile.telephone}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
