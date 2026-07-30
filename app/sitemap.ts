import type { MetadataRoute } from "next";
import { getPublishedFormations, getPublishedActualites } from "@/lib/data-public";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://efes-sapientia.bj";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [formations, actualites] = await Promise.all([
    getPublishedFormations(),
    getPublishedActualites(100),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/qui-sommes-nous`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/formations`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/formation-presentiel`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/formation-distance`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/actualites`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/galerie`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/inscription`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/devis`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/connexion`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/inscription/compte`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/recuperation`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const formationRoutes: MetadataRoute.Sitemap = formations.map((f) => ({
    url: `${SITE_URL}/formations/${f.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const actualiteRoutes: MetadataRoute.Sitemap = actualites.map((a) => ({
    url: `${SITE_URL}/actualites/${a.slug}`,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...formationRoutes, ...actualiteRoutes];
}
