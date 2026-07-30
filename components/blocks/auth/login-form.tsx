"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";

  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
    });
    if (err) {
      setError(err.message);
      setStatus("idle");
      return;
    }
    router.refresh();
    router.replace(next);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Label htmlFor="email" className="text-white">Adresse e-mail</Label>
        <Input id="email" name="email" type="email" placeholder="vous@exemple.com" required />
      </div>
      <div>
        <Label htmlFor="password" className="text-white">Mot de passe</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required />
      </div>

      {error && (
        <p className="text-sm text-red-300 bg-red-500/10 rounded-xl px-4 py-3">{error}</p>
      )}

      <Button type="submit" size="lg" variant="primary" disabled={status === "loading"} className="w-full">
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Connexion...
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" />
            Se connecter
          </>
        )}
      </Button>
    </form>
  );
}
