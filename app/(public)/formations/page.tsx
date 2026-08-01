import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/blocks/page-hero";
import { Section } from "@/components/blocks/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FORMATION_ICONS } from "@/lib/site";
import { getFormations, type Formation } from "@/lib/data";

export const metadata: Metadata = {
  title: "Formations — EFES « SAPIENTIA »",
  description:
    "Neuf filières d'excellence : Lettres Modernes, Mathématiques, Informatique, Physique, Chimie, Technologie, Histoire, Géographie et SVT.",
};

const typeLabel: Record<Formation["type"], string> = {
  PRESENTIEL: "Présentiel",
  DISTANCE: "E-learning",
  LES_DEUX: "Présentiel & E-learning",
};

export default async function FormationsPage() {
  const formations = await getFormations();

  return (
    <>
      <PageHero
        eyebrow="Nos filières"
        title={
          <>
            Neuf <span className="text-gold">filières</span> d'excellence
          </>
        }
        description="Des formations disciplinaires exigeantes pour préparer les enseignants de demain, en présentiel et à distance."
        imageSrc="/images/1785609404565.jpg"
      />

      <Section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map((f) => {
            const Icon = FORMATION_ICONS[f.icone ?? ""] ?? ArrowRight;
            return (
              <Card key={f.id} className="group p-7 flex flex-col hover:-translate-y-1 transition-all duration-300 hover:shadow-premium-lg">
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy group-hover:bg-navy group-hover:text-white transition-colors">
                    <Icon className="h-7 w-7" />
                  </span>
                  <Badge variant={f.type === "DISTANCE" ? "gold" : "navyLight"}>
                    {typeLabel[f.type]}
                  </Badge>
                </div>
                <h2 className="mt-5 font-display text-xl font-bold text-navy">{f.titre}</h2>
                <p className="mt-3 text-slate text-sm leading-relaxed flex-1">
                  {f.description ?? ""}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 rounded-3xl bg-navy text-white p-10 lg:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gold/15 blur-3xl" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-3xl lg:text-4xl font-bold">Prêt à rejoindre l'aventure ?</h2>
            <p className="mt-4 text-white/80 max-w-xl mx-auto">
              Inscrivez-vous en ligne ou demandez un devis personnalisé pour l'une de nos formations.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/inscription"
                className="inline-flex items-center gap-2 h-13 px-8 rounded-full bg-gold text-navy font-semibold hover:bg-gold-600 hover:-translate-y-0.5 shadow-premium transition-all duration-300"
              >
                S'inscrire
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/devis"
                className="inline-flex items-center gap-2 h-13 px-8 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
