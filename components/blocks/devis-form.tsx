"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Formation } from "@/lib/data";

export function DevisForm({
  formations,
  preselectedFormation,
}: {
  formations: Formation[];
  preselectedFormation?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      formation_id: String(fd.get("formation_id") ?? "") || null,
      type_formation: String(fd.get("type_formation") ?? "") as "PRESENTIEL" | "DISTANCE",
      niveau: String(fd.get("niveau") ?? ""),
      duree: String(fd.get("duree") ?? ""),
      nom: String(fd.get("nom") ?? ""),
      email: String(fd.get("email") ?? ""),
      telephone: String(fd.get("telephone") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/devis", {
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
        <h3 className="font-display text-xl font-bold text-navy">Demande envoyée !</h3>
        <p className="mt-2 text-slate">
          Notre équipe prépare votre devis personnalisé et revient vers vous par e-mail.
        </p>
        <Button variant="outline" size="md" className="mt-6" onClick={() => setStatus("idle")}>
          Nouvelle demande
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="formation_id">Formation souhaitée</Label>
          <Select id="formation_id" name="formation_id" defaultValue={preselectedFormation ?? ""}>
            <option value="">— Non précisée —</option>
            {formations.map((f) => (
              <option key={f.id} value={f.id}>
                {f.titre}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="type_formation">Type de formation</Label>
          <Select id="type_formation" name="type_formation" defaultValue="PRESENTIEL" required>
            <option value="PRESENTIEL">Présentiel</option>
            <option value="DISTANCE">E-learning (à distance)</option>
          </Select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="niveau">Niveau visé</Label>
          <Input id="niveau" name="niveau" placeholder="Ex : Licence, Master, CAP" required />
        </div>
        <div>
          <Label htmlFor="duree">Durée souhaitée</Label>
          <Input id="duree" name="duree" placeholder="Ex : 3 ans, 6 mois" required />
        </div>
      </div>

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
        <Label htmlFor="telephone">Téléphone (optionnel)</Label>
        <Input id="telephone" name="telephone" placeholder="+229 ..." />
      </div>

      <div>
        <Label htmlFor="message">Précisions (optionnel)</Label>
        <Textarea id="message" name="message" placeholder="Détaillez votre projet de formation..." />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
      )}

      <Button type="submit" size="lg" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Demander mon devis
          </>
        )}
      </Button>
    </form>
  );
}
