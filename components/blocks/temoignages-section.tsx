import { Quote } from "lucide-react";
import Image from "next/image";
import { Section, SectionHeading } from "@/components/blocks/section";
import { Card } from "@/components/ui/card";
import type { Temoignage } from "@/lib/data";

const AVATAR_IMAGES = [
  "/images/1785609516480.jpg",
  "/images/1785609522900.jpg",
  "/images/1785609538735.jpg",
  "/images/1785609558467.jpg"
];

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
              <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 border-2 border-white/20 bg-navy">
                <Image src={t.photo_url || AVATAR_IMAGES[i % AVATAR_IMAGES.length]} alt={t.auteur} fill className="object-cover" />
              </div>
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
