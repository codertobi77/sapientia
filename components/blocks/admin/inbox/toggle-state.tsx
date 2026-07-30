"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  /** Path of the API endpoint (without id); e.g. "messages" or "newsletter". */
  resource: "messages" | "newsletter" | "users";
  /** Body shape: which boolean field to PATCH. */
  field: "lu" | "desinscrit" | "actif";
  initialValue: boolean;
  activeLabel: string;
  inactiveLabel: string;
};

export function ToggleState({
  id,
  resource,
  field,
  initialValue,
  activeLabel,
  inactiveLabel,
}: Props) {
  const router = useRouter();
  const [value, setValue] = React.useState(initialValue);
  const [pending, setPending] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function toggle() {
    setPending(true);
    setErr(null);
    const next = !value;
    try {
      const res = await fetch(`/api/admin/${resource}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Échec");
      }
      setValue(next);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={value}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
        value
          ? "bg-navy text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
      title={err ?? undefined}
    >
      <span
        aria-hidden
        className={`h-2 w-2 rounded-full ${value ? "bg-gold" : "bg-slate-400"}`}
      />
      {value ? activeLabel : inactiveLabel}
      {pending ? "…" : ""}
    </button>
  );
}
