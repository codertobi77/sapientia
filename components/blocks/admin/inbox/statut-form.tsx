"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea, Label } from "@/components/ui/input";
import type { DemandeStatut } from "@/lib/data-admin-inbox";

type Props = {
  id: string;
  kind: "inscriptions" | "devis";
  initialStatut: DemandeStatut;
  initialNote: string | null;
};

export function StatutForm({ id, kind, initialStatut, initialNote }: Props) {
  const router = useRouter();
  const [statut, setStatut] = React.useState<DemandeStatut>(initialStatut);
  const [note, setNote] = React.useState(initialNote ?? "");
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  async function onSave() {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/${kind}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut, note_admin: note.trim() || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Échec de l'enregistrement");
      }
      setMsg("Modifications enregistrées.");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 max-w-xs">
        <Label htmlFor="statut">Statut</Label>
        <Select
          id="statut"
          value={statut}
          onChange={(e) => setStatut(e.target.value as DemandeStatut)}
        >
          <option value="EN_ATTENTE">En attente</option>
          <option value="TRAITEE">Traitée</option>
          <option value="REFUSEE">Refusée</option>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="note">Note interne (admin)</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Remarques, suivi du dossier…"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={onSave} disabled={saving} size="sm">
          {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
        {msg && <p className="text-sm text-navy">{msg}</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>
    </div>
  );
}
