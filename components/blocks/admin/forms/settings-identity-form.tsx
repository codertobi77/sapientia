"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
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
    // Nettoie les lignes vides avant envoi (le validateur exige >= 1 par tableau).
    const payload: SiteIdentity = {
      ...form,
      phones: form.phones.map((p) => p.trim()).filter(Boolean),
      addresses: form.addresses.map((a) => a.trim()).filter(Boolean),
    };
    if (payload.phones.length === 0) {
      setError("Au moins un numéro de téléphone est requis.");
      setLoading(false);
      return;
    }
    if (payload.addresses.length === 0) {
      setError("Au moins une adresse est requise.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "identity", value: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'enregistrement");
      setForm(payload);
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
        <div className="sm:col-span-1">
          <Label htmlFor="phone-0">Téléphones</Label>
          <div className="space-y-2">
            {form.phones.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  id={`phone-${i}`}
                  value={p}
                  onChange={(e) => {
                    const next = form.phones.slice();
                    next[i] = e.target.value;
                    set("phones", next);
                  }}
                  placeholder="+229 ..."
                  required={i === 0}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Supprimer ce numéro"
                  disabled={form.phones.length <= 1}
                  onClick={() => set("phones", form.phones.filter((_, j) => j !== i))}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => set("phones", [...form.phones, ""])}
              className="mt-1"
            >
              <Plus className="h-4 w-4" />
              Ajouter un numéro
            </Button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-1">
          <Label htmlFor="address-0">Adresses</Label>
          <div className="space-y-2">
            {form.addresses.map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  id={`address-${i}`}
                  value={a}
                  onChange={(e) => {
                    const next = form.addresses.slice();
                    next[i] = e.target.value;
                    set("addresses", next);
                  }}
                  placeholder="Porto-Novo, Bénin"
                  required={i === 0}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Supprimer cette adresse"
                  disabled={form.addresses.length <= 1}
                  onClick={() => set("addresses", form.addresses.filter((_, j) => j !== i))}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => set("addresses", [...form.addresses, ""])}
              className="mt-1"
            >
              <Plus className="h-4 w-4" />
              Ajouter une adresse
            </Button>
          </div>
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
