import Link from "next/link";
import {
  ClipboardList,
  FileText,
  Mail,
  Users,
  BookOpen,
  Newspaper,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth-admin";
import {
  dashboardCounts,
  listDemandesInscription,
  listContactMessages,
  listFormations,
} from "@/lib/data-admin";
import { PageHeader } from "@/components/blocks/admin/page-header";
import { StatCard } from "@/components/blocks/admin/stat-card";
import { EmptyState } from "@/components/blocks/admin/empty-state";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

/**
 * Tableau de bord admin : compteurs + dernières demandes (inscriptions &
 * messages). Les pages de modules CRUD (formations/actualites/…) sont créées
 * par le sibling admin-content-crud ; les liens pointent vers ces routes qui
 * n'existeront qu'après merge — c'est intentionnel.
 */
export default async function AdminDashboard() {
  const admin = await requireAdmin("/admin");
  const [counts, inscriptions, messages, formations] = await Promise.all([
    dashboardCounts(),
    listDemandesInscription(),
    listContactMessages(),
    listFormations(),
  ]);

  const recentInscriptions = inscriptions.slice(0, 3);
  const recentMessages = messages.slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tableau de bord"
        description={`Bienvenue, ${admin.profile.name?.trim() || "Administrateur"}. Vue d'ensemble du back-office.`}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Inscriptions en attente"
          value={counts.inscriptionsEnAttente}
          icon={ClipboardList}
          hint="Demandes d'inscription à traiter"
        />
        <StatCard
          label="Devis en attente"
          value={counts.devisEnAttente}
          icon={FileText}
          hint="Demandes de devis à traiter"
        />
        <StatCard
          label="Messages non lus"
          value={counts.messagesNonLus}
          icon={Mail}
          hint="Boîte de réception contact"
        />
        <StatCard
          label="Abonnés newsletter"
          value={counts.abonnesActifs}
          icon={Users}
          hint="Abonnés actifs (non désinscrits)"
        />
        <StatCard
          label="Formations publiées"
          value={counts.formationsPubliees}
          icon={BookOpen}
          hint={`${formations.length} formation(s) au total`}
        />
        <StatCard
          label="Actualités publiées"
          value={counts.actualitesPubliees}
          icon={Newspaper}
          hint="Actualités visibles sur le site"
        />
      </div>

      {/* Listes récentes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">
              Dernières inscriptions
            </h2>
            <Link
              href="/admin/inscriptions"
              className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold-600"
            >
              Tout voir <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          {recentInscriptions.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Aucune inscription"
              description="Les nouvelles demandes d'inscription apparaîtront ici."
            />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white shadow-premium">
              {recentInscriptions.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy">
                      {d.prenom} {d.nom}
                    </p>
                    <p className="truncate text-xs text-muted">{d.email}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs capitalize text-muted">
                      {d.statut.toLowerCase()}
                    </p>
                    <p className="text-xs text-muted">
                      {formatDate(d.created_at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Derniers messages</h2>
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold-600"
            >
              Tout voir <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Aucun message"
              description="Les nouveaux messages du formulaire de contact apparaîtront ici."
            />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white shadow-premium">
              {recentMessages.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy">
                      {m.sujet || "(sans sujet)"}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {m.nom} · {m.email}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={
                        m.lu
                          ? "text-xs text-muted"
                          : "text-xs font-semibold text-gold-600"
                      }
                    >
                      {m.lu ? "Lu" : "Non lu"}
                    </p>
                    <p className="text-xs text-muted">{formatDate(m.created_at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
