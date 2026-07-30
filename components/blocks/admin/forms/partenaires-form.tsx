"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/blocks/admin/switch";
import { ImageUpload } from "@/components/blocks/admin/image-upload";
import type { AdminPartenaire, PartenaireInput } from "@/lib/data-admin";

export function PartenairesForm({ initial }: { initial?: AdminPartenaire }) {
  const router = useRouter();
  const [form, setForm] = React.useState<PartenaireInput>({
    nom: initial?.nom ?? "",
    logo_url: initial?.logo_url ?? "",
    url: initial?.url ?? "",
    ordre: initial?.ordre ?? 0,
    published: initial?.published ?? true,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const set = <K extends keyof PartenaireInput>(k: K, v: PartenaireInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = initial ? "PATCH" : "POST";
      const url = initial ? `/api/admin/partenaires/${initial.id}` : "/api/admin/partenaires";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'enregistrement");
      router.push("/admin/partenaires");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'enregistrement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {initial ? "Enregistrer" : "Créer"}
        </Button>
      </div>

      <div>
        <Label htmlFor="nom">Nom</Label>
        <Input id="nom" value={form.nom as string} onChange={(e) => set("nom", e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="url">Lien (site web)</Label>
        <Input id="url" type="url" value={(form.url as string) ?? ""} onChange={(e) => set("url", e.target.value)} placeholder="https://…" />
      </div>

      <div>
        <Label htmlFor="ordre">Ordre</Label>
        <Input id="ordre" type="number" value={form.ordre as number} onChange={(e) => set("ordre", Number(e.target.value))} />
      </div>

      <div>
        <Label>Logo</Label>
        <ImageUpload
          value={(form.logo_url as string) ?? ""}
          onChange={(u) => set("logo_url", u)}
          path="partenaires"
          label="Logo du partenaire"
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={form.published as boolean} onCheckedChange={(v) => set("published", v)} id="published" />
        <Label htmlFor="published" className="mb-0">Publié</Label>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
    </form>
  );
}
