"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/blocks/admin/image-upload";
import type { LogoConfig } from "@/lib/site-defaults";

export function SettingsLogoForm({ initial }: { initial: LogoConfig }) {
  const router = useRouter();
  const [form, setForm] = React.useState<LogoConfig>(initial);
  const [loading, setLoading] = React.useState(false);
  const [ok, setOk] = React.useState("");
  const [error, setError] = React.useState("");

  const set = <K extends keyof LogoConfig>(k: K, v: LogoConfig[K]) =>
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
        body: JSON.stringify({ section: "logo", value: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'enregistrement");
      setOk("Logo enregistré.");
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
        <h2 className="text-lg font-semibold text-navy">Logo global</h2>
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </Button>
      </div>

      <div>
        <Label>Image du logo</Label>
        <ImageUpload
          value={form.imageUrl}
          onChange={(url) => set("imageUrl", url)}
          path="logos"
          label="Logo"
        />
        <p className="mt-1 text-xs text-muted">
          Si l'image est vide, le texte ci-dessous seul est affiché en guise d'en-tête.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="logo-text">Texte principal</Label>
          <Input id="logo-text" value={form.text} onChange={(e) => set("text", e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="logo-alt">Texte alternatif (accessibilité)</Label>
          <Input id="logo-alt" value={form.alt} onChange={(e) => set("alt", e.target.value)} required />
        </div>
      </div>

      <div>
        <Label htmlFor="logo-subtitle">Sous-titre</Label>
        <Input id="logo-subtitle" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
      </div>

      {ok && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3">{ok}</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
    </form>
  );
}
