"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Stat } from "@/lib/site-defaults";

const ICON_OPTIONS = [
  { value: "student", label: "Étudiant" },
  { value: "graduation", label: "Diplôme" },
  { value: "book", label: "Livre" },
  { value: "map", label: "Carte" },
  { value: "pin", label: "Repère" },
  { value: "users", label: "Groupe" },
  { value: "award", label: "Récompense" },
];

export function SettingsStatsForm({ initial }: { initial: Stat[] }) {
  const router = useRouter();
  const [items, setItems] = React.useState<Stat[]>(initial);
  const [loading, setLoading] = React.useState(false);
  const [ok, setOk] = React.useState("");
  const [error, setError] = React.useState("");

  function update(i: number, patch: Partial<Stat>) {
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    setItems((arr) => arr.filter((_, idx) => idx !== i));
  }
  function add() {
    setItems((arr) => [
      ...arr,
      { value: "", label: "", icon: ICON_OPTIONS[0].value },
    ]);
  }
  function move(i: number, dir: -1 | 1) {
    setItems((arr) => {
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      const next = [...arr];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOk("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "stats", value: items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'enregistrement");
      setOk("Chiffres clés enregistrés.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'enregistrement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy">Chiffres clés</h2>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={add}>
            <Plus className="h-4 w-4" /> Ajouter
          </Button>
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Enregistrer
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted">
        Affichés dans la bande flottante et la page « Qui sommes-nous ». 1 à 12 éléments recommandés (5 idéalement).
      </p>

      <div className="space-y-3">
        {items.map((it, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-3 items-end rounded-2xl border border-border bg-white p-4"
          >
            <div className="flex flex-col gap-1">
              <Label>{`#${i + 1}`}</Label>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Monter"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Descendre"
                  disabled={i === items.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor={`stat-${i}-value`}>Valeur</Label>
              <Input
                id={`stat-${i}-value`}
                value={it.value}
                onChange={(e) => update(i, { value: e.target.value })}
                placeholder="+500"
                required
              />
            </div>
            <div>
              <Label htmlFor={`stat-${i}-label`}>Libellé</Label>
              <Input
                id={`stat-${i}-label`}
                value={it.label}
                onChange={(e) => update(i, { label: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor={`stat-${i}-sublabel`}>Sous-libellé</Label>
              <Input
                id={`stat-${i}-sublabel`}
                value={it.sublabel ?? ""}
                onChange={(e) => update(i, { sublabel: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor={`stat-${i}-icon`}>Icône</Label>
              <Select
                id={`stat-${i}-icon`}
                value={it.icon}
                onChange={(e) => update(i, { icon: e.target.value })}
              >
                {ICON_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Supprimer"
                onClick={() => remove(i)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted rounded-2xl border border-dashed border-border p-6 text-center">
            Aucun chiffre clé. Cliquez sur « Ajouter ».
          </p>
        )}
      </div>

      {ok && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3">{ok}</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
    </form>
  );
}
