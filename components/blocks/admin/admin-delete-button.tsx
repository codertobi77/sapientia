"use client";

import * as React from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Bouton de suppression (Client) pour les listes admin. Demande confirmation,
 * appelle DELETE sur l'API admin, puis rafraîchit la route.
 */
export function AdminDeleteButton({
  apiPath,
  id,
  label = "Supprimer",
  confirm = "Confirmer la suppression ?",
}: {
  apiPath: string; // ex: "/api/admin/formations"
  id: string;
  label?: string;
  confirm?: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");
  const router = useRouter();

  async function del() {
    if (!window.confirm(confirm)) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Échec de la suppression" }));
        throw new Error(data.error ?? "Échec de la suppression");
      }
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Échec de la suppression");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={del}
        disabled={loading}
        aria-label={label}
        className="text-red-600 hover:bg-red-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        <span className="sr-only">{label}</span>
      </Button>
      {err && <span className="text-xs text-red-600">{err}</span>}
    </span>
  );
}
