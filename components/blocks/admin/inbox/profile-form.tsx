"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input, Label } from "@/components/ui/input";
import type { UserRole } from "@/lib/data-admin-inbox";

type Props = {
  id: string;
  initialRole: UserRole;
  initialActif: boolean;
  initialName: string | null;
  initialTelephone: string | null;
};

export function ProfileForm({
  id,
  initialRole,
  initialActif,
  initialName,
  initialTelephone,
}: Props) {
  const router = useRouter();
  const [role, setRole] = React.useState<UserRole>(initialRole);
  const [actif, setActif] = React.useState(initialActif);
  const [name, setName] = React.useState(initialName ?? "");
  const [telephone, setTelephone] = React.useState(initialTelephone ?? "");
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  async function onSave() {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          actif,
          name: name.trim() || null,
          telephone: telephone.trim() || null,
        }),
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
        <Label htmlFor="role">Rôle</Label>
        <Select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="ADMIN">Administrateur</option>
          <option value="ENSEIGNANT">Enseignant</option>
          <option value="ETUDIANT">Étudiant</option>
        </Select>
      </div>

      <div className="grid gap-2 max-w-xs">
        <Label htmlFor="actif">Statut du compte</Label>
        <Select
          id="actif"
          value={actif ? "1" : "0"}
          onChange={(e) => setActif(e.target.value === "1")}
        >
          <option value="1">Actif</option>
          <option value="0">Désactivé</option>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="name">Nom affiché</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom complet"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          id="telephone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          placeholder="Numéro"
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
