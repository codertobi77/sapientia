import type { Metadata } from "next";
import { getGalerie } from "@/lib/data";
import { PageHero } from "@/components/blocks/page-hero";
import { Section } from "@/components/blocks/section";
import { GalerieGrid } from "@/components/blocks/galerie-grid";

export const metadata: Metadata = {
  title: "Galerie — EFES « SAPIENTIA »",
  description:
    "Photos et vidéos de la vie de campus, des événements et des promotions de l'EFES « SAPIENTIA ».",
};

export default async function GaleriePage() {
  const items = await getGalerie();
  const categories = Array.from(new Set(items.map((i) => i.categorie)));

  return (
    <>
      <PageHero
        eyebrow="Images & vidéos"
        title={
          <>
            La <span className="text-gold">galerie</span> SAPIENTIA
          </>
        }
        description="Plongez dans la vie de nos campus : cérémonies, salles de cours, événements et promotions."
      />
      <Section>
        {items.length === 0 ? (
          <p className="text-slate text-center py-20">
            Aucun média pour le moment. Revenez bientôt découvrir nos campus en images.
          </p>
        ) : (
          <GalerieGrid items={items} categories={categories} />
        )}
      </Section>
    </>
  );
}
