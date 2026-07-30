"use client";

import * as React from "react";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Upload d'image pour le back-office. POST FormData vers /api/admin/upload
 * (route possédée par admin-content-crud) ; reçoit { url } et appelle
 * onChange(url).
 *
 * Le navigateur admin n'a jamais la service role key : l'upload transite par
 * une route API serveur. Tant que la route n'est pas mergée (crurd sibling),
 * ce composant compile car l'URL est un string ; l'upload échouera simplement
 * à l'exécution (404) tant que la route n'existe pas.
 *
 * Props :
 * - value : URL courante (prévisualisation si déjà renseignée).
 * - onChange(url) : remonte la nouvelle URL publique.
 * - bucket : nom du bucket cible (envoyé au serveur dans le FormData) ; par
 *   défaut "medias".
 * - accept, maxSizeBytes : validation client (le serveur doit revalider).
 * - className.
 */
export function ImageUpload({
  value,
  onChange,
  bucket = "medias",
  accept = "image/*",
  maxSizeBytes = 5 * 1024 * 1024,
  className,
  label = "Importer une image",
}: {
  value?: string | null;
  onChange: (url: string) => void;
  bucket?: string;
  accept?: string;
  maxSizeBytes?: number;
  className?: string;
  label?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = React.useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

  async function uploadFile(file: File) {
    if (file.size > maxSizeBytes) {
      setError("Le fichier dépasse la taille maximale autorisée.");
      setStatus("error");
      return;
    }
    setStatus("uploading");
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", bucket);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Upload échoué (${res.status})`);
      }
      const data = (await res.json()) as { url?: string; error?: string };
      if (!data.url) throw new Error(data.error || "Réponse sans URL.");
      onChange(data.url);
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Upload échoué.");
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  }

  const preview = value || null;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "flex items-center gap-4 rounded-2xl border-2 border-dashed p-4 transition-colors",
          dragOver ? "border-navy bg-navy-50" : "border-border bg-cream/30",
        )}
      >
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white">
          {preview ? (
            // URL vient du bucket public Storage via la route serveur.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Aperçu" className="h-full w-full object-cover" />
          ) : (
            <Upload className="h-6 w-6 text-muted" aria-hidden />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={onPick}
            disabled={status === "uploading"}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === "uploading"}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {status === "uploading" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="h-4 w-4" aria-hidden />
            )}
            {label}
          </button>
          {preview ? (
            <div className="mt-2 flex items-center gap-2">
              <code className="truncate rounded bg-navy-50 px-2 py-1 text-xs text-navy">
                {preview}
              </code>
              <button
                type="button"
                aria-label="Retirer l'image"
                onClick={() => onChange("")}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-navy-50 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted">
              Glissez une image ici ou cliquez pour parcourir. Max 5 Mo.
            </p>
          )}
        </div>
      </div>

      {status === "error" && error ? (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}
