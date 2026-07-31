import { Section } from "@/components/blocks/section";
import { cn } from "@/lib/utils";
import type { Partenaire } from "@/lib/data";

/**
 * Bandeau des partenaires institutionnels.
 * Affiche le LOGO du partenaire quand il est défini ; sinon retombe sur le
 * nom affiché en texte. Le tout est cliquable vers `url` si renseigné.
 */
export function PartenairesSection({ partenaires }: { partenaires: Partenaire[] }) {
  return (
    <Section className="bg-white py-16">
      <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-muted mb-10">
        Nos partenaires institutionnels
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {partenaires.map((p) => {
          const hasLogo = !!p.logo_url;
          // Contenu : logo image si défini, sinon le nom en texte.
          const content = hasLogo ? (
            // img (pas next/image) : pas de remotePatterns configuré, et on
            // reste cohérent avec le reste du site (image-upload admin aussi).
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.logo_url as string}
              alt={p.nom}
              className="h-12 w-auto max-w-[160px] object-contain opacity-60 grayscale transition-all duration-300 [a:hover_&]:opacity-100 [a:hover_&]:grayscale-0"
            />
          ) : (
            <span className="text-xl md:text-2xl font-display font-bold text-navy/60">
              {p.nom}
            </span>
          );

          if (p.url) {
            return (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center justify-center rounded-xl transition-colors",
                  hasLogo ? "px-2 py-2 hover:bg-navy-50" : "hover:text-navy",
                )}
                title={p.nom}
              >
                {content}
              </a>
            );
          }
          return (
            <span
              key={p.id}
              className={cn(
                "inline-flex items-center justify-center rounded-xl transition-colors",
                hasLogo ? "px-2 py-2" : "",
              )}
            >
              {content}
            </span>
          );
        })}
      </div>
    </Section>
  );
}
