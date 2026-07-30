import Link from "next/link";
import { listProfiles, type Profile } from "@/lib/data-admin-inbox";
import { PageHeader, EmptyState } from "@/components/blocks/admin/ui";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RoleBadge } from "@/components/blocks/admin/role-badge";
import { ToggleState } from "@/components/blocks/admin/inbox/toggle-state";
import { CreateUserForm } from "@/components/blocks/admin/inbox/create-user-form";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function UtilisateursPage() {
  let profiles: Profile[];
  try {
    profiles = await listProfiles();
  } catch {
    profiles = [];
  }

  return (
    <div>
      <PageHeader
        title="Utilisateurs"
        description="Comptes (auth.users) et profils associés."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Comptes existants</CardTitle>
            <CardDescription>
              Rôle et statut modifiables sur la fiche détaillée.
            </CardDescription>
          </CardHeader>
          <CardBody>
            {profiles.length === 0 ? (
              <EmptyState label="Aucun compte enregistré." />
            ) : (
              <div className="space-y-3">
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-border bg-white p-4 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-navy">
                        {p.name || "Sans nom"}
                      </p>
                      {p.email && (
                        <p className="text-sm text-muted">{p.email}</p>
                      )}
                      <p className="text-xs text-muted">
                        Créé le {formatDate(p.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <RoleBadge role={p.role} />
                      <ToggleState
                        id={p.id}
                        resource="users"
                        field="actif"
                        initialValue={p.actif}
                        activeLabel="Actif"
                        inactiveLabel="Inactif"
                      />
                      <Link
                        href={`/admin/utilisateurs/${p.id}`}
                        className="text-xs font-semibold text-navy hover:text-navy-700"
                      >
                        Éditer
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Créer un compte</CardTitle>
            <CardDescription>
              Crée un nouvel utilisateur (e-mail confirmé, rôle choisi).
            </CardDescription>
          </CardHeader>
          <CardBody>
            <CreateUserForm />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
