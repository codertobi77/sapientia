import { Quote } from "lucide-react";
import { Section, SectionHeading } from "@/components/blocks/section";
import { Card } from "@/components/ui/card";
import type { Temoignage } from "@/lib/data";

const avatars = ["#0A2345", "#143B6E", "#0f2e57"];

export function TemoignagesSection({ temoignages }: { temoignages: Temoignage[] }) {
  return (
    <Section className="bg-navy text-white">
      <SectionHeading
        light
        eyebrow="Témoignages"
        title="Ils nous font confiance"
        description="Étudiants, diplômés et partenaires partagent leur expérience à l'EFES « SAPIENTIA »."
      />
      <div className="mt-14 grid md:grid-cols-3 gap-6">
        {temoignages.map((t, i) => (
          <Card
            key={t.id}
            className="bg-white/[0.06] border-white/10 text-white backdrop-blur-sm p-8 lg:p-10 rounded-3xl"
          >
            <Quote className="h-9 w-9 text-gold mb-5" />
            <p className="text-white/85 leading-relaxed text-lg">« {t.contenu} »</p>
            <div className="mt-7 flex items-center gap-4">
              <span
                className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: avatars[i % avatars.length] }}
                aria-hidden
              >
                {t.auteur.charAt(0)}
              </span>
              <div>
                <p className="font-semibold">{t.auteur}</p>
                <p className="text-sm text-white/60">{t.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
