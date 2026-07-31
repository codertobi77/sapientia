import type { Metadata } from "next";
import { Hero } from "@/components/blocks/hero";
import { StatsBand } from "@/components/blocks/stats-band";
import { FormationsSection } from "@/components/blocks/formations-section";
import { ActualitesWidget } from "@/components/blocks/actualites-widget";
import { TemoignagesSection } from "@/components/blocks/temoignages-section";
import { PartenairesSection } from "@/components/blocks/partenaires-section";
import {
  getFormations,
  getActualites,
  getTemoignages,
  getPartenaires,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "EFES « SAPIENTIA » — Établissement privé de formation des enseignants",
  description:
    "Formations en présentiel et à distance au Bénin. Plus de 17 membres fondateurs, 9 filières, 4 campus : Porto-Novo, Parakou, Savè et Abomey-Calavi.",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://efes-sapientia.bj";

export default async function HomePage() {
  const [formations, actualites, temoignages, partenaires] = await Promise.all([
    getFormations(),
    getActualites(4),
    getTemoignages(3),
    getPartenaires(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "EFES « SAPIENTIA »",
    alternateName: "SAPIENTIA",
    description:
      "Établissement privé de formation des enseignants au Bénin. Formations en présentiel et à distance : Porto-Novo, Parakou, Savè, Abomey-Calavi.",
    url: SITE_URL,
    email: "contact@efes-sapientia.bj",
    telephone: "+22900000000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Quartier Ouando",
      addressLocality: "Porto-Novo",
      addressCountry: "BJ",
    },
    sameAs: [
      "https://facebook.com",
      "https://instagram.com",
      "https://linkedin.com",
      "https://youtube.com",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <StatsBand />
      <FormationsSection formations={formations} />
      <ActualitesWidget actualites={actualites} />
      <TemoignagesSection temoignages={temoignages} />
      <PartenairesSection partenaires={partenaires} />
    </>
  );
}
