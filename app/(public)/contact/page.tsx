import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/blocks/page-hero";
import { Section } from "@/components/blocks/section";
import { Card } from "@/components/ui/card";
import { getIdentity, getSocials } from "@/lib/settings";
import { telHref } from "@/lib/site-defaults";
import { SOCIAL_ICONS } from "@/components/blocks/social-icons";
import { ContactForm } from "@/components/blocks/contact-form";

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getIdentity();
  const telWord = identity.phones.length > 1 ? "téléphones" : "téléphone";
  const adrWord = identity.addresses.length > 1 ? "adresses" : "adresse";
  const addressesInline = identity.addresses.join(", ");
  return {
    title: `Contact — ${identity.name}`,
    description: `Contactez ${identity.name} : ${adrWord}, ${telWord}, e-mail, WhatsApp et réseaux sociaux. ${addressesInline}.`,
  };
}

export default async function ContactPage() {
  const identity = await getIdentity();
  const { links: socialLinks } = await getSocials();
  const whatsappHref = `https://wa.me/${identity.whatsapp}?text=${encodeURIComponent(
    "Bonjour, je souhaite des informations sur EFES-SAPIENTIA.",
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
                    <p className="text-sm font-semibold text-navy">Adresse{identity.addresses.length > 1 ? "s" : ""}</p>
                    <div className="text-slate flex flex-col gap-0.5">
                      {identity.addresses.map((a) => (
                        <p key={a}>{a}</p>
                      ))}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-50 text-navy shrink-0">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy">Téléphone{identity.phones.length > 1 ? "s" : ""}</p>
                    <p className="text-slate flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                      {identity.phones.map((p, i) => (
                        <span key={p} className="inline-flex items-center gap-x-0.5">
                          {i > 0 && <span aria-hidden className="text-slate/40">·</span>}
                          <a href={telHref(p)} className="hover:text-gold transition-colors">
                            {p}
                          </a>
                        </span>
                      ))}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-50 text-navy shrink-0">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy">E-mail</p>
                    <a href={`mailto:${identity.email}`} className="text-slate hover:text-gold transition-colors">
                      {identity.email}
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
                  {socialLinks.map(({ href, key, label }) => {
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

            {/* Cartes */}
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden border border-border shadow-premium">
                <p className="text-xs font-semibold text-navy/60 uppercase tracking-widest px-4 pt-3 pb-1">
                  📍 Porto-Novo
                </p>
                <iframe
                  title="Campus EFES-SAPIENTIA Porto-Novo"
                  src="https://maps.google.com/maps?q=6.496873,2.6288543&z=17&output=embed"
                  className="w-full h-56"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="rounded-3xl overflow-hidden border border-border shadow-premium">
                <p className="text-xs font-semibold text-navy/60 uppercase tracking-widest px-4 pt-3 pb-1">
                  📍 Parakou
                </p>
                <iframe
                  title="Campus EFES-SAPIENTIA Parakou"
                  src="https://maps.google.com/maps?q=9.3433049,2.6101414&z=17&output=embed"
                  className="w-full h-56"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
