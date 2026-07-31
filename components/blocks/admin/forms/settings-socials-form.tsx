"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SiteSocials, SocialKey } from "@/lib/site-defaults";
import { SOCIAL_LABELS } from "@/lib/site-defaults";

const KEYS: SocialKey[] = ["facebook", "instagram", "linkedin", "youtube"];

export function SettingsSocialsForm({ initial }: { initial: SiteSocials }) {
  const router = useRouter();
  const [form, setForm] = React.useState<SiteSocials>(initial);
  const [loading, setLoading] = React.useState(false);
  const [ok, setOk] = React.useState("");
  const [error, setError] = React.useState("");

  const set = (k: SocialKey, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOk("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "socials", value: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'enregistrement");
      setOk("Réseaux sociaux enregistrés.");
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
        <h2 className="text-lg font-semibold text-navy">Réseaux sociaux</h2>
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </Button>
      </div>

      <p className="text-sm text-muted">
        Laissez un champ vide pour masquer le réseau correspondant sur le site public.
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        {KEYS.map((key) => (
          <div key={key}>
            <Label htmlFor={`social-${key}`}>{SOCIAL_LABELS[key]}</Label>
            <Input
              id={`social-${key}`}
              type="url"
              value={form[key] ?? ""}
              onChange={(e) => set(key, e.target.value)}
              placeholder={`https://${key}.com/...`}
            />
          </div>
        ))}
      </div>

      {ok && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3">{ok}</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
    </form>
  );
}
