"use client";

import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/blocks/auth/login-form";
import { UpdatePasswordForm } from "@/components/blocks/auth/update-password-form";

/**
 * Bascule le contenu de la page /connexion selon les paramètres d'URL :
 *  - par défaut : formulaire de connexion (LoginForm).
 *  - ?type=recovery&code=... : formulaire de définition d'un nouveau mot
 *    de passe (UpdatePasswordForm), déclenché par le lien reçu dans l'e-mail
 *    de réinitialisation Supabase.
 *
 * Composant client pour pouvoir lire useSearchParams. Il rend lui-même les
 * composants enfants (client) afin de passer le `code` lu — pas de fonction
 * transmise depuis le serveur (interdit: "Functions cannot be passed
 * directly to Client Components").
 */
export function ConnexionContent() {
  const params = useSearchParams();
  const type = params.get("type");
  const code = params.get("code");

  if (type === "recovery" && code) {
    return <UpdatePasswordForm code={code} />;
  }
  return <LoginForm />;
}
