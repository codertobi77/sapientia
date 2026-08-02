import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Section } from "@/components/blocks/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { actualiteTypeLabel, formatDate } from "@/lib/format";
import { getActualite } from "@/lib/data";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await getActualite(slug);
  if (!a) return { title: "Actualité introuvable — EFES-SAPIENTIA" };
  return {
    title: `${a.titre} — EFES-SAPIENTIA`,
    description: a.extrait ?? a.titre,
  };
}

export default async function ActualiteDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const actualite = await getActualite(slug);
  if (!actualite) notFound();

  return (
    <>
      {/* En-tête */}
      <section className="bg-navy text-white">
        <div className="container-site py-12 lg:py-16">
          <Badge variant="gold" className="mb-4">
            {actualiteTypeLabel(actualite.type)}
          </Badge>
          <h1 className="text-3xl lg:text-5xl font-bold leading-tight text-balance max-w-3xl">
            {actualite.titre}
          </h1>
          <p className="mt-4 text-white/70 text-sm">{formatDate(actualite.date)}</p>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate hover:text-navy transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Toutes les actualités
          </Link>

          {actualite.extrait && (
            <p className="text-lg text-slate leading-relaxed mb-8">{actualite.extrait}</p>
          )}

          <div className="prose prose-slate max-w-none">
            <p className="text-slate leading-relaxed whitespace-pre-line">
              {actualite.contenu ?? actualite.extrait ?? ""}
            </p>
          </div>

          {/* CTA */}
          <Card className="mt-12 p-8 bg-navy border-navy text-white text-center">
            <h2 className="font-display text-2xl font-bold">Une question sur cette actualité ?</h2>
            <p className="mt-3 text-white/80">Contactez notre équipe, nous serons ravis d'échanger avec vous.</p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-full bg-gold text-navy font-semibold hover:bg-gold-600 transition-all duration-300"
            >
              Nous contacter
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </Section>
    </>
  );
}
