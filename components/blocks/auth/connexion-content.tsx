"use client";

import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Bascule le contenu de la page /connexion selon les paramètres d'URL :
 *  - par défaut : formulaire de connexion (login prop).
 *  - ?type=recovery&code=... : formulaire de définition d'un nouveau mot de
 *    passe (updatePassword prop), déclenché par le lien reçu dans l'e-mail
 *    de réinitialisation Supabase.
 *
 * Composant client pour pouvoir lire useSearchParams.
 */
export function ConnexionContent({
  login,
  updatePassword,
}: {
  login: ReactNode;
  updatePassword: (code: string) => ReactNode;
}) {
  const params = useSearchParams();
  const type = params.get("type");
  const code = params.get("code");

  if (type === "recovery" && code) {
    return <>{updatePassword(code)}</>;
  }
  return <>{login}</>;
}
