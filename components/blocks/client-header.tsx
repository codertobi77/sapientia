"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, User, Mail, Phone, ChevronDown } from "lucide-react";
import { LogoView } from "@/components/blocks/logo";
import { SOCIAL_ICONS } from "@/components/blocks/social-icons";
import { cn } from "@/lib/utils";
import { telHref } from "@/lib/site-defaults";
import type {
  SiteIdentity,
  NavItem,
  SocialLink,
  LogoConfig,
} from "@/lib/site-defaults";

// Sous-éléments de formation, regroupés sous « Nos formations » en dropdown.
const SUB_HREFS = new Set(["/formation-distance", "/formation-presentiel"]);

/**
 * Reconstruit la liste de nav primaire (top-level) en groupant les deux
 * sous-liens de formation sous l'entrée « Nos formations » (détection par
 * href). Les sous-éléments sont retirés de la liste principale et exposés
 * dans `__children`. Ainsi la nav éditable depuis l'admin reste plane, mais
 * sa présentation hiérarchise correctement.
 */
type NavNode = NavItem & { __children?: NavItem[] };

function buildPrimaryNav(nav: NavItem[]): NavNode[] {
  const primary: NavNode[] = [];
  const children: NavItem[] = [];
  for (const it of nav) {
    if (SUB_HREFS.has(it.href)) children.push(it);
    else primary.push(it);
  }
  // Attache les enfants au parent « Nos formations » s'il existe.
  if (children.length) {
    const idx = primary.findIndex((p) => p.href === "/formations");
    if (idx >= 0) primary[idx] = { ...primary[idx], __children: children };
    // sinon on crée un parent synthétique
    else primary.push({ label: "Nos formations", href: "/formations", __children: children });
  }
  return primary;
}

/**
 * En-tête public interactif (client). Reçoit les données depuis le parent
 * serveur (header.tsx) pour éviter un appel client à lib/settings (cache serveur).
 */
export function ClientHeader({
  identity,
  nav,
  socialLinks,
  logo,
}: {
  identity: SiteIdentity;
  nav: NavItem[];
  socialLinks: SocialLink[];
  logo: LogoConfig;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isExternal = (href: string) => /^https?:\/\//.test(href);

  const primaryNav = buildPrimaryNav(nav);
  const isFormationActive = (children?: NavItem[]) =>
    !!children && children.some((c) => isActive(c.href));

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div
        className={cn(
          "bg-navy text-white/90 text-sm transition-all duration-300 overflow-hidden",
          scrolled ? "h-0 opacity-0" : "h-9 opacity-100"
        )}
      >
        <div className="container-site flex h-9 items-center justify-between gap-4">
          <p className="hidden sm:block truncate">
            {identity.name} — {identity.subtitle}
          </p>
          <div className="flex items-center gap-5 ml-auto">
            <a
              href={`mailto:${identity.email}`}
              className="hidden md:inline-flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              {identity.email}
            </a>
            <span className="hidden md:inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span className="flex flex-wrap items-center gap-x-1">
                {identity.phones.map((p, i) => (
                  <span key={p} className="inline-flex items-center gap-x-0.5">
                    {i > 0 && <span aria-hidden className="text-white/40">·</span>}
                    <a href={telHref(p)} className="hover:text-gold transition-colors">
                      {p}
                    </a>
                  </span>
                ))}
              </span>
            </span>
            <div className="flex items-center gap-2.5">
              {socialLinks.map(({ href, key, label }) => {
                const Icon = SOCIAL_ICONS[key];
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="hover:text-gold transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Nav principale */}
      <div
        className={cn(
          "bg-white border-b transition-shadow",
          scrolled && "shadow-premium",
        )}
      >
        <div className="container-site flex h-16 lg:h-[72px] items-center justify-between gap-4">
          <LogoView logo={logo} />

          <nav className="hidden lg:flex items-center gap-0.5">
            {primaryNav.map((item) => {
              // Dropdown « Nos formations »
              if (item.__children?.length) {
                const active = isActive(item.href) || isFormationActive(item.__children);
                return (
                  <div
                    key={item.href + item.label}
                    className="relative"
                    onMouseEnter={() => setDropOpen(true)}
                    onMouseLeave={() => setDropOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors",
                        active ? "text-gold" : "text-navy hover:text-gold",
                      )}
                      aria-haspopup="menu"
                      aria-expanded={dropOpen}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          dropOpen && "rotate-180",
                        )}
                        aria-hidden
                      />
                    </Link>
                    {dropOpen && (
                      <div
                        role="menu"
                        className="absolute left-0 top-full z-50 min-w-[14rem] pt-2"
                      >
                        <div className="rounded-2xl border border-border bg-white shadow-premium-lg p-1.5">
                          {item.__children.map((c) => (
                            <Link
                              key={c.href + c.label}
                              href={c.href}
                              className={cn(
                                "block rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                                isActive(c.href)
                                  ? "text-gold bg-gold-50"
                                  : "text-navy hover:bg-navy-50 hover:text-gold",
                              )}
                            >
                              {c.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              // Lien simple (top-level)
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  target={isExternal(item.href) ? "_blank" : undefined}
                  rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
                  className={cn(
                    "px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                    isActive(item.href)
                      ? "text-gold"
                      : "text-navy hover:text-gold",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/connexion"
              className="inline-flex shrink-0 items-center gap-2 h-10 px-4 rounded-full bg-gold text-navy font-semibold text-sm whitespace-nowrap hover:bg-gold-600 hover:-translate-y-0.5 shadow-premium transition-all duration-300"
            >
              <User className="h-4 w-4" />
              Se connecter
            </Link>
            <Link
              href="/inscription"
              className="inline-flex shrink-0 items-center h-10 px-4 rounded-full border border-gold text-gold font-semibold text-sm whitespace-nowrap hover:bg-gold hover:text-navy transition-all duration-200"
            >
              S'inscrire
            </Link>
          </div>

          {/* Burger */}
          <button
            className="lg:hidden inline-flex items-center justify-center h-12 w-12 rounded-full text-navy hover:bg-navy-50"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu mobile */}
        {open && (
          <div className="lg:hidden border-t border-border bg-white">
            <nav className="container-site py-4 flex flex-col gap-1">
              {primaryNav.map((item) => {
                if (item.__children?.length) {
                  return (
                    <div key={item.href + item.label} className="flex flex-col gap-1">
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                          isActive(item.href) || isFormationActive(item.__children)
                            ? "text-gold bg-gold-50"
                            : "text-navy hover:bg-navy-50",
                        )}
                      >
                        {item.label}
                      </Link>
                      <div className="ml-4 flex flex-col gap-1">
                        {item.__children.map((c) => (
                          <Link
                            key={c.href + c.label}
                            href={c.href}
                            className={cn(
                              "px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                              isActive(c.href)
                                ? "text-gold bg-gold-50"
                                : "text-navy hover:bg-navy-50",
                            )}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    target={isExternal(item.href) ? "_blank" : undefined}
                    rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
                    className={cn(
                      "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                      isActive(item.href)
                        ? "text-gold bg-gold-50"
                        : "text-navy hover:bg-navy-50",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-2 flex flex-col gap-2">
                <Link
                  href="/connexion"
                  className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-gold text-navy font-semibold"
                >
                  <User className="h-4 w-4" />
                  Se connecter
                </Link>
                <Link
                  href="/inscription"
                  className="inline-flex items-center justify-center h-12 rounded-full border border-gold text-gold font-semibold"
                >
                  S'inscrire
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
