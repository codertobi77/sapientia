import type { Metadata } from "next";
import { ShieldCheck, Clock, Mail } from "lucide-react";
import { PageHero } from "@/components/blocks/page-hero";
import { Section } from "@/components/blocks/section";
import { Card } from "@/components/ui/card";
import { InscriptionForm } from "@/components/blocks/inscription-form";
import { getFormations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Inscription en ligne — EFES « SAPIENTIA »",
  description:
    "Inscrivez-vous en ligne à l'EFES « SAPIENTIA » : choisissez votre formation, remplissez vos informations et téléversez vos pièces justificatives.",
};

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ formation?: string }>;
}) {
  const { formation } = await searchParams;
  const formations = await getFormations();

  return (
    <>
      <PageHero
        eyebrow="Candidature"
        title={
          <>
            Inscription en <span className="text-gold">ligne</span>
          </>
        }
        description="Quelques minutes suffisent pour constituer votre dossier. Un e-mail vous sera envoyé à chaque étape."
      />

      <Section>
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <Card className="p-8 lg:p-10">
              <h2 className="font-display text-2xl font-bold text-navy">Votre dossier d'inscription</h2>
              <p className="mt-2 text-slate">
                Suivez les 4 étapes. Vos informations sont enregistrées en toute confidentialité.
              </p>
              <div className="mt-8">
                <InscriptionForm formations={formations} preselectedFormation={formation} />
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="p-8 bg-navy border-navy text-white">
              <h3 className="font-display text-lg font-bold mb-5">À quoi s'attendre ?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-gold shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Dossier confidentiel</p>
                    <p className="text-white/70 text-sm">Vos données sont protégées (RGPD).</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-6 w-6 text-gold shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Confirmation par e-mail</p>
                    <p className="text-white/70 text-sm">Vous recevez un accusé de réception.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-gold shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Réponse sous 5 jours</p>
                    <p className="text-white/70 text-sm">Notre équipe examine votre dossier.</p>
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="p-8">
              <h3 className="font-display text-lg font-bold text-navy mb-4">Pièces à préparer</h3>
              <ul className="space-y-2 text-sm text-slate">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" />Pièce d'identité</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" />Diplôme ou attestation</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" />Photo d'identité</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" />Extrait de naissance (optionnel)</li>
              </ul>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
