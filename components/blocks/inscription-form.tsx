"use client";

import { useState } from "react";
import {
  Loader2,
  CheckCircle2,
  UploadCloud,
  X,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  User,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Formation } from "@/lib/data";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Formation", icon: GraduationCap },
  { id: 2, label: "Vos informations", icon: User },
  { id: 3, label: "Pièces justificatives", icon: FileText },
  { id: 4, label: "Validation", icon: ShieldCheck },
];

export function InscriptionForm({
  formations,
  preselectedFormation,
  preselectedType,
}: {
  formations: Formation[];
  preselectedFormation?: string;
  preselectedType?: "PRESENTIEL" | "DISTANCE";
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    formation_id: preselectedFormation ?? "",
    type_formation: preselectedType ?? "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    date_naissance: "",
    adresse: "",
    niveau: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const supabase = createClient();

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function toggleFile(file: File) {
    setFiles((prev) =>
      prev.some((f) => f.name === file.name && f.size === file.size)
        ? prev.filter((f) => !(f.name === file.name && f.size === file.size))
        : [...prev, file],
    );
  }

  const canNext = () => {
    if (step === 1) return !!form.formation_id && !!form.type_formation;
    if (step === 2) return form.nom && form.prenom && form.email.length > 3;
    return true;
  };

  async function uploadFiles(): Promise<string[]> {
    if (files.length === 0) return [];
    const paths: string[] = [];
    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const path = `inscriptions/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
      const { error: upErr } = await supabase.storage.from("documents").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (upErr) throw new Error("Téléversement impossible : " + upErr.message);
      const { data } = supabase.storage.from("documents").getPublicUrl(path);
      paths.push(data.publicUrl);
    }
    return paths;
  }

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      setUploading(true);
      const documents_paths = await uploadFiles();
      setUploading(false);
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, documents_paths }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'enregistrement.");
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
      setUploading(false);
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-navy-50 border border-border p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-gold mx-auto mb-4" />
        <h3 className="font-display text-2xl font-bold text-navy">Inscription envoyée !</h3>
        <p className="mt-3 text-slate max-w-md mx-auto">
          Nous avons bien reçu votre demande. Un e-mail de confirmation vous a été envoyé. Notre
          équipe reviendra vers vous pour la suite de votre dossier.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Stepper */}
      <div className="flex items-center justify-between mb-10">
        {STEPS.map((s, i) => {
          const active = step === s.id;
          const completed = step > s.id;
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors",
                    completed && "bg-gold border-gold text-navy",
                    active && "bg-navy border-navy text-white",
                    !active && !completed && "bg-white border-border text-muted",
                  )}
                >
                  {completed ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold hidden sm:block",
                    active || completed ? "text-navy" : "text-muted",
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 rounded-full transition-colors",
                    step > s.id ? "bg-gold" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Étape 1 : Formation */}
      {step === 1 && (
        <div className="space-y-5 animate-fade-in">
          <div>
            <Label htmlFor="formation_id">Choisissez votre formation</Label>
            <Select
              id="formation_id"
              value={form.formation_id}
              onChange={(e) => set("formation_id", e.target.value)}
            >
              <option value="">— Sélectionnez une filière —</option>
              {formations.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.titre}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="type_formation">Type de formation</Label>
            <Select
              id="type_formation"
              value={form.type_formation}
              onChange={(e) => set("type_formation", e.target.value)}
            >
              <option value="">— Sélectionnez un type —</option>
              <option value="PRESENTIEL">En présentiel</option>
              <option value="DISTANCE">À distance (e-learning)</option>
            </Select>
          </div>
        </div>
      )}

      {/* Étape 2 : Informations */}
      {step === 2 && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" value={form.nom} onChange={(e) => set("nom", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" value={form.prenom} onChange={(e) => set("prenom", e.target.value)} required />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" value={form.telephone} onChange={(e) => set("telephone", e.target.value)} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="date_naissance">Date de naissance</Label>
              <Input id="date_naissance" type="date" value={form.date_naissance} onChange={(e) => set("date_naissance", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="niveau">Niveau actuel</Label>
              <Input id="niveau" value={form.niveau} onChange={(e) => set("niveau", e.target.value)} placeholder="Ex : Bac, Licence 2" />
            </div>
          </div>
          <div>
            <Label htmlFor="adresse">Adresse</Label>
            <Textarea id="adresse" value={form.adresse} onChange={(e) => set("adresse", e.target.value)} />
          </div>
        </div>
      )}

      {/* Étape 3 : Pièces */}
      {step === 3 && (
        <div className="space-y-5 animate-fade-in">
          <p className="text-slate">
            Ajoutez vos pièces justificatives (pièce d'identité, diplôme, photo). Format PDF, JPG
            ou PNG — 5 Mo max par fichier.
          </p>
          <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-10 cursor-pointer hover:border-gold transition-colors">
            <UploadCloud className="h-10 w-10 text-muted mb-3" />
            <p className="text-navy font-semibold">Cliquez pour téléverser des fichiers</p>
            <p className="text-sm text-muted">ou glissez-déposez ici</p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const list = e.target.files;
                if (!list) return;
                Array.from(list).forEach(toggleFile);
                e.target.value = "";
              }}
            />
          </label>

          {files.length > 0 && (
            <ul className="space-y-2">
              {files.map((f) => (
                <li key={f.name + f.size} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                  <span className="flex items-center gap-2 text-sm text-navy truncate">
                    <FileText className="h-4 w-4 text-gold shrink-0" />
                    <span className="truncate">{f.name}</span>
                    <span className="text-muted">({Math.round(f.size / 1024)} Ko)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleFile(f)}
                    className="text-muted hover:text-red-600"
                    aria-label={`Retirer ${f.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Étape 4 : Validation */}
      {step === 4 && (
        <div className="space-y-5 animate-fade-in">
          <h3 className="font-display text-lg font-bold text-navy">Vérifiez vos informations</h3>
          <dl className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
            <Row label="Formation">
              {formations.find((f) => f.id === form.formation_id)?.titre ?? "—"}
            </Row>
            <Row label="Type de formation">
              {form.type_formation === "PRESENTIEL" ? "En présentiel" : form.type_formation === "DISTANCE" ? "À distance" : "—"}
            </Row>
            <Row label="Nom">{form.nom}</Row>
            <Row label="Prénom">{form.prenom}</Row>
            <Row label="E-mail">{form.email}</Row>
            <Row label="Téléphone">{form.telephone || "—"}</Row>
            <Row label="Date de naissance">{form.date_naissance || "—"}</Row>
            <Row label="Niveau">{form.niveau || "—"}</Row>
            <Row label="Adresse">{form.adresse || "—"}</Row>
            <Row label="Pièces jointes">{files.length} fichier(s)</Row>
          </dl>
        </div>
      )}

      {error && (
        <p className="mt-5 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 1 ? (
          <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={submitting}>
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>
        ) : (
          <span />
        )}

        {step < 4 ? (
          <Button type="button" variant="primary" onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
            Continuer
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" variant="primary" onClick={submit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {uploading ? "Téléversement..." : "Envoi..."}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Valider mon inscription
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 bg-white">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-semibold text-navy text-right">{children}</dd>
    </div>
  );
}
