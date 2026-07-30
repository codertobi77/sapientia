"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, User, Mail, Phone } from "lucide-react";
import { NAV, SITE, SOCIAL_LINKS } from "@/lib/site";
import { Logo } from "@/components/blocks/logo";
import { SOCIAL_ICONS } from "@/components/blocks/social-icons";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-navy text-white/90 text-sm">
        <div className="container-site flex h-9 items-center justify-between gap-4">
          <p className="hidden sm:block truncate">
            Bienvenue à l'EFES « SAPIENTIA » — Université privée de formation des enseignants
          </p>
          <div className="flex items-center gap-5 ml-auto">
            <a
              href={`mailto:${SITE.email}`}
              className="hidden md:inline-flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="hidden md:inline-flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              {SITE.phone}
            </a>
            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map(({ href, key, label }) => {
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
        <div className="container-site flex h-20 lg:h-[88px] items-center justify-between gap-4">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-2 rounded-full text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-gold"
                    : "text-navy hover:text-gold",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/connexion"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-gold text-navy font-semibold text-sm hover:bg-gold-600 hover:-translate-y-0.5 shadow-premium transition-all duration-300"
            >
              <User className="h-4 w-4" />
              Espace étudiant
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
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    isActive(item.href)
                      ? "text-gold bg-gold-50"
                      : "text-navy hover:bg-navy-50",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/connexion"
                className="mt-2 inline-flex items-center justify-center gap-2 h-12 rounded-full bg-gold text-navy font-semibold"
              >
                <User className="h-4 w-4" />
                Espace étudiant
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
