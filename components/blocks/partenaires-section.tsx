import { Section } from "@/components/blocks/section";
import type { Partenaire } from "@/lib/data";

export function PartenairesSection({ partenaires }: { partenaires: Partenaire[] }) {
  return (
    <Section className="bg-white py-16">
      <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-muted mb-10">
        Nos partenaires institutionnels
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {partenaires.map((p) =>
          p.url ? (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-display font-bold text-navy/60 hover:text-navy transition-colors"
            >
              {p.nom}
            </a>
          ) : (
            <span
              key={p.id}
              className="text-2xl font-display font-bold text-navy/60 hover:text-navy transition-colors"
            >
              {p.nom}
            </span>
          ),
        )}
      </div>
    </Section>
  );
}
