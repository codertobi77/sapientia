import type { Metadata } from "next";
import { AuthCard, AuthLink } from "@/components/blocks/auth/auth-card";
import { ResetForm } from "@/components/blocks/auth/reset-form";

export const metadata: Metadata = {
  title: "Récupération de mot de passe",
  description: "Réinitialisez le mot de passe de votre compte étudiant EFES « SAPIENTIA ».",
};

export default function RecuperationPage() {
  return (
    <AuthCard
      eyebrow="Espace étudiant"
      title="Mot de passe oublié"
      subtitle="Saisissez votre e-mail pour recevoir un lien de réinitialisation."
      footer={
        <>
          <AuthLink href="/connexion">Retour à la connexion</AuthLink>
        </>
      }
    >
      <ResetForm />
    </AuthCard>
  );
}
