"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";

type Kind = "inscriptions" | "devis" | "messages";

type Props = {
  id: string;
  kind: Kind;
  /** Objet pré-rempli suggéré */
  defaultObjet?: string;
  /** Message pré-rempli suggéré */
  defaultMessage?: string;
};

export function EmailForm({ id, kind, defaultObjet, defaultMessage }: Props) {
  const [objet, setObjet] = React.useState(defaultObjet ?? "");
  const [message, setMessage] = React.useState(defaultMessage ?? "");
  const [sending, setSending] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  async function onSend() {
    setSending(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/${kind}/${id}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objet: objet.trim(), message: message.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Échec de l'envoi");
      }
      setMsg("E-mail envoyé.");
      setMessage("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="objet">Objet</Label>
        <Input
          id="objet"
          value={objet}
          onChange={(e) => setObjet(e.target.value)}
          placeholder="Sujet de l'e-mail"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Votre réponse à l'étudiant / destinataire…"
          className="min-h-40"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={onSend} disabled={sending || !objet.trim() || !message.trim()} size="sm">
          {sending ? "Envoi…" : "Envoyer l'e-mail"}
        </Button>
        {msg && <p className="text-sm text-navy">{msg}</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>
    </div>
  );
}
