"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/blocks/admin/image-upload";
import type { AdminGalerieItem, GalerieItemInput } from "@/lib/data-admin";

export function GalerieForm({ initial }: { initial?: AdminGalerieItem }) {
  const router = useRouter();
  const [form, setForm] = React.useState<GalerieItemInput>({
    titre: initial?.titre ?? "",
    type: initial?.type ?? "PHOTO",
    url: initial?.url ?? "",
    vignette_url: initial?.vignette_url ?? "",
    categorie: initial?.categorie ?? "CAMPUS",
    date: initial?.date ?? new Date().toISOString().slice(0, 10),
    ordre: initial?.ordre ?? 0,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const set = <K extends keyof GalerieItemInput>(k: K, v: GalerieItemInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const isPhoto = form.type === "PHOTO";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = initial ? "PATCH" : "POST";
      const url = initial ? `/api/admin/galerie/${initial.id}` : "/api/admin/galerie";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'enregistrement");
      router.push("/admin/galerie");
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
          <Label htmlFor="titre">Titre</Label>
          <Input id="titre" value={(form.titre as string) ?? ""} onChange={(e) => set("titre", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select id="type" value={form.type as string} onChange={(e) => set("type", e.target.value as GalerieItemInput["type"])}>
            <option value="PHOTO">Photo</option>
            <option value="VIDEO">Vidéo</option>
          </Select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="categorie">Catégorie</Label>
          <Select id="categorie" value={form.categorie as string} onChange={(e) => set("categorie", e.target.value as GalerieItemInput["categorie"])}>
            <option value="CAMPUS">Campus</option>
            <option value="PEDAGOGIQUE">Pédagogique</option>
            <option value="DIPLOMES">Diplômes</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={form.date as string} onChange={(e) => set("date", e.target.value)} />
        </div>
      </div>

      <div>
        <Label htmlFor="ordre">Ordre</Label>
        <Input id="ordre" type="number" value={form.ordre as number} onChange={(e) => set("ordre", Number(e.target.value))} />
      </div>

      <div>
        <Label>{isPhoto ? "Image" : "URL de la vidéo"}</Label>
        {isPhoto ? (
          <ImageUpload
            value={(form.url as string) ?? ""}
            onChange={(u) => set("url", u)}
            path="galerie"
            label="Photo"
          />
        ) : (
          <Input
            value={(form.url as string) ?? ""}
            onChange={(e) => set("url", e.target.value)}
            placeholder="URL de la vidéo (YouTube, mp4…)"
            required
          />
        )}
      </div>

      {form.type === "VIDEO" && (
        <div>
          <Label>Vignette</Label>
          <ImageUpload
            value={(form.vignette_url as string) ?? ""}
            onChange={(u) => set("vignette_url", u)}
            path="galerie"
            label="Vignette de la vidéo"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
    </form>
  );
}
