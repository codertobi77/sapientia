"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SiteIdentity } from "@/lib/site-defaults";

export function SettingsIdentityForm({ initial }: { initial: SiteIdentity }) {
  const router = useRouter();
  const [form, setForm] = React.useState<SiteIdentity>(initial);
  const [loading, setLoading] = React.useState(false);
  const [ok, setOk] = React.useState("");
  const [error, setError] = React.useState("");

  const set = <K extends keyof SiteIdentity>(k: K, v: SiteIdentity[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOk("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "identity", value: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'enregistrement");
      setOk("Enregistré. Le site public est mis à jour.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'enregistrement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy">Identité & coordonnées</h2>
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="name">Nom officiel</Label>
          <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="shortName">Nom court</Label>
          <Input id="shortName" value={form.shortName} onChange={(e) => set("shortName", e.target.value)} required />
        </div>
      </div>

      <div>
        <Label htmlFor="subtitle">Slogan / sous-titre</Label>
        <Input id="subtitle" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="address">Adresse</Label>
          <Input id="address" value={form.address} onChange={(e) => set("address", e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp (numéro, sans +)</Label>
          <Input id="whatsapp" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="229016000376" required />
        </div>
      </div>

      {ok && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3">{ok}</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
    </form>
  );
}
