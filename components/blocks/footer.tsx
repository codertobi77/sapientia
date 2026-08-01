import Link from "next/link";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { getSocials, getIdentity } from "@/lib/settings";
import { telHref } from "@/lib/site-defaults";
import { NewsletterForm } from "@/components/blocks/newsletter-form";
import { SOCIAL_ICONS } from "@/components/blocks/social-icons";

const liensRapides = [
  { label: "Accueil", href: "/" },
  { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
  { label: "Nos formations", href: "/formations" },
  { label: "E-learning", href: "/formation-distance" },
  { label: "Actualités", href: "/actualites" },
];

const informations = [
  { label: "Formation en présentiel", href: "/formation-presentiel" },
  { label: "Inscription en ligne", href: "/inscription" },
  { label: "Demande de devis", href: "/devis" },
  { label: "Contact", href: "/contact" },
];

export async function Footer() {
  const identity = await getIdentity();
  const { links: socialLinks } = await getSocials();
  return (
    <footer className="bg-navy text-white">
      <div className="container-site py-16 lg:py-20 grid gap-12 lg:grid-cols-4">
        {/* Liens rapides */}
        <div>
          <h3 className="font-display text-lg font-bold mb-5">Liens rapides</h3>
          <ul className="space-y-3">
            {liensRapides.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/80 hover:text-gold transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Informations */}
        <div>
          <h3 className="font-display text-lg font-bold mb-5">Informations</h3>
          <ul className="space-y-3">
            {informations.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/80 hover:text-gold transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacts */}
        <div>
          <h3 className="font-display text-lg font-bold mb-5">Contacts</h3>
          <ul className="space-y-4 text-white/80">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <span className="flex flex-col gap-0.5">
                {identity.addresses.map((a) => (
                  <span key={a}>{a}</span>
                ))}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <span className="flex flex-wrap items-center gap-x-1 gap-y-1">
                {identity.phones.map((p, i) => (
                  <span key={p} className="inline-flex items-center gap-x-1">
                    {i > 0 && <span aria-hidden className="text-white/40">·</span>}
                    <a href={telHref(p)} className="hover:text-gold transition-colors">
                      {p}
                    </a>
                  </span>
                ))}
              </span>
            </li>
            <li>
              <a href={`mailto:${identity.email}`} className="flex items-start gap-3 hover:text-gold transition-colors">
                <Mail className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span>{identity.email}</span>
              </a>
            </li>
          </ul>
          <div className="flex items-center gap-4 mt-6">
            {socialLinks.map(({ href, key, label }) => {
              const Icon = SOCIAL_ICONS[key];
              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-gold hover:text-navy flex items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-display text-lg font-bold mb-5">Newsletter</h3>
          <p className="text-white/80 mb-4 text-sm leading-relaxed">
            Recevez nos actualités et nos offres de formation directement dans votre boîte mail.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Barre inférieure */}
      <div className="border-t border-white/10">
        <div className="container-site py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/60">
          <p>© {new Date().getFullYear()} EFES « SAPIENTIA ». Tous droits réservés.</p>
          <p className="flex items-center gap-2">
            <Send className="h-3.5 w-3.5 text-gold" />
            Mention légales · Politique de confidentialité
          </p>
        </div>
      </div>
    </footer>
  );
}
