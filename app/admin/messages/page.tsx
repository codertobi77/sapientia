import Link from "next/link";
import { listMessages, type ContactMessage } from "@/lib/data-admin-inbox";
import { PageHeader, EmptyState } from "@/components/blocks/admin/ui";
import { Badge } from "@/components/ui/badge";
import { ToggleState } from "@/components/blocks/admin/inbox/toggle-state";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ lu?: string }>;
}) {
  const { lu: luParam } = await searchParams;
  const filter =
    luParam === "true"
      ? { lu: true }
      : luParam === "false"
        ? { lu: false }
        : undefined;

  let messages: ContactMessage[];
  try {
    messages = await listMessages(filter);
  } catch {
    messages = [];
  }

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Messages reçus depuis le formulaire de contact."
      />

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Link href="/admin/messages">
          <Badge variant={!filter ? "navy" : "neutral"} className="cursor-pointer">
            Tous
          </Badge>
        </Link>
        <Link href="/admin/messages?lu=false">
          <Badge
            variant={filter?.lu === false ? "navy" : "neutral"}
            className="cursor-pointer"
          >
            Non lus
          </Badge>
        </Link>
        <Link href="/admin/messages?lu=true">
          <Badge
            variant={filter?.lu === true ? "navy" : "neutral"}
            className="cursor-pointer"
          >
            Lus
          </Badge>
        </Link>
      </div>

      {messages.length === 0 ? (
        <EmptyState label="Aucun message pour ce filtre." />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border bg-white p-5 transition-colors ${
                m.lu ? "border-border" : "border-navy/30"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-navy">
                    {m.nom}
                    {!m.lu && (
                      <span className="ml-2 inline-block h-2 w-2 rounded-full bg-gold align-middle" />
                    )}
                  </p>
                  <p className="text-sm text-muted">{m.email}</p>
                  {m.sujet && (
                    <p className="text-sm font-medium text-ink">{m.sujet}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <ToggleState
                    id={m.id}
                    resource="messages"
                    field="lu"
                    initialValue={m.lu}
                    activeLabel="Lu"
                    inactiveLabel="Non lu"
                  />
                  <Link href={`/admin/messages/${m.id}`}>
                    <Badge variant="goldLight" className="cursor-pointer">
                      Voir / Répondre
                    </Badge>
                  </Link>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border text-xs text-muted">
                Reçu le {formatDate(m.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
