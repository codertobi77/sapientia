import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import { Section, SectionHeading } from "@/components/blocks/section";
import type { Actualite } from "@/lib/data";
import { formatDate, actualiteTypeLabel } from "@/lib/format";

const NEWS_IMAGES = [
  "/images/1785609508171.jpg",
  "/images/1785609544451.jpg",
  "/images/1785609397909.jpg"
];

export function ActualitesWidget({ actualites }: { actualites: Actualite[] }) {
  const [featured, ...rest] = actualites;
  return (
    <Section>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <SectionHeading
            align="left"
            eyebrow="Actualités"
            title="Les dernières actualités"
            description="Événements, séminaires, partenariats et nouveautés de l'EFES-SAPIENTIA."
          />
          <Link
            href="/actualites"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:gap-2.5 transition-all"
          >
            Toutes les actualités
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="lg:col-span-2">
          {featured && (
            <Link
              href={`/actualites/${featured.slug}`}
              className="group block rounded-3xl bg-navy text-white overflow-hidden mb-6 hover:-translate-y-1 transition-all duration-300 shadow-premium"
            >
              <div className="grid sm:grid-cols-2">
                <div className="aspect-video sm:aspect-auto bg-navy-700 relative overflow-hidden">
                  <Image src={featured.image_url || "/images/1785609511731.jpg"} alt={featured.titre} fill className="object-cover opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
                  <Newspaper className="absolute inset-0 m-auto h-12 w-12 text-white/40" />
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center relative z-10">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold mb-2">
                    {actualiteTypeLabel(featured.type)}
                  </span>
                  <h3 className="font-display text-2xl font-bold">{featured.titre}</h3>
                  <p className="mt-3 text-white/75 text-sm leading-relaxed line-clamp-3">
                    {featured.extrait}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/60">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(featured.date)}
                  </span>
                </div>
              </div>
            </Link>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((a, i) => (
              <Link
                key={a.id}
                href={`/actualites/${a.slug}`}
                className="group rounded-2xl bg-white border border-border p-4 hover:-translate-y-1 hover:shadow-premium transition-all duration-300 flex flex-col"
              >
                <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden shrink-0 bg-slate/10">
                   <Image src={a.image_url || NEWS_IMAGES[i % NEWS_IMAGES.length]} alt={a.titre} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-gold-600">
                  {actualiteTypeLabel(a.type)}
                </span>
                <h4 className="mt-2 font-semibold text-navy leading-snug line-clamp-2 group-hover:text-gold transition-colors">
                  {a.titre}
                </h4>
                <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs text-muted">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(a.date)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
