"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm text-white">
        <CheckCircle2 className="h-5 w-5 text-gold" />
        Merci ! Votre inscription a bien été prise en compte.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre adresse e-mail"
        className="h-12 flex-1 min-w-0 rounded-xl bg-white px-4 text-base text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        aria-label="S'inscrire à la newsletter"
        className={cn(
          "h-12 w-12 shrink-0 rounded-xl bg-gold text-navy flex items-center justify-center hover:bg-gold-600 transition-colors disabled:opacity-60",
        )}
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
}
