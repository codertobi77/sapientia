import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/blocks/page-hero";
import { Section } from "@/components/blocks/section";
import { Card } from "@/components/ui/card";
import { SITE, SOCIAL_LINKS } from "@/lib/site";
import { SOCIAL_ICONS } from "@/components/blocks/social-icons";
import { ContactForm } from "@/components/blocks/contact-form";

export const metadata: Metadata = {
  title: "Contact — EFES « SAPIENTIA »",
  description:
    "Contactez l'EFES « SAPIENTIA » : adresse, téléphone, e-mail, WhatsApp et réseaux sociaux. Quartier Ouando, Porto-Novo, Bénin.",
};

export default function ContactPage() {
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const query = encodeURIComponent("Ouando, Porto-Novo, Bénin");
  const mapSrc = mapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${query}`
    : `https://maps.google.com/maps?q=${query}&output=embed`;

  const whatsappHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    "Bonjour, je souhaite des informations sur EFES « SAPIENTIA ».",
  )}`;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Parlons de votre <span className="text-gold">avenir</span>
          </>
        }
        description="Une question, un projet ? Notre équipe est à votre écoute et vous répond rapidement."
      />

      <Section>
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Formulaire */}
          <div className="lg:col-span-3">
            <Card className="p-8 lg:p-10">
              <h2 className="font-display text-2xl font-bold text-navy">Écrivez-nous</h2>
              <p className="mt-2 text-slate">
                Remplissez le formulaire, nous reviendrons vers vous par e-mail.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </Card>
          </div>

          {/* Coordonnées */}
          <aside className="lg:col-span-2 space-y-6">
            <Card className="p-8">
              <h3 className="font-display text-lg font-bold text-navy mb-5">Nos coordonnées</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-50 text-navy shrink-0">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy">Adresse</p>
                    <p className="text-slate">{SITE.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-50 text-navy shrink-0">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy">Téléphone</p>
                    <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="text-slate hover:text-gold transition-colors">
                      {SITE.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-50 text-navy shrink-0">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy">E-mail</p>
                    <a href={`mailto:${SITE.email}`} className="text-slate hover:text-gold transition-colors">
                      {SITE.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366] shrink-0">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy">WhatsApp</p>
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-slate hover:text-gold transition-colors">
                      Discuter en direct
                    </a>
                  </div>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm font-semibold text-navy mb-3">Réseaux sociaux</p>
                <div className="flex items-center gap-3">
                  {SOCIAL_LINKS.map(({ href, key, label }) => {
                    const Icon = SOCIAL_ICONS[key];
                    return (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="h-10 w-10 rounded-full bg-navy-50 hover:bg-navy hover:text-white text-navy flex items-center justify-center transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Carte */}
            <div className="rounded-3xl overflow-hidden border border-border shadow-premium">
              <iframe
                title="Localisation EFES « SAPIENTIA »"
                src={mapSrc}
                className="w-full h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
