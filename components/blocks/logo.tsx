import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getLogo } from "@/lib/settings";
import type { LogoConfig } from "@/lib/site-defaults";

/**
 * Marque du logo (rendu pur, props-driven) — utilisable côté client ET serveur.
 * Affiche l'image si `logo.imageUrl` est renseigné, sinon un disque navy avec l'initiale.
 */
export function LogoMark({
  className,
  logo,
}: {
  className?: string;
  logo: LogoConfig;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden ring-2 ring-gold/30 bg-navy text-white font-display font-bold",
        className,
      )}
      aria-hidden
    >
      {logo.imageUrl ? (
        <Image
          src={logo.imageUrl}
          alt={logo.alt}
          fill
          className="object-cover"
          sizes="56px"
        />
      ) : (
        <span>{(logo.text || "S").slice(0, 1).toUpperCase()}</span>
      )}
    </span>
  );
}

/**
 * Logo complet (marque + texte + sous-titre), rendu pur props-driven.
 * À utiliser par des composants client (ex : ClientHeader) qui reçoivent la
 * config logo depuis un parent serveur via lib/settings.
 */
export function LogoView({
  compact = false,
  onDark = false,
  logo,
}: {
  compact?: boolean;
  onDark?: boolean;
  logo: LogoConfig;
}) {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <LogoMark className="h-14 w-14" logo={logo} />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-display text-lg font-bold transition-colors",
            onDark
              ? "text-white group-hover:text-gold"
              : "text-navy group-hover:text-navy-700",
          )}
        >
          {logo.text}
        </span>
        {!compact && (
          <span className={cn("text-xs", onDark ? "text-white/70" : "text-muted")}>
            {logo.subtitle}
          </span>
        )}
      </span>
    </Link>
  );
}

/**
 * Logo serveur asynchrone (lit la config depuis la base/cache).
 * À utiliser dans des Server Components uniquement (ex : layout auth).
 * Les composants client doivent préférer <LogoView logo={...} /> nourri par
 * un parent serveur via lib/settings.
 */
export async function Logo({
  compact = false,
  onDark = false,
}: {
  compact?: boolean;
  onDark?: boolean;
}) {
  const logo = await getLogo();
  return <LogoView compact={compact} onDark={onDark} logo={logo} />;
}
