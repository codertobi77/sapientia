"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/blocks/admin/switch";
import { ImageUpload } from "@/components/blocks/admin/image-upload";
import type { AdminTemoignage, TemoignageInput } from "@/lib/data-admin";

export function TemoignagesForm({ initial }: { initial?: AdminTemoignage }) {
  const router = useRouter();
  const [form, setForm] = React.useState<TemoignageInput>({
    auteur: initial?.auteur ?? "",
    role: initial?.role ?? "",
    contenu: initial?.contenu ?? "",
    photo_url: initial?.photo_url ?? "",
    ordre: initial?.ordre ?? 0,
    published: initial?.published ?? true,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const set = <K extends keyof TemoignageInput>(k: K, v: TemoignageInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = initial ? "PATCH" : "POST";
      const url = initial ? `/api/admin/temoignages/${initial.id}` : "/api/admin/temoignages";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'enregistrement");
      router.push("/admin/temoignages");
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

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="auteur">Auteur</Label>
          <Input id="auteur" value={form.auteur as string} onChange={(e) => set("auteur", e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="role">Rôle / fonction</Label>
          <Input id="role" value={(form.role as string) ?? ""} onChange={(e) => set("role", e.target.value)} placeholder="Ex : Ancien étudiant, Enseignant…" />
        </div>
      </div>

      <div>
        <Label htmlFor="contenu">Témoignage</Label>
        <Textarea id="contenu" value={form.contenu as string} onChange={(e) => set("contenu", e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="ordre">Ordre</Label>
        <Input id="ordre" type="number" value={form.ordre as number} onChange={(e) => set("ordre", Number(e.target.value))} />
      </div>

      <div>
        <Label>Photo</Label>
        <ImageUpload
          value={(form.photo_url as string) ?? ""}
          onChange={(u) => set("photo_url", u)}
          path="temoignages"
          label="Photo de l'auteur"
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
