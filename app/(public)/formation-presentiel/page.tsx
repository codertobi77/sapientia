import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, Users, GraduationCap, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";
import { PageHero } from "@/components/blocks/page-hero";
import { Section, SectionHeading } from "@/components/blocks/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCampus, getFormations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Formation en présentiel — EFES « SAPIENTIA »",
  description:
    "Un encadrement de proximité, des salles modernes et un emploi du temps structuré sur nos 4 campus au Bénin : Porto-Novo, Parakou, Savè et Abomey-Calavi.",
};

const organisation = [
  { titre: "Encadrement", texte: "Des enseignants qualifiés accompagnent chaque promotion en petits groupes.", icon: Users },
  { titre: "Emploi du temps", texte: "Un calendrier structuré entre cours magistraux, TP et travaux dirigés.", icon: CalendarDays },
  { titre: "Ressources", texte: "Bibliothèque, salles équipées et espaces d'étude accessibles.", icon: BookOpen },
];

const avantages = [
  "Interaction directe avec les enseignants",
  "Travaux pratiques en petit groupe",
  "Vie de campus et activités associatives",
  "Accompagnement personnalisé vers la réussite",
];

export default async function FormationPresentielPage() {
  const [campus, formations] = await Promise.all([getCampus(), getFormations()]);

  return (
    <>
      <PageHero
        eyebrow="Sur campus"
        title={
          <>
            La formation en <span className="text-gold">présentiel</span>
          </>
        }
        description="Apprendre au contact des enseignants et des pairs, sur nos campus équipés et accueillants."
      />

      {/* Présentation + organisation */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
              Une pédagogie incarnée
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy leading-tight">
              Le présentiel, au cœur de la transmission.
            </h2>
            <p className="mt-5 text-slate text-lg leading-relaxed">
              La formation en présentiel favorise l'échange, la rigueur et l'esprit d'équipe. Nos
              campus offrent un cadre propice à l'apprentissage et à la vie étudiante.
            </p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-navy via-navy-700 to-gold/30 min-h-[340px] flex items-center justify-center relative overflow-hidden">
            <GraduationCap className="h-16 w-16 text-gold" />
            <Badge variant="gold" className="absolute top-6 left-6">
              <MapPin className="h-3.5 w-3.5" />
              4 campus
            </Badge>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {organisation.map(({ titre, texte, icon: Icon }) => (
            <Card key={titre} className="p-8">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy mb-5">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="font-display text-xl font-bold text-navy">{titre}</h3>
              <p className="mt-3 text-slate leading-relaxed">{texte}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Calendrier + photo */}
      <Section className="bg-cream">
        <SectionHeading eyebrow="Organisation" title="Un calendrier pensé pour la réussite" />
        <div className="mt-14 grid lg:grid-cols-3 gap-6">
          {[
            { periode: "Septembre — Décembre", phase: "Semestre 1", texte: "Fondamentaux disciplinaires et transversaux." },
            { periode: "Janvier — Mai", phase: "Semestre 2", texte: "Approfondissement, TP et travaux dirigés." },
            { periode: "Juin — Juillet", phase: "Stage & examens", texte: "Mise en pratique et évaluations finales." },
          ].map((b) => (
            <Card key={b.phase} className="p-8">
              <CalendarDays className="h-8 w-8 text-gold mb-4" />
              <p className="text-sm font-semibold text-gold-600 uppercase tracking-wide">{b.phase}</p>
              <p className="mt-1 font-display text-lg font-bold text-navy">{b.periode}</p>
              <p className="mt-3 text-slate text-sm leading-relaxed">{b.texte}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Campus */}
      <Section>
        <SectionHeading
          eyebrow="Nos campus"
          title="Quatre villes, une même exigence"
          description="Choisissez le campus le plus proche de chez vous : Porto-Novo, Parakou, Savè et Abomey-Calavi."
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {campus.map((c) => (
            <Card key={c.id} className="p-7 flex flex-col">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-50 text-navy mb-4">
                <MapPin className="h-6 w-6" />
              </span>
              <h3 className="font-display text-lg font-bold text-navy">{c.ville}</h3>
              <p className="mt-2 text-sm text-slate">{c.adresse ?? "Bénin"}</p>
              {c.telephone && <p className="mt-1 text-sm text-slate">{c.telephone}</p>}
            </Card>
          ))}
        </div>
      </Section>

      {/* Avantages navy */}
      <section className="bg-navy text-white py-20 lg:py-28">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
              Pourquoi le présentiel ?
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-tight">
              Des avantages qui font la différence.
            </h2>
            <ul className="mt-8 space-y-4">
              {avantages.map((a) => (
                <li key={a} className="flex items-start gap-3 text-white/90">
                  <CheckCircle2 className="h-6 w-6 text-gold shrink-0" />
                  <span className="text-lg leading-snug">{a}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/inscription?formation=&type=PRESENTIEL"
              className="mt-8 inline-flex items-center gap-2 h-13 px-8 rounded-full bg-gold text-navy font-semibold hover:bg-gold-600 hover:-translate-y-0.5 shadow-premium transition-all duration-300"
            >
              S'inscrire en présentiel
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-4">Filières disponibles en présentiel</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {formations.map((f) => (
                <li key={f.id} className="flex items-center gap-2 text-sm text-white/90">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                  {f.titre}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
