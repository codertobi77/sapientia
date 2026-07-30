"use client";

import * as React from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * STUB — admin-foundations doit fournir la version canonique.
 * ---------------------------------------------------------------
 * Widget d'upload d'image pour le back-office. Le navigateur admin n'a
 * JAMAIS la service role key : l'upload passe par la route serveur
 * /api/admin/upload (qui utilise createAdminClient côté serveur).
 *
 * Props :
 *  - value : l'URL publique stockée (ou chaîne vide)
 *  - onChange : appelé avec l'URL publique une fois l'upload réussi
 *  - bucket : bucket cible ('medias' par défaut)
 *  - path : sous-dossier optionnel (ex: 'actualites')
 *  - accept : types MIME acceptés (défaut images)
 */
export interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  path?: string;
  accept?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  bucket = "medias",
  path,
  accept = "image/*",
  label = "Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function onFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", bucket);
      if (path) fd.append("path", path);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'upload");
      onChange(data.url as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-cream text-muted hover:border-gold transition-colors",
            uploading && "opacity-60",
          )}
          aria-label={`Téléverser ${label}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <UploadCloud className="h-7 w-7" />
          )}
        </button>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-navy">{label}</p>
          <p className="text-xs text-muted">Cliquez pour téléverser</p>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="mt-1 inline-flex items-center gap-1 text-xs text-red-600 hover:underline"
            >
              <X className="h-3 w-3" /> Retirer
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {value && (
        <input type="hidden" name="image_url" value={value} />
      )}
    </div>
  );
}
