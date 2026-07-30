"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/blocks/admin/switch";
import { RichTextEditor } from "@/components/blocks/admin/richtext-editor";
import { ImageUpload } from "@/components/blocks/admin/image-upload";
import { actualiteTypeLabel } from "@/lib/format";
import type { AdminActualite, ActualiteInput } from "@/lib/data-admin";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const TYPES: AdminActualite["type"][] = [
  "EVENEMENT",
  "SEMINAIRE",
  "CONCOURS",
  "PARTENARIAT",
  "NOUVELLE_FORMATION",
  "COMMUNIQUE",
];

export function ActualitesForm({ initial }: { initial?: AdminActualite }) {
  const router = useRouter();
  const [form, setForm] = React.useState<ActualiteInput>({
    slug: initial?.slug ?? "",
    titre: initial?.titre ?? "",
    extrait: initial?.extrait ?? "",
    contenu: initial?.contenu ?? "",
    image_url: initial?.image_url ?? "",
    date: initial?.date ?? new Date().toISOString().slice(0, 10),
    type: initial?.type ?? "COMMUNIQUE",
    published: initial?.published ?? true,
  });
  const [slugTouched, setSlugTouched] = React.useState(!!initial);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const set = <K extends keyof ActualiteInput>(k: K, v: ActualiteInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  function onTitle(v: string) {
    set("titre", v);
    if (!slugTouched) set("slug", slugify(v));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = initial ? "PATCH" : "POST";
      const url = initial ? `/api/admin/actualites/${initial.id}` : "/api/admin/actualites";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'enregistrement");
      router.push("/admin/actualites");
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
          {initial ? "Enregistrer" : "Publier"}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="titre">Titre</Label>
          <Input id="titre" value={form.titre as string} onChange={(e) => onTitle(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug as string}
            onChange={(e) => {
              set("slug", slugify(e.target.value));
              setSlugTouched(true);
            }}
            required
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select id="type" value={form.type as string} onChange={(e) => set("type", e.target.value as ActualiteInput["type"])}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {actualiteTypeLabel(t)}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={form.date as string} onChange={(e) => set("date", e.target.value)} />
        </div>
      </div>

      <div>
        <Label htmlFor="extrait">Extrait</Label>
        <Textarea id="extrait" value={form.extrait as string} onChange={(e) => set("extrait", e.target.value)} placeholder="Résumé court affiché dans les listes." />
      </div>

      <div>
        <Label htmlFor="contenu">Contenu</Label>
        <RichTextEditor value={form.contenu as string} onChange={(html) => set("contenu", html)} id="contenu" />
      </div>

      <div>
        <Label>Image</Label>
        <ImageUpload
          value={(form.image_url as string) ?? ""}
          onChange={(url) => set("image_url", url)}
          path="actualites"
          label="Image de l'actualité"
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
