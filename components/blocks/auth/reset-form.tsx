"use client";

import { useState } from "react";
import { Loader2, MailCheck, KeyRound } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function ResetForm() {
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/connexion`,
    });
    if (err) {
      setError(err.message);
      setStatus("idle");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <MailCheck className="h-12 w-12 text-gold mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-navy">E-mail envoyé</h2>
        <p className="mt-2 text-slate text-sm">
          Un lien de réinitialisation vient de vous être envoyé. Vérifiez votre boîte de
          réception (et vos spams).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Label htmlFor="email">Adresse e-mail</Label>
        <Input id="email" name="email" type="email" placeholder="vous@exemple.com" required />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
      )}

      <Button type="submit" size="lg" variant="primary" disabled={status === "loading"} className="w-full">
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Envoi...
          </>
        ) : (
          <>
            <KeyRound className="h-5 w-5" />
            Réinitialiser mon mot de passe
          </>
        )}
      </Button>
    </form>
  );
}
