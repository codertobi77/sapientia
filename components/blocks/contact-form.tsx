"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const formData = new FormData(e.currentTarget);
    const payload = {
      nom: String(formData.get("nom") ?? ""),
      email: String(formData.get("email") ?? ""),
      sujet: String(formData.get("sujet") ?? ""),
      message: String(formData.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setStatus("success");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setError("Connexion impossible. Réessayez plus tard.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-navy-50 border border-border p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold mx-auto mb-4" />
        <h3 className="font-display text-xl font-bold text-navy">Message envoyé !</h3>
        <p className="mt-2 text-slate">
          Nous vous répondrons dans les meilleurs délais. Merci de votre confiance.
        </p>
        <Button
          variant="outline"
          size="md"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="nom">Nom complet</Label>
          <Input id="nom" name="nom" placeholder="Votre nom" required />
        </div>
        <div>
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input id="email" name="email" type="email" placeholder="vous@exemple.com" required />
        </div>
      </div>
      <div>
        <Label htmlFor="sujet">Sujet</Label>
        <Input id="sujet" name="sujet" placeholder="Objet de votre message" required />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" placeholder="Votre message..." required />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
      )}

      <Button type="submit" size="lg" variant="primary" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Envoyer le message
          </>
        )}
      </Button>
    </form>
  );
}
