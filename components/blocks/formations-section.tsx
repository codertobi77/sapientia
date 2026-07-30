import Link from "next/link";
import { ArrowRight, Laptop, Smartphone, Sparkles } from "lucide-react";
import { Section, SectionHeading } from "@/components/blocks/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FORMATION_ICONS } from "@/lib/site";
import type { Formation } from "@/lib/data";

export function FormationsSection({ formations }: { formations: Formation[] }) {
  // On insère la carte e-learning après la 4e formation pour qu'elle
  // tombe au centre visuel de la grille à 3 colonnes.
  const first = formations.slice(0, 4);
  const rest = formations.slice(4);

  return (
    <Section className="bg-cream">
      <SectionHeading
        eyebrow="Nos filières"
        title="Nos formations"
        description="Neuf filières d'excellence pour former les enseignants de demain, du Lettres aux Sciences de la Vie et de la Terre."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {first.map((f) => (
          <FormationCard key={f.id} formation={f} />
        ))}

        {/* Carte E-learning centrale, plus imposante */}
        <ElearningCard />

        {rest.map((f) => (
          <FormationCard key={f.id} formation={f} />
        ))}
      </div>
    </Section>
  );
}

function FormationCard({ formation }: { formation: Formation }) {
  const Icon = FORMATION_ICONS[formation.icone ?? ""] ?? ArrowRight;
  return (
    <Card className="group p-7 hover:-translate-y-1 transition-all duration-300 hover:shadow-premium-lg h-full flex flex-col">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy mb-5 group-hover:bg-navy group-hover:text-white transition-colors">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="font-display text-xl font-bold text-navy">{formation.titre}</h3>
      <p className="mt-3 text-slate text-sm leading-relaxed flex-1">
        {formation.description ?? ""}
      </p>
      <Link
        href={`/formations/${formation.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:gap-2.5 transition-all"
      >
        En savoir plus
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}

function ElearningCard() {
  return (
    <Card className="lg:row-span-1 p-0 overflow-hidden bg-navy text-white border-navy hover:-translate-y-1 transition-all duration-300 hover:shadow-premium-lg relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-700 to-gold/20" aria-hidden />
      <div className="relative p-7 lg:p-8 h-full flex flex-col">
        <Badge variant="gold" className="self-start mb-5">
          <Sparkles className="h-3.5 w-3.5" />
          Nouveau
        </Badge>

        <h3 className="font-display text-2xl font-bold">Plateforme E-learning</h3>
        <p className="mt-3 text-white/80 text-sm leading-relaxed max-w-xs">
          Une expérience d'apprentissage complète : cours vidéo, visioconférences,
          exercices interactifs, examens en ligne et certifications.
        </p>

        {/* Illustration laptop + smartphone */}
        <div className="mt-6 flex items-end gap-3">
          <span className="inline-flex h-14 w-14 rounded-2xl bg-white/10 items-center justify-center">
            <Laptop className="h-7 w-7 text-gold" />
          </span>
          <span className="inline-flex h-10 w-10 rounded-xl bg-white/10 items-center justify-center">
            <Smartphone className="h-5 w-5 text-gold" />
          </span>
        </div>

        <Link
          href="/formation-distance"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:gap-2.5 transition-all"
        >
          Découvrir la plateforme
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
