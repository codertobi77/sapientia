import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard, AuthLink } from "@/components/blocks/auth/auth-card";
import { ConnexionContent } from "@/components/blocks/auth/connexion-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Connexion — Espace étudiant",
  description: "Connectez-vous à votre espace étudiant EFES « SAPIENTIA ».",
};

export default function ConnexionPage() {
  return (
    <AuthCard
      eyebrow="Espace étudiant"
      title="Connexion"
      subtitle="Accédez à votre espace personnel."
      footer={
        <>
          Pas encore de compte ? <AuthLink href="/inscription/compte">Créer un compte</AuthLink>
          <br />
          Mot de passe oublié ? <AuthLink href="/recuperation">Récupérer</AuthLink>
        </>
      }
    >
      <Suspense fallback={<div className="h-64" />}>
        <ConnexionContent />
      </Suspense>
    </AuthCard>
  );
}
