import type { Metadata } from "next";
import { AuthCard, AuthLink } from "@/components/blocks/auth/auth-card";
import { SignupForm } from "@/components/blocks/auth/signup-form";

export const metadata: Metadata = {
  title: "Créer un compte — Espace étudiant",
  description: "Créez votre compte étudiant EFES « SAPIENTIA ».",
};

export default function CreerComptePage() {
  return (
    <AuthCard
      eyebrow="Espace étudiant"
      title="Créer un compte"
      subtitle="Rejoignez la plateforme EFES « SAPIENTIA »."
      footer={
        <>
          Déjà inscrit ? <AuthLink href="/connexion">Se connecter</AuthLink>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
