"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus, CheckCircle2 } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (err) {
      setError(err.message);
      setStatus("idle");
      return;
    }
    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="h-12 w-12 text-gold mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-navy">Compte créé !</h2>
        <p className="mt-2 text-slate text-sm">
          Un e-mail de confirmation vient de vous être envoyé. Cliquez sur le lien pour activer
          votre compte, puis connectez-vous.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" name="name" placeholder="Votre nom" required />
      </div>
      <div>
        <Label htmlFor="email">Adresse e-mail</Label>
        <Input id="email" name="email" type="email" placeholder="vous@exemple.com" required />
      </div>
      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" placeholder="Au moins 8 caractères" minLength={8} required />
        <p className="mt-1.5 text-xs text-muted">
          Choisissez un mot de passe robuste (au moins 8 caractères).
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
      )}

      <Button type="submit" size="lg" variant="primary" disabled={status === "loading"} className="w-full">
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Création...
          </>
        ) : (
          <>
            <UserPlus className="h-5 w-5" />
            Créer mon compte
          </>
        )}
      </Button>
    </form>
  );
}
