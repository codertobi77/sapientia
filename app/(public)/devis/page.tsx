import type { Metadata } from "next";
import { Clock, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/blocks/page-hero";
import { Section } from "@/components/blocks/section";
import { Card } from "@/components/ui/card";
import { DevisForm } from "@/components/blocks/devis-form";
import { getFormations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Demande de devis — EFES-SAPIENTIA",
  description:
    "Demandez un devis personnalisé pour une formation en présentiel ou à distance à l'EFES-SAPIENTIA.",
};

export default async function DevisPage({
  searchParams,
}: {
  searchParams: Promise<{ formation?: string; type?: string }>;
}) {
  const { formation } = await searchParams;
  const formations = await getFormations();

  const etapes = [
    { titre: "Vous remplissez le formulaire", texte: "Quelques minutes suffisent pour décrire votre besoin." },
    { titre: "Nous étudions votre demande", texte: "Notre équipe prépare une proposition adaptée." },
    { titre: "Vous recevez votre devis", texte: "Un devis personnalisé vous est envoyé par e-mail." },
  ];

  return (
    <>
      <PageHero
        eyebrow="Tarification"
        title={
          <>
            Demandez un <span className="text-gold">devis</span> personnalisé
          </>
        }
        description="Indiquez vos besoins, nous vous proposons une offre sur mesure pour la formation choisie."
      />

      <Section>
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <Card className="p-8 lg:p-10">
              <h2 className="font-display text-2xl font-bold text-navy">Votre demande de devis</h2>
              <p className="mt-2 text-slate">
                Les champs marqués d'un astérisque sont obligatoires.
              </p>
              <div className="mt-8">
                <DevisForm formations={formations} preselectedFormation={formation} />
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="p-8 bg-navy border-navy text-white">
              <h3 className="font-display text-lg font-bold mb-5">Comment ça marche ?</h3>
              <ol className="space-y-5">
                {etapes.map((e, i) => (
                  <li key={e.titre} className="flex items-start gap-3">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-navy font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{e.titre}</p>
                      <p className="text-white/70 text-sm mt-0.5">{e.texte}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-gold shrink-0" />
                  <div>
                    <p className="font-semibold text-navy text-sm">Réponse rapide</p>
                    <p className="text-slate text-sm">Sous 48h ouvrées.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-gold shrink-0" />
                  <div>
                    <p className="font-semibold text-navy text-sm">Sans engagement</p>
                    <p className="text-slate text-sm">Votre demande ne vous engage à rien.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-6 w-6 text-gold shrink-0" />
                  <div>
                    <p className="font-semibold text-navy text-sm">Devis détaillé</p>
                    <p className="text-slate text-sm">Coûts, modalités et calendrier inclus.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-gold shrink-0" />
                  <div>
                    <p className="font-semibold text-navy text-sm">Conseil gratuit</p>
                    <p className="text-slate text-sm">Un conseiller vous guide selon votre projet.</p>
                  </div>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
