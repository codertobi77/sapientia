import { FileText, ExternalLink } from "lucide-react";

function publicDocumentUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/storage/v1/object/public/documents/${clean}`;
}

function fileName(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1] || path;
}

export function DocumentList({ paths }: { paths: string[] | null }) {
  const docs = (paths ?? []).filter(Boolean);
  if (docs.length === 0) {
    return (
      <p className="text-sm text-muted">Aucune pièce jointe fournie.</p>
    );
  }
  return (
    <ul className="space-y-2">
      {docs.map((p, idx) => (
        <li key={`${p}-${idx}`}>
          <a
            href={publicDocumentUrl(p)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm text-navy hover:border-navy/30 transition-colors"
          >
            <FileText className="h-4 w-4 text-gold" />
            <span className="truncate max-w-xs">{fileName(p)}</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted" />
          </a>
        </li>
      ))}
    </ul>
  );
}
