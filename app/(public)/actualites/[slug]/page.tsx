import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Section } from "@/components/blocks/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { actualiteTypeLabel, formatDate } from "@/lib/format";
import { getActualite } from "@/lib/data";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";

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
    openGraph: a.image_url
      ? { images: [{ url: a.image_url }] }
      : undefined,
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
      {/* En-tête — l'image de l'actualité en arrière-plan (si présente). */}
      <section className="bg-navy text-white relative overflow-hidden">
        {actualite.image_url && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={actualite.image_url}
              alt=""
              aria-hidden
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-navy/40" />
          </div>
        )}
        <div className="container-site relative py-12 lg:py-16 z-10">
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

          <ArticleContent html={actualite.contenu ?? actualite.extrait ?? ""} />

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

/**
 * Affiche le contenu richtext d'un article préalablement sanitisé
 * (sanitizeArticleHtml retire script/on*, data-* et balises non listées).
 * Le HTML étant produit uniquement par le back-office admin authentifié,
 * le rendu via dangerouslySetInnerHTML est sûr après sanitisation.
 */
function ArticleContent({ html }: { html: string }) {
  const clean = sanitizeArticleHtml(html);
  return (
    <div
      className="prose prose-slate max-w-none
        [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-navy [&_h1]:mt-6 [&_h1]:mb-3
        [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mt-5 [&_h2]:mb-2
        [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-navy [&_h3]:mt-4 [&_h3]:mb-2
        [&_p]:text-slate [&_p]:leading-relaxed [&_p]:my-3
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3
        [&_li]:text-slate [&_li]:my-1
        [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate [&_blockquote]:my-4
        [&_a]:text-gold [&_a]:underline [&_a]:font-semibold
        [&_img]:rounded-xl [&_img]:my-4 [&_img]:w-full [&_img]:h-auto
        [&_code]:bg-cream [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
