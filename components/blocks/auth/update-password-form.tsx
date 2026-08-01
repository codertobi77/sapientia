"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

/**
 * Formulaire « nouveau mot de passe » affiché quand l'utilisateur revient
 * depuis l'e-mail de réinitialisation Supabase
 * (URL : /connexion?type=recovery&code=...).
 *
 * 1. Échange le code de récupération contre une session
 *    (supabase.auth.exchangeCodeForSession).
 * 2. Met à jour le mot de passe via supabase.auth.updateUser({ password }).
 */
export function UpdatePasswordForm({ code }: { code: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    const confirm = String(fd.get("confirm") ?? "");
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setStatus("idle");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      setStatus("idle");
      return;
    }
    const supabase = createClient();
    // Échange le code de récupération contre une session temporaire.
    const { error: exErr } = await supabase.auth.exchangeCodeForSession(
      `${window.location.origin}/connexion?type=recovery&code=${encodeURIComponent(code)}`,
    );
    if (exErr) {
      setError(
        exErr.message ||
          "Le lien de réinitialisation est invalide ou expiré. Recommencez la procédure.",
      );
      setStatus("idle");
      return;
    }
    // Définit le nouveau mot de passe sur l'utilisateur désormais connecté.
    const { error: upErr } = await supabase.auth.updateUser({ password });
    if (upErr) {
      setError(upErr.message || "Impossible de mettre à jour le mot de passe.");
      setStatus("idle");
      return;
    }
    setDone(true);
    // Petite pause puis redirection vers /admin (l'utilisateur a maintenant une session).
    setTimeout(() => {
      router.replace("/admin");
    }, 1800);
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="h-12 w-12 text-gold mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-navy">Mot de passe mis à jour</h2>
        <p className="mt-2 text-slate text-sm">
          Votre nouveau mot de passe est actif. Vous allez être redirigé vers votre espace.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Label htmlFor="password" className="text-white">Nouveau mot de passe</Label>
        <Input id="password" name="password" type="password" placeholder="Au moins 8 caractères" minLength={8} required />
      </div>
      <div>
        <Label htmlFor="confirm" className="text-white">Confirmez le mot de passe</Label>
        <Input id="confirm" name="confirm" type="password" placeholder="Retapez le mot de passe" required />
      </div>
      {error && (
        <p className="text-sm text-red-300 bg-red-500/10 rounded-xl px-4 py-3">{error}</p>
      )}
      <Button type="submit" size="lg" variant="primary" disabled={status === "loading"} className="w-full">
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Mise à jour...
          </>
        ) : (
          <>
            <KeyRound className="h-5 w-5" />
            Définir mon nouveau mot de passe
          </>
        )}
      </Button>
    </form>
  );
}
