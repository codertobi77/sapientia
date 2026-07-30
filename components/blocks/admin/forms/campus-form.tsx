"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/blocks/admin/image-upload";
import type { AdminCampus, CampusInput } from "@/lib/data-admin";

export function CampusForm({ initial }: { initial?: AdminCampus }) {
  const router = useRouter();
  const [form, setForm] = React.useState({
    ville: initial?.ville ?? "",
    adresse: initial?.adresse ?? "",
    telephone: initial?.telephone ?? "",
    email: initial?.email ?? "",
    lat: initial?.latitude != null ? String(initial.latitude) : "",
    lng: initial?.longitude != null ? String(initial.longitude) : "",
    image_url: initial?.image_url ?? "",
    description: initial?.description ?? "",
    ordre: initial?.ordre ?? 0,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload: CampusInput = {
        ville: form.ville,
        adresse: form.adresse || null,
        telephone: form.telephone || null,
        email: form.email || null,
        latitude: form.lat === "" ? null : Number(form.lat),
        longitude: form.lng === "" ? null : Number(form.lng),
        image_url: form.image_url || null,
        description: form.description || null,
        ordre: form.ordre,
      };
      if (payload.latitude != null && Number.isNaN(payload.latitude)) throw new Error("Latitude invalide");
      if (payload.longitude != null && Number.isNaN(payload.longitude)) throw new Error("Longitude invalide");

      const method = initial ? "PATCH" : "POST";
      const url = initial ? `/api/admin/campus/${initial.id}` : "/api/admin/campus";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'enregistrement");
      router.push("/admin/campus");
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
        <Label htmlFor="ville">Ville</Label>
        <Input id="ville" value={form.ville} onChange={(e) => set("ville", e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="adresse">Adresse</Label>
        <Textarea id="adresse" value={form.adresse} onChange={(e) => set("adresse", e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input id="telephone" value={form.telephone} onChange={(e) => set("telephone", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="lat">Latitude</Label>
          <Input id="lat" type="number" step="any" value={form.lat} onChange={(e) => set("lat", e.target.value)} placeholder="Ex : 6.4969" />
        </div>
        <div>
          <Label htmlFor="lng">Longitude</Label>
          <Input id="lng" type="number" step="any" value={form.lng} onChange={(e) => set("lng", e.target.value)} placeholder="Ex : 2.6286" />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <div>
        <Label htmlFor="ordre">Ordre</Label>
        <Input id="ordre" type="number" value={form.ordre} onChange={(e) => set("ordre", Number(e.target.value))} />
      </div>

      <div>
        <Label>Image</Label>
        <ImageUpload
          value={form.image_url}
          onChange={(u) => set("image_url", u)}
          path="campus"
          label="Image du campus"
        />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
    </form>
  );
}
