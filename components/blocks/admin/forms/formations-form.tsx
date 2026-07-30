"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/blocks/admin/switch";
import type { AdminFormation, FormationInput } from "@/lib/data-admin";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function FormationsForm({ initial }: { initial?: AdminFormation }) {
  const router = useRouter();
  const [form, setForm] = React.useState<FormationInput>({
    slug: initial?.slug ?? "",
    titre: initial?.titre ?? "",
    description: initial?.description ?? "",
    objectifs: initial?.objectifs ?? "",
    debouches: initial?.debouches ?? "",
    conditions_admission: initial?.conditions_admission ?? "",
    modalites_inscription: initial?.modalites_inscription ?? "",
    type: initial?.type ?? "LES_DEUX",
    icone: initial?.icone ?? "",
    ordre: initial?.ordre ?? 0,
    published: initial?.published ?? true,
  });
  const [slugTouched, setSlugTouched] = React.useState(!!initial);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const set = <K extends keyof FormationInput>(k: K, v: FormationInput[K]) =>
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
      const url = initial ? `/api/admin/formations/${initial.id}` : "/api/admin/formations";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'enregistrement");
      router.push("/admin/formations");
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

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={form.description as string} onChange={(e) => set("description", e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="objectifs">Objectifs</Label>
          <Textarea id="objectifs" value={form.objectifs as string} onChange={(e) => set("objectifs", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="debouches">Débouchés</Label>
          <Textarea id="debouches" value={form.debouches as string} onChange={(e) => set("debouches", e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="conditions_admission">Conditions d'admission</Label>
          <Textarea id="conditions_admission" value={form.conditions_admission as string} onChange={(e) => set("conditions_admission", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="modalites_inscription">Modalités d'inscription</Label>
          <Textarea id="modalites_inscription" value={form.modalites_inscription as string} onChange={(e) => set("modalites_inscription", e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select id="type" value={form.type as string} onChange={(e) => set("type", e.target.value as FormationInput["type"])}>
            <option value="PRESENTIEL">Présentiel</option>
            <option value="DISTANCE">Distance</option>
            <option value="LES_DEUX">Les deux</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="icone">Icône</Label>
          <Input id="icone" value={form.icone as string} onChange={(e) => set("icone", e.target.value)} placeholder="book-open, sigma…" />
        </div>
        <div>
          <Label htmlFor="ordre">Ordre</Label>
          <Input
            id="ordre"
            type="number"
            value={form.ordre as number}
            onChange={(e) => set("ordre", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={form.published as boolean} onCheckedChange={(v) => set("published", v)} id="published" />
        <Label htmlFor="published" className="mb-0">Publié</Label>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
    </form>
  );
}
