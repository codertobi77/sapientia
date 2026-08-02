import type { Metadata } from "next";
import Link from "next/link";
import {
  Video,
  Users,
  PenTool,
  FileCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  MonitorPlay,
  Wifi,
} from "lucide-react";
import { PageHero } from "@/components/blocks/page-hero";
import { Section, SectionHeading } from "@/components/blocks/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Formation à distance (E-learning) — EFES-SAPIENTIA",
  description:
    "Une expérience d'apprentissage complète en ligne : cours vidéo, visioconférences, exercices interactifs, examens en ligne et certifications reconnues.",
};

const experience = [
  { titre: "Cours vidéo", texte: "Des modules vidéo structurés, accessibles à tout moment.", icon: Video },
  { titre: "Visioconférences", texte: "Des sessions en direct avec vos enseignants.", icon: Users },
  { titre: "Exercices interactifs", texte: "Quiz, TP et auto-évaluation pour progresser.", icon: PenTool },
  { titre: "Examens en ligne", texte: "Des évaluations encadrées et certifiantes.", icon: FileCheck },
  { titre: "Certifications", texte: "Un diplôme reconnu à l'issue de votre parcours.", icon: Award },
];

const avantages = [
  "Apprenez où et quand vous voulez",
  "Accompagnement par les enseignants",
  "Rythme personnalisé et souplesse",
  "Plateforme accessible sur mobile et ordinateur",
];

export default function FormationDistancePage() {
  return (
    <>
      <PageHero
        eyebrow="E-learning"
        title={
          <>
            La formation à <span className="text-gold">distance</span>
          </>
        }
        description="Une expérience d'apprentissage complète et flexible, accessible où que vous soyez."
        imageSrc="/elearning-student.png"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="gold">
            <MonitorPlay className="h-3.5 w-3.5" />
            Plateforme en ligne
          </Badge>
          <Badge variant="navyLight">
            <Wifi className="h-3.5 w-3.5" />
            Accessible 24/7
          </Badge>
        </div>
      </PageHero>

      {/* Hero avec carte dashboard */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
              Une expérience complète
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy leading-tight">
              Tout le campus, dans votre poche.
            </h2>
            <p className="mt-5 text-slate text-lg leading-relaxed">
              Notre plateforme e-learning réunit cours, visios, exercices et examens en un seul
              espace, pour une formation sérieuse et flexible.
            </p>
            <Link
              href="/inscription?type=DISTANCE"
              className="mt-8 inline-flex items-center gap-2 h-13 px-8 rounded-full bg-gold text-navy font-semibold hover:bg-gold-600 hover:-translate-y-0.5 shadow-premium transition-all duration-300"
            >
              S'inscrire en E-learning
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          {/* Carte dashboard */}
          <Card className="p-0 overflow-hidden">
            <div className="bg-navy p-5 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 text-white/70 text-sm font-medium">plateforme.sapientia.bj</span>
            </div>
            <div className="p-6 lg:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-bold text-navy">Tableau de bord</p>
                <Badge variant="goldLight">En cours</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-navy-50 p-4">
                  <MonitorPlay className="h-6 w-6 text-navy mb-2" />
                  <p className="text-sm font-semibold text-navy">8 modules</p>
                  <p className="text-xs text-slate">commencés</p>
                </div>
                <div className="rounded-2xl bg-gold-50 p-4">
                  <Award className="h-6 w-6 text-gold-600 mb-2" />
                  <p className="text-sm font-semibold text-navy">75% progression</p>
                  <p className="text-xs text-slate">ce mois</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { t: "Cours vidéo · Pédagogie active", v: "100%" },
                  { t: "Exercices · Mathématiques", v: "60%" },
                  { t: "Visio · Méthodologie", v: "à venir" },
                ].map((r) => (
                  <div key={r.t} className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5">
                    <span className="text-sm text-navy">{r.t}</span>
                    <span className="text-xs font-semibold text-gold-600">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* 5 cards 'expérience complète' */}
      <Section className="bg-cream">
        <SectionHeading
          eyebrow="L'expérience complète"
          title="Tout ce qu'il faut pour réussir"
          description="Une plateforme pensée pour un apprentissage actif et encadré."
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experience.map(({ titre, texte, icon: Icon }) => (
            <Card key={titre} className="p-8 hover:-translate-y-1 transition-all duration-300 hover:shadow-premium-lg">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-gold mb-5">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="font-display text-xl font-bold text-navy">{titre}</h3>
              <p className="mt-3 text-slate leading-relaxed">{texte}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Bandeau avantages navy */}
      <section className="bg-navy text-white py-12 lg:py-16">
        <div className="container-site grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
              Pourquoi l'E-learning ?
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-tight">
              La liberté d'apprendre, sans compromis sur la qualité.
            </h2>
            <ul className="mt-8 space-y-4">
              {avantages.map((a) => (
                <li key={a} className="flex items-start gap-3 text-white/90">
                  <CheckCircle2 className="h-6 w-6 text-gold shrink-0" />
                  <span className="text-lg leading-snug">{a}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/inscription?type=DISTANCE"
              className="mt-8 inline-flex items-center gap-2 h-13 px-8 rounded-full bg-gold text-navy font-semibold hover:bg-gold-600 hover:-translate-y-0.5 shadow-premium transition-all duration-300"
            >
              Commencer mon inscription
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="rounded-3xl bg-white/5 border border-white/10 p-10 text-center">
            <MonitorPlay className="h-14 w-14 text-gold mx-auto mb-4" />
            <p className="font-display text-2xl font-bold">Platforme accessible 24h/24</p>
            <p className="mt-3 text-white/70">
              Connectez-vous depuis votre ordinateur, votre tablette ou votre téléphone.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
