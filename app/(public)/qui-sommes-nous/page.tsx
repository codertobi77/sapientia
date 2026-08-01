import type { Metadata } from "next";
import { Users, Target, Compass, Eye, Sparkles, GraduationCap, Landmark, Globe, Award, BookOpen } from "lucide-react";
import { PageHero } from "@/components/blocks/page-hero";
import { Section, SectionHeading } from "@/components/blocks/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Qui sommes-nous — EFES « SAPIENTIA »",
  description:
    "EFES « SAPIENTIA », établissement privé de formation des enseignants au Bénin. 17 membres fondateurs, 9 filières, 4 campus, une pédagogie innovante et accessible.",
};

const stats = [
  { value: "17+", label: "Membres fondateurs", icon: Users },
  { value: "9", label: "Filières enseignées", icon: GraduationCap },
  { value: "4", label: "Campus au Bénin", icon: Landmark },
  { value: "1500+", label: "Étudiants formés", icon: BookOpen },
  { value: "98%", label: "Taux de réussite", icon: Award },
];

const piliers = [
  { titre: "Excellence", description: "Des enseignants qualifiés et des contenus rigoureux.", icon: Award },
  { titre: "Accessibilité", description: "Des formations en présentiel et à distance pour tous.", icon: Globe },
  { titre: "Innovation", description: "Une plateforme e-learning et des méthodes actives.", icon: Sparkles },
  { titre: "Engagement", description: "Accompagner chaque étudiant jusqu'à la réussite.", icon: Target },
  { titre: "Intégrité", description: "Une gouvernance transparente et des valeurs fortes.", icon: Compass },
];

export default function QuiSommesNousPage() {
  return (
    <>
      <PageHero
        eyebrow="L'institution"
        title={
          <>
            Un établissement né d'une <span className="text-gold">ambition pédagogique</span>.
          </>
        }
        description="L'EFES « SAPIENTIA » réunit des enseignants engagés pour former la nouvelle génération d'éducateurs au Bénin, sur 4 campus et via une plateforme e-learning."
        imageSrc="/images/1785609397909.jpg"
      />

      {/* 2 colonnes : text + carte membres fondateurs */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-in-up">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
              Notre raison d'être
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy leading-tight">
              Former des enseignants qui transformeront l'école béninoise.
            </h2>
            <div className="mt-6 space-y-4 text-slate text-lg leading-relaxed">
              <p>
                Créée par des pédagogues et des universitaires convaincus que l'éducation est le
                levier du développement, l'EFES « SAPIENTIA » conjugue exigence académique et
                accessibilité.
              </p>
              <p>
                Nous proposons neuf filières disciplinaires, sur quatre campus et en ligne, pour
                préparer les enseignants de demain à transmettre un savoir solide et critique.
              </p>
            </div>
          </div>

          {/* Carte navy membres fondateurs avec gros 17 */}
          <Card className="bg-navy text-white border-navy p-0 overflow-hidden animate-fade-in-up">
            <div className="relative p-10 lg:p-14 h-full">
              <div className="absolute inset-0">
                <img src="/images/1785609452235.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
                <div
                  className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/60 to-gold/20"
                  aria-hidden
                />
              </div>
              <div className="relative text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-4">
                  Membres fondateurs
                </p>
                <p className="font-display text-7xl lg:text-8xl font-bold leading-none text-gold">
                  17+
                </p>
                <p className="mt-5 text-white/80 max-w-sm mx-auto leading-relaxed">
                  Des enseignants-chercheurs, des pédagogues et des ingénieurs réunis par une même
                  vision de l'éducation.
                </p>
                <div className="mt-8 inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/10">
                  <Users className="h-9 w-9 text-gold" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Image + badge */}
      <Section className="bg-cream pt-0">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 rounded-3xl bg-gradient-to-br from-navy via-navy-700 to-gold/30 min-h-[360px] flex items-center justify-center relative overflow-hidden">
            <div className="text-center px-8 py-16">
              <GraduationCap className="h-16 w-16 text-gold mx-auto mb-4" />
              <p className="font-display text-2xl font-bold text-white">Des campus modernes et accueillants</p>
              <p className="text-white/70 mt-2">Porto-Novo · Parakou · Savè · Abomey-Calavi</p>
            </div>
            <Badge variant="gold" className="absolute top-6 left-6">
              <Award className="h-3.5 w-3.5" />
              Excellence pédagogique
            </Badge>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy leading-tight">
              Une institution ancrée au Bénin, ouverte au monde.
            </h2>
            <p className="mt-5 text-slate text-lg leading-relaxed">
              Nos campus accueille un environnement d'apprentissage convivial et équipé, tandis que
              notre plateforme e-learning permet de se former où que l'on soit.
            </p>
            <ul className="mt-6 space-y-3">
              {["Salles modernes et bibliothèque", "Enseignants qualifiés et encadrement", "Plateforme e-learning complète"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-navy">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold text-navy">
                      ✓
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </Section>

      {/* 5 stats */}
      <Section className="py-10 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map(({ value, label, icon: Icon }) => (
            <Card key={label} className="p-6 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-50 text-navy mb-4 mx-auto">
                <Icon className="h-6 w-6" />
              </span>
              <p className="font-display text-3xl font-bold text-navy">{value}</p>
              <p className="mt-1 text-sm text-slate">{label}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 3 blocs : raison / engagement / vision */}
      <Section className="bg-cream">
        <SectionHeading
          eyebrow="Nos orientations"
          title="Raison, engagement, vision"
          description="Trois principes guident chaque décision de notre institution."
        />
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              titre: "Notre raison",
              texte:
                "Démocratiser la formation des enseignants pour relever le niveau de l'éducation au Bénin et au-delà.",
            },
            {
              icon: Compass,
              titre: "Notre engagement",
              texte:
                "Accompagner chaque étudiant par un encadrement de proximité, des ressources pertinentes et une pédagogie active.",
            },
            {
              icon: Eye,
              titre: "Notre vision",
              texte:
                "Devenir la référence de la formation des enseignants en Afrique de l'Ouest, en présentiel et à distance.",
            },
          ].map(({ icon: Icon, titre, texte }) => (
            <Card key={titre} className="p-8 hover:-translate-y-1 transition-all duration-300 hover:shadow-premium-lg">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-gold mb-5">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="font-display text-xl font-bold text-navy">{titre}</h3>
              <p className="mt-3 text-slate leading-relaxed">{texte}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 5 piliers bandeau navy */}
      <section className="bg-navy text-white py-12 lg:py-16">
        <div className="container-site">
          <SectionHeading
            light
            eyebrow="Nos valeurs"
            title="Cinq piliers fondateurs"
            description="Les principes qui structurent la vie académique et humaine de l'EFES « SAPIENTIA »."
          />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {piliers.map(({ titre, description, icon: Icon }) => (
              <div
                key={titre}
                className="rounded-3xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 mb-4">
                  <Icon className="h-6 w-6 text-gold" />
                </span>
                <h3 className="font-display text-lg font-bold">{titre}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
