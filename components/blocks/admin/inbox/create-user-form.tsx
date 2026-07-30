"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input, Label } from "@/components/ui/input";
import type { UserRole } from "@/lib/data-admin-inbox";

export function CreateUserForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState<UserRole>("ADMIN");
  const [creating, setCreating] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  async function onCreate() {
    setCreating(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim() || undefined,
          role,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Échec de la création");
      }
      setMsg("Utilisateur créé.");
      setEmail("");
      setPassword("");
      setName("");
      setRole("ADMIN");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="cu-email">E-mail</Label>
        <Input
          id="cu-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="prenom.nom@efes-sapientia.bj"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cu-password">Mot de passe</Label>
        <Input
          id="cu-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Au moins 8 caractères"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cu-name">Nom (optionnel)</Label>
        <Input
          id="cu-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom complet"
        />
      </div>
      <div className="grid gap-2 max-w-xs">
        <Label htmlFor="cu-role">Rôle</Label>
        <Select
          id="cu-role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="ADMIN">Administrateur</option>
          <option value="ENSEIGNANT">Enseignant</option>
          <option value="ETUDIANT">Étudiant</option>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={onCreate}
          disabled={
            creating || !email.trim() || password.length < 8
          }
          size="sm"
        >
          {creating ? "Création…" : "Créer l'utilisateur"}
        </Button>
        {msg && <p className="text-sm text-navy">{msg}</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>
    </div>
  );
}
