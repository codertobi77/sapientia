import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Target, Briefcase, ClipboardCheck, FileText, ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/blocks/page-hero";
import { Section } from "@/components/blocks/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FORMATION_ICONS } from "@/lib/site";
import { getFormation, type Formation } from "@/lib/data";

const typeLabel: Record<Formation["type"], string> = {
  PRESENTIEL: "Présentiel",
  DISTANCE: "E-learning",
  LES_DEUX: "Présentiel & E-learning",
};

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const formation = await getFormation(slug);
  if (!formation) return { title: "Formation introuvable — EFES-SAPIENTIA" };
  return {
    title: `${formation.titre} — EFES-SAPIENTIA`,
    description: formation.description ?? formation.titre,
  };
}

export default async function FormationDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const formation = await getFormation(slug);
  if (!formation) notFound();

  const Icon = FORMATION_ICONS[formation.icone ?? ""] ?? ArrowRight;

  const sections = [
    { titre: "Objectifs", body: formation.objectifs, icon: Target },
    { titre: "Débouchés", body: formation.debouches, icon: Briefcase },
    { titre: "Conditions d'admission", body: formation.conditions_admission, icon: ClipboardCheck },
    { titre: "Modalités d'inscription", body: formation.modalites_inscription, icon: FileText },
  ];

  return (
    <>
      <PageHero
        eyebrow={typeLabel[formation.type]}
        title={formation.titre}
        description={formation.description ?? ""}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <Icon className="h-6 w-6 text-gold" />
          </span>
          <Badge variant="gold">{typeLabel[formation.type]}</Badge>
        </div>
      </PageHero>

      <Section>
        <Link
          href="/formations"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate hover:text-navy transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Toutes les formations
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {sections
              .filter((s) => (s.body ?? "").length > 0)
              .map(({ titre, body, icon: SectionIcon }) => (
                <Card key={titre} className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-50 text-navy">
                      <SectionIcon className="h-5 w-5" />
                    </span>
                    <h2 className="font-display text-xl font-bold text-navy">{titre}</h2>
                  </div>
                  <p className="text-slate leading-relaxed whitespace-pre-line">{body}</p>
                </Card>
              ))}
            {sections.every((s) => !(s.body ?? "").length) && (
              <p className="text-slate">
                Les informations détaillées de cette formation seront publiées prochainement. N'hésitez
                pas à nous contacter pour toute précision.
              </p>
            )}
          </div>

          {/* Colonne CTA */}
          <aside>
            <Card className="p-8 sticky top-32">
              <h3 className="font-display text-xl font-bold text-navy">Rejoindre cette formation</h3>
              <p className="mt-3 text-slate text-sm leading-relaxed">
                Inscrivez-vous en ligne ou demandez un devis personnalisé pour la formation
                « {formation.titre} ».
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={`/inscription?formation=${formation.id}`}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-gold text-navy font-semibold hover:bg-gold-600 hover:-translate-y-0.5 shadow-premium transition-all duration-300"
                >
                  S'inscrire à cette formation
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`/devis?formation=${formation.id}`}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border-2 border-navy text-navy font-semibold hover:bg-navy hover:text-white transition-colors"
                >
                  Demander un devis
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-navy font-semibold hover:bg-navy-50 transition-colors"
                >
                  Poser une question
                </Link>
              </div>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
