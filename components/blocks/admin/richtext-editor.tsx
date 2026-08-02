"use client";

import * as React from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link2,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  RemoveFormatting,
  ImagePlus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Éditeur richtext léger basé sur contentEditable + document.execCommand.
 * Stocke du HTML (actualites.contenu). Aucune dépendance externe.
 *
 * Corrigé vs la version précédente :
 *  - suivi de l'état actif des boutons (gras/italique/…) via
 *    `document.queryCommandState` rafraîchi à chaque changement de sélection
 *    (event `selectionchange`) : on sait donc si le gras est actif ou non au
 *    pointeur, et le bouton reflète vraiment l'état courant ;
 *  - l'apply par erreur ne nécessite plus Ctrl+Z : un second clic désactive ;
 *  - outils enrichis (H1/H2/H3, souligné, barré, alignement, undo/redo,
 *    nettoyage de formatage) ;
 *  - insertion d'images inline via la route /api/admin/upload (bucket medias).
 *
 * Le HTML produit est contrôlé via `value` / `onChange` (le parent gère
 * l'état). On resync le DOM via ref quand `value` change de l'extérieur
 * (ex: édition d'un enregistrement existant) sans perdre le focus.
 */

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  id?: string;
  /** Dossier de stockage pour les images insérées (ex: 'actualites-content'). */
  imagePath?: string;
}

type ToggleCmd =
  | "bold"
  | "italic"
  | "underline"
  | "strikeThrough"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "justifyLeft"
  | "justifyCenter"
  | "justifyRight";

const TOGGLE_CMDS: ToggleCmd[] = [
  "bold",
  "italic",
  "underline",
  "strikeThrough",
  "insertUnorderedList",
  "insertOrderedList",
  "justifyLeft",
  "justifyCenter",
  "justifyRight",
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Rédigez votre contenu…",
  id,
  imagePath = "actualites-content",
}: RichTextEditorProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const lastEmitted = React.useRef<string>(value);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const savedRange = React.useRef<Range | null>(null);

  const [active, setActive] = React.useState<Record<string, boolean>>({});
  const [block, setBlock] = React.useState<string>("");
  const [uploading, setUploading] = React.useState(false);

  // Initialise / resync le contenu quand value change de l'extérieur.
  React.useEffect(() => {
    const el = ref.current;
    if (el && value !== el.innerHTML && value !== lastEmitted.current) {
      el.innerHTML = value || "";
      lastEmitted.current = value;
      refreshState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Rafraîchit l'état actif des boutons selon la sélection courante.
  const refreshState = React.useCallback(() => {
    if (typeof document === "undefined") return;
    const next: Record<string, boolean> = {};
    for (const c of TOGGLE_CMDS) {
      try {
        next[c] = document.queryCommandState(c);
      } catch {
        next[c] = false;
      }
    }
    setActive(next);
    try {
      setBlock(String(document.queryCommandValue("formatBlock")).toLowerCase());
    } catch {
      setBlock("");
    }
  }, []);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const handler = () => {
      const el = ref.current;
      if (el && document.activeElement === el) refreshState();
    };
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, [refreshState]);

  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection() {
    const sel = window.getSelection();
    const el = ref.current;
    if (el && sel && savedRange.current) {
      el.focus();
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  }

  function exec(command: string, arg?: string) {
    ref.current?.focus();
    restoreSelection();
    document.execCommand(command, false, arg);
    emit();
    refreshState();
  }

  function setBlockTag(tag: string) {
    saveSelection();
    exec("formatBlock", tag);
  }

  function addLink() {
    saveSelection();
    const url = window.prompt("URL du lien (https://…)");
    if (url) {
      exec("createLink", url);
      normalizeNewLinks();
      emit();
    }
  }

  function normalizeNewLinks() {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll("a[href]").forEach((a) => {
      if (!a.getAttribute("target")) a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });
  }

  function clearFormatting() {
    saveSelection();
    exec("removeFormat");
    exec("formatBlock", "<p>");
  }

  async function insertImage(file: File) {
    saveSelection();
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "medias");
      fd.append("path", imagePath);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'upload");
      const url = String(data.url);
      const html = `<img src="${url}" alt="" style="max-width:100%;height:auto;border-radius:0.75rem;margin:0.5rem 0;" />`;
      ref.current?.focus();
      restoreSelection();
      document.execCommand("insertHTML", false, html);
      emit();
    } catch {
      // Silencieux : l'admin réessaiera.
    } finally {
      setUploading(false);
    }
  }

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) void insertImage(f);
    e.target.value = "";
  }

  function emit() {
    const html = ref.current?.innerHTML ?? "";
    lastEmitted.current = html;
    onChange(html);
  }

  function activeBlock(tag: string) {
    return block === tag;
  }

  function btn(
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
    isActive: boolean,
  ) {
    return (
      <button
        type="button"
        title={label}
        aria-label={label}
        aria-pressed={isActive}
        onMouseDown={(e) => {
          e.preventDefault();
          saveSelection();
          onClick();
        }}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy transition-colors",
          isActive ? "bg-navy text-white hover:bg-navy" : "hover:bg-navy-50",
        )}
      >
        {icon}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/10">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5 bg-cream">
        <BtnGroup>
          {btn("Annuler", <Undo2 className="h-4 w-4" />, () => exec("undo"), false)}
          {btn("Rétablir", <Redo2 className="h-4 w-4" />, () => exec("redo"), false)}
        </BtnGroup>

        <Divider />

        <BtnGroup>
          {btn("Titre 1", <Heading1 className="h-4 w-4" />, () => setBlockTag("<h1>"), activeBlock("h1"))}
          {btn("Titre 2", <Heading2 className="h-4 w-4" />, () => setBlockTag("<h2>"), activeBlock("h2"))}
          {btn("Titre 3", <Heading3 className="h-4 w-4" />, () => setBlockTag("<h3>"), activeBlock("h3"))}
          {btn("Paragraphe", <span className="text-xs font-semibold">¶</span>, () => setBlockTag("<p>"), activeBlock("p"))}
        </BtnGroup>

        <Divider />

        <BtnGroup>
          {btn("Gras", <Bold className="h-4 w-4" />, () => exec("bold"), !!active.bold)}
          {btn("Italique", <Italic className="h-4 w-4" />, () => exec("italic"), !!active.italic)}
          {btn("Souligné", <Underline className="h-4 w-4" />, () => exec("underline"), !!active.underline)}
          {btn("Barré", <Strikethrough className="h-4 w-4" />, () => exec("strikeThrough"), !!active.strikeThrough)}
        </BtnGroup>

        <Divider />

        <BtnGroup>
          {btn("Liste à puces", <List className="h-4 w-4" />, () => exec("insertUnorderedList"), !!active.insertUnorderedList)}
          {btn("Liste numérotée", <ListOrdered className="h-4 w-4" />, () => exec("insertOrderedList"), !!active.insertOrderedList)}
          {btn("Citation", <Quote className="h-4 w-4" />, () => setBlockTag("<blockquote>"), activeBlock("blockquote"))}
          {btn("Lien", <Link2 className="h-4 w-4" />, addLink, false)}
        </BtnGroup>

        <Divider />

        <BtnGroup>
          {btn("Aligner à gauche", <AlignLeft className="h-4 w-4" />, () => exec("justifyLeft"), !!active.justifyLeft)}
          {btn("Centrer", <AlignCenter className="h-4 w-4" />, () => exec("justifyCenter"), !!active.justifyCenter)}
          {btn("Aligner à droite", <AlignRight className="h-4 w-4" />, () => exec("justifyRight"), !!active.justifyRight)}
        </BtnGroup>

        <Divider />

        <BtnGroup>
          {btn("Effacer le formatage", <RemoveFormatting className="h-4 w-4" />, clearFormatting, false)}
          {btn(
            "Insérer une image",
            uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />,
            () => fileInputRef.current?.click(),
            false,
          )}
        </BtnGroup>
      </div>

      <div
        id={id}
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onFocus={refreshState}
        onInput={emit}
        onBlur={emit}
        onKeyUp={refreshState}
        onMouseUp={refreshState}
        data-placeholder={placeholder}
        className={cn(
          "prose prose-slate prose-sm max-w-none min-h-48 p-4 outline-none",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:text-muted [&_blockquote]:italic",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-navy [&_h1]:mt-4 [&_h1]:mb-2",
          "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mt-3 [&_h2]:mb-2",
          "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-navy [&_h3]:mt-2 [&_h3]:mb-1",
          "[&_a]:text-gold [&_a]:underline",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
          "[&_img]:rounded-xl [&_img]:my-2",
        )}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPickImage}
      />
      <style>{`
        [contenteditable][data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #64748b;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

function BtnGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function Divider() {
  return <span className="mx-1 h-6 w-px bg-border" aria-hidden="true" />;
}
