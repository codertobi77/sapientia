"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { NavItem } from "@/lib/site-defaults";

export function SettingsNavForm({ initial }: { initial: NavItem[] }) {
  const router = useRouter();
  const [items, setItems] = React.useState<NavItem[]>(initial);
  const [loading, setLoading] = React.useState(false);
  const [ok, setOk] = React.useState("");
  const [error, setError] = React.useState("");

  function update(i: number, patch: Partial<NavItem>) {
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    setItems((arr) => arr.filter((_, idx) => idx !== i));
  }
  function add() {
    setItems((arr) => [...arr, { label: "", href: "/" }]);
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
        body: JSON.stringify({ section: "nav", value: items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'enregistrement");
      setOk("Menu de navigation enregistré.");
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
        <h2 className="text-lg font-semibold text-navy">Menu de navigation</h2>
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
        Liens du menu public (en-tête). Utilisez un chemin interne (ex : <code>/formations</code>) ou une URL
        absolue (ex : <code>https://...</code>) pour un lien externe.
      </p>

      <div className="space-y-3">
        {items.map((it, i) => (
          <div
            key={i}
            className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-end rounded-2xl border border-border bg-white p-4"
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
              <Label htmlFor={`nav-${i}-label`}>Libellé</Label>
              <Input
                id={`nav-${i}-label`}
                value={it.label}
                onChange={(e) => update(i, { label: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor={`nav-${i}-href`}>Lien</Label>
              <Input
                id={`nav-${i}-href`}
                value={it.href}
                onChange={(e) => update(i, { href: e.target.value })}
                placeholder="/formations"
                required
              />
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
            Aucun lien. Cliquez sur « Ajouter ».
          </p>
        )}
      </div>

      {ok && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3">{ok}</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
    </form>
  );
}
