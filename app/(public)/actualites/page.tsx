import type { Metadata } from "next";
import { getActualites, type Actualite } from "@/lib/data";
import { PageHero } from "@/components/blocks/page-hero";
import { Section } from "@/components/blocks/section";
import { ActualitesList } from "@/components/blocks/actualites-list";

export const metadata: Metadata = {
  title: "Actualités — EFES « SAPIENTIA »",
  description:
    "Événements, séminaires, concours, partenariats et nouveautés de l'EFES « SAPIENTIA ».",
};

export default async function ActualitesPage() {
  const actualites = await getActualites(50);
  const types = Array.from(new Set(actualites.map((a) => a.type)));

  return (
    <>
      <PageHero
        eyebrow="La vie de l'institution"
        title={
          <>
            Nos <span className="text-gold">actualités</span>
          </>
        }
        description="Suivez la vie académique, les événements et les partenariats de l'EFES « SAPIENTIA »."
        imageSrc="/images/1785609503889.jpg"
      />
      <Section>
        <ActualitesList actualites={actualites} types={types} />
      </Section>
    </>
  );
}
